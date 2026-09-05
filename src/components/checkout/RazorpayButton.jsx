import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { API_URL } from '../../lib/api';

export default function RazorpayButton({ sourceId, type, buttonText = 'Pay Now', onSuccess }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (document.getElementById('razorpay-js')) return;
    const s = document.createElement('script');
    s.id = 'razorpay-js';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const handlePayment = async () => {
    if (!token) {
      alert('Please login to make a payment');
      return;
    }
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      alert('Razorpay Key is missing');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sourceId, type }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to initiate payment');
        setLoading(false);
        return;
      }
      const orderData = await res.json();
      const options = {
        key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'StytchUp',
        description: 'Secure Payment',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_URL}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (onSuccess) onSuccess();
              else navigate('/orders');
            } else {
              alert('Payment verification failed');
            }
          } catch {
            alert('Server error during verification');
          }
        },
        theme: { color: '#FFC629' },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setLoading(false);
        alert(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Something went wrong. Check console.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-black text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:bg-gray-800 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
    >
      {loading ? 'Processing...' : buttonText}
    </button>
  );
}
