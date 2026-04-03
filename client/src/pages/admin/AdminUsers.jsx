import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = (p = 1, s = search) => {
    setLoading(true);
    adminAPI.getUsers({ page: p, search: s || undefined })
      .then(({ data }) => { setUsers(data.users); setTotal(data.total); setPages(data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(1, search); setPage(1); }, [search]);

  const handleBan = async (id, isBanned) => {
    try {
      const { data } = await adminAPI.toggleBan(id);
      setUsers(prev => prev.map(u => u._id === id ? {...u, isBanned: data.isBanned} : u));
      toast.success(data.message);
    } catch { toast.error('Action failed'); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Users</h1>
            <p className="text-gray-400 text-sm">{total} registered users</p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pl-9 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-64" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-800 rounded animate-pulse" />)}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    {['User','Coins','Total Earned','Ads','Referrals','Joined','Status','Action'].map(h => (
                      <th key={h} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold text-xs shrink-0">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium truncate max-w-[110px]">{u.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[110px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-yellow-400">{(u.coinBalance||0).toFixed(1)} 🪙</td>
                      <td className="px-4 py-3 text-sm text-green-400">{(u.totalCoinsEarned||0).toFixed(1)} 🪙</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{u.totalAdsWatched || 0}</td>
                      <td className="px-4 py-3 text-sm text-orange-400">{u.referralCount || 0}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleBan(u._id, u.isBanned)}
                          className={`text-xs font-medium hover:underline ${u.isBanned ? 'text-green-400' : 'text-red-400'}`}>
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-800">
              <button onClick={() => { const p = page-1; setPage(p); fetchUsers(p); }} disabled={page<=1}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-700 transition">← Prev</button>
              <span className="text-sm text-gray-400">Page {page} / {pages}</span>
              <button onClick={() => { const p = page+1; setPage(p); fetchUsers(p); }} disabled={page>=pages}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-700 transition">Next →</button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
