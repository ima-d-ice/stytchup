import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-ink text-white md:min-h-[82vh]">
      <img
        src="/demo/hero.jpg"
        alt="A model wearing a made-to-measure blue wool overcoat"
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

      <div className="container-shop relative flex min-h-[72vh] flex-col justify-end pb-12 pt-24 md:min-h-[82vh] md:pb-16">
        <div className="max-w-3xl animate-rise">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-brand" aria-hidden="true" />
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/75">
              Autumn / Winter 2026
            </p>
          </div>

          <h1 className="display text-[46px] leading-[0.9] tracking-[-0.025em] sm:text-6xl md:text-7xl lg:text-[92px]">
            The measure
            <br />
            of you.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 md:text-[15px]">
            Independent designers, real measurements, and pieces made once. Discover the new
            collection or commission something entirely your own.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/designs" className="btn-yellow w-full sm:w-auto">
              Shop the collection
            </Link>
            <Link
              to="/designs?type=CUSTOM"
              className="inline-flex w-full items-center justify-center border border-white/60 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink sm:w-auto"
            >
              Commission a piece
            </Link>
          </div>
        </div>

        <div className="mt-14 flex items-end justify-between border-t border-white/20 pt-5">
          <p className="max-w-[220px] text-[9px] uppercase leading-relaxed tracking-[0.16em] text-white/50">
            Made to order in India
            <br />
            Shipped worldwide
          </p>
          <a
            href="#new-in"
            className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
          >
            Scroll
            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-1" strokeWidth={1.4} />
          </a>
        </div>
      </div>
    </section>
  );
}
