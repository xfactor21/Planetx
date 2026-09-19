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
const SOCIAL_CONNECTIONS = {
  pinterest: { connected: true, handle: 'planetXfactor' },
  facebook: { connected: true, handle: 'planet.X' },
  instagram: { connected: true, handle: 'xfactor_planet_x' },
  linkedin: { connected: true, handle: 'planet.X' },
  youtube: { connected: true, handle: 'planet.X' },
  tiktok: { connected: true, handle: 'planet.x.factor' },
} as const;
const SOCIAL_NETWORKS = Object.keys(SOCIAL_CONNECTIONS);

function headersFor(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://dashboard.planet-x.co';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': `Content-Type, ${HEADER}`,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

function socialRangeStart(value: string) {
  const key = value.toLowerCase();
  if (key === 'all') return '1970-01-01';
  const days = key === '24h' ? 2 : key === '7d' ? 7 : key === '90d' ? 90 : 30;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days + 1);
  return d.toISOString().slice(0, 10);
}

function numberValue(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function sum(rows: Record<string, unknown>[], key: string) {
  return rows.reduce((total, row) => total + numberValue(row[key]), 0);
}

function latest(rows: Record<string, unknown>[], key: string) {
  for (let i = rows.length - 1; i >= 0; i -= 1) {
    const value = rows[i]?.[key];
    if (value !== null && value !== undefined && numberValue(value) !== 0) return numberValue(value);
  }
  return rows.length ? numberValue(rows[rows.length - 1]?.[key]) : 0;
}

function summarizeSocial(network: string, rows: Record<string, unknown>[]) {
  const sorted = [...rows].sort((a, b) => String(a.metric_date || '').localeCompare(String(b.metric_date || '')));
  return {
    platform: network,
    impressions: sum(sorted, 'impressions'),
    views: sum(sorted, 'views'),
    reach: sum(sorted, 'reach'),
    interactions: sum(sorted, 'interactions'),
    clicks: sum(sorted, 'clicks') + sum(sorted, 'outbound_clicks'),
    likes: sum(sorted, 'likes'),
    comments: sum(sorted, 'comments'),
    shares: sum(sorted, 'shares'),
    saves: sum(sorted, 'saves'),
    followers: latest(sorted, 'followers'),
    followersGained: sum(sorted, 'followers_gained') + sum(sorted, 'follower_delta'),
    followersLost: sum(sorted, 'followers_lost'),
    posts: sum(sorted, 'posts_published'),
    profileViews: sum(sorted, 'profile_views'),
    reelViews: sum(sorted, 'reel_views'),
    reelInteractions: sum(sorted, 'reel_interactions'),
    accountsEngaged: sum(sorted, 'accounts_engaged'),
    watchMinutes: sum(sorted, 'watch_minutes'),
    pinClicks: sum(sorted, 'pin_clicks'),
    outboundClicks: sum(sorted, 'outbound_clicks'),
    engagement: latest(sorted, 'engagement'),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(req) });

  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') || '';

  if (mode === 'google-snapshot-write') {
    if (req.method !== 'POST') return respond(req, { error: 'Method not allowed' }, 405);
    const incoming = req.headers.get(HEADER) || '';
    const check = await verifyAgainstIngest(incoming);
    if (!check.ok) return respond(req, { error: check.status === 401 ? 'Unauthorized' : 'Analytics key authority unavailable.', authority: 'ingest-validation', reason: check.reason }, check.status);

    const body = await req.json().catch(() => null) as { source?: string; payload?: Record<string, unknown> } | null;
    if (!body?.payload || typeof body.payload !== 'object') return respond(req, { error: 'Valid snapshot payload required.' }, 400);

    const now = new Date().toISOString();
    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const source = String(body.source || 'direct-google-cron').slice(0, 80);
    const { error } = await client
      .from('google_insights_snapshots')
      .upsert({
        id: 'planet-x.co',
        source,
        captured_at: now,
        payload: body.payload,
        updated_at: now,
      }, { onConflict: 'id' });

    if (error) {
      console.error('Google insights snapshot write failed.', error);
      return respond(req, { error: 'Google insights snapshot write failed.' }, 500);
    }
    return respond(req, { ok: true, source, capturedAt: now, authority: check.reason });
  }

  if (req.method !== 'GET') return respond(req, { error: 'Method not allowed' }, 405);

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

  if (mode === 'social-overview') {
    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const rangeRaw = String(url.searchParams.get('range') || '30d').toLowerCase();
    const range = ['24h', '7d', '30d', '90d', 'all'].includes(rangeRaw) ? rangeRaw : '30d';
    const networkRaw = String(url.searchParams.get('network') || 'all').toLowerCase();
    const selected = networkRaw === 'all' ? SOCIAL_NETWORKS : SOCIAL_NETWORKS.includes(networkRaw) ? [networkRaw] : SOCIAL_NETWORKS;
    const start = socialRangeStart(range);

    const { data: daily, error } = await client
      .from('social_analytics_daily')
      .select('*')
      .eq('source', 'metricool_mcp')
      .gte('metric_date', start)
      .in('platform', selected)
      .order('metric_date', { ascending: true });
    if (error) {
      console.error('Social analytics snapshot read failed.', error);
      return respond(req, { status: 'error', configured: true, provider: 'Metricool MCP archive', message: 'Social analytics archive is unavailable.' }, 500);
    }

    const { data: content } = await client
      .from('social_content_metrics')
      .select('*')
      .eq('source', 'metricool_mcp')
      .in('platform', selected)
      .order('captured_at', { ascending: false })
      .limit(120);
    const { data: signals } = await client
      .from('social_trend_signals')
      .select('*')
      .in('platform', selected)
      .order('refreshed_at', { ascending: false })
      .limit(30);

    const networks = selected.map((network) => {
      const connection = (SOCIAL_CONNECTIONS as Record<string, { connected: boolean; handle: string }>)[network];
      const rows = (daily || []).filter((row: Record<string, unknown>) => row.platform === network);
      const items = (content || []).filter((row: Record<string, unknown>) => row.platform === network);
      return {
        network,
        status: 'connected',
        connected: true,
        handle: connection?.handle || null,
        summary: summarizeSocial(network, rows as Record<string, unknown>[]),
        trend: rows,
        content: items,
      };
    });

    return respond(req, {
      status: 'connected',
      configured: true,
      provider: 'Metricool MCP archive',
      systemOfRecord: 'Supabase',
      range,
      start,
      fetchedAt: new Date().toISOString(),
      connections: SOCIAL_CONNECTIONS,
      networks,
      signals: signals || [],
    });
  }

  if (mode === 'health') return respond(req, { ok: true, bridge: 'planetx-command-center-bridge', version: 4, authAuthority: 'ingest-validation', sources: ['first-party', 'google-snapshot', 'social-archive'] });
  return respond(req, { error: 'Not found' }, 404);
});
