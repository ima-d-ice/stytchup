import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Matches your Prisma Schema response
interface Design {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  designer: {
    name: string;
  };
}

async function getTopDesigns(): Promise<Design[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/designs`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) throw new Error("Failed to fetch designs");
    
    const data = await res.json();
    // Return top 4 designs
    return Array.isArray(data) ? data.slice(0, 4) : [];
  } catch (error) {
    console.error("Error fetching top designs:", error);
    return [];
  }
}

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

const TopDesigns = async () => {
  const designs = await getTopDesigns();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="text-left">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl uppercase tracking-tight">
              Trending Drops
            </h2>
            <p className="mt-2 text-lg text-gray-500 font-medium">
              Fresh looks from our community.
            </p>
          </div>
          <Link href="/designs" className="hidden md:flex items-center text-sm font-bold text-[#FFC629] hover:text-yellow-600 transition-colors uppercase tracking-widest">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {designs.map((design) => (
              <Link href={`/designs/${design.id}`} key={design.id} className="group relative">
                {/* Image Card - Bumble rounded corners */}
                <div className="aspect-3/4 w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <Image
                    src={design.imageUrl}
                    alt={design.title}
                    fill
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Quick Add overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button className="w-full rounded-xl bg-white/90 backdrop-blur-sm py-3 text-sm font-bold text-gray-900 shadow-lg hover:bg-[#FFC629] hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
                
                {/* Info */}
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {design.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-medium">
                      {design.designer?.name || "Unknown"}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#FFC629]">
                    {formatPrice(design.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No designs found. Is the backend running?</p>
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/designs"
            className="inline-flex items-center px-8 py-3 text-base font-bold text-gray-900 bg-[#FFC629] rounded-full hover:bg-[#e5b225] transition-colors"
          >
            Explore All Designs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopDesigns;