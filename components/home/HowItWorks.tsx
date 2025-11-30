import { Search, Palette, ShoppingCart } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-gray-900" />,
      title: "Discover",
      description: "Browse a curated feed of patterns and artwork from global designers.",
    },
    {
      icon: <Palette className="w-8 h-8 text-gray-900" />,
      title: "Customize",
      description: "Apply your favorite design to fabrics, shirts, or home goods.",
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-gray-900" />,
      title: "Own It",
      description: "We handle the printing and shipping. You get a unique piece.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center px-4">
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-[#FFC629] rounded-2xl shadow-[0_4px_14px_rgb(255,198,41,0.4)] mb-6 transform transition hover:scale-110 duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;