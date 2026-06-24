import { Package, ShoppingCart, DollarSign, Activity, Cpu, Plus, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { GREEN, AMBER } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

interface Order {
  id: number;
  product_name: string;
  buyer_name: string;
  total_price: number;
  status: string;
}

interface Product {
  id: number;
  status: string;
}

export function FarmerDashboard() {
  const { setPage, user } = useAuth();

  const [orders, setOrders]     = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [revenue, setRevenue]   = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/products/mine'),
    ])
      .then(([ordersRes, productsRes]) => {
        if (ordersRes.success)   setOrders(ordersRes.data ?? []);
        if (productsRes.success) setProducts(productsRes.data ?? []);

        // Calculate revenue from delivered orders
        const total = (ordersRes.data ?? [])
          .filter((o: Order) => o.status === 'delivered')
          .reduce((sum: number, o: Order) => sum + Number(o.total_price), 0);
        setRevenue(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeOrders  = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const needAttention = orders.filter(o => o.status === 'pending').length;
  const totalProducts = products.length;

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-5">

        {/* Welcome */}
        <div>
          <h1 className="text-xl font-black text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back, {user?.full_name?.split(' ')[0] ?? 'Farmer'} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user?.county} · Farmer Account</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Products"
            value={loading ? "—" : String(totalProducts)}
            sub={loading ? "Loading..." : `${totalProducts} listed`}
            icon={Package}
          />
          <StatCard
            label="Active Orders"
            value={loading ? "—" : String(activeOrders)}
            sub={loading ? "Loading..." : `${needAttention} need attention`}
            icon={ShoppingCart}
            color={AMBER}
          />
          <StatCard
            label="Revenue This Month"
            value={loading ? "—" : `KSh ${revenue.toLocaleString()}`}
            sub="From delivered orders"
            icon={DollarSign}
          />
          <StatCard
            label="Farm Health Score"
            value="92%"
            sub="All sensors optimal"
            icon={Activity}
            color="#059669"
          />
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Recent orders table */}
          <div className="col-span-3 bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Recent Orders
              </h2>
              <button onClick={() => setPage("orders")} className="text-xs font-semibold" style={{ color: GREEN }}>
                View All →
              </button>
            </div>

            {loading ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No orders yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground bg-muted/30 border-b border-border">
                    {["Order ID", "Product", "Buyer", "Amount", "Status"].map((h) => (
                      <th key={h} className="px-6 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{o.id}</td>
                      <td className="px-6 py-3.5 font-semibold text-foreground">{o.product_name}</td>
                      <td className="px-6 py-3.5 text-muted-foreground">{o.buyer_name}</td>
                      <td className="px-6 py-3.5 font-bold text-sm" style={{ color: GREEN }}>
                        KSh {Number(o.total_price).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5"><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Right column */}
          <div className="col-span-2 space-y-4">
            <CurrentWeatherCard compact />
            <button
              onClick={() => setPage("weather")}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
            >
              Full 7-Day Forecast →
            </button>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold text-sm mb-3 text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Add New Product",     action: "product-management" as const, icon: Plus       },
                  { label: "IoT Sensor Readings", action: "iot-monitor"        as const, icon: Cpu        },
                  { label: "AI Market Prices",    action: "ai-market"          as const, icon: TrendingUp },
                ].map((qa) => (
                  <button
                    key={qa.label}
                    onClick={() => setPage(qa.action)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors border border-border"
                  >
                    <qa.icon className="w-4 h-4" style={{ color: GREEN }} />
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}