import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Heart, Minus, Plus, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { addToCart, toggleSavedItem, isSaved } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6 text-center">
          <h1 className="font-serif text-3xl mb-4">Product not found</h1>
          <Link to="/shop" className="text-primary hover:underline">
            Return to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const saved = isSaved(product.id);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      return; // Show error or shake animation
    }
    const size = selectedSize || product.sizes[0];
    for (let i = 0; i < quantity; i++) {
      addToCart(product, size);
    }
  };

  return (
    <Layout>
      <div className="pt-28 pb-24 px-6">
        <div className="container mx-auto">
          {/* Back Link */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft size={16} />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-[3/4] bg-secondary overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-20 h-24 bg-secondary overflow-hidden border-2 transition-colors",
                        selectedImage === index ? "border-foreground" : "border-transparent"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:py-8">
              {/* Badge */}
              {product.isNew && (
                <span className="inline-block text-xs uppercase tracking-[0.15em] bg-foreground text-background px-3 py-1 mb-4">
                  New
                </span>
              )}

              {/* Title & Price */}
              <h1 className="font-serif text-3xl md:text-4xl tracking-wide mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                ${product.price.toLocaleString()}
              </p>

              {/* Gold Line */}
              <div className="gold-line mb-6" />

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes.length > 1 && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-[0.2em] mb-4 text-muted-foreground">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[48px] h-12 px-4 border transition-all text-sm",
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-[0.2em] mb-4 text-muted-foreground">
                  Quantity
                </h3>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-luxury"
                >
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => toggleSavedItem(product)}
                  className={cn(
                    "p-4 border transition-all",
                    saved
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-foreground"
                  )}
                  aria-label={saved ? "Remove from saved" : "Save item"}
                >
                  <Heart
                    size={20}
                    strokeWidth={1.5}
                    className={cn(saved && "fill-current")}
                  />
                </button>
              </div>

              {/* Details */}
              <div className="border-t border-border pt-8 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={product.inStock ? "text-green-600" : "text-destructive"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl tracking-wide">You May Also Like</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
