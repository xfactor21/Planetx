import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.argv[2] || process.cwd()
const zipPath = join(root, 'Visual.X-09.09-v4.2-site-ready.zip')
const workDir = join(root, '.visualx-analysis-work')
const appDir = join(workDir, 'v42_site_ready')
const outDir = join(root, 'visualx-analysis-cache')
const jsDir = join(workDir, 'compiled')

rmSync(workDir, { recursive: true, force: true })
mkdirSync(workDir, { recursive: true })
mkdirSync(outDir, { recursive: true })
execFileSync('unzip', ['-q', zipPath, '-d', workDir], { stdio: 'inherit' })
if (!existsSync(join(appDir, 'src', 'audioAnalysisCore.ts'))) throw new Error('Visual.X analyzer source missing')
execFileSync('npm', ['ci', '--include=dev', '--no-audit', '--no-fund'], { cwd: appDir, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development' } })
execFileSync('npx', ['tsc', 'src/audioAnalysis.ts', 'src/audioAnalysisCore.ts', '--target', 'ES2022', '--module', 'ES2022', '--moduleResolution', 'bundler', '--lib', 'ES2022,DOM', '--skipLibCheck', '--outDir', jsDir, '--noEmitOnError', 'false'], { cwd: appDir, stdio: 'inherit' })
const { analyzePCM } = await import(pathToFileURL(join(jsDir, 'audioAnalysisCore.js')).href)

const tracks = [
  ['digital-decay', join(root, 'public', 'music-tracks', 'digital-decay.mp3')],
  ['coming-down-that-hill', join(appDir, 'public', 'featured', 'coming-down-that-hill.mp3')],
  ['glitch-god', join(root, 'public', 'music-tracks', 'glitch-god.mp3')],
  ['ghost-in-the-machine', join(root, 'public', 'music-tracks', 'ghost-in-the-machine.mp3')],
  ['xs-in-my-head', join(appDir, 'public', 'featured', 'xs-in-my-head.mp3')],
]

for (const [id, input] of tracks) {
  if (!existsSync(input)) throw new Error(`Missing audio for ${id}: ${input}`)
  const raw = join(workDir, `${id}.f32le`)
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-ac', '1', '-ar', '44100', '-f', 'f32le', raw], { stdio: 'inherit' })
  const buf = readFileSync(raw)
  const samples = new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
  const duration = samples.length / 44100
  console.log(`Analyzing ${id} (${duration.toFixed(1)}s)`)
  const dna = analyzePCM(samples, 44100, duration)
  writeFileSync(join(outDir, `${id}.json`), JSON.stringify(dna))
  rmSync(raw, { force: true })
}

rmSync(workDir, { recursive: true, force: true })
console.log(`Generated ${tracks.length} Visual.X featured SongDNA caches in ${outDir}`)
