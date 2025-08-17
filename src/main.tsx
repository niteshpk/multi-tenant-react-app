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

function resolveTenantAndBasename() {
  // path-based: /t/:tenant/...
  const m = window.location.pathname.match(/^\/t\/([a-z0-9-]+)(?:\/|$)/i);
  if (m) return { tenantId: m[1], basename: `/t/${m[1]}` };

  // subdomain-based: tenant.example.com
  const sub = window.location.hostname.split(".")[0];
  if (sub && sub !== "localhost") return { tenantId: sub, basename: undefined };

  return { tenantId: "default", basename: undefined };
}

async function loadTenantConfig(id: string): Promise<TenantConfig> {
  const res = await fetch(`/tenant-config/${id}.json`, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`Failed to load tenant config ${id}: ${res.status}`);
  const json = await res.json();
  return TenantConfigSchema.parse(json);
}

(async function bootstrap() {
  const { tenantId, basename } = resolveTenantAndBasename();
  const cfg = await loadTenantConfig(tenantId);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <TenantProvider value={cfg}>
        <FeatureFlagProvider flags={cfg.flags}>
          <I18nProvider locale={cfg.locale} messagesUrl={cfg.i18nBundleUrl}>
            <App basename={basename} />
          </I18nProvider>
        </FeatureFlagProvider>
      </TenantProvider>
    </React.StrictMode>
  );
})();
