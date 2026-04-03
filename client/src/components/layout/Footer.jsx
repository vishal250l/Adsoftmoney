import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-white font-display font-bold text-sm">Adsoft<span className="text-primary-400">money</span></span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            <Link to="/dashboard" className="hover:text-primary-400 transition">Home</Link>
            <Link to="/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-400 transition">Terms</Link>
            <Link to="/contact" className="hover:text-primary-400 transition">Contact</Link>
            <Link to="/about" className="hover:text-primary-400 transition">About</Link>
          </nav>
          <p className="text-gray-600 text-xs">© 2024 AdSofmoney · Coins are virtual rewards</p>
        </div>
      </div>
    </footer>
  );
}
