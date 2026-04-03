import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { walletAPI } from '../services/api';

const TX_ICON = { ad_reward:'▶️', task_reward:'✅', spin_reward:'🎰', referral_reward:'👥', redeem:'🎁', bonus:'⭐' };
const TX_COLOR = { ad_reward:'text-green-500', task_reward:'text-blue-500', spin_reward:'text-purple-500', referral_reward:'text-orange-500', redeem:'text-red-500', bonus:'text-yellow-500' };

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    walletAPI.getWallet().then(({ data }) => { setWallet(data.wallet); setTransactions(data.transactions); setPending(data.pendingRedemptions); }).finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-5 animate-slide-up">
        <div className="flex items-center justify-between">
          <div><h2 className="font-display text-2xl font-bold dark:text-white">Coin Wallet</h2><p className="text-sm text-gray-500 dark:text-gray-400">Your virtual coin balance</p></div>
          <Link to="/redeem" className="btn-primary text-sm py-2.5 px-5 rounded-xl">🎁 Redeem</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['🪙','Coin Balance',`${(wallet?.coinBalance||0).toFixed(1)} 🪙`,'text-primary-500'],['📈','Total Earned',`${(wallet?.totalCoinsEarned||0).toFixed(1)} 🪙`,'text-green-500'],['▶️','Ads Watched',wallet?.totalAdsWatched||0,'dark:text-white'],['🎁','Redeemed',`${(wallet?.totalCoinsRedeemed||0).toFixed(1)} 🪙`,'text-orange-500']].map(([icon,label,value,color]) => (
            <div key={label} className="card dark:bg-gray-900 dark:border-gray-800 text-center p-4">
              {loading ? <div className="skeleton h-12 rounded" /> : <><p className="text-xl">{icon}</p><p className={`font-display text-lg font-bold mt-1 ${color}`}>{value}</p><p className="text-xs text-gray-400 mt-0.5">{label}</p></>}
            </div>
          ))}
        </div>

        {/* Redeem progress */}
        {wallet && (
          <div className={`card dark:bg-gray-900 dark:border-gray-800 ${wallet.coinBalance >= 200 ? 'border-green-200 dark:border-green-900' : ''}`}>
            <div className="flex justify-between mb-2">
              <p className="font-semibold dark:text-white text-sm">Redemption Progress</p>
              {wallet.coinBalance >= 200 && <span className="badge-green">Ready!</span>}
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
              <div className="bg-primary-500 rounded-full h-3 transition-all" style={{ width: `${Math.min(100,(wallet.coinBalance/200)*100)}%` }} />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
              <span>{wallet.coinBalance?.toFixed(1)} 🪙</span><span>200 🪙 min</span>
            </div>
            {wallet.coinBalance >= 200 && <Link to="/redeem" className="btn-primary w-full text-center mt-3 block rounded-xl text-sm">🎁 Redeem Now!</Link>}
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <div className="card dark:bg-gray-900 dark:border-gray-800">
            <p className="font-semibold dark:text-white mb-3">Pending Redemptions</p>
            {pending.map(r => (
              <div key={r._id} className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-3 mb-2">
                <div><p className="text-sm font-medium dark:text-white">{r.coinsUsed} coins — {r.rewardType}</p><p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p></div>
                <span className="badge-yellow">Pending</span>
              </div>
            ))}
          </div>
        )}

        {/* Transactions */}
        <div className="card dark:bg-gray-900 dark:border-gray-800">
          <div className="flex justify-between mb-4"><p className="font-semibold dark:text-white">Recent Transactions</p><Link to="/transactions" className="text-primary-500 text-sm hover:underline">View all</Link></div>
          {loading ? <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="skeleton h-14 rounded" />)}</div> :
            transactions.length === 0 ? <p className="text-center text-gray-400 py-6">No transactions yet</p> : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {transactions.map(tx => (
                  <div key={tx._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-sm`}>{TX_ICON[tx.type]||'💰'}</div>
                      <div><p className="text-sm dark:text-white truncate max-w-[180px]">{tx.description}</p><p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString('en-IN')}</p></div>
                    </div>
                    <span className={`text-sm font-bold ${tx.amount > 0 ? TX_COLOR[tx.type] || 'text-green-500' : 'text-red-500'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount} 🪙</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}
