import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleSavedItem, isSaved } = useCart();
  const saved = isSaved(product.id);

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
        
        {/* Save Button */}
        <button
          onClick={handleSave}
          className={cn(
            "absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm transition-all duration-300",
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

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute top-4 left-4 text-xs uppercase tracking-[0.15em] bg-foreground text-background px-3 py-1">
            New
          </span>
        )}

        {/* Quick Add - appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.15em] hover:bg-primary transition-colors">
            Quick View
          </button>
        </div>
      </div>

      <div className="pt-4 space-y-1">
        <h3 className="font-serif text-lg tracking-wide">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};
