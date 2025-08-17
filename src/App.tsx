import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useTenant } from "./providers/TenantProvider";

export function App() {
  const tenant = useTenant();
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {tenant.assets?.logo && (
            <img src={`/${tenant.assets.logo}`} className="h-8" />
          )}
          <h1 className="font-semibold">{tenant.displayName}</h1>
        </div>
        <span className="text-sm opacity-70">Tenant: {tenant.id}</span>
      </header>
      <main className="p-4">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}
