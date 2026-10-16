import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// The backend derives the charge amount server-side from the DB (paise).
// The client must therefore send ONLY { sourceId, type } — never an amount.
test('RazorpayButton create-order body carries no client amount', () => {
  const src = read('src/components/checkout/RazorpayButton.jsx');
  assert.match(src, /body:\s*JSON\.stringify\(\{\s*sourceId,\s*type\s*\}\)/);
  assert.doesNotMatch(src, /JSON\.stringify\(\{\s*amount,/);
});

test('all client fetches use VITE_API_URL with localhost fallback', () => {
  const files = ['src/pages/Designs.jsx', 'src/pages/Orders.jsx', 'src/pages/Inbox.jsx', 'src/pages/Dashboard.jsx'];
  for (const f of files) {
    const src = read(f);
    assert.match(src, /API_URL/, `${f} must use the API URL (via lib/api)`);
  }
  assert.match(read('src/lib/api.js'), /VITE_API_URL/);
  assert.match(read('src/lib/api.js'), /http:\/\/localhost:4000/);
});

test('admin area is role-gated via RequireAdmin + client check', () => {
  const guard = read('src/components/RequireAuth.jsx');
  assert.match(guard, /RequireAdmin/);
  assert.match(guard, /ADMIN/);
  const router = read('src/router.jsx');
  assert.match(router, /RequireAdmin/);
  assert.match(router, /path:\s*['"]admin['"]/);
  const admin = read('src/pages/Admin.jsx');
  assert.match(admin, /ADMIN/);
  assert.match(admin, /\/admin\/orders/);
  assert.match(admin, /\/admin\/users/);
  assert.match(admin, /\/admin\/designs/);
});

test('no next/* imports remain (pure React)', () => {
  const files = [
    'src/router.jsx',
    'src/main.jsx',
    'src/pages/Login.jsx',
    'src/pages/DesignDetail.jsx',
    'src/components/checkout/RazorpayButton.jsx',
    'src/components/head/navbar.jsx',
  ];
  for (const f of files) {
    assert.doesNotMatch(read(f), /from\s+['"]next\//, `${f} must not import next/*`);
  }
});

test('react-router replaces next/navigation + next/link', () => {
  assert.match(read('src/router.jsx'), /createBrowserRouter/);
  assert.match(read('src/components/head/navbar.jsx'), /react-router-dom/);
  assert.match(read('src/pages/Login.jsx'), /useNavigate/);
});

test('dashboards sync order status live without reload', () => {
  for (const f of ['src/pages/Orders.jsx', 'src/pages/Dashboard.jsx']) {
    assert.match(read(f), /useOrderSocket/);
    assert.match(read(f), /onUpdate/);
  }
  assert.match(read('src/utils/useOrderSocket.js'), /order_updated/);
  assert.match(read('src/utils/useOrderSocket.js'), /join_order/);
});

test('chat handles negotiation events live', () => {
  const chat = read('src/pages/Chat.jsx');
  assert.match(chat, /offer_created/);
  assert.match(chat, /offer_accepted/);
});
