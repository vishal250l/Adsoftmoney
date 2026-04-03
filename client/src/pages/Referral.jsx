import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Referral() {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    userAPI.getReferralInfo().then(({ data }) => setInfo(data)).finally(() => setLoading(false));
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = `${window.location.origin}/register?ref=${user?.referralCode}`;
  const copyLink = () => { navigator.clipboard.writeText(shareLink); toast.success('Link copied!'); };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <div>
          <h2 className="font-display text-2xl font-bold dark:text-white">Referral Program</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Invite friends, earn coins together</p>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
          <h3 className="font-display font-bold text-lg mb-4">How Referrals Work</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[['1️⃣', 'Share your code', 'Send to friends'], ['2️⃣', 'Friend registers', 'Using your code'], ['3️⃣', 'You earn', '5 coins instantly + 10% commission']].map(([num, title, desc]) => (
              <div key={num}>
                <p className="text-2xl">{num}</p>
                <p className="font-semibold text-sm mt-1">{title}</p>
                <p className="text-orange-100 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral code */}
        <div className="card dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-5 py-4 border-2 border-dashed border-primary-200 dark:border-primary-800 text-center">
              <p className="font-display text-3xl font-bold text-primary-500 tracking-widest">{user?.referralCode || '---'}</p>
            </div>
            <button onClick={copyCode} className={`shrink-0 px-5 py-4 rounded-xl font-semibold text-sm transition ${copied ? 'bg-green-500 text-white' : 'btn-primary'}`}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input value={shareLink} readOnly className="input-field text-xs flex-1" />
            <button onClick={copyLink} className="shrink-0 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition">🔗</button>
          </div>
        </div>

        {/* Earnings summary */}
        <div className="grid grid-cols-3 gap-4">
          {[['👥', 'Friends Invited', info?.referralCount || 0, 'text-orange-500'],
            ['🪙', 'Invite Bonus', `${(info?.referralCount || 0) * 5} coins`, 'text-primary-500'],
            ['💎', 'Commission Earned', loading ? '...' : `${info?.referrals?.reduce((s, r) => s + (r.commissionEarned || 0), 0).toFixed(2) || 0} 🪙`, 'text-purple-500']
          ].map(([icon, label, value, color]) => (
            <div key={label} className="card dark:bg-gray-900 dark:border-gray-800 text-center">
              <p className="text-2xl">{icon}</p>
              <p className={`font-display text-xl font-bold mt-1 ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Referral list */}
        <div className="card dark:bg-gray-900 dark:border-gray-800">
          <h3 className="font-semibold dark:text-white mb-4">Friends You Invited ({info?.referrals?.length || 0})</h3>
          {loading ? <div className="space-y-2">{[1,2].map(i => <div key={i} className="skeleton h-12 rounded" />)}</div> :
            info?.referrals?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-2">📨</p>
                <p className="text-gray-400 text-sm">No referrals yet. Share your code!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {info.referrals.map(r => (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-500 font-bold text-sm">
                        {r.referee?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium dark:text-white">{r.referee?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-500">+5 🪙 bonus</p>
                      {r.commissionEarned > 0 && <p className="text-xs text-purple-500">+{r.commissionEarned.toFixed(2)} 🪙 commission</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="card dark:bg-gray-900 dark:border-gray-800 bg-amber-50 dark:bg-amber-900/10 border-amber-100">
          <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold mb-1">💡 Referral Tips</p>
          <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-1">
            <li>• Share on WhatsApp, Instagram, and Telegram for best results</li>
            <li>• You earn 10% of every coin your friend earns from ads — forever!</li>
            <li>• Friends must register using your referral code (not link) for it to count</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
