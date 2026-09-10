import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const encodedPath = join(root, 'visualx-source-v4.3.tgz')
const workDir = join(root, '.visualx-build')
const archivePath = join(workDir, 'visualx-source.tgz')
const outputDir = join(root, 'public', 'visual-x-app')

rmSync(workDir, { recursive: true, force: true })
mkdirSync(workDir, { recursive: true })
const encoded = readFileSync(encodedPath, 'utf8').trim()
writeFileSync(archivePath, Buffer.from(encoded, 'base64'))
execFileSync('tar', ['-xzf', archivePath, '-C', workDir], { stdio: 'inherit' })
const appDir = join(workDir, 'app')
execFileSync('node', [join(root, 'scripts', 'patch-visualx-regions.mjs'), appDir], { stdio: 'inherit' })
execFileSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: appDir, stdio: 'inherit' })
execFileSync('npm', ['run', 'build'], { cwd: appDir, stdio: 'inherit', env: { ...process.env, APPDEPLOY_VITE_OUT_DIR: 'dist' } })
rmSync(outputDir, { recursive: true, force: true })
mkdirSync(outputDir, { recursive: true })
cpSync(join(appDir, 'dist'), outputDir, { recursive: true })
if (!existsSync(join(outputDir, 'index.html'))) throw new Error('Visual.X build did not produce index.html')
console.log('Visual.X built into public/visual-x-app')
