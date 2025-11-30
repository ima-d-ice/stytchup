import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ContactButton from '@/components/checkout/ContactButton';

// --- Types (Fixed to match new Schema) ---

type SocialLinks = {
  instagram?: string;
  twitter?: string;
  website?: string;
  behance?: string;
};

interface UserProfile {
  id: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  skills: string[];
  socialLinks: SocialLinks | null; 
}

interface Design {
  id: string;
  title: string;
  imageUrl: string;
  price: number; 
  type: 'CATALOG' | 'CUSTOM'; // 👈 FIXED: Matches your new Enum
  category: string | null;
}

interface Designer {
  id: string;
  name: string | null;
  email: string;
  profile: UserProfile | null;
  designs: Design[];
  createdAt: string;
}

// --- Fetch Logic ---

async function getDesigner(id: string): Promise<Designer | null> {
  try {
    const res = await fetch(`http://localhost:4000/designers/${id}`, {
      cache: 'no-store', 
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch designer');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching designer:', error);
    return null;
  }
}

// --- Helper Functions ---
const formatPrice = (paise: number) => {
  return new Intl.NumberFormat('en-IN', { // 👈 Changed to Indian Rupee
    style: 'currency',
    currency: 'INR',
  }).format(paise / 100);
};

// --- The Page Component ---
export default async function DesignerPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const designer = await getDesigner(resolvedParams.id);

  if (!designer) {
    notFound();
  }

  const { profile, designs, name } = designer;
  const initial = name ? name.charAt(0).toUpperCase() : 'D';

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#FFC629] selection:text-black">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
         <Link href="/designer" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Designers
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* --- SECTION 1: Profile Card --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-gray-100 lg:grid lg:grid-cols-12 lg:gap-x-8">
          
          {/* Left: Avatar & Quick Stats */}
          <div className="p-8 lg:col-span-5 xl:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left lg:border-r lg:border-gray-100">
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 mb-6">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={name || 'Designer'}
                  fill
                  className="rounded-3xl object-cover shadow-lg border-4 border-white ring-2 ring-[#FFC629]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-3xl bg-[#FFC629] text-6xl font-black text-white shadow-inner">
                  {initial}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {name}
            </h1>
            
            <div className="mt-2 flex items-center text-gray-500 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-[#FFC629]">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {profile?.location || "Remote"}
            </div>

            {/* Social Links / Buttons */}
            <div className="mt-6 w-full space-y-3">
              <div className="w-full">
                <ContactButton designerId={designer.id} designerName={name || 'Designer'} />
              </div>
              {profile?.socialLinks?.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="flex w-full justify-center rounded-2xl border-2 border-gray-100 bg-white py-3 text-sm font-bold text-gray-600 transition hover:border-gray-200 hover:bg-gray-50">
                   Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Right: Bio & Skills */}
          <div className="bg-gray-50/50 p-8 lg:col-span-7 xl:col-span-8 lg:bg-white lg:p-12 flex flex-col justify-center">
            
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">About The Designer</h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {profile?.bio || "This designer hasn't written a bio yet, but their work speaks for itself."}
              </p>
            </div>

            {/* Skills Pills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center rounded-xl bg-[#FFFBEB] px-4 py-2 text-sm font-bold text-yellow-800 ring-1 ring-inset ring-[#FFC629]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stats Row */}
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

        {/* --- SECTION 2: The Portfolio Grid --- */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio & Services</h2>
          </div>

          {designs.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {designs.map((design) => (
                <Link key={design.id} href={`/designs/${design.id}`} className="group relative">
                  
                  {/* Image Container */}
                  <div className="aspect-3/4 w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                    <Image
                      src={design.imageUrl}
                      alt={design.title}
                      fill
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Badge: Custom vs Catalog */}
                    <div className="absolute top-3 left-3">
                       {design.type === 'CUSTOM' ? (
                          <span className="inline-flex items-center rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-white tracking-wide">
                            CUSTOM REQUEST
                          </span>
                       ) : (
                          <span className="inline-flex items-center rounded-full bg-[#FFC629] px-3 py-1 text-xs font-bold text-black tracking-wide">
                            MADE TO ORDER
                          </span>
                       )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E5B225] transition-colors">
                        {design.title}
                      </h3>
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