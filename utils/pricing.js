// Shared money helpers. Backend stores prices as integer paise (₹1 = 100).
export function toPaise(rupees) {
  const n = Number(rupees);
  if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid rupee amount: ${rupees}`);
  return Math.round(n * 100);
}

export function fromPaise(paise) {
  return paise / 100;
}

export function formatINR(paise) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(fromPaise(paise));
}
