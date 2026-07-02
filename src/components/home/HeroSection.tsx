import { Link } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/lib/utils';

export const HeroSection = () => {
  const { scrollPosition } = useScrollPosition();
  
  // Calculate opacity and transform based on scroll
  const opacity = Math.max(0, 1 - scrollPosition / 400);
  const scale = 1 + scrollPosition / 2000;
  const translateY = scrollPosition / 3;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-secondary">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')`,
          transform: `scale(${scale})`,
          opacity: 0.15,
        }}
      />

      {/* Content */}
      <div 
        className="relative z-10 text-center px-6"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {/* Brand Name */}
        <h1
          className={cn(
            'font-serif mb-8 animate-fade-up uppercase tracking-[0.35em] text-4xl md:text-6xl',
          )}
          style={{ animationDelay: '0.2s' }}
        >
          ZAHRA
          <br />
          <span className="block mt-3 text-[0.6em] md:text-[0.55em] tracking-[0.5em]">
            LA REINA
          </span>
        </h1>

        {/* Gold Line */}
        <div className="flex justify-center mb-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="gold-line" />
        </div>

        {/* Tagline */}
        <p 
          className="text-lg md:text-xl font-light tracking-wide mb-12 max-w-xl mx-auto animate-fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          Where timeless elegance meets contemporary design
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <Link to="/shop" className="btn-luxury">
            <span>Explore Collection</span>
          </Link>
          <Link to="/shop?filter=new" className="btn-outline-luxury">
            New Arrivals
          </Link>
        </div>
      </div>

    </section>
  );
};
