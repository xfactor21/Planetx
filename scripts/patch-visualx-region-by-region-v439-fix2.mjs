import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const worldPath = join(appDir, 'src', 'worldModules.ts')
let world = readFileSync(worldPath, 'utf8')

const from = ',push=this.blast*(.12+i%7*.024),side=(secondary-.5)*.16,depth=(diagonal-.5)*.18;this.dummy.position.set(x*(1+push)+side,-2.2+h*.5+(reply-.5)*.09,z*(1+push)+depth);'
const to = ',push=this.blast*(.12+i%7*.024),sideDrift=(secondary-.5)*.16,depth=(diagonal-.5)*.18;this.dummy.position.set(x*(1+push)+sideDrift,-2.2+h*.5+(reply-.5)*.09,z*(1+push)+depth);'

if (!world.includes(from)) throw new Error('Visual.X v4.3.9 monolith side-drift repair target missing')
world = world.replace(from, to)
writeFileSync(worldPath, world)
console.log('Repaired Visual.X v4.3.9 monolith side-drift shadowing')
