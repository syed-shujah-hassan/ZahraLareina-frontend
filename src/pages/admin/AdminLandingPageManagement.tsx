import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

interface AdminCategory {
  id: string;
  name: string;
  image: string;
  showInMenu: boolean;
  showOnHome: boolean;
  subcategories: { id: string; name: string }[];
}

interface FeaturedState {
  productId: string;
  featured: boolean;
  priority: number;
}

interface LandingProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  isFeatured?: boolean;
  featuredPriority?: number;
}

const AdminLandingPageManagement = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<LandingProduct[]>([]);

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (!token) {
          setError('Not authorized');
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/admin/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load categories');
        }

        const mapped: AdminCategory[] = data.categories.map((c: any) => ({
          id: c._id,
          name: c.name,
          image: c.image || '',
          showInMenu: !!c.showInMenu,
          showOnHome: !!c.showOnHome,
          subcategories: (c.subcategories || []).map((s: any, index: number) => ({
            id: `${c._id}-sub-${index}`,
            name: s.name,
          })),
        }));

        setCategories(mapped);
        if (mapped.length > 0) {
          setSelectedCategoryId(mapped[0].id);
        }

        // Load products for featured management
        const prodRes = await fetch(`${API_BASE}/api/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const prodData = await prodRes.json();
        if (!prodRes.ok || !prodData.success) {
          throw new Error(prodData.message || 'Failed to load products');
        }

        const mappedProducts: LandingProduct[] = prodData.products.map((p: any, index: number) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category,
          images: p.images || [],
          isFeatured: !!p.isFeatured,
          featuredPriority:
            typeof p.featuredPriority === 'number' ? p.featuredPriority : index + 1,
        }));

        setProducts(mappedProducts);
        setFeatured(
          mappedProducts.map(p => ({
            productId: p.id,
            featured: !!p.isFeatured,
            priority:
              typeof p.featuredPriority === 'number' ? p.featuredPriority! : 0,
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories[0]?.id ?? null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const [featured, setFeatured] = useState<FeaturedState[]>([]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create category');
      }

      const c = data.category;
      const mapped: AdminCategory = {
        id: c._id,
        name: c.name,
        image: c.image || '',
        showInMenu: !!c.showInMenu,
        showOnHome: !!c.showOnHome,
        subcategories: [],
      };
      setCategories(prev => [...prev, mapped]);
      setNewCategoryName('');
      setSelectedCategoryId(mapped.id);
    } catch (err) {
      console.error(err);
      alert('Failed to create category');
    }
  };

  const handleToggleCategoryFlag = async (id: string, key: 'showInMenu' | 'showOnHome') => {
    const existing = categories.find(c => c.id === id);
    if (!existing) return;
    const nextValue = !existing[key];

    setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, [key]: nextValue } : cat)));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [key]: nextValue }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryImageFileChange = async (id: string, file: File | undefined | null) => {
    if (!file) return;

    try {
      const url = await uploadImageToCloudinary(file);

      setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, image: url } : cat)));

      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: url }),
      });
    } catch (err) {
      console.error(err);
      alert('Failed to upload category image');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete category');
      }

      setCategories(prev => prev.filter(cat => cat.id !== id));
      setSelectedCategoryId(current => (current === id ? null : current));
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedCategoryId) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      // find index of selected category to map subIndex later if needed
      const catIndex = categories.findIndex(c => c.id === selectedCategoryId);

      const res = await fetch(`${API_BASE}/api/admin/categories/${selectedCategoryId}/subcategories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newSubcategoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add subcategory');
      }

      const c = data.category;
      const mappedSubcategories = (c.subcategories || []).map((s: any, index: number) => ({
        id: `${c._id}-sub-${index}`,
        name: s.name,
      }));

      setCategories(prev =>
        prev.map(cat =>
          cat.id === c._id
            ? {
                ...cat,
                subcategories: mappedSubcategories,
              }
            : cat
        )
      );

      setNewSubcategoryName('');
    } catch (err) {
      console.error(err);
      alert('Failed to add subcategory');
    }
  };

  const handleRemoveSubcategory = async (categoryId: string, subId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;

    const subIndex = cat.subcategories.findIndex(s => s.id === subId);
    if (subIndex === -1) return;

    setCategories(prev =>
      prev.map(c =>
        c.id === categoryId
          ? {
              ...c,
              subcategories: c.subcategories.filter(s => s.id !== subId),
            }
          : c
      )
    );

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/categories/${categoryId}/subcategories/${subIndex}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (productId: string) => {
    const current = featured.find(f => f.productId === productId);
    const nextValue = !current?.featured;

    setFeatured(prev =>
      prev.map(f =>
        f.productId === productId ? { ...f, featured: nextValue } : f
      )
    );

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFeatured: nextValue }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriorityChange = async (productId: string, value: string) => {
    const num = parseInt(value || '0', 10) || 0;
    setFeatured(prev =>
      prev.map(f => (f.productId === productId ? { ...f, priority: num } : f))
    );

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featuredPriority: num }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId) ?? null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-wide mb-2">Landing Page Management</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Configure the categories, menu structure, and featured products that power your
            ZahraLareina landing experience. All controls are frontend-only for now and can be
            wired to backend APIs later.
          </p>
        </div>
      </div>

      {/* 1. Categories & Subcategories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl tracking-wide">Categories & Subcategories</h2>
            <p className="text-muted-foreground text-sm">
              Manage main categories, images, and nested subcategories used across the landing
              page, menus, and product filters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Categories table */}
          <div className="xl:col-span-2 admin-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Show in Menu</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Show on Home</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr
                    key={cat.id}
                    className="border-b border-border hover:bg-secondary/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedCategoryId(cat.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-secondary overflow-hidden flex-shrink-0">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{cat.name}</span>
                          <label className="inline-flex items-center justify-center px-2 py-1 border border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:border-foreground cursor-pointer">
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e =>
                                handleCategoryImageFileChange(cat.id, e.target.files?.[0])
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs uppercase tracking-[0.15em] border ${
                          cat.showInMenu
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-border text-muted-foreground hover:border-foreground'
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleCategoryFlag(cat.id, 'showInMenu');
                        }}
                      >
                        {cat.showInMenu ? 'On' : 'Off'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs uppercase tracking-[0.15em] border ${
                          cat.showOnHome
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-border text-muted-foreground hover:border-foreground'
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleCategoryFlag(cat.id, 'showOnHome');
                        }}
                      >
                        {cat.showOnHome ? 'On' : 'Off'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        className="text-[11px] uppercase tracking-[0.2em] text-destructive hover:underline"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side panel for selected category + add new */}
          <div className="space-y-6">
            <div className="admin-card">
              <h3 className="font-serif text-lg mb-3">Add New Category</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] mb-1 text-muted-foreground">
                    Category Name
                  </label>
                  <input
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="w-full border border-border px-3 py-2 bg-transparent focus:outline-none focus:border-foreground"
                    placeholder="e.g. Bags"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="w-full btn-luxury mt-2 text-center"
                >
                  <span>Add Category</span>
                </button>
              </div>
            </div>

            <div className="admin-card">
              <h3 className="font-serif text-lg mb-3">Subcategories</h3>
              {selectedCategory ? (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Managing subcategories for <span className="font-medium">{selectedCategory.name}</span>.
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar pr-1 mb-3">
                    {selectedCategory.subcategories.map(sub => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between text-sm border border-border px-3 py-2"
                      >
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          className="text-xs text-destructive hover:underline"
                          onClick={() => handleRemoveSubcategory(selectedCategory.id, sub.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {selectedCategory.subcategories.length === 0 && (
                      <p className="text-xs text-muted-foreground">No subcategories yet.</p>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <label className="block text-xs uppercase tracking-[0.15em] mb-1 text-muted-foreground">
                      New Subcategory Name
                    </label>
                    <input
                      value={newSubcategoryName}
                      onChange={e => setNewSubcategoryName(e.target.value)}
                      className="w-full border border-border px-3 py-2 bg-transparent focus:outline-none focus:border-foreground"
                      placeholder="e.g. Evening Bags"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubcategory}
                      className="w-full btn-luxury mt-1 text-center"
                    >
                      <span>Add Subcategory</span>
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Select a category to manage subcategories.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Menu Items Management (view-only controls for now) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl tracking-wide">Menu Items Management</h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Control which categories appear in the main navigation and whether their
              subcategories should be exposed as nested dropdowns. This mirrors the luxury
              slide-out menu on the storefront.
            </p>
          </div>
        </div>

        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Show in Menu</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Show Subcategories</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-border hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-medium">{cat.name}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {cat.showInMenu ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {cat.subcategories.length > 0 ? 'Use nested submenu' : 'No subcategories'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Featured Products Management */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl tracking-wide">Featured Products</h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Mark key pieces as featured and control the display order used on the home page
              hero and featured strips.
            </p>
          </div>
        </div>

        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Featured</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Priority</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const state =
                  featured.find(f => f.productId === product.id) || {
                    productId: product.id,
                    featured: !!product.isFeatured,
                    priority: product.featuredPriority ?? 0,
                  };
                return (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-secondary/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-secondary overflow-hidden flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                    <td className="py-3 px-4 text-right">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs uppercase tracking-[0.15em] border ${
                          state.featured
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-border text-muted-foreground hover:border-foreground'
                        }`}
                        onClick={() => handleToggleFeatured(product.id)}
                      >
                        {state.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        min={0}
                        value={state.priority}
                        onChange={e => handlePriorityChange(product.id, e.target.value)}
                        className="w-20 border border-border bg-transparent px-2 py-1 text-xs text-right focus:outline-none focus:border-foreground"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminLandingPageManagement;
