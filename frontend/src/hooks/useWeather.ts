import { useState, useEffect } from "react";
import { api } from "@/services/api";

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  condition: string;
  icon: string;
  location: string;
  updatedAt: string;
  wind: string;
  humidity: string;
  uvIndex: string;
  visibility: string;
  sunrise: string;
  sunset: string;
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  rain: number;
}

export interface HourlyData {
  hour: string;
  temp: number;
  rain: number;
}

export interface Advisory {
  title: string;
  level: "good" | "warning";
  desc: string;
}

export function useWeather() {
  const [current, setCurrent]     = useState<CurrentWeather | null>(null);
  const [forecast, setForecast]   = useState<ForecastDay[]>([]);
  const [hourly, setHourly]       = useState<HourlyData[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/weather/current"),
      api.get("/weather/forecast"),
      api.get("/weather/hourly"),
      api.get("/weather/advisories"),
    ])
      .then(([cur, fore, hour, adv]) => {
        if (cur.success)  setCurrent(cur.data);
        if (fore.success) setForecast(fore.data);
        if (hour.success) setHourly(hour.data);
        if (adv.success)  setAdvisories(adv.data);
      })
      .catch(() => setError("Failed to load weather data"))
      .finally(() => setLoading(false));
  }, []);

  return { current, forecast, hourly, advisories, loading, error };
}