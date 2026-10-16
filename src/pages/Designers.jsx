import { useEffect, useState } from 'react';
import DesignerCard from '../components/designers/DesignerCard';
import { API_URL } from '../lib/api';

export default function Designers() {
  const [designers, setDesigners] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/designers/`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch designers');
        return res.json();
      })
      .then(setDesigners)
      .catch((error) => {
        console.error('Error fetching designers:', error);
        setDesigners([]);
      });
  }, []);

  return (
    <div className="bg-yellow-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Meet Our Designers</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Talented creators ready to bring your vision to life.</p>
        </div>

        {designers.length === 0 ? (
          <p className="mt-16 text-center text-gray-500">No designers found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {designers.map((designer) => (
              <DesignerCard
                key={designer.id}
                id={designer.id}
                name={designer.name || 'Unknown'}
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
