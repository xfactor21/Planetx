import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const zipPath = join(root, 'Visual.X-09.09-v4.2-site-ready.zip')
const workDir = join(root, '.visualx-extract')
const appDir = join(workDir, 'v42_site_ready')
const outputDir = join(root, 'public', 'visual-x-app')
const siteMusicDir = join(root, 'public', 'music-tracks')

rmSync(workDir, { recursive: true, force: true })
rmSync(outputDir, { recursive: true, force: true })
mkdirSync(workDir, { recursive: true })
execFileSync('unzip', ['-q', zipPath, '-d', workDir], { stdio: 'inherit' })
if (!existsSync(join(appDir, 'package.json'))) throw new Error('Visual.X v4.2 package root not found')

execFileSync('node', [join(root, 'scripts', 'patch-visualx-v42.mjs'), appDir], { stdio: 'inherit' })
execFileSync('node', [join(root, 'scripts', 'patch-visualx-v42-cache-runtime.mjs'), appDir], { stdio: 'inherit' })
execFileSync('node', [join(root, 'scripts', 'patch-visualx-regions.mjs'), appDir], { stdio: 'inherit' })
execFileSync('node', [join(root, 'scripts', 'patch-visualx-dynamic-regions-waveform.mjs'), appDir], { stdio: 'inherit' })
execFileSync('node', [join(root, 'scripts', 'patch-visualx-motion-waveform-polish.mjs'), appDir], { stdio: 'inherit' })
execFileSync('npm', ['ci', '--include=dev', '--no-audit', '--no-fund'], { cwd: appDir, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development' } })
execFileSync('npm', ['run', 'build'], { cwd: appDir, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } })

const sourceDist = join(appDir, 'dist')
if (!existsSync(join(sourceDist, 'index.html'))) throw new Error('Visual.X v4.2 build did not produce dist/index.html')
mkdirSync(outputDir, { recursive: true })
cpSync(sourceDist, outputDir, { recursive: true })

mkdirSync(siteMusicDir, { recursive: true })
cpSync(join(appDir, 'public', 'featured', 'coming-down-that-hill.mp3'), join(siteMusicDir, 'coming-down-that-hill.mp3'))
cpSync(join(appDir, 'public', 'featured', 'xs-in-my-head.mp3'), join(siteMusicDir, 'xs-in-my-head.mp3'))

rmSync(workDir, { recursive: true, force: true })
console.log('Visual.X v4.2 rebuilt with smoother layered motion and high-readability 360 waveform')
