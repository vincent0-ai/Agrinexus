import { useState } from "react";
import { X, Package } from "lucide-react";
import { GREEN } from "@/utils/constants";

interface AddProductModalProps {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
    description: string;
  }) => Promise<void>;
}

export function AddProductModal({ onClose, onSubmit }: AddProductModalProps) {
  const [name, setName]               = useState("");
  const [category, setCategory]       = useState("Vegetables");
  const [price, setPrice]             = useState("");
  const [quantity, setQuantity]       = useState("");
  const [unit, setUnit]               = useState("kg");
  const [description, setDesc]        = useState("");
  const [image, setImage]             = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!name || !price || !quantity) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      if (image) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("unit", unit);
        formData.append("description", description);
        formData.append("image", image);

        const token = localStorage.getItem("agrinexus_token") ?? "";
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message ?? "Failed");
      } else {
        await onSubmit({
          name,
          category,
          price: Number(price),
          quantity: Number(quantity),
          unit,
          description,
        });
      }
      onClose();
    } catch (e: any) {
      setError(e.message ?? "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg shadow-2xl">

        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-black text-lg text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Add New Product
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
                placeholder="e.g. Organic Kale"
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
                placeholder="65"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Quantity *</label>
              <input
                type="number"
                placeholder="500"
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
            <label className="block text-sm font-bold text-foreground mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Describe freshness, growing method, harvest date…"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">Product Image</label>
            <label className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-xl mx-auto"
                />
              ) : (
                <>
                  <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag &amp; drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </>
              )}
            </label>
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
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>

      </div>
    </div>
  );
}