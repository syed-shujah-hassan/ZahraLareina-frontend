import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const AdminDashboard = () => {
  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [ordersData, setOrdersData] = useState<{ day: string; orders: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<
    { id: string; customer: string; status: string; total: number; date?: string }[]
  >([]);

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

        const res = await fetch(`${API_BASE}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load dashboard stats');
        }

        const s = data.stats || {};
        setTotalRevenue(s.totalRevenue || 0);
        setTotalOrders(s.totalOrders || 0);
        setTotalCustomers(s.totalCustomers || 0);
        setActiveCustomers(s.activeCustomers || 0);
        setPendingOrders(s.pendingOrders || 0);
        setProductsCount(s.productsCount || 0);

        setRevenueData(Array.isArray(data.revenueSeries) ? data.revenueSeries : []);
        setOrdersData(Array.isArray(data.ordersSeries) ? data.ordersSeries : []);

        setRecentOrders(
          Array.isArray(data.recentOrders)
            ? data.recentOrders.map((o: any) => ({
                id: o.id,
                customer: o.customer,
                status: o.status,
                total: o.total,
                date: o.date,
              }))
            : []
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [API_BASE]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl tracking-wide mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening.</p>
      </div>
      {/* Error / Loading */}
      {loading ? (
        <div className="admin-card py-6 text-center text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      ) : error ? (
        <div className="admin-card py-6 text-center text-sm text-destructive">{error}</div>
      ) : null}

      {/* Stats Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="admin-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-secondary">
                <DollarSign size={20} className="text-primary" />
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">
                Rs {totalRevenue.toLocaleString()}
              </span>
              <span className="admin-stat-label">Total Revenue</span>
            </div>
          </div>

          <div className="admin-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-secondary">
                <ShoppingBag size={20} className="text-primary" />
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{totalOrders}</span>
              <span className="admin-stat-label">Total Orders</span>
            </div>
          </div>

          <div className="admin-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-secondary">
                <Users size={20} className="text-primary" />
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{totalCustomers}</span>
              <span className="admin-stat-label">Total Customers</span>
            </div>
          </div>

          <div className="admin-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-secondary">
                <TrendingUp size={20} className="text-primary" />
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{activeCustomers}</span>
              <span className="admin-stat-label">Active Customers</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {!loading && !error && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="admin-card">
          <h3 className="font-serif text-xl mb-6">Revenue Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={value => `Rs ${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 0,
                  }}
                  formatter={(value: number) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="admin-card">
          <h3 className="font-serif text-xl mb-6">Weekly Orders</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 0,
                  }}
                  formatter={(value: number) => [value, 'Orders']}
                />
                <Bar dataKey="orders" fill="hsl(var(--foreground))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      )}

      {/* Recent Orders */}
      {!loading && !error && (
        <div className="admin-card">
          <h3 className="font-serif text-xl mb-6">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => {
                    const status = order.status?.toLowerCase() || '';
                    const statusClass =
                      status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : status === 'shipped'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : status === 'cancelled' || status === 'canceled'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-secondary text-foreground border-border';

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-secondary/50"
                      >
                        <td className="py-4 px-4 font-medium">{order.id}</td>
                        <td className="py-4 px-4">{order.customer}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">Rs {order.total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
