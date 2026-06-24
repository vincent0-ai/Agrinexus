import { StatusBadge } from "@/components/common/StatusBadge";
import { GREEN } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { Order } from "@/hooks/useOrders";

interface OrderTableProps {
  orders: Order[];
  selectedId: number | null;
  role: string | null;
  onSelect: (order: Order) => void;
  loading?: boolean;
}

export function OrderTable({ orders, selectedId, role, onSelect, loading }: OrderTableProps) {
  const partyLabel = role === "buyer" ? "Farmer" : "Buyer";

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center text-sm text-muted-foreground">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center text-sm text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground bg-muted/30 border-b border-border">
            {["Order ID", "Product", partyLabel, "Qty", "Total", "Date", "Status", ""].map((h) => (
              <th key={h} className="px-5 py-3.5 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              onClick={() => onSelect(o)}
              className={cn(
                "border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer",
                selectedId === o.id && "bg-emerald-50"
              )}
            >
              <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">#{o.id}</td>
              <td className="px-5 py-3.5 font-bold text-foreground">{o.product_name}</td>
              <td className="px-5 py-3.5 text-muted-foreground">
                {role === "buyer" ? o.farmer_name : o.buyer_name}
              </td>
              <td className="px-5 py-3.5 font-mono text-xs text-foreground">{o.quantity} kg</td>
              <td className="px-5 py-3.5 font-black text-sm" style={{ color: GREEN }}>
                KSh {Number(o.total_price).toLocaleString()}
              </td>
              <td className="px-5 py-3.5 text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleDateString("en-KE")}
              </td>
              <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
              <td className="px-5 py-3.5">
                <button
                  className="text-xs font-bold"
                  style={{ color: GREEN }}
                  onClick={(e) => { e.stopPropagation(); onSelect(o); }}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}