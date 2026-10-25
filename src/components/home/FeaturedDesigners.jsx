import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getDesigners } from '../../lib/api';

export default function FeaturedDesigners() {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDesigners()
      .then((data) => {
        if (active) setDesigners(Array.isArray(data) ? data.slice(0, 4) : []);
      })
      .catch((error) => {
        console.error('Error fetching designers:', error);
        if (active) setDesigners([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section bg-paper">
      <div className="container-shop">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="eyebrow mb-3">The directory</p>
            <h2 className="display text-3xl leading-none tracking-[-0.02em] md:text-5xl">Designers</h2>
          </div>
          <Link
            to="/designer"
            className="group hidden items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-ink sm:flex"
          >
            View directory
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] w-full bg-mist" />
                <div className="mt-3 h-2.5 w-2/3 bg-mist" />
                <div className="mt-2 h-2.5 w-1/2 bg-mist" />
              </div>
            ))}
          </div>
        ) : designers.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4">
            {designers.map((designer) => (
              <Link key={designer.id} to={`/designer/${designer.id}`} className="group block">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist">
                  <img
                    src={designer.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(designer.name || 'Designer')}&background=f4f4f2&color=0a0a0a`}
                    alt={designer.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[30%] transition-all duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/55 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-[9px] uppercase tracking-[0.18em]">View profile</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                  </div>
                </div>
                <h3 className="mt-3 text-[13px] font-medium text-ink">{designer.name}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/40">
                  {designer.profile?.location || 'Independent designer'}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-y border-line py-16 text-center">
            <p className="text-sm text-ink/45">Designer profiles are being prepared.</p>
          </div>
        )}

        <div className="mt-10 flex justify-center sm:hidden">
          <Link to="/designer" className="btn-outline w-full">
            View the directory
          </Link>
        </div>
      </div>
    </section>
  );
}
