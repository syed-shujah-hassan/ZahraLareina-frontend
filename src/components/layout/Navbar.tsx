import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Menu, ShoppingBag, X, Heart, ChevronRight } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'Collections', href: '/collections' },
  {
    label: 'Bags',
    href: '/shop?category=Bags',
    children: [
      { label: 'Clutches', href: '/shop?category=Bags&sub=Clutches' },
      { label: 'Totes', href: '/shop?category=Bags&sub=Totes' },
      { label: 'Crossbody', href: '/shop?category=Bags&sub=Crossbody' },
    ],
  },
  {
    label: 'Shoes',
    href: '/shop?category=Shoes',
    children: [
      { label: 'Heels', href: '/shop?category=Shoes&sub=Heels' },
      { label: 'Loafers', href: '/shop?category=Shoes&sub=Loafers' },
      { label: 'Sandals', href: '/shop?category=Shoes&sub=Sandals' },
    ],
  },
  {
    label: 'Accessories',
    href: '/shop?category=Accessories',
    children: [
      { label: 'Necklaces', href: '/shop?category=Accessories&sub=Necklaces' },
      { label: 'Scarves', href: '/shop?category=Accessories&sub=Scarves' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const { isScrolled } = useScrollPosition();
  const { cartCount, savedItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMenuItem, setOpenMenuItem] = useState<string | null>(null);

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
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border animate-fade-in">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 bg-card border border-border px-4 py-2 shadow-soft focus-within:border-foreground focus-within:shadow-medium transition-all">
                  <Search size={18} strokeWidth={1.5} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search the collection..."
                    className="flex-1 bg-transparent text-sm md:text-base outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
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
            <div className="relative flex flex-col h-full">
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full transition-all duration-200 hover:bg-foreground hover:text-background"
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex-1 px-12 py-8 stagger-children space-y-4 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                  const hasChildren = Array.isArray((item as any).children) && (item as any).children.length > 0;

                  if (!hasChildren) {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className="w-full text-left py-2 font-serif text-3xl tracking-wide hover:text-primary transition-colors luxury-underline"
                        onClick={() => {
                          setIsMenuOpen(false);
                        }}
                      >
                        <Link to={item.href}>{item.label}</Link>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="w-full text-left py-2 font-serif text-3xl tracking-wide hover:text-primary transition-colors luxury-underline flex items-center justify-between group"
                      onClick={() => setOpenMenuItem(item.label)}
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        size={18}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </button>
                  );
                })}
              </nav>

              {/* Nested submenu panel for items with subcategories */}
              {openMenuItem && (() => {
                const active = menuItems.find(
                  (m) => (m as any).label === openMenuItem && Array.isArray((m as any).children)
                ) as any | undefined;

                if (!active) return null;

                const children = active.children as { label: string; href: string }[];

                return (
                  <div className="absolute top-0 right-0 bottom-0 w-full bg-background border-l border-border animate-slide-in-right flex flex-col">
                    <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border">
                      <button
                        type="button"
                        className="text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setOpenMenuItem(null)}
                      >
                        Back
                      </button>
                      <span className="font-serif text-xl tracking-wide">{active.label}</span>
                    </div>
                    <div className="flex-1 px-12 py-6 space-y-3 overflow-y-auto no-scrollbar">
                      {children.map((child) => (
                        <button
                          key={child.label}
                          type="button"
                          className="w-full text-left text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors luxury-underline"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenMenuItem(null);
                          }}
                        >
                          <Link to={child.href}>{child.label}</Link>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
