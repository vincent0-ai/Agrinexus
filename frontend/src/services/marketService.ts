import { api } from "./api";
import { USE_MOCK } from "@/utils/constants";
import { priceData, demandData, aiInsights, aiRecommendations } from "@/data/marketData";

export async function getPriceTrends(months = 6) {
  if (USE_MOCK) return priceData.slice(-months);
  return api.get(`/market/prices?months=${months}`);
}

export async function getDemandIndex() {
  if (USE_MOCK) return [...demandData];
  return api.get("/market/demand");
}

export async function getAIInsights() {
  if (USE_MOCK) return [...aiInsights];
  return api.get("/market/insights");
}

export async function getAIRecommendations(county = "Kiambu") {
  if (USE_MOCK) return [...aiRecommendations];
  return api.get(`/market/recommendations?county=${encodeURIComponent(county)}`);
}
