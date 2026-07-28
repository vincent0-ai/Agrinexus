import { api } from "./api";
import { USE_MOCK } from "@/utils/constants";
import { mockChatResponse, mockWeatherPrediction, mockMarketAnalysis, mockProviders } from "@/data/aiData";

export type AIProvider = "auto";
export type AIContext = "market" | "weather" | "general";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  response: string;
  provider: string;
  tokens_used?: number;
  context: AIContext;
  timestamp: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  model: string;
  available: boolean;
  description: string;
  color: string;
}

export interface WeatherPrediction {
  prediction: string;
  provider: string;
  county: string;
  crop: string;
  generated_at: string;
}

export interface MarketAnalysis {
  analysis: string;
  provider: string;
  county: string;
  crop: string;
  generated_at: string;
}

export async function sendChatMessage(
  provider: AIProvider = "auto",
  context: AIContext = "general",
  message: string = "",
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  if (USE_MOCK) return mockChatResponse(provider, context, message);
  return api.post("/ai/chat", { provider, context, message, history });
}

export async function getAIProviders(): Promise<ProviderInfo[]> {
  if (USE_MOCK) return mockProviders;
  const res = await api.get("/ai/providers");
  return res.data ?? res;
}

export async function getWeatherPrediction(
  county = "Kiambu",
  crop = ""
): Promise<WeatherPrediction> {
  if (USE_MOCK) return mockWeatherPrediction(county, crop);
  const res = await api.post("/ai/predict-weather", { county, crop });
  return res.data ?? res;
}

export async function getMarketAnalysis(
  county = "Kiambu",
  crop = ""
): Promise<MarketAnalysis> {
  if (USE_MOCK) return mockMarketAnalysis(county, crop);
  const res = await api.post("/ai/analyze-market", { county, crop });
  return res.data ?? res;
}
