import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ShipModal from '../components/dashboard/ShipModal';
import { useOrderSocket } from '../utils/useOrderSocket';
import { API_URL } from '../lib/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState(null);

  useOrderSocket({
    token,
    orderIds: orders.map((o) => o.id),
    onUpdate: ({ orderId, status }) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    },
  });

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders/designer-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Designer Dashboard</h1>
            <p className="text-gray-500">Manage your active orders and shipments.</p>
          </div>
          <Link to="/designs/add" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-all">
            + New Design
          </Link>
        </header>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400">No active orders right now.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8">
                <div className="flex gap-4 lg:w-1/3">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {order.designSnapshot?.image ? (
                      <img src={order.designSnapshot.image} alt="Design" className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{order.designSnapshot.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-5 w-5 rounded-full bg-gray-200 overflow-hidden relative">
                        {order.buyer.profile?.avatarUrl && <img src={order.buyer.profile.avatarUrl} alt="Buyer" className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-xs text-gray-500">{order.buyer.name || order.buyer.email}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="lg:w-1/3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Measurements</h4>
                  {order.status === 'AWAITING_REQUIREMENTS' ? (
                    <div className="flex items-center justify-center h-full pb-4 text-center">
                      <p className="text-sm text-red-500 font-medium animate-pulse">⏳ Waiting for customer to submit sizes...</p>
                    </div>
                  ) : order.customerMeasurements ? (
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                      <p><span className="font-bold">Chest:</span> {order.customerMeasurements.chest}</p>
                      <p><span className="font-bold">Waist:</span> {order.customerMeasurements.waist}</p>
                      <p><span className="font-bold">Hips:</span> {order.customerMeasurements.hips}</p>
                      <p><span className="font-bold">Height:</span> {order.customerMeasurements.height}</p>
                      {order.customerMeasurements.notes && (
                        <p className="col-span-2 mt-2 text-xs italic text-gray-500 border-t border-gray-200 pt-2">&quot;{order.customerMeasurements.notes}&quot;</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No measurements available</p>
                  )}
                </div>

                <div className="lg:w-1/3 flex flex-col justify-center items-end gap-3">
                  <div
                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${
                      order.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </div>

                  {order.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => setSelectedOrderForShipping(order.id)}
                      className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all"
                    >
                      Ship Item 🚚
                    </button>
                  )}

                  {order.status === 'SHIPPED' && <p className="text-xs text-gray-400">Waiting for customer confirmation</p>}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedOrderForShipping && (
          <ShipModal
            orderId={selectedOrderForShipping}
            onClose={() => setSelectedOrderForShipping(null)}
            onSuccess={() => {
              fetchOrders();
            }}
          />
        )}
      </div>
    </div>
  );
}
