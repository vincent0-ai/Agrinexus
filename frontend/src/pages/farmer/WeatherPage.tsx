import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { ForecastStrip } from "@/components/weather/ForecastStrip";
import { HourlyWeatherChart } from "@/components/charts/HourlyWeatherChart";
import { farmingAdvisories } from "@/data/weatherData";

export function WeatherPage() {
  return (
    <DashboardLayout title="Weather Forecast">
      <div className="space-y-5">
        <CurrentWeatherCard />

        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>7-Day Forecast</h2>
          <ForecastStrip />
        </div>
 
        <div>
          <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Farming Advisories</h2>
          <div className="grid grid-cols-3 gap-4">
            {farmingAdvisories.map((a) => (
              <div key={a.title} className={cn("rounded-2xl border p-5", a.level === "warning" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", a.level === "warning" ? "bg-amber-100" : "bg-emerald-100")}>
                  <a.Icon className={cn("w-5 h-5", a.level === "warning" ? "text-amber-600" : "text-emerald-600")} />
                </div>
                <h3 className={cn("font-bold mb-2 text-sm", a.level === "warning" ? "text-amber-800" : "text-emerald-800")} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.title}</h3>
                <p className={cn("text-xs leading-relaxed", a.level === "warning" ? "text-amber-700" : "text-emerald-700")}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hourly Temperature &amp; Rainfall</h2>
          <HourlyWeatherChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
