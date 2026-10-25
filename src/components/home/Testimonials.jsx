const TESTIMONIALS = [
  {
    quote:
      'I sent three measurements and a photograph of a coat I had worn for ten years. What came back was the same coat, only better.',
    name: 'Aarav Mehta',
    detail: 'Mumbai — made-to-measure coat',
  },
  {
    quote:
      'The designer asked questions I had never been asked about clothes. The piece fits like it was always mine because, in a way, it was.',
    name: 'Nina Shah',
    detail: 'Bengaluru — bespoke silk blouse',
  },
];

export default function Testimonials() {
  return (
    <section className="section bg-paper">
      <div className="container-shop">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">In their words</p>
            <h2 className="display text-3xl leading-none tracking-[-0.02em] md:text-5xl">The word</h2>
          </div>
          <p className="hidden max-w-[220px] text-right text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ink/35 sm:block">
            Notes from clients
            <br />
            and their ateliers
          </p>
        </div>

        <div className="grid gap-0 border-t border-line md:grid-cols-2">
          {TESTIMONIALS.map((testimonial, index) => (
            <figure
              key={testimonial.name}
              className={`flex flex-col justify-between py-10 md:py-14 ${
                index === 0 ? 'border-b border-line md:border-b-0 md:border-r md:pr-12' : 'md:pl-12'
              }`}
            >
              <span className="font-display text-5xl leading-none text-brand" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="mt-6 max-w-lg font-display text-2xl leading-snug tracking-[-0.01em] text-ink md:text-3xl">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-8 text-[10px] uppercase tracking-[0.18em] text-ink/45">
                {testimonial.name}
                <span className="mt-1 block text-ink/30">{testimonial.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
