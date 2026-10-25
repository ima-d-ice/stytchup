import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DesignCard from '../designs/DesignCard';
import { ProductGridSkeleton } from '../ui/Skeletons';
import { getDesigns } from '../../lib/api';

export default function TopDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDesigns()
      .then((data) => {
        if (active) setDesigns(Array.isArray(data) ? data.slice(0, 8) : []);
      })
      .catch((error) => {
        console.error('Error fetching designs:', error);
        if (active) setDesigns([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="new-in" className="section bg-paper">
      <div className="container-shop">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="eyebrow mb-3">Latest from the atelier</p>
            <h2 className="display text-3xl leading-none tracking-[-0.02em] md:text-5xl">New in</h2>
          </div>
          <Link
            to="/designs"
            className="group hidden items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-ink sm:flex"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : designs.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
            {designs.map((design) => (
              <DesignCard
                key={design.id}
                id={design.id}
                title={design.title}
                imageUrl={design.imageUrl}
                price={design.price}
                type={design.type}
                designerName={design.designer?.name || 'StytchUp atelier'}
                category={design.category}
              />
            ))}
          </div>
        ) : (
          <div className="border-y border-line py-16 text-center">
            <p className="text-sm text-ink/45">New pieces are being added. Please check back shortly.</p>
          </div>
        )}

        <div className="mt-10 flex justify-center sm:hidden">
          <Link to="/designs" className="btn-outline w-full">
            View all designs
          </Link>
        </div>
      </div>
    </section>
  );
}
