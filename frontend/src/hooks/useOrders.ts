import { useState, useEffect } from "react";
import { api } from "@/services/api";

export interface Order {
  id: number;
  product_name: string;
  buyer_name: string;
  farmer_name: string;
  quantity: number;
  total_price: number;
  delivery_address: string;
  status: string;
  created_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders")
      .then((res) => {
        if (res.success) setOrders(res.data ?? []);
        else setError(res.message ?? "Failed to load orders");
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    const res = await api.patch(`/orders/${id}/status`, { status });
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } else {
      throw new Error(res.message ?? "Failed to update status");
    }
  }

  function filterByStatus(filter: string) {
    if (filter === "All") return orders;
    return orders.filter((o) => o.status === filter.toLowerCase());
  }

  return { orders, loading, error, updateStatus, filterByStatus };
}