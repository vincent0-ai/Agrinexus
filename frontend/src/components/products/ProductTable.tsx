import { Edit2, Trash2, Package } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { GREEN } from "@/utils/constants";
import { Product } from "@/hooks/useProducts";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
  loading?: boolean;
}

export function ProductTable({ products, onDelete, onEdit, loading }: ProductTableProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center text-sm text-muted-foreground">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center">
        <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground">No products yet</p>
        <p className="text-xs text-muted-foreground mt-1">Click "Add New Product" to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground bg-muted/30 border-b border-border">
            {["Product", "Category", "Price", "Quantity", "Status", "Actions"].map((h) => (
              <th key={h} className="px-6 py-3.5 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-bold text-foreground">{p.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
              <td className="px-6 py-4 font-black" style={{ color: GREEN }}>
                KSh {Number(p.price).toLocaleString()}/{p.unit}
              </td>
              <td className="px-6 py-4 text-foreground font-mono text-xs">
                {p.quantity} {p.unit}s
              </td>
              <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(p)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}