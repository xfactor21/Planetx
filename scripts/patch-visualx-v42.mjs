import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')

const appPath = join(appDir, 'src', 'App.tsx')
const cssPath = join(appDir, 'src', 'index.css')
let app = readFileSync(appPath, 'utf8')

const replace = (from, to, label) => {
  if (!app.includes(from)) throw new Error(`Visual.X v4.2 patch missing: ${label}`)
  app = app.replace(from, to)
}

replace("{ id: 'coming-down-that-hill', title: 'Coming Down That Hill', artist: 'xFactor', url: './featured/coming-down-that-hill.mp3' }","{ id: 'coming-down-that-hill', title: 'Coming Down That Hill', artist: 'xFactor', url: 'https://www.planet-x.co/music-tracks/coming-down-that-hill.mp3' }",'Coming Down permanent URL')
replace("{ id: 'xs-in-my-head', title: 'Xs in My Head', artist: 'xFactor', url: './featured/xs-in-my-head.mp3' }","{ id: 'xs-in-my-head', title: 'Xs in My Head', artist: 'xFactor', url: 'https://www.planet-x.co/music-tracks/xs-in-my-head.mp3' }",'Xs permanent URL')
replace("  const [searchOpen, setSearchOpen] = useState(false);","  const [entryGateOpen, setEntryGateOpen] = useState(true);\n  const [searchOpen, setSearchOpen] = useState(false);",'entry gate state')
replace("/><input ref={fileRef} className='hidden' type='file' accept='audio/*' onChange={onFile} /><div className='appFrame'>","/><input ref={fileRef} className='hidden' type='file' accept='audio/*' onChange={onFile} />{entryGateOpen && !track && <div className='entryGateV42' role='dialog' aria-modal='true' aria-label='Choose music for Visual.X'><div className='entryGateCardV42'><p className='entryKicker'>VISUAL.X</p><h2>Choose your song</h2><p className='entryGateCopyV42'>Start with your own file, search the catalog, or jump straight into an xFactor track.</p><div className='entryGateChoicesV42'><button onClick={()=>{setEntryGateOpen(false);fileRef.current?.click();}}><Upload size={22}/><b>Upload your song</b><span>MP3 · WAV · M4A + more</span></button><button onClick={()=>{setEntryGateOpen(false);setSearchOpen(true);}}><Search size={22}/><b>Search for a song</b><span>Epidemic Sound catalog</span></button><button onClick={()=>{setEntryGateOpen(false);setFeaturedOpen(true);}}><Music2 size={22}/><b>xFactor songs</b><span>Five built-in tracks</span></button></div></div></div>}<div className='appFrame'>",'entry gate markup')

for (const needle of ['onClick={toggle}', '<Play', '<Pause', 'disabled={!ready', 'disabled={!track', 'ready &&', 'controlsVisible']) {
  const i = app.indexOf(needle)
  console.log(`VX_PLAY_SOURCE ${needle}:`, i >= 0 ? app.slice(Math.max(0, i - 900), Math.min(app.length, i + 2200)).replace(/\n/g, '\\n') : 'NOT_FOUND')
}

writeFileSync(appPath, app)
let css = readFileSync(cssPath, 'utf8')
css += `\n.entryGateV42{position:fixed;inset:0;z-index:140;display:grid;place-items:center;padding:18px;background:rgba(2,2,7,.92);backdrop-filter:blur(18px)}.entryGateCardV42{width:min(760px,100%);border:1px solid rgba(255,255,255,.11);border-radius:26px;padding:26px;background:radial-gradient(circle at 14% 0,rgba(255,78,205,.15),transparent 36%),radial-gradient(circle at 88% 0,rgba(59,233,255,.12),transparent 36%),linear-gradient(180deg,#0a0810,#05070c);box-shadow:0 30px 100px rgba(0,0,0,.68)}.entryGateCardV42 h2{margin:10px 0 7px;font-size:clamp(34px,6vw,58px);line-height:.96;font-weight:900;letter-spacing:-.04em}.entryGateCopyV42{margin:0 0 22px;color:rgba(255,255,255,.58);font-size:14px}.entryGateChoicesV42{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.entryGateChoicesV42 button{display:flex;min-height:142px;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:6px;border:1px solid rgba(255,255,255,.08);border-radius:19px;background:linear-gradient(145deg,rgba(255,78,205,.07),rgba(59,233,255,.04));padding:17px;color:white;text-align:left;transition:.18s}.entryGateChoicesV42 button:hover{transform:translateY(-2px);border-color:rgba(59,233,255,.35);background:linear-gradient(145deg,rgba(255,78,205,.13),rgba(59,233,255,.08))}.entryGateChoicesV42 b{font-size:15px}.entryGateChoicesV42 span{font-size:10px;color:rgba(255,255,255,.42)}@media(max-width:640px){.entryGateV42{padding:12px}.entryGateCardV42{padding:20px;border-radius:22px}.entryGateCardV42 h2{font-size:clamp(31px,10vw,44px)}.entryGateChoicesV42{grid-template-columns:1fr}.entryGateChoicesV42 button{min-height:88px}}\n`
writeFileSync(cssPath, css)
console.log('Patched Visual.X v4.2 production UX')