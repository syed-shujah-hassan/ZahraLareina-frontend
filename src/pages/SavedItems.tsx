import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { Heart } from 'lucide-react';

const SavedItems = () => {
  const { savedItems } = useCart();

  if (savedItems.length === 0) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <Heart size={64} strokeWidth={1} className="mx-auto mb-6 text-muted-foreground" />
            <h1 className="font-serif text-3xl mb-4">No Saved Items</h1>
            <p className="text-muted-foreground mb-8">
              Save your favorite pieces to view them later.
            </p>
            <Link to="/shop" className="btn-luxury inline-block">
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl tracking-wide mb-2">Saved Items</h1>
            <p className="text-muted-foreground">
              {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {savedItems.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SavedItems;
