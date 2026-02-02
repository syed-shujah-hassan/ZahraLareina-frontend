import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-muted text-foreground",
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};

const mockOrders = [
  {
    id: "ZL-1001",
    date: "January 15, 2024",
    status: "delivered",
    total: 1850,
    items: [
      {
        name: "Velvet Evening Clutch",
        size: "One Size",
        quantity: 1,
        price: 1850,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      },
    ],
  },
  {
    id: "ZL-1002",
    date: "January 12, 2024",
    status: "shipped",
    total: 1290,
    items: [
      {
        name: "Strappy Stiletto Heel",
        size: "38",
        quantity: 1,
        price: 1290,
        image:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      },
    ],
  },
  {
    id: "ZL-1003",
    date: "January 5, 2024",
    status: "processing",
    total: 890,
    items: [
      {
        name: "Gold Chain Necklace",
        size: "One Size",
        quantity: 1,
        price: 890,
        image:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      },
    ],
  },
];

const MyOrdersPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalOrders = mockOrders.length;
  const lastOrder = mockOrders[0];
  const activeOrders = mockOrders.filter((o) => o.status !== "delivered").length;

  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

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
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              A curated overview of your ZahraLareina purchases and their journey to you.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          {/* Stats Strip */}
          {mockOrders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 stagger-children">
              <div className="admin-card text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Total Orders
                </p>
                <p className="font-serif text-3xl">{totalOrders}</p>
              </div>
              <div className="admin-card text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Last Order
                </p>
                <p className="font-serif text-lg">{lastOrder.id}</p>
                <p className="text-xs text-muted-foreground mt-1">{lastOrder.date}</p>
              </div>
              <div className="admin-card text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Active Orders
                </p>
                <p className="font-serif text-3xl">{activeOrders}</p>
              </div>
            </div>
          )}

          {mockOrders.length === 0 ? (
            <div className="text-center py-24 animate-fade-up">
              <p className="text-muted-foreground mb-4">
                You have no orders yet.
              </p>
              <button className="btn-luxury">
                <span>Start Shopping</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {mockOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="bg-card border border-border p-6 md:p-8 shadow-soft hover:shadow-luxury transition-shadow animate-fade-up"
                  style={{ animationDelay: `${index * 0.06}s` }}
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
                            "inline-block px-3 py-1 text-xs capitalize rounded-full",
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
                        <p className="font-serif text-xl">
                          ${order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-4" />

                  {/* Items */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.name} className="flex gap-4">
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
                          <p className="text-sm mt-1">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expand / Collapse (placeholder for future details) */}
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expandedId === order.id ? null : order.id)
                      }
                      className="text-xs tracking-[0.2em] uppercase luxury-underline"
                    >
                      {expandedId === order.id
                        ? "Hide details"
                        : "View order details"}
                    </button>
                  </div>

                  {expandedId === order.id && (
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p>
                        Shipping and billing details will appear here in the live
                        experience.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrdersPage;
