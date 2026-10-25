import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const CHAPTERS = [
  {
    title: 'Womenswear',
    copy: 'Fluid silk, sculpted wool, quiet tailoring.',
    to: '/designs?category=Womenswear',
    image: '/demo/category-women.jpg',
    alt: 'Womenswear editorial look',
  },
  {
    title: 'Menswear',
    copy: 'Considered shapes, natural cloth, made to fit.',
    to: '/designs?category=Menswear',
    image: '/demo/category-men.jpg',
    alt: 'Menswear editorial look',
  },
  {
    title: 'The atelier',
    copy: 'Commission a piece from a designer, to your measurements.',
    to: '/designs?type=CUSTOM',
    image: '/demo/category-custom.jpg',
    alt: 'Atelier detail of hand-finished fabric',
  },
];

export default function CategoryTiles() {
  return (
    <section className="section border-b border-line bg-paper">
      <div className="container-shop">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="eyebrow mb-3">Shop by chapter</p>
            <h2 className="display text-3xl leading-none tracking-[-0.02em] md:text-5xl">The collection</h2>
          </div>
          <Link to="/designs" className="link-line hidden text-[10px] uppercase tracking-[0.18em] text-ink/60 hover:text-ink sm:block">
            View all
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {CHAPTERS.map((chapter) => (
            <Link key={chapter.title} to={chapter.to} className="group relative block overflow-hidden bg-mist">
              <div className="aspect-[4/5] w-full overflow-hidden md:aspect-[3/4]">
                <img
                  src={chapter.image}
                  alt={chapter.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-6">
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-[0.16em]">{chapter.title}</h3>
                  <p className="mt-2 max-w-[220px] text-[11px] leading-relaxed text-white/65">{chapter.copy}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.2} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
