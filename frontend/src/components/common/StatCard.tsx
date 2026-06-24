import { GREEN } from "@/utils/constants";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color?: string;
}

export function StatCard({ label, value, sub, icon: Icon, color = GREEN }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p
            className="text-2xl font-bold mt-1 truncate"
            style={{ color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {value}
          </p>
          {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
          style={{ background: color + "18" }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
