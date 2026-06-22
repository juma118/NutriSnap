import AsyncStorage from "@react-native-async-storage/async-storage";

const rawUrl = process.env.EXPO_PUBLIC_API_URL;
if (!rawUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_API_URL. Copy app/.env.example to app/.env and point " +
      "it at your running FastAPI backend (e.g. http://192.168.1.10:8000).",
  );
}
// Normalize: strip any trailing slash so path joins are clean.
export const API_URL = rawUrl.replace(/\/+$/, "");

const TOKEN_KEY = "nutrisnap_token";
let authToken: string | null = null;

export async function loadToken(): Promise<string | null> {
  authToken = await AsyncStorage.getItem(TOKEN_KEY);
  return authToken;
}

export async function setToken(token: string): Promise<void> {
  authToken = token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  authToken = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function api<T = any>(
  path: string,
  { method = "GET", body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth && authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const detail =
      (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data as T;
}
