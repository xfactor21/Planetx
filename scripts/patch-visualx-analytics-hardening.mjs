import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X source directory is required')

const appPath = join(appDir, 'src', 'App.tsx')
const cssPath = join(appDir, 'src', 'index.css')
const packagePath = join(appDir, 'package.json')
let app = readFileSync(appPath, 'utf8')

function replace(label, before, after) {
  if (!app.includes(before)) throw new Error(`Visual.X hardening patch failed: ${label}`)
  app = app.replace(before, after)
}

replace('lazy engine type import', "import { VisualEngine } from './VisualEngine';", "import type { VisualEngine } from './VisualEngine';")
replace('engine fallback state', "  const [showOverlay, setShowOverlay] = useState(false);", "  const [showOverlay, setShowOverlay] = useState(false);\n  const [engineError, setEngineError] = useState('');")
replace(
  'canonical analytics envelope',
  "    const payload = { event, client_id: userId(), anonymous_user_id: userId(), session_id: sessionId(), timestamp: new Date().toISOString(), source_surface: 'visual-x-app', path: window.location.pathname || '/', platform: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop', generation_id: i.generationId, world_id: i.worldId, song_source: i.songSource, remix_parent_world_id: i.parentWorldId, referral_world_id: referralWorldRef.current, quality, ...fields };",
  "    const payload = { event, anonymous_user_id: userId(), session_id: sessionId(), timestamp: new Date().toISOString(), source_product: 'visual-x', source_surface: 'visual-x-app', path: \`${window.location.pathname}${window.location.search}\` || '/', platform: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop', properties: { generation_id: i.generationId, world_id: i.worldId, song_source: i.songSource, remix_parent_world_id: i.parentWorldId, referral_world_id: referralWorldRef.current, quality, ...fields } };",
)
replace(
  'initial page view',
  "    void api.post('/api/analytics', payload).catch(() => {});\n  };",
  "    void api.post('/api/analytics', payload).catch(() => {});\n  };\n  useEffect(() => { emit('visual_x_page_view'); }, []);",
)
replace(
  'WebGL-safe lazy engine',
  `  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new VisualEngine(canvas, visualSeed, quality);
    engine.setDiagnosticMode(diagnostics);
    engine.setPerformancePlan(planRef.current);
    engine.setSongProfile(dna ? dna.frames.map(f => f.energy) : [], dna?.duration || 0);
    engineRef.current = engine;
    const resize = () => engine.resize();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); engine.dispose(); engineRef.current = null; };
  }, [visualSeed, quality]);`,
  `  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let engine: VisualEngine | null = null;
    const resize = () => engine?.resize();
    const start = async () => {
      try {
        const { VisualEngine: Engine } = await import('./VisualEngine');
        if (disposed) return;
        engine = new Engine(canvas, visualSeed, quality);
        engine.setDiagnosticMode(diagnostics);
        engine.setPerformancePlan(planRef.current);
        engine.setSongProfile(dna ? dna.frames.map(f => f.energy) : [], dna?.duration || 0);
        engineRef.current = engine;
        setEngineError('');
        window.addEventListener('resize', resize);
      } catch {
        if (!disposed) setEngineError('Visual.X needs WebGL to render a world. Enable hardware acceleration or try a current browser.');
      }
    };
    void start();
    return () => { disposed = true; window.removeEventListener('resize', resize); engine?.dispose(); engineRef.current = null; };
  }, [visualSeed, quality]);`,
)
replace('version label', "<div className='prototypeVersion' aria-label='Visual.X version'>v4</div>", "<div className='prototypeVersion' aria-label='Visual.X version'>v4.3</div>")
replace(
  'visible engine fallback',
  "<canvas ref={canvasRef} className='h-full w-full' />",
  "<canvas ref={canvasRef} className='h-full w-full' />{engineError && <div className='engineFallback' role='status'><strong>Visual engine unavailable</strong><span>{engineError}</span></div>}",
)
replace('hide entry controls on engine failure', "{!track && <EntryHero", "{!track && !engineError && <EntryHero")

writeFileSync(appPath, app)

const css = readFileSync(cssPath, 'utf8')
const fallbackCss = ".engineFallback{position:absolute;inset:0;z-index:12;display:grid;place-content:center;gap:10px;padding:32px;text-align:center;background:radial-gradient(circle at 50% 35%,rgba(216,125,255,.16),transparent 38%),#050309;color:#fff}.engineFallback strong{font-size:clamp(20px,3vw,34px);letter-spacing:.04em;text-transform:uppercase}.engineFallback span{max-width:520px;color:#ffffffa8;font-size:14px;line-height:1.6}"
if (!css.includes('.engineFallback')) writeFileSync(cssPath, `${css}\n${fallbackCss}\n`)

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
packageJson.version = '4.3.0'
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)

console.log('Visual.X v4.3 analytics, loading, and WebGL fallback hardening applied')
