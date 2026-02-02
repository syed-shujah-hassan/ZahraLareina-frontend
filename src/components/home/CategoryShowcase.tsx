import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    href: '/shop?category=Bags',
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    href: '/shop?category=Shoes',
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    href: '/shop?category=Accessories',
  },
];

export const CategoryShowcase = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-luxury-subtitle mb-4">Explore</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-wide">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[3/4] overflow-hidden animate-fade-up"
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
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-background">
                <h3 className="font-serif text-3xl md:text-4xl tracking-[0.15em] uppercase mb-4">
                  {category.name}
                </h3>
                <span className="text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-b border-background pb-1">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
