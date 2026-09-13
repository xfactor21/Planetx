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
    const trigger=C(c.bassPulse*p[0]+c.midPulse*p[1]+c.highPulse*p[2]+c.onsetPulse*p[3]+c.tonalPulse*p[4]+c.phrasePulse*p[5])
    const bar=C(c.barPulse*(.38+p[6]*.55))
    const phrase=C(c.phrasePulse*(.52+p[5]*.52))
    return{
      cue:{
        ...c,
        beatPulse:trigger*.68,
        barPulse:bar,
        phrasePulse:phrase,
        bassPulse:C(c.bassPulse*(.35+p[0]*.92)),
        midPulse:C(c.midPulse*(.35+p[1]*.92)),
        highPulse:C(c.highPulse*(.35+p[2]*.92)),
        onsetPulse:C(c.onsetPulse*(.25+p[3]*.9)),
        tonalPulse:C(c.tonalPulse*(.35+p[4]*.88)),
      },
      live:{
        ...l,
        bass:C(l.bass*(.42+p[0]*.76)),
        mid:C(l.mid*(.42+p[1]*.76)),
        treble:C(l.treble*(.42+p[2]*.76)),
        flux:C(l.flux*(.4+p[3]*.72)),
      }
    }
  }
  private score`

region = region.replace(personalityPattern, personality)
writeFileSync(regionPath, region)
console.log('Patched Visual.X v4.3.5 distinct instrument lanes per region')
