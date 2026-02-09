import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Bags', href: '/shop?category=Bags' },
    { label: 'Shoes', href: '/shop?category=Shoes' },
    { label: 'Accessories', href: '/shop?category=Accessories' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'FAQs', href: '/faqs' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
  ],
};

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ name: string }[]>([]);

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.categories)) {
          const mapped = data.categories.map((c: any) => ({ name: c.name })).filter((c: any) => !!c.name);
          setCategories(mapped);
        }
      } catch (err) {
        console.error('Failed to load footer categories', err);
      }
    };

    run();
  }, [API_BASE]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email to subscribe.');
      return;
    }

    const run = async () => {
      try {
        setIsSubmitting(true);
        const res = await fetch(`${API_BASE}/api/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: trimmed }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Unable to subscribe');
        }

        setMessage(data.message || 'Subscribed successfully.');
        setEmail('');
      } catch (err: any) {
        setError(err.message || 'Unable to subscribe');
      } finally {
        setIsSubmitting(false);
      }
    };

    run();
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-12 mb-8 md:mb-16">
          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl mb-3">Stay Connected</h3>
            <p className="text-background/60 mb-4 text-sm leading-relaxed">
              Subscribe to receive exclusive updates, early access to new collections, and personalized offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border border-background/30 px-4 py-3 text-sm placeholder:text-background/40 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed sm:ml-0 sm:mt-0 mt-1"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {message && (
                <p className="text-xs text-background/80">{message}</p>
              )}
              {error && (
                <p className="text-xs text-red-300">{error}</p>
              )}
            </form>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-background/60">Shop</h4>
            <ul className="space-y-3">
              {/* Keep New Arrivals static */}
              <li key={footerLinks.shop[0].label}>
                <Link
                  to={footerLinks.shop[0].href}
                  className="text-sm text-background/80 hover:text-primary transition-colors"
                >
                  {footerLinks.shop[0].label}
                </Link>
              </li>

              {/* Dynamic categories from backend (e.g., Bags, Shoes, etc.) */}
              {categories.map(cat => (
                <li key={cat.name}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="text-sm text-background/80 hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-background/60">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-background/60">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-6 md:mb-12">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-background/20 hover:border-primary hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} strokeWidth={1.5} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-background/20 hover:border-primary hover:text-primary transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={20} strokeWidth={1.5} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-background/20 hover:border-primary hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={20} strokeWidth={1.5} />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-6 md:pt-12">
          {/* Brand Name */}
          <div className="text-center mb-4 md:mb-8">
            <h2 className="font-serif uppercase font-light tracking-[0.35em] text-3xl md:text-5xl">
              ZAHRA
              <br />
              <span className="block mt-2 text-[0.65em] md:text-[0.6em] tracking-[0.5em]">
                LA REINA
              </span>
            </h2>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs text-background/40">
            <p>© 2024 ZAHRA LA REINA. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-background transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
