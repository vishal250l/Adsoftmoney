import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminAPI } from '../../services/api';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['technology','fashion','food','finance','entertainment','health','education','other'];
const CAT_EMOJI = { technology:'💻', finance:'🏦', food:'🍔', fashion:'👗', entertainment:'🎬', health:'💊', education:'📚', other:'📢' };
const DEFAULT = { title:'', description:'', brand:'', duration:10, coinReward:0.5, category:'other', bgColor:'#00baf2' };

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAds = () => {
    api.get('/ads').then(({ data }) => { setAds(data.ads || []); }).finally(() => setLoading(false));
  };
  useEffect(() => { fetchAds(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const { data } = await adminAPI.updateAd(editId, form);
        setAds(prev => prev.map(a => a._id === editId ? data.ad : a));
        toast.success('Ad updated!');
      } else {
        const { data } = await adminAPI.createAd(form);
        setAds(prev => [...prev, data.ad]);
        toast.success('Ad created!');
      }
      setShowForm(false); setForm(DEFAULT); setEditId(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleEdit = (ad) => {
    setForm({ title: ad.title, description: ad.description || '', brand: ad.brand, duration: ad.duration, coinReward: ad.coinReward, category: ad.category, bgColor: ad.bgColor || '#00baf2' });
    setEditId(ad._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this ad?')) return;
    try { await adminAPI.deleteAd(id); setAds(prev => prev.filter(a => a._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (id, isActive) => {
    try { await adminAPI.updateAd(id, { isActive: !isActive }); setAds(prev => prev.map(a => a._id === id ? {...a, isActive: !isActive} : a)); }
    catch { toast.error('Update failed'); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Manage Ads</h1>
            <p className="text-gray-400 text-sm">{ads.length} ads in database</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(DEFAULT); }}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            + Add New Ad
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-auto">
              <h3 className="font-semibold text-white mb-4">{editId ? 'Edit Ad' : 'Create New Ad'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Ad Title *</label>
                    <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Flipkart Sale" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Brand *</label>
                    <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required placeholder="e.g. Flipkart" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Description</label>
                  <textarea className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                    rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short ad description" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Duration (sec) *</label>
                    <input type="number" min="5" max="120"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Coin Reward 🪙 *</label>
                    <input type="number" min="0.1" step="0.1"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={form.coinReward} onChange={e => setForm({...form, coinReward: parseFloat(e.target.value)})} required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">BG Color</label>
                    <input type="color" className="w-full h-[42px] bg-gray-800 border border-gray-700 rounded-xl cursor-pointer p-1"
                      value={form.bgColor} onChange={e => setForm({...form, bgColor: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Category</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none"
                    value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-xl transition text-sm">
                    {saving ? 'Saving...' : editId ? 'Update Ad' : 'Create Ad'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-xl transition text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ads table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-800 rounded animate-pulse" />)}</div>
          ) : ads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No ads yet. Create one!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    {['Ad','Brand','Duration','Coins','Views','Status','Actions'].map(h => (
                      <th key={h} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ads.map(ad => (
                    <tr key={ad._id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ backgroundColor: ad.bgColor || '#00baf2' }}>
                            {CAT_EMOJI[ad.category] || '📢'}
                          </div>
                          <p className="text-sm text-white font-medium truncate max-w-[130px]">{ad.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{ad.brand}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{ad.duration}s</td>
                      <td className="px-4 py-3 text-sm font-bold text-yellow-400">{ad.coinReward} 🪙</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{ad.totalViews || 0}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggle(ad._id, ad.isActive)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${ad.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(ad)} className="text-xs text-primary-400 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(ad._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
