import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const stage = join(root, '.context-v13-build')
const sourceZip = join(stage, 'source.zip')
const sourceDir = join(stage, 'source')
const outDir = join(root, 'public', 'downloads')
const artifact = join(outDir, 'conteXt-v13-Chrome-Store.zip')

rmSync(stage, { recursive: true, force: true })
mkdirSync(stage, { recursive: true })
mkdirSync(outDir, { recursive: true })

const parts = [0,1,2,3].map(n => readFileSync(join(root, 'tools', 'context-v13-ci', `source.0${n}.b64`), 'utf8').trim())
writeFileSync(sourceZip, Buffer.from(parts.join(''), 'base64'))
mkdirSync(sourceDir, { recursive: true })
execFileSync('unzip', ['-q', sourceZip, '-d', sourceDir], { stdio: 'inherit' })
if (!existsSync(join(sourceDir, 'package.json'))) throw new Error('conteXt v13 source package did not reconstruct correctly')

execFileSync('npm', ['ci', '--include=dev', '--no-audit', '--no-fund'], { cwd: sourceDir, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development' } })
execFileSync('npm', ['run', 'build'], { cwd: sourceDir, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } })

const dist = join(sourceDir, 'dist')
if (!existsSync(join(dist, 'manifest.json')) || !existsSync(join(dist, 'index.html'))) throw new Error('conteXt v13 dist is incomplete')
rmSync(artifact, { force: true })
execFileSync('zip', ['-qr', artifact, '.'], { cwd: dist, stdio: 'inherit' })
console.log(`Built Chrome artifact: ${artifact}`)
