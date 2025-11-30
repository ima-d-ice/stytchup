'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function SubmitRequirementsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Measurement State
  const [form, setForm] = useState({
    chest: '',
    waist: '',
    hips: '',
    height: '',
    unit: 'cm', // default unit
    notes: ''
  });

  useEffect(() => {
    // 1. Check if valid order exists
    // In a real app, you'd fetch the order status here to ensure it is 'AWAITING_REQUIREMENTS'
    setLoading(false);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:4000/orders/submit-measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookie auth
        body: JSON.stringify({
          orderId: id,
          measurements: form
        }),
      });

      if (res.ok) {
        // Success! Redirect to orders page
        router.push('/orders'); 
      } else {
        alert("Failed to save measurements. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-6 flex justify-center items-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 border-2 border-[#FFC629]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">One Last Step! 📏</h1>
          <p className="text-gray-500">
            Your payment is secure. Now, please provide your measurements so the designer can start working.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
          
          {/* Unit Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-full inline-flex">
              {['cm', 'inches'].map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setForm({...form, unit})}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    form.unit === unit ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Chest</label>
              <input 
                type="number" required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#FFC629] outline-none transition-all"
                placeholder={`e.g. ${form.unit === 'cm' ? '90' : '36'}`}
                value={form.chest}
                onChange={e => setForm({...form, chest: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Waist</label>
              <input 
                type="number" required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#FFC629] outline-none transition-all"
                placeholder={`e.g. ${form.unit === 'cm' ? '70' : '28'}`}
                value={form.waist}
                onChange={e => setForm({...form, waist: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Hips</label>
              <input 
                type="number" required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#FFC629] outline-none transition-all"
                placeholder={`e.g. ${form.unit === 'cm' ? '95' : '38'}`}
                value={form.hips}
                onChange={e => setForm({...form, hips: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Total Height</label>
              <input 
                type="number" required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#FFC629] outline-none transition-all"
                placeholder={`e.g. ${form.unit === 'cm' ? '165' : '65'}`}
                value={form.height}
                onChange={e => setForm({...form, height: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Special Notes (Optional)</label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-[#FFC629] outline-none transition-all resize-none"
              placeholder="e.g. I have broad shoulders, please adjust the fit."
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-[#FFC629] hover:bg-[#E5B225] text-black font-black text-lg shadow-[0_4px_14px_rgba(255,198,41,0.4)] transition-all transform hover:scale-[1.02]"
          >
            {submitting ? 'Submitting...' : 'Submit Measurements & Start Order'}
          </button>

        </form>
      </div>
    </div>
  );
}