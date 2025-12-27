import Image from "next/image";
import Link from "next/link";

// Interfaces to match your API
interface UserProfile {
  avatarUrl: string | null;
  skills: string[];
}

interface Designer {
  id: string;
  name: string;
  profile: UserProfile | null;
}

async function getDesigners(): Promise<Designer[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/designers/`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch designers");
    
    const data = await res.json();
    // Return random or top 3 designers
    return Array.isArray(data) ? data.slice(0, 3) : [];
  } catch (error) {
    console.error("Error fetching designers:", error);
    return [];
  }
}

const FeaturedDesigners = async () => {
  const designers = await getDesigners();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Meet The Creators
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Talented artists from around the world waiting to design your next piece.
          </p>
        </div>

        {designers.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
            {designers.map((designer) => (
              <div key={designer.id} className="group relative flex flex-col items-center">
                
                {/* Avatar Container - Bumble Style Ring */}
                <div className="relative mb-6">
                    <div className="w-48 h-48 rounded-full p-2 bg-white border-[6px] border-[#FFC629] shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full relative rounded-full overflow-hidden">
                            <Image
                                src={designer.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${designer.name}&background=random`}
                                alt={designer.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                     {/* "Pro" Badge */}
                    <div className="absolute bottom-2 right-4 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Pro
                    </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {designer.name}
                </h3>
                
                {/* Skills Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
                  {designer.profile?.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wide rounded-lg">
                      {skill}
                    </span>
                  )) || (
                    <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold uppercase rounded-lg">
                        General Designer
                    </span>
                  )}
                </div>

                <Link
                  href={`/designers/${designer.id}`}
                  className="w-full max-w-[200px] py-3 rounded-2xl border-2 border-gray-200 text-center font-bold text-gray-900 hover:border-[#FFC629] hover:bg-[#FFC629] hover:shadow-[0_4px_14px_rgb(255,198,41,0.4)] transition-all duration-300"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center py-10">
            <p className="text-gray-500">No designers found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDesigners;