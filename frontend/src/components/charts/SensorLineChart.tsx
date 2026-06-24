import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { iotData } from "@/data/iotData";

export function SensorLineChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={iotData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: "'DM Mono', monospace" }} tickLine={false} interval={3} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="temperature" stroke="#E74C3C" dot={false} name="Temp (°C)"    strokeWidth={2} />
        <Line type="monotone" dataKey="humidity"    stroke="#3498DB" dot={false} name="Humidity (%)" strokeWidth={2} />
        <Line type="monotone" dataKey="soilMoisture"stroke="#8B4513" dot={false} name="Soil (%)"     strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
