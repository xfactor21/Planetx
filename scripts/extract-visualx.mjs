import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root=process.cwd()
const zipPath=join(root,'Visual.X-09.08-v4-branding.zip')
const workDir=join(root,'.visualx-extract')
const appDir=join(workDir,'Visual.X-09.08-v4-branding')
const outputDir=join(root,'public','visual-x-app')

rmSync(workDir,{recursive:true,force:true})
rmSync(outputDir,{recursive:true,force:true})
mkdirSync(workDir,{recursive:true})
execFileSync('unzip',['-q',zipPath,'-d',workDir],{stdio:'inherit'})
execFileSync('node',[join(root,'scripts','patch-visualx-core.mjs'),appDir],{stdio:'inherit'})
execFileSync('node',[join(root,'scripts','patch-visualx-ui.mjs'),appDir],{stdio:'inherit'})
execFileSync('npm',['ci','--no-audit','--no-fund'],{cwd:appDir,stdio:'inherit'})
execFileSync('npm',['run','build'],{cwd:appDir,stdio:'inherit'})
const sourceDist=join(appDir,'dist')
if(!existsSync(join(sourceDist,'index.html')))throw new Error('Visual.X build did not produce dist/index.html')
mkdirSync(outputDir,{recursive:true})
cpSync(sourceDist,outputDir,{recursive:true})
rmSync(workDir,{recursive:true,force:true})
console.log('Visual.X rebuilt into public/visual-x-app')
