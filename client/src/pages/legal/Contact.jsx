import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return toast.error('All fields required');
    setLoading(true);
    try {
      const { data } = await contactAPI.send(form);
      setSent(true);
      toast.success(data.message);
      setForm({ name:'', email:'', message:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      <nav className="sticky top-0 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">A</span></div><span className="font-display font-bold text-sm text-white">Adsoft<span className="text-primary-400">money</span></span></Link>
        <span className="text-gray-600">/</span><span className="text-gray-400 text-sm">Contact</span>
      </nav>
      <div className="max-w-xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">✉️</p>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-gray-400 text-sm">We'd love to hear from you. We reply within 24 hours.</p>
        </div>

        {sent ? (
          <div className="bg-green-900/20 border border-green-800/40 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-green-400 font-semibold text-lg">Message Sent!</p>
            <p className="text-green-300/70 text-sm mt-2">We'll get back to you at your email within 24 hours.</p>
            <button onClick={() => setSent(false)} className="mt-4 text-primary-400 text-sm hover:underline">Send another message</button>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
                <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="rahul@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
                <textarea rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  placeholder="Your message here..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required maxLength={1000} />
                <p className="text-xs text-gray-500 text-right mt-1">{form.message.length}/1000</p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition">
                {loading ? 'Sending...' : '📨 Send Message'}
              </button>
            </form>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl mb-1">📧</p>
            <p className="text-xs text-gray-400">Email</p>
            <a href="mailto:vbhalse143@gmail.com" className="text-primary-400 text-xs hover:underline">vbhalse143@gmail.com</a>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl mb-1">⏱️</p>
            <p className="text-xs text-gray-400">Response Time</p>
            <p className="text-white text-xs font-medium">Within 24 hours</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
