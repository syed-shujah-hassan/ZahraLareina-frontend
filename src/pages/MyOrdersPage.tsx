import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';
import { useStoreSettings } from '@/context/StoreSettingsContext';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

type OrderItemUI = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
};

type Address = {
  firstName?: string;
  lastName?: string;
  address: string;
  address2?: string;
  city: string;
  zip?: string;
  country: string;
  phone: string;
};

type ContactInfo = {
  fullName?: string;
  phone?: string;
};

type OrderUI = {
  id: string;
  date: string;
  status: keyof typeof statusColors;
  total: number;
  items: OrderItemUI[];
  contactInfo?: ContactInfo;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod?: string;
  shippingMethod?: string;
  notes?: string;
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { formatPrice } = useStoreSettings();

  const isLoggedIn =
    typeof window !== 'undefined' && !!localStorage.getItem('authToken');

  // Guest lookup state
  const [lookupOrderNumber, setLookupOrderNumber] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupedOrder, setLookupedOrder] = useState<OrderUI | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Prefill lookup form with last order details if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastOrderNumber = localStorage.getItem('lastOrderNumber');
      const lastOrderEmail = localStorage.getItem('lastOrderEmail');
      if (lastOrderNumber) setLookupOrderNumber(lastOrderNumber);
      if (lastOrderEmail) setLookupEmail(lastOrderEmail);
    }
  }, []);

  // Load orders for logged-in users
  const loadSignedInOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      setLookupedOrder(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        setError('Not authorized');
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/orders/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load orders');
      }

      const mapped: OrderUI[] = (data.orders || []).map((o: any) => ({
        id: o.orderNumber || o._id,
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
        status: (o.status || 'pending') as keyof typeof statusColors,
        total: o.total || 0,
        contactInfo: o.contactInfo,
        shippingAddress: o.shippingAddress,
        billingAddress: o.billingAddress,
        paymentMethod: o.paymentMethod,
        shippingMethod: o.shippingMethod,
        notes: o.notes,
        items: (o.items || []).map((it: any) => ({
          name: it.name,
          size: it.size,
          quantity: it.quantity,
          price: it.price,
          image: it.image,
        })),
      }));

      setOrders(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Load orders when component mounts if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadSignedInOrders();
    }
  }, [isLoggedIn, API_BASE]);

  // Guest order lookup
  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLookupLoading(true);
      setError('');
      setOrders([]);

      const res = await fetch(`${API_BASE}/api/orders/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: lookupOrderNumber,
          email: lookupEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to find order');
      }

      const mappedOrder: OrderUI = {
        id: data.order.orderNumber || data.order._id,
        date: data.order.createdAt ? new Date(data.order.createdAt).toLocaleDateString() : '',
        status: (data.order.status || 'pending') as keyof typeof statusColors,
        total: data.order.total || 0,
        contactInfo: data.order.contactInfo,
        shippingAddress: data.order.shippingAddress,
        billingAddress: data.order.billingAddress,
        paymentMethod: data.order.paymentMethod,
        shippingMethod: data.order.shippingMethod,
        notes: data.order.notes,
        items: (data.order.items || []).map((it: any) => ({
          name: it.name,
          size: it.size,
          quantity: it.quantity,
          price: it.price,
          image: it.image,
        })),
      };

      setLookupedOrder(mappedOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to find order');
    } finally {
      setIsLookupLoading(false);
    }
  };

  // Helper to render order details
  const renderOrderDetails = (order: OrderUI) => (
    <div
      key={order.id}
      className="bg-card border border-border p-6 md:p-8 shadow-soft hover:shadow-luxury transition-shadow animate-fade-up"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
            Order
          </p>
          <p className="font-serif text-lg">{order.id}</p>
          <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
        </div>
        <div className="flex items-center gap-6 md:text-right">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Status
            </p>
            <span
              className={cn(
                'inline-block px-3 py-1 text-xs capitalize rounded-full',
                statusColors[order.status]
              )}
            >
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Total
            </p>
            <p className="font-serif text-xl">{formatPrice(order.total)}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Contact Info */}
      {order.contactInfo && (
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
            Contact Info
          </h3>
          <div className="text-sm space-y-1">
            {order.contactInfo.fullName && <p>{order.contactInfo.fullName}</p>}
            {order.contactInfo.phone && <p>{order.contactInfo.phone}</p>}
          </div>
        </div>
      )}

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
            Shipping Address
          </h3>
          <div className="text-sm space-y-1">
            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.zip} {order.shippingAddress.country}
            </p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      )}

      {/* Payment & Shipping Method */}
      {(order.paymentMethod || order.shippingMethod) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {order.paymentMethod && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                Payment Method
              </h3>
              <p className="text-sm">{order.paymentMethod}</p>
            </div>
          )}
          {order.shippingMethod && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                Shipping Method
              </h3>
              <p className="text-sm">{order.shippingMethod}</p>
            </div>
          )}
        </div>
      )}

      {/* Order Notes */}
      {order.notes && (
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
            Order Notes
          </h3>
          <p className="text-sm bg-secondary/50 p-3 rounded">{order.notes}</p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Items */}
      <div className="space-y-4">
        {order.items.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex gap-4">
            <div className="w-16 h-20 bg-secondary overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                Size: {item.size} • Qty: {item.quantity}
              </p>
              <p className="font-medium">{formatPrice(item.price)} x {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Your Purchases</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              My Orders
            </h1>
          </div>

          {/* If not logged in: show guest lookup */}
          {!isLoggedIn ? (
            <div className="bg-card border border-border p-6 md:p-8 shadow-soft max-w-md mx-auto">
              <h2 className="font-serif text-lg mb-6">Track Your Order</h2>
              <form onSubmit={handleGuestLookup} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    required
                    value={lookupOrderNumber}
                    onChange={(e) => setLookupOrderNumber(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                    placeholder="ZLR-1234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLookupLoading}
                  className="w-full btn-luxury"
                >
                  <span>{isLookupLoading ? 'Looking up...' : 'Track Order'}</span>
                </button>
              </form>
            </div>
          ) : (
            // If logged in: show their orders
            <>
              {isLoading ? (
                <div className="text-center py-24 animate-fade-up">
                  <p className="text-muted-foreground mb-4">Loading your orders...</p>
                </div>
              ) : error ? (
                <div className="text-center py-24 animate-fade-up">
                  <p className="text-destructive mb-4 text-sm">{error}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-24 animate-fade-up">
                  <p className="text-muted-foreground mb-4">You have no orders yet.</p>
                  <Link to="/shop" className="btn-luxury inline-flex items-center justify-center">
                    <span>Start Shopping</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order, index) => (
                    <div key={order.id} style={{ animationDelay: `${index * 0.06}s` }}>
                      {renderOrderDetails(order)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* If there's a lookuped order, show it */}
          {lookupedOrder && (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-2xl">Order Details</h2>
              </div>
              {renderOrderDetails(lookupedOrder)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrdersPage;
