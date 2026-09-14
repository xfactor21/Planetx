import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const worldPath = join(appDir, 'src', 'worldModules.ts')
let world = readFileSync(worldPath, 'utf8')
const from = 'const side=i<6?-1:1,row=i%6,const spireWave='
const to = 'const side=i<6?-1:1,row=i%6,spireWave='
if (!world.includes(from)) throw new Error('Visual.X v4.3.9 ribbon declaration repair target missing')
world = world.replace(from, to)
writeFileSync(worldPath, world)
console.log('Repaired Visual.X v4.3.9 ribbon declaration')
