import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
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

const stats = [
  {
    label: 'Total Revenue',
    value: '$124,580',
    change: '+12.5%',
    isPositive: true,
    icon: DollarSign,
  },
  {
    label: 'Total Orders',
    value: '1,248',
    change: '+8.2%',
    isPositive: true,
    icon: ShoppingBag,
  },
  {
    label: 'Total Customers',
    value: '892',
    change: '+15.3%',
    isPositive: true,
    icon: Users,
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    change: '-0.8%',
    isPositive: false,
    icon: TrendingUp,
  },
];

const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 14200 },
  { month: 'Mar', revenue: 18900 },
  { month: 'Apr', revenue: 16300 },
  { month: 'May', revenue: 21500 },
  { month: 'Jun', revenue: 24800 },
];

const ordersData = [
  { day: 'Mon', orders: 42 },
  { day: 'Tue', orders: 38 },
  { day: 'Wed', orders: 55 },
  { day: 'Thu', orders: 47 },
  { day: 'Fri', orders: 62 },
  { day: 'Sat', orders: 71 },
  { day: 'Sun', orders: 45 },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl tracking-wide mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="admin-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-secondary">
                <stat.icon size={20} className="text-primary" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stat.isPositive ? 'text-green-600' : 'text-destructive'
                }`}
              >
                {stat.isPositive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {stat.change}
              </div>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
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
                  tickFormatter={value => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 0,
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
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

      {/* Recent Orders */}
      <div className="admin-card">
        <h3 className="font-serif text-xl mb-6">Recent Orders</h3>
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
              {[
                { id: '#1234', customer: 'Emma Watson', status: 'Delivered', total: 2450 },
                { id: '#1235', customer: 'John Smith', status: 'Processing', total: 1890 },
                { id: '#1236', customer: 'Sarah Connor', status: 'Shipped', total: 3200 },
                { id: '#1237', customer: 'Mike Johnson', status: 'Pending', total: 980 },
              ].map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/50">
                  <td className="py-4 px-4 font-medium">{order.id}</td>
                  <td className="py-4 px-4">{order.customer}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">${order.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
