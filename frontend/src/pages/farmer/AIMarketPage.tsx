import { TrendingUp, BarChart2, MapPin, ArrowUp } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { DemandBarChart } from "@/components/charts/DemandBarChart";
import { GREEN, AMBER } from "@/utils/constants";
import { aiInsights, aiRecommendations } from "@/data/marketData";

const ICON_MAP: Record<string, React.ElementType> = { TrendingUp, BarChart2, MapPin };

export function AIMarketPage() {
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

        {/* AI Recommendations */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: GREEN }}>AI</div>
            <div>
              <h2 className="font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AgriNexus AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Updated just now · Kiambu Region · Week of June 18, 2026</p>
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ background: GREEN + "07", borderColor: GREEN + "25" }}>
            <ul className="space-y-4">
              {aiRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5" style={{ background: AMBER }}>{i + 1}</span>
                  <span className="text-foreground leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
