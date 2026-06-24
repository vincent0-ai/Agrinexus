import { useState } from "react";
import { X } from "lucide-react";
import { GREEN } from "@/utils/constants";
import { Product } from "@/hooks/useProducts";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (id: number, data: Partial<Product>) => Promise<void>;
}

export function EditProductModal({ product, onClose, onSubmit }: EditProductModalProps) {
  const [name, setName]         = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice]       = useState(String(product.price));
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [unit, setUnit]         = useState(product.unit);
  const [description, setDesc]  = useState(product.description ?? "");
  const [status, setStatus]     = useState(product.status);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!name || !price || !quantity) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(product.id, {
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
        unit,
        description,
        status,
      });
      onClose();
    } catch (e: any) {
      setError(e.message ?? "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg shadow-2xl">

        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-black text-lg text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Edit Product
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
              >
                {["Vegetables", "Fruits", "Grains", "Dairy"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Price (KSh) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Quantity *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
              >
                {["kg", "bunch", "litre", "piece"].map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
            >
              {["active", "out_of_stock", "pending"].map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: GREEN }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}