'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";

interface ShipModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShipModal({ orderId, onClose, onSuccess }: ShipModalProps) {
  const { data: session } = useSession();
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/orders/ship`, {
        method: 'PO
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
       
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          trackingNumber: tracking,
          carrier
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to update shipping. Try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Ship Order 📦</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Courier Name</label>
            <input 
              type="text" required
              placeholder="e.g. Delhivery, BlueDart"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#FFC629]"
              value={carrier}
              onChange={e => setCarrier(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tracking Number</label>
            <input 
              type="text" required
              placeholder="e.g. 1234567890"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#FFC629]"
              value={tracking}
              onChange={e => setTracking(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-bold text-black bg-[#FFC629] hover:bg-[#E5B225]"
            >
              {loading ? 'Saving...' : 'Mark Shipped'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}