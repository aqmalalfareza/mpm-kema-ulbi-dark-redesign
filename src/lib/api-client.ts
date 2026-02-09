import type { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = { 
    'Content-Type': 'application/json',
    ...(init?.headers || {})
  };
  const res = await fetch(path, { ...init, headers });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }
  return json.data;
}