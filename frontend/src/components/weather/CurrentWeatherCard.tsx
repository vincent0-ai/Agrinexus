import { MapPin, CloudSun, Droplets, Wind, Sun } from "lucide-react";
import { currentWeather } from "@/data/weatherData";

export function CurrentWeatherCard({ compact = false }: { compact?: boolean }) {
  const w = currentWeather;
  if (compact) {
    return (
      <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #1A5276, #2D6A4F)" }}>
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-white/60" />
          <span className="text-xs text-white/60">{w.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{w.temp}°</p>
            <p className="text-white/70 text-sm mt-1">{w.condition}</p>
          </div>
          <CloudSun className="w-14 h-14 text-white/50" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
          {[
            { label: "Humidity", value: w.humidity, Icon: Droplets },
            { label: "Wind",     value: w.wind,     Icon: Wind     },
            { label: "UV",       value: "4",         Icon: Sun      },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="text-center">
              <Icon className="w-3.5 h-3.5 text-white/50 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{value}</p>
              <p className="text-white/40 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-7 text-white" style={{ background: "linear-gradient(135deg, #1A3A5C 0%, #2D6A4F 100%)" }}>
      <div className="flex items-center gap-1.5 mb-5">
        <MapPin className="w-3.5 h-3.5 text-white/50" />
        <span className="text-xs text-white/50">{w.location} — Updated {w.updatedAt}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-8xl font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{w.temp}°</p>
          <p className="text-xl text-white/70 font-light mt-1">{w.condition}</p>
        </div>
        <CloudSun className="w-28 h-28 text-white/40" />
      </div>
      <div className="grid grid-cols-4 gap-4 mt-7 pt-6 border-t border-white/15">
        {[
          { label: "Wind",       value: w.wind,       Icon: Wind     },
          { label: "Humidity",   value: w.humidity,   Icon: Droplets },
          { label: "UV Index",   value: w.uvIndex,    Icon: Sun      },
          { label: "Visibility", value: w.visibility, Icon: MapPin   },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon className="w-4 h-4 text-white/40 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">{value}</p>
              <p className="text-white/40 text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
