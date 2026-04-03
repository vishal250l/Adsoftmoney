import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/layout/Footer';

const features = [
  { icon:'✅', title:'Daily Tasks', desc:'Login rewards, profile tasks, and more. Earn up to 8.5 coins every day.' },
  { icon:'🎰', title:'Spin Wheel', desc:'Spin up to 3 times daily for a chance to win 0.2–1 coin per spin.' },
  { icon:'▶️', title:'Watch Ads', desc:'Optional bonus — earn 0.5 coins per ad, up to 20 ads daily.' },
  { icon:'👥', title:'Refer Friends', desc:'Earn 5 coins per invite plus 10% of their ad earnings forever.' },
];

const steps = [
  { num:'01', title:'Create Account', desc:'Sign up free in 30 seconds.' },
  { num:'02', title:'Earn Coins', desc:'Complete tasks, spin & watch ads.' },
  { num:'03', title:'Grow Balance', desc:'Refer friends for passive coins.' },
  { num:'04', title:'Redeem Rewards', desc:'Exchange 200+ coins for rewards.' },
];

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'dark bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">A</span></div>
            <span className="font-display font-bold text-xl dark:text-white">Adsoft<span className="text-primary-500">money</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">{dark ? '☀️' : '🌙'}</button>
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 px-3 py-2">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4 rounded-xl">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse inline-block" />
          Virtual coins · No real money involved
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6 dark:text-white">
          Watch Ads. Earn Coins.<br />
          <span className="text-primary-500">Complete Tasks. Get Rewards.</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10">
          India's fun virtual reward platform. Earn coins daily through tasks, spin wheel, and bonus ads. Redeem for gifts!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary text-base py-3.5 px-8 inline-block rounded-xl">Start Earning Coins →</Link>
          <Link to="/login" className="btn-outline text-base py-3.5 px-8 inline-block rounded-xl">I have an account</Link>
        </div>
        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[['🪙','Virtual Coins','Safe & fun rewards'],['✅','Daily Tasks','New tasks every day'],['👥','Referral','Earn passive coins']].map(([icon,val,label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl mb-1">{icon}</div>
              <div className="font-display text-lg font-bold text-primary-500">{val}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-2 dark:text-white">Multiple Ways to Earn</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12">Pick what you enjoy most</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="card dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-base mb-2 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(s => (
            <div key={s.num} className="text-center">
              <div className="w-14 h-14 bg-primary-500 text-white font-display font-bold text-xl rounded-2xl flex items-center justify-center mx-auto mb-4">{s.num}</div>
              <h3 className="font-semibold mb-2 dark:text-white">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer banner */}
      <section className="bg-amber-50 dark:bg-amber-900/10 border-y border-amber-100 dark:border-amber-900/20 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            <strong>⚠️ Disclaimer:</strong> AdSofmoney is an academic project. All coins are <strong>virtual rewards</strong> and have no monetary value. No real money is earned or transferred.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center text-white">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to start earning coins?</h2>
          <p className="text-primary-100 mb-8">Join and complete your first daily task in 30 seconds.</p>
          <Link to="/register" className="bg-white text-primary-600 font-bold py-3.5 px-8 rounded-xl hover:bg-primary-50 transition inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
