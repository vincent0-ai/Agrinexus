import { api } from "./api";
import { USE_MOCK } from "@/utils/constants";
import { ordersList } from "@/data/ordersData";

export async function getOrders(statusFilter?: string) {
  if (USE_MOCK) {
    if (!statusFilter || statusFilter === "All") return [...ordersList];
    return ordersList.filter((o) => o.status === statusFilter);
  }
  const params = statusFilter && statusFilter !== "All" ? `?status=${statusFilter}` : "";
  return api.get(`/orders${params}`);
}

export async function getOrder(id: string) {
  if (USE_MOCK) return ordersList.find((o) => o.id === id) ?? null;
  return api.get(`/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  if (USE_MOCK) return { id, status };
  return api.patch(`/orders/${id}/status`, { status });
}
