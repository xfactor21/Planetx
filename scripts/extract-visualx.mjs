import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const zipPath = join(root, 'Visual.X-09.08-v4-branding.zip')
const workDir = join(root, '.visualx-extract')
const sourceDist = join(workDir, 'Visual.X-09.08-v4-branding', 'dist')
const outputDir = join(root, 'public', 'visual-x-app')

rmSync(workDir, { recursive: true, force: true })
rmSync(outputDir, { recursive: true, force: true })
mkdirSync(workDir, { recursive: true })
execFileSync('unzip', ['-q', zipPath, '-d', workDir], { stdio: 'inherit' })
if (!existsSync(join(sourceDist, 'index.html'))) throw new Error('Visual.X dist/index.html missing from source ZIP')
mkdirSync(outputDir, { recursive: true })
cpSync(sourceDist, outputDir, { recursive: true })
rmSync(workDir, { recursive: true, force: true })
console.log('Visual.X extracted to public/visual-x-app')
