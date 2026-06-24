const STATUS_STYLES: Record<string, string> = {
  Active:          "bg-emerald-100 text-emerald-700",
  "Out of Stock":  "bg-red-100 text-red-700",
  Pending:         "bg-amber-100 text-amber-700",
  Delivered:       "bg-emerald-100 text-emerald-700",
  Confirmed:       "bg-blue-100 text-blue-700",
  Cancelled:       "bg-red-100 text-red-700",
  Optimal:         "bg-emerald-100 text-emerald-700",
  Warning:         "bg-amber-100 text-amber-700",
  Critical:        "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
