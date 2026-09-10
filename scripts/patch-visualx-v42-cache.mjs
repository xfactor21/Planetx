import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const appPath = join(appDir, 'src', 'App.tsx')
const cssPath = join(appDir, 'src', 'index.css')
let app = readFileSync(appPath, 'utf8')
const replace = (from, to, label) => { if (!app.includes(from)) throw new Error(`Visual.X cache patch missing: ${label}`); app = app.replace(from, to) }

replace(
  "type FeaturedTrack = { id: string; title: string; artist: string; url: string };",
  "type FeaturedTrack = { id: string; title: string; artist: string; url: string };\ntype FeaturedCacheRecord={id:string;dna:SongDNA;cachedAt:number};\nconst FEATURED_CACHE_DB='visualx-featured-dna-v1';\nconst featuredAnalysisInflight=new Map<string,Promise<SongDNA>>();\nfunction openFeaturedDb(){return new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open(FEATURED_CACHE_DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('dna'))r.result.createObjectStore('dna',{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}\nasync function readFeaturedDNA(id:string){try{const db=await openFeaturedDb();return await new Promise<SongDNA|null>((resolve,reject)=>{const tx=db.transaction('dna','readonly'),r=tx.objectStore('dna').get(id);r.onsuccess=()=>resolve((r.result as FeaturedCacheRecord|undefined)?.dna||null);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close()})}catch{return null}}\nasync function writeFeaturedDNA(id:string,dna:SongDNA){try{const db=await openFeaturedDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction('dna','readwrite');tx.objectStore('dna').put({id,dna,cachedAt:Date.now()} satisfies FeaturedCacheRecord);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)});db.close()}catch{}}",
  'featured cache helpers',
)

replace(
  "  useEffect(() => { api.get('/api/catalog/status').then(r => setCatalogConfigured(Boolean(r.data?.configured))).catch(() => setCatalogConfigured(false)); }, []);",
  "  useEffect(() => { api.get('/api/catalog/status').then(r => setCatalogConfigured(Boolean(r.data?.configured))).catch(() => setCatalogConfigured(false)); }, []);\n  useEffect(()=>{let cancelled=false;const warm=async()=>{for(const item of featuredTracks){if(cancelled)break;if(await readFeaturedDNA(item.id))continue;if(featuredAnalysisInflight.has(item.id)){await featuredAnalysisInflight.get(item.id)?.catch(()=>null);continue}const task=(async()=>{const response=await fetch(item.url,{mode:'cors'});if(!response.ok)throw new Error('featured preload failed');const blob=await response.blob();const dna=await analyzeFile(new File([blob],`${item.id}.mp3`,{type:blob.type||'audio/mpeg'}));await writeFeaturedDNA(item.id,dna);return dna})();featuredAnalysisInflight.set(item.id,task);try{await task}catch{}finally{featuredAnalysisInflight.delete(item.id)}}};const id=window.setTimeout(()=>void warm(),700);return()=>{cancelled=true;window.clearTimeout(id)}},[]);",
  'background featured warmup',
)

replace(
  "  const chooseFeaturedTrack = async (item: FeaturedTrack) => {\n    const run = ++trackLoadRunRef.current; analysisRunRef.current++; setLoadingTrack(item.id); emit('song_selected', { song_source: 'featured', featured_track_id: item.id });\n    try {\n      setStatus(`Loading ${item.title}...`);\n      const downloaded = await fetch(item.url, { mode: 'cors' });\n      if (!downloaded.ok) throw new Error(`Audio download failed (${downloaded.status}).`);\n      const blob = await downloaded.blob(); if (run !== trackLoadRunRef.current) return;\n      await adoptFile(new File([blob], `${item.id}.mp3`, { type: blob.type || 'audio/mpeg' }), `${item.title} — ${item.artist}`, null, 'featured');\n      setFeaturedOpen(false);",
  "  const chooseFeaturedTrack = async (item: FeaturedTrack) => {\n    const run = ++trackLoadRunRef.current; analysisRunRef.current++; setLoadingTrack(item.id); emit('song_selected', { song_source: 'featured', featured_track_id: item.id });\n    try {\n      setStatus(`Loading ${item.title}...`);\n      const downloaded = await fetch(item.url, { mode: 'cors' });\n      if (!downloaded.ok) throw new Error(`Audio download failed (${downloaded.status}).`);\n      const blob = await downloaded.blob(); if (run !== trackLoadRunRef.current) return;\n      const cached=await readFeaturedDNA(item.id) || await featuredAnalysisInflight.get(item.id)?.catch(()=>null) || null;\n      if(cached){const {gid,wid}=createRun('featured');const url=URL.createObjectURL(blob);if(trackUrlRef.current)URL.revokeObjectURL(trackUrlRef.current);trackUrlRef.current=url;setDna(cached);setTrack({name:`${item.title} — ${item.artist}`,url,size:blob.size});setAnalysisReady(true);setDuration(cached.duration);setProgress(1);setStatus(`WORLD ${wid} ready · ${cached.sections.length} sections · ${cached.bpm} BPM`);emit('generation_completed',{generation_id:gid,world_id:wid,song_source:'featured',featured_track_id:item.id,analysis_cache:true});}\n      else{await adoptFile(new File([blob], `${item.id}.mp3`, { type: blob.type || 'audio/mpeg' }), `${item.title} — ${item.artist}`, null, 'featured');if(dna)void writeFeaturedDNA(item.id,dna)}\n      setFeaturedOpen(false);",
  'featured cached selection',
)

replace(
  "<canvas ref={canvasRef} className='h-full w-full' />{!track && <EntryHero",
  "<canvas ref={canvasRef} className='h-full w-full' />{track&&songSource==='featured'&&<div className='featuredCreditAlways'><strong>{track.name.replace(/ — xFactor$/i,'')}</strong><span>by xFactor</span></div>}{!track && <EntryHero",
  'persistent featured credit',
)

writeFileSync(appPath, app)
let css=readFileSync(cssPath,'utf8')
css += `\n.featuredCreditAlways{position:absolute;left:16px;top:16px;z-index:24;display:grid;gap:1px;pointer-events:none;border:1px solid rgba(255,255,255,.11);border-radius:12px;background:rgba(3,3,8,.58);padding:8px 11px;backdrop-filter:blur(10px);box-shadow:0 8px 32px rgba(0,0,0,.3)}.featuredCreditAlways strong{max-width:min(62vw,420px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:1.2;letter-spacing:.01em;color:#fff}.featuredCreditAlways span{font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#67e8f9}@media(max-width:640px){.featuredCreditAlways{left:10px;top:10px;padding:7px 9px}.featuredCreditAlways strong{max-width:58vw;font-size:11px}}\n`
writeFileSync(cssPath,css)
console.log('Patched Visual.X xFactor background DNA cache + persistent credit')
