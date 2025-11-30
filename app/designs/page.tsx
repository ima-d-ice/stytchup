
import DesignCard from "@/components/designs/DesignCard";
interface Designer {
  name: string | null; // Name might be null in DB, so add null type
}
interface Design {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  designer: Designer; // 👈 Renamed from 'user' to 'designer'
}

async function getDesigns(): Promise<Design[]> {
  try {
    // Corrected to http and added no-store cache for fresh data
    const res = await fetch("http://localhost:4000/designs", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch designs");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching designs:", error);
    return []; // Return an empty array if fetch fails
  }
}

export default async function Designs() {
  const designs = await getDesigns();

  return (
    <div className="bg-yellow-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Explore Designs
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Discover unique pieces from our curated collection of designers.
          </p>
        </div>

        {designs.length === 0 ? (
          <p className="mt-16 text-center text-gray-500">No designs found.</p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {designs.map((design) => (
              <DesignCard
                key={design.id}
                id={design.id}
                title={design.title}
                imageUrl={design.imageUrl}
                price={design.price}
                type= "CATALOG"
                designerAvatar="/avatars/default.png"
                designerName={design.designer?.name || "Unknown Designer"} // Handle null name
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}