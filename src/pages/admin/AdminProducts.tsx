import { useState } from 'react';
import { products as initialProducts, categories } from '@/data/products';
import { Product } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminProducts = () => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Bags',
    subcategory: '',
    description: '',
    imagePreview: '',
    sizes: '',
    inStock: true,
  });

  const subcategoryOptions: Record<string, string[]> = {
    Bags: ['Clutches', 'Totes', 'Crossbody'],
    Shoes: ['Heels', 'Loafers', 'Sandals'],
    Accessories: ['Necklaces', 'Scarves'],
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
        imagePreview: product.images[0] || '',
        sizes: product.sizes.join(', '),
        inStock: product.inStock ?? true,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: 'Bags',
        subcategory: '',
        description: '',
        imagePreview: '',
        sizes: '',
        inStock: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
       subcategory: formData.subcategory || undefined,
      description: formData.description,
      images: formData.imagePreview
        ? [formData.imagePreview]
        : editingProduct?.images || [],
      sizes: formData.sizes.split(',').map(s => s.trim()),
      inStock: formData.inStock,
    };

    if (editingProduct) {
      setProductsList(prev =>
        prev.map(p => (p.id === editingProduct.id ? newProduct : p))
      );
    } else {
      setProductsList(prev => [...prev, newProduct]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProductsList(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-wide mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <button onClick={() => openModal()} className="btn-luxury flex items-center gap-2">
          <Plus size={18} />
          <span>Add Product</span>
        </button>
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
            {productsList.map(product => (
              <tr
                key={product.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground">{product.category}</td>
                <td className="py-4 px-4 text-right">${product.price.toLocaleString()}</td>
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
                    Price ($)
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
                    className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Subcategory */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                >
                  <option value="">Select subcategory</option>
                  {(subcategoryOptions[formData.category] || []).map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
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
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-secondary overflow-hidden flex-shrink-0">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt={formData.name || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                        No Image
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
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
                  placeholder="S, M, L or One Size"
                  required
                />
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
