import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const worldPath = join(appDir, 'src', 'worldModules.ts')
let world = readFileSync(worldPath, 'utf8')

const replace = (label, from, to) => {
  if (!world.includes(from)) throw new Error(`Visual.X v4.3.6 patch missing: ${label}`)
  world = world.replace(from, to)
}

// ORBITAL SYSTEM — gravity / precession / breathing.
// Beat energy influences orbital velocity and a damped core breath instead of snapping every body in scale.
replace(
  'orbital state',
  "class OrbitalWorld extends BaseWorld{private core:THREE.Mesh;private planets:THREE.Mesh[]=[];private rings:THREE.Mesh[]=[];private dust:THREE.Points;private direction=1;",
  "class OrbitalWorld extends BaseWorld{private core:THREE.Mesh;private planets:THREE.Mesh[]=[];private rings:THREE.Mesh[]=[];private dust:THREE.Points;private direction=1;private orbitEnergy=0;private coreBreath=0;private precession=0;",
)
replace(
  'orbital motion',
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){const hit=Math.max(this.impulse,beat);this.core.scale.setScalar(1+l.bass*.7+hit*.55+phrase*.35);this.core.rotation.y+=dt*(.18+l.mid*1.2);this.planets.forEach((m,i)=>{const r=(1.55+i*.48)*(1+l.bass*.18+this.impulse*.15),speed=.08+i*.013,a=t*speed*this.direction+i*1.37,tilt=(this.sceneMode-1)*.38;m.position.set(Math.cos(a)*r,Math.sin(a*(1+tilt))*r*(.22+.1*this.sceneMode),Math.sin(a)*r*.55);m.scale.setScalar(1+l.bass*.45+beat*.22);m.rotation.y+=dt*(.2+l.mid);const rm=this.rings[i].material as THREE.MeshBasicMaterial;rm.opacity=.1+.15*bar+.18*phrase;this.rings[i].rotation.z+=dt*.015*this.direction});this.dust.rotation.y+=dt*(.02+l.treble*.08)*this.direction;this.root.rotation.z+=(bar*.08+phrase*.16-this.root.rotation.z)*Math.min(1,dt*3)}",
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){const targetEnergy=Math.min(1.35,l.bass*.62+beat*.24+phrase*.28+this.impulse*.2),targetBreath=Math.min(1.4,l.bass*.5+phrase*.42+this.impulse*.28);this.orbitEnergy+=(targetEnergy-this.orbitEnergy)*Math.min(1,dt*2.2);this.coreBreath+=(targetBreath-this.coreBreath)*Math.min(1,dt*2.8);this.precession+=(bar*.22+phrase*.3-this.precession)*Math.min(1,dt*1.35);this.core.scale.setScalar(1+this.coreBreath*.62+Math.sin(t*.82)*.035);this.core.rotation.y+=dt*(.16+l.mid*.86+this.orbitEnergy*.28);this.planets.forEach((m,i)=>{const r=(1.55+i*.48)*(1+l.bass*.12+this.orbitEnergy*.09),speed=(.075+i*.012)*(1+this.orbitEnergy*.52),a=t*speed*this.direction+i*1.37+this.precession*.18,tilt=(this.sceneMode-1)*.38;m.position.set(Math.cos(a)*r,Math.sin(a*(1+tilt))*r*(.22+.1*this.sceneMode),Math.sin(a)*r*.55);const breathe=1+l.bass*.26+Math.sin(t*.55+i*.8)*(.025+.03*this.orbitEnergy);m.scale.setScalar(breathe);m.rotation.y+=dt*(.18+l.mid*.72+this.orbitEnergy*.18);const rm=this.rings[i].material as THREE.MeshBasicMaterial;rm.opacity=.1+.1*bar+.16*phrase+.04*this.orbitEnergy;this.rings[i].rotation.z+=dt*(.012+.012*this.orbitEnergy)*this.direction});this.dust.rotation.y+=dt*(.018+l.treble*.06+this.orbitEnergy*.025)*this.direction;const rollTarget=this.precession*.18*Math.sin(t*.18);this.root.rotation.z+=(rollTarget-this.root.rotation.z)*Math.min(1,dt*1.8)}",
)

// NEON MONOLITHS — traveling height sequence / structural regroup.
// A damped envelope and sweep move through the grid so a beat does not raise every tower at once.
replace(
  'monolith state',
  "class MonolithWorld extends BaseWorld{private mesh:THREE.InstancedMesh;private dummy=new THREE.Object3D();private floor:THREE.GridHelper;private count:number;private blast=0;",
  "class MonolithWorld extends BaseWorld{private mesh:THREE.InstancedMesh;private dummy=new THREE.Object3D();private floor:THREE.GridHelper;private count:number;private blast=0;private heightEnergy=0;private sweep=0;private structuralTurn=0;",
)
replace(
  'monolith motion',
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){this.blast*=Math.exp(-3.5*dt);const side=Math.ceil(Math.sqrt(this.count));for(let i=0;i<this.count;i++){const row=Math.floor(i/side),col=i%side,u=col-side/2,v=row-side/2;let x=0,z=0;if(this.sceneMode===0){x=u*.7;z=-v*.75}else if(this.sceneMode===1){const a=i/this.count*Math.PI*2,r=3.1+(i%5)*.42;x=Math.cos(a)*r;z=Math.sin(a)*r}else{const lane=i%2?1:-1;x=lane*(2.2+(i%5)*.38);z=-7+row*.95}const wave=.5+.5*Math.sin(t*3.2-i*.33),h=.5+2.8*l.bass+1.4*beat*wave+1.7*phrase*(i%4===0?1:.25),push=this.blast*(.4+i%7*.08);this.dummy.position.set(x*(1+push),-2.2+h*.5,z*(1+push));this.dummy.scale.set(1,h,1);this.dummy.rotation.y=this.sceneMode===1?Math.atan2(x,z):bar*.35;this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=true;this.root.rotation.y+=dt*(.025+l.mid*.09);(this.floor.material as THREE.LineBasicMaterial).opacity=.08+.18*bar+.12*l.treble}",
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){this.blast*=Math.exp(-3.5*dt);const targetHeight=Math.min(1.45,l.bass*.72+l.mid*.34+beat*.22+phrase*.38);this.heightEnergy+=(targetHeight-this.heightEnergy)*Math.min(1,dt*3);this.sweep+=dt*(1.45+l.mid*2.1+this.heightEnergy*.9);this.structuralTurn+=(bar*.24+phrase*.16-this.structuralTurn)*Math.min(1,dt*1.8);const side=Math.ceil(Math.sqrt(this.count));for(let i=0;i<this.count;i++){const row=Math.floor(i/side),col=i%side,u=col-side/2,v=row-side/2;let x=0,z=0;if(this.sceneMode===0){x=u*.7;z=-v*.75}else if(this.sceneMode===1){const a=i/this.count*Math.PI*2,r=3.1+(i%5)*.42;x=Math.cos(a)*r;z=Math.sin(a)*r}else{const lane=i%2?1:-1;x=lane*(2.2+(i%5)*.38);z=-7+row*.95}const phase=this.sweep-i*.34-row*.12,wave=.5+.5*Math.sin(phase),accent=(i%4===0?1:.28),h=.58+1.8*l.bass+1.25*this.heightEnergy*wave+.82*phrase*accent+.16*l.mid*Math.sin(phase*.5),push=this.blast*(.32+i%7*.055);this.dummy.position.set(x*(1+push),-2.2+h*.5,z*(1+push));this.dummy.scale.set(1,h,1);const turn=this.sceneMode===1?Math.atan2(x,z):this.structuralTurn+Math.sin(phase*.22)*.045;this.dummy.rotation.y=turn;this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=true;this.root.rotation.y+=dt*(.02+l.mid*.07+this.heightEnergy*.018);(this.floor.material as THREE.LineBasicMaterial).opacity=.08+.11*bar+.1*l.treble+.035*this.heightEnergy}",
)

// RIBBON CATHEDRAL — sway / braid / fold.
// Mid/tonal energy bends the ribbons continuously; beat becomes a traveling ripple, not a whole-world snap.
replace(
  'ribbon state',
  "class RibbonWorld extends BaseWorld{private ribbons:THREE.Mesh[]=[];private spires:THREE.InstancedMesh;private dummy=new THREE.Object3D();private core:THREE.Mesh;private halos:THREE.Mesh[]=[];private points=72;",
  "class RibbonWorld extends BaseWorld{private ribbons:THREE.Mesh[]=[];private spires:THREE.InstancedMesh;private dummy=new THREE.Object3D();private core:THREE.Mesh;private halos:THREE.Mesh[]=[];private points=72;private flow=0;private bend=0;private pulse=0;",
)
replace(
  'ribbon motion prefix',
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){this.ribbons.forEach((r,j)=>{const a=(r.geometry.getAttribute('position')as THREE.BufferAttribute).array as Float32Array,morph=.5+.5*Math.sin(t*.22+j*.72+this.sceneMode*.85),drive=.12+l.mid*.72+beat*.18+phrase*.22,width=.055+.075*drive;",
  "private animate(t:number,dt:number,l:LiveFrame,beat:number,bar:number,phrase:number){const targetBend=Math.min(1.3,l.mid*.72+l.treble*.22+phrase*.42),targetPulse=Math.min(1.2,beat*.34+l.mid*.2+this.impulse*.12);this.bend+=(targetBend-this.bend)*Math.min(1,dt*2.4);this.pulse+=(targetPulse-this.pulse)*Math.min(1,dt*(targetPulse>this.pulse?4.2:1.9));this.flow+=dt*(.48+l.mid*1.05+this.bend*.34);this.ribbons.forEach((r,j)=>{const a=(r.geometry.getAttribute('position')as THREE.BufferAttribute).array as Float32Array,morph=.5+.5*Math.sin(t*.18+j*.72+this.sceneMode*.85+this.bend*.22),drive=.12+l.mid*.56+this.bend*.3+phrase*.18,width=.055+.075*drive;",
)
replace(
  'ribbon traveling ripple',
  "ripple=Math.sin(q*12+t*(.7+l.mid*1.7)+j)*(.05+.34*l.mid+.18*beat)",
  "ripple=Math.sin(q*12+this.flow*1.45+j)*(.045+.22*l.mid+.13*this.bend)+Math.sin(q*18-this.flow*2.1+j*.6)*(.02+.11*this.pulse)",
)
replace(
  'ribbon spire/core/root response',
  "h=.72+l.bass*.68+beat*(i%3===0?.5:.18)+phrase*.22;this.dummy.position.set(side*(2.65+row*.55),-2.2+1.4*h,-.8-row*.72);this.dummy.scale.set(1,h,1);this.dummy.rotation.set(0,side*(.18+row*.07)+Math.sin(t*.15+i)*.04,side*.045);this.dummy.updateMatrix();this.spires.setMatrixAt(i,this.dummy.matrix)}this.spires.instanceMatrix.needsUpdate=true;this.core.position.y=.15+Math.sin(t*.24)*.22;this.core.scale.setScalar(.72+l.bass*.36+beat*.24+phrase*.18+this.impulse*.12);this.core.rotation.x+=dt*(.1+l.mid*.45);this.core.rotation.y+=dt*(.14+l.treble*.72);this.halos.forEach((h,i)=>{h.rotation.z+=dt*(.08+i*.05)*(i?1:-1);h.rotation.y+=dt*.04;(h.material as THREE.MeshBasicMaterial).opacity=.07+.16*bar+.11*phrase});this.root.rotation.y=Math.sin(t*.075)*.17+bar*.08;this.root.rotation.x=Math.sin(t*.052)*.045}",
  "h=.74+l.bass*.54+this.pulse*(i%3===0?.28:.1)+phrase*.2;this.dummy.position.set(side*(2.65+row*.55),-2.2+1.4*h,-.8-row*.72);this.dummy.scale.set(1,h,1);this.dummy.rotation.set(0,side*(.18+row*.07)+Math.sin(t*.15+i+this.bend*.3)*.04,side*.045);this.dummy.updateMatrix();this.spires.setMatrixAt(i,this.dummy.matrix)}this.spires.instanceMatrix.needsUpdate=true;this.core.position.y=.15+Math.sin(t*.24)*.22;this.core.scale.setScalar(.74+l.bass*.3+this.pulse*.18+phrase*.16+this.impulse*.08);this.core.rotation.x+=dt*(.09+l.mid*.38+this.bend*.08);this.core.rotation.y+=dt*(.13+l.treble*.58+this.flow*.006);this.halos.forEach((h,i)=>{h.rotation.z+=dt*(.075+i*.045)*(i?1:-1)*(1+this.bend*.16);h.rotation.y+=dt*.035;(h.material as THREE.MeshBasicMaterial).opacity=.07+.12*bar+.1*phrase+.035*this.bend});const yawTarget=Math.sin(t*.07)*.16+Math.sin(this.flow*.12)*this.bend*.035;this.root.rotation.y+=(yawTarget-this.root.rotation.y)*Math.min(1,dt*1.7);this.root.rotation.x+=(Math.sin(t*.05)*.04-this.root.rotation.x)*Math.min(1,dt*1.5)}",
)

writeFileSync(worldPath, world)
console.log('Patched Visual.X v4.3.6 representative region motion verbs: orbital, monolith, ribbon')
