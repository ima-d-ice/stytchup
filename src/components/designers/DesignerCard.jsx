import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function DesignerCard({ id, name, avatarUrl, bio, location, skills }) {
  return (
    <Link to={`/designer/${id}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[25%] transition-all duration-[900ms] ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-6xl text-ink/20">
            {name?.charAt(0) || 'D'}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/55 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-[9px] uppercase tracking-[0.18em]">View profile</span>
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-[14px] font-medium text-ink">{name || 'Independent designer'}</h3>
        <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-ink/40">
          {location || 'Remote'}
        </p>
        {bio && <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-ink/45">{bio}</p>}
        {skills?.length > 0 && (
          <p className="mt-3 truncate text-[9px] uppercase tracking-[0.14em] text-ink/30">
            {skills.slice(0, 3).join(' / ')}
          </p>
        )}
      </div>
    </Link>
  );
}
