import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Checking() {
  return (
    <div className="container-shop flex min-h-[40vh] items-center justify-center py-20">
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">Checking access…</p>
    </div>
  );
}

export function RequireAuth() {
  const { status } = useAuth();
  if (status === 'loading') return <Checking />;
  if (status !== 'authenticated') return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { user, status } = useAuth();
  if (status === 'loading') return <Checking />;
  if (status !== 'authenticated') return <Navigate to="/login" replace />;
  if ((user?.role || '').toUpperCase() !== 'ADMIN') return <Navigate to="/" replace />;
  return <Outlet />;
}
