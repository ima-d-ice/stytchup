import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { API_URL, DEMO_MODE } from '../../lib/api';

export default function ShipModal({ orderId, onClose, onSuccess }) {
  const { token } = useAuth();
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (DEMO_MODE) {
      window.setTimeout(() => {
        setLoading(false);
        onSuccess?.();
        onClose?.();
      }, 500);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId, trackingNumber: tracking, carrier }),
      });
      if (res.ok) {
        onSuccess?.();
        onClose?.();
      } else {
        alert('Failed to update shipping. Try again.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border border-line bg-paper p-6 md:p-8 animate-rise">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Fulfilment</p>
            <h2 className="display text-3xl leading-none tracking-[-0.02em]">Mark as shipped</h2>
          </div>
          <button type="button" onClick={onClose} className="text-ink/40 transition-colors hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ship-carrier" className="field-label">
              Courier
            </label>
            <input
              id="ship-carrier"
              type="text"
              required
              placeholder="Delhivery, Blue Dart…"
              className="field"
              value={carrier}
              onChange={(event) => setCarrier(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="ship-tracking" className="field-label">
              Tracking number
            </label>
            <input
              id="ship-tracking"
              type="text"
              required
              placeholder="AWB / tracking reference"
              className="field"
              value={tracking}
              onChange={(event) => setTracking(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-yellow flex-1">
              {loading ? 'Saving…' : 'Mark shipped'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
