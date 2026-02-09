import { Link } from 'react-router-dom';

export const EditorialSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden animate-fade-up">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
              alt="Editorial"
              className="w-full h-full object-cover"
            />
            {/* Gold Accent Frame */}
            <div className="absolute inset-8 border border-primary/30 pointer-events-none" />
          </div>

          {/* Content */}
          <div className="lg:pl-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-luxury-subtitle mb-5 text-xs md:text-sm">Our Philosophy</p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide mb-7 md:mb-8 leading-tight">
              The Art of <br />
              <span className="text-primary">Timeless</span> Luxury
            </h2>
            
            <div className="gold-line mb-8" />
            
            <p className="text-muted-foreground leading-relaxed mb-5 text-sm md:text-base">
              At ZahraLareina, we believe that true luxury lies in the details. Each piece 
              in our collection is meticulously crafted by skilled artisans using the 
              finest materials sourced from around the world.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base">
              Our commitment to excellence extends beyond aesthetics—we create pieces 
              designed to be treasured for generations, blending traditional craftsmanship 
              with contemporary sensibility.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-foreground/70 bg-transparent text-foreground text-xs md:text-sm uppercase tracking-[0.2em] font-medium hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              <span>Discover Our Story</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
