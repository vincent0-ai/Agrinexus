import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils/cn";
import { GREEN, AMBER } from "@/utils/constants";
import { getMarketAnalysis, type MarketAnalysis } from "@/services/aiService";

interface Props {
  county?: string;
  crop?: string;
}

export function MarketAnalysisCard({ county = "Kiambu", crop = "" }: Props) {
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalysis = async () => {
    try {
      const data = await getMarketAnalysis(county, crop);
      setAnalysis(data);
    } catch (e) {
      console.error("Market analysis failed:", e);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAnalysis().finally(() => setLoading(false));
  }, [county, crop]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalysis();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted" />
          <div className="flex-1">
            <div className="h-4 w-40 bg-muted rounded mb-1" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-3/4 bg-muted rounded" />
          <div className="h-3 w-5/6 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const lines = analysis.analysis.split("\n").filter(Boolean);
  const previewLines = lines.slice(0, 5);
  const hasMore = lines.length > 5;

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: AMBER + "30",
        background: `linear-gradient(135deg, ${AMBER}05, ${AMBER}10)`,
      }}
    >
      {/* Animated top border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" style={{
        backgroundSize: "200% 100%",
        animation: "gradient-shift-market 3s ease infinite",
      }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-400">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                AI Market Analysis
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {analysis.provider} · {county} County
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </button>
        </div>

        {/* Analysis Content */}
        <div className="text-sm text-foreground leading-relaxed space-y-1">
          {(expanded ? lines : previewLines).map((line, i) => {
            let html = line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

            if (line.match(/^[-•] /)) {
              return (
                <div key={i} className="flex items-start gap-1.5 pl-2">
                  <span className="w-1 h-1 rounded-full bg-current mt-2 flex-shrink-0 opacity-50" />
                  <span dangerouslySetInnerHTML={{ __html: html.replace(/^[-•] /, "") }} />
                </div>
              );
            }

            const numMatch = line.match(/^(\d+)\.\s/);
            if (numMatch) {
              return (
                <div key={i} className="flex items-start gap-1.5 pl-2">
                  <span className="text-[10px] font-bold opacity-60 mt-0.5 flex-shrink-0 w-3">{numMatch[1]}.</span>
                  <span dangerouslySetInnerHTML={{ __html: html.replace(/^\d+\.\s/, "") }} />
                </div>
              );
            }

            if (!line.trim()) return <div key={i} className="h-1" />;
            return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          })}
        </div>

        {/* Expand/Collapse */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-3 text-xs font-medium transition-all hover:opacity-80"
            style={{ color: AMBER }}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Show less" : `Show more (${lines.length - 5} more lines)`}
          </button>
        )}

        {/* Timestamp */}
        <p className="text-[9px] text-muted-foreground mt-3">
          Generated {new Date(analysis.generated_at).toLocaleString()}
        </p>
      </div>

      <style>{`
        @keyframes gradient-shift-market {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
