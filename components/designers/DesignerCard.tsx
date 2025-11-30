import Link from 'next/link';
import Image from 'next/image';

interface DesignerCardProps {
  id: string;
  name: string;
  avatarUrl: string | null | undefined;
  bio: string | null | undefined;
  location: string | null | undefined;
  skills: string[] | undefined;
}

export default function DesignerCard({
  id,
  name,
  avatarUrl,
  bio,
  location,
  skills
}: DesignerCardProps) {
  return (
    <Link href={`/designer/${id}`} className="group block h-full">
      <div className="relative flex flex-col h-full overflow-hidden rounded-4xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        
        {/* Top Banner / Avatar Area */}
        <div className="relative h-32  bg-yellow-300">
           <div className="absolute -bottom-8 left-6">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-400 text-2xl font-black text-white">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Info Content */}
        <div className="pt-10 px-6 pb-6 flex flex-col flex-1">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-[#E5B225] transition-colors">
                  {name}
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  {location || "Remote"}
                </p>
             </div>
          </div>

          <p className="mt-4 text-sm text-gray-600 line-clamp-2 flex-1">
            {bio || "Fashion designer specializing in custom made-to-measure clothing."}
          </p>

          {/* Skills Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {skills?.slice(0, 3).map((skill, i) => (
              <span key={i} className="inline-block rounded-lg bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                {skill}
              </span>
            ))}
            {skills && skills.length > 3 && (
              <span className="inline-block rounded-lg bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-400">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}