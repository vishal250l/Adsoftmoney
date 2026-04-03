import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { walletAPI } from '../services/api';

const FILTERS = [{ value:'',label:'All'},{ value:'ad_reward',label:'Ad Rewards'},{ value:'task_reward',label:'Tasks'},{ value:'spin_reward',label:'Spin'},{ value:'referral_reward',label:'Referral'},{ value:'redeem',label:'Redeem'}];
const TX_ICON = { ad_reward:'▶️', task_reward:'✅', spin_reward:'🎰', referral_reward:'👥', redeem:'🎁', bonus:'⭐' };
const TX_COLOR = { ad_reward:'bg-green-100 text-green-600', task_reward:'bg-blue-100 text-blue-600', spin_reward:'bg-purple-100 text-purple-600', referral_reward:'bg-orange-100 text-orange-600', redeem:'bg-red-100 text-red-600', bonus:'bg-yellow-100 text-yellow-600' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');

  const fetch = (p=1, t=type) => {
    setLoading(true);
    walletAPI.getTransactions({ page: p, limit: 15, type: t||undefined })
      .then(({ data }) => { setTransactions(data.transactions); setPagination(data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1, type); setPage(1); }, [type]);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-5 animate-slide-up">
        <div><h2 className="font-display text-2xl font-bold dark:text-white">Transaction History</h2><p className="text-sm text-gray-500 dark:text-gray-400">All your coin earnings and redemptions</p></div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setType(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${type===f.value ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="card dark:bg-gray-900 dark:border-gray-800">
          {loading ? <div className="space-y-3">{[...Array(6)].map((_,i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div> :
            transactions.length === 0 ? <div className="text-center py-10"><p className="text-4xl mb-2">📭</p><p className="text-gray-400 text-sm">No transactions found</p></div> : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {transactions.map(tx => (
                  <div key={tx._id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${TX_COLOR[tx.type]||'bg-gray-100 text-gray-600'}`}>{TX_ICON[tx.type]||'💰'}</div>
                      <div>
                        <p className="text-sm font-medium dark:text-white truncate max-w-[200px]">{tx.description}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount} 🪙</p>
                      <p className="text-xs text-gray-400">Bal: {tx.balanceAfter?.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800 mt-2">
              <button onClick={() => { const p=page-1; setPage(p); fetch(p); }} disabled={page<=1} className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-primary-300 transition">← Prev</button>
              <span className="text-sm text-gray-400">Page {page} / {pagination.pages}</span>
              <button onClick={() => { const p=page+1; setPage(p); fetch(p); }} disabled={page>=pagination.pages} className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-primary-300 transition">Next →</button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
