import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const src = (...parts) => join(appDir, 'src', ...parts)

const replaceIn = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Visual.X v4.3.9 patch missing: ${label}`)
  return text.replace(from, to)
}

// ---------------------------------------------------------------------------
// SPATIAL COMPOSITION + WAVEFORM
// ---------------------------------------------------------------------------
const wavePath = src('AudioWaveEntity.ts')
let wave = readFileSync(wavePath, 'utf8')
wave = replaceIn(wave,
  "const seam=Math.min(u,1-u),boost=seam<.012?(1-seam/.012)*.92:0;",
  "const seam=Math.min(u,1-u),boost=seam<.014?(1-seam/.014)*1.08:0;",
  'stronger local playback seam',
)
wave = replaceIn(wave,
  'this.playheadPos.setXYZ(0,p.x,p.lo-.78,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+.78,p.z);',
  'this.playheadPos.setXYZ(0,p.x,p.lo-.98,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+.98,p.z);',
  'clearer white playhead without icon',
)
writeFileSync(wavePath, wave)

const constellationPath = src('RegionConstellationSystem.ts')
let constellation = readFileSync(constellationPath, 'utf8')
constellation = replaceIn(constellation,
  "private anchorFor(i:number,n:number){const h=this.H(i*311+17),j=this.H(i*977+53),a=i/n*Math.PI*2+(((h&1023)/1023)-.5)*.48,r=11.8+(((h>>>10)&1023)/1023)*5.8+((i%2)*.65),y=((((h>>>20)&255)/255)-.5)*4.8+((((j>>>9)&255)/255)-.5)*1.2;return new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r)}",
  "private anchorFor(i:number,n:number){const h=this.H(i*311+17),j=this.H(i*977+53),a=i/n*Math.PI*2+(((h&1023)/1023)-.5)*.62,r=7.8+(((h>>>10)&1023)/1023)*5.2+((i%2)*.45),y=((((h>>>20)&255)/255)-.5)*4.4+((((j>>>9)&255)/255)-.5)*1.15;return new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r)}",
  'deeper inner-world region placement',
)
constellation = replaceIn(constellation,
  "const fov=C((isBreak?71:57)+wide*13+c.onsetPulse*1.8-c.buildPressure*3.2,46,82),damping=wide>.2?2.7:4.8+c.motionSpeed*1.5;return{...base,x:pos.x,y:pos.y,z:pos.z,focusX:focus.x,focusY:focus.y,focusZ:focus.z,fov,roll:Math.sin(a*.42)*.018*(1-wide),damping,snap:false,shot:wide>.35?'reveal':'orbit'}}",
  "const pr=Math.hypot(pos.x,pos.z),maxR=20.2;if(pr>maxR){pos.x*=maxR/pr;pos.z*=maxR/pr}const fov=C((isBreak?71:57)+wide*13+c.onsetPulse*.45-c.buildPressure*3.2,46,82),damping=wide>.2?2.9:5.1+c.motionSpeed*1.25;return{...base,x:pos.x,y:pos.y,z:pos.z,focusX:focus.x,focusY:focus.y,focusZ:focus.z,fov,roll:Math.sin(a*.42)*.012*(1-wide),damping,snap:false,shot:wide>.35?'reveal':'orbit'}}",
  'camera stays inside waveform perimeter without beat breathing',
)
writeFileSync(constellationPath, constellation)

// ---------------------------------------------------------------------------
// LEGACY REGIONS 1-6
// ---------------------------------------------------------------------------
const worldPath = src('worldModules.ts')
let world = readFileSync(worldPath, 'utf8')

// 1 ORBITAL SYSTEM — independent planetary orbits, precession and ring motion.
world = replaceIn(world,
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){const targetEnergy=Math.min(1.35,l.bass*.62+beat*.24+phrase*.28+this.impulse*.2),targetBreath=Math.min(1.4,l.bass*.5+phrase*.42+this.impulse*.28);this.orbitEnergy+=(targetEnergy-this.orbitEnergy)*Math.min(1,dt*2.2);this.coreBreath+=(targetBreath-this.coreBreath)*Math.min(1,dt*2.8);this.precession+=(bar*.22+phrase*.3-this.precession)*Math.min(1,dt*1.35);this.core.scale.setScalar(1+this.coreBreath*.62+Math.sin(t*.82)*.035);this.core.rotation.y+=dt*(.16+l.mid*.86+this.orbitEnergy*.28);this.planets.forEach((m,i)=>{const r=(1.55+i*.48)*(1+l.bass*.12+this.orbitEnergy*.09),speed=(.075+i*.012)*(1+this.orbitEnergy*.52),a=t*speed*this.direction+i*1.37+this.precession*.18,tilt=(this.sceneMode-1)*.38;m.position.set(Math.cos(a)*r,Math.sin(a*(1+tilt))*r*(.22+.1*this.sceneMode),Math.sin(a)*r*.55);const breathe=1+l.bass*.26+Math.sin(t*.55+i*.8)*(.025+.03*this.orbitEnergy);m.scale.setScalar(breathe);m.rotation.y+=dt*(.18+l.mid*.72+this.orbitEnergy*.18);const rm=this.rings[i].material as THREE.MeshBasicMaterial;rm.opacity=.1+.1*bar+.16*phrase+.04*this.orbitEnergy;this.rings[i].rotation.z+=dt*(.012+.012*this.orbitEnergy)*this.direction});this.dust.rotation.y+=dt*(.018+l.treble*.06+this.orbitEnergy*.025)*this.direction;const rollTarget=this.precession*.18*Math.sin(t*.18);this.root.rotation.z+=(rollTarget-this.root.rotation.z)*Math.min(1,dt*1.8)}",
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){const targetEnergy=Math.min(1.28,l.bass*.5+beat*.12+phrase*.3+this.impulse*.16),targetBreath=Math.min(1.25,l.bass*.42+phrase*.38+this.impulse*.2);this.orbitEnergy+=(targetEnergy-this.orbitEnergy)*Math.min(1,dt*1.9);this.coreBreath+=(targetBreath-this.coreBreath)*Math.min(1,dt*2.2);this.precession+=(bar*.18+phrase*.34-this.precession)*Math.min(1,dt*1.15);this.core.scale.setScalar(1+this.coreBreath*.42+Math.sin(t*.58)*.025);this.core.rotation.y+=dt*(.13+l.mid*.62+this.orbitEnergy*.22);this.planets.forEach((m,i)=>{const local=.5+.5*Math.sin(t*(.31+i*.025)+i*.91),counter=.5+.5*Math.sin(t*(.17+i*.018)-i*.73),r=(1.55+i*.48)*(1+l.bass*.08+this.orbitEnergy*.055+(local-.5)*.035),speed=(.068+i*.011)*(1+this.orbitEnergy*.34),a=t*speed*this.direction+i*1.37+this.precession*(.08+i*.012),tilt=(this.sceneMode-1)*.38+(counter-.5)*.12;m.position.set(Math.cos(a)*r,Math.sin(a*(1+tilt))*r*(.2+.08*this.sceneMode)+(local-.5)*.14,Math.sin(a)*r*.55);m.scale.setScalar(1+l.bass*.14+(local-.5)*.05);m.rotation.x+=dt*(.025+i*.002);m.rotation.y+=dt*(.13+l.mid*.48+local*.08);const ring=this.rings[i],rm=ring.material as THREE.MeshBasicMaterial;rm.opacity=.09+.07*bar+.11*phrase+.05*local;ring.rotation.z+=dt*(.009+.008*counter)*this.direction;ring.rotation.y=(counter-.5)*.08;ring.rotation.x+=( ((i%2?.85:1.18)+(local-.5)*.08)-ring.rotation.x)*Math.min(1,dt*.8)});this.dust.rotation.y+=dt*(.014+l.treble*.045+this.orbitEnergy*.018)*this.direction;const rollTarget=this.precession*.09*Math.sin(t*.14);this.root.rotation.z+=(rollTarget-this.root.rotation.z)*Math.min(1,dt*1.35)}",
  'orbital independent planet and ring choreography',
)

// 2 NEON MONOLITHS — individual tower voices with local drift and no whole-grid pump.
world = replaceIn(world,
  "const phase=this.sweep-i*.34-row*.12,wave=.5+.5*Math.sin(phase),secondary=.5+.5*Math.sin(phase*.53+row*.62-col*.27),spark=.5+.5*Math.sin(phase*1.7+col*.88),diagonal=.5+.5*Math.sin(this.sweep*.72-(row+col)*.58),role=i%4,accent=(role===0?1:role===2?.52:.22),noteGate=role===0?wave:role===1?secondary:role===2?diagonal:spark,h=.5+.24*l.bass+noteGate*(.78+1.05*l.mid)+wave*.42*this.heightEnergy+spark*(.18+.56*l.treble)+phrase*.58*accent,push=this.blast*(.17+i%7*.032);this.dummy.position.set(x*(1+push),-2.2+h*.5,z*(1+push));const widthPulse=1+((i%3)-1)*.018*secondary;this.dummy.scale.set(widthPulse,h,1/widthPulse);const turn=this.sceneMode===1?Math.atan2(x,z)+(diagonal-.5)*.08:this.structuralTurn+(secondary-.5)*.1+(diagonal-.5)*.07;",
  "const phase=this.sweep-i*.34-row*.12,wave=.5+.5*Math.sin(phase),secondary=.5+.5*Math.sin(phase*.53+row*.62-col*.27),spark=.5+.5*Math.sin(phase*1.7+col*.88),diagonal=.5+.5*Math.sin(this.sweep*.72-(row+col)*.58),reply=.5+.5*Math.sin(this.sweep*.39+row*.83-col*.47),role=i%5,accent=(role===0?1:role===2?.52:.18),noteGate=role===0?wave:role===1?secondary:role===2?diagonal:role===3?reply:spark,h=.48+.18*l.bass+noteGate*(.82+.92*l.mid)+wave*.28*this.heightEnergy+spark*(.12+.42*l.treble)+phrase*.42*accent,push=this.blast*(.12+i%7*.024),side=(secondary-.5)*.16,depth=(diagonal-.5)*.18;this.dummy.position.set(x*(1+push)+side,-2.2+h*.5+(reply-.5)*.09,z*(1+push)+depth);const widthPulse=1+((i%3)-1)*.024*secondary;this.dummy.scale.set(widthPulse,h,1/widthPulse);const turn=this.sceneMode===1?Math.atan2(x,z)+(diagonal-.5)*.1:this.structuralTurn+(secondary-.5)*.12+(diagonal-.5)*.09+(reply-.5)*.05;",
  'monolith per-tower movement parameters',
)
world = replaceIn(world,
  "this.root.rotation.y+=dt*(.004+l.mid*.009);",
  "this.root.rotation.y+=dt*(.0015+l.mid*.0035);",
  'monolith root rotation nearly eliminated',
)

// 3 RIBBON CATHEDRAL — each ribbon/spire receives its own phase and counter-motion.
world = replaceIn(world,
  "h=.74+l.bass*.54+this.pulse*(i%3===0?.28:.1)+phrase*.2;this.dummy.position.set(side*(2.65+row*.55),-2.2+1.4*h,-.8-row*.72);this.dummy.scale.set(1,h,1);this.dummy.rotation.set(0,side*(.18+row*.07)+Math.sin(t*.15+i+this.bend*.3)*.04,side*.045);this.dummy.updateMatrix();this.spires.setMatrixAt(i,this.dummy.matrix)}this.spires.instanceMatrix.needsUpdate=true;this.core.position.y=.15+Math.sin(t*.24)*.22;this.core.scale.setScalar(.74+l.bass*.3+this.pulse*.18+phrase*.16+this.impulse*.08);this.core.rotation.x+=dt*(.09+l.mid*.38+this.bend*.08);this.core.rotation.y+=dt*(.13+l.treble*.58+this.flow*.006);",
  "const spireWave=.5+.5*Math.sin(this.flow*.92-row*.74+side*.8),counter=.5+.5*Math.sin(this.flow*.43+row*.91-side*.6),h=.72+l.bass*.34+spireWave*(.18+.28*this.pulse)+phrase*(row%3===0?.14:.035);this.dummy.position.set(side*(2.65+row*.55)+(counter-.5)*.2,-2.2+1.4*h+(spireWave-.5)*.12,-.8-row*.72+(counter-.5)*.16);this.dummy.scale.set(.94+.1*counter,h,.94+.08*spireWave);this.dummy.rotation.set((counter-.5)*.07,side*(.18+row*.07)+(spireWave-.5)*.12,side*.045+(counter-.5)*.08);this.dummy.updateMatrix();this.spires.setMatrixAt(i,this.dummy.matrix)}this.spires.instanceMatrix.needsUpdate=true;this.core.position.y=.15+Math.sin(t*.2)*.16;this.core.scale.setScalar(.76+l.bass*.22+this.pulse*.1+phrase*.1+this.impulse*.05);this.core.rotation.x+=dt*(.07+l.mid*.28+this.bend*.06);this.core.rotation.y+=dt*(.1+l.treble*.42+this.flow*.004);",
  'ribbon spire subgroup choreography',
)

// 4 CRYSTAL LATTICE — propagation through individual crystals, not root vibration.
world = replaceIn(world,
  "const q=i/Math.max(1,this.count-1),front=.5+.5*Math.sin(t*(1.2+l.treble*1.35)-i*.23),counter=.5+.5*Math.sin(t*(.52+l.mid*.65)+i*.41),branch=.5+.5*Math.sin(t*.34+(i%11)*.67),scatter=this.fracture*(.2+(i%9)*.035),localScatter=scatter*(.35+.65*front);this.dummy.position.set(x*(1+localScatter)+(counter-.5)*.18,y*(1+localScatter)+(branch-.5)*.22,z*(1+localScatter)+(front-.5)*.16);const sc=.52+l.treble*.22+front*(.28+.5*l.treble)+counter*.18*l.mid+phrase*(i%7===0?.38:.06);this.dummy.scale.set(sc*(.92+.13*branch),sc*(.82+.28*front),sc*(.92+.13*counter));this.dummy.rotation.set(t*.035+i*.03+(branch-.5)*.32,t*(.05+l.mid*.16)+i*.05+(counter-.5)*.42,(front-.5)*.5+bar*.08);",
  "const q=i/Math.max(1,this.count-1),front=.5+.5*Math.sin(t*(.95+l.treble*1.15)-i*.24-q*2.4),counter=.5+.5*Math.sin(t*(.43+l.mid*.58)+i*.41),branch=.5+.5*Math.sin(t*.28+(i%11)*.67),echo=.5+.5*Math.sin(t*.18-i*.17),scatter=this.fracture*(.16+(i%9)*.028),localScatter=scatter*(.25+.75*front);this.dummy.position.set(x*(1+localScatter)+(counter-.5)*.22,y*(1+localScatter)+(branch-.5)*.28+(echo-.5)*.12,z*(1+localScatter)+(front-.5)*.2);const sc=.5+l.treble*.15+front*(.24+.38*l.treble)+counter*.14*l.mid+phrase*(i%9===0?.28:.035);this.dummy.scale.set(sc*(.88+.18*branch),sc*(.78+.34*front),sc*(.88+.18*counter));this.dummy.rotation.set(t*.024+i*.03+(branch-.5)*.38,t*(.036+l.mid*.11)+i*.05+(counter-.5)*.48,(front-.5)*.56+(echo-.5)*.2+bar*.035);",
  'crystal local fracture and re-knit motion',
)
world = replaceIn(world,
  "this.root.rotation.y+=dt*(.008+l.mid*.035);this.root.rotation.x=Math.sin(t*.045)*.035",
  "this.root.rotation.y+=dt*(.002+l.mid*.009);this.root.rotation.x=Math.sin(t*.035)*.014",
  'crystal root motion minimized',
)

// 5 SINGULARITY VOID — ring families precess independently; the hole stays stable.
world = replaceIn(world,
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){this.suck*=Math.exp(-3*dt);this.disk.rotation.y+=dt*(.12+l.mid*.5);this.disk.rotation.z+=dt*.035;this.rings.forEach((r,i)=>{const pulse=1+beat*.12*Math.sin(i*.9+1.2)+phrase*.18+this.suck*.15;r.scale.setScalar(pulse);r.rotation.z+=dt*(.012+i*.004)*(i%2?1:-1);(r.material as THREE.MeshBasicMaterial).opacity=.08+.16*l.treble+.18*bar*(i%3===0?1:.2)});this.hole.scale.setScalar(1+l.bass*.08+this.impulse*.04);this.root.rotation.x=.08*Math.sin(t*.1)}",
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){this.suck*=Math.exp(-3*dt);this.disk.rotation.y+=dt*(.09+l.mid*.34);this.disk.rotation.z+=dt*(.018+l.treble*.018);this.rings.forEach((r,i)=>{const wave=.5+.5*Math.sin(t*(.28+i*.018)-i*.74),counter=.5+.5*Math.sin(t*.17+i*.53),rad=1+(wave-.5)*(.045+.045*this.suck)+phrase*(i%3===0?.035:.008);r.scale.set(rad,1+(counter-.5)*.055,1);r.position.y=(wave-.5)*.1;r.rotation.x=1.18+(i-4)*.035+(counter-.5)*.055;r.rotation.z+=dt*(.008+i*.0025)*(i%2?1:-1)*(1+.25*this.suck);(r.material as THREE.MeshBasicMaterial).opacity=.075+.12*l.treble+.09*bar*(i%3===0?1:.22)+.05*wave});this.hole.scale.setScalar(1+l.bass*.035+this.impulse*.02);this.root.rotation.x=.025*Math.sin(t*.07)}",
  'singularity independent ring precession',
)

// 6 REACTIVE TERRAIN — local ridges and wavefronts travel across the mesh.
world = replaceIn(world,
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){this.shock*=Math.exp(-3.5*dt);const pos=this.geom.getAttribute('position')as THREE.BufferAttribute;for(let i=0;i<pos.count;i++){const x=this.baseX[i],y=this.baseY[i],rad=Math.sqrt(x*x+y*y),base=this.sceneMode===0?Math.sin(x*.8+t*.6)+Math.cos(y*.7-t*.4):this.sceneMode===1?Math.sin(rad*1.25-t*1.8):Math.sin(x*.55+y*.72+t)*Math.cos(y*.34-t*.7),wave=base*(.18+l.mid*.58)+Math.sin(rad*2.3-t*7)*beat*.48+Math.sin(rad*1.4-t*5)*this.shock*.75+phrase*.25*Math.sin(x*1.8+t);pos.setZ(i,wave)}pos.needsUpdate=true;this.sun.scale.setScalar(.85+l.bass*.8+beat*.45+phrase*.55);this.sun.rotation.y+=dt*(.2+l.treble);(this.terrain.material as THREE.MeshBasicMaterial).opacity=.24+.3*l.treble+.18*bar}",
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){this.shock*=Math.exp(-3.5*dt);const pos=this.geom.getAttribute('position')as THREE.BufferAttribute;for(let i=0;i<pos.count;i++){const x=this.baseX[i],y=this.baseY[i],rad=Math.sqrt(x*x+y*y),base=this.sceneMode===0?Math.sin(x*.72+t*.42)+Math.cos(y*.64-t*.31):this.sceneMode===1?Math.sin(rad*1.12-t*1.1):Math.sin(x*.5+y*.66+t*.62)*Math.cos(y*.3-t*.45),front=.5+.5*Math.sin(rad*1.45-t*(1.25+l.bass*1.1)+x*.08),ridge=.5+.5*Math.sin(x*.92-y*.48+t*(.35+l.mid*.55)),shockWave=Math.sin(rad*1.35-t*3.6)*this.shock;const wave=base*(.14+l.mid*.38)+(front-.5)*(.2+l.bass*.5)+(ridge-.5)*(.12+l.mid*.28)+shockWave*.42+phrase*.12*Math.sin(x*1.35+t*.55);pos.setZ(i,wave)}pos.needsUpdate=true;this.sun.scale.setScalar(.9+l.bass*.28+phrase*.18);this.sun.position.y=1.6+Math.sin(t*.18)*.18;this.sun.rotation.y+=dt*(.12+l.treble*.55);(this.terrain.material as THREE.MeshBasicMaterial).opacity=.25+.26*l.treble+.1*bar}",
  'terrain traveling local deformation',
)
writeFileSync(worldPath, world)

// ---------------------------------------------------------------------------
// EXPANDED REGIONS 7-12
// ---------------------------------------------------------------------------
const expandedPath = src('expandedWorlds.ts')
let expanded = readFileSync(expandedPath, 'utf8')

// 7 PLASMA OCEAN — layered currents, independent bubbles and local crests.
expanded = replaceIn(expanded,
  "private run(t:number,l:LiveFrame,c?:Cue){const p=this.g.getAttribute('position')as THREE.BufferAttribute;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),r=Math.hypot(x,y),z=Math.sin(x*.75+t*(.7+l.mid))* (.18+l.mid*.7)+Math.cos(y*.58-t*.52)*(.14+l.bass*.55)+Math.sin(r*1.6-t*2.8)*(c?.beatPulse||0)*.35;p.setZ(i,z)}p.needsUpdate=true;for(let i=0;i<44;i++){const a=i*.91+t*(.05+l.mid*.08),r=1.7+(i%9)*.55;this.d.position.set(Math.cos(a)*r,-1.25+((i*1.73+t*(.15+l.treble*.25))%5),Math.sin(a)*r);this.d.scale.setScalar(.6+l.treble*.9+(c?.onsetPulse||0)*.4);this.d.updateMatrix();this.bubbles.setMatrixAt(i,this.d.matrix)}this.bubbles.instanceMatrix.needsUpdate=true}",
  "private run(t:number,l:LiveFrame,c?:Cue){const p=this.g.getAttribute('position')as THREE.BufferAttribute;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),r=Math.hypot(x,y),currentA=Math.sin(x*.68+t*(.48+l.mid*.55))*(.16+l.mid*.48),currentB=Math.cos(y*.54-t*.36+x*.08)*(.12+l.bass*.34),crest=Math.sin(r*1.25-t*(1.05+l.bass*.8)+x*.12)*(.08+(c?.barPulse||0)*.18),cross=Math.sin(x*.32+y*.41+t*.29)*(.05+l.flux*.18);p.setZ(i,currentA+currentB+crest+cross)}p.needsUpdate=true;for(let i=0;i<44;i++){const lane=i%4,phase=.5+.5*Math.sin(t*(.33+lane*.05)+i*.61),a=i*.91+t*(.035+l.mid*.055+lane*.003),r=1.7+(i%9)*.55+(phase-.5)*.18,y=-1.25+((i*1.73+t*(.12+l.treble*.18+lane*.012))%5)+(phase-.5)*.24;this.d.position.set(Math.cos(a)*r,y,Math.sin(a)*r);const sc=.56+l.treble*.38+phase*(.16+(c?.onsetPulse||0)*.16);this.d.scale.set(sc,sc*(.88+.18*phase),sc);this.d.rotation.y=a;this.d.updateMatrix();this.bubbles.setMatrixAt(i,this.d.matrix)}this.bubbles.instanceMatrix.needsUpdate=true}",
  'plasma layered currents and bubble choreography',
)
expanded = replaceIn(expanded,
  "update(t:number,dt:number,c:Cue,l:LiveFrame){this.run(t,l,c);this.root.rotation.y=Math.sin(t*.035)*.08;this.fade(dt)}",
  "update(t:number,dt:number,c:Cue,l:LiveFrame){this.run(t,l,c);this.root.rotation.y=Math.sin(t*.025)*.025;this.fade(dt)}",
  'plasma root motion reduced',
)

// 8 NEURAL GROVE — node-to-node relays, branch sway and asynchronous firing.
expanded = replaceIn(expanded,
  "private run(t:number,l:LiveFrame,c?:Cue){for(let i=0;i<this.n;i++){const a=i*.58+t*(.018+l.mid*.025),r=1+(i%12)*.28+Math.sin(t*.9+i)*l.bass*.16,y=-3+(i/this.n)*6+Math.sin(t*.5+i*.3)*.18;this.d.position.set(Math.cos(a)*r,y,Math.sin(a)*r);this.d.scale.setScalar(.55+l.treble*.8+(c?.beatPulse||0)*(i%4===0?.65:.1));this.d.updateMatrix();this.nodes.setMatrixAt(i,this.d.matrix)}this.nodes.instanceMatrix.needsUpdate=true;(this.lines.material as THREE.LineBasicMaterial).opacity=.14+.22*l.mid+.18*(c?.phrasePulse||0)}",
  "private run(t:number,l:LiveFrame,c?:Cue){for(let i=0;i<this.n;i++){const row=Math.floor(i/12),col=i%12,relay=.5+.5*Math.sin(t*(.72+l.mid*.78)-i*.28),reply=.5+.5*Math.sin(t*(.31+l.treble*.48)+row*.63-col*.41),a=i*.58+t*(.012+l.mid*.016)+(reply-.5)*.035,r=1+(i%12)*.28+(relay-.5)*(.12+l.bass*.12),y=-3+(i/this.n)*6+Math.sin(t*.38+i*.3)*.14+(reply-.5)*.16;this.d.position.set(Math.cos(a)*r,y,Math.sin(a)*r);const sc=.5+l.treble*.28+relay*(.18+.38*l.treble)+(c?.onsetPulse||0)*(i%9===0?.16:.015);this.d.scale.set(sc,sc*(.9+.18*reply),sc);this.d.rotation.z=(reply-.5)*.16;this.d.updateMatrix();this.nodes.setMatrixAt(i,this.d.matrix)}this.nodes.instanceMatrix.needsUpdate=true;(this.lines.material as THREE.LineBasicMaterial).opacity=.13+.18*l.mid+.1*(c?.phrasePulse||0)+.06*l.flux}",
  'neural grove relay choreography',
)
expanded = replaceIn(expanded,
  "update(t:number,dt:number,c:Cue,l:LiveFrame){this.run(t,l,c);this.root.rotation.y+=dt*(.025+l.mid*.08);this.fade(dt)}",
  "update(t:number,dt:number,c:Cue,l:LiveFrame){this.run(t,l,c);this.root.rotation.y+=dt*(.003+l.mid*.008);this.fade(dt)}",
  'neural root spin minimized',
)

// 9 DIMENSIONAL TUNNEL — ring-by-ring corkscrew and depth propagation.
expanded = replaceIn(expanded,
  "private run(t:number,l:LiveFrame,pulse:number){this.rings.forEach((m,i)=>{const z=((m.position.z+t*(.35+l.mid*.8)+15)%19)-14;m.position.z=z;const q=1+.08*Math.sin(t*2+i*.5)+pulse*.14*(i%4===0?1:.2);m.scale.setScalar(q);m.rotation.z+=.002+i*.00015;(m.material as THREE.MeshBasicMaterial).opacity=.09+.22*l.treble+.14*pulse})}",
  "private run(t:number,l:LiveFrame,pulse:number){this.rings.forEach((m,i)=>{const speed=.24+l.mid*.5+(i%5)*.018,z=((m.position.z+t*speed+15)%19)-14,travel=.5+.5*Math.sin(t*(.48+l.mid*.52)-i*.43),counter=.5+.5*Math.sin(t*.24+i*.61);m.position.z=z;m.position.x=(travel-.5)*.18;m.position.y=(counter-.5)*.14;const sx=1+(travel-.5)*(.08+.08*l.mid)+pulse*(i%7===0?.045:.006),sy=1+(counter-.5)*(.07+.07*l.treble);m.scale.set(sx,sy,1);m.rotation.z+=.0012+i*.00011+(travel-.5)*.0006;m.rotation.x=(counter-.5)*.05;m.rotation.y=(travel-.5)*.045;(m.material as THREE.MeshBasicMaterial).opacity=.085+.18*l.treble+.07*pulse+.05*travel})}",
  'tunnel independent ring propagation',
)

// 10 MEGASTRUCTURE RING — independent satellites and sector-like motion.
expanded = replaceIn(expanded,
  "private run(t:number,l:LiveFrame,p:number){this.halo.rotation.x=.65+Math.sin(t*.05)*.15;this.halo.rotation.y+=.004+l.mid*.01;this.halo.scale.setScalar(1+l.bass*.08+p*.08);this.spokes.rotation.copy(this.halo.rotation);this.sats.forEach((m,i)=>{const a=t*(.15+i*.01)+i*Math.PI/4,r=4.2+(i%2)*.35;m.position.set(Math.cos(a)*r,Math.sin(a)*r*.65,Math.sin(a*.7)*1.8);m.lookAt(0,0,0);m.scale.setScalar(1+l.treble*.5)})}",
  "private run(t:number,l:LiveFrame,p:number){this.halo.rotation.x=.65+Math.sin(t*.038)*.1;this.halo.rotation.y+=.0025+l.mid*.005;this.halo.scale.setScalar(1+l.bass*.035+p*.025);this.spokes.rotation.copy(this.halo.rotation);(this.spokes.material as THREE.LineBasicMaterial).opacity=.2+.08*l.mid+.06*p;this.sats.forEach((m,i)=>{const wave=.5+.5*Math.sin(t*(.32+i*.025)+i*.8),counter=.5+.5*Math.sin(t*.19-i*.57),a=t*(.11+i*.008)+i*Math.PI/4+(wave-.5)*.08,r=4.05+(i%2)*.35+(counter-.5)*.28;m.position.set(Math.cos(a)*r,Math.sin(a)*r*(.52+.12*wave)+(counter-.5)*.25,Math.sin(a*.7+i*.2)*1.65);m.lookAt(0,0,0);m.scale.set(.9+.22*wave,.86+.18*counter,.9+.16*(1-wave))})}",
  'megastructure satellite and sector motion',
)

// 11 FRACTURE DESERT — local shard lifts and traveling fracture groups.
expanded = replaceIn(expanded,
  "private run(t:number,l:LiveFrame,c?:Cue){for(let i=0;i<54;i++){const x=(i%9-4)*1.6,z=(Math.floor(i/9)-2.5)*1.8,y=-2.15+Math.abs(Math.sin(i*1.7))*1.1;this.d.position.set(x+Math.sin(t*.05+i)*.08,y,z);this.d.scale.set(.7,1.2+l.bass*1.8+(c?.beatPulse||0)*(i%5===0?1.2:.1),.7);this.d.rotation.set(.2,i*.5,t*.03+i);this.d.updateMatrix();this.ob.setMatrixAt(i,this.d.matrix)}this.ob.instanceMatrix.needsUpdate=true;this.ground.position.y=-2.4+Math.sin(t*2)*(c?.beatPulse||0)*.08}",
  "private run(t:number,l:LiveFrame,c?:Cue){for(let i=0;i<54;i++){const row=Math.floor(i/9),col=i%9,x=(col-4)*1.6,z=(row-2.5)*1.8,front=.5+.5*Math.sin(t*(.74+l.mid*.48)-row*.82-col*.39),scatter=.5+.5*Math.sin(t*.29+i*.57),accent=(c?.onsetPulse||0)*(i%8===0?.26:.015),y=-2.15+Math.abs(Math.sin(i*1.7))*1.1+front*(.16+l.bass*.34)+accent;this.d.position.set(x+(scatter-.5)*.16,y,z+(front-.5)*.14);this.d.scale.set(.66+.08*scatter,1.05+l.bass*.42+front*(.42+l.mid*.34),.66+.08*front);this.d.rotation.set(.18+(front-.5)*.22,i*.5+(scatter-.5)*.24,t*.012+i+(front-.5)*.28);this.d.updateMatrix();this.ob.setMatrixAt(i,this.d.matrix)}this.ob.instanceMatrix.needsUpdate=true;this.ground.position.y=-2.4+Math.sin(t*.35)*.018}",
  'fracture desert local shard choreography',
)

// 12 FLOATING ARCHIPELAGO — independent drift, bob, yaw and phrase-group lift.
expanded = replaceIn(expanded,
  "private run(t:number,l:LiveFrame,c?:Cue){for(let i=0;i<22;i++){const a=i*.91,r=1.5+(i%6)*1.05,y=(i%5-2)*.72+Math.sin(t*.22+i)*(.18+l.mid*.3);this.d.position.set(Math.cos(a)*r,y,Math.sin(a)*r*.7);this.d.rotation.set(Math.PI, t*.025+i,.1*Math.sin(t*.1+i));this.d.scale.setScalar(.7+l.bass*.2+(c?.phrasePulse||0)*(i%4===0?.25:0));this.d.updateMatrix();this.islands.setMatrixAt(i,this.d.matrix)}this.islands.instanceMatrix.needsUpdate=true;this.wisps.rotation.y+=.001+l.treble*.003}",
  "private run(t:number,l:LiveFrame,c?:Cue){for(let i=0;i<22;i++){const drift=.5+.5*Math.sin(t*(.17+(i%4)*.014)+i*.71),bob=.5+.5*Math.sin(t*(.24+(i%3)*.019)-i*.53),group=i%4,a=i*.91+(drift-.5)*.12,r=1.5+(i%6)*1.05+(drift-.5)*.32,y=(i%5-2)*.72+(bob-.5)*(.42+l.mid*.34)+(c?.phrasePulse||0)*(group===0?.22:group===2?.08:0);this.d.position.set(Math.cos(a)*r,y,Math.sin(a)*r*.7+(drift-.5)*.2);this.d.rotation.set(Math.PI+(bob-.5)*.06,t*.014+i+(drift-.5)*.18,.08*Math.sin(t*.08+i)+(bob-.5)*.08);const sc=.68+l.bass*.11+(c?.phrasePulse||0)*(group===0?.12:.015);this.d.scale.set(sc,sc*(.92+.12*bob),sc);this.d.updateMatrix();this.islands.setMatrixAt(i,this.d.matrix)}this.islands.instanceMatrix.needsUpdate=true;this.wisps.rotation.y+=.0007+l.treble*.002;this.wisps.rotation.x=Math.sin(t*.035)*.025}",
  'archipelago independent island drift',
)
writeFileSync(expandedPath, expanded)

// ---------------------------------------------------------------------------
// GENERATED REGIONS 13-18
// ---------------------------------------------------------------------------
const generatedPath = src('newRegions.ts')
let generated = readFileSync(generatedPath, 'utf8')

// 13 KINETIC CAUSEWAY — rows, diagonals, clusters and replies behave as voices.
generated = replaceIn(generated,
  "const row=Math.floor(i/7),col=i%7,step=.5+.5*Math.sin(t*(1.25+l.mid*1.55)-i*.5),reply=.5+.5*Math.sin(t*(.68+l.treble*.82)+i*.31),diagonal=.5+.5*Math.sin(t*(.9+l.mid*.75)-(row+col)*.72),cluster=.5+.5*Math.sin(t*.42+(i%5)*1.1),voice=i%4===0?step:i%4===1?reply:i%4===2?diagonal:cluster;y=-2+(.42+l.bass*.24+voice*(.72+l.mid*.92)+reply*l.flux*.38)*.5;sy=.5+l.bass*.2+voice*(.62+l.mid*.82)+beat*(i%9===0?.16:.015);sx=.9+(diagonal-.5)*.16;sz=.9+(cluster-.5)*.14;rz=(voice-.5)*.28+phrase*Math.sin(q*Math.PI*5)*.09;rx=(reply-.5)*.1",
  "const row=Math.floor(i/7),col=i%7,step=.5+.5*Math.sin(t*(1.08+l.mid*1.3)-i*.46),reply=.5+.5*Math.sin(t*(.58+l.treble*.68)+i*.34),diagonal=.5+.5*Math.sin(t*(.76+l.mid*.62)-(row+col)*.7),cluster=.5+.5*Math.sin(t*.33+(i%5)*1.1),lane=.5+.5*Math.sin(t*.49-row*.9+col*.28),voice=i%5===0?step:i%5===1?reply:i%5===2?diagonal:i%5===3?cluster:lane;y=-2+(.38+l.bass*.18+voice*(.72+l.mid*.78)+reply*l.flux*.28)*.5+(lane-.5)*.12;sy=.48+l.bass*.16+voice*(.66+l.mid*.7)+beat*(i%11===0?.08:.006);sx=.88+(diagonal-.5)*.2;sz=.88+(cluster-.5)*.17;rz=(voice-.5)*.34+phrase*Math.sin(q*Math.PI*5)*.06;rx=(reply-.5)*.14;ry=(lane-.5)*.12",
  'causeway multi-voice independent choreography',
)

// 14 CHROMA REEF — frond-like sways, staggered blooms and sparkle roles.
generated = replaceIn(generated,
  "const bloom=.5+.5*Math.sin(t*(.42+l.mid*.55)+i*.74),shimmer=.5+.5*Math.sin(t*(1.1+l.treble*1.8)-i*.43);y=-2.5+q*5+Math.sin(t*.35+i)*(.12+l.mid*.24)+bloom*.32;sy=.48+l.mid*.72+bloom*(.55+tonal*.78)+shimmer*l.treble*.34;ry=a+t*.035*(i%3===0?1:-1);rz=(i%2?1:-1)*(.18+.16*shimmer)",
  "const bloom=.5+.5*Math.sin(t*(.34+l.mid*.48)+i*.74),shimmer=.5+.5*Math.sin(t*(.92+l.treble*1.35)-i*.43),sway=.5+.5*Math.sin(t*.24+i*.39),branch=i%4;y=-2.5+q*5+(sway-.5)*(.34+l.mid*.24)+bloom*.26;x+=(sway-.5)*(.18+branch*.03);z+=(bloom-.5)*.16;sy=.46+l.mid*.46+bloom*(.58+tonal*.58)+shimmer*l.treble*.22;sx=.9+(sway-.5)*.16;sz=.9+(shimmer-.5)*.13;ry=a+t*.024*(branch%2?1:-1)+(sway-.5)*.15;rz=(i%2?1:-1)*(.14+.18*shimmer)+(bloom-.5)*.12",
  'chroma reef frond and bloom motion',
)

// 15 GRAVITY GARDEN — each orbiter gets its own radius, elevation and attraction cycle.
generated = replaceIn(generated,
  "const a=t*(.08+l.mid*.1)+i*.79,r=1.2+(i%8)*.48;x=Math.cos(a)*r;z=Math.sin(a)*r*.72;y=Math.sin(a*.7+i)*1.8;const orbitWave=.5+.5*Math.sin(t*(.55+l.mid*.65)-i*.58),gravity=.5+.5*Math.sin(t*.24+i*.37);const sc=.58+l.bass*.28+orbitWave*(.18+.34*beat)+gravity*phrase*.2;sx=sy=sz=sc",
  "const orbitWave=.5+.5*Math.sin(t*(.46+l.mid*.52)-i*.58),gravity=.5+.5*Math.sin(t*.2+i*.37),release=.5+.5*Math.sin(t*.13-i*.29),a=t*(.065+l.mid*.075)+i*.79+(orbitWave-.5)*.16,r=1.2+(i%8)*.48+(gravity-.5)*(.34+l.bass*.22);x=Math.cos(a)*r;z=Math.sin(a)*r*.72+(release-.5)*.22;y=Math.sin(a*.7+i)*1.55+(orbitWave-.5)*.38;const sc=.56+l.bass*.16+orbitWave*(.16+.18*beat)+gravity*phrase*.12;sx=sc*(.92+.14*release);sy=sc*(.9+.18*orbitWave);sz=sc*(.92+.14*gravity);ry=a;rz=(gravity-.5)*.18",
  'gravity garden attraction and orbit cycles',
)

// 16 MIRROR BASIN — delayed reflection waves and traveling glints.
generated = replaceIn(generated,
  "const glint=.5+.5*Math.sin(t*(1.2+l.treble*1.9)-k*.71),float=.5+.5*Math.sin(t*.31+k*.49);y=(k%7-3)*.42+(float-.5)*(.26+l.mid*.24);const sc=.58+l.treble*.26+tonal*.25+glint*(.18+l.treble*.42);sx=sy=sz=sc;ry=t*(.045+.07*glint)*side+k*.13;rz=(glint-.5)*.18",
  "const glint=.5+.5*Math.sin(t*(.96+l.treble*1.45)-k*.71),float=.5+.5*Math.sin(t*.27+k*.49),lag=.5+.5*Math.sin(t*.19-k*.37+side*.9);y=(k%7-3)*.42+(float-.5)*(.32+l.mid*.2)+(lag-.5)*.14;x+=side*(glint-.5)*.16;z+=(lag-.5)*.18;const sc=.56+l.treble*.18+tonal*.2+glint*(.18+l.treble*.3);sx=sc*(.9+.16*lag);sy=sc*(.88+.2*float);sz=sc*(.9+.16*glint);ry=t*(.028+.045*glint)*side+k*.13+(lag-.5)*.22;rz=(glint-.5)*.24;rx=(float-.5)*.12",
  'mirror basin delayed reflection motion',
)

// 17 PULSE BRIDGE — energy travels lane-to-lane rather than pumping the whole bridge.
generated = replaceIn(generated,
  "const travel=.5+.5*Math.sin(t*(1.05+l.mid*1.35)-qq*10.5+lane*.8),counter=.5+.5*Math.sin(t*.62+qq*7.2-lane);y=lane*(.75+Math.sin(a)*.3)+(travel-.5)*.48;sx=.72+travel*(.34+beat*.36);sy=.7+counter*(.22+phrase*.42);ry=a+(travel-.5)*.18",
  "const travel=.5+.5*Math.sin(t*(.86+l.mid*1.1)-qq*10.5+lane*.8),counter=.5+.5*Math.sin(t*.49+qq*7.2-lane),echo=.5+.5*Math.sin(t*.27-qq*5.4+lane*1.2);y=lane*(.75+Math.sin(a)*.3)+(travel-.5)*.54+(echo-.5)*.14;x+=(counter-.5)*.16;z+=(travel-.5)*.18;sx=.7+travel*(.36+beat*.16);sy=.68+counter*(.26+phrase*.28);sz=.9+(echo-.5)*.12;ry=a+(travel-.5)*.22;rz=(counter-.5)*.12",
  'pulse bridge lane travel choreography',
)

// 18 SIGNAL FOREST — relay chains, grouped sways and asynchronous stalk responses.
generated = replaceIn(generated,
  "const signal=.5+.5*Math.sin(t*(1.35+l.treble*2.05)-row*.82-col*.55),echo=.5+.5*Math.sin(t*(.62+l.mid*.95)+row*.44-col*.9),relay=.5+.5*Math.sin(t*(.86+l.mid*.6)-(row*7+col)*.31),grove=.5+.5*Math.sin(t*.28+row*.7);y=-2.2+(.56+l.treble*.2+signal*(.58+l.flux*.65)+relay*l.mid*.5)*.5;sy=.52+l.treble*.2+tonal*.22+signal*(.42+l.treble*.52)+relay*.26*l.mid;rz=(col-3)*.014*phrase+(signal-.5)*(.16+l.flux*.14)+(grove-.5)*.08;rx=(echo-.5)*.13;ry=(relay-.5)*.16",
  "const signal=.5+.5*Math.sin(t*(1.08+l.treble*1.55)-row*.84-col*.57),echo=.5+.5*Math.sin(t*(.51+l.mid*.8)+row*.46-col*.88),relay=.5+.5*Math.sin(t*(.7+l.mid*.52)-(row*7+col)*.33),grove=.5+.5*Math.sin(t*.22+row*.72),branch=.5+.5*Math.sin(t*.31+col*.58-row*.19);y=-2.2+(.52+l.treble*.16+signal*(.54+l.flux*.5)+relay*l.mid*.42)*.5+(grove-.5)*.12;sy=.5+l.treble*.16+tonal*.18+signal*(.44+l.treble*.42)+relay*.24*l.mid;sx=.92+(branch-.5)*.12;sz=.92+(echo-.5)*.1;rz=(col-3)*.011*phrase+(signal-.5)*(.2+l.flux*.12)+(grove-.5)*.1;rx=(echo-.5)*.17;ry=(relay-.5)*.2+(branch-.5)*.09",
  'signal forest relay and sway chains',
)

generated = replaceIn(generated,
  "this.root.rotation.y+=dt*(.006+l.mid*.014);this.root.rotation.z=Math.sin(t*.028+this.kind)*.012;",
  "this.root.rotation.y+=dt*(.0015+l.mid*.004);this.root.rotation.z=Math.sin(t*.022+this.kind)*.005;",
  'generated region root motion minimized',
)
writeFileSync(generatedPath, generated)

console.log('Patched Visual.X v4.3.9 region-by-region component choreography across all 18 regions')
