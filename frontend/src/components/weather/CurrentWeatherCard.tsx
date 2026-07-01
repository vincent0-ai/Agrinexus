import { MapPin, Droplets, Wind, Sun } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

function WeatherEmoji({ icon }: { icon: string }) {
  const sunny  = ["01d", "01n"];
  const cloudy = ["02d", "02n", "03d", "03n", "04d", "04n"];
  const rainy  = ["09d", "09n", "10d", "10n", "11d", "11n"];
  if (sunny.includes(icon))  return <span className="text-yellow-300">☀️</span>;
  if (rainy.includes(icon))  return <span>🌧️</span>;
  if (cloudy.includes(icon)) return <span>⛅</span>;
  return <span>🌤️</span>;
}

export function CurrentWeatherCard({ compact = false }: { compact?: boolean }) {
  const { current, loading } = useWeather();

  if (loading || !current) {
    return (
      <div
        className="rounded-2xl p-5 text-white animate-pulse"
        style={{ background: "linear-gradient(135deg, #1A5276, #2D6A4F)" }}
      >
        <div className="h-6 bg-white/20 rounded mb-4 w-1/3" />
        <div className="h-16 bg-white/20 rounded mb-4" />
        <div className="h-8 bg-white/20 rounded w-1/2" />
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className="rounded-2xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #1A5276, #2D6A4F)" }}
      >
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-white/60" />
          <span className="text-xs text-white/60">{current.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-5xl font-black text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {current.temp}°
            </p>
            <p className="text-white/70 text-sm mt-1">{current.condition}</p>
          </div>
          <span className="text-5xl">
            <WeatherEmoji icon={current.icon} />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
          {[
            { label: "Humidity", value: current.humidity,                    Icon: Droplets },
            { label: "Wind",     value: current.wind,                        Icon: Wind     },
            { label: "UV",       value: current.uvIndex.split(" ")[0] ?? "4", Icon: Sun     },
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

  // Full version
  return (
    <div
      className="rounded-2xl p-7 text-white"
      style={{ background: "linear-gradient(135deg, #1A3A5C 0%, #2D6A4F 100%)" }}
    >
      <div className="flex items-center gap-1.5 mb-5">
        <MapPin className="w-3.5 h-3.5 text-white/50" />
        <span className="text-xs text-white/50">
          {current.location} — Updated {current.updatedAt}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-8xl font-black"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {current.temp}°
          </p>
          <p className="text-xl text-white/70 font-light mt-1">{current.condition}</p>
          <p className="text-sm text-white/50 mt-1">Feels like {current.feels_like}°</p>
        </div>
        <span className="text-8xl">
          <WeatherEmoji icon={current.icon} />
        </span>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-7 pt-6 border-t border-white/15">
        {[
          { label: "Wind",       value: current.wind,       Icon: Wind     },
          { label: "Humidity",   value: current.humidity,   Icon: Droplets },
          { label: "UV Index",   value: current.uvIndex,    Icon: Sun      },
          { label: "Visibility", value: current.visibility, Icon: MapPin   },
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
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/40">🌅 Sunrise {current.sunrise}</p>
        <p className="text-xs text-white/40">🌇 Sunset {current.sunset}</p>
      </div>
    </div>
  );
}
