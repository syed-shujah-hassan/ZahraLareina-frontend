import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under 500', min: 0, max: 500 },
  { label: '500 - 1,000', min: 500, max: 1000 },
  { label: '1,000 - 3,000', min: 1000, max: 3000 },
  { label: 'Over 3,000', min: 3000, max: Infinity },
];

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const isNewFilter = searchParams.get('filter') === 'new';
  const initialSubcategory = searchParams.get('sub') || 'All';
  const searchQuery = (searchParams.get('search') || '').trim();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<{ name: string; subcategories: string[] }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState('');

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Only show price ranges that actually have products in them (except "All Prices" which is always shown)
  const availablePriceRanges = useMemo(() => {
    if (!products.length) return priceRanges;

    return priceRanges.filter(range => {
      if (range.label === 'All Prices') return true;
      return products.some(p => p.price >= range.min && p.price <= range.max);
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search (from navbar search bar)
    if (searchQuery) {
      const lowered = searchQuery.toLowerCase();
      result = result.filter(p => {
        const name = p.name?.toLowerCase() || '';
        const desc = p.description?.toLowerCase() || '';
        return name.includes(lowered) || desc.includes(lowered);
      });
    }

    // Filter by new arrivals
    if (isNewFilter) {
      result = result.filter(p => p.isNew);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by subcategory (within the selected category)
    if (selectedCategory !== 'All' && selectedSubcategory !== 'All') {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    // Filter by price
    result = result.filter(
      p => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, selectedSubcategory, selectedPriceRange, sortBy, isNewFilter, searchQuery]);

  // Keep selectedCategory and selectedSubcategory in sync with URL query
  // so that navigating directly to /shop?category=Bags&sub=Clutches
  // correctly pre-filters products.
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedSubcategory(initialSubcategory || 'All');
  }, [initialCategory, initialSubcategory]);

  // Load categories from backend for filter sidebar and subcategories filter
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        if (!res.ok || !data.success) return;

        const mapped = (data.categories as any[]).map(c => ({
          name: c.name as string,
          subcategories: ((c.subcategories || []) as any[]).map(s => s.name as string),
        }));

        setCategoryList(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [API_BASE]);

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError('');

        const params = new URLSearchParams();
        if (isNewFilter) params.set('isNew', 'true');

        const res = await fetch(`${API_BASE}/api/products${params.toString() ? `?${params.toString()}` : ''}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setProductsError(data.message || 'Failed to load products');
          return;
        }

        const mapped: Product[] = (data.products as any[]).map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category,
          subcategory: p.subcategory,
          images: p.images || [],
          description: p.description,
          sizes: p.sizes || [],
          inStock: p.inStock,
          isNew: p.isNew,
          discount: p.discount,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error(err);
        setProductsError('Failed to load products');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [API_BASE, isNewFilter]);

  // Derive available subcategories for the current category from backend categories
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'All') return [] as string[];
    const found = categoryList.find(c => c.name === selectedCategory);
    return found ? found.subcategories : [];
  }, [selectedCategory, categoryList]);

  const FilterSidebar = ({ onFilterChange }: { onFilterChange?: () => void }) => (
    <div className="space-y-8 bg-card border border-border px-6 py-6 shadow-soft md:sticky md:top-28">
      {/* Categories - only show when viewing all products */}
      {selectedCategory === 'All' && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-foreground">
            Category
          </h3>
          <ul className="space-y-2">
            {categoryList.map(category => (
              <li key={category.name}>
                <button
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setSelectedSubcategory('All');
                    onFilterChange?.();
                  }}
                  className={cn(
                    "text-sm transition-colors",
                    selectedCategory === category.name
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price Range */}
      <div className={cn(
        "pt-4 mt-2",
        selectedCategory === 'All' ? 'border-t border-border/60' : ''
      )}>
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-foreground">
          Price
        </h3>
        <ul className="space-y-2">
          {availablePriceRanges.map(range => (
            <li key={range.label}>
              <button
                onClick={() => {
                  setSelectedPriceRange(range);
                  onFilterChange?.();
                }}
                className={cn(
                  "text-sm transition-colors",
                  selectedPriceRange.label === range.label
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories */}
      {selectedCategory !== 'All' && availableSubcategories.length > 0 && (
        <div className="pt-4 border-t border-border/60 mt-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-foreground">
            Subcategories
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setSelectedSubcategory('All');
                  onFilterChange?.();
                }}
                className={cn(
                  "text-sm transition-colors",
                  selectedSubcategory === 'All'
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
            </li>
            {availableSubcategories.map(sub => (
              <li key={sub}>
                <button
                  onClick={() => {
                    setSelectedSubcategory(sub);
                    onFilterChange?.();
                  }}
                  className={cn(
                    "text-sm transition-colors",
                    selectedSubcategory === sub
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {sub}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16 px-4">
            <h1 className="font-serif text-3xl md:text-5xl tracking-wide leading-tight break-words">
              {isNewFilter
                ? 'New Arrivals'
                : selectedSubcategory !== 'All'
                  ? selectedSubcategory
                  : selectedCategory !== 'All'
                    ? selectedCategory
                    : 'Shop All'}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex gap-12">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative group ml-auto">
                  <button className="flex items-center gap-2 text-sm">
                    Sort: {sortOptions.find(o => o.value === sortBy)?.label}
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={cn(
                          "block w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors",
                          sortBy === option.value && "bg-secondary"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {isLoadingProducts ? (
                <div className="text-center py-24">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : productsError ? (
                <div className="text-center py-24">
                  <p className="text-destructive">{productsError}</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/30 backdrop-blur-[2px] z-50 animate-fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="mx-auto max-w-md bg-background rounded-t-3xl border-t border-border shadow-medium max-h-[75vh] overflow-y-auto pb-6">
              {/* Handle + Header */}
              <div className="pt-4 px-6 pb-4 border-b border-border/60 flex flex-col items-center gap-3">
                <div className="w-10 h-1.5 rounded-full bg-border/80" />
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-serif text-lg tracking-wide">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="px-6 pt-4 space-y-6">
                <FilterSidebar onFilterChange={() => setIsMobileFilterOpen(false)} />
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full btn-luxury mt-2"
                >
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Shop;
