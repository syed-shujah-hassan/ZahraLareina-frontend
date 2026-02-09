import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ShowcaseCategory {
  name: string;
  image: string;
}

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

export const CategoryShowcase = () => {
  const [categories, setCategories] = useState<ShowcaseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        if (!res.ok || !data.success || !Array.isArray(data.categories)) {
          throw new Error(data?.message || 'Failed to load categories');
        }

        // Prefer categories explicitly flagged for home; if none, show all
        const source = data.categories as any[];
        const home = source.filter(c => c.showOnHome);
        const useList = home.length > 0 ? home : source;

        const mapped: ShowcaseCategory[] = useList.map(c => ({
          name: c.name,
          image:
            c.image ||
            'https://images.unsplash.com/photo-1514996937319-344454492b37?w=800&q=80',
        }));

        setCategories(mapped);
      } catch (err) {
        console.error(err);
        setError('Unable to load categories right now.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-luxury-subtitle mb-3">Explore</p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid or helper text */}
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-sm text-destructive">{error}</p>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group relative block w-full h-56 md:h-72 overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-500" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <h3 className="font-serif text-base md:text-2xl tracking-wide leading-snug text-white break-words max-w-full">
                    {category.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-b border-background pb-1">
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No categories are available to show on the home page yet.
          </p>
        )}
      </div>
    </section>
  );
};
