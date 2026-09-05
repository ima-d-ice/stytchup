import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toPaise, fromPaise, formatINR } from '../src/utils/pricing.js';

test('toPaise converts rupees to integer paise', () => {
  assert.equal(toPaise(499), 49900);
  assert.equal(toPaise('19.99'), 1999);
  assert.equal(toPaise(0), 0);
});

test('rupees -> paise -> rupees round-trips', () => {
  for (const r of [1, 49.5, 999.99, 2500]) {
    assert.equal(fromPaise(toPaise(r)), Math.round(r * 100) / 100);
  }
});

test('toPaise rejects garbage', () => {
  assert.throws(() => toPaise('abc'), /Invalid rupee amount/);
  assert.throws(() => toPaise(-5), /Invalid rupee amount/);
});

test('formatINR renders paise as INR', () => {
  const out = formatINR(49900);
  assert.match(out, /499/);
  assert.match(out, /₹/);
});

test('matches backend convention (₹1 = 100 paise)', () => {
  assert.equal(toPaise(1), 100);
  assert.equal(fromPaise(100), 1);
});
