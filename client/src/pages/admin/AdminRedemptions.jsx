import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_TABS = ['pending','approved','rejected'];

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [updating, setUpdating] = useState('');
  const [noteModal, setNoteModal] = useState(null); // { id, action }
  const [note, setNote] = useState('');

  const fetch = (s = status) => {
    setLoading(true);
    adminAPI.getRedemptions(s).then(({ data }) => setRedemptions(data.redemptions)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(status); }, [status]);

  const handleUpdate = async (id, newStatus, adminNote = '') => {
    setUpdating(id);
    try {
      await adminAPI.updateRedemption(id, { status: newStatus, adminNote });
      setRedemptions(prev => prev.filter(r => r._id !== id));
      toast.success(`Redemption ${newStatus}`);
      setNoteModal(null); setNote('');
    } catch { toast.error('Update failed'); }
    finally { setUpdating(''); }
  };

  const rewardIcon = (type) => ({ gift_voucher:'🎁', mobile_recharge:'📱', paytm_cash:'💳' }[type] || '🎁');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Coin Redemptions</h1>
          <p className="text-gray-400 text-sm">Review and process user redemption requests</p>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${status === s ? 'bg-primary-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Note modal */}
        {noteModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="font-semibold text-white mb-3">{noteModal.action === 'approved' ? '✅ Approve' : '❌ Reject'} Redemption</h3>
              <textarea className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                rows={3} placeholder="Admin note (optional)..." value={note} onChange={e => setNote(e.target.value)} />
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleUpdate(noteModal.id, noteModal.action, note)}
                  disabled={updating === noteModal.id}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition ${noteModal.action === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                  {updating === noteModal.id ? 'Processing...' : 'Confirm'}
                </button>
                <button onClick={() => { setNoteModal(null); setNote(''); }}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-white transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-800 rounded animate-pulse" />)}</div>
          ) : redemptions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No {status} redemptions</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {redemptions.map(r => (
                <div key={r._id} className="p-5 flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {rewardIcon(r.rewardType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold text-sm">{r.user?.name}</p>
                        <span className="text-xs text-gray-500">{r.user?.email}</span>
                      </div>
                      <p className="text-yellow-400 font-bold text-sm mt-0.5">{r.coinsUsed} 🪙 → {r.rewardType?.replace(/_/g,' ')}</p>
                      {r.rewardDetails && <p className="text-xs text-gray-400 mt-0.5">Details: {r.rewardDetails}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(r.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </p>
                      {r.adminNote && <p className="text-xs text-primary-400 mt-1">Note: {r.adminNote}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {status === 'pending' ? (
                      <>
                        <button onClick={() => { setNoteModal({ id: r._id, action: 'approved' }); setNote(''); }}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition">
                          ✓ Approve
                        </button>
                        <button onClick={() => { setNoteModal({ id: r._id, action: 'rejected' }); setNote(''); }}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition">
                          ✕ Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
