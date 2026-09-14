import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const src = (...parts) => join(appDir, 'src', ...parts)

const replaceIn = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Visual.X v4.3.7 patch missing: ${label}`)
  return text.replace(from, to)
}

// WAVEFORM — the waveform is the subject, not the playhead ornament.
// Keep only a thin white playhead, frame the full ring from the opposite side,
// and use the color seam to communicate current song position.
const wavePath = src('AudioWaveEntity.ts')
let wave = readFileSync(wavePath, 'utf8')
wave = replaceIn(
  wave,
  'this.root.add(this.center,this.wave,this.playhead,this.glow,this.halo);',
  'this.root.add(this.center,this.wave,this.playhead);',
  'remove waveform marker ornaments',
)
wave = replaceIn(
  wave,
  "const seam=Math.min(u,1-u),boost=seam<.025?(1-seam/.025)*.32:0;",
  "const seam=Math.min(u,1-u),boost=seam<.014?(1-seam/.014)*.72:0;",
  'bright narrow waveform progress seam',
)
wave = replaceIn(
  wave,
  "cameraCue(t:number,base:CameraCue):CameraCue{const p=this.samplePoint(t);if(!p)return base;const radial=new THREE.Vector3(p.x,0,p.z).normalize(),tangent=new THREE.Vector3(-radial.z,0,radial.x),tour=C((t%30)/3),pos=radial.multiplyScalar(23.9).addScaledVector(tangent,1.25*Math.sin(tour*Math.PI));return{...base,x:pos.x,y:p.mid+2.7,z:pos.z,focusX:p.x,focusY:p.mid,focusZ:p.z,fov:52,roll:0,damping:3.1,snap:false,shot:'orbit'}}",
  "cameraCue(t:number,base:CameraCue):CameraCue{const p=this.samplePoint(t);if(!p)return base;const radial=new THREE.Vector3(p.x,0,p.z).normalize(),tangent=new THREE.Vector3(-radial.z,0,radial.x),tour=C((t%30)/3),pos=radial.multiplyScalar(-20.8).addScaledVector(tangent,1.8*Math.sin(tour*Math.PI));return{...base,x:pos.x,y:11.8,z:pos.z,focusX:0,focusY:this.centerY+.35,focusZ:0,fov:82,roll:0,damping:2.5,snap:false,shot:'reveal'}}",
  'wide waveform overview camera',
)
wave = replaceIn(
  wave,
  'this.playheadPos.setXYZ(0,p.x,p.lo-1.15,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+1.15,p.z);',
  'this.playheadPos.setXYZ(0,p.x,p.lo-.42,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+.42,p.z);',
  'thin white playhead sliver',
)
writeFileSync(wavePath, wave)

// WORLD MODULES — reduce whole-region motion and push the movement down into
// the individual components. The monolith grid now behaves like coordinated
// musical voices rather than one object bouncing together.
const worldPath = src('worldModules.ts')
let world = readFileSync(worldPath, 'utf8')
world = replaceIn(
  world,
  "const phase=this.sweep-i*.34-row*.12,wave=.5+.5*Math.sin(phase),accent=(i%4===0?1:.28),h=.58+1.8*l.bass+1.25*this.heightEnergy*wave+.82*phrase*accent+.16*l.mid*Math.sin(phase*.5),push=this.blast*(.32+i%7*.055);",
  "const phase=this.sweep-i*.34-row*.12,wave=.5+.5*Math.sin(phase),secondary=.5+.5*Math.sin(phase*.53+row*.62-col*.27),spark=.5+.5*Math.sin(phase*1.7+col*.88),accent=(i%4===0?1:.28),h=.52+.38*l.bass+1.72*this.heightEnergy*wave+1.05*l.mid*secondary+.72*l.treble*spark+.72*phrase*accent,push=this.blast*(.24+i%7*.045);",
  'independent monolith component envelopes',
)
world = replaceIn(
  world,
  "this.root.rotation.y+=dt*(.02+l.mid*.07+this.heightEnergy*.018);",
  "this.root.rotation.y+=dt*(.012+l.mid*.025);",
  'reduce monolith whole-region rotation',
)
writeFileSync(worldPath, world)

// GENERATED REGIONS — every element receives its own phase and subgroup role.
// This gives causeways, cone fields, gardens, mirrors, bridges and signal forests
// coordinated internal choreography rather than whole-region scale pulses.
const generatedPath = src('newRegions.ts')
let generated = readFileSync(generatedPath, 'utf8')

generated = replaceIn(
  generated,
  "y=-2+(.5+l.bass*1.8+beat*(i%5===0?1.1:.12))*.5;sy=.6+l.bass*1.5+beat*(i%5===0?.9:.08);rz=beat*Math.sin(q*Math.PI*5)*.34",
  "const step=.5+.5*Math.sin(t*(1.35+l.mid*1.7)-i*.52),reply=.5+.5*Math.sin(t*(.72+l.treble*.9)+i*.31);y=-2+(.46+l.bass*.48+step*(.55+l.mid*.9)+reply*l.flux*.7)*.5;sy=.55+l.bass*.42+step*(.5+l.mid*.95)+beat*(i%7===0?.28:.03);rz=(step-.5)*.22+phrase*Math.sin(q*Math.PI*5)*.12",
  'kinetic causeway note sequencing',
)

generated = replaceIn(
  generated,
  "y=-2.5+q*5+Math.sin(t*.4+i)*(.15+l.mid*.35);sy=.5+l.mid*1.8+tonal*.8;ry=a;rz=(i%2?1:-1)*.28",
  "const bloom=.5+.5*Math.sin(t*(.42+l.mid*.55)+i*.74),shimmer=.5+.5*Math.sin(t*(1.1+l.treble*1.8)-i*.43);y=-2.5+q*5+Math.sin(t*.35+i)*(.12+l.mid*.24)+bloom*.32;sy=.48+l.mid*.72+bloom*(.55+tonal*.78)+shimmer*l.treble*.34;ry=a+t*.035*(i%3===0?1:-1);rz=(i%2?1:-1)*(.18+.16*shimmer)",
  'chroma reef independent cone blooms',
)

generated = replaceIn(
  generated,
  "const sc=.6+l.bass*.5+beat*(i%4===0?.45:.08);sx=sy=sz=sc",
  "const orbitWave=.5+.5*Math.sin(t*(.55+l.mid*.65)-i*.58),gravity=.5+.5*Math.sin(t*.24+i*.37);const sc=.58+l.bass*.28+orbitWave*(.18+.34*beat)+gravity*phrase*.2;sx=sy=sz=sc",
  'gravity garden subgroup orbits',
)

generated = replaceIn(
  generated,
  "y=(k%7-3)*.42+Math.sin(t*.25+k)*.18;const sc=.65+l.treble*.65+tonal*.4;sx=sy=sz=sc;ry=t*.08*side+k*.13",
  "const glint=.5+.5*Math.sin(t*(1.2+l.treble*1.9)-k*.71),float=.5+.5*Math.sin(t*.31+k*.49);y=(k%7-3)*.42+(float-.5)*(.26+l.mid*.24);const sc=.58+l.treble*.26+tonal*.25+glint*(.18+l.treble*.42);sx=sy=sz=sc;ry=t*(.045+.07*glint)*side+k*.13;rz=(glint-.5)*.18",
  'mirror basin independent reflections',
)

generated = replaceIn(
  generated,
  "y=lane*(.75+Math.sin(a)*.3);sx=.8+beat*.55;sy=.8+phrase*.5;ry=a",
  "const travel=.5+.5*Math.sin(t*(1.05+l.mid*1.35)-qq*10.5+lane*.8),counter=.5+.5*Math.sin(t*.62+qq*7.2-lane);y=lane*(.75+Math.sin(a)*.3)+(travel-.5)*.48;sx=.72+travel*(.34+beat*.36);sy=.7+counter*(.22+phrase*.42);ry=a+(travel-.5)*.18",
  'pulse bridge traveling component wave',
)

generated = replaceIn(
  generated,
  "y=-2.2+(.7+l.treble*1.6+beat*(col===3?.8:.1))*.5;sy=.6+l.treble*1.4+tonal*.6;rz=(col-3)*.025*phrase",
  "const signal=.5+.5*Math.sin(t*(1.5+l.treble*2.4)-row*.78-col*.52),echo=.5+.5*Math.sin(t*(.7+l.mid*1.1)+row*.41-col*.93);y=-2.2+(.62+l.treble*.38+signal*(.72+l.flux*.85)+echo*l.mid*.46)*.5;sy=.55+l.treble*.34+tonal*.28+signal*(.48+l.treble*.72);rz=(col-3)*.018*phrase+(signal-.5)*(.12+l.flux*.18);rx=(echo-.5)*.09",
  'signal forest independent stalk choreography',
)

generated = replaceIn(
  generated,
  "this.root.rotation.y+=dt*(.012+l.mid*.05);this.root.rotation.z=Math.sin(t*.035+this.kind)*.025;",
  "this.root.rotation.y+=dt*(.006+l.mid*.014);this.root.rotation.z=Math.sin(t*.028+this.kind)*.012;",
  'reduce generated whole-region motion',
)
writeFileSync(generatedPath, generated)

console.log('Patched Visual.X v4.3.7 component choreography and waveform overview shot')
