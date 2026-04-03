import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/ads', icon: '📺', label: 'Manage Ads' },
  { path: '/admin/users', icon: '👥', label: 'Users' },
  { path: '/admin/redemptions', icon: '🎁', label: 'Redemptions' },
  { path: '/admin/messages', icon: '✉️', label: 'Messages' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-950">
      <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">A</span></div>
            <div><p className="font-display font-bold text-white text-sm">AdSofmoney</p><p className="text-xs text-gray-500">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {adminNav.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${location.pathname === item.path ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="px-4 text-xs text-gray-500 mb-1">Logged in as</p>
          <p className="px-4 text-xs text-gray-300 font-medium truncate mb-2">{admin?.email}</p>
          <button onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition">
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
