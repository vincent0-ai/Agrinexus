export function formatKSh(amount: number): string {
  return `KSh ${Number(amount).toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
}

export function formatPercent(value: number, decimals = 0): string {
  return `${Number(value).toFixed(decimals)}%`;
}
