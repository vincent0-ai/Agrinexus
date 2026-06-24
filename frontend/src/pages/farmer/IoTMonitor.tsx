import { Thermometer, Droplets, Activity, Sun, AlertTriangle, Check } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SensorLineChart } from "@/components/charts/SensorLineChart";
import { iotMetrics, iotAlerts, iotData } from "@/data/iotData";
import { cn } from "@/utils/cn";

const METRIC_ICONS: Record<string, React.ElementType> = {
  "Temperature": Thermometer, "Humidity": Droplets, "Soil Moisture": Activity, "Light Level": Sun,
};

export function IoTMonitor() {
  return (
    <DashboardLayout title="Farm Monitor — Kiambu Farm">
      <div className="space-y-5">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-4">
          {iotMetrics.map((m) => {
            const Icon = METRIC_ICONS[m.label] ?? Activity;
            return (
              <div key={m.label} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6" style={{ color: m.color }} />
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-3xl font-black text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                <p className="text-xs mt-2 font-semibold" style={{ color: m.status === "Warning" ? "#D97706" : "#059669" }}>{m.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Chart + alerts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>24-Hour Sensor Readings</h2>
            <SensorLineChart />
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Active Alerts</h2>
            <div className="space-y-3">
              {iotAlerts.map((a, i) => (
                <div key={i} className={cn("p-3.5 rounded-xl text-sm", a.level === "warning" ? "bg-amber-50 border border-amber-200" : "bg-emerald-50 border border-emerald-200")}>
                  <div className="flex items-start gap-2">
                    {a.level === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> : <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className={cn("text-xs leading-snug", a.level === "warning" ? "text-amber-800" : "text-emerald-800")}>{a.msg}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{a.time} today</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Readings table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Readings</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground bg-muted/30 border-b border-border">
                {["Timestamp", "Temp (°C)", "Humidity (%)", "Soil Moisture (%)", "Light (lux)"].map((h) => (
                  <th key={h} className="px-6 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {iotData.slice(18).reverse().map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{r.time}</td>
                  <td className="px-6 py-3">{r.temperature}</td>
                  <td className="px-6 py-3">{r.humidity}</td>
                  <td className="px-6 py-3">{r.soilMoisture}</td>
                  <td className="px-6 py-3">{r.light.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
