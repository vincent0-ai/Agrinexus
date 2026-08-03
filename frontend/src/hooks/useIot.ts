import { useState, useEffect, useCallback, useRef } from "react";
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
  const [serialStatus, setSerialStatus] = useState<"disconnected" | "connected" | "error">("disconnected");

  const portRef = useRef<any>(null);
  const isConnectedRef = useRef(false);
  const lastPostTimeRef = useRef(0);

  // Fetch initial history/alerts from backend
  const fetchBackendData = useCallback(async () => {
    try {
      const [latestRes, readingsRes, alertsRes] = await Promise.all([
        api.get("/iot/latest"),
        api.get("/iot/readings"),
        api.get("/iot/alerts"),
      ]);

      // Only update latest from backend if we are NOT connected via serial
      if (!isConnectedRef.current && latestRes.success && latestRes.data) {
        setLatest(latestRes.data);
        setLastUpdate(new Date(latestRes.data.recorded_at).toLocaleTimeString("en-KE"));
      }
      if (readingsRes.success) setHistory(readingsRes.data ?? []);
      if (alertsRes.success)   setAlerts(alertsRes.data ?? []);
    } catch (e) {
      console.error("IoT fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll backend every 15s (mostly for history/alerts, or for latest if no hardware connected)
  useEffect(() => {
    fetchBackendData();
    const interval = setInterval(fetchBackendData, 15000);
    return () => clearInterval(interval);
  }, [fetchBackendData]);

  const connectHardware = async () => {
    const nav = navigator as any;
    if (!('serial' in nav)) {
      alert('Web Serial is not supported on this browser. Please use Google Chrome or Edge.');
      return;
    }

    try {
      setSerialStatus("connected"); // optimistic
      const port = await nav.serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      isConnectedRef.current = true;
      setSerialStatus("connected");

      // Read loop
      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      let buffer = '';
      while (isConnectedRef.current) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          buffer += value;
          let lines = buffer.split('\n');
          buffer = lines.pop() || ''; // keep unfinished chunk

          for (let line of lines) {
            if (line.trim().length > 0) {
              try {
                const data = JSON.parse(line.trim());
                handleSerialData(data);
              } catch (e) {
                // Ignore malformed JSON chunks that can happen on startup
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Serial Connection Failed:', err);
      setSerialStatus("error");
      isConnectedRef.current = false;
    }
  };

  const handleSerialData = (data: any) => {
    // Debug: Log the incoming data so we can see the exact keys
    console.log("Raw Arduino Data:", data);

    // Try to guess the moisture key in case they used a different variable name
    let parsedMoisture = data.soil_moisture ?? data.moisture ?? data.soilMoisture ?? data.soil ?? data.moisture_level ?? 0;

    // 1. Update live dashboard instantly
    setLatest({
      id: 0, farm_id: 0,
      temperature: data.temp ?? data.temperature ?? 0,
      humidity: data.humidity ?? 0,
      soil_moisture: parsedMoisture,
      light_level: data.light ?? data.light_level ?? 500,
      recorded_at: new Date().toISOString()
    });
    setLastUpdate(new Date().toLocaleTimeString("en-KE") + " (USB Live)");
    setLoading(false);

    // 2. Throttle POST to backend (every 15 seconds)
    const now = Date.now();
    if (now - lastPostTimeRef.current > 15000) {
      lastPostTimeRef.current = now;
      api.post("/iot/ingest", {
        temperature: data.temp ?? data.temperature ?? 0,
        humidity: data.humidity ?? 0,
        soil_moisture: parsedMoisture,
        light_level: data.light ?? data.light_level ?? 500,
      }).catch(e => console.error("Failed to ingest serial data to backend", e));
    }
  };

  const sendHardwareCommand = async (commandString: string) => {
    if (portRef.current && portRef.current.writable) {
      try {
        const encoder = new TextEncoder();
        const writer = portRef.current.writable.getWriter();
        await writer.write(encoder.encode(commandString + '\n'));
        writer.releaseLock();
      } catch (e) {
        console.error("Failed to send command to hardware", e);
      }
    }
  };

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
    loading, lastUpdate, refresh: fetchBackendData,
    serialStatus, connectHardware, sendHardwareCommand
  };
}