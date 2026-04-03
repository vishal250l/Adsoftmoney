import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WatchAds from './pages/WatchAds';
import DailyTasks from './pages/DailyTasks';
import SpinWheel from './pages/SpinWheel';
import Referral from './pages/Referral';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Redeem from './pages/Redeem';
import Profile from './pages/Profile';

import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import About from './pages/legal/About';
import Contact from './pages/legal/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAds from './pages/admin/AdminAds';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRedemptions from './pages/admin/AdminRedemptions';
import AdminMessages from './pages/admin/AdminMessages';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
function AdminRoute({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/admin/login" replace />;
}
function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }, success: { iconTheme: { primary: '#00baf2', secondary: '#fff' } } }} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/watch-ads" element={<PrivateRoute><WatchAds /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><DailyTasks /></PrivateRoute>} />
            <Route path="/spin" element={<PrivateRoute><SpinWheel /></PrivateRoute>} />
            <Route path="/referral" element={<PrivateRoute><Referral /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            <Route path="/redeem" element={<PrivateRoute><Redeem /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/ads" element={<AdminRoute><AdminAds /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/redemptions" element={<AdminRoute><AdminRedemptions /></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
