import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const regionPath = join(appDir, 'src', 'RegionConstellationSystem.ts')
let text = readFileSync(regionPath, 'utf8')

const importLine = "import { RegionVariationSystem } from './RegionVariationSystem';\n"
const stateFragment = ';private variation=new RegionVariationSystem();'
const applyFragment = ';this.variation.apply(s.world.root,s.seed,t,dt,c,l,i===this.focusSlot)'

if (!text.includes(importLine)) throw new Error('Visual.X motion recovery missing variation import')
if (!text.includes(stateFragment)) throw new Error('Visual.X motion recovery missing variation state')
if (!text.includes(applyFragment)) throw new Error('Visual.X motion recovery missing variation apply call')

text = text.replace(importLine, '')
text = text.replace(stateFragment, '')
text = text.replace(applyFragment, '')
writeFileSync(regionPath, text)

console.log('Restored native independent Visual.X region motion; shared transform overlay disabled')
