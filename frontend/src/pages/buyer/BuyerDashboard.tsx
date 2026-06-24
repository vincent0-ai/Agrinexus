import { useEffect, useState } from "react";
import { ShoppingCart, Truck, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StatCard } from "@/components/common/StatCard";
import { ProductCard, Product } from "@/components/products/ProductCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { GREEN, AMBER } from "@/utils/constants";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

interface Order {
  id: number;
  product_name: string;
  farmer_name: string;
  total_price: number;
  created_at: string;
  status: string;
}

export function BuyerDashboard() {
  const { setPage, user } = useAuth();
  const { inCart, toggleCart } = useCart();

  const [products, setProducts]   = useState<Product[]>([]);
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products?page=1"),
      api.get("/orders"),
    ])
      .then(([productsRes, ordersRes]) => {
        if (productsRes.success) setProducts(productsRes.data ?? []);
        if (ordersRes.success)   setOrders(ordersRes.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const totalSpent    = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-5">

        {/* Welcome */}
        <div>
          <h1 className="text-xl font-black text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back, {user?.full_name?.split(" ")[0] ?? "Buyer"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user?.county} · Buyer Account</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Orders Placed"
            value={loading ? "—" : String(orders.length)}
            sub="Lifetime"
            icon={ShoppingCart}
          />
          <StatCard
            label="Pending Deliveries"
            value={loading ? "—" : String(pendingOrders)}
            sub="Awaiting delivery"
            icon={Truck}
            color={AMBER}
          />
          <StatCard
            label="Total Spent"
            value={loading ? "—" : `KSh ${totalSpent.toLocaleString()}`}
            sub="From delivered orders"
            icon={DollarSign}
          />
        </div>

        {/* Featured products */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Featured Products
            </h2>
            <button onClick={() => setPage("product-listing")} className="text-xs font-semibold" style={{ color: GREEN }}>
              Browse All →
            </button>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="p-5 grid grid-cols-4 gap-4">
              {products.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  inCart={inCart(p.id)}
                  onToggleCart={toggleCart}
                  compact
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Recent Orders
            </h2>
            <button onClick={() => setPage("orders")} className="text-xs font-semibold" style={{ color: GREEN }}>
              View All →
            </button>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No orders yet. Start shopping!</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground bg-muted/30 border-b border-border">
                  {["Order ID", "Product", "Farmer", "Total", "Date", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{o.id}</td>
                    <td className="px-6 py-3.5 font-semibold text-foreground">{o.product_name}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{o.farmer_name}</td>
                    <td className="px-6 py-3.5 font-bold" style={{ color: GREEN }}>
                      KSh {Number(o.total_price).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("en-KE")}
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}