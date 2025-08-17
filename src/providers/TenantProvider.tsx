import React, { createContext, useContext, useMemo } from "react";
import type { TenantConfig } from "../config/tenant-config.schema";

const TenantCtx = createContext<TenantConfig | null>(null);
export const useTenant = () => {
  const ctx = useContext(TenantCtx);
  if (!ctx) throw new Error("TenantProvider missing");
  return ctx;
};

export function TenantProvider({
  value,
  children,
}: {
  value: TenantConfig;
  children: React.ReactNode;
}) {
  // Load tenant theme css at runtime
  React.useEffect(() => {
    if (!value.theme?.package) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/${value.theme.package}`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [value.id]);

  // set favicon if provided
  React.useEffect(() => {
    if (!value.assets?.favicon) return;
    let link = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = `/${value.assets.favicon}`;
  }, [value.id]);

  const memo = useMemo(() => value, [value]);
  return <TenantCtx.Provider value={memo}>{children}</TenantCtx.Provider>;
}
