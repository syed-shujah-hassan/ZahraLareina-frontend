import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { EditorialSection } from '@/components/home/EditorialSection';
import { Seo } from '@/components/seo/Seo';

const Index = () => {
  return (
    <Layout>
      <Seo
        title="Zahralareina | Zahra La Reina | ZahraLareina Luxe | Luxury Fashion Store"
        description="Zahralareina (also searched as Zahra La Reina, ZahraLareina Luxe, Zahralarina, Zahra Reina, Zahra Laraina, Zahra Lareena, and Zahra Raina) is a curated luxury fashion store for timeless bags, shoes, and accessories."
        canonicalPath="/"
        keywords="Zahralareina, Zahra La Reina, ZahraLareina Luxe, Zahralarina, Zahra Reina, Zahra Laraina, Zahra Lareena, Zahra Raina, luxury fashion"
      />
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <EditorialSection />
    </Layout>
  );
};

export default Index;
