'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { 
  RazorpayOptions, 
  RazorpaySuccessResponse, 
  RazorpayErrorResponse 
} from '@/types/razorpay'; 

interface RazorpayButtonProps {
  amount: number;
  sourceId: string;
  type: 'CATALOG' | 'CHAT_OFFER';
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
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key) {
      alert("Razorpay Key is missing");
      return;
    }

    // 1. RETRIEVE TOKEN (Adjust 'token' to whatever key you use in login)
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("You must be logged in to pay.");
        return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      // 2. CREATE ORDER (Attach Token Here)
      const res = await fetch(`${apiUrl}/payments/create-order`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <--- FIX IS HERE
        },
        // credentials: 'include', // You can likely remove this if relying on headers
        body: JSON.stringify({ amount, sourceId, type }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Order Creation Error:", err);
        alert(err.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      const orderData = await res.json();

      const options: RazorpayOptions = {
        key: key, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StytchUp",
        description: "Secure Payment",
        order_id: orderData.id,
        
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            // 3. VERIFY PAYMENT (Attach Token Here too if the route is protected)
            const verifyRes = await fetch(`${apiUrl}/payments/verify`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` // <--- FIX IS HERE TOO
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId
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
            console.error(err);
            alert("Server error during verification");
          }
        },
        theme: { color: "#FFC629" },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: RazorpayErrorResponse) {
        setLoading(false);
        alert(`Payment Failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        id="razorpay-js" 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload" 
      />
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