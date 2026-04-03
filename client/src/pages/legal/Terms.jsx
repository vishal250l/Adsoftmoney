import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      <nav className="sticky top-0 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">A</span></div><span className="font-display font-bold text-sm text-white">Adsoft<span className="text-primary-400">money</span></span></Link>
        <span className="text-gray-600">/</span><span className="text-gray-400 text-sm">Terms & Conditions</span>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-12 flex-1">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Terms & Conditions</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2024</p>
        <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-4 mb-8">
          <p className="text-yellow-400 text-sm font-semibold">⚠️ Academic Project Disclaimer</p>
          <p className="text-yellow-300/80 text-xs mt-1">AdSofmoney is an academic project. All coins are virtual and have no monetary value. No real money will be transferred under any circumstances.</p>
        </div>
        <div className="space-y-7 text-sm text-gray-300 leading-relaxed">
          <section><h2 className="text-lg font-semibold text-white mb-2">1. Virtual Coins</h2><p>Coins earned on AdSofmoney are <strong className="text-white">virtual rewards only</strong> and are not real currency. They have no guaranteed monetary value. Coins cannot be transferred between accounts, sold, or exchanged for real money. The redemption system is simulated for academic demonstration purposes.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">2. Eligibility</h2><p>You must be at least 13 years old to use AdSofmoney. By registering, you confirm that the information you provide is accurate and that you agree to these terms.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">3. Fraud & Abuse Policy</h2><p>Any attempt to manipulate the reward system — including using bots, scripts, multiple accounts, or other automated means — is strictly prohibited and may result in immediate <strong className="text-white">account suspension</strong> without notice. We reserve the right to revoke any coins earned through fraudulent activity.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">4. Redeem Policies</h2><p>Redemption of coins is subject to admin approval. <strong className="text-white">Redeem policies, minimum thresholds, and reward options may change at any time</strong> without prior notice. Redemption requests may be denied at our sole discretion.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">5. Ad Watching Rules</h2><p>Ads must be watched in full to earn coins. You must not close the app, switch tabs, or use other workarounds to skip ads. Violation of these rules will result in coin forfeiture and possible account suspension.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">6. Referral Program</h2><p>Referral bonuses are only awarded when a genuinely new user registers using your code. Self-referral or abuse of the referral system is prohibited and will result in permanent account suspension.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">7. Service Availability</h2><p>We do not guarantee uninterrupted access to AdSofmoney. We reserve the right to modify, suspend, or terminate the service at any time.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">8. Contact</h2><p>For questions about these terms, contact <a href="mailto:vbhalse143@gmail.com" className="text-primary-400 hover:underline">vbhalse143@gmail.com</a>.</p></section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
