// src/config/tenant-config.schema.ts
import { z } from "zod";

export const TenantConfigSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  theme: z.object({ package: z.string() }).optional(),
  assets: z
    .object({
      logo: z.string().optional(),
      favicon: z.string().optional(),
    })
    .optional(),
  locale: z.string().default("en"),
  i18nBundleUrl: z.string().optional(),
  // ⬇️ FIX: add z.string() as the key type
  flags: z.record(z.string(), z.union([z.boolean(), z.string()])).default({}),
  permissions: z.array(z.string()).default([]),
  routes: z
    .object({
      home: z.string().default("/dashboard"),
    })
    .default({ home: "/dashboard" }),
});

export type TenantConfig = z.infer<typeof TenantConfigSchema>;
