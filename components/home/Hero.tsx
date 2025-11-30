import Link from "next/link";
import { Scissors, Ruler, Shirt, Pencil, Handbag } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFC629] text-gray-900">
      {/* Background Icons (Watermark style) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Handbag className="absolute top-[10%] left-[5%] w-32 h-32 transform -rotate-12" />
        <Pencil className="absolute top-[15%] right-[10%] w-24 h-24 transform rotate-25" />
        <Shirt className="absolute bottom-[20%] left-[15%] w-40 h-40 transform rotate-15" />
        <Scissors className="absolute bottom-[10%] right-[5%] w-28 h-28 transform -rotate-35" />
        <Ruler className="absolute top-1/2 right-[20%] w-20 h-20 transform rotate-45" />
      </div>

      <div className="relative container mx-auto flex flex-col items-center px-4 py-24 text-center md:py-36 lg:px-32">
        <h1 className="text-5xl font-black tracking-tight leading-tight sm:text-7xl">
          StytchUp
          <span className="block mt-2 text-white drop-shadow-sm">
            Creativity. Custom. You.
          </span>
        </h1>
        
        <p className="mt-8 mb-10 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          The marketplace where top designers showcase unique textiles, and you turn them into fashion.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/designs"
            className="px-10 py-4 text-lg font-bold bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
          >
            Explore Designs
          </Link>
          <Link
            href="/designer"
            className="px-10 py-4 text-lg font-bold bg-white text-gray-900 border-2 border-white rounded-full shadow-md hover:bg-gray-50 hover:text-[#FFC629] hover:scale-105 transition-all duration-300"
          >
            Become a Designer
          </Link>
        </div>
      </div>
      
      {/* Curved bottom edge for that Bumble card feel */}
      <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gray-50 rounded-t-[50%] scale-x-150"></div>
    </section>
  );
};

export default Hero;