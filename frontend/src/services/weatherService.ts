import { api } from "./api";
import { USE_MOCK } from "@/utils/constants";
import { currentWeather, forecast, hourlyData, farmingAdvisories } from "@/data/weatherData";

export async function getCurrentWeather(county = "Kiambu") {
  if (USE_MOCK) return { ...currentWeather, location: `${county}, Kenya` };
  return api.get(`/weather/current?county=${encodeURIComponent(county)}`);
}

export async function getForecast(county = "Kiambu", days = 7) {
  if (USE_MOCK) return forecast.slice(0, days);
  return api.get(`/weather/forecast?county=${encodeURIComponent(county)}&days=${days}`);
}

export async function getHourlyData(county = "Kiambu") {
  if (USE_MOCK) return [...hourlyData];
  return api.get(`/weather/hourly?county=${encodeURIComponent(county)}`);
}

export async function getFarmingAdvisories(county = "Kiambu") {
  if (USE_MOCK) return [...farmingAdvisories];
  return api.get(`/weather/advisories?county=${encodeURIComponent(county)}`);
}
