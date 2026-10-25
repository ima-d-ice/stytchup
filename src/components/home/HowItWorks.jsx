const STEPS = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Browse a considered edit of pieces from independent designers — or start with a blank page and commission something new.',
  },
  {
    number: '02',
    title: 'Measure',
    description:
      'Order a made-to-measure piece, then share your measurements. Your designer drafts a pattern around them.',
  },
  {
    number: '03',
    title: 'Receive',
    description:
      'The piece is cut, finished, and checked in the atelier before it ships. Made once, for you.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-mist">
      <div className="container-shop py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="display text-3xl leading-[0.95] tracking-[-0.02em] md:text-5xl">
              Slow fashion,
              <br />
              made simple.
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink/50">
              Three steps between the screen and the atelier. No stock, no sizes, no waste.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="border-t border-ink pt-5">
                <p className="font-display text-3xl leading-none text-brand">{step.number}</p>
                <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-[12px] leading-relaxed text-ink/50">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
