import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(readFileSync(join(root, 'visualx-build-manifest.json'), 'utf8'))
const zipPath = join(root, manifest.sourceArchive)
const workDir = join(root, '.visualx-extract')
const appDir = join(workDir, 'v42_site_ready')
const outputDir = join(root, 'public', 'visual-x-app')
const siteMusicDir = join(root, 'public', 'music-tracks')

const archive = readFileSync(zipPath)
const gitBlobSha = createHash('sha1')
  .update(`blob ${archive.length}\0`)
  .update(archive)
  .digest('hex')

if (archive.length !== manifest.sourceArchiveBytes || gitBlobSha !== manifest.sourceArchiveGitBlobSha) {
  throw new Error('Visual.X source archive does not match the pinned build manifest')
}

rmSync(workDir, { recursive: true, force: true })
rmSync(outputDir, { recursive: true, force: true })
mkdirSync(workDir, { recursive: true })
execFileSync('unzip', ['-q', zipPath, '-d', workDir], { stdio: 'inherit' })
if (!existsSync(join(appDir, 'package.json'))) throw new Error('Visual.X package root not found')

for (const patch of manifest.patchOrder) {
  execFileSync('node', [join(root, 'scripts', patch), appDir], { stdio: 'inherit' })
}

execFileSync('npm', ['ci', '--include=dev', '--no-audit', '--no-fund'], {
  cwd: appDir,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
})
execFileSync('npm', ['run', 'typecheck'], {
  cwd: appDir,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
})
execFileSync('npm', ['run', 'build'], {
  cwd: appDir,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
})

const sourceDist = join(appDir, 'dist')
if (!existsSync(join(sourceDist, 'index.html'))) throw new Error('Visual.X build did not produce dist/index.html')
mkdirSync(outputDir, { recursive: true })
cpSync(sourceDist, outputDir, { recursive: true })

mkdirSync(siteMusicDir, { recursive: true })
cpSync(join(appDir, 'public', 'featured', 'coming-down-that-hill.mp3'), join(siteMusicDir, 'coming-down-that-hill.mp3'))
cpSync(join(appDir, 'public', 'featured', 'xs-in-my-head.mp3'), join(siteMusicDir, 'xs-in-my-head.mp3'))

rmSync(workDir, { recursive: true, force: true })
console.log(`${manifest.release} verified and rebuilt`)
