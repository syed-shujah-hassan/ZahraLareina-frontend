import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Search, Menu, ShoppingBag, X, Heart, ChevronRight } from 'lucide-react';
import LogoPic1 from '@/logo/9325ddf3-1761-43a2-8cfc-1a22d67bb5d3_removalai_preview.png';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const STATIC_MENU_ITEMS = [
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const { isScrolled } = useScrollPosition();
  const { cartCount, savedItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuItem, setOpenMenuItem] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuCategories, setMenuCategories] = useState<
    { label: string; href: string; children?: { label: string; href: string }[] }[]
  >([]);
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  const navigate = useNavigate();

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);

    const handler = () => {
      const updated = localStorage.getItem('userEmail');
      setUserEmail(updated);
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Load menu categories from backend
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories/menu`);
        const data = await res.json();
        if (!res.ok || !data.success) return;

        const mapped = data.categories.map((c: any) => ({
          label: c.name,
          href: `/shop?category=${encodeURIComponent(c.name)}`,
          children: (c.subcategories || []).map((s: any) => ({
            label: s.name,
            href: `/shop?category=${encodeURIComponent(c.name)}&sub=${encodeURIComponent(
              s.name
            )}`,
          })),
        }));

        setMenuCategories(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [API_BASE]);

  const initials = userEmail
    ? userEmail
        .split('@')[0]
        .slice(0, 2)
        .toUpperCase()
    : null;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
    }
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

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

  const handleSearchSubmit = () => {
    const query = searchTerm.trim();
    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/95 backdrop-blur-sm border-b border-border py-2'
            : 'bg-transparent py-3'
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo - only show once user has scrolled */}
            <Link
              to="/"
              className="flex items-center"
            >
              {isScrolled && (
                <img
                  src={LogoPic1}
                  alt="Zahra La Reina logo"
                  className={cn(
                    'h-12 md:h-16 lg:h-18 transition-transform duration-500 origin-left',
                    'scale-100'
                  )}
                />
              )}
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Cart (closest to logo) */}
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

              {/* User Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 transition-all duration-200 group-hover:scale-[1.02] group-hover:opacity-80"
                  aria-label="User menu"
                >
                  {isLoggedIn && initials ? (
                    <span className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-medium shadow-sm group-hover:shadow-md group-hover:ring-2 group-hover:ring-foreground/20 group-hover:ring-offset-[2px] group-hover:ring-offset-background transition-all duration-200">
                      {initials}
                    </span>
                  ) : (
                    <User size={20} strokeWidth={1.5} />
                  )}
                </button>
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border shadow-medium z-50 animate-fade-in">
                      {isLoggedIn && userEmail ? (
                        <div className="px-4 py-3 text-xs border-b border-border text-muted-foreground">
                          <p className="uppercase tracking-[0.2em] mb-1">Signed in</p>
                          <p className="truncate">{userEmail}</p>
                        </div>
                      ) : null}

                      {!isLoggedIn && (
                        <Link
                          to="/signin"
                          className="block px-4 py-3 text-sm hover:bg-secondary transition-colors luxury-underline"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                      )}

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
                      <div className="border-t border-border mt-1">
                        <Link
                          to="/admin/login"
                          className="block px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Studio
                        </Link>
                        {isLoggedIn && (
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                          >
                            Logout
                          </button>
                        )}
                      </div>
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

              {/* Menu (rightmost) */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Menu"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchSubmit();
                      }
                    }}
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
                {(() => {
                  const primaryItems = STATIC_MENU_ITEMS.filter(
                    (i) => i.label === 'Shop' || i.label === 'New Arrivals'
                  );
                  const secondaryItems = STATIC_MENU_ITEMS.filter(
                    (i) => i.label === 'About' || i.label === 'Contact'
                  );

                  const menuItems: {
                    label: string;
                    href: string;
                    children?: { label: string; href: string }[];
                  }[] = [
                    ...primaryItems,
                    ...menuCategories,
                    ...secondaryItems,
                  ];

                  return menuItems.map((item) => {
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
                });
                })()}
              </nav>

              {/* Admin Studio link in mobile menu */}
              <div className="px-12 pb-8 pt-2 border-t border-border">
                <Link
                  to="/admin/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin Studio
                </Link>
              </div>

              {/* Nested submenu panel for items with subcategories */}
              {openMenuItem && (() => {
                const primaryItems = STATIC_MENU_ITEMS.filter(
                  (i) => i.label === 'Shop' || i.label === 'New Arrivals'
                );
                const secondaryItems = STATIC_MENU_ITEMS.filter(
                  (i) => i.label === 'About' || i.label === 'Contact'
                );

                const menuItems: {
                  label: string;
                  href: string;
                  children?: { label: string; href: string }[];
                }[] = [
                  ...primaryItems,
                  ...menuCategories,
                  ...secondaryItems,
                ];

                const allItems = menuItems;
                const active = allItems.find(
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
