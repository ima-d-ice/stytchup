import { useEffect, useMemo, useState } from 'react';
import DesignerCard from '../components/designers/DesignerCard';
import PageHeader from '../components/ui/PageHeader';
import { getDesigners } from '../lib/api';

export default function Designers() {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    getDesigners()
      .then((data) => {
        if (active) setDesigners(Array.isArray(data) ? data : []);
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

  const visibleDesigners = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return designers;
    return designers.filter((designer) =>
      [designer.name, designer.profile?.location, designer.profile?.bio, ...(designer.profile?.skills || [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [designers, query]);

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Designers' }]}
          eyebrow="The directory"
          title="Designers"
          intro="Independent studios working in cloth, cut, and colour. Every designer on StytchUp makes to order — no stock, no seasons, no waste."
        >
          <div className="flex items-end gap-6">
            <label className="block">
              <span className="field-label">Search the directory</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, city, skill"
                className="field w-[220px] sm:w-[260px]"
              />
            </label>
          </div>
        </PageHeader>

        <div className="py-10 md:py-14">
          {loading ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] w-full bg-mist" />
                  <div className="mt-3 h-2.5 w-2/3 bg-mist" />
                  <div className="mt-2 h-2.5 w-1/2 bg-mist" />
                </div>
              ))}
            </div>
          ) : visibleDesigners.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
              {visibleDesigners.map((designer) => (
                <DesignerCard
                  key={designer.id}
                  id={designer.id}
                  name={designer.name}
                  avatarUrl={designer.profile?.avatarUrl}
                  bio={designer.profile?.bio}
                  location={designer.profile?.location}
                  skills={designer.profile?.skills}
                />
              ))}
            </div>
          ) : (
            <div className="border-y border-line py-24 text-center">
              <p className="font-display text-3xl tracking-[-0.01em]">No designers found.</p>
              <p className="mt-3 text-sm text-ink/45">Try another name, city, or skill.</p>
              <button type="button" onClick={() => setQuery('')} className="btn-outline mt-8">
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
