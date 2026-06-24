import { useState } from "react";
import { X, ShoppingCart, MapPin } from "lucide-react";
import { GREEN } from "@/utils/constants";
import { CartItem } from "@/hooks/useCart";
import { api } from "@/services/api";

interface PlaceOrderModalProps {
  cartItems: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
  updateQuantity: (id: number, qty: number) => void;
}

export function PlaceOrderModal({ cartItems, onClose, onSuccess, updateQuantity }: PlaceOrderModalProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setError("");
    if (!address.trim()) {
      setError("Please enter a delivery address");
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        cartItems.map((item) =>
          api.post("/orders", {
            product_id:       item.id,
            farmer_id:        item.farmer_id,
            quantity:         item.quantity,
            total_price:      item.price * item.quantity,
            delivery_address: address,
          })
        )
      );
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (e: any) {
      setError(e.message ?? "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" style={{ color: GREEN }} />
            <h2 className="font-black text-lg text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Place Order
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* Items with quantity controls */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Your Items ({cartItems.length})
            </p>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-muted text-foreground font-bold text-sm flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-muted text-foreground font-bold text-sm flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-sm w-24 text-right" style={{ color: GREEN }}>
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3 bg-muted/40 rounded-xl px-4">
            <p className="font-bold text-foreground">Total</p>
            <p className="font-black text-lg" style={{ color: GREEN, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              KSh {total.toLocaleString()}
            </p>
          </div>

          {/* Delivery address */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Delivery Address
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Kenyatta Market, Nairobi, Stall 4B"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none resize-none"
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold text-center">
              ✅ Orders placed successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading || success}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: GREEN }}
          >
            {loading ? "Placing Order..." : success ? "Done! ✓" : `Place Order · KSh ${total.toLocaleString()}`}
          </button>
        </div>

      </div>
    </div>
  );
}