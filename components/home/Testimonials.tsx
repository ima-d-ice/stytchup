import Image from "next/image";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "StytchUp totally changed how I buy clothes. I bought a custom pattern from a designer in Italy and had it printed on a shirt. It fits my vibe perfectly.",
      name: "Sarah Jenkins",
      title: "Fashion Enthusiast",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    {
      quote: "As a freelance illustrator, finding a platform that lets me sell rights to my patterns so easily is a godsend. The community here is vibrant and supportive.",
      name: "Marcus Chen",
      title: "Graphic Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section className="py-20 bg-[#FFFBEB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            The Word on the Street
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative p-8 bg-white rounded-4xl shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 bg-[#FFC629] text-white w-10 h-10 flex items-center justify-center rounded-full text-2xl font-serif">
                &rdquo;
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed font-medium mb-8">
                {testimonial.quote}
              </p>
              
              <div className="flex items-center border-t border-gray-100 pt-6">
                <div className="relative w-14 h-14 mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover ring-2 ring-gray-100"
                  />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;