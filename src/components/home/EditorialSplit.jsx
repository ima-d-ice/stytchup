import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NOTES = [
  { number: '01', label: 'Measured once', copy: 'Share your measurements or book a fit consultation.' },
  { number: '02', label: 'Cut for you', copy: 'Your designer drafts a pattern and begins the piece.' },
  { number: '03', label: 'Finished by hand', copy: 'A final check, then it ships from the atelier.' },
];

export default function EditorialSplit() {
  return (
    <section className="border-y border-line bg-mist">
      <div className="container-shop grid items-stretch gap-0 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="aspect-[4/5] w-full overflow-hidden lg:h-full lg:aspect-auto">
            <img
              src="/demo/editorial.jpg"
              alt="A rail of neutral knitwear in the StytchUp atelier"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute left-4 top-4 bg-brand px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink">
            The atelier
          </div>
        </div>

        <div className="flex flex-col justify-center px-1 py-14 lg:col-span-6 lg:px-16 lg:py-20">
          <p className="eyebrow mb-4">Made to measure, not mass produced</p>
          <h2 className="display max-w-lg text-4xl leading-[0.95] tracking-[-0.025em] md:text-5xl">
            Your measurements.
            <br />
            Their craft.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/55">
            Nothing is cut until you order. Every piece is drafted to your body, finished by hand,
            and checked by the designer who made it.
          </p>

          <dl className="mt-10 divide-y divide-line border-t border-line">
            {NOTES.map((note) => (
              <div key={note.number} className="grid grid-cols-[36px_1fr] gap-4 py-4">
                <dt className="text-[10px] font-medium tracking-[0.16em] text-ink/35">{note.number}</dt>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">{note.label}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink/50">{note.copy}</p>
                </div>
              </div>
            ))}
          </dl>

          <Link to="/designs?type=CUSTOM" className="btn mt-8 w-full sm:w-auto">
            Start a commission
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
          </Link>
        </div>
      </div>
    </section>
  );
}
