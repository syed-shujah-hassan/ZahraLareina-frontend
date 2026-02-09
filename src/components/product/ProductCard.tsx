import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleSavedItem, isSaved } = useCart();
  const saved = isSaved(product.id);
  const { formatPrice } = useStoreSettings();

  const hasDiscount =
    typeof product.discount === 'number' && product.discount > 0 && product.discount < product.price;
  const displayPrice = hasDiscount ? product.discount! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount!) / product.price) * 100)
    : 0;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedItem(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card group">
      <div className="product-card-image relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="product-card-overlay" />
        
        {/* Save Button - only show on md+ (hover UI) */}
        <button
          onClick={handleSave}
          className={cn(
            "hidden md:flex absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm transition-all duration-300",
            "opacity-0 group-hover:opacity-100",
            saved && "opacity-100"
          )}
          aria-label={saved ? "Remove from saved" : "Save item"}
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            className={cn(
              "transition-colors",
              saved ? "fill-primary text-primary" : "text-foreground"
            )}
          />
        </button>

        {/* New / Discount Badges */}
        <div className="absolute top-2 left-2 space-y-1.5">
          {product.isNew && (
            <span className="block text-[9px] uppercase tracking-[0.2em] bg-foreground text-background px-1.5 py-0.5 rounded-full">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="block text-[9px] uppercase tracking-[0.2em] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Quick Add - appears on hover (desktop only) */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.15em] hover:bg-primary transition-colors">
            Quick View
          </button>
        </div>
      </div>

      <div className="pt-4 space-y-1">
        <h3 className="font-serif text-[1.05rem] tracking-wide leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="text-sm mt-1">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
              <span className="font-medium">
                {formatPrice(displayPrice)}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {formatPrice(displayPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
