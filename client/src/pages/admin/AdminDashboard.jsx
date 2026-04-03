import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminAPI } from '../../services/api';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
          <p className={`font-display text-2xl font-bold mt-1 ${color || 'text-white'}`}>{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => {
      setStats(data.stats);
      setRecentUsers(data.recentUsers);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">AdSofmoney platform overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? [1,2,3,4].map(i => <div key={i} className="bg-gray-900 rounded-2xl h-24 animate-pulse" />) : (
            <>
              <StatCard icon="👥" label="Total Users" value={stats?.totalUsers || 0} color="text-primary-400" />
              <StatCard icon="📺" label="Active Ads" value={stats?.totalAds || 0} color="text-blue-400" />
              <StatCard icon="🪙" label="Total Coins Given" value={(stats?.totalCoinsGiven || 0).toFixed(1)} color="text-yellow-400" sub="across all users" />
              <StatCard icon="🎁" label="Pending Redemptions" value={stats?.pendingRedemptions || 0} color="text-orange-400" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending redemptions alert */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3">Redemption Requests</h3>
            {loading ? <div className="h-16 bg-gray-800 rounded animate-pulse" /> : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-orange-400">{stats?.pendingRedemptions || 0}</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">pending approval</p>
                  <Link to="/admin/redemptions" className="text-primary-400 text-xs hover:underline mt-1 inline-block">Review requests →</Link>
                </div>
              </div>
            )}
          </div>

          {/* Total transactions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3">Platform Activity</h3>
            {loading ? <div className="h-16 bg-gray-800 rounded animate-pulse" /> : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-primary-400">{stats?.totalTransactions?.toLocaleString() || 0}</p>
                  <p className="text-gray-400 text-xs">Total transactions processed</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Users</h3>
            <Link to="/admin/users" className="text-primary-400 text-sm hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />)}</div>
          ) : recentUsers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No users yet</p>
          ) : (
            <div className="divide-y divide-gray-800">
              {recentUsers.map(u => (
                <div key={u._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold text-sm">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-400">{(u.coinBalance || 0).toFixed(1)} 🪙</p>
                    <p className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/admin/ads', icon: '📺', label: 'Manage Ads' },
            { to: '/admin/users', icon: '👥', label: 'All Users' },
            { to: '/admin/redemptions', icon: '🎁', label: 'Redemptions' },
            { to: '/admin/messages', icon: '✉️', label: 'Messages' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col items-center text-center hover:border-primary-700 hover:bg-gray-800 transition">
              <span className="text-2xl mb-2">{item.icon}</span>
              <span className="text-sm font-medium text-gray-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
