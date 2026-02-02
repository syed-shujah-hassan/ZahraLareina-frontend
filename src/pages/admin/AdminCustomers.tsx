import { useState } from 'react';
import { Customer } from '@/types';
import { cn } from '@/lib/utils';

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Emma Watson',
    email: 'emma@example.com',
    ordersCount: 5,
    status: 'active',
    joinDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    ordersCount: 3,
    status: 'active',
    joinDate: '2023-08-22',
  },
  {
    id: '3',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    ordersCount: 8,
    status: 'active',
    joinDate: '2023-03-10',
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    ordersCount: 1,
    status: 'inactive',
    joinDate: '2023-11-05',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    ordersCount: 12,
    status: 'active',
    joinDate: '2022-12-01',
  },
];

const AdminCustomers = () => {
  const [customers] = useState<Customer[]>(mockCustomers);

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
                  <span
                    className={cn(
                      "inline-block px-3 py-1 text-xs capitalize",
                      customer.status === 'active'
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
