import { Star } from "lucide-react";

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}
