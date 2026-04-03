import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      <nav className="sticky top-0 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">A</span></div><span className="font-display font-bold text-sm text-white">Adsoft<span className="text-primary-400">money</span></span></Link>
        <span className="text-gray-600">/</span><span className="text-gray-400 text-sm">About</span>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4"><span className="text-white font-display font-bold text-3xl">A</span></div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">About AdSofmoney</h1>
          <p className="text-gray-400">A modern reward platform built for learning</p>
        </div>
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-3">🎯 What is AdSofmoney?</h2>
            <p>AdSofmoney is a virtual reward platform where users can earn coins by watching advertisements, completing daily tasks, spinning a reward wheel, and inviting friends. It demonstrates how a full-stack reward ecosystem works — from authentication and coin wallets to referral systems and admin panels.</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-3">🏗️ Tech Stack</h2>
            <div className="grid grid-cols-2 gap-3">
              {[['⚛️ React + Vite','Frontend framework'],['🎨 Tailwind CSS','Styling'],['🟢 Node.js + Express','Backend API'],['🍃 MongoDB + Mongoose','Database'],['🔐 JWT + bcrypt','Authentication'],['📱 Mobile-first','Responsive design']].map(([tech,desc]) => (
                <div key={tech} className="bg-gray-800 rounded-xl p-3"><p className="text-white font-medium text-xs">{tech}</p><p className="text-gray-400 text-xs mt-0.5">{desc}</p></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-3">🚀 Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {['Watch Ads for coins','Daily task system','Spin Wheel rewards','Referral program','Coin Wallet','Redemption system','Admin panel','Dark mode','JWT auth','Rate limiting'].map(f => (
                <p key={f} className="flex items-center gap-2 text-xs"><span className="text-green-400">✓</span> {f}</p>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-3">⚠️ Disclaimer</h2>
            <p className="text-gray-300">This is an <strong className="text-white">academic/demonstration project</strong>. All coins are virtual with no monetary value. No real payments are processed. Built to showcase full-stack development skills.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
