import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

// The backend derives the charge amount server-side from the DB (paise).
// The client must therefore send ONLY { sourceId, type } — never an amount.
// This guards the 100x-overcharge regression class.
test('RazorpayButton create-order body carries no client amount', () => {
  const src = read('src/components/checkout/RazorpayButton.jsx');
  assert.match(src, /body:\s*JSON\.stringify\(\{\s*sourceId,\s*type\s*\}\)/);
  assert.doesNotMatch(src, /JSON\.stringify\(\{\s*amount,/);
});

test('API base URL is centralised with a Vite env fallback', () => {
  const src = read('src/lib/api.js');
  assert.match(src, /import\.meta\.env\.VITE_API_URL/);
  assert.match(src, /localhost:4000/);
});

test('admin area is role-gated in the router and on the page', () => {
  const router = read('src/router.jsx');
  assert.match(router, /RequireAdmin/);
  const admin = read('src/pages/Admin.jsx');
  assert.match(admin, /role !== 'ADMIN'/);
  assert.match(admin, /\/admin\/orders/);
  assert.match(admin, /\/admin\/users/);
  assert.match(admin, /\/admin\/designs/);
});

test('dashboards sync order status live without reload', () => {
  for (const page of ['src/pages/Orders.jsx', 'src/pages/Dashboard.jsx']) {
    assert.match(read(page), /useOrderSocket/);
    assert.match(read(page), /onUpdate/);
  }
  const socket = read('src/utils/useOrderSocket.js');
  assert.match(socket, /order_updated/);
  assert.match(socket, /join_order/);
});

test('chat handles negotiation events live', () => {
  const chat = read('src/pages/Chat.jsx');
  assert.match(chat, /offer_created/);
  assert.match(chat, /offer_accepted/);
});

test('demo mode and fixtures exist for backend-free previews', () => {
  const api = read('src/lib/api.js');
  assert.match(api, /VITE_DEMO_MODE/);
  assert.match(api, /demoDesigns/);
  assert.match(api, /demoDesignerOrders/);
  const demo = read('src/data/demo.js');
  assert.match(demo, /demoAccounts/);
  assert.match(demo, /customer@stytchup\.com/);
  assert.match(demo, /designer@stytchup\.com/);
});
