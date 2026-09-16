# planet.X Command Center

Canonical, GitHub-backed Vercel source for `dashboard.planet-x.co`.

## Architecture

- Vite/React frontend
- Vercel Functions under `api/[...route].ts` plus focused intelligence endpoints
- Shared Supabase analytics ledger remains the data source for planet.X product analytics
- Google Search Console and GA4 use read-only service-account access
- No raw IP addresses are collected

## Search Intelligence

`api/search-console.ts` supplies the Command Center Search Intelligence panel with live, read-only Google Search Console data for `planet-x.co`.

The panel includes:

- 7-day, 28-day, and 90-day finalized performance windows with equal-length previous-period comparisons
- clicks, impressions, CTR, and average position
- top queries and landing pages
- country, device, and search-appearance breakdowns
- a separately labeled partial 24-hour Search Console pulse
- business rollups for Store & Xupply, xFactor Music, Apps & Product Pages, and Guides & Free Resources
- tracked topic rollups for planet.X Brand, xFactor Music, Store & Product Discovery, and Chrome Extension Discovery
- a prioritized SEO opportunity queue for pages already receiving impressions
- direct URL Inspection results for priority pages
- submitted sitemap health

Finalized comparisons intentionally use settled Search Console data instead of treating the fresh 24-hour feed as final. Google credentials stay server-side and are never sent to the browser.

## Vercel setup

Create a separate Vercel project from the `xfactor21/Planetx` repository and set its Root Directory to `command-center`.

Backend-only environment variables:

- `PLANETX_ANALYTICS_INGEST_KEY`: optional Command Center write-proxy key
- `GOOGLE_INSIGHTS_CONFIG`: JSON containing `client_email`, `private_key`, `search_console_site_url`, and optionally `analytics_property_id`

Do not expose either variable with a `VITE_` prefix.

After the preview passes, assign `dashboard.planet-x.co` to this Vercel project. Keep the current AppDeploy custom domain active until the Vercel domain is ready.
