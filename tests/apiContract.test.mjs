import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// The backend derives the charge amount server-side from the DB (paise).
// The client must therefore send ONLY { sourceId, type } — never an amount.
// This guards the 100x-overcharge regression class.
test('RazorpayButton create-order body carries no client amount', () => {
  const src = read('components/checkout/RazorpayButton.jsx');
  assert.match(src, /body:\s*JSON\.stringify\(\{\s*sourceId,\s*type\s*\}\)/);
  assert.doesNotMatch(src, /JSON\.stringify\(\{\s*amount,/);
});

test('all client fetches use NEXT_PUBLIC_API_URL with localhost fallback', () => {
  const files = [
    'app/designs/page.jsx',
    'app/orders/page.jsx',
    'app/inbox/page.jsx',
    'app/dashboard/page.jsx',
  ];
  for (const f of files) {
    assert.match(
      read(f),
      /process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*['"]http:\/\/localhost:4000['"]/,
      `${f} must use the API URL fallback`,
    );
  }
});

test('admin area is role-gated on client and edge', () => {
  const mw = read('middleware.js');
  assert.match(mw, /\/admin\/:path\*/);
  assert.match(mw, /token\.role === ["']ADMIN["']/);
  const admin = read('app/admin/page.jsx');
  assert.match(admin, /role !== ['"]ADMIN['"]/);
  assert.match(admin, /\/admin\/orders/);
  assert.match(admin, /\/admin\/users/);
  assert.match(admin, /\/admin\/designs/);
});

test('dashboards sync order status live without reload', () => {
  for (const f of ['app/orders/page.jsx', 'app/dashboard/page.jsx']) {
    assert.match(read(f), /useOrderSocket/);
    assert.match(read(f), /onUpdate/);
  }
  assert.match(read('utils/useOrderSocket.js'), /order_updated/);
  assert.match(read('utils/useOrderSocket.js'), /join_order/);
});

test('chat handles negotiation events live', () => {
  const chat = read('app/inbox/[id]/page.jsx');
  assert.match(chat, /offer_created/);
  assert.match(chat, /offer_accepted/);
});
