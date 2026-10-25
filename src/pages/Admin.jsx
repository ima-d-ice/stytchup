import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import StatusLabel from '../components/ui/StatusLabel';
import { API_URL, DEMO_MODE, getAdminData } from '../lib/api';
import { formatINR } from '../utils/pricing';

const TABS = ['orders', 'users', 'designs'];

function useAdminData(kind) {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const result = await getAdminData(kind, token);
      setData(Array.isArray(result) ? result : []);
    } catch {
      setError('Failed to load. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, kind]);

  return { data, loading, error, reload: load, token };
}

async function adminAction(path, method, token, body) {
  if (DEMO_MODE) return { ok: true };
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Action failed');
  }
  return res.json();
}

export default function Admin() {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const role = user?.role?.toUpperCase?.() || '';

  useEffect(() => {
    if (status === 'unauthenticated') navigate('/login');
    else if (status === 'authenticated' && role !== 'ADMIN') navigate('/');
  }, [status, role, navigate]);

  if (status === 'loading') {
    return <div className="container-shop py-24 text-center text-sm text-ink/40">Loading…</div>;
  }
  if (role !== 'ADMIN') {
    return <div className="container-shop py-24 text-center text-sm text-ink/40">Checking permissions…</div>;
  }

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Admin' }]}
          eyebrow="Operations"
          title="Admin"
          intro="Users, orders, and designs across the marketplace."
        >
          <a
            href={`${API_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="link-line text-[10px] uppercase tracking-[0.16em] text-ink/40 hover:text-ink"
          >
            API docs
          </a>
        </PageHeader>

        <div className="flex items-center gap-8 border-b border-line py-4">
          {TABS.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTab(entry)}
              className={`relative pb-1 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors ${
                tab === entry ? 'text-ink' : 'text-ink/35 hover:text-ink'
              }`}
            >
              {entry}
              {tab === entry && <span className="absolute inset-x-0 -bottom-[5px] h-[2px] bg-brand" aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className="py-10">
          {tab === 'orders' && <OrdersTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'designs' && <DesignsTab />}
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const { data: orders, loading, error, reload, token } = useAdminData('orders');

  const act = async (id, action) => {
    if (!window.confirm(`${action} order ${id.slice(-8)}?`)) return;
    try {
      await adminAction(`/admin/orders/${id}/${action}`, 'POST', token);
      if (!DEMO_MODE) reload();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p className="text-sm text-ink/40">Loading orders…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="border-t border-line">
      {orders.map((order) => (
        <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
          <div>
            <p className="text-[13px] font-medium text-ink">
              {order.design?.title || order.designSnapshot?.title || 'Custom order'}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/35">
              {order.buyer?.email} · {formatINR(order.totalAmount)}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <StatusLabel status={order.status} />
            <div className="flex gap-2">
              <button type="button" onClick={() => act(order.id, 'cancel')} className="border border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-red-500 hover:text-red-600">
                Cancel
              </button>
              <button type="button" onClick={() => act(order.id, 'refund')} className="border border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-ink hover:text-ink">
                Refund
              </button>
            </div>
          </div>
        </div>
      ))}
      {orders.length === 0 && <p className="py-16 text-center text-sm text-ink/35">No orders yet.</p>}
    </div>
  );
}

function UsersTab() {
  const { data: users, loading, error, reload, token } = useAdminData('users');

  const setRole = async (id, role) => {
    try {
      await adminAction(`/admin/users/${id}/role`, 'POST', token, { role });
      if (!DEMO_MODE) reload();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p className="text-sm text-ink/40">Loading users…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="border-t border-line">
      {users.map((user) => (
        <div key={user.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
          <div>
            <p className="text-[13px] font-medium text-ink">
              {user.name || 'Unnamed'}
              <span className="ml-2 font-mono text-[9px] text-ink/25">{user.id.slice(-6)}</span>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/35">{user.email}</p>
          </div>
          <select
            value={user.role}
            onChange={(event) => setRole(user.id, event.target.value)}
            className="cursor-pointer border border-line bg-transparent px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-ink focus:border-ink focus:outline-none"
          >
            {['CUSTOMER', 'DESIGNER', 'ADMIN'].map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      ))}
      {users.length === 0 && <p className="py-16 text-center text-sm text-ink/35">No users yet.</p>}
    </div>
  );
}

function DesignsTab() {
  const { data: designs, loading, error, reload, token } = useAdminData('designs');

  const toggle = async (design) => {
    try {
      await adminAction(`/admin/designs/${design.id}/active`, 'PATCH', token, { isActive: !design.isActive });
      if (!DEMO_MODE) reload();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p className="text-sm text-ink/40">Loading designs…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="border-t border-line">
      {designs.map((design) => (
        <div key={design.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
          <div>
            <p className="text-[13px] font-medium text-ink">
              {design.title}
              {!design.isActive && <span className="ml-2 text-[9px] uppercase tracking-[0.14em] text-red-500">Hidden</span>}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/35">
              {design.designer?.email} · {formatINR(design.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle(design)}
            className="border border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-ink hover:text-ink"
          >
            {design.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ))}
      {designs.length === 0 && <p className="py-16 text-center text-sm text-ink/35">No designs yet.</p>}
    </div>
  );
}
