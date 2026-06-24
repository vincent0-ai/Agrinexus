import { useState } from "react";
import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderDetailPanel } from "@/components/orders/OrderDetailPanel";
import { useOrders, Order } from "@/hooks/useOrders";
import { useAuth } from "@/context/AuthContext";

const ORDER_STATUSES = ["All", "Pending", "Confirmed", "Delivered", "Cancelled"];

export function OrderManagementPage() {
  const { role } = useAuth();
  const { loading, filterByStatus, updateStatus } = useOrders();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = filterByStatus(filter);

  function handleSelect(order: Order) {
    setSelected((prev) => (prev?.id === order.id ? null : order));
  }

  return (
    <DashboardLayout title="Order Management">
      <div className="flex gap-4">
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
            {ORDER_STATUSES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  filter === t ? "text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                style={filter === t ? { background: GREEN } : {}}
              >
                {t}
              </button>
            ))}
          </div>

          <OrderTable
            orders={filtered}
            selectedId={selected?.id ?? null}
            role={role}
            onSelect={handleSelect}
            loading={loading}
          />
        </div>

        {selected && (
          <OrderDetailPanel
            order={selected}
            role={role}
            onClose={() => setSelected(null)}
            onUpdateStatus={updateStatus}
          />
        )}
      </div>
    </DashboardLayout>
  );
}