import { Thermometer, Droplets, Activity, Sun,
  AlertTriangle, Check, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useIoT } from "@/hooks/useIot";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import { GREEN, AMBER } from "@/utils/constants";
import {
LineChart, Line, XAxis, YAxis, CartesianGrid,
Tooltip, Legend, ResponsiveContainer
} from "recharts";

const METRIC_ICONS: Record<string, React.ElementType> = {
"Temperature":  Thermometer,
"Humidity":     Droplets,
"Soil Moisture": Activity,
"Light Level":  Sun,
};

const STATUS_COLORS: Record<string, string> = {
Healthy:  "#059669",
Warning:  "#D97706",
Critical: "#DC2626",
};

export function IoTMonitor() {
const { user } = useAuth();
const { latest, history, alerts, metrics,
   loading, lastUpdate, refresh } = useIoT();

return (
<DashboardLayout title="Farm Monitor">
<div className="space-y-5">

 {/* Header with last update + refresh */}
 <div className="flex items-center justify-between">
   <div>
     <p className="text-sm text-muted-foreground">
       Farm: <span className="font-semibold text-foreground">
         {user?.county} Farm
       </span>
     </p>
     {lastUpdate && (
       <p className="text-xs text-muted-foreground mt-0.5">
         Last reading: {lastUpdate}
       </p>
     )}
   </div>
   <button
     onClick={refresh}
     className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border
                text-sm font-semibold hover:bg-muted transition-colors"
   >
     <RefreshCw className="w-4 h-4" />
     Refresh
   </button>
 </div>

 {/* Metric Cards */}
 <div className="grid grid-cols-4 gap-4">
   {loading ? (
     Array(4).fill(0).map((_, i) => (
       <div key={i}
         className="bg-card rounded-2xl border border-border p-5 h-32 animate-pulse" />
     ))
   ) : metrics.length === 0 ? (
     <div className="col-span-4 bg-card rounded-2xl border border-border p-8 text-center">
       <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
       <p className="text-sm font-semibold text-foreground">
         No sensor data yet
       </p>
       <p className="text-xs text-muted-foreground mt-1">
         Start the Python bridge or connect your Arduino
       </p>
     </div>
   ) : (
     metrics.map((m) => {
       const Icon = METRIC_ICONS[m.label] ?? Activity;
       return (
         <div key={m.label}
           className="bg-card rounded-2xl border border-border p-5">
           <div className="flex items-center justify-between mb-3">
             <Icon className="w-6 h-6" style={{ color: m.color }} />
             <span
               className="text-xs font-bold px-2 py-0.5 rounded-full"
               style={{
                 color: STATUS_COLORS[m.status],
                 background: STATUS_COLORS[m.status] + "15"
               }}
             >
               {m.status}
             </span>
           </div>
           <p className="text-3xl font-black text-foreground"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
             {m.value}
           </p>
           <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
           <p className="text-xs mt-2 font-semibold"
             style={{ color: STATUS_COLORS[m.status] }}>
             {m.trend}
           </p>
         </div>
       );
     })
   )}
 </div>

 {/* Chart + Alerts */}
 <div className="grid grid-cols-3 gap-4">

   {/* 24-Hour Chart */}
   <div className="col-span-2 bg-card rounded-2xl border border-border p-6">
     <h2 className="font-bold text-foreground mb-5"
       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
       24-Hour Sensor Readings
     </h2>
     {history.length === 0 ? (
       <div className="h-48 flex items-center justify-center
                       text-sm text-muted-foreground">
         No historical data yet — readings appear after first ingest
       </div>
     ) : (
       <ResponsiveContainer width="100%" height={220}>
         <LineChart data={history}>
           <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
           <XAxis
             dataKey="hour"
             tick={{ fontSize: 11, fill: "#6B7280" }}
           />
           <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
           <Tooltip
             contentStyle={{
               borderRadius: 12,
               border: "1px solid #E5E7EB",
               fontSize: 12
             }}
           />
           <Legend />
           <Line
             type="monotone"
             dataKey="temperature"
             stroke="#E76F51"
             strokeWidth={2}
             dot={false}
             name="Temp (°C)"
           />
           <Line
             type="monotone"
             dataKey="humidity"
             stroke="#2D6A4F"
             strokeWidth={2}
             dot={false}
             name="Humidity (%)"
           />
           <Line
             type="monotone"
             dataKey="soil_moisture"
             stroke="#52B788"
             strokeWidth={2}
             dot={false}
             name="Soil (%)"
           />
         </LineChart>
       </ResponsiveContainer>
     )}
   </div>

   {/* Alerts Panel */}
   <div className="bg-card rounded-2xl border border-border p-5">
     <h2 className="font-bold text-foreground mb-4"
       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
       Active Alerts
     </h2>
     {loading ? (
       <div className="space-y-3">
         {Array(3).fill(0).map((_, i) => (
           <div key={i}
             className="h-16 bg-muted rounded-xl animate-pulse" />
         ))}
       </div>
     ) : (
       <div className="space-y-3">
         {alerts.map((a, i) => (
           <div key={i}
             className={cn("p-3.5 rounded-xl text-sm",
               a.level === "warning"
                 ? "bg-amber-50 border border-amber-200"
                 : "bg-emerald-50 border border-emerald-200"
             )}
           >
             <div className="flex items-start gap-2">
               {a.level === "warning"
                 ? <AlertTriangle className="w-4 h-4 text-amber-500
                                             flex-shrink-0 mt-0.5" />
                 : <Check className="w-4 h-4 text-emerald-500
                                     flex-shrink-0 mt-0.5" />
               }
               <div>
                 <p className={cn("text-xs leading-snug",
                   a.level === "warning"
                     ? "text-amber-800"
                     : "text-emerald-800"
                 )}>
                   {a.msg}
                 </p>
                 <p className="text-xs text-muted-foreground
                               mt-1 font-mono">
                   {a.time} today
                 </p>
               </div>
             </div>
           </div>
         ))}
       </div>
     )}
   </div>
 </div>

 {/* Recent Readings Table */}
 <div className="bg-card rounded-2xl border border-border overflow-hidden">
   <div className="px-6 py-4 border-b border-border flex
                   items-center justify-between">
     <h2 className="font-bold text-foreground"
       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
       Recent Readings
     </h2>
     <span className="text-xs text-muted-foreground">
       Auto-refreshes every 15 seconds
     </span>
   </div>

   {history.length === 0 ? (
     <div className="p-8 text-center text-sm text-muted-foreground">
       No readings yet — connect your Arduino and start the bridge
     </div>
   ) : (
     <table className="w-full text-sm">
       <thead>
         <tr className="text-left text-xs text-muted-foreground
                         bg-muted/30 border-b border-border">
           {["Hour", "Temp (°C)", "Humidity (%)",
             "Soil (%)", "Light"].map((h) => (
             <th key={h} className="px-6 py-3 font-semibold">{h}</th>
           ))}
         </tr>
       </thead>
       <tbody>
         {[...history].reverse().slice(0, 10).map((r, i) => (
           <tr key={i}
             className="border-b border-border last:border-0
                        hover:bg-muted/20 transition-colors">
             <td className="px-6 py-3 font-mono text-xs
                            text-muted-foreground">
               {r.hour}
             </td>
             <td className="px-6 py-3">
               <span style={{
                 color: r.temperature > 35 ? "#DC2626" :
                        r.temperature > 30 ? "#D97706" : "#059669"
               }}>
                 {r.temperature}
               </span>
             </td>
             <td className="px-6 py-3">{r.humidity}</td>
             <td className="px-6 py-3">
               <span style={{
                 color: r.soil_moisture < 20 ? "#DC2626" :
                        r.soil_moisture < 40 ? "#D97706" : "#059669"
               }}>
                 {r.soil_moisture}
               </span>
             </td>
             <td className="px-6 py-3 text-muted-foreground">
               {r.light_level > 600 ? "☀️ Sunny" :
                r.light_level > 250 ? "⛅ Cloudy" : "🌑 Dark"}
             </td>
           </tr>
         ))}
       </tbody>
     </table>
   )}
 </div>

</div>
</DashboardLayout>
);
}