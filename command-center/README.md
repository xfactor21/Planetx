# planet.X Command Center

Canonical, GitHub-backed Vercel source for `dashboard.planet-x.co`.

## Architecture

- Vite/React frontend
- Vercel Functions under `api/[...route].ts`
- Shared Supabase analytics ledger remains the data source
- Google Search Console and GA4 use read-only service-account access
- No raw IP addresses are collected

## Vercel setup

Create a separate Vercel project from the `xfactor21/Planetx` repository and set its Root Directory to `command-center`.

Backend-only environment variables:

- `PLANETX_ANALYTICS_INGEST_KEY`: optional Command Center write-proxy key
- `GOOGLE_INSIGHTS_CONFIG`: JSON containing `client_email`, `private_key`, `search_console_site_url`, and optionally `analytics_property_id`

Do not expose either variable with a `VITE_` prefix.

After the preview passes, assign `dashboard.planet-x.co` to this Vercel project. Keep the current AppDeploy custom domain active until the Vercel domain is ready.
