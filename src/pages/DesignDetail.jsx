import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ShieldCheck, Truck } from 'lucide-react';
import RazorpayButton from '../components/checkout/RazorpayButton';
import ContactButton from '../components/checkout/ContactButton';
import { TextSkeleton } from '../components/ui/Skeletons';
import { formatINR } from '../utils/pricing';
import { getDesign } from '../lib/api';

function Accordion({ title, children }) {
  return (
    <details className="group border-b border-line py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-3.5 w-3.5 text-ink/40 transition-transform group-open:rotate-180" strokeWidth={1.4} />
      </summary>
      <div className="pt-3 text-[12px] leading-relaxed text-ink/55">{children}</div>
    </details>
  );
}

export default function DesignDetail() {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    getDesign(id)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        setDesign(data);
        setActiveImage(data.imageUrl || data.gallery?.[0] || '');
      })
      .catch((error) => {
        console.error('Error fetching design:', error);
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
        <div className="lg:col-span-7">
          <div className="aspect-[3/4] w-full animate-pulse bg-mist" />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <TextSkeleton lines={2} />
          <div className="h-10 w-3/4 animate-pulse bg-mist" />
          <TextSkeleton lines={4} />
        </div>
      </div>
    );
  }

  if (notFound || !design) {
    return (
      <div className="container-shop flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow mb-4">Not found</p>
        <h1 className="display text-4xl tracking-[-0.02em]">This piece has moved on.</h1>
        <p className="mt-4 max-w-md text-sm text-ink/50">
          The design may have been archived. Browse the current collection instead.
        </p>
        <Link to="/designs" className="btn mt-8">
          Back to designs
        </Link>
      </div>
    );
  }

  const designerName = design.designer?.name || 'StytchUp atelier';
  const gallery = [...new Set([design.imageUrl, ...(design.gallery || [])].filter(Boolean))];
  const isCustom = design.type === 'CUSTOM';

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <div className="flex items-center justify-between border-b border-line py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-ink/40">
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/designs" className="transition-colors hover:text-ink">
              Designs
            </Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-[160px] truncate text-ink/70">{design.title}</span>
          </nav>
          <Link
            to="/designs"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-ink/40 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.4} />
            Back
          </Link>
        </div>

        <div className="grid gap-10 py-8 lg:grid-cols-12 lg:gap-12 lg:py-12">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-mist">
                <img
                  src={activeImage}
                  alt={design.title}
                  className="h-full w-full object-cover object-center"
                />
                {isCustom && (
                  <span className="absolute left-0 top-4 bg-brand px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink">
                    Custom commission
                  </span>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {gallery.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`aspect-[3/4] overflow-hidden border transition-colors ${
                        activeImage === image ? 'border-ink' : 'border-transparent hover:border-line'
                      }`}
                      aria-label={`View image ${gallery.indexOf(image) + 1}`}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Link
                to={design.designer?.id ? `/designer/${design.designer.id}` : '/designer'}
                className="link-line text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-ink"
              >
                {designerName}
              </Link>

              <h1 className="display mt-4 text-4xl leading-[0.98] tracking-[-0.02em] md:text-5xl">
                {design.title}
              </h1>

              <p className="mt-5 text-lg text-ink">
                {isCustom && <span className="mr-2 text-[11px] uppercase tracking-[0.14em] text-ink/40">From</span>}
                {formatINR(design.price)}
              </p>

              <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-ink/35">
                {isCustom ? 'Made to order — 4–6 weeks' : 'Made to measure — 3–4 weeks'}
                {design.category ? ` · ${design.category}` : ''}
              </p>

              <p className="mt-8 border-t border-line pt-6 text-[13px] leading-relaxed text-ink/60">
                {design.description || 'A made-to-order piece, cut to your measurements in the designer’s studio.'}
              </p>

              <div className="mt-8">
                {isCustom ? (
                  <ContactButton designerId={design.designerId || design.designer?.id} designerName={designerName} />
                ) : (
                  <RazorpayButton sourceId={design.id} type="CATALOG" buttonText="Order — made to measure" />
                )}
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.14em] text-ink/35">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.4} />
                Secure payment · Measurements after checkout
              </p>

              <div className="mt-8">
                <Accordion title="Material & care">
                  {design.material || 'Natural fibres, chosen by the designer. Dry clean or hand wash cold; full care notes ship with the piece.'}
                </Accordion>
                <Accordion title="Size & fit">
                  {design.sizeGuide || 'Made to measure. After ordering, you will be asked for chest, waist, hips, and height.'}
                </Accordion>
                <Accordion title="Shipping & returns">
                  <span className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.4} />
                    Made to order in 3–6 weeks, then shipped worldwide with tracking. Because each piece is cut for you,
                    returns are accepted for fit adjustments within 14 days of delivery.
                  </span>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
