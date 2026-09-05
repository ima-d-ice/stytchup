import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export default function UserMenu() {
  const { user, token, updateRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Log in
      </Link>
    );
  }

  const userRole = user.role?.toUpperCase() || 'CUSTOMER';

  const handleSwitch = async () => {
    const targetRole = userRole === 'CUSTOMER' ? 'designer' : 'customer';
    try {
      await updateRole(targetRole);
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch role', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-2 rounded-full border-transparent">
        <div className="w-6 h-6 text-gray-600 hover:text-yellow-500">
          <User className="text-2xl" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-7 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            {user.role && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  userRole === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {userRole}
              </span>
            )}
          </div>

          <ul className="py-1">
            {userRole !== 'CUSTOMER' && (
              <li>
                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </li>
            )}
            {userRole === 'ADMIN' && (
              <li>
                <Link to="/admin" className="block px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50 transition" onClick={() => setIsOpen(false)}>
                  Admin Panel
                </Link>
              </li>
            )}
            <li>
              <Link to="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition" onClick={() => setIsOpen(false)}>
                Account Settings
              </Link>
            </li>
          </ul>

          <div className="border-t border-gray-100 py-1">
            <button onClick={handleSwitch} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
              Switch to {userRole === 'CUSTOMER' ? 'Designer' : 'Customer'}
            </button>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/');
              }}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
