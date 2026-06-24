import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { forecast } from "@/data/weatherData";

export function ForecastStrip() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {forecast.map((f, i) => (
        <div
          key={f.day}
          className={cn("flex flex-col items-center p-3 rounded-xl transition-colors", i !== 0 && "hover:bg-muted")}
          style={i === 0 ? { background: GREEN } : {}}
        >
          <p className={cn("text-xs font-semibold", i === 0 ? "text-white" : "text-muted-foreground")}>{f.day}</p>
          <f.Icon className={cn("w-7 h-7 my-2", i === 0 ? "text-white" : "text-amber-400")} />
          <p
            className={cn("font-black text-sm", i === 0 ? "text-white" : "text-foreground")}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {f.high}°
          </p>
          <p className={cn("text-xs", i === 0 ? "text-white/60" : "text-muted-foreground")}>{f.low}°</p>
        </div>
      ))}
    </div>
  );
}
