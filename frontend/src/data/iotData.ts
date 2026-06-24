export const iotData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  temperature: parseFloat((22 + Math.sin(i / 3) * 4).toFixed(1)),
  humidity: parseFloat((65 + Math.cos(i / 4) * 10).toFixed(0)),
  soilMoisture: parseFloat((45 + Math.sin(i / 5 + 1) * 8).toFixed(0)),
  light: Math.round(
    i >= 6 && i <= 18 ? 2000 + Math.sin(((i - 6) / 12) * Math.PI) * 7000 : 150
  ),
}));

export const iotMetrics = [
  { label: "Temperature",   value: "24.5°C",    status: "Optimal", color: "#E74C3C", trend: "+0.3° last hour" },
  { label: "Humidity",      value: "68%",        status: "Optimal", color: "#3498DB", trend: "-2% last hour"   },
  { label: "Soil Moisture", value: "38%",        status: "Warning", color: "#8B4513", trend: "-8% last hour"   },
  { label: "Light Level",   value: "8,500 lux",  status: "Optimal", color: "#F39C12", trend: "+500 last hour"  },
];

export const iotAlerts = [
  { msg: "Soil moisture below 40% — consider irrigation in Zone A", level: "warning", time: "14:32" },
  { msg: "Temperature spike detected in Zone B (26.8°C)",           level: "warning", time: "12:10" },
  { msg: "All 12 sensors online and reporting normally",            level: "ok",      time: "06:00" },
];
