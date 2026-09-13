import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const regionPath = join(appDir, 'src', 'RegionConstellationSystem.ts')
let region = readFileSync(regionPath, 'utf8')

const personalityPattern = /private personality\(index:number,c:Cue,l:LiveFrame\)\{[\s\S]*?\}\n  private score/
if (!personalityPattern.test(region)) throw new Error('Visual.X v4.3.5 patch missing: v4.3.4 region personality')

const personality = `private personality(index:number,c:Cue,l:LiveFrame){
    const profiles=[
      [.82,.10,.06,.08,.12,.22,.42], // Orbital System: low-end gravity + phrases
      [.12,.88,.26,.92,.08,.14,.72], // Neon Monoliths: mid/onset "keys"
      [.06,.92,.28,.72,.38,.42,.66], // Ribbon Cathedral: melodic mids + tonal movement
      [.05,.24,.96,.88,.46,.22,.58], // Crystal Lattice: highs/onsets + tonal sparkle
      [.58,.06,.04,.06,.48,.62,.24], // Singularity Void: slow bass/tonal pressure
      [.72,.34,.08,.28,.12,.18,.64], // Reactive Terrain: bass waves + structural bars
      [.16,.58,.76,.72,.34,.26,.52], // Plasma Ocean: mids/highs + flux
      [.08,.72,.88,.62,.46,.32,.54], // Neural Grove: melodic mids/highs
      [.16,.66,.58,.42,.24,.52,.76], // Dimensional Tunnel: mids + phrase travel
      [.78,.16,.08,.18,.14,.36,.64], // Megastructure Ring: bass + phrase rotation
      [.20,.42,.82,.88,.18,.20,.56], // Fracture Desert: transients/highs
      [.10,.78,.64,.38,.42,.54,.58], // Floating Archipelago: mids + tonal lift
      [.12,.92,.30,.86,.08,.16,.74], // Kinetic Causeway: piano-like mid/onset stepping
      [.08,.64,.92,.72,.52,.46,.62], // Chroma Reef: bright melodic motion
      [.84,.12,.12,.20,.38,.44,.56], // Gravity Garden: bass gravity + tonal pull
      [.08,.42,.86,.62,.58,.50,.48], // Mirror Basin: high/tonal reflections
      [.16,.86,.46,.80,.14,.18,.78], // Pulse Bridge: mid/onset sequencing
      [.08,.62,.94,.74,.34,.36,.60], // Signal Forest: high/mid signal flicker
    ] as const
    const p=profiles[index%profiles.length]
    const lane=C(c.bassPulse*p[0]+c.midPulse*p[1]+c.highPulse*p[2]+c.onsetPulse*p[3]+c.tonalPulse*p[4]+c.phrasePulse*p[5])
    const bar=C(c.barPulse*(.82+p[6]*.28))
    const phrase=C(c.phrasePulse*(.88+p[5]*.24))
    return{
      cue:{
        ...c,
        // Preserve each world's original animation energy; instrument lanes add character instead of replacing it.
        beatPulse:C(c.beatPulse*.82+lane*.42),
        barPulse:bar,
        phrasePulse:phrase,
        bassPulse:C(c.bassPulse*(.78+p[0]*.42)),
        midPulse:C(c.midPulse*(.78+p[1]*.42)),
        highPulse:C(c.highPulse*(.78+p[2]*.42)),
        onsetPulse:C(c.onsetPulse*(.72+p[3]*.46)),
        tonalPulse:C(c.tonalPulse*(.78+p[4]*.40)),
      },
      live:{
        ...l,
        bass:C(l.bass*(.82+p[0]*.34)),
        mid:C(l.mid*(.82+p[1]*.34)),
        treble:C(l.treble*(.82+p[2]*.34)),
        flux:C(l.flux*(.78+p[3]*.36)),
      }
    }
  }
  private score`

region = region.replace(personalityPattern, personality)
writeFileSync(regionPath, region)
console.log('Patched Visual.X v4.3.5 instrument lanes without suppressing native region animation')
