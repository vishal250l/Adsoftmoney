import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      <nav className="sticky top-0 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">A</span></div><span className="font-display font-bold text-sm text-white">Adsoft<span className="text-primary-400">money</span></span></Link>
        <span className="text-gray-600">/</span><span className="text-gray-400 text-sm">Privacy Policy</span>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-12 flex-1">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2024</p>
        <div className="space-y-7 text-sm text-gray-300 leading-relaxed">
          <section><h2 className="text-lg font-semibold text-white mb-2">1. Data We Collect</h2><p>When you register for AdSofmoney, we collect your name, email address, and optionally your phone number. We also collect usage data including ads watched, tasks completed, spin wheel activity, and referral activity to calculate your coin balance and prevent fraud.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">2. User Accounts</h2><p>Your account stores your profile information, virtual coin balance, transaction history, and referral relationships. Passwords are securely hashed using bcrypt and are never stored in plain text. JWT tokens are used for session authentication.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">3. Referral Tracking</h2><p>We track referral relationships to award the correct coin bonuses. When you refer a friend using your unique referral code, we store the connection between your account and your friend's account to calculate your 5-coin invite bonus and 10% commission on their ad earnings.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">4. Advertising Services</h2><p>AdSofmoney displays advertisements from third-party advertisers. In the future, we may integrate Google AdMob to serve rewarded video advertisements. These services may collect device identifiers and interaction data to serve relevant ads. We are not responsible for the privacy practices of third-party advertisers.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">5. Data Security</h2><p>We use industry-standard security measures including JWT authentication, bcrypt password hashing, HTTPS encryption, and rate limiting to protect your data. However, no internet transmission is 100% secure. We recommend using a strong, unique password for your account.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">6. Data Sharing</h2><p>We do not sell your personal data to third parties. We may share anonymized, aggregated data for analytics purposes. Contact messages submitted through our Contact page are stored in our database for support purposes only.</p></section>
          <section><h2 className="text-lg font-semibold text-white mb-2">7. Contact</h2><p>For privacy concerns, email us at <a href="mailto:vbhalse143@gmail.com" className="text-primary-400 hover:underline">vbhalse143@gmail.com</a>.</p></section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
