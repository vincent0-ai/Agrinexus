import { useState, useEffect } from "react";
import { api } from "@/services/api";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  status: string;
  image_url: string;
  description: string;
  farmer_id: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products/mine")
      .then((res) => {
        if (res.success) setProducts(res.data ?? []);
        else setError(res.message ?? "Failed to load products");
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  async function addProduct(data: Omit<Product, "id" | "farmer_id" | "image_url">) {
    const res = await api.post("/products", data);
    if (res.success) {
      setProducts((prev) => [...prev, res.data]);
      return res.data;
    }
    throw new Error(res.message ?? "Failed to add product");
  }

  async function removeProduct(id: number) {
    const res = await api.delete(`/products/${id}`);
    if (res.success) setProducts((prev) => prev.filter((p) => p.id !== id));
    else throw new Error(res.message ?? "Failed to delete product");
  }

  async function updateProduct(id: number, data: Partial<Product>) {
    const res = await api.put(`/products/${id}`, data);
    if (res.success) {
      setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      return res.data;
    }
    throw new Error(res.message ?? "Failed to update product");
  }

  function filterByStatus(status: string) {
    if (status === "All") return products;
    const map: Record<string, string> = {
      "Active": "active",
      "Out of Stock": "out_of_stock",
      "Pending": "pending",
    };
    return products.filter((p) => p.status === map[status]);
  }

  return { products, loading, error, addProduct, removeProduct, updateProduct, filterByStatus };
}