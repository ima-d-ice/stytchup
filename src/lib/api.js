import {
  demoAccounts,
  demoAdminData,
  demoConversations,
  demoCustomerOrders,
  demoDesignerOrders,
  demoDesigners,
  demoDesigns,
  demoMessages,
  getDemoAccountByEmail,
  getDemoAccountByToken,
  getDemoDesign,
  getDemoDesigner,
} from '../data/demo';

export { getDemoAccountByToken };

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
export const DEMO_FALLBACK = import.meta.env.VITE_DEMO_FALLBACK !== 'false';

export function authHeaders(token, extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function apiFetch(path, { token, ...options } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: authHeaders(token, options.headers),
  });
  return res;
}

const copy = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

async function getJson(path, { token, fallback, demoValue, label } = {}) {
  const demo = demoValue !== undefined ? demoValue : fallback;

  if (DEMO_MODE) return copy(demo);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error(`${label || path} failed with ${res.status}`);
    return await res.json();
  } catch (error) {
    if (DEMO_FALLBACK && demo !== undefined) {
      console.warn(`[StytchUp demo fallback] ${label || path}:`, error.message);
      return copy(demo);
    }
    throw error;
  }
}

export const getDesigns = () => getJson('/designs', { fallback: demoDesigns, label: 'Designs' });

export const getDesign = (id) =>
  getJson(`/designs/${id}`, { fallback: getDemoDesign(id), demoValue: getDemoDesign(id), label: 'Design' });

export const getDesigners = () =>
  getJson('/designers/', { fallback: demoDesigners, label: 'Designers' });

export const getDesigner = (id) =>
  getJson(`/designers/${id}`, {
    fallback: getDemoDesigner(id),
    demoValue: getDemoDesigner(id),
    label: 'Designer',
  });

export const getProfileSettings = (token) => {
  const account = getDemoAccountByToken(token);
  return getJson('/profile/settings', {
    token,
    fallback: {
      ...account.user,
      profile: account.profile,
    },
    label: 'Profile',
  });
};

export const getMyOrders = (token) =>
  getJson('/orders/my-orders', {
    token,
    fallback: demoCustomerOrders,
    label: 'Orders',
  });

export const getDesignerOrders = (token) =>
  getJson('/orders/designer-orders', {
    token,
    fallback: demoDesignerOrders,
    label: 'Designer orders',
  });

export const getConversations = (token) =>
  getJson('/inbox/list', {
    token,
    fallback: demoConversations,
    label: 'Inbox',
  });

export const getMessages = (conversationId, token) =>
  getJson(`/inbox/${conversationId}/messages`, {
    token,
    fallback: demoMessages,
    label: 'Messages',
  });

const ADMIN_PATHS = {
  orders: '/admin/orders',
  users: '/admin/users',
  designs: '/admin/designs',
};

export const getAdminData = (kind, token) =>
  getJson(ADMIN_PATHS[kind] || ADMIN_PATHS.orders, {
    token,
    fallback: demoAdminData[kind] || [],
    label: `Admin ${kind}`,
  });

export async function sendMessage(conversationId, body, token) {
  if (DEMO_MODE) {
    const account = getDemoAccountByToken(token);
    return {
      id: `demo-message-${Date.now()}`,
      conversationId,
      senderId: account.user.id,
      createdAt: new Date().toISOString(),
      ...body,
    };
  }
  const res = await fetch(`${API_URL}/inbox/message`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ conversationId, ...body }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function createConversation(targetUserId, token) {
  if (DEMO_MODE) return demoConversations[0];
  const res = await fetch(`${API_URL}/inbox/create`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ targetUserId }),
  });
  if (!res.ok) throw new Error('Failed to start conversation');
  return res.json();
}

export function demoLogin(email, password) {
  const account = getDemoAccountByEmail(email);
  if (!account || account.password !== password) {
    throw new Error('Invalid email or password');
  }
  return {
    user: account.user,
    token: `demo-token-${account.user.role.toLowerCase()}`,
    profile: account.profile,
  };
}

export const DEMO_CREDENTIALS = [
  { label: 'Customer', email: demoAccounts.customer.user.email, password: demoAccounts.customer.password },
  { label: 'Designer', email: demoAccounts.designer.user.email, password: demoAccounts.designer.password },
  { label: 'Admin', email: demoAccounts.admin.user.email, password: demoAccounts.admin.password },
];

// Decode a JWT payload without verifying (client-side display only)
export function decodeJwtPayload(jwt) {
  try {
    const [, payload] = jwt.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}
