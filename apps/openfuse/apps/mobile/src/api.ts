import { Platform } from "react-native";
import { readApiPayload } from "./api-response";
import { resolveApiBase } from "./api-url";

// Web calls are same-origin so Expo Metro or the Arena Vite preview can proxy `/api`.
// Native clients keep their local defaults and can override them for physical devices.
export const API_URL = resolveApiBase(Platform.OS, process.env.EXPO_PUBLIC_API_URL).replace(
  /\/$/,
  "",
);

export function sessionHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "X-Alineo-Session": token };
}

export class FuseApi {
  constructor(readonly token: string) {}
  async request<T>(path: string, body?: unknown, method?: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: method ?? (body === undefined ? "GET" : "POST"),
      headers: {
        ...sessionHeaders(this.token),
        ...(body === undefined || body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
    const payload = await readApiPayload<T>(response);
    return payload;
  }
  url(path: string) {
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  }
}

export async function createSession(
  accessKey?: string,
): Promise<{ token: string; mode: "sample" | "live" }> {
  const response = await fetch(`${API_URL}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessKey }),
  });
  const payload = await readApiPayload<{ token: string; mode: "sample" | "live" }>(
    response,
    "Impossible d’ouvrir votre espace.",
  );
  return payload;
}
