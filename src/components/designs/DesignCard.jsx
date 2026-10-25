import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatINR } from '../../utils/pricing';

export default function DesignCard({ id, title, imageUrl, price, type, designerName, category }) {
  return (
    <Link to={`/designs/${id}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-mist">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-ink/25">
            Image coming soon
          </div>
        )}

        {type === 'CUSTOM' && (
          <span className="absolute left-0 top-3 bg-brand px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
            Custom
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-paper/95 px-3 py-3 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-0">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-ink">View piece</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-ink" strokeWidth={1.4} />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-ink transition-colors group-hover:text-ink/60">
            {title}
          </h3>
          <p className="mt-1 truncate text-[9px] uppercase tracking-[0.16em] text-ink/40">
            {designerName || category || 'StytchUp atelier'}
          </p>
        </div>
        <p className="shrink-0 text-[12px] tabular-nums text-ink/80">{formatINR(price)}</p>
      </div>
    </Link>
  );
}
