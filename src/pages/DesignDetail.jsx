import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RazorpayButton from '../components/checkout/RazorpayButton';
import ContactButton from '../components/checkout/ContactButton';
import { formatINR } from '../utils/pricing';
import { API_URL } from '../lib/api';

export default function DesignDetail() {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/designs/${id}`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error('Failed to fetch design');
        return res.json();
      })
      .then((data) => data && setDesign(data))
      .catch((error) => {
        console.error('Error fetching design:', error);
        setNotFound(true);
      });
  }, [id]);

  if (notFound) return <div className="p-10 text-center">Design not found. <Link to="/designs" className="underline">Back to Browse</Link></div>;
  if (!design) return <div className="p-10 text-center">Loading…</div>;

  const formattedPrice = formatINR(design.price);
  const designerName = design.designer?.name || 'Unknown Designer';

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in font-sans">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-4 lg:mt-8">
        <Link to="/designs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#FFC629] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Browse
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(255,198,41,0.2)]">
            <img src={design.imageUrl} alt={design.title} className="h-full w-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFC629]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 left-4">
              {design.type === 'CUSTOM' ? (
                <span className="inline-flex items-center rounded-full bg-black/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white tracking-wider shadow-lg">
                  CUSTOM REQUEST
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#FFC629] px-4 py-1.5 text-xs font-bold text-black tracking-wider shadow-lg">
                  MADE TO ORDER
                </span>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-center lg:mt-0 px-2">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{designerName}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl sm:leading-none">{design.title}</h1>
            <p className="mt-6 text-3xl font-black text-[#FFC629]">
              {design.type === 'CUSTOM' && <span className="text-lg text-gray-400 font-medium mr-2">starts at</span>}
              {formattedPrice}
            </p>

            <div className="mt-8 rounded-2xl bg-[#FFFBEB] p-6 border border-[#FFC629]/20">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Description</h3>
              <p className="text-gray-700 text-base leading-relaxed">{design.description || 'No description provided.'}</p>
            </div>

            <div className="mt-10 lg:mt-auto py-6 border-t border-gray-100">
              {design.type === 'CATALOG' ? (
                <RazorpayButton sourceId={design.id} type="CATALOG" buttonText="Order Now (Made to Measure)" />
              ) : (
                <ContactButton designerId={design.designerId} designerName={designerName} />
              )}
              <p className="text-center text-xs text-gray-500 mt-4 font-medium flex items-center justify-center gap-1">
                {design.type === 'CATALOG' ? 'Secure Payment • Measurements Required After' : 'Chat with Designer • Custom Offer Required'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
