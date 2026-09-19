import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowUpRight, BarChart3, CircleAlert, Database,
  Eye, Gauge, Globe2, LayoutDashboard, Menu, Moon, MousePointerClick,
  Radio, RefreshCw, Search, Settings, Share2, ShoppingBag, Sparkles,
  Sun, TrendingUp, Users, X,
} from 'lucide-react'

type Range = '24h' | '7d' | '30d' | '90d' | 'all'
type View = 'overview' | 'search' | 'social' | 'store' | 'visualx' | 'apps' | 'activity' | 'system'
type Rank = { label: string; value: number }
type Point = { date: string; events?: number; visitors?: number; sessions?: number; pageViews?: number; primary?: number; secondary?: number }
type Pulse = { event: string; timestamp: string; path: string; platform: string; surface: string; label: string }
type StoreProduct = { label: string; views: number; clicks: number; launches: number; intentRate: number; purchases?: number; refunds?: number; purchaseRate?: number }
type Website = {
  source: string; status: string; fetchedAt: string; total: number; sampled?: boolean; trend: Point[]; pulse: Pulse[]
  traffic: { visitors: number; sessions: number; pageViews: number; topLandingPages: Rank[]; referrers: Rank[]; platforms: Rank[] }
  interest: { productViews: number; productClicks: number; betaCtaClicks: number; externalAppLaunches: number; visualXTraffic: number }
  conversion: { betaStarts: number; betaCompletions: number; waitlistJoins: number; conversionRate: number }
  music: { engagements: number; plays: number; completes: number; downloads: number }
  store: { storePageViews?: number; views: number; purchaseIntents: number; checkoutStarts?: number; externalLaunches: number; intentRate: number; purchases?: number; refunds?: number; grossRevenueCents?: number; refundedAmountCents?: number; netRevenueCents?: number; products: StoreProduct[] }
  events: Rank[]
}
type Visual = {
  source: string; status: string; fetchedAt: string; total: number; sampled?: boolean; counts: Record<string, number>; trend: Point[]; pulse: Pulse[]
  funnel: { started: number; generated: number; recorded: number; exported: number; shared: number; converted: number; referred: number }
}
type AppSummary = {
  source: string; status: string; total: number; trend: Point[]; pulse: Pulse[]
  traffic: { visitors: number; sessions: number; pageViews: number; topPages: Rank[]; platforms: Rank[] }
  events: Rank[]
}
type SearchRow = { label: string; clicks: number; impressions: number }
type IndexRow = { url: string; verdict: string; coverageState: string; indexingState?: string; pageFetchState?: string; robotsTxtState?: string; lastCrawlTime?: string | null }
type GoogleData = {
  source?: string; status: string; configured?: boolean; fetchedAt?: string; snapshotSource?: string; snapshotCapturedAt?: string
  searchConsole: { status: string; totals?: { clicks: number; impressions: number; ctr: number; position: number }; trend?: { date: string; clicks: number; impressions: number; ctr?: number; position?: number }[]; queries?: SearchRow[]; pages?: SearchRow[]; indexing?: IndexRow[] }
  analytics: { status: string; message?: string; totals?: { activeUsers: number; sessions: number; pageViews: number; events: number; revenue: number }; trend?: { date: string; users: number; sessions: number }[]; channels?: Rank[] }
}
type SocialNetwork = {
  network: string; status: string; connected: boolean; handle?: string | null
  summary?: Record<string, number>; trend?: Record<string, unknown>[]; content?: Record<string, unknown>[]; message?: string
}
type SocialData = {
  status: string; configured: boolean; provider: string; systemOfRecord?: string; range?: string; start?: string; fetchedAt?: string
  connections?: Record<string, { connected: boolean; handle: string | null }>; networks?: SocialNetwork[]; signals?: Record<string, unknown>[]; message?: string
}
type Config = {
  endpoint: string; configured: boolean; summaryAccess: string; commandCenterKeyAuthority: boolean; authAuthority?: string
  googleInsights?: boolean; googleSource?: string; socialInsights?: boolean; socialSource?: string
}

const productNames: Record<string, string> = {
  'voice-studio-x': 'Voice Studio X', studyhive: 'StudyHive', bdxm: 'bdXm', 'project-x': 'project.X',
  'xfactor-os': 'xFactor.OS', xmemoirs: 'xMemoirs', 'xos-nexus': 'xOS Nexus', xforge: 'xForge', xconnect: 'xConnect', 'xos-95': 'xOS 95',
}
const socialNames: Record<string, string> = { pinterest: 'Pinterest', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube', tiktok: 'TikTok' }
const socialOrder = ['pinterest', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube']
const viewLabels: Record<View, string> = { overview: 'Overview', search: 'Search', social: 'Social', store: 'Store', visualx: 'Visual.X', apps: 'Apps', activity: 'Live Pulse', system: 'System' }
const nav = [
  { group: 'Command', items: [['overview', 'Overview', LayoutDashboard], ['search', 'Search', Search], ['social', 'Social', Share2]] },
  { group: 'Products', items: [['store', 'Store', ShoppingBag], ['visualx', 'Visual.X', Sparkles], ['apps', 'Apps', Gauge]] },
  { group: 'Operations', items: [['activity', 'Live Pulse', Radio], ['system', 'System', Settings]] },
] as const
const ignoredActions = new Set(['page_view', 'pageview', 'session_engaged', 'app_error'])

const fmt = (value: number | undefined) => new Intl.NumberFormat().format(Number(value || 0))
const money = (cents: number | undefined) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(cents || 0) / 100)
const title = (value: string) => productNames[value] || value.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const socialTitle = (value: string) => socialNames[value] || title(value)
const humanEvent = (value: string) => value.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const pct = (a: number, b: number) => b ? Math.round((a / b) * 100) : 0
const getNum = (row: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const n = Number(row?.[key])
    if (Number.isFinite(n) && n !== 0) return n
  }
  return 0
}
const getText = (row: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = row?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}
function fromFor(range: Range) {
  if (range === 'all') return ''
  const d = new Date()
  if (range === '24h') d.setUTCHours(d.getUTCHours() - 24)
  else {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    d.setUTCDate(d.getUTCDate() - days + 1)
    d.setUTCHours(0, 0, 0, 0)
  }
  return d.toISOString()
}
async function getJson(path: string) {
  const response = await fetch(path, { cache: 'no-store' })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.error || payload?.message || `Request failed: ${response.status}`)
  return payload
}
function appActions(app: AppSummary) {
  return (app.events || []).reduce((sum, row) => sum + (ignoredActions.has(row.label) ? 0 : row.value), 0)
}
function socialValue(network: SocialNetwork | null | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = network?.summary?.[key]
    if (typeof value === 'number') return value
  }
  return 0
}

export default function CommandCenterPro() {
  const [view, setView] = useState<View>('overview')
  const [range, setRange] = useState<Range>('30d')
  const [site, setSite] = useState<Website | null>(null)
  const [visual, setVisual] = useState<Visual | null>(null)
  const [apps, setApps] = useState<AppSummary[]>([])
  const [google, setGoogle] = useState<GoogleData | null>(null)
  const [social, setSocial] = useState<SocialData | null>(null)
  const [config, setConfig] = useState<Config | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => localStorage.getItem('px-command-theme') === 'light' ? 'light' : 'dark')

  const load = async () => {
    setLoading(true)
    const from = fromFor(range)
    const q = from ? `?from=${encodeURIComponent(from)}` : ''
    const results = await Promise.allSettled([
      getJson(`/api/analytics/website${q}`),
      getJson(`/api/products/visualx/analytics${q}`),
      getJson(`/api/apps/analytics${q}`),
      getJson('/api/google/overview'),
      getJson(`/api/social?range=${range}`),
      getJson('/api/events/config'),
    ])
    const next: string[] = []
    if (results[0].status === 'fulfilled') setSite(results[0].value as Website); else { setSite(null); next.push('Website') }
    if (results[1].status === 'fulfilled') setVisual(results[1].value as Visual); else { setVisual(null); next.push('Visual.X') }
    if (results[2].status === 'fulfilled') setApps(((results[2].value as { apps?: AppSummary[] }).apps || [])); else { setApps([]); next.push('Apps') }
    if (results[3].status === 'fulfilled') setGoogle(results[3].value as GoogleData); else { setGoogle(null); next.push('Google') }
    if (results[4].status === 'fulfilled') setSocial(results[4].value as SocialData); else { setSocial(null); next.push('Social') }
    if (results[5].status === 'fulfilled') setConfig(results[5].value as Config); else { setConfig(null); next.push('System') }
    setErrors(next)
    setLoading(false)
  }

  useEffect(() => { void load() }, [range])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('px-command-theme', theme)
  }, [theme])

  const pulse = useMemo(() => [
    ...(site?.pulse || []).map(item => ({ ...item, source: 'Website' })),
    ...(visual?.pulse || []).map(item => ({ ...item, source: 'Visual.X' })),
    ...apps.flatMap(app => (app.pulse || []).map(item => ({ ...item, source: title(app.source) }))),
  ].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 40), [site, visual, apps])

  const currentLabel = viewLabels[view]
  const go = (next: View) => { setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <div className='cc-shell'>
    {menu && <button className='cc-scrim' aria-label='Close navigation' onClick={() => setMenu(false)} />}
    <aside className={`cc-rail ${menu ? 'open' : ''}`}>
      <div className='cc-brand'><div className='cc-x'>X</div><div><b>planet.X</b><span>Command Center / v3.1</span></div><button className='cc-close' onClick={() => setMenu(false)} aria-label='Close navigation'><X /></button></div>
      <nav className='cc-nav'>{nav.map(group => <div className='cc-nav-group' key={group.group}><small>{group.group}</small>{group.items.map(([id, label, Icon]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => go(id as View)}><Icon /><span>{label}</span></button>)}</div>)}</nav>
      <div className='cc-rail-foot'><div className='cc-health-line'><i className={site && visual ? 'live' : ''} /><span>{site && visual ? 'Core fabric online' : 'Core fabric degraded'}</span></div><small>aggregate-only · privacy-safe</small></div>
    </aside>

    <main className='cc-workspace'>
      <header className='cc-topbar'>
        <div className='cc-title'><button className='cc-menu' onClick={() => setMenu(true)} aria-label='Open navigation'><Menu /></button><div><span>planet.X / intelligence fabric</span><h1>{currentLabel}</h1></div></div>
        <div className='cc-actions'><div className='cc-ranges'>{(['24h', '7d', '30d', '90d', 'all'] as Range[]).map(value => <button key={value} className={range === value ? 'active' : ''} onClick={() => setRange(value)}>{value === 'all' ? 'ALL' : value.toUpperCase()}</button>)}</div><button className='cc-icon' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label='Toggle theme'>{theme === 'dark' ? <Sun /> : <Moon />}</button><button className='cc-refresh' onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? 'spin' : ''} /><span>Refresh</span></button></div>
      </header>

      {errors.length > 0 && <div className='cc-alert'><CircleAlert /><div><b>Partial data outage</b><span>{errors.join(', ')} could not be refreshed. Available sources remain live.</span></div><button onClick={() => void load()}>Retry</button></div>}

      {view === 'overview' && <Overview site={site} visual={visual} apps={apps} google={google} social={social} pulse={pulse} go={go} />}
      {view === 'search' && <SearchCenter google={google} />}
      {view === 'social' && <SocialCenter data={social} site={site} />}
      {view === 'store' && <StoreCenter site={site} />}
      {view === 'visualx' && <VisualCenter data={visual} />}
      {view === 'apps' && <AppsCenter apps={apps} />}
      {view === 'activity' && <ActivityCenter pulse={pulse} site={site} visual={visual} apps={apps} />}
      {view === 'system' && <SystemCenter config={config} site={site} visual={visual} apps={apps} google={google} social={social} />}

      <footer className='cc-footer'><span>planet.X analytics fabric</span><span>{site?.fetchedAt ? `ledger sync ${new Date(site.fetchedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'waiting for sync'}</span></footer>
    </main>
  </div>
}

function Overview({ site, visual, apps, google, social, pulse, go }: { site: Website | null; visual: Visual | null; apps: AppSummary[]; google: GoogleData | null; social: SocialData | null; pulse: (Pulse & { source: string })[]; go: (view: View) => void }) {
  const appEvents = apps.reduce((sum, app) => sum + app.total, 0)
  const socialCount = social?.networks?.filter(item => item.connected).length || 0
  return <>
    <section className='cc-hero'><div><div className='cc-eyebrow'>ECOSYSTEM INTELLIGENCE</div><h2>See the signal.<br /><em>Open the detail.</em></h2><p>First-party behavior, Google discovery, social performance, store intent and app telemetry in one operating view.</p><div className='cc-badges'><Status label='Website' on={Boolean(site)} /><Status label='Google' on={google?.searchConsole?.status === 'connected'} /><Status label={`Social ${socialCount ? `· ${socialCount}` : ''}`} on={social?.status === 'connected'} /><Status label={`${apps.length} app sources`} on={apps.length > 0} /></div></div><div className='cc-orbit'><div className='ring r1' /><div className='ring r2' /><div className='core'>X</div></div></section>
    <section className='cc-kpis'><Kpi icon={Users} label='Visitors' value={site ? fmt(site.traffic.visitors) : '—'} hint='unique anonymous users' /><Kpi icon={Search} label='Search impressions' value={google?.searchConsole?.totals ? fmt(google.searchConsole.totals.impressions) : '—'} hint={google?.searchConsole?.totals ? `${google.searchConsole.totals.clicks} clicks · pos ${google.searchConsole.totals.position}` : 'Google snapshot'} /><Kpi icon={MousePointerClick} label='Store intent' value={site ? fmt(site.store.purchaseIntents) : '—'} hint={site ? `${site.store.intentRate}% view → click` : 'No store data'} /><Kpi icon={Sparkles} label='Worlds created' value={visual ? fmt(visual.funnel.generated) : '—'} hint='Visual.X generated' /><Kpi icon={Activity} label='App events' value={fmt(appEvents)} hint={`${apps.length} instrumented sources`} /></section>
    <section className='cc-grid'><Panel wide eyebrow='FIRST-PARTY VELOCITY' title='Website visitors & sessions' action={() => go('activity')}><Trend points={site?.trend || []} keys={['visitors', 'sessions']} labels={['Visitors', 'Sessions']} /></Panel><Panel eyebrow='SEARCH' title='Organic discovery' action={() => go('search')}><SearchPreview google={google} /></Panel><Panel eyebrow='SOCIAL' title='Connected distribution' action={() => go('social')}><SocialPreview social={social} /></Panel><Panel eyebrow='PRODUCTS' title='Apps with activity' action={() => go('apps')}><RankList rows={apps.map(app => ({ label: title(app.source), value: app.total })).sort((a, b) => b.value - a.value).slice(0, 6)} empty='No app events in this window.' /></Panel><Panel eyebrow='NOW' title='Latest signals' action={() => go('activity')}><PulseList rows={pulse.slice(0, 6)} /></Panel></section>
  </>
}

function SearchCenter({ google }: { google: GoogleData | null }) {
  const [tab, setTab] = useState<'overview' | 'queries' | 'pages' | 'indexing'>('overview')
  const search = google?.searchConsole
  const rows = tab === 'queries' ? search?.queries || [] : tab === 'pages' ? search?.pages || [] : []
  const zeroClick = (search?.pages || []).filter(row => row.impressions >= 3 && row.clicks === 0).sort((a, b) => b.impressions - a.impressions).slice(0, 8)
  return <>
    <PageIntro kicker='ORGANIC DISCOVERY' title='Search intelligence' text='Current Google Search Console snapshot, crawl/indexing checks and GA4 status. Search Console data naturally settles a few days behind live traffic.' />
    <section className='cc-kpis'><Kpi icon={MousePointerClick} label='Clicks' value={search?.totals ? fmt(search.totals.clicks) : '—'} hint='Google Search' /><Kpi icon={Eye} label='Impressions' value={search?.totals ? fmt(search.totals.impressions) : '—'} hint='organic visibility' /><Kpi icon={TrendingUp} label='CTR' value={search?.totals ? `${search.totals.ctr}%` : '—'} hint='clicks ÷ impressions' /><Kpi icon={Gauge} label='Avg position' value={search?.totals ? String(search.totals.position) : '—'} hint='lower is better' /><Kpi icon={Users} label='GA4 users' value={google?.analytics?.totals ? fmt(google.analytics.totals.activeUsers) : '—'} hint={google?.analytics?.message || 'linked audience layer'} /></section>
    <Tabs values={['overview', 'queries', 'pages', 'indexing']} current={tab} onChange={value => setTab(value as typeof tab)} />
    {tab === 'overview' && <section className='cc-grid'><Panel wide eyebrow='SEARCH TREND' title='Clicks & impressions'><SearchTrend rows={search?.trend || []} /></Panel><Panel eyebrow='ZERO-CLICK OPPORTUNITY' title='Visible pages not earning clicks'><SearchRows rows={zeroClick} /></Panel><Panel eyebrow='GA4' title='Audience status'>{google?.analytics?.status === 'connected' ? <div className='cc-status-stack'><StatusRow label='GA4 connection' state='connected' /><StatusRow label='Sessions' value={fmt(google.analytics.totals?.sessions)} /><StatusRow label='Events' value={fmt(google.analytics.totals?.events)} /><StatusRow label='Page views' value={fmt(google.analytics.totals?.pageViews)} /></div> : <Empty text='GA4 is not currently returning data.' />}</Panel></section>}
    {(tab === 'queries' || tab === 'pages') && <Panel eyebrow={tab.toUpperCase()} title={tab === 'queries' ? 'Search queries' : 'Search landing pages'}><SearchRows rows={rows} expanded /></Panel>}
    {tab === 'indexing' && <Panel eyebrow='URL INSPECTION' title='Indexing & crawl state'><Indexing rows={search?.indexing || []} /></Panel>}
    <div className='cc-footnote'>Snapshot: {google?.snapshotSource || google?.source || 'Google bridge'}{google?.snapshotCapturedAt ? ` · captured ${new Date(google.snapshotCapturedAt).toLocaleString()}` : ''}</div>
  </>
}

function SocialCenter({ data, site }: { data: SocialData | null; site: Website | null }) {
  const ordered = socialOrder.map(name => data?.networks?.find(item => item.network === name)).filter(Boolean) as SocialNetwork[]
  const [selected, setSelected] = useState('instagram')
  useEffect(() => { if (ordered.length && !ordered.some(item => item.network === selected)) setSelected(ordered[0].network) }, [data])
  const current = ordered.find(item => item.network === selected) || ordered[0]
  const content = [...(current?.content || [])].sort((a, b) => contentScore(b) - contentScore(a)).slice(0, 12)
  const socialRefs = (site?.traffic.referrers || []).filter(row => /facebook|instagram|pinterest|tiktok|youtube|linkedin/i.test(row.label))
  return <>
    <PageIntro kicker='DISTRIBUTION INTELLIGENCE' title='Social command' text='Your connected social accounts, archived through the free Metricool MCP path and stored in your own Supabase analytics fabric.' />
    <section className='cc-network-grid'>{ordered.map(network => <button key={network.network} className={selected === network.network ? 'cc-network active' : 'cc-network'} onClick={() => setSelected(network.network)}><div><b>{socialTitle(network.network)}</b><span>{network.handle ? `@${network.handle.replace(/^@/, '')}` : 'connected'}</span></div><strong>{fmt(socialValue(network, 'views', 'impressions', 'reach'))}</strong><small>visibility signal</small></button>)}</section>
    {current ? <><section className='cc-kpis'><Kpi icon={Eye} label='Views / impressions' value={fmt(socialValue(current, 'views', 'impressions'))} hint={socialTitle(current.network)} /><Kpi icon={Users} label='Reach' value={fmt(socialValue(current, 'reach'))} hint='available reach' /><Kpi icon={Activity} label='Interactions' value={fmt(socialValue(current, 'interactions', 'reelInteractions'))} hint='engagement actions' /><Kpi icon={MousePointerClick} label='Clicks' value={fmt(socialValue(current, 'clicks', 'pinClicks', 'outboundClicks'))} hint='available click signal' /><Kpi icon={TrendingUp} label='Followers' value={fmt(socialValue(current, 'followers'))} hint={`+${fmt(socialValue(current, 'followersGained'))} gained`} /></section><section className='cc-grid'><Panel wide eyebrow={`${socialTitle(current.network).toUpperCase()} CONTENT`} title='Best available content signals'><ContentTable rows={content} /></Panel><Panel eyebrow='OWNED ATTRIBUTION' title='Social referrals to planet.X'><RankList rows={socialRefs} empty='No social referrer rows in this site window.' /></Panel><Panel eyebrow='CONNECTION' title='Provider state'><div className='cc-status-stack'><StatusRow label='Network' state={current.connected ? 'connected' : 'offline'} /><StatusRow label='Archive provider' value={data?.provider || '—'} /><StatusRow label='System of record' value={data?.systemOfRecord || '—'} /><StatusRow label='Window start' value={data?.start || '—'} /></div></Panel></section></> : <Empty text='No social archive rows are currently available.' />}
  </>
}

function StoreCenter({ site }: { site: Website | null }) {
  const store = site?.store
  return <>
    <PageIntro kicker='COMMERCE SIGNAL' title='Store command' text='Attention, purchase intent, launches and provider-confirmed commerce only. Clicks are never mislabeled as sales.' />
    <section className='cc-kpis'><Kpi icon={ShoppingBag} label='Store visits' value={store ? fmt(store.storePageViews) : '—'} hint='store page entries' /><Kpi icon={Eye} label='Product views' value={store ? fmt(store.views) : '—'} hint='catalog attention' /><Kpi icon={MousePointerClick} label='Purchase intent' value={store ? fmt(store.purchaseIntents) : '—'} hint={store ? `${store.intentRate}% view → click` : '—'} /><Kpi icon={ArrowUpRight} label='Checkout starts' value={store ? fmt(store.checkoutStarts) : '—'} hint='embedded Payhip checkout opened' /><Kpi icon={ShoppingBag} label='Confirmed purchases' value={store ? fmt(store.purchases) : '—'} hint='provider-confirmed only' /><Kpi icon={BarChart3} label='Net revenue' value={store ? money(store.netRevenueCents) : '—'} hint='confirmed commerce' /></section>
    <section className='cc-grid'><Panel wide eyebrow='PRODUCT INTENT' title='What people are opening'><ProductTable rows={store?.products || []} /></Panel><Panel eyebrow='STORE EVENTS' title='Behavior mix'><RankList rows={site?.events || []} empty='No store events in this window.' /></Panel><Panel eyebrow='COMMERCE INTEGRITY' title='What the dashboard will count'><div className='cc-copy'><p><b>Store visits</b> = entries to the Store front door.</p><p><b>Views</b> = product exposure.</p><p><b>Intent</b> = a purchase/install CTA click.</p><p><b>Checkout starts</b> = an embedded Payhip checkout opened.</p><p><b>Purchase</b> = only a provider-confirmed completed transaction.</p><p><b>Revenue</b> = only confirmed transaction totals, minus confirmed refunds.</p></div></Panel></section>
  </>
}

function VisualCenter({ data }: { data: Visual | null }) {
  const f = data?.funnel
  const steps = f ? [{ label: 'Generation started', value: f.started }, { label: 'World created', value: f.generated }, { label: 'Recorded', value: f.recorded }, { label: 'Exported', value: f.exported }, { label: 'Shared', value: f.shared }, { label: 'planet.X conversion', value: f.converted }] : []
  return <>
    <PageIntro kicker='CREATIVE PRODUCT' title='Visual.X intelligence' text='Real creation behavior from the shared analytics ledger: generation, remix, recording, export, sharing and conversion.' />
    <section className='cc-kpis'><Kpi icon={Sparkles} label='Generated worlds' value={f ? fmt(f.generated) : '—'} hint={f ? `${pct(f.generated, f.started)}% of starts` : '—'} /><Kpi icon={Radio} label='Recordings' value={f ? fmt(f.recorded) : '—'} hint='record completed' /><Kpi icon={ArrowUpRight} label='Exports' value={f ? fmt(f.exported) : '—'} hint='export completed' /><Kpi icon={Share2} label='Shares' value={f ? fmt(f.shared) : '—'} hint='share invoked' /><Kpi icon={Globe2} label='planet.X conversions' value={f ? fmt(f.converted) : '—'} hint='conversion signal' /></section>
    <section className='cc-grid'><Panel wide eyebrow='CREATION VELOCITY' title='Visual.X events over time'><Trend points={data?.trend || []} keys={['events', 'primary']} labels={['All events', 'Primary actions']} /></Panel><Panel eyebrow='FUNNEL' title='Creation pipeline'><Funnel steps={steps} /></Panel><Panel eyebrow='EVENTS' title='Behavior mix'><RankList rows={Object.entries(data?.counts || {}).map(([label, value]) => ({ label: humanEvent(label), value })).sort((a, b) => b.value - a.value)} empty='No Visual.X events in this window.' /></Panel></section>
  </>
}

function AppsCenter({ apps }: { apps: AppSummary[] }) {
  const [filter, setFilter] = useState('')
  const visible = apps.filter(app => title(app.source).toLowerCase().includes(filter.toLowerCase()))
  const [selected, setSelected] = useState(apps[0]?.source || '')
  useEffect(() => { if (!apps.some(app => app.source === selected)) setSelected(apps[0]?.source || '') }, [apps])
  const app = apps.find(item => item.source === selected) || apps[0]
  return <>
    <PageIntro kicker='PRODUCT TELEMETRY' title='App intelligence' text='Ten product sources share the same privacy-safe ledger. Open any app for traffic, pages, platforms, meaningful actions and recent activity.' />
    <div className='cc-filter'><Search /><input value={filter} onChange={event => setFilter(event.target.value)} placeholder='Filter apps…' /></div>
    <section className='cc-app-grid'>{visible.map(item => <button key={item.source} className={app?.source === item.source ? 'cc-app-card active' : 'cc-app-card'} onClick={() => setSelected(item.source)}><div><b>{title(item.source)}</b><span>{item.status}</span></div><strong>{fmt(item.total)}</strong><small>{fmt(item.traffic.visitors)} visitors · {fmt(appActions(item))} feature actions</small></button>)}</section>
    {app && <><section className='cc-kpis'><Kpi icon={Activity} label='Events' value={fmt(app.total)} hint={title(app.source)} /><Kpi icon={Users} label='Visitors' value={fmt(app.traffic.visitors)} hint='anonymous users' /><Kpi icon={Globe2} label='Sessions' value={fmt(app.traffic.sessions)} hint='sessions' /><Kpi icon={Eye} label='Page views' value={fmt(app.traffic.pageViews)} hint='screen / page views' /><Kpi icon={Gauge} label='Feature actions' value={fmt(appActions(app))} hint='excluding generic telemetry' /></section><section className='cc-grid'><Panel wide eyebrow='ACTIVITY TREND' title={`${title(app.source)} usage`}><Trend points={app.trend || []} keys={['visitors', 'pageViews']} labels={['Visitors', 'Page views']} /></Panel><Panel eyebrow='FEATURES' title='Meaningful actions'><RankList rows={(app.events || []).filter(row => !ignoredActions.has(row.label)).map(row => ({ ...row, label: humanEvent(row.label) }))} empty='Only baseline page/session telemetry is recorded so far.' /></Panel><Panel eyebrow='SURFACES' title='Top pages / screens'><RankList rows={app.traffic.topPages || []} empty='No page detail in this window.' /></Panel><Panel eyebrow='PLATFORMS' title='Device / platform mix'><RankList rows={app.traffic.platforms || []} empty='No platform detail in this window.' /></Panel><Panel eyebrow='RECENT' title='Latest app activity'><PulseList rows={(app.pulse || []).slice(0, 8).map(row => ({ ...row, source: title(app.source) }))} /></Panel></section></>}
  </>
}

function ActivityCenter({ pulse, site, visual, apps }: { pulse: (Pulse & { source: string })[]; site: Website | null; visual: Visual | null; apps: AppSummary[] }) {
  return <>
    <PageIntro kicker='LIVE LEDGER' title='Live pulse' text='Recent privacy-safe events across the public site, Visual.X and instrumented apps. No raw IP addresses are exposed.' />
    <section className='cc-kpis'><Kpi icon={Activity} label='Website events' value={site ? fmt(site.total) : '—'} hint='selected window' /><Kpi icon={Sparkles} label='Visual.X events' value={visual ? fmt(visual.total) : '—'} hint='selected window' /><Kpi icon={Database} label='App events' value={fmt(apps.reduce((sum, app) => sum + app.total, 0))} hint='all app sources' /></section>
    <Panel eyebrow='LATEST SIGNALS' title='Cross-product event stream'><PulseTable rows={pulse} /></Panel>
  </>
}

function SystemCenter({ config, site, visual, apps, google, social }: { config: Config | null; site: Website | null; visual: Visual | null; apps: AppSummary[]; google: GoogleData | null; social: SocialData | null }) {
  const liveApps = apps.filter(app => app.status === 'online').length
  return <>
    <PageIntro kicker='DATA FABRIC' title='System status' text='The dashboard reads aggregate summaries from the shared planet.X analytics fabric. Google and social use server-side bridge snapshots/archives.' />
    <section className='cc-grid'><Panel wide eyebrow='SOURCE HEALTH' title='Connections'><div className='cc-system-grid'><SourceCard name='Website ledger' state={site?.status || 'offline'} detail={site ? `${fmt(site.total)} events loaded` : 'unavailable'} /><SourceCard name='Visual.X ledger' state={visual?.status || 'offline'} detail={visual ? `${fmt(visual.total)} events loaded` : 'unavailable'} /><SourceCard name='Apps' state={liveApps > 0 ? 'online' : 'offline'} detail={`${liveApps}/${apps.length || 10} sources responding`} /><SourceCard name='Search Console' state={google?.searchConsole?.status || 'offline'} detail={google?.snapshotSource || 'Google bridge'} /><SourceCard name='GA4' state={google?.analytics?.status || 'offline'} detail={google?.analytics?.message || 'Google audience layer'} /><SourceCard name='Social archive' state={social?.status || 'offline'} detail={social?.provider || 'Metricool MCP archive'} /></div></Panel><Panel eyebrow='AUTHORITY' title='Bridge configuration'><div className='cc-status-stack'><StatusRow label='Summary access' value={config?.summaryAccess || '—'} /><StatusRow label='Key authority' value={config?.authAuthority || (config?.commandCenterKeyAuthority ? 'enabled' : 'disabled')} /><StatusRow label='Google source' value={config?.googleSource || '—'} /><StatusRow label='Social source' value={config?.socialSource || '—'} /></div></Panel><Panel eyebrow='PRIVACY' title='Data rules'><div className='cc-copy'><p>No raw IP addresses in the dashboard.</p><p>Session and anonymous IDs remain pseudonymous.</p><p>Commerce is not inferred from clicks.</p><p>Social data is aggregate/provider-derived, not private-message content.</p></div></Panel></section>
  </>
}

function PageIntro({ kicker, title, text }: { kicker: string; title: string; text: string }) { return <section className='cc-page-intro'><div className='cc-eyebrow'>{kicker}</div><h2>{title}</h2><p>{text}</p></section> }
function Status({ label, on }: { label: string; on: boolean }) { return <span className={on ? 'cc-status on' : 'cc-status'}><i />{label}</span> }
function Kpi({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint: string }) { return <article className='cc-kpi'><div className='cc-kpi-head'><Icon /><span>{label}</span></div><strong>{value}</strong><small>{hint}</small></article> }
function Panel({ eyebrow, title, children, action, wide }: { eyebrow: string; title: string; children: React.ReactNode; action?: () => void; wide?: boolean }) { return <section className={wide ? 'cc-panel wide' : 'cc-panel'}><header><div><span>{eyebrow}</span><h3>{title}</h3></div>{action && <button onClick={action} aria-label={`Open ${title}`}><ArrowUpRight /></button>}</header>{children}</section> }
function Empty({ text }: { text: string }) { return <div className='cc-empty'>{text}</div> }
function Tabs({ values, current, onChange }: { values: string[]; current: string; onChange: (value: string) => void }) { return <div className='cc-tabs'>{values.map(value => <button key={value} className={current === value ? 'active' : ''} onClick={() => onChange(value)}>{value}</button>)}</div> }
function RankList({ rows, empty }: { rows: Rank[]; empty?: string }) { if (!rows.length) return <Empty text={empty || 'No data in this window.'} />; const max = Math.max(...rows.map(row => row.value), 1); return <div className='cc-ranks'>{rows.slice(0, 10).map((row, index) => <div className='cc-rank' key={`${row.label}-${index}`}><div><span>{row.label}</span><b>{fmt(row.value)}</b></div><i><em style={{ width: `${Math.max(3, Math.round(row.value / max * 100))}%` }} /></i></div>)}</div> }
function Trend({ points, keys, labels }: { points: Point[]; keys: (keyof Point)[]; labels: string[] }) { if (!points.length) return <Empty text='No trend data in this window.' />; const values = points.flatMap(point => keys.map(key => Number(point[key] || 0))); const max = Math.max(...values, 1); return <div><div className='cc-legend'>{labels.map((label, i) => <span key={label}><i className={`series s${i + 1}`} />{label}</span>)}</div><div className='cc-bars'>{points.slice(-20).map((point, index) => <div className='cc-bar-group' key={`${point.date}-${index}`} title={point.date}>{keys.map((key, i) => <i key={String(key)} className={`series s${i + 1}`} style={{ height: `${Math.max(3, Number(point[key] || 0) / max * 100)}%` }} />)}</div>)}</div></div> }
function SearchTrend({ rows }: { rows: { date: string; clicks: number; impressions: number }[] }) { if (!rows.length) return <Empty text='No Search Console trend rows.' />; const max = Math.max(...rows.map(row => row.impressions), 1); return <div className='cc-search-trend'>{rows.map(row => <div key={row.date} title={`${row.date}: ${row.impressions} impressions / ${row.clicks} clicks`}><i style={{ height: `${Math.max(4, row.impressions / max * 100)}%` }} /><span>{row.clicks}</span></div>)}</div> }
function SearchRows({ rows, expanded }: { rows: SearchRow[]; expanded?: boolean }) { if (!rows.length) return <Empty text='No search rows available.' />; return <div className={expanded ? 'cc-search-rows expanded' : 'cc-search-rows'}>{rows.slice(0, expanded ? 100 : 8).map((row, index) => <div key={`${row.label}-${index}`}><span>{row.label}</span><b>{row.clicks} clicks</b><small>{row.impressions} impressions</small></div>)}</div> }
function Indexing({ rows }: { rows: IndexRow[] }) { if (!rows.length) return <Empty text='No URL inspection rows in the latest snapshot.' />; return <div className='cc-indexing'>{rows.map((row, index) => <article key={`${row.url}-${index}`}><div><b>{row.url.replace(/^https?:\/\/[^/]+/, '') || '/'}</b><span className={row.verdict === 'PASS' ? 'pass' : ''}>{row.verdict}</span></div><p>{row.coverageState}</p><small>{row.lastCrawlTime ? `Last crawl ${new Date(row.lastCrawlTime).toLocaleString()}` : 'No crawl timestamp'}</small></article>)}</div> }
function SearchPreview({ google }: { google: GoogleData | null }) { const s = google?.searchConsole; if (!s?.totals) return <Empty text='Google snapshot unavailable.' />; return <div className='cc-preview'><strong>{fmt(s.totals.impressions)}</strong><span>impressions</span><div><b>{fmt(s.totals.clicks)} clicks</b><b>{s.totals.ctr}% CTR</b><b>pos {s.totals.position}</b></div></div> }
function SocialPreview({ social }: { social: SocialData | null }) { const rows = social?.networks || []; if (!rows.length) return <Empty text='Social archive unavailable.' />; return <div className='cc-social-preview'>{socialOrder.map(name => rows.find(item => item.network === name)).filter(Boolean).map(item => <div key={item!.network}><span>{socialTitle(item!.network)}</span><b>{fmt(socialValue(item, 'views', 'impressions', 'reach'))}</b></div>)}</div> }
function PulseList({ rows }: { rows: (Pulse & { source: string })[] }) { if (!rows.length) return <Empty text='No recent events.' />; return <div className='cc-pulse-list'>{rows.map((row, index) => <div key={`${row.timestamp}-${index}`}><i /><div><b>{humanEvent(row.event)}</b><span>{row.source} · {row.path || '/'}</span></div><time>{new Date(row.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time></div>)}</div> }
function PulseTable({ rows }: { rows: (Pulse & { source: string })[] }) { if (!rows.length) return <Empty text='No recent events.' />; return <div className='cc-table'><div className='cc-table-head'><span>Time</span><span>Source</span><span>Event</span><span>Path / surface</span><span>Platform</span></div>{rows.map((row, index) => <div className='cc-table-row' key={`${row.timestamp}-${index}`}><span>{new Date(row.timestamp).toLocaleString()}</span><b>{row.source}</b><span>{humanEvent(row.event)}</span><span>{row.path || row.surface || '—'}</span><span>{row.platform || '—'}</span></div>)}</div> }
function Funnel({ steps }: { steps: { label: string; value: number }[] }) { if (!steps.length) return <Empty text='No funnel data.' />; const max = Math.max(...steps.map(step => step.value), 1); return <div className='cc-funnel'>{steps.map(step => <div key={step.label}><div><span>{step.label}</span><b>{fmt(step.value)}</b></div><i><em style={{ width: `${Math.max(3, step.value / max * 100)}%` }} /></i></div>)}</div> }
function ProductTable({ rows }: { rows: StoreProduct[] }) { if (!rows.length) return <Empty text='No product rows in this window.' />; return <div className='cc-product-table'><div className='head'><span>Product</span><span>Views</span><span>Intent</span><span>Launches</span><span>Purchases</span><span>Rate</span></div>{rows.slice(0, 30).map((row, index) => <div key={`${row.label}-${index}`}><b>{row.label}</b><span>{fmt(row.views)}</span><span>{fmt(row.clicks)}</span><span>{fmt(row.launches)}</span><span>{fmt(row.purchases)}</span><span>{row.intentRate}%</span></div>)}</div> }
function contentScore(row: Record<string, unknown>) { return getNum(row, 'views', 'impressions', 'reach') + getNum(row, 'likes') * 4 + getNum(row, 'comments') * 8 + getNum(row, 'shares') * 10 + getNum(row, 'saves') * 10 + getNum(row, 'clicks', 'link_clicks', 'outbound_clicks') * 12 }
function ContentTable({ rows }: { rows: Record<string, unknown>[] }) { if (!rows.length) return <Empty text='No content-level rows were archived for this network yet.' />; return <div className='cc-content-table'>{rows.map((row, index) => { const label = getText(row, 'title', 'content', 'post_text', 'caption', 'name') || `Content ${index + 1}`; const visibility = getNum(row, 'views', 'impressions', 'reach'); const engagement = getNum(row, 'interactions') || getNum(row, 'likes') + getNum(row, 'comments') + getNum(row, 'shares') + getNum(row, 'saves'); const clicks = getNum(row, 'clicks', 'link_clicks', 'outbound_clicks', 'pin_clicks'); return <article key={`${label}-${index}`}><div><b>{label}</b><small>{getText(row, 'published_at', 'created_at', 'metric_date')}</small></div><span>{fmt(visibility)} visibility</span><span>{fmt(engagement)} engagement</span><span>{fmt(clicks)} clicks</span></article> })}</div> }
function StatusRow({ label, value, state }: { label: string; value?: string; state?: string }) { return <div className='cc-status-row'><span>{label}</span><b className={state === 'connected' || state === 'online' ? 'good' : ''}>{value || state || '—'}</b></div> }
function SourceCard({ name, state, detail }: { name: string; state: string; detail: string }) { const ok = ['connected', 'online'].includes(state); return <article className='cc-source-card'><div><i className={ok ? 'good' : ''} /><b>{name}</b></div><span>{state}</span><small>{detail}</small></article> }
