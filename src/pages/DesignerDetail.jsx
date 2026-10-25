import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import ContactButton from '../components/checkout/ContactButton';
import DesignCard from '../components/designs/DesignCard';
import { TextSkeleton } from '../components/ui/Skeletons';
import { getDesigner } from '../lib/api';

export default function DesignerDetail() {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    getDesigner(id)
      .then((data) => {
        if (!active) return;
        if (!data) setNotFound(true);
        else setDesigner(data);
      })
      .catch((error) => {
        console.error('Error fetching designer:', error);
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container-shop grid gap-10 py-10 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-5">
          <div className="aspect-[4/5] w-full animate-pulse bg-mist" />
        </div>
        <div className="space-y-4 lg:col-span-7">
          <TextSkeleton lines={2} />
          <div className="h-12 w-2/3 animate-pulse bg-mist" />
          <TextSkeleton lines={5} />
        </div>
      </div>
    );
  }

  if (notFound || !designer) {
    return (
      <div className="container-shop flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow mb-4">Not found</p>
        <h1 className="display text-4xl tracking-[-0.02em]">This designer is no longer listed.</h1>
        <Link to="/designer" className="btn mt-8">
          Back to designers
        </Link>
      </div>
    );
  }

  const { profile, designs = [], name } = designer;
  const initial = name?.charAt(0)?.toUpperCase() || 'D';

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <div className="flex items-center justify-between border-b border-line py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-ink/40">
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/designer" className="transition-colors hover:text-ink">
              Designers
            </Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-[160px] truncate text-ink/70">{name}</span>
          </nav>
          <Link
            to="/designer"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-ink/40 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.4} />
            Directory
          </Link>
        </div>

        <div className="grid gap-10 py-8 lg:grid-cols-12 lg:gap-14 lg:py-12">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] w-full overflow-hidden bg-mist lg:sticky lg:top-28">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-8xl text-ink/20">
                  {initial}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="eyebrow mb-4">Independent designer</p>
            <h1 className="display text-5xl leading-[0.95] tracking-[-0.025em] md:text-6xl">{name}</h1>

            <p className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.4} />
              {profile?.location || 'Remote'}
            </p>

            <p className="mt-8 max-w-xl text-[13px] leading-relaxed text-ink/60">
              {profile?.bio ||
                'This designer works between pattern and cloth, making pieces to order in a small studio.'}
            </p>

            {profile?.skills?.length > 0 && (
              <div className="mt-8 border-t border-line pt-5">
                <p className="eyebrow mb-3">Practice</p>
                <p className="text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink/55">
                  {profile.skills.join(' / ')}
                </p>
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <p className="font-display text-3xl leading-none">{designs.length}</p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-ink/35">Pieces</p>
              </div>
              <div>
                <p className="font-display text-3xl leading-none">3–6</p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-ink/35">Weeks</p>
              </div>
              <div>
                <p className="font-display text-3xl leading-none">1:1</p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-ink/35">Consultation</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="w-full sm:max-w-xs">
                <ContactButton designerId={designer.id} designerName={name || 'Designer'} />
              </div>
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline w-full sm:w-auto"
                >
                  Visit website
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-line py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Portfolio</p>
              <h2 className="display text-3xl leading-none tracking-[-0.02em] md:text-4xl">Selected work</h2>
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">
              {designs.length} {designs.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>

          {designs.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
              {designs.map((design) => (
                <DesignCard
                  key={design.id}
                  id={design.id}
                  title={design.title}
                  imageUrl={design.imageUrl}
                  price={design.price}
                  type={design.type}
                  category={design.category}
                  designerName={name}
                />
              ))}
            </div>
          ) : (
            <div className="border-y border-line py-16 text-center">
              <p className="text-sm text-ink/45">This designer is preparing their first pieces.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
