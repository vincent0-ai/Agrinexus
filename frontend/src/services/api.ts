import { API_BASE_URL } from "@/utils/constants";

function getToken() {
  return localStorage.getItem("agrinexus_token") ?? "";
}

async function request(method: string, path: string, body?: unknown) {
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${cleanBase}${cleanPath}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = {};
  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error(`Server returned non-JSON response (${res.status}): ${text.substring(0, 150)}`);
    }
  }

  if (!res.ok) throw new Error(data.message ?? `Request failed with status ${res.status}`);
  return data;
}

export const api = {
  get:    (path: string)                    => request("GET",    path),
  post:   (path: string, body: unknown)     => request("POST",   path, body),
  put:    (path: string, body: unknown)     => request("PUT",    path, body),
  patch:  (path: string, body?: unknown)    => request("PATCH",  path, body),
  delete: (path: string)                    => request("DELETE", path),
};
