import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export default function UserMenu() {
  const { user, updateRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!user) {
    return (
      <Link
        to="/login"
        className="hidden px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-ink/50 sm:inline-block"
      >
        Log in
      </Link>
    );
  }

  const userRole = user.role?.toUpperCase() || 'CUSTOMER';
  const firstName = user.name?.split(' ')[0] || 'Account';

  const handleSwitch = async () => {
    const targetRole = userRole === 'CUSTOMER' ? 'designer' : 'customer';
    try {
      await updateRole(targetRole);
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch role', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-ink transition-colors hover:text-ink/50"
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
        <span className="absolute right-1.5 top-1.5 h-1 w-1 bg-brand" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[280px] border border-line bg-paper animate-fade">
          <div className="border-b border-line px-5 py-4">
            <p className="text-sm font-medium text-ink">{user.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-ink/45">{user.email}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/50">
              <span className="h-1 w-1 bg-brand" aria-hidden="true" />
              {userRole}
            </p>
          </div>

          <div className="py-2">
            <Link
              to="/account-settings"
              onClick={() => setIsOpen(false)}
              className="block px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-ink/65 transition-colors hover:bg-mist hover:text-ink"
            >
              Account settings
            </Link>
            {userRole !== 'CUSTOMER' && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-ink/65 transition-colors hover:bg-mist hover:text-ink"
              >
                Studio dashboard
              </Link>
            )}
            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="block px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-ink/65 transition-colors hover:bg-mist hover:text-ink"
            >
              Orders
            </Link>
            <Link
              to="/inbox"
              onClick={() => setIsOpen(false)}
              className="block px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-ink/65 transition-colors hover:bg-mist hover:text-ink"
            >
              Inbox
            </Link>
            {userRole === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-ink transition-colors hover:bg-mist"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="border-t border-line py-2">
            <button
              type="button"
              onClick={handleSwitch}
              className="block w-full px-5 py-2.5 text-left text-[11px] uppercase tracking-[0.14em] text-ink/65 transition-colors hover:bg-mist hover:text-ink"
            >
              Switch to {userRole === 'CUSTOMER' ? 'designer' : 'customer'}
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/');
              }}
              className="block w-full px-5 py-2.5 text-left text-[11px] uppercase tracking-[0.14em] text-ink/45 transition-colors hover:bg-mist hover:text-ink"
            >
              Sign out
            </button>
          </div>

          <p className="border-t border-line px-5 py-3 text-[9px] uppercase tracking-[0.16em] text-ink/30">
            Signed in as {firstName}
          </p>
        </div>
      )}
    </div>
  );
}
