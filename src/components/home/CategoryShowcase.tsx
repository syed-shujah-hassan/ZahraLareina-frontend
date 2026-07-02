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
    <section className="pt-16 pb-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">EXPLORE</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid or helper text */}
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-sm text-destructive">{error}</p>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-6 xl:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Circular Image - Perfect Circle for all screens */}
                <div className="w-16 sm:w-20 md:w-28 lg:w-36 xl:w-44 2xl:w-56 overflow-hidden mb-2 sm:mb-3 md:mb-4 lg:mb-6 rounded-full relative">
                  <div className="pt-[100%]"></div>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Category Name */}
                <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-lg 2xl:text-xl uppercase tracking-widest font-serif text-center break-words">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No categories are available to show on the home page yet.
          </p>
        )}
    </section>
  );
};
