import { TrendingUp, BarChart2, MapPin, ArrowUp, Activity } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { DemandBarChart } from "@/components/charts/DemandBarChart";
import { MarketAnalysisCard } from "@/components/ai/MarketAnalysisCard";
import { ChatFAB } from "@/components/ai/ChatFAB";
import { GREEN, AMBER } from "@/utils/constants";

import { useAuth } from "@/context/AuthContext";
import { useMarketData } from "@/hooks/useMarketData";

const ICON_MAP: Record<string, React.ElementType> = { TrendingUp, BarChart2, MapPin };

export function AIMarketPage() {
  const { user } = useAuth();
  const { insights, priceTrends, demandIndex, loading } = useMarketData(user?.county);

  return (
    <DashboardLayout title="AI Market Intelligence">
      <div className="space-y-5">
        
        {/* Top Instructions / Notice for Empty State */}
        {!loading && insights.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-sm flex items-start gap-3">
            <Activity className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
            <div>
              <p className="font-bold mb-1">No market data found for your region</p>
              <p>Your charts are currently blank. To populate realistic sample data, please visit <a href="/api/market/seed" target="_blank" rel="noreferrer" className="underline font-medium hover:text-blue-900">/api/market/seed</a> on your backend, then refresh this page.</p>
            </div>
          </div>
        )}

        {/* Insight cards */}
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-5 h-32 animate-pulse" />
            ))
          ) : (
            insights.map((c) => {
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
            })
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Price Trends — Last 6 Months</h2>
            {loading ? (
              <div className="w-full h-[220px] bg-muted/30 rounded-xl animate-pulse" />
            ) : priceTrends.length === 0 ? (
              <div className="w-full h-[220px] flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-xl">No trend data available</div>
            ) : (
              <PriceTrendChart data={priceTrends} />
            )}
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Market Demand Index</h2>
            {loading ? (
              <div className="w-full h-[220px] bg-muted/30 rounded-xl animate-pulse" />
            ) : demandIndex.length === 0 ? (
              <div className="w-full h-[220px] flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-xl">No demand data available</div>
            ) : (
              <DemandBarChart data={demandIndex} />
            )}
          </div>
        </div>

        {/* AI Market Analysis */}
        <MarketAnalysisCard county={user?.county} />
      </div>

      {/* Floating AI Chat Button */}
      <ChatFAB context="market" />
    </DashboardLayout>
  );
}
