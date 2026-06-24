import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { demandData } from "@/data/marketData";
import { AMBER } from "@/utils/constants";

export function DemandBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={demandData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} domain={[0, 100]} />
        <YAxis type="category" dataKey="crop" tick={{ fontSize: 11 }} tickLine={false} width={72} />
        <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12 }} />
        <Bar dataKey="demand" fill={AMBER} radius={[0, 4, 4, 0]} name="Demand %" />
      </BarChart>
    </ResponsiveContainer>
  );
}
