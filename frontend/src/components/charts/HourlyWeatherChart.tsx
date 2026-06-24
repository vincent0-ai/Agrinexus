import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { hourlyData } from "@/data/weatherData";
import { GREEN } from "@/utils/constants";

export function HourlyWeatherChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={hourlyData} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="hour" tick={{ fontSize: 10, fontFamily: "'DM Mono', monospace" }} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="temp" fill={GREEN}   name="Temperature (°C)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="rain" fill="#3498DB" name="Rainfall (mm)"    radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
