import { useTenant } from "../providers/TenantProvider";

// Example: wrap fetch to always include tenant id and credentials
export function useApi() {
  const tenant = useTenant();
  return async function api<T = unknown>(
    path: string,
    init?: RequestInit
  ): Promise<T> {
    const res = await fetch(`/api${path}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        "X-Tenant-Id": tenant.id,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json() as Promise<T>;
  };
}
