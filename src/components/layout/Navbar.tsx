import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Menu, ShoppingBag, X, Heart } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'Collections', href: '/collections' },
  { label: 'Bags', href: '/shop?category=Bags' },
  { label: 'Shoes', href: '/shop?category=Shoes' },
  { label: 'Accessories', href: '/shop?category=Accessories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const { isScrolled } = useScrollPosition();
  const { cartCount, savedItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/95 backdrop-blur-sm border-b border-border py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className={cn(
                'font-serif tracking-[0.2em] uppercase transition-all duration-500',
                isScrolled ? 'text-lg' : 'text-xl'
              )}
            >
              {isScrolled ? 'ZahraLareina' : ''}
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-6">
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 hover:opacity-70 transition-opacity"
                  aria-label="User menu"
                >
                  <User size={20} strokeWidth={1.5} />
                </button>
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-medium z-50 animate-fade-in">
                      <Link
                        to="/signin"
                        className="block px-4 py-3 text-sm hover:bg-secondary transition-colors luxury-underline"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-3 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/account"
                        className="block px-4 py-3 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Account Settings
                      </Link>
                      <Link
                        to="/saved"
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart size={14} strokeWidth={1.5} />
                        Saved Items ({savedItems.length})
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Menu */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Menu"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 hover:opacity-70 transition-opacity relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center gap-4">
                <Search size={20} strokeWidth={1.5} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:opacity-70 transition-opacity"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/30 z-50 animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:opacity-70 transition-opacity"
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex-1 px-12 py-8 stagger-children">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block py-4 font-serif text-3xl tracking-wide hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-12 border-t border-border">
                <p className="text-luxury-subtitle mb-4">Contact</p>
                <p className="text-sm text-muted-foreground">contact@zahralareina.com</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
