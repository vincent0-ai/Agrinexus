import { api } from "./api";
import { USE_MOCK } from "@/utils/constants";

export async function login(email: string, password: string, role: string) {
  if (USE_MOCK) return { token: "mock-token", user: { email, role, name: email.split("@")[0] } };
  const data = await api.post("/auth/login", { email, password, role });
  localStorage.setItem("agrinexus_token", data.token);
  return data;
}

export async function register(payload: { fullName: string; email: string; password: string; role: string }) {
  if (USE_MOCK) return { token: "mock-token", user: payload };
  const data = await api.post("/auth/register", payload);
  localStorage.setItem("agrinexus_token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("agrinexus_token");
}

export async function getMe() {
  if (USE_MOCK) return null;
  return api.get("/auth/me");
}
