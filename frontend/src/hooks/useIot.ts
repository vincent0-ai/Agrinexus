import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

export interface SensorReading {
  id: number;
  farm_id: number;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  light_level: number;
  recorded_at: string;
}

export interface IoTAlert {
  level: "good" | "warning";
  msg: string;
  time: string;
}

export interface ChartPoint {
  hour: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  light_level: number;
}

export function useIoT() {
  const [latest, setLatest]     = useState<SensorReading | null>(null);
  const [history, setHistory]   = useState<ChartPoint[]>([]);
  const [alerts, setAlerts]     = useState<IoTAlert[]>([]);
  const [loading, setLoading]   = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const [latestRes, readingsRes, alertsRes] = await Promise.all([
        api.get("/iot/latest"),
        api.get("/iot/readings"),
        api.get("/iot/alerts"),
      ]);

      if (latestRes.success && latestRes.data) {
        setLatest(latestRes.data);
        setLastUpdate(
          new Date(latestRes.data.recorded_at).toLocaleTimeString("en-KE")
        );
      }
      if (readingsRes.success) setHistory(readingsRes.data ?? []);
      if (alertsRes.success)   setAlerts(alertsRes.data ?? []);
    } catch (e) {
      console.error("IoT fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 15 seconds for live updates
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Derived metrics with status
  const metrics = latest ? [
    {
      label:  "Temperature",
      value:  `${latest.temperature}°C`,
      status: latest.temperature > 35 ? "Critical" :
              latest.temperature > 30 ? "Warning" : "Healthy",
      trend:  latest.temperature > 30 ? "Above optimal range" : "Within optimal range",
      color:  "#E76F51",
    },
    {
      label:  "Humidity",
      value:  `${latest.humidity}%`,
      status: latest.humidity < 30 ? "Warning" :
              latest.humidity > 80 ? "Warning" : "Healthy",
      trend:  latest.humidity < 30 ? "Too dry" :
              latest.humidity > 80 ? "Too humid" : "Optimal",
      color:  "#2D6A4F",
    },
    {
      label:  "Soil Moisture",
      value:  `${latest.soil_moisture}%`,
      status: latest.soil_moisture < 20 ? "Critical" :
              latest.soil_moisture < 40 ? "Warning" : "Healthy",
      trend:  latest.soil_moisture < 30 ? "Irrigation needed" : "Adequate moisture",
      color:  "#52B788",
    },
    {
      label:  "Light Level",
      value:  latest.light_level > 600 ? "Sunny" :
              latest.light_level > 250 ? "Cloudy" : "Dark",
      status: "Healthy",
      trend:  `${latest.light_level} lux`,
      color:  "#F4A261",
    },
  ] : [];

  return {
    latest, history, alerts, metrics,
    loading, lastUpdate, refresh: fetchData
  };
}