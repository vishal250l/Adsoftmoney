import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { userAPI, tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="card dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
          <p className={`font-display text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

const quickActions = [
  { to: '/tasks', icon: '✅', label: 'Daily Tasks', desc: 'Earn coins daily', color: 'from-green-500 to-emerald-600' },
  { to: '/spin', icon: '🎰', label: 'Spin Wheel', desc: 'Up to 1 coin/spin', color: 'from-purple-500 to-violet-600' },
  { to: '/watch-ads', icon: '▶️', label: 'Watch Ads', desc: '0.5 coins per ad', color: 'from-primary-500 to-primary-600' },
  { to: '/referral', icon: '👥', label: 'Invite Friends', desc: '5 coins per invite', color: 'from-orange-500 to-amber-600' },
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userAPI.getDashboard(), tasksAPI.getTasks()])
      .then(([dash, t]) => {
        setStats(dash.data.stats);
        setTransactions(dash.data.recentTransactions);
        setTasks(t.data.tasks.slice(0, 3));
        updateUser({ coinBalance: dash.data.stats.coinBalance, totalCoinsEarned: dash.data.stats.totalCoinsEarned });
      }).finally(() => setLoading(false));
  }, []);

  const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

  const txIcon = (type) => ({ ad_reward:'▶️', task_reward:'✅', spin_reward:'🎰', referral_reward:'👥', redeem:'🎁', bonus:'⭐' }[type] || '💰');
  const txColor = (type) => ({ ad_reward:'text-green-500', task_reward:'text-blue-500', spin_reward:'text-purple-500', referral_reward:'text-orange-500', redeem:'text-red-500' }[type] || 'text-gray-400');

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold dark:text-white">{greet()}, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Watch Ads. Earn Coins. Complete Tasks. Get Rewards.</p>
          </div>
          <Link to="/redeem" className="btn-primary text-sm py-2.5 px-5 rounded-xl hidden sm:block">🎁 Redeem</Link>
        </div>

        {/* Coin balance hero */}
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-white/5 rounded-full translate-y-8" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Coin Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl">🪙</span>
                <p className="font-display text-5xl font-bold">{loading ? '...' : (stats?.coinBalance || 0).toFixed(1)}</p>
              </div>
              <p className="text-primary-100 text-xs mt-2">Need 200 coins to redeem</p>
            </div>
            <div className="text-right space-y-2">
              <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-primary-100">Today Earned</p>
                <p className="font-bold text-lg">{loading ? '-' : (stats?.todayEarned || 0).toFixed(1)} 🪙</p>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-primary-100">Total Earned</p>
                <p className="font-bold text-lg">{loading ? '-' : (stats?.totalCoinsEarned || 0).toFixed(1)} 🪙</p>
              </div>
            </div>
          </div>
          {/* Progress to redeem */}
          <div className="relative mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 transition-all duration-700" style={{ width: `${Math.min(100, ((stats?.coinBalance || 0) / 200) * 100)}%` }} />
            </div>
            <p className="text-primary-100 text-xs mt-1.5">
              {(stats?.coinBalance || 0) >= 200 ? '🎉 Ready to redeem!' : `${Math.max(0, 200 - (stats?.coinBalance || 0)).toFixed(0)} more coins to redeem`}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? [1,2,3,4].map(i => <div key={i} className="card skeleton h-20" />) : (
            <>
              <StatCard icon="▶️" label="Ads Watched" value={stats?.totalAdsWatched || 0} color="dark:text-white" sub="lifetime" />
              <StatCard icon="✅" label="Tasks Done" value={`${stats?.completedTasks || 0}/4`} color="text-green-500" sub="today" />
              <StatCard icon="🎰" label="Spins Left" value={stats?.spinsLeft || 0} color="text-purple-500" sub="today" />
              <StatCard icon="👥" label="Referrals" value={stats?.referralCount || 0} color="text-orange-500" sub="friends invited" />
            </>
          )}
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <Link key={a.to} to={a.to} className={`bg-gradient-to-br ${a.color} rounded-2xl p-4 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
              <span className="text-2xl">{a.icon}</span>
              <p className="font-semibold text-sm mt-2">{a.label}</p>
              <p className="text-xs text-white/70 mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily tasks preview */}
          <div className="card dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Today's Tasks</h3>
              <Link to="/tasks" className="text-primary-500 text-sm hover:underline">View all</Link>
            </div>
            {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded" />)}</div> : (
              <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.key} className={`flex items-center justify-between p-3 rounded-xl ${t.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-base ${t.completed ? '✅' : '⭕'}`}>{t.completed ? '✅' : '⭕'}</span>
                      <p className={`text-sm font-medium ${t.completed ? 'text-green-600 dark:text-green-400 line-through' : 'dark:text-white'}`}>{t.label}</p>
                    </div>
                    <span className="text-xs font-bold text-primary-500">+{t.coins} 🪙</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent transactions */}
          <div className="card dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Recent Activity</h3>
              <Link to="/transactions" className="text-primary-500 text-sm hover:underline">View all</Link>
            </div>
            {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded" />)}</div> :
              transactions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-gray-400 text-sm">No activity yet</p>
                  <Link to="/tasks" className="text-primary-500 text-sm mt-1 inline-block">Start earning →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map(tx => (
                    <div key={tx._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{txIcon(tx.type)}</span>
                        <p className="text-sm dark:text-white truncate max-w-[160px]">{tx.description}</p>
                      </div>
                      <span className={`text-sm font-bold ${txColor(tx.type)}`}>{tx.amount > 0 ? '+' : ''}{tx.amount} 🪙</span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
