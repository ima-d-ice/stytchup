'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';

interface Order {
  id: string;
  status: 'PENDING' | 'AWAITING_REQUIREMENTS' | 'IN_PROGRESS' | 'SHIPPED' | 'COMPLETED';
  totalAmount: number;
  designSnapshot: {
    title: string;
    image: string;
    price: number;
  };
  trackingNumber?: string;
  shippingCarrier?: string;
}

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/orders/my-orders`, { 
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(err => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, [session]);

  const handleConfirmDelivery = async (orderId: string) => {
    if(!confirm("Please confirm you have received the physical package.")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/orders/complete`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) window.location.reload(); 
    } catch (e) {
      alert("Failed to confirm delivery");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-yellow-50/50">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Your Orders</h1>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-6 text-lg">No active orders found.</p>
              <Link href="/designs" className="inline-block bg-[#FFC629] text-black px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-[#E5B225] transition-all transform hover:-translate-y-1">
                Start Exploring
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-4xl p-6 shadow-xl shadow-gray-100 border border-gray-100 flex flex-col md:flex-row gap-6 items-start transition hover:shadow-2xl hover:shadow-gray-200/50 duration-300">
                
                {/* Design Image - Bumble Rounded */}
                <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner">
                  {order.designSnapshot?.image && (
                    <Image 
                      src={order.designSnapshot.image} 
                      alt={order.designSnapshot.title || "Design"}
                      fill className="object-cover"
                    />
                  )}
                </div>

                {/* Info Column */}
                <div className="flex-1 w-full flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900">{order.designSnapshot?.title || "Custom Order"}</h3>
                      <p className="text-gray-400 text-xs mt-1 font-mono tracking-wide">ID: {order.id.slice(-8)}</p>
                    </div>
                    <span className="font-black text-xl text-gray-900 bg-yellow-100 px-3 py-1 rounded-lg">
                      ₹{order.totalAmount / 100}
                    </span>
                  </div>

                  {/* Status Bar */}
                  <div className="mt-6 pt-4 border-t border-gray-50">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <StatusBadge status={order.status} />
                        
                        {/* --- DYNAMIC ACTION BUTTONS --- */}
                        
                        {/* 1. If Waiting for Measurements -> Show 'Submit' button */}
                        {order.status === 'AWAITING_REQUIREMENTS' && (
                            <Link 
                            href={`/orders/${order.id}/submit-requirements`}
                            className="inline-flex items-center px-6 py-2 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition-all shadow-md hover:shadow-lg animate-pulse"
                            >
                            ⚠️ Submit Measurements
                            </Link>
                        )}

                        {/* 2. If Shipped -> Show 'Confirm Receipt' button */}
                        {order.status === 'SHIPPED' && (
                            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Carrier</p>
                                    <p className="text-sm font-bold text-gray-800">{order.shippingCarrier}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Tracking</p>
                                    <p className="text-sm font-mono text-gray-800">{order.trackingNumber}</p>
                                </div>
                                <button 
                                    onClick={() => handleConfirmDelivery(order.id)}
                                    className="ml-2 px-5 py-2 bg-black text-white rounded-full font-bold text-xs hover:bg-gray-800 transition-all shadow-md"
                                >
                                    Confirm Receipt
                                </button>
                            </div>
                        )}
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Status Badge - Bumble Style
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-500",
    AWAITING_REQUIREMENTS: "bg-red-50 text-red-600 border border-red-100",
    IN_PROGRESS: "bg-yellow-50 text-yellow-700 border border-[#FFC629]",
    SHIPPED: "bg-blue-50 text-blue-700 border border-blue-100",
    COMPLETED: "bg-green-50 text-green-700 border border-green-100",
  };

  const labels: Record<string, string> = {
    PENDING: "Processing",
    AWAITING_REQUIREMENTS: "Action Needed",
    IN_PROGRESS: "In Production",
    SHIPPED: "Shipped",
    COMPLETED: "Delivered",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${styles[status] || "bg-gray-100"}`}>
      {labels[status] || status.replace('_', ' ')}
    </span>
  );
}