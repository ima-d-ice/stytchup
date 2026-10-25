const LABELS = {
  PENDING: 'Processing',
  AWAITING_REQUIREMENTS: 'Action needed',
  IN_PROGRESS: 'In production',
  SHIPPED: 'Shipped',
  COMPLETED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

const DOTS = {
  PENDING: 'bg-ink/30',
  AWAITING_REQUIREMENTS: 'bg-brand',
  IN_PROGRESS: 'bg-brand',
  SHIPPED: 'bg-ink',
  COMPLETED: 'bg-emerald-600',
  CANCELLED: 'bg-red-500',
  REFUNDED: 'bg-ink/30',
};

export default function StatusLabel({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70 ${className}`}
    >
      <span className={`h-1.5 w-1.5 ${DOTS[status] || 'bg-ink/30'}`} aria-hidden="true" />
      {LABELS[status] || String(status || '').replaceAll('_', ' ')}
    </span>
  );
}
