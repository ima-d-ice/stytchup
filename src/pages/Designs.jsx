import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import DesignCard from '../components/designs/DesignCard';
import PageHeader from '../components/ui/PageHeader';
import { ProductGridSkeleton } from '../components/ui/Skeletons';
import { getDesigns } from '../lib/api';

const TYPE_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Catalog', value: 'CATALOG' },
  { label: 'Custom', value: 'CUSTOM' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
];

export default function Designs() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'ALL';
  const category = searchParams.get('category') || 'ALL';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDesigns()
      .then((data) => {
        if (active) setDesigns(Array.isArray(data) ? data : []);
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

  const categories = useMemo(
    () => [...new Set(designs.map((design) => design.category).filter(Boolean))].sort(),
    [designs]
  );

  const visibleDesigns = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = designs.filter((design) => {
      if (type !== 'ALL' && design.type !== type) return false;
      if (category !== 'ALL' && design.category !== category) return false;
      if (!term) return true;
      return [design.title, design.category, design.description, design.designer?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });

    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [designs, type, category, query, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const isDefault = !value || value === 'ALL' || (key === 'sort' && value === 'newest');
    if (isDefault) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });
  const hasFilters = Boolean(query || type !== 'ALL' || category !== 'ALL' || sort !== 'newest');

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Designs' }]}
          eyebrow="The collection"
          title="Designs"
          intro="A considered edit of made-to-order pieces from independent designers. Every piece is cut after you order."
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">
            {loading ? 'Loading' : `${visibleDesigns.length} ${visibleDesigns.length === 1 ? 'piece' : 'pieces'}`}
          </p>
        </PageHeader>

        <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-paper/95 px-4 backdrop-blur-md md:top-[104px] md:mx-0 md:px-0">
          <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex items-center gap-6 overflow-x-auto">
              {TYPE_OPTIONS.map((option) => {
                const active = type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateParam('type', option.value)}
                    className={`relative shrink-0 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors ${
                      active ? 'text-ink' : 'text-ink/40 hover:text-ink'
                    }`}
                  >
                    {option.label}
                    {active && <span className="absolute inset-x-0 -bottom-[5px] h-[2px] bg-brand" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {query && (
                <button
                  type="button"
                  onClick={() => updateParam('q', '')}
                  className="inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-ink hover:text-ink"
                >
                  &ldquo;{query}&rdquo;
                  <X className="h-3 w-3" strokeWidth={1.4} />
                </button>
              )}

              <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-ink/35">
                Category
                <select
                  value={category}
                  onChange={(event) => updateParam('category', event.target.value)}
                  className="cursor-pointer border-0 border-b border-line bg-transparent py-1 pr-6 text-[10px] uppercase tracking-[0.14em] text-ink focus:border-ink focus:outline-none focus:ring-0"
                >
                  <option value="ALL">All</option>
                  {categories.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-ink/35">
                Sort
                <select
                  value={sort}
                  onChange={(event) => updateParam('sort', event.target.value)}
                  className="cursor-pointer border-0 border-b border-line bg-transparent py-1 pr-6 text-[10px] uppercase tracking-[0.14em] text-ink focus:border-ink focus:outline-none focus:ring-0"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[9px] uppercase tracking-[0.14em] text-ink/40 underline underline-offset-4 transition-colors hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="py-10 md:py-14">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : visibleDesigns.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
              {visibleDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  id={design.id}
                  title={design.title}
                  imageUrl={design.imageUrl}
                  price={design.price}
                  type={design.type}
                  category={design.category}
                  designerName={design.designer?.name}
                />
              ))}
            </div>
          ) : (
            <div className="border-y border-line py-24 text-center">
              <p className="font-display text-3xl tracking-[-0.01em] text-ink">Nothing here yet.</p>
              <p className="mt-3 text-sm text-ink/45">Try a different category, or clear the filters.</p>
              <button type="button" onClick={clearFilters} className="btn-outline mt-8">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
