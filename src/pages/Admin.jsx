import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../lib/api';

function useAdminFetch(path) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setError('Forbidden: admin role required');
        return;
      }
      if (!res.ok) throw new Error('fetch failed');
      setData(await res.json());
    } catch {
      setError('Failed to load. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, path]);
  return { data, loading, error, reload: load, token };
}

async function adminAction(path, method, token, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Action failed');
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

  if (status === 'loading') return <div className="p-10 text-center">Loading…</div>;
  if (role !== 'ADMIN') return <div className="p-10 text-center">Checking permissions…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mb-6">Users, orders and designs across the marketplace.</p>
        <div className="flex gap-2 mb-6">
          {['orders', 'users', 'designs'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full font-bold capitalize ${tab === t ? 'bg-black text-white' : 'bg-white text-gray-600 border'}`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === 'orders' && <OrdersTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'designs' && <DesignsTab />}
        <p className="mt-8 text-xs text-gray-400">
          API docs:{' '}
          <a className="underline" href={`${API_URL}/docs`} target="_blank" rel="noreferrer">
            {API_URL}/docs
          </a>
        </p>
      </div>
    </div>
  );
}

function OrdersTab() {
  const { data: orders, loading, error, reload, token } = useAdminFetch('/admin/orders');
  const act = async (id, action) => {
    if (!confirm(`${action} order ${id.slice(-8)}?`)) return;
    try {
      await adminAction(`/admin/orders/${id}/${action}`, 'POST', token);
      reload();
    } catch (e) {
      alert(e.message);
    }
  };
  if (loading) return <p>Loading orders…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="space-y-3">
      {(orders || []).map((o) => (
        <div key={o.id} className="bg-white rounded-2xl p-4 border flex flex-wrap items-center gap-4 justify-between">
          <div>
            <p className="font-bold">{o.design?.title || o.designSnapshot?.title || 'Custom order'}</p>
            <p className="text-xs text-gray-500">
              {o.buyer?.email} · ₹{(o.totalAmount / 100).toFixed(0)} · <b>{o.status}</b>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => act(o.id, 'cancel')} className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              Cancel
            </button>
            <button onClick={() => act(o.id, 'refund')} className="px-4 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border">
              Refund
            </button>
          </div>
        </div>
      ))}
      {(!orders || orders.length === 0) && <p className="text-gray-400">No orders yet.</p>}
    </div>
  );
}

function UsersTab() {
  const { data: users, loading, error, reload, token } = useAdminFetch('/admin/users');
  const setRole = async (id, role) => {
    try {
      await adminAction(`/admin/users/${id}/role`, 'POST', token, { role });
      reload();
    } catch (e) {
      alert(e.message);
    }
  };
  if (loading) return <p>Loading users…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="space-y-3">
      {(users || []).map((u) => (
        <div key={u.id} className="bg-white rounded-2xl p-4 border flex flex-wrap items-center gap-4 justify-between">
          <div>
            <p className="font-bold">
              {u.name || 'Unnamed'} <span className="text-xs font-mono text-gray-400">{u.id.slice(-6)}</span>
            </p>
            <p className="text-xs text-gray-500">
              {u.email} · <b>{u.role}</b>
            </p>
          </div>
          <select value={u.role} onChange={(e) => setRole(u.id, e.target.value)} className="border rounded-full px-3 py-1.5 text-sm font-bold">
            {['CUSTOMER', 'DESIGNER', 'ADMIN'].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function DesignsTab() {
  const { data: designs, loading, error, reload, token } = useAdminFetch('/admin/designs');
  const toggle = async (d) => {
    try {
      await adminAction(`/admin/designs/${d.id}/active`, 'PATCH', token, { isActive: !d.isActive });
      reload();
    } catch (e) {
      alert(e.message);
    }
  };
  if (loading) return <p>Loading designs…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="space-y-3">
      {(designs || []).map((d) => (
        <div key={d.id} className="bg-white rounded-2xl p-4 border flex flex-wrap items-center gap-4 justify-between">
          <div>
            <p className="font-bold">
              {d.title} {!d.isActive && <span className="text-xs text-red-500">(hidden)</span>}
            </p>
            <p className="text-xs text-gray-500">
              {d.designer?.email} · ₹{(d.price / 100).toFixed(0)}
            </p>
          </div>
          <button onClick={() => toggle(d)} className="px-4 py-1.5 rounded-full text-xs font-bold bg-gray-100 border">
            {d.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ))}
    </div>
  );
}
