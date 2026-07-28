import { useState, useEffect } from "react";
import {
  Sparkles, CloudSun, TrendingUp, Cpu, Zap, BarChart2,
  Calendar, Sprout, Bot, ArrowRight, Leaf,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { GREEN, AMBER } from "@/utils/constants";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ChatPanel } from "@/components/ai/ChatPanel";
import { useWeather, type CurrentWeather } from "@/hooks/useWeather";
import { demandData } from "@/data/marketData";
import { useAIChat } from "@/hooks/useAIChat";
import type { AIContext } from "@/services/aiService";

const QUICK_ACTIONS = [
  { label: "Predict my harvest timing",       icon: Calendar,  context: "weather" as AIContext, prompt: "Based on current weather conditions, when is the optimal time to harvest my crops this week?" },
  { label: "Best crop to sell now",            icon: TrendingUp, context: "market" as AIContext,  prompt: "What's the best crop to sell right now and where should I sell it for maximum profit?" },
  { label: "Interpret my sensor data",         icon: Cpu,       context: "general" as AIContext, prompt: "My soil moisture sensor reads 32%, temperature is 24°C, and humidity is 65%. What farming actions should I take?" },
  { label: "Weekly farming plan",              icon: Sprout,    context: "general" as AIContext, prompt: "Create a detailed farming activity plan for this week based on current weather and market conditions." },
  { label: "Pest & disease risk check",        icon: Zap,       context: "weather" as AIContext, prompt: "Based on current weather conditions (temperature, humidity, rainfall), what pests and diseases should I watch for?" },
  { label: "Market price comparison",          icon: BarChart2, context: "market" as AIContext,  prompt: "Compare current prices for tomatoes, avocados, beans, and maize across different markets. Where are prices highest?" },
];

export function AIAssistantPage() {
  const { current, loading: weatherLoading } = useWeather();
  const [activeContext, setActiveContext] = useState<AIContext>("general");
  const [selectedPrompt, setSelectedPrompt] = useState<{ prompt: string; context: AIContext; key: number } | null>(null);

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    setActiveContext(action.context);
    setSelectedPrompt({ prompt: action.prompt, context: action.context, key: Date.now() });
  };

  return (
    <DashboardLayout title="AI Assistant">
      <div className="flex gap-5 h-[calc(100vh-120px)]">
        {/* Left — Chat Panel (60%) */}
        <div className="flex-[3] min-w-0">
          <ChatPanel defaultContext={activeContext} initialPrompt={selectedPrompt} className="h-full" />
        </div>

        {/* Right — Context Sidebar (40%) */}
        <div className="flex-[2] min-w-0 space-y-4 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {/* AI Provider Status */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="font-bold text-sm text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              AI Engine Status
            </h3>
            <div className="space-y-2">
              <ProviderStatusRow name="AgriNexus AI Engine" model="agrinexus-v2-smart (Auto Switch)" color="#10B981" gradient="from-emerald-500 to-teal-400" />
            </div>
          </div>

          {/* Current Weather Summary */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <CloudSun className="w-4 h-4" style={{ color: GREEN }} />
              <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Weather Now
              </h3>
            </div>
            {weatherLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            ) : current ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">{current.temp}°C</span>
                  <span className="text-sm text-muted-foreground">{current.condition}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{current.location}</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <MiniStat label="Wind" value={current.wind} />
                  <MiniStat label="Humidity" value={current.humidity} />
                  <MiniStat label="UV Index" value={current.uvIndex} />
                  <MiniStat label="Visibility" value={current.visibility} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Weather data unavailable</p>
            )}
          </div>

          {/* Top Market Demand */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: AMBER }} />
              <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Market Demand
              </h3>
            </div>
            <div className="space-y-2">
              {demandData.slice(0, 4).map((d) => (
                <div key={d.crop} className="flex items-center justify-between">
                  <span className="text-xs text-foreground font-medium">{d.crop}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${d.demand}%`, background: d.demand > 85 ? GREEN : AMBER }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{d.demand}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: AMBER }} />
              <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Quick Actions
              </h3>
            </div>
            <div className="space-y-1.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all group text-left cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                    <span className="flex-1">{action.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Powered By */}
          <div className="text-center py-3">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <Leaf className="w-3 h-3" style={{ color: GREEN }} />
              <span>Powered by AgriNexus AI</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProviderStatusRow({ name, model, color, gradient }: { name: string; model: string; color: string; gradient: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br", gradient)}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">{name}</p>
        <p className="text-[10px] text-muted-foreground">{model}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-emerald-600 font-medium">Ready</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg px-2.5 py-1.5">
      <p className="text-[9px] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
