import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const HEADER = 'X-PlanetX-Analytics-Key';
const INGEST = 'https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-analytics-ingest';
const ALLOWED_ORIGINS = new Set([
  'https://dashboard.planet-x.co',
  'https://command-center-eta-one.vercel.app',
  'https://command-center-xfactor21s-projects.vercel.app',
  'https://planet-x.co',
  'https://www.planet-x.co',
]);

function headersFor(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://dashboard.planet-x.co';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': `Content-Type, ${HEADER}`,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'application/json',
    'Vary': 'Origin',
  };
}

function respond(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headersFor(req) });
}

async function verifyAgainstIngest(key: string) {
  if (!key) return { ok: false, status: 401, reason: 'missing' };
  try {
    const response = await fetch(INGEST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [HEADER]: key,
        'User-Agent': 'planetx-command-center-auth-probe/1.0',
      },
      body: JSON.stringify({
        event: 'x',
        source_product: 'planet-x.co',
        source_surface: 'auth-probe',
        session_id: 'auth-probe',
        anonymous_user_id: 'auth-probe',
        path: '/auth-probe',
        platform: 'server',
        properties: { synthetic: true, audit_probe: true },
      }),
    });
    const payload = await response.json().catch(() => ({})) as { error?: string };
    if (response.status === 400 && payload.error === 'Invalid event') return { ok: true, status: 200, reason: 'validated-by-ingest' };
    if (response.status === 401) return { ok: false, status: 401, reason: 'unauthorized' };
    return { ok: false, status: 502, reason: `ingest-${response.status}` };
  } catch {
    return { ok: false, status: 502, reason: 'ingest-unreachable' };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(req) });
  if (req.method !== 'GET') return respond(req, { error: 'Method not allowed' }, 405);

  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') || '';

  if (mode === 'authorize') {
    const incoming = req.headers.get(HEADER) || '';
    const check = await verifyAgainstIngest(incoming);
    if (!check.ok) return respond(req, { error: check.status === 401 ? 'Unauthorized' : 'Analytics key authority unavailable.', authority: 'ingest-validation', reason: check.reason }, check.status);
    return respond(req, { ok: true, authority: 'ingest-validation' });
  }

  if (mode === 'google-overview') {
    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data, error } = await client
      .from('google_insights_snapshots')
      .select('source,captured_at,payload')
      .eq('id', 'planet-x.co')
      .maybeSingle();

    if (error) {
      console.error('Google insights snapshot read failed.', error);
      return respond(req, { error: 'Google insights snapshot unavailable.' }, 500);
    }
    if (!data?.payload) {
      return respond(req, {
        status: 'setup_required',
        configured: false,
        source: 'snapshot-missing',
        searchConsole: { status: 'setup_required' },
        analytics: { status: 'setup_required' },
      });
    }

    const payload = data.payload as Record<string, unknown>;
    return respond(req, {
      ...payload,
      snapshotSource: data.source,
      snapshotCapturedAt: data.captured_at,
    });
  }

  if (mode === 'health') return respond(req, { ok: true, bridge: 'planetx-command-center-bridge', version: 2, authAuthority: 'ingest-validation' });
  return respond(req, { error: 'Not found' }, 404);
});
