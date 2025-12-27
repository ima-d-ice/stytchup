import Hero from "@/components/home/Hero";
import TopDesigns from "@/components/home/TopDesigns";
import FeaturedDesigners from "@/components/home/FeaturedDesigners";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-gray-50 selection:bg-[#FFC629] selection:text-black">
      <Hero />
      <HowItWorks />
      <TopDesigns />
      <FeaturedDesigners />
      <Testimonials />
    </div>
  );
}