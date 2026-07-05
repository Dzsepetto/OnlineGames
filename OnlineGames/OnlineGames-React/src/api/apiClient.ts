import type { ApiResponse } from "./api.types";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("Missing VITE_API_BASE_URL");
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

const getErrorMessage = (data: unknown, fallback: string): string => {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallback;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !data || data.success === false) {
    throw new Error(getErrorMessage(data, `HTTP ${res.status}`));
  }

  return data.data;
}

export function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint);
}

export function apiPost<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body,
  });
}