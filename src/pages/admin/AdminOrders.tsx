import { useEffect, useState } from 'react';
import { ChevronDown, Eye, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStoreSettings } from '@/context/StoreSettingsContext';

type AdminOrderItem = {
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

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  items: AdminOrderItem[];
  total: number;
  status: keyof typeof statusColors;
  date: string;
  contactInfo?: ContactInfo;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod?: string;
  shippingMethod?: string;
  notes?: string;
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminOrders = () => {
  const { formatPrice } = useStoreSettings();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError('');

        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (!token) {
          setError('Not authorized');
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/orders/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load orders');
        }

        const mapped: AdminOrder[] = (data.orders || []).map((o: any) => ({
          id: o.id || o._id,
          orderNumber: o.orderNumber || o.id || o._id,
          customerName: o.contactInfo?.fullName || o.user?.fullName || o.shippingAddress?.firstName + ' ' + o.shippingAddress?.lastName || o.email,
          email: o.email || o.user?.email,
          total: o.total || 0,
          status: (o.status || 'pending') as keyof typeof statusColors,
          date: o.createdAt ? o.createdAt.substring(0, 10) : '',
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
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleStatusChange = async (id: string, status: AdminOrder['status']) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) {
        setError('Not authorized');
        return;
      }

      const res = await fetch(`${API_BASE}/api/orders/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update status');
      }

      setOrders(prev => prev.map(order => (order.id === id ? { ...order, status } : order)));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl tracking-wide mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      {/* Orders Table */}
      <div className="admin-card overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading orders...</div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-destructive">{error}</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-secondary/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{order.orderNumber}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p>{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{order.date}</td>
                  <td className="py-4 px-4 text-center">
                    <select
                      value={order.status}
                      onChange={e =>
                        handleStatusChange(order.id, e.target.value as AdminOrder['status'])
                      }
                      className={cn(
                        "text-xs px-2 py-1 rounded-none border border-transparent capitalize cursor-pointer",
                        statusColors[order.status]
                      )}
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">{formatPrice(order.total)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-secondary transition-colors"
                        aria-label="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-foreground/30 z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-background z-50 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-xl">Order {selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} aria-label="Close">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Status
                </h3>
                <span className={cn("inline-block px-3 py-1 text-xs capitalize", statusColors[selectedOrder.status])}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Customer Details
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                  {selectedOrder.contactInfo?.phone && (
                    <p><span className="font-medium">Phone:</span> {selectedOrder.contactInfo.phone}</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                    Shipping Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    {selectedOrder.shippingAddress.address2 && <p>{selectedOrder.shippingAddress.address2}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zip} {selectedOrder.shippingAddress.country}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              {selectedOrder.billingAddress && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                    Billing Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.billingAddress.firstName} {selectedOrder.billingAddress.lastName}</p>
                    <p>{selectedOrder.billingAddress.address}</p>
                    {selectedOrder.billingAddress.address2 && <p>{selectedOrder.billingAddress.address2}</p>}
                    <p>{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.zip} {selectedOrder.billingAddress.country}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.billingAddress.phone}</p>
                  </div>
                </div>
              )}

              {/* Payment & Shipping Method */}
              <div className="grid grid-cols-2 gap-4">
                {selectedOrder.paymentMethod && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                      Payment Method
                    </h3>
                    <p className="text-sm">{selectedOrder.paymentMethod}</p>
                  </div>
                )}
                {selectedOrder.shippingMethod && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                      Shipping Method
                    </h3>
                    <p className="text-sm">{selectedOrder.shippingMethod}</p>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                    Order Notes
                  </h3>
                  <p className="text-sm bg-secondary/50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] mb-4 text-muted-foreground">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className="flex gap-4">
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
                        <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-serif text-xl">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
