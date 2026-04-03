import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_TABS = ['processing', 'completed', 'rejected'];

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing');

  const fetchWithdrawals = (s = status) => {
    setLoading(true);
    adminAPI.getWithdrawals(s).then(({ data }) => {
      setWithdrawals(data.withdrawals);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchWithdrawals(status); }, [status]);

  const handleUpdate = async (id, newStatus) => {
    const remarks = newStatus === 'completed'
      ? 'Payment transferred successfully.'
      : newStatus === 'rejected'
      ? 'Request rejected by admin. Amount refunded to wallet.'
      : 'Processing';
    try {
      await adminAPI.updateWithdrawal(id, { status: newStatus, remarks });
      setWithdrawals(prev => prev.filter(w => w._id !== id));
      toast.success(`Withdrawal ${newStatus}`);
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Withdrawal Requests</h1>
          <p className="text-gray-400 text-sm">Review and manage UPI withdrawals</p>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize
                ${status === s
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />)}</div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No {status} withdrawals
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['User', 'UPI ID', 'Amount', 'Requested', 'Status', ...(status === 'processing' ? ['Actions'] : [])].map(h => (
                    <th key={h} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w._id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                    <td className="px-4 py-3">
                      <p className="text-sm text-white font-medium">{w.user?.name}</p>
                      <p className="text-xs text-gray-500">{w.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">{w.upiId}</td>
                    <td className="px-4 py-3 text-sm font-bold text-yellow-400">₹{w.amount}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(w.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${w.status === 'completed' ? 'bg-green-500/20 text-green-400'
                          : w.status === 'rejected' ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {w.status}
                      </span>
                    </td>
                    {status === 'processing' && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdate(w._id, 'completed')}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition">
                            ✓ Approve
                          </button>
                          <button onClick={() => handleUpdate(w._id, 'rejected')}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition">
                            ✕ Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
