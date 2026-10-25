import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useOrderSocket } from '../utils/useOrderSocket';
import StatusLabel from '../components/ui/StatusLabel';
import PageHeader from '../components/ui/PageHeader';
import { formatINR } from '../utils/pricing';
import { API_URL, DEMO_MODE, getMyOrders } from '../lib/api';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useOrderSocket({
    token,
    orderIds: orders.map((order) => order.id),
    onUpdate: ({ orderId, status }) => {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    },
  });

  useEffect(() => {
    if (!token) return;
    let active = true;
    getMyOrders(token)
      .then((data) => {
        if (active && Array.isArray(data)) setOrders(data);
      })
      .catch((error) => console.error('Failed to load orders:', error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleConfirmDelivery = async (orderId) => {
    if (!window.confirm('Please confirm you have received the package.')) return;

    if (DEMO_MODE) {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'COMPLETED' } : order)));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'COMPLETED' } : order)));
      }
    } catch {
      alert('Failed to confirm delivery');
    }
  };

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Orders' }]}
          eyebrow="Client area"
          title="Orders"
          intro="Every piece here was cut after you ordered it. Follow production, share measurements, and confirm delivery."
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">
            {loading ? 'Loading' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
          </p>
        </PageHeader>

        <div className="py-10 md:py-14">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex animate-pulse gap-5 border-b border-line pb-6">
                  <div className="h-32 w-24 bg-mist" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-3 w-1/3 bg-mist" />
                    <div className="h-3 w-1/4 bg-mist" />
                    <div className="h-3 w-1/5 bg-mist" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="border-y border-line py-24 text-center">
              <p className="font-display text-3xl tracking-[-0.01em]">No orders yet.</p>
              <p className="mt-3 text-sm text-ink/45">When you order a piece, it will appear here.</p>
              <Link to="/designs" className="btn mt-8">
                Explore designs
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
              </Link>
            </div>
          ) : (
            <div>
              {orders.map((order) => {
                const image = order.designSnapshot?.image || order.design?.imageUrl;
                const title = order.designSnapshot?.title || order.design?.title || 'Custom commission';

                return (
                  <article key={order.id} className="grid gap-5 border-b border-line py-6 md:grid-cols-12 md:items-center">
                    <div className="md:col-span-2">
                      <Link to={order.designId ? `/designs/${order.designId}` : '/designs'} className="block aspect-[3/4] w-24 overflow-hidden bg-mist">
                        {image ? (
                          <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[8px] uppercase tracking-[0.14em] text-ink/25">
                            No image
                          </div>
                        )}
                      </Link>
                    </div>

                    <div className="md:col-span-4">
                      <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">{title}</h2>
                      <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-ink/35">
                        Order {order.id.slice(-8)} · {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="mt-3 text-sm text-ink/70">{formatINR(order.totalAmount)}</p>
                    </div>

                    <div className="md:col-span-3">
                      <StatusLabel status={order.status} />
                      {order.status === 'SHIPPED' && order.trackingNumber && (
                        <div className="mt-3 text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ink/40">
                          <p>{order.shippingCarrier || 'Courier'}</p>
                          <p className="mt-1 font-mono text-[10px] normal-case tracking-normal text-ink/60">
                            {order.trackingNumber}
                          </p>
                        </div>
                      )}
                      {order.status === 'AWAITING_REQUIREMENTS' && (
                        <p className="mt-3 max-w-[180px] text-[10px] leading-relaxed text-ink/40">
                          Add your measurements so the designer can begin.
                        </p>
                      )}
                    </div>

                    <div className="flex md:col-span-3 md:justify-end">
                      {order.status === 'AWAITING_REQUIREMENTS' && (
                        <Link to={`/orders/${order.id}/submit-requirements`} className="btn-yellow w-full md:w-auto">
                          Submit measurements
                        </Link>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button type="button" onClick={() => handleConfirmDelivery(order.id)} className="btn-outline w-full md:w-auto">
                          Confirm receipt
                        </button>
                      )}
                      {order.status === 'IN_PROGRESS' && (
                        <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">In the atelier</p>
                      )}
                      {order.status === 'COMPLETED' && (
                        <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">Thank you</p>
                      )}
                      {order.status === 'PENDING' && (
                        <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">Awaiting payment</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
