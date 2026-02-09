import { useEffect, useState } from 'react';
import { Customer } from '@/types';
import { cn } from '@/lib/utils';

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
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

        const res = await fetch(`${API_BASE}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load customers');
        }

        const mapped: Customer[] = data.users.map((u: any) => ({
          id: u.id,
          name: u.fullName || u.email,
          email: u.email,
          ordersCount: typeof u.ordersCount === 'number' ? u.ordersCount : 0,
          status: (u.status as Customer['status']) || 'active',
          joinDate: u.createdAt ? u.createdAt.substring(0, 10) : '',
        }));

        setCustomers(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleStatusChange = async (id: string, status: Customer['status']) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) {
        setError('Not authorized');
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/users/${id}/status`, {
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

      setCustomers(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl tracking-wide mb-2">Customers</h1>
        <p className="text-muted-foreground">View and manage your customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="admin-card">
          <div className="admin-stat">
            <span className="admin-stat-value">{customers.length}</span>
            <span className="admin-stat-label">Total Customers</span>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-stat">
            <span className="admin-stat-value">
              {customers.filter(c => c.status === 'active').length}
            </span>
            <span className="admin-stat-label">Active Customers</span>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-stat">
            <span className="admin-stat-value">
              {customers.reduce((sum, c) => sum + c.ordersCount, 0)}
            </span>
            <span className="admin-stat-label">Total Orders</span>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="admin-card overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading customers...</div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-destructive">{error}</div>
        ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Join Date</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Orders</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr
                key={customer.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground">{customer.joinDate}</td>
                <td className="py-4 px-4 text-center">{customer.ordersCount}</td>
                <td className="py-4 px-4 text-center">
                  <select
                    value={customer.status}
                    onChange={e =>
                      handleStatusChange(customer.id, e.target.value as Customer['status'])
                    }
                    className={cn(
                      "text-xs px-3 py-1 rounded-none border border-transparent capitalize cursor-pointer",
                      customer.status === 'active'
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
