import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const regionPath = join(appDir, 'src', 'RegionConstellationSystem.ts')
let region = readFileSync(regionPath, 'utf8')

const personalityPattern = /private personality\(index:number,c:Cue,l:LiveFrame\)\{[\s\S]*?\}\n  private score/
if (!personalityPattern.test(region)) throw new Error('Visual.X v4.3.5 patch missing: v4.3.4 region personality')

const personality = `private personality(index:number,c:Cue,l:LiveFrame){
    // Each profile weights a wider musical vocabulary: bass, mids, highs, onset,
    // tonal change, phrase, bar, harmonic motion, build tension, motion/tempo,
    // section/story importance, and drop/release energy.
    const profiles=[
      [.95,.12,.08,.10,.18,.35,.44,.42,.62,.58,.72,.46], // Orbital: gravity / precession / large phrases
      [.16,1.00,.34,1.00,.16,.22,.76,.30,.44,.72,.58,.30], // Monoliths: piano-key stepping / waves
      [.10,1.00,.38,.78,.62,.64,.64,.70,.42,.50,.74,.28], // Ribbon: bend / braid / tonal breathing
      [.06,.30,1.00,.96,.70,.26,.54,.76,.38,.44,.58,.46], // Crystal: refract / propagate / fracture
      [.76,.08,.06,.08,.72,.76,.28,.78,.88,.30,.92,.62], // Singularity: pressure / pull / release
      [.90,.46,.10,.36,.20,.28,.72,.34,.64,.72,.66,.52], // Terrain: traveling low waves / uplift
      [.22,.72,.90,.82,.54,.42,.52,.62,.58,.66,.56,.44], // Plasma: flow / turbulence / arcs
      [.12,.86,.96,.74,.70,.48,.52,.78,.44,.54,.68,.30], // Neural Grove: signal growth / branch firing
      [.20,.78,.66,.54,.40,.76,.80,.50,.78,.92,.78,.34], // Tunnel: travel / acceleration / phrase shifts
      [.92,.20,.10,.22,.24,.56,.70,.42,.62,.68,.82,.50], // Megastructure: rotation / machinery / mass
      [.24,.52,.96,.98,.28,.30,.58,.54,.52,.78,.62,.88], // Fracture Desert: shatter / debris / impact
      [.14,.90,.74,.46,.68,.72,.58,.72,.44,.42,.74,.28], // Archipelago: lift / drift / harmonic rise
      [.16,1.00,.36,.96,.18,.26,.82,.38,.46,.86,.64,.34], // Causeway: piano/onset sequencing / chase
      [.10,.76,1.00,.82,.78,.62,.66,.76,.46,.58,.70,.38], // Chroma Reef: bloom / sparkle / color motion
      [.98,.16,.14,.24,.60,.62,.56,.86,.72,.50,.84,.58], // Gravity Garden: attraction / orbit / release
      [.10,.52,.96,.70,.86,.70,.54,.90,.36,.38,.66,.34], // Mirror Basin: reflection / phase / harmonic motion
      [.18,.96,.56,.90,.24,.32,.88,.42,.56,.88,.64,.44], // Pulse Bridge: sequence / travel / rhythmic structure
      [.10,.74,1.00,.84,.60,.52,.62,.74,.42,.64,.62,.36], // Signal Forest: flicker / scan / transmission
    ] as const
    const p=profiles[index%profiles.length]
    const harmonic=C(c.harmonicMotion)
    const build=C(c.buildPressure)
    const release=C(c.dropPulse)
    const motion=C((c.motionSpeed-.42)/1.23)
    const accel=C(Math.max(0,c.speedDelta)/.65)
    const decel=C(Math.max(0,-c.speedDelta)/.65)
    const story=C((c.section?.importance??0)*.68+(c.hero?.28:0)+c.phrasePulse*.18)
    const texture=C(l.flux*.54+l.level*.18+harmonic*.28)
    const tension=C(build*.56+harmonic*.24+accel*.22+story*.16)
    const lane=C(
      c.bassPulse*p[0]+c.midPulse*p[1]+c.highPulse*p[2]+c.onsetPulse*p[3]+
      c.tonalPulse*p[4]+c.phrasePulse*p[5]+c.barPulse*p[6]+harmonic*p[7]*.58+
      tension*p[8]*.46+motion*p[9]*.30+story*p[10]*.34+release*p[11]*.50
    )
    const motionGain=.92+p[9]*.34
    return{
      cue:{
        ...c,
        // Native motion stays dominant; these channels add region-specific musical causality.
        beatPulse:C(c.beatPulse*.92+lane*.48+texture*.10),
        barPulse:C(c.barPulse*.92+harmonic*p[7]*.18+tension*p[8]*.14),
        phrasePulse:C(c.phrasePulse*.94+story*p[10]*.26+decel*.08),
        bassPulse:C(c.bassPulse*(.88+p[0]*.52)+release*p[11]*.08),
        midPulse:C(c.midPulse*(.88+p[1]*.52)+harmonic*p[7]*.10),
        highPulse:C(c.highPulse*(.88+p[2]*.52)+texture*p[2]*.08),
        onsetPulse:C(c.onsetPulse*(.84+p[3]*.54)+accel*p[9]*.10),
        tonalPulse:C(c.tonalPulse*(.88+p[4]*.50)+harmonic*p[7]*.18),
        harmonicMotion:C(harmonic*(.90+p[7]*.48)+c.tonalPulse*p[4]*.08),
        buildPressure:C(build*(.92+p[8]*.42)+accel*p[9]*.10),
        dropPulse:C(release*(.92+p[11]*.48)+story*p[10]*.08),
        motionSpeed:Math.min(1.65,Math.max(.42,c.motionSpeed*motionGain+tension*.12+release*p[11]*.08)),
        speedDelta:Math.max(-.65,Math.min(.65,c.speedDelta*(.94+p[9]*.26)+release*.05-decel*.03)),
      },
      live:{
        ...l,
        bass:C(l.bass*(.90+p[0]*.42)+build*p[8]*.06),
        mid:C(l.mid*(.90+p[1]*.42)+harmonic*p[7]*.07),
        treble:C(l.treble*(.90+p[2]*.42)+texture*p[2]*.06),
        flux:C(l.flux*(.88+p[3]*.44)+accel*p[9]*.08),
        level:C(l.level*(.96+story*p[10]*.10)),
      }
    }
  }
  private score`

region = region.replace(personalityPattern, personality)
writeFileSync(regionPath, region)
console.log('Patched Visual.X v4.3.5 with expanded region motion variables and stronger native personality')
