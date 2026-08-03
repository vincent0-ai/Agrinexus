import { TrendingUp, BarChart2, MapPin, ArrowUp } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { DemandBarChart } from "@/components/charts/DemandBarChart";
import { MarketAnalysisCard } from "@/components/ai/MarketAnalysisCard";
import { ChatFAB } from "@/components/ai/ChatFAB";
import { GREEN, AMBER } from "@/utils/constants";
import { aiInsights } from "@/data/marketData";

import { useAuth } from "@/context/AuthContext";

const ICON_MAP: Record<string, React.ElementType> = { TrendingUp, BarChart2, MapPin };

export function AIMarketPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="AI Market Intelligence">
      <div className="space-y-5">
        {/* Insight cards */}
        <div className="grid grid-cols-3 gap-4">
          {aiInsights.map((c) => {
            const Icon = ICON_MAP[c.icon] ?? TrendingUp;
            return (
              <div key={c.label} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: AMBER + "20" }}>
                    <Icon className="w-5 h-5" style={{ color: AMBER }} />
                  </div>
                  <ArrowUp className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-lg font-black text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
                <p className="text-xs mt-2 text-muted-foreground font-medium">{c.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Price Trends — Last 6 Months</h2>
            <PriceTrendChart />
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Market Demand Index</h2>
            <DemandBarChart />
          </div>
        </div>

        {/* AI Market Analysis — replaces static recommendations */}
        <MarketAnalysisCard county={user?.county} />
      </div>

      {/* Floating AI Chat Button */}
      <ChatFAB context="market" />
    </DashboardLayout>
  );
}
