import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const HEADER = 'X-PlanetX-Analytics-Key';
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

function constantTimeEqual(a: string, b: string) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(req) });
  if (req.method !== 'GET') return respond(req, { error: 'Method not allowed' }, 405);

  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') || '';

  if (mode === 'authorize') {
    const expected = Deno.env.get('PLANETX_ANALYTICS_KEY') || Deno.env.get('PLANETX_ANALYTICS_INGEST_KEY') || '';
    if (!expected) return respond(req, { error: 'Analytics key authority is not configured.' }, 503);
    const incoming = req.headers.get(HEADER) || '';
    if (!incoming || !constantTimeEqual(incoming, expected)) return respond(req, { error: 'Unauthorized' }, 401);
    return respond(req, { ok: true, authority: 'supabase-edge' });
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

  if (mode === 'health') return respond(req, { ok: true, bridge: 'planetx-command-center-bridge', version: 1 });
  return respond(req, { error: 'Not found' }, 404);
});
