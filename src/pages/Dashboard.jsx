import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import ShipModal from '../components/dashboard/ShipModal';
import { useOrderSocket } from '../utils/useOrderSocket';
import PageHeader from '../components/ui/PageHeader';
import StatusLabel from '../components/ui/StatusLabel';
import { formatINR } from '../utils/pricing';
import { DEMO_MODE, getDesignerOrders } from '../lib/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState(null);

  useOrderSocket({
    token,
    orderIds: orders.map((order) => order.id),
    onUpdate: ({ orderId, status }) => {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    },
  });

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const data = await getDesignerOrders(token);
      if (Array.isArray(data)) setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleShipped = () => {
    if (DEMO_MODE && selectedOrderForShipping) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrderForShipping
            ? { ...order, status: 'SHIPPED', shippingCarrier: 'Blue Dart', trackingNumber: 'BD-DEMO-001' }
            : order
        )
      );
      return;
    }
    fetchOrders();
  };

  const counts = {
    active: orders.filter((order) => ['IN_PROGRESS', 'AWAITING_REQUIREMENTS'].includes(order.status)).length,
    waiting: orders.filter((order) => order.status === 'AWAITING_REQUIREMENTS').length,
    shipped: orders.filter((order) => order.status === 'SHIPPED').length,
  };

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Studio' }]}
          eyebrow="Designer studio"
          title="Dashboard"
          intro="The work in progress, the measurements, and the shipments — all in one place."
        >
          <Link to="/designs/add" className="btn">
            <Plus className="h-3.5 w-3.5" strokeWidth={1.4} />
            New design
          </Link>
        </PageHeader>

        <div className="grid grid-cols-2 gap-0 border-b border-line md:grid-cols-4">
          {[
            { label: 'Active', value: counts.active },
            { label: 'Measurements', value: counts.waiting },
            { label: 'Shipped', value: counts.shipped },
            { label: 'Total', value: orders.length },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`py-6 ${index < 3 ? 'md:border-r md:border-line' : ''} ${index % 2 === 0 ? 'pr-4' : 'pl-4 md:pl-6'}`}
            >
              <p className="font-display text-4xl leading-none tracking-[-0.02em]">{loading ? '—' : stat.value}</p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-ink/35">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="py-10 md:py-14">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex animate-pulse gap-5 border-b border-line pb-6">
                  <div className="h-28 w-20 bg-mist" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-3 w-1/3 bg-mist" />
                    <div className="h-3 w-1/4 bg-mist" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="border-y border-line py-24 text-center">
              <p className="font-display text-3xl tracking-[-0.01em]">The studio is quiet.</p>
              <p className="mt-3 text-sm text-ink/45">New orders will appear here as they are placed.</p>
              <Link to="/designs/add" className="btn mt-8">
                Publish a design
              </Link>
            </div>
          ) : (
            <div>
              {orders.map((order) => {
                const image = order.designSnapshot?.image || order.design?.imageUrl;
                const title = order.designSnapshot?.title || order.design?.title || 'Custom commission';
                const measurements = order.customerMeasurements;

                return (
                  <article key={order.id} className="grid gap-6 border-b border-line py-6 lg:grid-cols-12 lg:items-start">
                    <div className="flex gap-4 lg:col-span-4">
                      <Link to="/dashboard" className="block h-28 w-20 shrink-0 overflow-hidden bg-mist">
                        {image ? (
                          <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[8px] uppercase tracking-[0.14em] text-ink/25">
                            No image
                          </div>
                        )}
                      </Link>
                      <div>
                        <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">{title}</h2>
                        <p className="mt-2 text-[11px] text-ink/50">
                          {order.buyer?.name || order.buyer?.email || 'Client'}
                        </p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-ink/30">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="mt-3 text-sm text-ink/70">{formatINR(order.totalAmount)}</p>
                      </div>
                    </div>

                    <div className="lg:col-span-4">
                      <p className="eyebrow mb-2">Measurements</p>
                      {order.status === 'AWAITING_REQUIREMENTS' ? (
                        <p className="border-l-2 border-brand pl-3 text-[11px] leading-relaxed text-ink/45">
                          Waiting for the client to submit sizes.
                        </p>
                      ) : measurements ? (
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-ink/55">
                          <div className="flex justify-between gap-2 border-b border-line/70 pb-1">
                            <dt className="text-ink/35">Chest</dt>
                            <dd>{measurements.chest}</dd>
                          </div>
                          <div className="flex justify-between gap-2 border-b border-line/70 pb-1">
                            <dt className="text-ink/35">Waist</dt>
                            <dd>{measurements.waist}</dd>
                          </div>
                          <div className="flex justify-between gap-2 border-b border-line/70 pb-1">
                            <dt className="text-ink/35">Hips</dt>
                            <dd>{measurements.hips}</dd>
                          </div>
                          <div className="flex justify-between gap-2 border-b border-line/70 pb-1">
                            <dt className="text-ink/35">Height</dt>
                            <dd>{measurements.height}</dd>
                          </div>
                          {measurements.notes && (
                            <p className="col-span-2 mt-1 text-[10px] italic leading-relaxed text-ink/35">
                              &ldquo;{measurements.notes}&rdquo;
                            </p>
                          )}
                        </dl>
                      ) : (
                        <p className="text-[11px] text-ink/35">No measurements on file.</p>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
                      <StatusLabel status={order.status} />
                      {order.status === 'IN_PROGRESS' && (
                        <button type="button" onClick={() => setSelectedOrderForShipping(order.id)} className="btn w-full lg:w-auto">
                          Mark shipped
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ink/35">
                          {order.shippingCarrier || 'Courier'} · awaiting client
                        </p>
                      )}
                      {order.status === 'AWAITING_REQUIREMENTS' && (
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ink/35">Not started</p>
                      )}
                      {order.status === 'COMPLETED' && (
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ink/35">Completed</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedOrderForShipping && (
        <ShipModal
          orderId={selectedOrderForShipping}
          onClose={() => setSelectedOrderForShipping(null)}
          onSuccess={handleShipped}
        />
      )}
    </div>
  );
}
