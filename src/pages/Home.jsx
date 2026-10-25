import Hero from '../components/home/Hero';
import CategoryTiles from '../components/home/CategoryTiles';
import TopDesigns from '../components/home/TopDesigns';
import EditorialSplit from '../components/home/EditorialSplit';
import FeaturedDesigners from '../components/home/FeaturedDesigners';
import Testimonials from '../components/home/Testimonials';
import HowItWorks from '../components/home/HowItWorks';

export default function Home() {
  return (
    <div className="bg-paper">
      <Hero />
      <CategoryTiles />
      <TopDesigns />
      <EditorialSplit />
      <FeaturedDesigners />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
