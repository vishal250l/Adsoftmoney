import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminAPI } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    adminAPI.getMessages().then(({ data }) => setMessages(data.messages)).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Contact Messages</h1>
          <p className="text-gray-400 text-sm">{messages.length} messages received</p>
        </div>

        {/* Message detail modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-primary-400 text-sm hover:underline">{selected.email}</a>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <p className="text-xs text-gray-500">{new Date(selected.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
              <div className="flex gap-3 mt-4">
                <a href={`mailto:${selected.email}?subject=Re: Your message on AdSofmoney`}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition">
                  📧 Reply via Email
                </a>
                <button onClick={() => setSelected(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />)}</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {messages.map(msg => (
                <button key={msg._id} onClick={() => setSelected(msg)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-800/60 transition flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold shrink-0">
                    {msg.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white font-medium text-sm">{msg.name}</p>
                      <p className="text-xs text-gray-500 shrink-0">{new Date(msg.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <p className="text-xs text-primary-400">{msg.email}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{msg.message}</p>
                  </div>
                  <span className="text-gray-600 text-sm shrink-0">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
