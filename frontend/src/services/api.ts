import { API_BASE_URL } from "@/utils/constants";

function getToken() {
  return localStorage.getItem("agrinexus_token") ?? "";
}

async function request(method: string, path: string, body?: unknown) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
}

export const api = {
  get:    (path: string)                    => request("GET",    path),
  post:   (path: string, body: unknown)     => request("POST",   path, body),
  put:    (path: string, body: unknown)     => request("PUT",    path, body),
  patch:  (path: string, body?: unknown)    => request("PATCH",  path, body),
  delete: (path: string)                    => request("DELETE", path),
};
