import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  TenantConfigSchema,
  type TenantConfig,
} from "./config/tenant-config.schema";
import { TenantProvider } from "./providers/TenantProvider";
import { FeatureFlagProvider } from "./providers/FeatureFlagProvider";
import { I18nProvider } from "./providers/I18nProvider";
import { App } from "./App";

function resolveTenantFromLocation(): string {
  const subdomain = window.location.hostname.split(".")[0];
  if (subdomain && subdomain !== "localhost") return subdomain;
  const m = window.location.pathname.match(/^\/t\/([a-z0-9-]+)/i);
  return m?.[1] ?? "default";
}

async function loadTenantConfig(id: string): Promise<TenantConfig> {
  const res = await fetch(`/tenant-config/${id}.json`, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`Failed to load tenant config ${id}: ${res.status}`);

  const json = await res.json();
  return TenantConfigSchema.parse(json);
}

(async function bootstrap() {
  const tenantId = resolveTenantFromLocation();
  const cfg = await loadTenantConfig(tenantId);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <TenantProvider value={cfg}>
        <FeatureFlagProvider flags={cfg.flags}>
          <I18nProvider locale={cfg.locale} messagesUrl={cfg.i18nBundleUrl}>
            <App />
          </I18nProvider>
        </FeatureFlagProvider>
      </TenantProvider>
    </React.StrictMode>
  );
})();
