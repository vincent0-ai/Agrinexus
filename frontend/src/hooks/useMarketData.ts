import { useState, useEffect } from "react";
import { api } from "@/services/api";

export interface MarketInsight {
  label: string;
  value: string;
  sub: string;
  icon: string;
}

export interface PriceTrendPoint {
  month: string;
  [crop: string]: number | string; // e.g., tomatoes: 110, maize: 45
}

export interface DemandIndex {
  crop_name: string;
  demand: number;
}

export function useMarketData(county: string = "Kiambu") {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [priceTrends, setPriceTrends] = useState<PriceTrendPoint[]>([]);
  const [demandIndex, setDemandIndex] = useState<DemandIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [insightsRes, pricesRes, demandRes] = await Promise.all([
          api.get(`/market/insights?county=${encodeURIComponent(county)}`),
          api.get("/market/prices?months=6"),
          api.get("/market/demand")
        ]);

        if (!mounted) return;

        if (insightsRes.success && insightsRes.data) {
          setInsights(insightsRes.data);
        }
        if (pricesRes.success && pricesRes.data) {
          setPriceTrends(pricesRes.data);
        }
        if (demandRes.success && demandRes.data) {
          setDemandIndex(demandRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch market data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [county]);

  return { insights, priceTrends, demandIndex, loading };
}
