import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { formatPrice } = useStoreSettings();
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleCheckout = async () => {
    if (typeof window === 'undefined') return;
    setError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin', { replace: true, state: { from: '/cart' } });
      return;
    }

    try {
      setIsPlacing(true);
      const payload = {
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          image: item.product.images?.[0],
          price: item.product.price,
          size: item.size,
          quantity: item.quantity,
        })),
        total: cartTotal,
      };

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <ShoppingBag size={64} strokeWidth={1} className="mx-auto mb-6 text-muted-foreground" />
            <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Discover our exquisite collection and find something you love.
            </p>
            <Link to="/shop" className="btn-luxury inline-block">
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl tracking-wide mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-6 pb-6 border-b border-border animate-fade-in"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-28 h-36 bg-secondary flex-shrink-0 overflow-hidden"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-serif text-lg tracking-wide hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="p-1 hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Size: {item.size}
                      </p>
                      <p className="text-sm">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity & Subtotal */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity - 1)
                          }
                          className="p-2 hover:bg-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity + 1)
                          }
                          className="p-2 hover:bg-secondary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary p-8 sticky top-32">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-serif text-xl">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
                {error && (
                  <p className="text-xs text-destructive mb-3">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isPlacing}
                  className="w-full btn-luxury mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{isPlacing ? 'Placing Order...' : 'Place Order'}</span>
                </button>

                <Link
                  to="/shop"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
