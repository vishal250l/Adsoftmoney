import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'', referralCode: searchParams.get('ref') || '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password, form.phone, form.referralCode);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-primary-900 items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <h2 className="font-display text-4xl font-bold mb-4">Join AdSofmoney</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">Earn virtual coins by watching ads, spinning the wheel, and completing daily tasks.</p>
          <div className="space-y-3">
            {[['▶️','Watch ads','0.5 coins per ad'],['✅','Daily tasks','Up to 8.5 coins/day'],['🎰','Spin wheel','Up to 1 coin/spin'],['👥','Refer friends','5 coins per invite + 10% commission']].map(([icon,label,desc]) => (
              <div key={label} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">
                <span className="flex items-center gap-2 text-sm"><span>{icon}</span>{label}</span>
                <span className="text-primary-300 text-xs font-medium">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950 overflow-auto">
        <div className="w-full max-w-md animate-slide-up py-8">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">A</span></div>
            <span className="font-display font-bold text-lg">Adsoft<span className="text-primary-500">money</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold dark:text-white mb-1">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Free to join. Start earning coins instantly!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                placeholder="rahul@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone (optional)</label>
              <input type="tel" className="input-field" placeholder="+91 98765 43210" value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className={`input-field pr-12 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{showPass ? '🙈' : '👁️'}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <input type="password" className={`input-field ${errors.confirm ? 'border-red-400' : ''}`}
                placeholder="Repeat password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Referral Code <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input type="text" className="input-field uppercase font-mono tracking-widest"
                placeholder="e.g. ASMXYZ123" value={form.referralCode}
                onChange={e => setForm({...form, referralCode: e.target.value.toUpperCase()})} />
              {form.referralCode && <p className="text-green-500 text-xs mt-1">🎉 You'll both get bonus coins!</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-center mt-1">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
