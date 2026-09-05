import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function RequireAuth() {
  const { status } = useAuth();
  if (status === 'loading') return <div className="p-10 text-center">Loading…</div>;
  if (status !== 'authenticated') return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { user, status } = useAuth();
  if (status === 'loading') return <div className="p-10 text-center">Loading…</div>;
  if (status !== 'authenticated') return <Navigate to="/login" replace />;
  if ((user?.role || '').toUpperCase() !== 'ADMIN') return <Navigate to="/" replace />;
  return <Outlet />;
}
