import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ContactButton from '../components/checkout/ContactButton';
import { API_URL } from '../lib/api';

const formatPrice = (paise) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);

export default function DesignerDetail() {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/designers/${id}`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error('Failed to fetch designer');
        return res.json();
      })
      .then((data) => data && setDesigner(data))
      .catch((error) => {
        console.error('Error fetching designer:', error);
        setNotFound(true);
      });
  }, [id]);

  if (notFound) return <div className="p-10 text-center">Designer not found. <Link to="/designer" className="underline">Back</Link></div>;
  if (!designer) return <div className="p-10 text-center">Loading…</div>;

  const { profile, designs, name } = designer;
  const initial = name ? name.charAt(0).toUpperCase() : 'D';

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#FFC629] selection:text-black">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link to="/designer" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
          ← Back to Designers
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-gray-100 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="p-8 lg:col-span-5 xl:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left lg:border-r lg:border-gray-100">
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 mb-6">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={name || 'Designer'} className="rounded-3xl object-cover shadow-lg border-4 border-white ring-2 ring-[#FFC629] w-full h-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-3xl bg-[#FFC629] text-6xl font-black text-white shadow-inner">{initial}</div>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{name}</h1>
            <div className="mt-2 flex items-center text-gray-500 font-medium">📍 {profile?.location || 'Remote'}</div>

            <div className="mt-6 w-full space-y-3">
              <div className="w-full">
                <ContactButton designerId={designer.id} designerName={name || 'Designer'} />
              </div>
              {profile?.socialLinks?.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full justify-center rounded-2xl border-2 border-gray-100 bg-white py-3 text-sm font-bold text-gray-600 transition hover:border-gray-200 hover:bg-gray-50"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>

          <div className="bg-gray-50/50 p-8 lg:col-span-7 xl:col-span-8 lg:bg-white lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">About The Designer</h3>
              <p className="text-lg leading-relaxed text-gray-700">{profile?.bio || "This designer hasn't written a bio yet, but their work speaks for itself."}</p>
            </div>

            {profile?.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center rounded-xl bg-[#FFFBEB] px-4 py-2 text-sm font-bold text-yellow-800 ring-1 ring-inset ring-[#FFC629]/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
              <div>
                <span className="block text-2xl font-black text-gray-900">{designs.length}</span>
                <span className="text-sm font-medium text-gray-500">Designs</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-gray-900">4.9</span>
                <span className="text-sm font-medium text-gray-500">Rating</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-gray-900">24h</span>
                <span className="text-sm font-medium text-gray-500">Response</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio & Services</h2>
          </div>

          {designs.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {designs.map((design) => (
                <Link key={design.id} to={`/designs/${design.id}`} className="group relative">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                    <img src={design.imageUrl} alt={design.title} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-3 left-3">
                      {design.type === 'CUSTOM' ? (
                        <span className="inline-flex items-center rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-white tracking-wide">CUSTOM REQUEST</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[#FFC629] px-3 py-1 text-xs font-bold text-black tracking-wide">MADE TO ORDER</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E5B225] transition-colors">{design.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{design.category || 'General'}</p>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {design.type === 'CUSTOM' && <span className="text-xs text-gray-500 font-normal block text-right">from</span>}
                      {formatPrice(design.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-500 font-medium">This designer hasn&apos;t uploaded any work yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
