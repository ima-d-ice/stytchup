import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../lib/api';

const AuthContext = createContext(null);

const USER_KEY = 'stytchup_user';
const TOKEN_KEY = 'stytchup_token';

function loadStored() {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    const token = localStorage.getItem(TOKEN_KEY) || null;
    if (user && token) return { user, token };
  } catch {
    /* ignore */
  }
  return { user: null, token: null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStored().user);
  const [token, setToken] = useState(() => loadStored().token);
  const [status, setStatus] = useState('loading'); // loading | authenticated | unauthenticated

  useEffect(() => {
    setStatus(user && token ? 'authenticated' : 'unauthenticated');
  }, [user, token]);

  const persist = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser && nextToken) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  // Credentials login -> Express POST /auth/login {email,password} -> {user, token}
  const login = useCallback(
    async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Invalid email or password');
      persist(data.user, data.token);
      return data;
    },
    [persist]
  );

  // Google login: frontend gets {email, name} from Google Identity Services,
  // then syncs via Express POST /auth/google-sync (same as NextAuth jwt() did).
  const googleLogin = useCallback(
    async ({ email, name }) => {
      const res = await fetch(`${API_URL}/auth/google-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Google login failed');
      persist(data.user, data.token);
      return data;
    },
    [persist]
  );

  const updateRole = useCallback(
    async (targetRole) => {
      // targetRole: 'designer' | 'customer' (lowercase, backend expectation)
      const res = await fetch(`${API_URL}/auth/change-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to switch role');
      const nextUser = { ...user, role: data.role || targetRole.toUpperCase() };
      persist(nextUser, token);
      return nextUser;
    },
    [persist, token, user]
  );

  const logout = useCallback(() => persist(null, null), [persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      // NextAuth-compatible aliases so ported pages need minimal changes
      session: user ? { user, accessToken: token } : null,
      data: user ? { user, accessToken: token } : null,
      status,
      login,
      googleLogin,
      updateRole,
      logout,
      signOut: logout,
    }),
    [user, token, status, login, googleLogin, updateRole, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Back-compat shim for ported `useSession()` calls
export function useSession() {
  const { data, status, updateRole } = useAuth();
  return { data, status, update: async ({ role } = {}) => role };
}
