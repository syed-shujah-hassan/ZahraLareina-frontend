import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { products } from '@/data/products';

export const FeaturedProducts = () => {
  const featuredProducts = products.slice(0, 4);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-block text-sm uppercase tracking-[0.2em] luxury-underline py-2"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};
