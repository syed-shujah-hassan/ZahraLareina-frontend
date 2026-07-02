import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { EditorialSection } from '@/components/home/EditorialSection';
import { Seo } from '@/components/seo/Seo';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Index = () => {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (!res.ok || !data.success) return;

        const allProducts = data.products as any[];
        
        // Separate sale and regular products
        const saleProducts = allProducts
          .filter((p: any) => p.discount && p.discount < p.price);
        const regularProducts = allProducts
          .filter((p: any) => !p.discount || p.discount >= p.price);

        // Map to Product type
        const mapProduct = (p: any): Product => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category,
          subcategory: p.subcategory,
          images: p.images || [],
          description: p.description,
          sizes: p.sizes || [],
          inStock: p.inStock,
          isNew: p.isNew,
          discount: p.discount,
        });

        const mappedSale = saleProducts.map(mapProduct);
        const mappedRegular = regularProducts.map(mapProduct);

        // Combine with priority to sale products, max 16 total
        const combined: Product[] = [];
        const addedIds = new Set<string>();

        // Add sale products first
        for (const p of mappedSale) {
          if (combined.length >= 16) break;
          if (!addedIds.has(p.id)) {
            addedIds.add(p.id);
            combined.push(p);
          }
        }

        // Add regular products to fill remaining slots
        for (const p of mappedRegular) {
          if (combined.length >= 16) break;
          if (!addedIds.has(p.id)) {
            addedIds.add(p.id);
            combined.push(p);
          }
        }

        setDisplayProducts(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Layout>
      <Seo
        title="Zahralareina | Zahra La Reina | ZahraLareina Luxe | Luxury Fashion Store"
        description="Zahralareina (also searched as Zahra La Reina, ZahraLareina Luxe, Zahralarina, Zahra Reina, Zahra Laraina, Zahra Lareina, Zahra Raina, is a curated luxury fashion store for timeless bags, shoes, and accessories."
        canonicalPath="/"
        keywords="Zahralareina, Zahra La Reina, ZahraLareina Luxe, Zahralarina, Zahra Reina, Zahra Laraina, Zahra Lareina, Zahra Raina, luxury fashion"
      />
      <HeroSection />
      <CategoryShowcase />
      {/* Sale Products Section */}
      <section className="pt-8 pb-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white">
          <div className="text-center mb-10">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">OUR COLLECTION</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide">
              Sale
            </h2>
          </div>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {displayProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s`}}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
      </section>
      <EditorialSection />
    </Layout>
  );
};

export default Index;
