import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const src = (...parts) => join(appDir, 'src', ...parts)

const wavePath = src('AudioWaveEntity.ts')
const regionPath = src('RegionConstellationSystem.ts')
const enginePath = src('VisualEngine.ts')

const waveBaseline = readFileSync(wavePath, 'utf8')
if (!waveBaseline.includes('export class AudioWaveEntity') || !waveBaseline.includes('getLatestWaveform')) {
  throw new Error('Visual.X v4.3.4 patch missing: real waveform baseline')
}

const waveSource = `import * as THREE from 'three';
import type { Cue, LiveFrame, CameraCue } from './directorEngine';
import { getLatestWaveform } from './audioAnalysis';
const C=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
export class AudioWaveEntity{
  root=new THREE.Group();private n=720;private waveGeo=new THREE.BufferGeometry();private wavePos:THREE.BufferAttribute;private waveColor:THREE.BufferAttribute;private wave:THREE.LineSegments;private playheadGeo=new THREE.BufferGeometry();private playheadPos:THREE.BufferAttribute;private playhead:THREE.Line;private glow:THREE.Mesh;private halo:THREE.Mesh;private center:THREE.Mesh;private mins=new Float32Array(this.n);private maxs=new Float32Array(this.n);private duration=0;private ready=false;private radius=27.2;private centerY=-4.25;private amp=5.6;private pink=new THREE.Color(0xff2ba6);private violet=new THREE.Color(0x8b5cf6);private cyan=new THREE.Color(0x22d3ee);private tempColor=new THREE.Color();
  constructor(scene:THREE.Scene,_seed:number){const size=this.n*2*3,pos=new Float32Array(size),colors=new Float32Array(size);this.waveGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));this.waveGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));this.wavePos=this.waveGeo.getAttribute('position')as THREE.BufferAttribute;this.waveColor=this.waveGeo.getAttribute('color')as THREE.BufferAttribute;this.wave=new THREE.LineSegments(this.waveGeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.74,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));const ph=new Float32Array(6);this.playheadGeo.setAttribute('position',new THREE.BufferAttribute(ph,3));this.playheadPos=this.playheadGeo.getAttribute('position')as THREE.BufferAttribute;this.playhead=new THREE.Line(this.playheadGeo,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.glow=new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.96,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.halo=new THREE.Mesh(new THREE.TorusGeometry(.68,.045,8,48),new THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:.78,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.halo.rotation.x=Math.PI/2;this.center=new THREE.Mesh(new THREE.TorusGeometry(this.radius,.035,6,320),new THREE.MeshBasicMaterial({color:0x8b5cf6,transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.center.rotation.x=Math.PI/2;this.center.position.y=this.centerY;this.root.add(this.center,this.wave,this.playhead,this.glow,this.halo);this.root.visible=false;scene.add(this.root)}
  setProfile(profile:number[],duration:number){this.duration=Math.max(0,duration);const exact=getLatestWaveform(),hasExact=Boolean(exact&&exact.mins.length>1&&exact.maxs.length>1),fallback=profile.length>1;this.ready=(hasExact||fallback)&&this.duration>0;if(!this.ready){this.root.visible=false;return}for(let i=0;i<this.n;i++){const q=i/(this.n-1);let lo=0,hi=0;if(hasExact&&exact){const source=q*(exact.mins.length-1),a=Math.floor(source),b=Math.min(exact.mins.length-1,a+1),f=source-a;lo=exact.mins[a]*(1-f)+exact.mins[b]*f;hi=exact.maxs[a]*(1-f)+exact.maxs[b]*f}else{const source=q*(profile.length-1),a=Math.floor(source),b=Math.min(profile.length-1,a+1),f=source-a,amp=C(profile[a]*(1-f)+profile[b]*f);lo=-amp;hi=amp}this.mins[i]=lo;this.maxs[i]=hi;const ang=q*Math.PI*2,x=Math.cos(ang)*this.radius,z=Math.sin(ang)*this.radius,k=i*2;this.wavePos.setXYZ(k,x,this.centerY+lo*this.amp,z);this.wavePos.setXYZ(k+1,x,this.centerY+hi*this.amp,z)}this.wavePos.needsUpdate=true;this.updateColors(0);this.root.visible=true}
  private updateColors(progress:number){for(let i=0;i<this.n;i++){const q=i/(this.n-1),u=(q-progress+1)%1;let color:THREE.Color;if(u<.56){this.tempColor.copy(this.pink).lerp(this.violet,u/.56);color=this.tempColor}else{this.tempColor.copy(this.violet).lerp(this.cyan,(u-.56)/.44);color=this.tempColor}const seam=Math.min(u,1-u),boost=seam<.025?(1-seam/.025)*.32:0;if(boost>0)this.tempColor.lerp(new THREE.Color(0xffffff),boost);const k=i*2;this.waveColor.setXYZ(k,color.r,color.g,color.b);this.waveColor.setXYZ(k+1,color.r,color.g,color.b)}this.waveColor.needsUpdate=true}
  private samplePoint(t:number){if(!this.ready||this.duration<=0)return null;const q=C(t/this.duration),f=q*(this.n-1),i=Math.min(this.n-1,Math.floor(f)),j=Math.min(this.n-1,i+1),m=f-i,ang=q*Math.PI*2,x=Math.cos(ang)*this.radius,z=Math.sin(ang)*this.radius,lo=(this.mins[i]*(1-m)+this.mins[j]*m)*this.amp+this.centerY,hi=(this.maxs[i]*(1-m)+this.maxs[j]*m)*this.amp+this.centerY;return{q,x,z,lo,hi,mid:(lo+hi)/2}}
  cameraCue(t:number,base:CameraCue):CameraCue{const p=this.samplePoint(t);if(!p)return base;const radial=new THREE.Vector3(p.x,0,p.z).normalize(),tangent=new THREE.Vector3(-radial.z,0,radial.x),tour=C((t%30)/3),pos=radial.multiplyScalar(23.9).addScaledVector(tangent,1.25*Math.sin(tour*Math.PI));return{...base,x:pos.x,y:p.mid+2.7,z:pos.z,focusX:p.x,focusY:p.mid,focusZ:p.z,fov:52,roll:0,damping:3.1,snap:false,shot:'orbit'}}
  update(t:number,_dt:number,c:Cue,l:LiveFrame){const p=this.samplePoint(t);if(!p){this.root.visible=false;return}this.root.visible=true;this.updateColors(p.q);this.playheadPos.setXYZ(0,p.x,p.lo-1.15,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+1.15,p.z);this.playheadPos.needsUpdate=true;this.glow.position.set(p.x,p.mid,p.z);this.halo.position.set(p.x,p.mid,p.z);this.glow.scale.setScalar(1.35+l.level*.22);this.halo.scale.setScalar(1.08+c.phrasePulse*.08);(this.wave.material as THREE.LineBasicMaterial).opacity=.68+l.level*.12;(this.center.material as THREE.MeshBasicMaterial).opacity=.16+c.tonalStrength*.05}
  updateAmbient(){this.root.visible=false}
  dispose(){this.waveGeo.dispose();this.playheadGeo.dispose();(this.wave.material as THREE.Material).dispose();(this.playhead.material as THREE.Material).dispose();this.glow.geometry.dispose();(this.glow.material as THREE.Material).dispose();this.halo.geometry.dispose();(this.halo.material as THREE.Material).dispose();this.center.geometry.dispose();(this.center.material as THREE.Material).dispose();this.root.removeFromParent()}
}
`
writeFileSync(wavePath, waveSource)

let region = readFileSync(regionPath, 'utf8')
if (!region.includes('regions(){return this.slots.map(s=>s.index)}')) throw new Error('Visual.X v4.3.4 patch missing: regions accessor')
region = region.replace(
  'regions(){return this.slots.map(s=>s.index)}',
  `regions(){return this.slots.map(s=>s.index)}
  advanceFocus(t:number,c:Cue,l:LiveFrame){this.chooseFocus(t,c,l)}`,
)
if (!region.includes('private score(s:Slot,c:Cue,l:LiveFrame)')) throw new Error('Visual.X v4.3.4 patch missing: region score baseline')
region = region.replace(
  'private score(s:Slot,c:Cue,l:LiveFrame)',
  `private personality(index:number,c:Cue,l:LiveFrame){const profiles=[[.32,1.14,.82,.72,1,.8],[.18,1.02,.72,.58,1.12,.72],[.12,.72,1.18,.96,1.08,.9],[.16,.74,.92,1.18,.9,1.15],[.08,.88,.62,.54,.72,1.05],[.22,.98,.82,.94,1.04,.82],[.14,.68,1.12,.92,.98,1.08],[.1,.62,.94,1.2,.88,1.06],[.18,.84,1.02,.88,1.08,.92],[.2,1.12,.72,.66,.96,.78],[.14,.9,.96,.82,1.12,.98],[.1,.66,1.08,.94,.92,1.14],[.2,1.06,.82,.74,1.08,.84],[.12,.7,1.04,1.12,.9,1.02],[.16,1.08,.76,.86,.96,.88],[.1,.72,.96,1.14,.88,1.08],[.16,.84,1.08,.82,1.1,.98],[.1,.68,1.02,1.08,.9,1.12]],p=profiles[index%profiles.length];return{cue:{...c,beatPulse:c.beatPulse*p[0],bassPulse:c.bassPulse*p[1],midPulse:c.midPulse*p[2],highPulse:c.highPulse*p[3],phrasePulse:c.phrasePulse*p[4],tonalPulse:c.tonalPulse*p[5]},live:{...l,bass:C(l.bass*p[1]),mid:C(l.mid*p[2]),treble:C(l.treble*p[3])}}}
  private score(s:Slot,c:Cue,l:LiveFrame)`,
)
const nativeUpdate = 'if(i===this.focusSlot)s.world.update(t,dt,c,l);else s.world.ambient(t+s.index*.73,dt)'
if (!region.includes(nativeUpdate)) throw new Error('Visual.X v4.3.4 patch missing: native region update')
region = region.replace(nativeUpdate, "if(i===this.focusSlot){const p=this.personality(s.index,c,l);s.world.update(t,dt,p.cue,p.live)}else s.world.ambient(t+s.index*.73,dt)")
writeFileSync(regionPath, region)

let engine = readFileSync(enginePath, 'utf8')
const smoothState = 'private smoothLive:LiveFrame={bass:0,mid:0,treble:0,level:0,flux:0};private smoothPulse={beatPulse:0,barPulse:0,phrasePulse:0,onsetPulse:0,bassPulse:0,midPulse:0,highPulse:0,tonalPulse:0,dropPulse:0};'
if (!engine.includes(smoothState)) throw new Error('Visual.X v4.3.4 patch missing: stabilizer state')
engine = engine.replace(smoothState, smoothState+'private waveTourActive=false;')
engine = engine.replace(
  "const target=cue[k] as number;const attack=k==='beatPulse'||k==='onsetPulse'||k==='bassPulse'?11:7;const release=k==='beatPulse'?4.2:k==='onsetPulse'?5.2:3.6;this.smoothPulse[k]=this.follow(this.smoothPulse[k],target,dt,attack,release)",
  "const raw=cue[k] as number,scale=k==='beatPulse'?.34:k==='onsetPulse'?.48:k==='bassPulse'?.72:k==='midPulse'?.82:k==='highPulse'?.82:1,target=raw*scale,attack=k==='beatPulse'?4.8:k==='onsetPulse'?5.4:6.2,release=k==='beatPulse'?2.3:k==='onsetPulse'?3.2:3.5;this.smoothPulse[k]=this.follow(this.smoothPulse[k],target,dt,attack,release)",
)
engine = engine.replace('maxR=25.8,maxF=23.5','maxR=25.2,maxF=28.4')
engine = engine.replace("if(r==='fracture')this.shake=Math.max(this.shake,.24);else if(r==='shockwave')this.shake=Math.max(this.shake,.07);","if(r==='fracture'||r==='shockwave')this.shake=0;")
const cameraBlock = "this.constellation.update(t,dt,c,l);const focus=this.constellation.focus();const actorInterest={position:focus.position.clone(),weight:0};const cam=this.contain(this.safe(this.constellation.cameraCue(this.safe(c.camera),t,c,l,actorInterest)));this.wave.update(t,dt,c,l);"
if (!engine.includes(cameraBlock)) throw new Error('Visual.X v4.3.4 patch missing: conditioned camera block')
engine = engine.replace(cameraBlock, "this.constellation.update(t,dt,c,l);const waveTour=t>=30&&(t%30)<3;if(this.waveTourActive&&!waveTour)this.constellation.advanceFocus(t,c,l);this.waveTourActive=waveTour;const focus=this.constellation.focus();const actorInterest={position:focus.position.clone(),weight:0};const cameraCue={...c,beatPulse:0,barPulse:c.barPulse*.1,phrasePulse:c.phrasePulse*.12,onsetPulse:0,bassPulse:0,midPulse:0,highPulse:0,dropPulse:0,reactions:[]};const regionCam=this.contain(this.safe(this.constellation.cameraCue(this.safe(cameraCue.camera),t,cameraCue,l,actorInterest)));const cam=waveTour?this.contain(this.safe(this.wave.cameraCue(t,regionCam))):regionCam;this.wave.update(t,dt,c,l);")
writeFileSync(enginePath, engine)

console.log('Patched Visual.X v4.3.4 region personality, planet.X waveform gradient, and independent camera direction')
