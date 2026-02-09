import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { useStoreSettings } from "@/context/StoreSettingsContext";

const statusColors: Record<string, string> = {
  pending: "bg-muted text-foreground",
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};

type OrderItemUI = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderUI = {
  id: string;
  date: string;
  status: keyof typeof statusColors;
  total: number;
  items: OrderItemUI[];
};

const MyOrdersPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { formatPrice } = useStoreSettings();

  const isLoggedIn =
    typeof window !== "undefined" &&
    !!localStorage.getItem("authToken");

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: "/orders" }} />;
  }

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        setError("");

        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        if (!token) {
          setError("Not authorized");
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
          throw new Error(data.message || "Failed to load orders");
        }

        const mapped: OrderUI[] = (data.orders || []).map((o: any) => ({
          id: o.orderNumber || o._id,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
          status: (o.status || "pending") as keyof typeof statusColors,
          total: o.total || 0,
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
        setError(err.message || "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [API_BASE]);

  const totalOrders = orders.length;
  const lastOrder = orders[0];
  const activeOrders = orders.filter((o) => o.status !== "delivered").length;

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
          {orders.length > 0 && lastOrder && (
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
              <p className="text-muted-foreground mb-4">
                You have no orders yet.
              </p>
              <Link to="/shop" className="btn-luxury inline-flex items-center justify-center">
                <span>Start Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, index) => (
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
                          {formatPrice(order.total)}
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
                          <p className="font-medium">
                            {formatPrice(item.price)} x {item.quantity}
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
