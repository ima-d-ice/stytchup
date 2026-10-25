import { Link } from 'react-router-dom';

export default function AuthShell({ eyebrow, title, intro, children, footer }) {
  return (
    <div className="grid min-h-[calc(100dvh-104px)] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-12 inline-flex items-baseline gap-1 text-ink">
            <span className="font-display text-[26px] leading-none tracking-[0.08em]">STYTCHUP</span>
            <span className="mb-0.5 h-1 w-1 bg-brand" aria-hidden="true" />
          </Link>

          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="display text-4xl leading-[0.98] tracking-[-0.02em] md:text-5xl">{title}</h1>
          {intro && <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink/50">{intro}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8">{footer}</div>}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-mist lg:block">
        <img
          src="/demo/auth.jpg"
          alt="Detail of a made-to-measure garment in the atelier"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/60">The atelier</p>
          <p className="mt-3 max-w-sm font-display text-2xl leading-snug">
            Clothes made once, for one person.
          </p>
        </div>
      </div>
    </div>
  );
}
