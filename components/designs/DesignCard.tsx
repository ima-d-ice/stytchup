import Link from 'next/link';
import Image from 'next/image';

interface DesignCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  type: 'CATALOG' | 'CUSTOM';
  designerName: string;
  designerAvatar: string | null;
}

export default function DesignCard({
  id,
  title,
  imageUrl,
  price,
  type,
  designerName,
  designerAvatar
}: DesignCardProps) {
  
  // Format Price to INR
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price / 100);

  return (
    <Link href={`/designs/${id}`} className="group block">
      
      {/* 1. Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
           {type === 'CUSTOM' ? (
              <span className="inline-flex items-center rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white tracking-widest uppercase">
                Custom
              </span>
           ) : (
              <span className="inline-flex items-center rounded-full bg-[#FFC629] px-3 py-1 text-[10px] font-black text-black tracking-widest uppercase shadow-sm">
                Catalog
              </span>
           )}
        </div>
      </div>

      {/* 2. Info Area */}
      <div className="mt-4 flex justify-between items-start px-1">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#E5B225] transition-colors">
            {title}
          </h3>
          {/* Designer Mini Profile */}
          <div className="flex items-center mt-1 space-x-2">
            <div className="relative h-5 w-5 rounded-full overflow-hidden bg-gray-200">
               {designerAvatar ? (
                 <Image src={designerAvatar} alt={designerName} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[8px] font-bold">{designerName[0]}</div>
               )}
            </div>
            <p className="text-xs font-medium text-gray-500">{designerName}</p>
          </div>
        </div>
        
        <p className="text-lg font-bold text-gray-900">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}