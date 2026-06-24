import { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProductCard, Product } from "@/components/products/ProductCard";
import { PlaceOrderModal } from "@/components/orders/PlaceOrderModal";
import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { useCart } from "@/hooks/useCart";
import { api } from "@/services/api";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Dairy"];

export function ProductListingPage() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("All");
  const [pageNum, setPageNum]           = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const { inCart, toggleCart, cart, cartItems, clearCart, updateQuantity } = useCart();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", String(pageNum));

    api.get(`/products?${params.toString()}`)
      .then((res) => {
        if (res.success) {
          setProducts(res.data ?? []);
          setTotalPages(res.pagination?.total_pages ?? 1);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, pageNum]);

  return (
    <DashboardLayout title="Browse Products">
      <div className="flex gap-5">

        {/* Filter sidebar */}
        <aside className="w-48 flex-shrink-0">
          <div className="bg-card rounded-2xl border border-border p-4 sticky top-0">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Filters
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Category</p>
                <div className="space-y-2">
                  {CATEGORIES.map((c) => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={category === c}
                        onChange={() => { setCategory(c); setPageNum(1); }}
                        className="w-3.5 h-3.5 rounded accent-green-700"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cart summary */}
          {cart.length > 0 && (
            <div className="mt-4 bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-4 h-4" style={{ color: GREEN }} />
                <p className="text-sm font-bold text-foreground">
                  {cart.length} item{cart.length > 1 ? "s" : ""} in cart
                </p>
              </div>
              <div className="space-y-1 mb-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                    <span className="truncate">{item.name}</span>
                    <span className="font-semibold ml-2">KSh {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: GREEN }}
              >
                Checkout →
              </button>
            </div>
          )}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPageNum(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No products found.</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  inCart={inCart(p.id)}
                  onToggleCart={toggleCart}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPageNum(Math.max(1, pageNum - 1))}
                disabled={pageNum === 1}
                className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPageNum(n)}
                  className={cn("w-9 h-9 rounded-xl text-sm font-bold transition-all",
                    pageNum === n ? "text-white" : "border border-border text-foreground hover:bg-muted"
                  )}
                  style={pageNum === n ? { background: GREEN } : {}}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPageNum(Math.min(totalPages, pageNum + 1))}
                disabled={pageNum === totalPages}
                className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order modal */}
      {showOrderModal && (
        <PlaceOrderModal
          cartItems={cartItems}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            clearCart();
            setShowOrderModal(false);
          }}
          updateQuantity={updateQuantity}
        />
      )}

    </DashboardLayout>
  );
}