export const dynamic = 'force-static'

export default async function AnalyticsBuildTestPage() {
  const key = process.env.PLANETX_ANALYTICS_KEY
  const ingestUrl = 'https://dashboard.planet-x.co/api/events'

  if (!key) throw new Error('ANALYTICS_VERIFY: PLANETX_ANALYTICS_KEY missing')

  const res = await fetch(ingestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-PlanetX-Analytics-Key': key,
    },
    body: JSON.stringify({
      event: 'page_view',
      timestamp: new Date().toISOString(),
      source_product: 'planet-x.co',
      source_surface: 'build-verification',
      session_id: 'planetx-build-verification',
      anonymous_user_id: 'planetx-build-verification',
      path: '/__analytics_build_verification__',
      platform: 'server',
      properties: { verification: true },
    }),
    cache: 'no-store',
  })

  const response = await res.text()
  if (!res.ok) throw new Error(`ANALYTICS_VERIFY: ingest ${res.status}: ${response.slice(0, 200)}`)

  console.log(`ANALYTICS_VERIFY: success ${res.status}: ${response.slice(0, 200)}`)
  return <main>analytics verification complete</main>
}
