import { api } from "./api";
import { USE_MOCK } from "@/utils/constants";
import { iotData, iotMetrics, iotAlerts } from "@/data/iotData";

export async function getSensorReadings(hours = 24) {
  if (USE_MOCK) return iotData.slice(-hours);
  return api.get(`/iot/readings?hours=${hours}`);
}

export async function getLatestMetrics() {
  if (USE_MOCK) return [...iotMetrics];
  return api.get("/iot/latest");
}

export async function getAlerts() {
  if (USE_MOCK) return [...iotAlerts];
  return api.get("/iot/alerts");
}
