import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { useWeather } from "@/hooks/useWeather";
import { Cloud, Sun, CloudRain } from "lucide-react";

function WeatherIcon({ icon, className }: { icon: string; className?: string }) {
  const sunny  = ["01d", "01n"];
  const rainy  = ["09d", "09n", "10d", "10n", "11d", "11n"];
  if (sunny.includes(icon))  return <Sun className={className} />;
  if (rainy.includes(icon))  return <CloudRain className={className} />;
  return <Cloud className={className} />;
}

export function ForecastStrip() {
  const { forecast, loading } = useWeather();

  if (loading) {
    return (
      <div className="grid grid-cols-7 gap-2">
        {Array(7).fill(0).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {forecast.map((f, i) => (
        <div
          key={f.day}
          className={cn("flex flex-col items-center p-3 rounded-xl transition-colors", i !== 0 && "hover:bg-muted")}
          style={i === 0 ? { background: GREEN } : {}}
        >
          <p className={cn("text-xs font-semibold", i === 0 ? "text-white" : "text-muted-foreground")}>{f.day}</p>
          <WeatherIcon
            icon={f.icon}
            className={cn("w-7 h-7 my-2", i === 0 ? "text-white" : "text-amber-400")}
          />
          <p className={cn("font-black text-sm", i === 0 ? "text-white" : "text-foreground")}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {f.high}°
          </p>
          <p className={cn("text-xs", i === 0 ? "text-white/60" : "text-muted-foreground")}>{f.low}°</p>
          {f.rain > 0 && (
            <p className={cn("text-xs mt-1", i === 0 ? "text-white/70" : "text-blue-500")}>
              {f.rain}mm
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
