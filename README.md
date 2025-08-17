Awesome — here’s a clear “map” of what we built and why, so you (and future teammates) can reason about it quickly.

# 1) Big idea

One **React codebase** serves many tenants (vendors) with different branding, languages, and features — **at runtime** (no forks). We do that with:

- a **TenantConfig JSON** per tenant,
- **providers** that read the config and wire up theme/flags/i18n,
- **route guards** for features/permissions,
- **dynamic component overrides** for deep per-tenant tweaks.

# 2) Folder structure (what lives where)

- **public/**

  - **tenant-config/**: `default.json`, `acme.json` → runtime tenant settings.
  - **i18n/**: per-tenant message bundles.
  - **tenants/**: theme CSS (branding tokens) that can be served by CDN.

- **src/**

  - **config/** → `tenant-config.schema.ts` (Zod schema for safe config).
  - **providers/**

    - `TenantProvider.tsx` → exposes tenant config, loads theme + favicon.
    - `FeatureFlagProvider.tsx` → reads `flags` and exposes `useFlag`.
    - `I18nProvider.tsx` → loads i18n bundle; resilient to missing files.

  - **lib/**

    - `api.ts` → `useApi()` augments fetch with `X-Tenant-Id`.
    - `permissions.ts` → `hasPerm()` helper for UI checks.
    - `dynamicOverride.ts` → safely loads per-tenant component overrides.

  - **components/**

    - `ProgramCard/` → base component; can be swapped per-tenant.

  - **tenants/**

    - `acme/overrides/ProgramCard.tsx` → example tenant-specific UI.

  - **routes/**

    - `GuardedRoute.tsx` → feature/permission gating at route level.
    - `Dashboard.tsx`, `Devices.tsx` → demo screens.

  - **router.tsx** → route table + factory (`createAppRouter`).
  - **App.tsx** → header + `<RouterProvider>`.
  - **AppErrorBoundary.tsx** → nicer runtime error surface.
  - **main.tsx** → **bootstrap** (see below).

# 3) Bootstrap flow (how the app starts)

1. **Resolve tenant + basename** from URL:

   - `/t/:tenant/...` → tenantId = `:tenant`, `basename = /t/:tenant`
   - or from subdomain → `tenant.example.com`

2. Fetch `/tenant-config/<tenantId>.json`, **validate with Zod** (fail-safe fallback).
3. Mount providers in order:

   - **TenantProvider** (injects config, loads theme CSS & favicon)
   - **FeatureFlagProvider** (gates features)
   - **I18nProvider** (loads messages bundle if present)

4. Create router with **`basename`** so the same routes work at `/` and `/t/acme`.
5. Render `<App />`.

**Why:** this keeps the build a **single artifact**, and all tenant differences load **at runtime**, which is essential for on-prem and white-label deployments.

# 4) Routing & guards

- `createBrowserRouter(routes, { basename })` lets `/dashboard` work under `/t/acme`.
- `GuardedRoute` checks:

  - **feature flags**: e.g., `'devices.fitbit'`
  - **permissions**: e.g., `'program.write'`

- Fallback `'*' → <Navigate to="/" />` avoids 404s.

**Why:** tenant-specific feature sets without exploding the route table; security still enforced in BFF/backend.

# 5) Theming & branding

- Each tenant provides a **theme CSS** that sets **CSS variables** (e.g., `--brand-primary`, `--radius-lg`).
- Components read tokens via inline style or Tailwind class values.
- Logos/favicons come from TenantConfig assets.

**Why:** CSS variables are fast, cascade naturally, and don’t require rebuilds.

# 6) Feature flags & permissions

- **Flags**: runtime switches (boolean/variants) to show/hide UI or choose variants.
- **Permissions**: per-tenant/per-user capability checks in UI **and** enforced server-side.

**Why:** flags let you ship once and light up features per tenant; permissions ensure least-privilege UX.

# 7) Dynamic component overrides

- Base component renders by default.
- At runtime we try `../tenants/<id>/overrides/<Key>.tsx`. If found, use it; else fallback.
- Loader guards ensure only real React components are used.

**Why:** supports **deep customization** (layout/copy/buttons) for specific tenants without forking the app.

# 8) i18n loading

- `I18nProvider` fetches `/i18n/<tenant>.json`.
- Soft-fails to `{}` if file is missing (prevents “Unexpected token ‘<’” when a 404 returns HTML).

**Why:** different languages and copy per tenant; resilient in dev and prod.

# 9) API wrapper (BFF-friendly)

- `useApi()` automatically adds `X-Tenant-Id` and `credentials: 'include'`.
- BFF should also read tenant from **JWT claims**/session for trust, not only headers.

**Why:** centralizes multi-tenant context, simplifies screen code, and keeps enforcement server-side.

# 10) Testing & DX

- Jest + RTL ready; example test validates flag gating.
- ErrorBoundary for nicer crashes.
- Zod catches bad configs early (type-safe tenant JSON).

# 11) How to add a new tenant (repeatable steps)

1. **public/tenant-config/foo.json** — copy `default.json`, update fields.
2. **public/tenants/foo/theme.css** — set brand tokens.
3. **public/i18n/foo.json** — optional messages.
4. (Optional) **src/tenants/foo/overrides/** — drop custom components.
5. Visit `/t/foo` (or configure a subdomain) and verify.

# 12) Why these choices (design rationale)

- **Single artifact** → easier ops (blue/green), on-prem packaging, fewer moving parts.
- **Runtime config + CSS tokens** → no rebuilds for branding/flags.
- **Zod validation** → avoid hard-to-debug boot errors.
- **Basename routing** → clean route table; path-based tenanting works out of the box.
- **Override loader** → extensibility without micro-frontends complexity (we can still add Module Federation later if a whole module needs to diverge).

---

If you want, I can turn this into a short **README.md** for your repo (with commands, “add a tenant” checklist, and common pitfalls), or sketch a small diagram of the bootstrap/runtime flow.

http://localhost:5173/
http://localhost:5173/t/default
http://localhost:5173/t/acme
