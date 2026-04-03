import { useEffect, useState, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { adsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CAT_EMOJI = { technology:'💻', finance:'🏦', food:'🍔', fashion:'👗', entertainment:'🎬', health:'💊', education:'📚', other:'📢' };

function AdCard({ ad, onWatch, disabled }) {
  return (
    <div className={`card dark:bg-gray-900 dark:border-gray-800 hover:shadow-md transition-all ${ad.alreadyWatchedToday ? 'opacity-55' : 'hover:-translate-y-0.5'}`}>
      <div className="h-28 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: ad.bgColor || '#00baf2' }}>
        <span className="text-5xl">{CAT_EMOJI[ad.category] || '📢'}</span>
        <div className="absolute top-2 right-2 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full">{ad.duration}s</div>
        {ad.alreadyWatchedToday && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-sm font-medium">✅ Watched</span></div>}
      </div>
      <p className="font-semibold text-sm dark:text-white">{ad.title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{ad.brand}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full capitalize">{ad.category}</span>
        <span className="text-primary-500 font-bold text-sm">+{ad.coinReward} 🪙</span>
      </div>
      <button onClick={() => onWatch(ad)} disabled={disabled || ad.alreadyWatchedToday}
        className={`w-full mt-3 py-2.5 rounded-xl text-sm font-semibold transition ${ad.alreadyWatchedToday || disabled ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}>
        {ad.alreadyWatchedToday ? 'Already Watched' : disabled ? 'On Cooldown' : '▶ Watch & Earn'}
      </button>
    </div>
  );
}

function AdPlayer({ ad, onComplete, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(ad.duration);
  const [completed, setCompleted] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setCompleted(true); return; }
    const t = setInterval(() => setTimeLeft(n => n - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const radius = 54, circumference = 2 * Math.PI * radius;
  const progress = ((ad.duration - timeLeft) / ad.duration) * circumference;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl animate-slide-up">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl" style={{ backgroundColor: ad.bgColor }}>{CAT_EMOJI[ad.category] || '📢'}</div>
        <h3 className="font-display font-bold text-base dark:text-white">{ad.title}</h3>
        <p className="text-xs text-gray-400 mb-5">by {ad.brand}</p>
        <div className="relative inline-flex items-center justify-center mb-5">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="60" cy="60" r={radius} fill="none" stroke={completed ? '#10b981' : '#00baf2'} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="absolute">{completed ? <span className="text-3xl">✅</span> : <><p className="font-display text-2xl font-bold dark:text-white">{timeLeft}</p><p className="text-xs text-gray-400">sec</p></>}</div>
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl py-3 px-4 mb-5">
          <p className="text-primary-600 dark:text-primary-400 font-bold text-xl">+{ad.coinReward} 🪙</p>
          <p className="text-primary-400 text-xs">Coin reward for this ad</p>
        </div>
        {!completed ? (
          <div><p className="text-sm text-gray-400 mb-3">Watch fully to earn coins</p><button onClick={onCancel} className="text-gray-400 text-sm underline">Cancel</button></div>
        ) : (
          <button onClick={async () => { setClaiming(true); await onComplete(); setClaiming(false); }} disabled={claiming}
            className="btn-primary w-full text-center rounded-xl">
            {claiming ? 'Crediting...' : `🎉 Claim ${ad.coinReward} Coins`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function WatchAds() {
  const [ads, setAds] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAd, setActiveAd] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const { updateUser } = useAuth();

  const fetchAds = () => {
    adsAPI.getAds().then(({ data }) => {
      setAds(data.ads); setMeta(data.meta);
      if (data.meta.onCooldown && data.meta.cooldownEnds) {
        const s = Math.ceil((new Date(data.meta.cooldownEnds) - new Date()) / 1000);
        setCooldownLeft(Math.max(0, s));
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAds(); }, []);
  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = setInterval(() => setCooldownLeft(c => { if (c <= 1) { clearInterval(t); fetchAds(); return 0; } return c - 1; }), 1000);
    return () => clearInterval(t);
  }, [cooldownLeft]);

  const handleWatch = async (ad) => {
    try {
      const { data } = await adsAPI.startAd(ad._id);
      setSessionToken(data.sessionToken); setActiveAd(data.ad);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.data?.cooldownSeconds) setCooldownLeft(err.response.data.cooldownSeconds);
      toast.error(msg || 'Cannot start ad');
    }
  };

  const handleComplete = async () => {
    try {
      const { data } = await adsAPI.completeAd(activeAd.id, sessionToken);
      toast.success(data.message);
      updateUser({ coinBalance: data.newBalance });
      setCooldownLeft(data.cooldownSeconds || 30);
      setActiveAd(null);
      fetchAds();
    } catch (err) { toast.error(err.response?.data?.message || 'Error claiming'); }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-slide-up">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold dark:text-white">Watch Ads — Bonus Coins</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Earn 0.5 coins per ad · Optional bonus task</p>
        </div>

        {meta && (
          <div className="card dark:bg-gray-900 dark:border-gray-800 mb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-5">
                {[['Watched', meta.watchedToday], ['Remaining', meta.remaining], ['Daily Limit', meta.dailyLimit]].map(([l, v]) => (
                  <div key={l} className="text-center"><p className="font-display font-bold text-xl text-primary-500">{v}</p><p className="text-xs text-gray-400">{l}</p></div>
                ))}
                <div className="text-center"><p className="font-display font-bold text-xl text-green-500">{meta.coinsEarnedToday?.toFixed(1)}</p><p className="text-xs text-gray-400">Coins Today</p></div>
              </div>
              {cooldownLeft > 0 && <span className="badge-yellow px-3 py-2 text-sm">⏳ {cooldownLeft}s cooldown</span>}
              {meta.remaining === 0 && <span className="badge-red px-3 py-2 text-sm">Daily limit reached</span>}
            </div>
            <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div className="bg-primary-500 rounded-full h-2 transition-all" style={{ width: `${(meta.watchedToday / meta.dailyLimit) * 100}%` }} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="card skeleton h-60" />)}</div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16"><p className="text-5xl mb-4">📺</p><p className="font-semibold dark:text-white">No ads available right now</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map(ad => <AdCard key={ad._id} ad={ad} onWatch={handleWatch} disabled={cooldownLeft > 0 || meta?.remaining === 0} />)}
          </div>
        )}
      </div>
      {activeAd && <AdPlayer ad={activeAd} onComplete={handleComplete} onCancel={() => setActiveAd(null)} />}
    </AppLayout>
  );
}
