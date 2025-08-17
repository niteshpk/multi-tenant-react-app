// Attempts to import a tenant-specific override component at runtime.
// If not found, returns null (use the base component).
export async function loadOverride<T = any>(tenantId: string, key: string) {
  try {
    const mod = await import(`../tenants/${tenantId}/overrides/${key}.tsx`);
    return (mod as any).default as T;
  } catch {
    return null;
  }
}
