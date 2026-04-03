import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUser({ name: data.user.name, phone: data.user.phone });
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Min. 6 characters');
    setChangingPw(true);
    try {
      await userAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword:'', newPassword:'', confirm:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setChangingPw(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
        <div><h2 className="font-display text-2xl font-bold dark:text-white">Profile Settings</h2><p className="text-sm text-gray-500 dark:text-gray-400">Manage your account</p></div>

        {/* Avatar + summary */}
        <div className="card dark:bg-gray-900 dark:border-gray-800 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-primary-500 font-medium">🪙 {(user?.coinBalance || 0).toFixed(1)} coins</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{user?.totalAdsWatched || 0} ads watched</span>
              {user?.referralCode && <><span className="text-xs text-gray-400">·</span><span className="text-xs font-mono text-orange-500">{user.referralCode}</span></>}
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="card dark:bg-gray-900 dark:border-gray-800">
          <h3 className="font-semibold dark:text-white mb-4">Personal Information</h3>
          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" className="input-field bg-gray-50 dark:bg-gray-800" value={user?.email} disabled />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Phone Number <span className="text-green-500 text-xs">(+2 coins for completing profile)</span>
              </label>
              <input type="tel" className="input-field" placeholder="+91 98765 43210" value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5 px-6 rounded-xl">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card dark:bg-gray-900 dark:border-gray-800">
          <h3 className="font-semibold dark:text-white mb-4">Change Password</h3>
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters"
                value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
              <input type="password" className="input-field" placeholder="Repeat"
                value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} required />
            </div>
            <button type="submit" disabled={changingPw} className="btn-primary text-sm py-2.5 px-6 rounded-xl">
              {changingPw ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="card dark:bg-gray-900 dark:border-gray-800">
          <h3 className="font-semibold dark:text-white mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['🪙','Coin Balance',`${(user?.coinBalance||0).toFixed(1)}`],
              ['📈','Total Earned',`${(user?.totalCoinsEarned||0).toFixed(1)}`],
              ['▶️','Ads Watched',user?.totalAdsWatched||0],
              ['🎁','Redeemed',`${(user?.totalCoinsRedeemed||0).toFixed(1)}`],
            ].map(([icon,label,value]) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <p className="text-lg">{icon}</p>
                <p className="font-semibold text-sm dark:text-white mt-0.5">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
