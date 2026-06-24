import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { Package } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  category: string;
  farmer_name: string;
  county: string;
  price: number;
  unit: string;
  quantity: number;
  status: string;
  image_url: string;
  farmer_id: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  inCart: boolean;
  onToggleCart: (product: Product) => void;
  compact?: boolean;
}

export function ProductCard({ product: p, inCart, onToggleCart, compact = false }: ProductCardProps) {
  const imgH = compact ? "h-28" : "h-36";

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className={`${imgH} bg-muted overflow-hidden relative`}>
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        {!compact && (
          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 text-foreground shadow-sm">
            {p.category}
          </span>
        )}
      </div>
      <div className={compact ? "p-3" : "p-4"}>
        <h3 className="font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {p.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-white font-black flex-shrink-0"
            style={{ background: GREEN, fontSize: 8 }}
          >
            {p.farmer_name?.[0] ?? "F"}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {p.farmer_name} · {p.county}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="font-black" style={{ color: GREEN, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            KSh {Number(p.price).toLocaleString()}/{p.unit}
          </p>
          <span className="text-xs text-muted-foreground">
            {p.quantity} {p.unit}s left
          </span>
        </div>
        <button
          onClick={() => onToggleCart(p)}
          disabled={p.quantity === 0 || p.status !== "active"}
          className={cn(
            "w-full mt-3 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50",
            inCart ? "bg-emerald-100 text-emerald-700" : "text-white"
          )}
          style={inCart ? {} : { background: GREEN }}
        >
          {p.quantity === 0 ? "Out of Stock" : inCart ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}