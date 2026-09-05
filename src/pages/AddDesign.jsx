import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toPaise } from '../utils/pricing';
import { API_URL } from '../lib/api';

export default function AddDesign() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    type: 'CATALOG',
    material: '',
    sizeGuide: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) return alert('Please provide an image URL first');
    setLoading(true);
    const priceInPaise = toPaise(form.price);
    try {
      const res = await fetch(`${API_URL}/designs/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: priceInPaise }),
      });
      if (res.ok) {
        navigate('/dashboard');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to create design');
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex justify-center font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-black text-gray-900 mb-2">New Creation</h1>
        <p className="text-gray-500 mb-8">Share your latest design with the world.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-8 bg-gray-50 hover:bg-yellow-50 hover:border-[#FFC629] transition-all duration-300">
            {form.imageUrl ? (
              <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden shadow-md">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: '' })}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-red-50 text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-center w-full">
                <div className="mb-4 p-4 bg-white rounded-full shadow-sm inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 font-medium text-gray-700 focus:ring-2 focus:ring-[#FFC629] outline-none"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-3 font-medium">Paste a hosted image URL. For direct uploads, wire Express POST /uploads.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Title</label>
                <input
                  required
                  className="w-full bg-gray-50 border-0 rounded-xl p-4 font-semibold text-gray-700 focus:ring-2 focus:ring-[#FFC629] transition-all"
                  placeholder="e.g. Summer Linen Dress"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Price (₹)</label>
                <input
                  required
                  type="number"
                  className="w-full bg-gray-50 border-0 rounded-xl p-4 font-semibold text-gray-700 focus:ring-2 focus:ring-[#FFC629] transition-all"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Description</label>
              <textarea
                className="w-full bg-gray-50 border-0 rounded-xl p-4 font-medium text-gray-700 h-32 resize-none focus:ring-2 focus:ring-[#FFC629] transition-all"
                placeholder="Describe the style, fit, and inspiration..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Material</label>
                <input
                  className="w-full bg-gray-50 border-0 rounded-xl p-4 font-medium text-gray-700 focus:ring-2 focus:ring-[#FFC629] transition-all"
                  placeholder="e.g. 100% Organic Cotton"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Size Guide / Notes</label>
                <input
                  className="w-full bg-gray-50 border-0 rounded-xl p-4 font-medium text-gray-700 focus:ring-2 focus:ring-[#FFC629] transition-all"
                  placeholder="e.g. True to size, loose fit"
                  value={form.sizeGuide}
                  onChange={(e) => setForm({ ...form, sizeGuide: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#FFC629] text-black font-black text-lg shadow-lg shadow-yellow-400/30 hover:bg-[#E5B225] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing...' : 'Publish Design'}
          </button>
        </form>
      </div>
    </div>
  );
}
