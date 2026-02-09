import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

export const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Load featured products using isFeatured flag
        const res = await fetch(`${API_BASE}/api/products?isFeatured=true`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Failed to load featured products');
          return;
        }

        const mapped: Product[] = (data.products as any[])
          .sort((a, b) => (a.featuredPriority || 0) - (b.featuredPriority || 0))
          .slice(0, 4)
          .map(p => ({
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
          }));

        setFeaturedProducts(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load featured products');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [API_BASE]);

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-luxury-subtitle mb-4">Curated Selection</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-wide mb-6">
            Featured Pieces
          </h2>
          <div className="flex justify-center">
            <div className="gold-line" />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading featured products...</div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-block text-sm uppercase tracking-[0.2em] border-b border-foreground/60 pb-1"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};
