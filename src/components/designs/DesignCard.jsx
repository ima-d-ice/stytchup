import { Link } from 'react-router-dom';
import { formatINR } from '@/utils/pricing';

export default function DesignCard({ id, title, imageUrl, price, type, designerName, designerAvatar }) {
  const formattedPrice = formatINR(price);
  return (
    <Link to={`/designs/${id}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" loading="lazy" />
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

      <div className="mt-4 flex justify-between items-start px-1">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#E5B225] transition-colors">{title}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <div className="relative h-5 w-5 rounded-full overflow-hidden bg-gray-200">
              {designerAvatar ? (
                <img src={designerAvatar} alt={designerName} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[8px] font-bold">{designerName?.[0]}</div>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500">{designerName}</p>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-900">{formattedPrice}</p>
      </div>
    </Link>
  );
}
