import { api } from "./api";
import { USE_MOCK } from "@/utils/constants";
import { allProducts, farmerProducts } from "@/data/productsData";

export async function getProducts(filters?: { category?: string; county?: string; sort?: string }) {
  if (USE_MOCK) {
    let list = [...allProducts];
    if (filters?.category && filters.category !== "All") list = list.filter((p) => p.category === filters.category);
    if (filters?.county)   list = list.filter((p) => p.county === filters.county);
    return list;
  }
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return api.get(`/products${params ? "?" + params : ""}`);
}

export async function getFarmerProducts() {
  if (USE_MOCK) return [...farmerProducts];
  return api.get("/products/mine");
}

export async function addProduct(payload: unknown) {
  if (USE_MOCK) return { id: Date.now(), ...payload as object, status: "Pending" };
  return api.post("/products", payload);
}

export async function updateProduct(id: number, payload: unknown) {
  if (USE_MOCK) return { id, ...payload as object };
  return api.put(`/products/${id}`, payload);
}

export async function deleteProduct(id: number) {
  if (USE_MOCK) return { success: true };
  return api.delete(`/products/${id}`);
}
