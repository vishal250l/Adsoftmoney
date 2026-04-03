import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Footer from './Footer';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/tasks', icon: '✅', label: 'Daily Tasks' },
  { path: '/spin', icon: '🎰', label: 'Spin Wheel' },
  { path: '/watch-ads', icon: '▶️', label: 'Watch Ads' },
  { path: '/referral', icon: '👥', label: 'Referral' },
  { path: '/wallet', icon: '🪙', label: 'Coin Wallet' },
  { path: '/transactions', icon: '📋', label: 'Transactions' },
  { path: '/redeem', icon: '🎁', label: 'Redeem Coins' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <div className="flex flex-1">
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-40 transition-transform duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Adsoft<span className="text-primary-500">money</span></span>
            </Link>
          </div>

          {/* Coin balance card */}
          <div className="p-4 mx-3 mt-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-primary-100 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
              <span className="text-xl">🪙</span>
              <div>
                <p className="text-xs text-primary-100">Coin Balance</p>
                <p className="text-lg font-bold">{(user?.coinBalance || 0).toFixed(1)} coins</p>
              </div>
            </div>
          </div>

          <nav className="mt-3 px-3 space-y-0.5 flex-1 overflow-y-auto">
            {navItems.map(item => (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${location.pathname === item.path
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <button onClick={toggle} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <span>{dark ? '☀️' : '🌙'}</span>{dark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <span>🚪</span>Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden lg:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">{navItems.find(n => n.path === location.pathname)?.label || 'AdSofmoney'}</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-lg">🪙</span>
              <span className="font-bold text-primary-600 dark:text-primary-400 text-sm">{(user?.coinBalance || 0).toFixed(1)} coins</span>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fade-in">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
