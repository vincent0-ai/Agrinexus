import { Sun, CloudSun, Droplets, AlertTriangle, Leaf } from "lucide-react";

export const currentWeather = {
  temp: 23,
  condition: "Partly Cloudy",
  location: "Kiambu, Kenya",
  updatedAt: "14:30",
  wind: "12 km/h",
  humidity: "65%",
  uvIndex: "4 Moderate",
  visibility: "10 km",
};

export const forecast = [
  { day: "Thu", Icon: Sun,      high: 26, low: 15 },
  { day: "Fri", Icon: CloudSun, high: 24, low: 14 },
  { day: "Sat", Icon: CloudSun, high: 22, low: 13 },
  { day: "Sun", Icon: Droplets, high: 19, low: 12 },
  { day: "Mon", Icon: Droplets, high: 18, low: 11 },
  { day: "Tue", Icon: Sun,      high: 23, low: 13 },
  { day: "Wed", Icon: Sun,      high: 25, low: 15 },
];

export const hourlyData = [
  { hour: "06:00", temp: 16, rain: 0   },
  { hour: "08:00", temp: 19, rain: 0   },
  { hour: "10:00", temp: 22, rain: 0   },
  { hour: "12:00", temp: 24, rain: 0   },
  { hour: "14:00", temp: 23, rain: 3.2 },
  { hour: "16:00", temp: 21, rain: 1.8 },
  { hour: "18:00", temp: 19, rain: 0   },
  { hour: "20:00", temp: 17, rain: 0   },
];

export const farmingAdvisories = [
  {
    title: "Good Day for Irrigation",
    desc:  "Low wind and moderate temps make today ideal for drip irrigation. Schedule between 6–9 AM for best efficiency.",
    level: "good",
    Icon:  Droplets,
  },
  {
    title: "Rain Risk — Delay Harvest",
    desc:  "Heavy rain expected Sunday–Monday. Harvest leafy greens before Saturday evening to prevent field losses.",
    level: "warning",
    Icon:  AlertTriangle,
  },
  {
    title: "Ideal Planting Conditions",
    desc:  "Soil temperature and moisture are optimal for tomatoes and beans. Tuesday and Wednesday are the best planting days.",
    level: "good",
    Icon:  Leaf,
  },
];
