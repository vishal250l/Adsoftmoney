import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { walletAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const REWARD_OPTIONS = [
  { key: 'gift_voucher', icon: '🎁', label: 'Gift Voucher', desc: 'Amazon / Flipkart voucher' },
  { key: 'mobile_recharge', icon: '📱', label: 'Mobile Recharge', desc: 'Any network' },
  { key: 'paytm_cash', icon: '💳', label: 'Paytm Cash', desc: 'Direct wallet transfer (simulated)' },
];

export default function Redeem() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ coinsUsed: 200, rewardType: 'gift_voucher', rewardDetails: '' });
  const [loading, setLoading] = useState(false);
  const [redemptions, setRedemptions] = useState([]);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    walletAPI.getRedemptions().then(({ data }) => setRedemptions(data.redemptions));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.coinsUsed < 200) return toast.error('Minimum redemption is 200 coins');
    if (form.coinsUsed > (user?.coinBalance || 0)) return toast.error('Insufficient coins');
    setLoading(true);
    try {
      const { data } = await walletAPI.redeemCoins(form);
      setSuccess(data);
      updateUser({ coinBalance: data.newBalance });
      setRedemptions(prev => [data.redemption, ...prev]);
      setForm({ coinsUsed: 200, rewardType: 'gift_voucher', rewardDetails: '' });
      toast.success('Redemption request submitted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const badge = (s) => ({ pending:'badge-yellow', approved:'badge-green', rejected:'badge-red' }[s] || 'badge-blue');

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
        <div><h2 className="font-display text-2xl font-bold dark:text-white">Redeem Coins</h2><p className="text-sm text-gray-500 dark:text-gray-400">Exchange your virtual coins for rewards</p></div>

        {/* Balance */}
        <div className="card dark:bg-gray-900 dark:border-gray-800 bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
          <p className="text-primary-100 text-sm">Available Balance</p>
          <div className="flex items-center gap-2 mt-1"><span className="text-3xl">🪙</span><p className="font-display text-4xl font-bold">{(user?.coinBalance || 0).toFixed(1)}</p></div>
          <p className="text-primary-100 text-xs mt-2">{(user?.coinBalance||0) >= 200 ? '✅ Eligible for redemption!' : `Need ${(200-(user?.coinBalance||0)).toFixed(0)} more coins`}</p>
        </div>

        {/* Legal note */}
        <div className="card bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
          <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold mb-1">⚠️ Important Disclaimer</p>
          <p className="text-xs text-amber-600 dark:text-amber-500">Coins are <strong>virtual rewards</strong> and not real currency. Redemptions are processed manually by admin and subject to availability. Redeem policies may change. Academic project — no real money involved.</p>
        </div>

        {success && (
          <div className="card border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
            <div className="flex gap-3"><span className="text-2xl">✅</span><div><p className="font-semibold text-green-700 dark:text-green-400">Redemption Submitted!</p><p className="text-sm text-green-600 dark:text-green-500 mt-1">Your request for {success.redemption?.coinsUsed} coins has been submitted. Admin will review within 48 hours.</p></div></div>
          </div>
        )}

        {/* Form */}
        {(user?.coinBalance || 0) >= 200 ? (
          <div className="card dark:bg-gray-900 dark:border-gray-800">
            <h3 className="font-semibold dark:text-white mb-4">New Redemption Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reward Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {REWARD_OPTIONS.map(o => (
                    <button key={o.key} type="button" onClick={() => setForm({...form, rewardType: o.key})}
                      className={`p-3 rounded-xl border-2 text-center transition ${form.rewardType === o.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'}`}>
                      <p className="text-2xl">{o.icon}</p>
                      <p className="text-xs font-medium dark:text-white mt-1">{o.label}</p>
                      <p className="text-xs text-gray-400">{o.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Coins to Redeem</label>
                <input type="number" min={200} max={Math.floor(user?.coinBalance||0)} step={50} className="input-field"
                  value={form.coinsUsed} onChange={e => setForm({...form, coinsUsed: parseInt(e.target.value)||200})} />
                <div className="flex gap-2 mt-2">
                  {[200, 500, 1000].filter(v => v <= (user?.coinBalance||0)).map(v => (
                    <button key={v} type="button" onClick={() => setForm({...form, coinsUsed: v})} className="px-3 py-1 text-xs rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 transition">{v} 🪙</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Additional Details (optional)</label>
                <input type="text" className="input-field" placeholder="e.g. your email, phone, UPI ID..."
                  value={form.rewardDetails} onChange={e => setForm({...form, rewardDetails: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full rounded-xl">{loading ? 'Submitting...' : '🎁 Submit Redemption Request'}</button>
            </form>
          </div>
        ) : (
          <div className="card dark:bg-gray-900 dark:border-gray-800 text-center py-8">
            <p className="text-4xl mb-3">🔒</p>
            <p className="font-semibold dark:text-white mb-1">Need 200 Coins to Redeem</p>
            <p className="text-sm text-gray-400">Keep watching ads, spinning the wheel, and completing tasks!</p>
            <Link to="/tasks" className="btn-primary inline-block mt-4 text-sm py-2.5 px-6 rounded-xl">Earn Coins Now</Link>
          </div>
        )}

        {redemptions.length > 0 && (
          <div className="card dark:bg-gray-900 dark:border-gray-800">
            <p className="font-semibold dark:text-white mb-3">Redemption History</p>
            <div className="space-y-2">
              {redemptions.map(r => (
                <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div><p className="text-sm font-medium dark:text-white">{r.coinsUsed} 🪙 — {r.rewardType?.replace('_',' ')}</p><p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p></div>
                  <div className="text-right"><span className={badge(r.status)}>{r.status}</span>{r.adminNote && <p className="text-xs text-gray-400 mt-1 max-w-[120px] truncate">{r.adminNote}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
