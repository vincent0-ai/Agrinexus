// frontend/src/context/WeatherContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useWeather, CurrentWeather, ForecastDay, HourlyData, Advisory } from "@/hooks/useWeather";

interface WeatherContextValue {
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  hourly: HourlyData[];
  advisories: Advisory[];
  loading: boolean;
  error: string;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const weather = useWeather();
  return <WeatherContext.Provider value={weather}>{children}</WeatherContext.Provider>;
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeatherContext must be inside WeatherProvider");
  return ctx;
}