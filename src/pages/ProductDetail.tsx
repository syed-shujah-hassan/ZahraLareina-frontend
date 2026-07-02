import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { Seo } from '@/components/seo/Seo';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { Heart, Minus, Plus, ChevronLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleSavedItem, isSaved } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const { formatPrice } = useStoreSettings();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Failed to load product');
          return;
        }

        const p = data.product;
        const mapped: Product = {
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category,
          subcategory: p.subcategory,
          images: p.images || [],
          description: p.description,
          sizes: p.sizes || [],
          fabric: p.fabric || '',
          inStock: p.inStock,
          isNew: p.isNew,
          discount: p.discount,
        };
        setProduct(mapped);

        // Load related products from same category (simple version)
        const relRes = await fetch(`${API_BASE}/api/products?category=${encodeURIComponent(p.category)}`);
        const relData = await relRes.json();
        if (relRes.ok && relData.success) {
          const relMapped: Product[] = (relData.products as any[])
            .filter((rp: any) => String(rp._id) !== String(p._id))
            .slice(0, 4)
            .map((rp: any) => ({
              id: rp._id,
              name: rp.name,
              price: rp.price,
              category: rp.category,
              subcategory: rp.subcategory,
              images: rp.images || [],
              description: rp.description,
              sizes: rp.sizes || [],
              fabric: rp.fabric || '',
              inStock: rp.inStock,
              isNew: rp.isNew,
              discount: rp.discount,
            }));
          setRelatedProducts(relMapped);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [API_BASE, id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6 text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6 text-center">
          <h1 className="font-serif text-3xl mb-4">Product not found</h1>
          {error && <p className="text-destructive mb-4">{error}</p>}
          <Link to="/shop" className="text-primary hover:underline">
            Return to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const saved = isSaved(product.id);

  const effectivePrice =
    typeof product.discount === 'number' && product.discount > 0 && product.discount < product.price
      ? product.discount
      : product.price;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Zahralareina',
      alternateName: ['Zahra La Reina', 'ZahraLareina Luxe', 'Zahralarina', 'Zahra Reina', 'Zahra Laraina'],
    },
    offers: {
      '@type': 'Offer',
      url: `https://zahralareina.com/product/${product.id}`,
      priceCurrency: 'USD',
      price: String(effectivePrice),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    const size = selectedSize || product.sizes[0];
    for (let i = 0; i < quantity; i++) {
      addToCart(product, size);
    }
  };

  return (
    <Layout>
      <Seo
        title={`${product.name} | Zahralareina (Zahra La Reina / ZahraLareina Luxe)`}
        description={product.description || `Shop ${product.name} at Zahralareina — a curated luxury fashion store.`}
        canonicalPath={`/product/${product.id}`}
        imageUrl={product.images?.[0]}
        jsonLd={productJsonLd}
      />
      <div className="pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft size={16} />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-stretch">
            {/* Image Gallery */}
            <div className="flex flex-col space-y-4 h-full">
              {/* Main Image */}
              <div className="flex-1 overflow-hidden -mx-4 sm:mx-0 flex items-center justify-center">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto max-h-[640px] object-contain animate-fade-in"
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
            <div className="lg:py-8 text-left">
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
              <div className="text-xl mb-6">
                {typeof product.discount === 'number' && product.discount > 0 && product.discount < product.price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(product.discount)}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

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
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={cn(
                          "min-w-[48px] h-12 px-4 border transition-all text-sm",
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground",
                          sizeError && !selectedSize && "border-destructive"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="mt-2 text-xs text-destructive">
                      Please select a size before adding to cart.
                    </p>
                  )}
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
                {product.fabric && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fabric</span>
                    <span>{product.fabric}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={product.inStock ? "text-green-600" : "text-destructive"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Reassurance points */}
                <div className="pt-4 flex flex-col gap-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={16} className="flex-shrink-0" />
                    <span className="uppercase tracking-[0.18em]">
                      Timely dispatch from Zahra studio
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={16} className="flex-shrink-0" />
                    <span className="uppercase tracking-[0.18em]">
                      Signature luxury packaging & care
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-24">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-2xl md:text-3xl tracking-wide">You May Also Like</h2>
            </div>
            {relatedProducts.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:overflow-visible">
                {relatedProducts.map(product => (
                  <div key={product.id} className="min-w-[60%] max-w-xs sm:min-w-0 sm:max-w-none">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No related products found.
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
