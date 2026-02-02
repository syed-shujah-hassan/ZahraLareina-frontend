import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useState } from 'react';

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    setEmail('');
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl mb-4">Stay Connected</h3>
            <p className="text-background/60 mb-6 text-sm leading-relaxed">
              Subscribe to receive exclusive updates, early access to new collections, and personalized offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-background/30 px-4 py-3 text-sm placeholder:text-background/40 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-background/60">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
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
        <div className="flex justify-center gap-6 mb-12">
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
        <div className="border-t border-background/10 pt-12">
          {/* Brand Name */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-5xl md:text-7xl tracking-[0.3em] uppercase font-light">
              ZahraLareina
            </h2>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
            <p>© 2024 ZahraLareina. All rights reserved.</p>
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
