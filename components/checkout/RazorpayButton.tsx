'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  sourceId: string;
  type: 'CATALOG' | 'CHAT_OFFER'; // 👈 Updated Type
  buttonText?: string;
  onSuccess?: () => void;
}

export default function RazorpayButton({ 
  amount, 
  sourceId, 
  type, 
  buttonText = "Pay Now",
  onSuccess 
}: RazorpayButtonProps) {
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create Order
      const res = await fetch('http://localhost:4000/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount, sourceId, type }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      const orderData = await res.json(); // Contains razorpay order_id AND dbOrderId

      // 2. Open Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StychUp",
        description: "Secure Payment",
        order_id: orderData.id, // Razorpay ID
        
        handler: async function (response: any) {
          try {
            // 3. Verify
            const verifyRes = await fetch('http://localhost:4000/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId // 👈 Sending the REAL Order ID
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              if (onSuccess) onSuccess();
              else router.push('/orders');
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            alert("Server error during verification");
          }
        },
        theme: { color: "#FFC629" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function () {
        setLoading(false);
        alert("Payment Failed");
      });

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Script id="razorpay-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:bg-gray-800 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
      >
        {loading ? "Processing..." : buttonText}
      </button>
    </>
  );
}