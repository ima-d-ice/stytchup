import { chromium } from 'playwright';
import { mkdirSync, renameSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.DEMO_URL || 'http://localhost:3000';
const OUT = 'docs';
const RAW = join(OUT, 'raw');

mkdirSync(RAW, { recursive: true });
rmSync(RAW, { recursive: true, force: true });
mkdirSync(RAW, { recursive: true });

try {
  const res = await fetch(BASE, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(String(res.status));
} catch {
  console.error(`The demo needs the dev server at ${BASE}. Run "npm run dev" first.`);
  process.exit(1);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: RAW, size: { width: 1440, height: 900 } },
});

const page = await context.newPage();
page.setDefaultTimeout(15000);

const pause = (ms) => page.waitForTimeout(ms);

async function smoothScrollBy(distance, steps = 12) {
  const step = Math.round(distance / steps);
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel(0, step);
    await pause(70);
  }
}

async function top() {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await pause(700);
}

async function openAccountMenu() {
  await page.getByRole('button', { name: 'Account menu' }).click();
  await pause(600);
}

// 1 — Storefront
await page.goto(BASE, { waitUntil: 'networkidle' });
await pause(2200);
await smoothScrollBy(750, 14);
await pause(1200);
await smoothScrollBy(900, 16);
await pause(1400);
await smoothScrollBy(700, 12);
await pause(900);
await smoothScrollBy(900, 16);
await pause(1400);
await smoothScrollBy(950, 16);
await pause(1400);
await smoothScrollBy(750, 12);
await pause(900);
await top();

// 2 — Collection and PDP
await page.getByRole('link', { name: 'Designs', exact: true }).first().click();
await pause(1400);
await page.getByRole('button', { name: 'Custom', exact: true }).click();
await pause(1200);
await page.getByRole('button', { name: 'All', exact: true }).click();
await pause(800);
await page.getByRole('link', { name: 'Sculpted Wool Overcoat' }).click();
await pause(1800);
await page.getByText('Material & care', { exact: true }).click();
await pause(1400);
await page.getByRole('link', { name: 'Designs', exact: true }).first().click();
await pause(1000);

// 3 — Designer directory and profile
await page.getByRole('link', { name: 'Designers', exact: true }).first().click();
await pause(1500);
await page.getByRole('link', { name: /Meera Kapoor/ }).first().click();
await pause(1800);
await smoothScrollBy(500, 10);
await pause(1400);
await top();

// 4 — Customer account
await page.getByRole('link', { name: 'Log in' }).click();
await pause(900);
const demoCustomer = page.getByRole('button', { name: 'Use Customer' });
if ((await demoCustomer.count()) === 0) {
  throw new Error('Demo mode is off. Set VITE_DEMO_MODE=true in .env and restart the dev server.');
}
await demoCustomer.click();
await pause(500);
await page.getByRole('button', { name: 'Sign in' }).click();
await pause(1800);
await openAccountMenu();
await pause(800);
await page.keyboard.press('Escape');
await pause(400);

await page.getByRole('link', { name: 'Orders' }).first().click();
await pause(1600);
await smoothScrollBy(450, 8);
await pause(1200);

await page.getByRole('link', { name: 'Inbox' }).first().click();
await pause(1200);
await page.getByRole('link', { name: /Meera Kapoor/ }).first().click();
await pause(1600);
await page.getByPlaceholder('Write a message…').fill('Could you also line it in silk?');
await pause(600);
await page.getByRole('button', { name: 'Send message' }).click();
await pause(1400);

// 5 — Designer studio
await openAccountMenu();
await page.getByRole('button', { name: 'Switch to designer' }).click();
await pause(2000);
await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
await pause(1600);
await smoothScrollBy(450, 8);
await pause(900);
await page.getByRole('button', { name: 'Mark shipped' }).first().click();
await pause(1500);
await page.getByRole('button', { name: 'Cancel' }).click();
await pause(700);

// 6 — Admin
await openAccountMenu();
await page.getByRole('button', { name: 'Sign out' }).click();
await pause(1200);
await page.getByRole('link', { name: 'Log in' }).click();
await pause(800);
await page.getByRole('button', { name: 'Use Admin' }).click();
await pause(500);
await page.getByRole('button', { name: 'Sign in' }).click();
await pause(1600);
await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await pause(1500);
await page.getByRole('button', { name: /^users$/i }).click();
await pause(1200);
await page.getByRole('button', { name: /^designs$/i }).click();
await pause(1400);
await page.getByRole('button', { name: /^orders$/i }).click();
await pause(800);

// 7 — Close on the storefront
await page.getByRole('link', { name: 'StytchUp home' }).click();
await pause(2200);

await context.close();
await browser.close();

const video = readdirSync(RAW)
  .filter((file) => file.endsWith('.webm'))
  .sort()
  .at(-1);
if (!video) {
  console.error('No video was written.');
  process.exit(1);
}

const target = join(OUT, 'demo.webm');
renameSync(join(RAW, video), target);
console.log(`Recorded ${target}`);
