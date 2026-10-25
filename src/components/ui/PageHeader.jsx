import { Link } from 'react-router-dom';

export default function PageHeader({ eyebrow, title, intro, crumbs = [], children }) {
  return (
    <header className="border-b border-line pb-10 pt-8 md:pb-14 md:pt-12">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink/40">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.to ? (
                <Link to={crumb.to} className="transition-colors hover:text-ink">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-ink/70">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="display text-[38px] leading-[0.95] tracking-[-0.02em] text-ink sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/55">{intro}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </header>
  );
}
