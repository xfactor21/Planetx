# planet.X Command Center

Canonical, GitHub-backed Vercel source for `dashboard.planet-x.co`.

## Architecture

- Vite/React frontend
- Vercel Functions under `api/[...route].ts` plus `api/bridge.ts`
- Shared Supabase analytics ledger remains the analytics system of record
- Google Search Console / GA4 dashboard data can be served from the privacy-safe `google_insights_snapshots` table through the `planetx-command-center-bridge` Edge Function
- Analytics-key validation is delegated to the Supabase Edge authority, so the Command Center does not need a duplicate ingest secret to validate fallback requests
- No raw IP addresses are collected

## Vercel setup

Create a separate Vercel project from the `xfactor21/Planetx` repository and set its Root Directory to `command-center`.

Backend-only environment variables remain optional compatibility paths:

- `PLANETX_ANALYTICS_INGEST_KEY`: legacy direct Command Center write-proxy key; the active bridge forwards the caller key to the Supabase authority instead
- `GOOGLE_INSIGHTS_CONFIG`: legacy direct Google service-account JSON; the active dashboard Google route uses the Supabase aggregate snapshot bridge

Do not expose either variable with a `VITE_` prefix.

After the preview passes, assign `dashboard.planet-x.co` to this Vercel project. Keep the current AppDeploy custom domain active until the Vercel domain is ready.
