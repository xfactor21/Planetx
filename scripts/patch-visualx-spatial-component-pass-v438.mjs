import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const src = (...parts) => join(appDir, 'src', ...parts)

const replaceIn = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Visual.X v4.3.8 patch missing: ${label}`)
  return text.replace(from, to)
}

// WAVEFORM — restore a strong planet.X gradient, keep the icon gone, make the
// current song position obvious, and frame only a useful local section of the
// waveform (top + bottom visible) instead of either an extreme close-up or the
// entire 360-degree ring.
const wavePath = src('AudioWaveEntity.ts')
let wave = readFileSync(wavePath, 'utf8')
wave = replaceIn(
  wave,
  "const seam=Math.min(u,1-u),boost=seam<.014?(1-seam/.014)*.72:0;",
  "const seam=Math.min(u,1-u),boost=seam<.012?(1-seam/.012)*.92:0;",
  'pronounced narrow white progress seam',
)
wave = replaceIn(
  wave,
  "cameraCue(t:number,base:CameraCue):CameraCue{const p=this.samplePoint(t);if(!p)return base;const radial=new THREE.Vector3(p.x,0,p.z).normalize(),tangent=new THREE.Vector3(-radial.z,0,radial.x),tour=C((t%30)/3),pos=radial.multiplyScalar(-20.8).addScaledVector(tangent,1.8*Math.sin(tour*Math.PI));return{...base,x:pos.x,y:11.8,z:pos.z,focusX:0,focusY:this.centerY+.35,focusZ:0,fov:82,roll:0,damping:2.5,snap:false,shot:'reveal'}}",
  "cameraCue(t:number,base:CameraCue):CameraCue{const p=this.samplePoint(t);if(!p)return base;const radial=new THREE.Vector3(p.x,0,p.z).normalize(),tangent=new THREE.Vector3(-radial.z,0,radial.x),tour=C((t%30)/3),pos=radial.multiplyScalar(15.8).addScaledVector(tangent,1.35*Math.sin(tour*Math.PI));return{...base,x:pos.x,y:p.mid+4.6,z:pos.z,focusX:p.x,focusY:p.mid,focusZ:p.z,fov:69,roll:0,damping:2.8,snap:false,shot:'reveal'}}",
  'medium waveform framing',
)
wave = replaceIn(
  wave,
  'this.playheadPos.setXYZ(0,p.x,p.lo-.42,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+.42,p.z);',
  'this.playheadPos.setXYZ(0,p.x,p.lo-.78,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+.78,p.z);',
  'stronger white playhead sliver',
)
wave = replaceIn(
  wave,
  '(this.wave.material as THREE.LineBasicMaterial).opacity=.68+l.level*.12;',
  '(this.wave.material as THREE.LineBasicMaterial).opacity=.8+l.level*.1;',
  'restore saturated waveform presence',
)
writeFileSync(wavePath, wave)

// CONSTELLATION — keep regions safely inside the waveform boundary. Positions
// remain deterministic/randomized per slot, but use a much smaller inner-world
// radius and greater radial/vertical variation so regions do not sit on top of
// the waveform horizon.
const constellationPath = src('RegionConstellationSystem.ts')
let constellation = readFileSync(constellationPath, 'utf8')
constellation = replaceIn(
  constellation,
  "private anchorFor(i:number,n:number){const h=this.H(i*311+17),a=i/n*Math.PI*2+(((h&1023)/1023)-.5)*.12,r=19.5+(i%3)*3.1+(((h>>>10)&511)/511)*2,y=(i%3-1)*1.55+((((h>>>19)&255)/255)-.5)*1.05;return new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r)}",
  "private anchorFor(i:number,n:number){const h=this.H(i*311+17),j=this.H(i*977+53),a=i/n*Math.PI*2+(((h&1023)/1023)-.5)*.48,r=11.8+(((h>>>10)&1023)/1023)*5.8+((i%2)*.65),y=((((h>>>20)&255)/255)-.5)*4.8+((((j>>>9)&255)/255)-.5)*1.2;return new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r)}",
  'inner randomized region anchors',
)
writeFileSync(constellationPath, constellation)

// NATIVE LEGACY REGIONS — explicit component-level choreography for the two
// priority legacy structures. Shared/root movement is deliberately reduced.
const worldPath = src('worldModules.ts')
let world = readFileSync(worldPath, 'utf8')
world = replaceIn(
  world,
  "const phase=this.sweep-i*.34-row*.12,wave=.5+.5*Math.sin(phase),secondary=.5+.5*Math.sin(phase*.53+row*.62-col*.27),spark=.5+.5*Math.sin(phase*1.7+col*.88),accent=(i%4===0?1:.28),h=.52+.38*l.bass+1.72*this.heightEnergy*wave+1.05*l.mid*secondary+.72*l.treble*spark+.72*phrase*accent,push=this.blast*(.24+i%7*.045);",
  "const phase=this.sweep-i*.34-row*.12,wave=.5+.5*Math.sin(phase),secondary=.5+.5*Math.sin(phase*.53+row*.62-col*.27),spark=.5+.5*Math.sin(phase*1.7+col*.88),diagonal=.5+.5*Math.sin(this.sweep*.72-(row+col)*.58),role=i%4,accent=(role===0?1:role===2?.52:.22),noteGate=role===0?wave:role===1?secondary:role===2?diagonal:spark,h=.5+.24*l.bass+noteGate*(.78+1.05*l.mid)+wave*.42*this.heightEnergy+spark*(.18+.56*l.treble)+phrase*.58*accent,push=this.blast*(.17+i%7*.032);",
  'monolith independent voice roles',
)
world = replaceIn(
  world,
  "this.dummy.scale.set(1,h,1);const turn=this.sceneMode===1?Math.atan2(x,z):this.structuralTurn+Math.sin(phase*.22)*.045;",
  "const widthPulse=1+((i%3)-1)*.018*secondary;this.dummy.scale.set(widthPulse,h,1/widthPulse);const turn=this.sceneMode===1?Math.atan2(x,z)+(diagonal-.5)*.08:this.structuralTurn+(secondary-.5)*.1+(diagonal-.5)*.07;",
  'monolith independent tilt and width motion',
)
world = replaceIn(
  world,
  "this.root.rotation.y+=dt*(.012+l.mid*.025);",
  "this.root.rotation.y+=dt*(.004+l.mid*.009);",
  'further reduce monolith root motion',
)

world = replaceIn(
  world,
  "const wave=.5+.5*Math.sin(t*5-i*.18),scatter=this.fracture*(.35+(i%9)*.05);this.dummy.position.set(x*(1+scatter),y*(1+scatter),z*(1+scatter));const sc=.58+l.treble*.75+beat*wave*.75+phrase*(i%5===0?.7:.1);this.dummy.scale.setScalar(sc);this.dummy.rotation.set(t*.08+i*.03,t*(.12+l.mid*.5)+i*.05,bar*.5);",
  "const q=i/Math.max(1,this.count-1),front=.5+.5*Math.sin(t*(1.2+l.treble*1.35)-i*.23),counter=.5+.5*Math.sin(t*(.52+l.mid*.65)+i*.41),branch=.5+.5*Math.sin(t*.34+(i%11)*.67),scatter=this.fracture*(.2+(i%9)*.035),localScatter=scatter*(.35+.65*front);this.dummy.position.set(x*(1+localScatter)+(counter-.5)*.18,y*(1+localScatter)+(branch-.5)*.22,z*(1+localScatter)+(front-.5)*.16);const sc=.52+l.treble*.22+front*(.28+.5*l.treble)+counter*.18*l.mid+phrase*(i%7===0?.38:.06);this.dummy.scale.set(sc*(.92+.13*branch),sc*(.82+.28*front),sc*(.92+.13*counter));this.dummy.rotation.set(t*.035+i*.03+(branch-.5)*.32,t*(.05+l.mid*.16)+i*.05+(counter-.5)*.42,(front-.5)*.5+bar*.08);",
  'crystal propagation and independent facets',
)
world = replaceIn(
  world,
  "this.root.rotation.y+=dt*(.025+l.mid*.18);this.root.rotation.x=Math.sin(t*.07)*.1",
  "this.root.rotation.y+=dt*(.008+l.mid*.035);this.root.rotation.x=Math.sin(t*.045)*.035",
  'reduce crystal whole-region motion',
)
writeFileSync(worldPath, world)

// GENERATED REGIONS — strengthen independent component choreography in the
// two priority generated worlds without increasing whole-root motion.
const generatedPath = src('newRegions.ts')
let generated = readFileSync(generatedPath, 'utf8')
generated = replaceIn(
  generated,
  "const step=.5+.5*Math.sin(t*(1.35+l.mid*1.7)-i*.52),reply=.5+.5*Math.sin(t*(.72+l.treble*.9)+i*.31);y=-2+(.46+l.bass*.48+step*(.55+l.mid*.9)+reply*l.flux*.7)*.5;sy=.55+l.bass*.42+step*(.5+l.mid*.95)+beat*(i%7===0?.28:.03);rz=(step-.5)*.22+phrase*Math.sin(q*Math.PI*5)*.12",
  "const row=Math.floor(i/7),col=i%7,step=.5+.5*Math.sin(t*(1.25+l.mid*1.55)-i*.5),reply=.5+.5*Math.sin(t*(.68+l.treble*.82)+i*.31),diagonal=.5+.5*Math.sin(t*(.9+l.mid*.75)-(row+col)*.72),cluster=.5+.5*Math.sin(t*.42+(i%5)*1.1),voice=i%4===0?step:i%4===1?reply:i%4===2?diagonal:cluster;y=-2+(.42+l.bass*.24+voice*(.72+l.mid*.92)+reply*l.flux*.38)*.5;sy=.5+l.bass*.2+voice*(.62+l.mid*.82)+beat*(i%9===0?.16:.015);sx=.9+(diagonal-.5)*.16;sz=.9+(cluster-.5)*.14;rz=(voice-.5)*.28+phrase*Math.sin(q*Math.PI*5)*.09;rx=(reply-.5)*.1",
  'kinetic causeway independent row diagonal cluster voices',
)
generated = replaceIn(
  generated,
  "const signal=.5+.5*Math.sin(t*(1.5+l.treble*2.4)-row*.78-col*.52),echo=.5+.5*Math.sin(t*(.7+l.mid*1.1)+row*.41-col*.93);y=-2.2+(.62+l.treble*.38+signal*(.72+l.flux*.85)+echo*l.mid*.46)*.5;sy=.55+l.treble*.34+tonal*.28+signal*(.48+l.treble*.72);rz=(col-3)*.018*phrase+(signal-.5)*(.12+l.flux*.18);rx=(echo-.5)*.09",
  "const signal=.5+.5*Math.sin(t*(1.35+l.treble*2.05)-row*.82-col*.55),echo=.5+.5*Math.sin(t*(.62+l.mid*.95)+row*.44-col*.9),relay=.5+.5*Math.sin(t*(.86+l.mid*.6)-(row*7+col)*.31),grove=.5+.5*Math.sin(t*.28+row*.7);y=-2.2+(.56+l.treble*.2+signal*(.58+l.flux*.65)+relay*l.mid*.5)*.5;sy=.52+l.treble*.2+tonal*.22+signal*(.42+l.treble*.52)+relay*.26*l.mid;rz=(col-3)*.014*phrase+(signal-.5)*(.16+l.flux*.14)+(grove-.5)*.08;rx=(echo-.5)*.13;ry=(relay-.5)*.16",
  'signal forest relay sway and tip-wave choreography',
)
writeFileSync(generatedPath, generated)

console.log('Patched Visual.X v4.3.8 spatial separation, waveform framing, and priority component choreography')
