import React from 'react';
import DesignerCard from '@/components/designers/DesignerCard';

export const dynamic = "force-dynamic";

// Define types based on your schema
interface UserProfile {
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  skills: string[];
}

interface Designer {
  id: string;
  name: string | null;
  profile: UserProfile | null;
}

async function getDesigners(): Promise<Designer[]> {
  try {
    // Assuming endpoint exists to fetch users with role DESIGNER
    const res = await fetch("http://localhost:4000/designers/", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch designers");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching designers:", error);
    return [];
  }
}

export default async function DesignersPage() {
  const designers = await getDesigners();

  return (
    <div className="bg-yellow-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Meet Our Designers
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Talented creators ready to bring your vision to life.
          </p>
        </div>

        {designers.length === 0 ? (
          <p className="mt-16 text-center text-gray-500">No designers found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {designers.map((designer) => (
              <DesignerCard
                key={designer.id}
                id={designer.id}
                name={designer.name || "Unknown"}
                avatarUrl={designer.profile?.avatarUrl}
                bio={designer.profile?.bio}
                location={designer.profile?.location}
                skills={designer.profile?.skills}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
