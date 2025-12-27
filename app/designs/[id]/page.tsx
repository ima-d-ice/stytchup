import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RazorpayButton from '@/components/checkout/RazorpayButton';
import ContactButton from '@/components/checkout/ContactButton';

// --- Interfaces ---
interface Designer {
  id: string; 
  name: string | null;
}

interface Design {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  type: 'CATALOG' | 'CUSTOM'; // Matches your new Schema
  designer: Designer;
  description: string;
  designerId: string;
}

// --- Fetch Logic ---
async function getDesign(id: string): Promise<Design | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/designs/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch design');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching design:', error);
    return null;
  }
}

// --- Page Component ---
export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const design = await getDesign(resolvedParams.id);

  if (!design) {
    notFound();
  }

  // Format price for India (INR)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(design.price / 100);

  const designerName = design.designer?.name || 'Unknown Designer';

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in font-sans">
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-4 lg:mt-8">
        
        {/* Back Navigation */}
        <Link href="/designs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#FFC629] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Browse
        </Link>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Left Column: Product Image */}
          <div className="group relative aspect-3/4 w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(255,198,41,0.2)]">
            <Image
              src={design.imageUrl}
              alt={design.title}
              fill
              className="h-full w-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-linear-to-t from-[#FFC629]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             
             {/* Badge */}
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

          {/* Right Column: Product Details */}
          <div className="mt-10 flex flex-col justify-center lg:mt-0 px-2">
            
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
              {designerName}
            </p>
            
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl sm:leading-none">
              {design.title}
            </h1>
            
            <p className="mt-6 text-3xl font-black text-[#FFC629]">
              {design.type === 'CUSTOM' && <span className="text-lg text-gray-400 font-medium mr-2">starts at</span>}
              {formattedPrice}
            </p>

            <div className="mt-8 rounded-2xl bg-[#FFFBEB] p-6 border border-[#FFC629]/20">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {design.description || "No description provided."}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-10 lg:mt-auto py-6 border-t border-gray-100">
              
              {design.type === 'CATALOG' ? (
                // CATALOG ITEM: Show 'Order Now' button
                <RazorpayButton 
                   amount={design.price}
                   sourceId={design.id}
                   type="CATALOG"
                   buttonText="Order Now (Made to Measure)"
                />
              ) : (
                // CUSTOM REQUEST: Show 'Contact' button
                <ContactButton designerId={design.designerId} designerName={designerName} />
              )}
              
              <p className="text-center text-xs text-gray-500 mt-4 font-medium flex items-center justify-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                 </svg>
                 {design.type === 'CATALOG' 
                    ? "Secure Payment • Measurements Required After" 
                    : "Chat with Designer • Custom Offer Required"}
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}