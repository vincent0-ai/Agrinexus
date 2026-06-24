import { useState } from "react";
import { X } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { GREEN } from "@/utils/constants";
import { Order } from "@/hooks/useOrders";

interface OrderDetailPanelProps {
  order: Order;
  role: string | null;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => Promise<void>;
}

const STATUSES = ["pending", "confirmed", "delivered", "cancelled"];

export function OrderDetailPanel({ order: o, role, onClose, onUpdateStatus }: OrderDetailPanelProps) {
  const [status, setStatus] = useState(o.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await onUpdateStatus(o.id, status);
      setSuccess("Status updated successfully!");
    } catch (e: any) {
      setError(e.message ?? "Failed to update");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-72 flex-shrink-0 bg-card rounded-2xl border border-border p-5 h-fit">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Order Details
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4">
        {[
          { label: "Order ID",         value: `#${o.id}`,           mono: true  },
          { label: "Product",          value: o.product_name,        mono: false },
          { label: "Buyer",            value: o.buyer_name,          mono: false },
          { label: "Farmer",           value: o.farmer_name,         mono: false },
          { label: "Date",             value: new Date(o.created_at).toLocaleDateString("en-KE"), mono: false },
          { label: "Delivery Address", value: o.delivery_address || "Not specified", mono: false },
        ].map(({ label, value, mono }) => (
          <div key={label}>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-foreground text-sm ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
          </div>
        ))}

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
          <p className="font-black text-lg" style={{ color: GREEN, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            KSh {Number(o.total_price).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{o.quantity} kg</p>
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Status</p>
          <StatusBadge status={o.status} />
        </div>

        {role !== "buyer" && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Update Status
            </p>

            {error && (
              <p className="text-xs text-red-500 mb-2">{error}</p>
            )}
            {success && (
              <p className="text-xs text-emerald-600 mb-2">{success}</p>
            )}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none mb-3 capitalize"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
            <button
              onClick={handleUpdate}
              disabled={loading || status === o.status}
              className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: GREEN }}
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}