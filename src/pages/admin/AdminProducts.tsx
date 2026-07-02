import { useEffect, useState } from 'react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { Product } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStoreSettings } from '@/context/StoreSettingsContext';

const AdminProducts = () => {
  const { formatPrice, currency } = useStoreSettings();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Bags',
    subcategory: '',
    description: '',
    images: [] as string[],
    sizes: '',
    inStock: true,
    discount: '',
    isNew: false,
  });
  const [categoryList, setCategoryList] = useState<
    { name: string; subcategories: string[] }[]
  >([]);

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const run = async () => {
      try {
        // Load categories for dropdowns
        const catRes = await fetch(`${API_BASE}/api/categories`);
        const catData = await catRes.json();
        if (catRes.ok && catData.success) {
          const mapped = catData.categories.map((c: any) => ({
            name: c.name,
            subcategories: (c.subcategories || [])
              .map((s: any) => (typeof s === 'string' ? s : s?.name))
              .filter((s: string | undefined) => !!s),
          }));

          setCategoryList(mapped);

          if (!mapped.find(c => c.name === formData.category) && mapped[0]) {
            setFormData(prev => ({ ...prev, category: mapped[0].name, subcategory: '' }));
          }
        }

        // Load products from backend (admin view)
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (!token) return;

        const prodRes = await fetch(`${API_BASE}/api/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const prodData = await prodRes.json();
        if (!prodRes.ok || !prodData.success) return;

        const mappedProducts: Product[] = prodData.products.map((p: any) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category,
          subcategory: p.subcategory,
          description: p.description,
          images: p.images || [],
          sizes: p.sizes || [],
          inStock: p.inStock,
          isNew: p.isNew,
          discount: p.discount,
        }));

        setProductsList(mappedProducts);
      } catch (err) {
        console.error(err);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeImageAtIndex = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        subcategory: product.subcategory || '',
        description: product.description,
        images: product.images || [],
        sizes: product.sizes.join(', '),
        inStock: product.inStock ?? true,
        discount: product.discount ? String(product.discount) : '',
        isNew: !!product.isNew,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: 'Bags',
        subcategory: '',
        description: '',
        images: [],
        sizes: '',
        inStock: true,
        discount: '',
        isNew: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length < 1) {
      alert('Please upload at least 1 product image.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      description: formData.description.trim(),
      images: formData.images,
      sizes: formData.sizes.trim()
        ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      inStock: formData.inStock,
      discount: formData.discount ? Number(formData.discount) : undefined,
      isNew: formData.isNew,
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) {
        alert('Not authorized');
        return;
      }

      let url = `${API_BASE}/api/admin/products`;
      let method: 'POST' | 'PATCH' = 'POST';

      if (editingProduct) {
        url = `${API_BASE}/api/admin/products/${editingProduct.id}`;
        method = 'PATCH';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save product');
      }

      const p = data.product;
      const saved: Product = {
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        subcategory: p.subcategory,
        description: p.description,
        images: p.images || [],
        sizes: p.sizes || [],
        inStock: p.inStock,
        isNew: p.isNew,
        discount: p.discount,
      };

      if (editingProduct) {
        setProductsList(prev => prev.map(prod => (prod.id === editingProduct.id ? saved : prod)));
      } else {
        setProductsList(prev => [saved, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const filteredProducts = categoryFilter === 'All'
    ? productsList
    : productsList.filter(p => p.category === categoryFilter);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product');
      }

      setProductsList(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const handleImageFileChange = async (file: File | null) => {
    if (!file) {
      setFormData(prev => ({ ...prev, images: [] }));
      return;
    }

    try {
      const url = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, images: [...prev.images, url].slice(0, 10) }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload product image');
    }
  };

  const handleInlineStatusChange = async (id: string, value: string) => {
    const inStock = value === 'in';
    setProductsList(prev => prev.map(p => (p.id === id ? { ...p, inStock } : p)));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inStock }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-wide mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Filter</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-border bg-transparent px-3 py-2 text-sm min-w-[150px] focus:outline-none focus:border-foreground"
            >
              <option value="All">All Categories</option>
              {categoryList.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={() => openModal()} className="btn-luxury flex items-center justify-center gap-2">
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr
                key={product.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-16 bg-secondary overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground">{product.category}</td>
                <td className="py-4 px-4 text-right">{formatPrice(product.price)}</td>
                <td className="py-4 px-4 text-center">
                  <select
                    value={product.inStock ? 'in' : 'out'}
                    onChange={e => handleInlineStatusChange(product.id, e.target.value)}
                    className={cn(
                      "text-xs px-2 py-1 border bg-transparent",
                      product.inStock
                        ? "border-green-500 text-green-700"
                        : "border-red-500 text-red-700"
                    )}
                  >
                    <option value="in">In Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="p-2 hover:bg-secondary transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/30 z-50" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background z-50 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-xl">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={closeModal} aria-label="Close">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                    Price{currency ? ` (${currency})` : ''}
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        subcategory: '',
                      })
                    }
                    disabled={categoryList.length === 0}
                    className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/70"
                  >
                    {categoryList.length === 0 ? (
                      <option value="">No categories available</option>
                    ) : (
                      categoryList.map(cat => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              {/* Subcategory */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Subcategory
                </label>
                {(() => {
                  const currentCategory = categoryList.find(c => c.name === formData.category);
                  const subcategories = currentCategory?.subcategories || [];
                  const noCategories = categoryList.length === 0;
                  const noSubcategories = !noCategories && subcategories.length === 0;

                  return (
                    <select
                      value={formData.subcategory}
                      onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                      disabled={noCategories || noSubcategories}
                      className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/70"
                    >
                      {noCategories && <option value="">Add a category first</option>}
                      {noSubcategories && <option value="">No subcategories for this category</option>}
                      {!noCategories && !noSubcategories && (
                        <>
                          <option value="">Select subcategory</option>
                          {subcategories.map(sub => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  );
                })()}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Product Images (up to 10)
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-12 h-16 bg-secondary overflow-hidden">
                        <img
                          src={img}
                          alt={`${formData.name || 'Preview'} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageAtIndex(idx)}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black/70 text-[10px] leading-none flex items-center justify-center text-white hover:bg-black"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {!formData.images.length && (
                      <div className="w-16 h-20 bg-secondary flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                        No Images
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center justify-center px-3 py-2 border border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:border-foreground cursor-pointer">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleImageFileChange(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Discounted Price (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                  placeholder="Final sale price, e.g. 1200"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                  placeholder="S, M, L or One Size (optional)"
                />
              </div>
              {/* New Arrival flag */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  New Arrival
                </label>
                <select
                  value={formData.isNew ? 'new' : 'regular'}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      isNew: e.target.value === 'new',
                    }))
                  }
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                >
                  <option value="regular">Not New</option>
                  <option value="new">New Product</option>
                </select>
              </div>
              {/* Status */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Status
                </label>
                <select
                  value={formData.inStock ? 'in' : 'out'}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      inStock: e.target.value === 'in',
                    }))
                  }
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                >
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
              <button type="submit" className="w-full btn-luxury">
                <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
