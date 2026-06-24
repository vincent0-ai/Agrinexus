import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import { LandingPage }            from "@/pages/LandingPage";
import { AuthPage }               from "@/pages/AuthPage";
import { FarmerDashboard }        from "@/pages/farmer/FarmerDashboard";
import { BuyerDashboard }         from "@/pages/buyer/BuyerDashboard";
import { IoTMonitor }             from "@/pages/farmer/IoTMonitor";
import { WeatherPage }            from "@/pages/farmer/WeatherPage";
import { AIMarketPage }           from "@/pages/farmer/AIMarketPage";
import { ProductManagementPage }  from "@/pages/farmer/ProductManagementPage";
import { ProductListingPage }     from "@/pages/buyer/ProductListingPage";
import { OrderManagementPage }    from "@/pages/buyer/OrderManagementPage";

// ── Router ────────────────────────────────────────────────────────────────────
function Router() {
  const { page } = useAuth();

  const routes: Record<string, JSX.Element> = {
    landing:              <LandingPage />,
    login:                <AuthPage />,
    "farmer-dashboard":   <FarmerDashboard />,
    "buyer-dashboard":    <BuyerDashboard />,
    "iot-monitor":        <IoTMonitor />,
    weather:              <WeatherPage />,
    "ai-market":          <AIMarketPage />,
    "product-management": <ProductManagementPage />,
    "product-listing":    <ProductListingPage />,
    orders:               <OrderManagementPage />,
  };

  return (
    <div className="size-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {routes[page] ?? <LandingPage />}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
