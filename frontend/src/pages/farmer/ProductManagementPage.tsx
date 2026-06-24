import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProductTable } from "@/components/products/ProductTable";
import { AddProductModal } from "@/components/products/AddProductModal";
import { EditProductModal } from "@/components/products/EditProductModal";
import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { useProducts, Product } from "@/hooks/useProducts";

const TABS = ["All", "Active", "Out of Stock", "Pending"];

export function ProductManagementPage() {
  const [filter, setFilter]             = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct]   = useState<Product | null>(null);

  const { loading, filterByStatus, removeProduct, addProduct, updateProduct } = useProducts();
  const filtered = filterByStatus(filter);

  return (
    <DashboardLayout title="My Products">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  filter === t ? "text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                style={filter === t ? { background: GREEN } : {}}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: GREEN }}
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        <ProductTable
          products={filtered}
          onDelete={removeProduct}
          onEdit={setEditProduct}
          loading={loading}
        />
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addProduct}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSubmit={updateProduct}
        />
      )}
    </DashboardLayout>
  );
}