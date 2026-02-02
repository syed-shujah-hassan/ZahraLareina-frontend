import { useState } from 'react';
import { Order } from '@/types';
import { Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Emma Watson',
    email: 'emma@example.com',
    items: [
      {
        product: {
          id: '1',
          name: 'Velvet Evening Clutch',
          price: 1850,
          category: 'Bags',
          images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'],
          description: '',
          sizes: ['One Size'],
          inStock: true,
        },
        quantity: 1,
        size: 'One Size',
      },
    ],
    total: 1850,
    status: 'delivered',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customerName: 'John Smith',
    email: 'john@example.com',
    items: [
      {
        product: {
          id: '3',
          name: 'Strappy Stiletto Heel',
          price: 1290,
          category: 'Shoes',
          images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'],
          description: '',
          sizes: ['38'],
          inStock: true,
        },
        quantity: 2,
        size: '38',
      },
    ],
    total: 2580,
    status: 'processing',
    date: '2024-01-14',
  },
  {
    id: 'ORD-003',
    customerName: 'Sarah Connor',
    email: 'sarah@example.com',
    items: [
      {
        product: {
          id: '2',
          name: 'Leather Tote Luxe',
          price: 2450,
          category: 'Bags',
          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
          description: '',
          sizes: ['One Size'],
          inStock: true,
        },
        quantity: 1,
        size: 'One Size',
      },
    ],
    total: 2450,
    status: 'shipped',
    date: '2024-01-13',
  },
  {
    id: 'ORD-004',
    customerName: 'Mike Johnson',
    email: 'mike@example.com',
    items: [
      {
        product: {
          id: '5',
          name: 'Gold Chain Necklace',
          price: 890,
          category: 'Accessories',
          images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
          description: '',
          sizes: ['One Size'],
          inStock: true,
        },
        quantity: 1,
        size: 'One Size',
      },
    ],
    total: 890,
    status: 'pending',
    date: '2024-01-12',
  },
];

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => (order.id === id ? { ...order, status } : order)));
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
                <td className="py-4 px-4 font-medium">{order.id}</td>
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
                      handleStatusChange(order.id, e.target.value as Order['status'])
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
                <td className="py-4 px-4 text-right">${order.total.toLocaleString()}</td>
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
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-foreground/30 z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background z-50 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-xl">Order {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} aria-label="Close">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Customer
                </h3>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
                  Status
                </h3>
                <span className={cn("inline-block px-3 py-1 text-xs capitalize", statusColors[selectedOrder.status])}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] mb-4 text-muted-foreground">
                  Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map(item => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-secondary overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm">${(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-serif text-xl">${selectedOrder.total.toLocaleString()}</span>
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
