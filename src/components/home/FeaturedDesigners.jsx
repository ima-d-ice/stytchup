import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '@/lib/api';

export default function FeaturedDesigners() {
  const [designers, setDesigners] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/designers/`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDesigners(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch((err) => {
        console.error('Error fetching designers:', err);
        setDesigners([]);
      });
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Meet The Creators</h2>
          <p className="mt-4 text-lg text-gray-600">Talented artists from around the world waiting to design your next piece.</p>
        </div>

        {designers.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
            {designers.map((designer) => (
              <div key={designer.id} className="group relative flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full p-2 bg-white border-[6px] border-[#FFC629] shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full relative rounded-full overflow-hidden">
                      <img
                        src={designer.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${designer.name}&background=random`}
                        alt={designer.name}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-4 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Pro
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2">{designer.name}</h3>

                <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
                  {designer.profile?.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wide rounded-lg">
                      {skill}
                    </span>
                  )) || <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold uppercase rounded-lg">General Designer</span>}
                </div>

                <Link
                  to={`/designer/${designer.id}`}
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
}
