import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { priceData } from "@/data/marketData";
import { GREEN, AMBER } from "@/utils/constants";

export function PriceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={priceData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} />
        <Tooltip formatter={(v: number) => `KSh ${v}/kg`} contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="tomatoes" stroke={GREEN}   dot={false} name="Tomatoes" strokeWidth={2.5} />
        <Line type="monotone" dataKey="maize"    stroke={AMBER}   dot={false} name="Maize"    strokeWidth={2.5} />
        <Line type="monotone" dataKey="beans"    stroke="#3498DB" dot={false} name="Beans"    strokeWidth={2.5} />
      </LineChart>
    </ResponsiveContainer>
  );
}
