import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const src = (...parts) => join(appDir, 'src', ...parts)

const replaceIn = (path, from, to, label) => {
  let text = readFileSync(path, 'utf8')
  if (!text.includes(from)) throw new Error(`Visual.X dynamic patch missing: ${label}`)
  text = text.replace(from, to)
  writeFileSync(path, text)
}

const variationSource = `import * as THREE from 'three';
import type { Cue, LiveFrame } from './directorEngine';

type MotionState={pos:THREE.Vector3;rot:THREE.Vector3;scale:THREE.Vector3};
const C=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
const S=(q:number)=>q*q*(3-2*q);

export class RegionVariationSystem{
  private states=new WeakMap<THREE.Object3D,MotionState>();
  private matrix=new THREE.Matrix4();private pos=new THREE.Vector3();private quat=new THREE.Quaternion();private scale=new THREE.Vector3();private targetA=new THREE.Vector3();private targetB=new THREE.Vector3();private target=new THREE.Vector3();private euler=new THREE.Euler();private qDelta=new THREE.Quaternion();
  private hash(x:number){let v=x>>>0;v=Math.imul(v^(v>>>16),0x45d9f3b);v=Math.imul(v^(v>>>16),0x45d9f3b);return(v^(v>>>16))>>>0}
  private formation(mode:number,i:number,n:number,out:THREE.Vector3){const u=(i+.5)/Math.max(1,n),a=u*Math.PI*2,g=i*2.399963229728653;switch(mode){case 0:{const r=2.1+(i%5)*.34;return out.set(Math.cos(a)*r,(i%3-1)*.48,Math.sin(a)*r)}case 1:return out.set(Math.cos(a*3)*2.25,(u-.5)*6.2,Math.sin(a*3)*2.25);case 2:{const y=1-2*u,r=Math.sqrt(Math.max(0,1-y*y))*3.25;return out.set(Math.cos(g)*r,y*3.25,Math.sin(g)*r)}case 3:return out.set((u-.5)*7.6,Math.sin(u*Math.PI*6)*1.45,Math.cos(u*Math.PI*4)*1.8);default:{const level=Math.floor(Math.sqrt(i)),within=i-level*level,count=Math.max(1,level*2+1),ang=within/count*Math.PI*2,r=.65+level*.58;return out.set(Math.cos(ang)*r,-2.3+level*.72,Math.sin(ang)*r)}}}
  private applyInstances(mesh:THREE.InstancedMesh,seed:number,t:number,c:Cue,l:LiveFrame,focus:boolean,index:number){const n=mesh.count;if(!n)return;const phase=(this.hash(seed^index*8191)&65535)/65535*Math.PI*2,cycle=(t+phase*1.7)/18,step=Math.floor(cycle),f=S(cycle-step),modeA=this.hash(seed^step*31337^index*97)%5,modeB=this.hash(seed^(step+1)*31337^index*97)%5,drive=C(.35+l.mid*.34+l.bass*.18+c.motionSpeed*.2+c.phrasePulse*.25),strength=(focus?.18:.08)+(focus?.18:.09)*drive;for(let i=0;i<n;i++){mesh.getMatrixAt(i,this.matrix);this.matrix.decompose(this.pos,this.quat,this.scale);this.formation(modeA,i,n,this.targetA);this.formation(modeB,i,n,this.targetB);this.target.copy(this.targetA).lerp(this.targetB,f);const radius=C(this.pos.length()/4,.65,1.8);this.target.multiplyScalar(radius);this.pos.lerp(this.target,strength);const wobble=.04+.12*drive,ip=(this.hash(seed^i*911^index*53)&4095)/4095*Math.PI*2;this.euler.set(Math.sin(t*.31+ip)*wobble,Math.cos(t*.23+ip)*wobble*1.4,Math.sin(t*.19+ip*1.7)*wobble*.8);this.qDelta.setFromEuler(this.euler);this.quat.multiply(this.qDelta);const pulse=1+Math.sin(t*(.42+l.mid*.35)+ip)*(.018+.045*drive);this.scale.multiplyScalar(pulse);this.matrix.compose(this.pos,this.quat,this.scale);mesh.setMatrixAt(i,this.matrix)}mesh.instanceMatrix.needsUpdate=true}
  apply(root:THREE.Group,seed:number,t:number,c:Cue,l:LiveFrame,focus:boolean){let index=0;root.traverse(obj=>{if(obj===root)return;const i=index++;if((obj as THREE.InstancedMesh).isInstancedMesh){this.applyInstances(obj as THREE.InstancedMesh,seed,t,c,l,focus,i);return}const renderable=(obj as THREE.Mesh).isMesh||(obj as THREE.Line).isLine||(obj as THREE.Points).isPoints;if(!renderable)return;const state=this.states.get(obj)||{pos:new THREE.Vector3(),rot:new THREE.Vector3(),scale:new THREE.Vector3(1,1,1)};obj.position.sub(state.pos);obj.rotation.x-=state.rot.x;obj.rotation.y-=state.rot.y;obj.rotation.z-=state.rot.z;obj.scale.set(obj.scale.x/Math.max(.001,state.scale.x),obj.scale.y/Math.max(.001,state.scale.y),obj.scale.z/Math.max(.001,state.scale.z));const h=this.hash(seed^i*2654435761),phase=(h&65535)/65535*Math.PI*2,slow=.16+((h>>>16)&255)/255*.22,drive=C(.3+l.level*.38+l.mid*.2+l.treble*.12+c.motionSpeed*.2+c.phrasePulse*.18),kind=(obj as THREE.Line).isLine?.55:(obj as THREE.Points).isPoints?.38:1,focusGain=focus?1:.46,staticX=(((h>>>3)&255)/255-.5)*.62*kind,staticY=(((h>>>11)&255)/255-.5)*.42*kind,staticZ=(((h>>>19)&255)/255-.5)*.62*kind;state.pos.set(staticX+Math.sin(t*slow+phase)*.18*drive*kind*focusGain,staticY+Math.cos(t*(slow*.83)+phase)*.14*drive*kind*focusGain,staticZ+Math.sin(t*(slow*1.17)+phase*1.4)*.18*drive*kind*focusGain);const rAmp=(.035+.11*drive)*kind*focusGain;state.rot.set(Math.sin(t*.21+phase)*rAmp,Math.cos(t*.17+phase*.7)*rAmp*1.35,Math.sin(t*.13+phase*1.6)*rAmp*.8);const stretch=(.012+.04*drive)*kind*focusGain;state.scale.set(1+Math.sin(t*.33+phase)*stretch,1+Math.cos(t*.27+phase)*stretch*1.35,1+Math.sin(t*.24+phase*.5)*stretch);obj.position.add(state.pos);obj.rotation.x+=state.rot.x;obj.rotation.y+=state.rot.y;obj.rotation.z+=state.rot.z;obj.scale.multiply(state.scale);this.states.set(obj,state)})}
}
`
writeFileSync(src('RegionVariationSystem.ts'), variationSource)

const regionPath=src('RegionConstellationSystem.ts')
replaceIn(regionPath,
  "import type { PerformancePlan } from './performancePlanner';",
  "import type { PerformancePlan } from './performancePlanner';\nimport { RegionVariationSystem } from './RegionVariationSystem';",
  'variation import')
replaceIn(regionPath,
  'private slots:Slot[]=[];private leaving:Leaving[]=[];private plan:PerformancePlan|null=null;private epoch=-1;private focusSlot=0;private previousFocus=-1;private focusChangedAt=0;private nextFocusAt=0;private decision=0;private lastSection=-1;private seed:number;private focusPos=new THREE.Vector3();private used:number[]=[];',
  'private slots:Slot[]=[];private leaving:Leaving[]=[];private plan:PerformancePlan|null=null;private epoch=-1;private focusSlot=0;private previousFocus=-1;private focusChangedAt=0;private nextFocusAt=0;private decision=0;private lastSection=-1;private seed:number;private focusPos=new THREE.Vector3();private used:number[]=[];private variation=new RegionVariationSystem();',
  'variation system state')
replaceIn(regionPath,
  "if(i===this.focusSlot)s.world.update(t,dt,c,l);else s.world.ambient(t+s.index*.73,dt)",
  "if(i===this.focusSlot)s.world.update(t,dt,c,l);else s.world.ambient(t+s.index*.73,dt);this.variation.apply(s.world.root,s.seed,t,c,l,i===this.focusSlot)",
  'apply variation to every active region')

const analysisPath=src('audioAnalysis.ts')
replaceIn(analysisPath,
  "type WorkerResponse={type:'progress';value:number}|{type:'result';dna:SongDNA}|{type:'error';message:string};",
  "type WorkerResponse={type:'progress';value:number}|{type:'result';dna:SongDNA}|{type:'error';message:string};\nexport type WaveformEnvelope={mins:number[];maxs:number[]};\nlet latestWaveform:WaveformEnvelope|null=null;\nexport const getLatestWaveform=()=>latestWaveform;\nfunction buildWaveformEnvelope(channels:Float32Array[],bins=720):WaveformEnvelope{const length=channels[0]?.length||0,mins=new Array<number>(bins).fill(0),maxs=new Array<number>(bins).fill(0),count=Math.max(1,channels.length);if(!length)return{mins,maxs};for(let i=0;i<bins;i++){const a=Math.floor(i*length/bins),b=Math.max(a+1,Math.floor((i+1)*length/bins));let lo=1,hi=-1;for(let j=a;j<Math.min(length,b);j++){let v=0;for(const ch of channels)v+=(ch[j]||0)/count;if(v<lo)lo=v;if(v>hi)hi=v}mins[i]=Math.max(-1,Math.min(0,lo));maxs[i]=Math.min(1,Math.max(0,hi))}return{mins,maxs}}",
  'waveform envelope capture helpers')
replaceIn(analysisPath,
  "onProgress?.(.06);if(typeof Worker==='undefined'){const mono=mixChannels(channels,isCancelled);return analyzePCM(mono,audio.sampleRate,audio.duration,onProgress,isCancelled,preferredBpm??null)}return new Promise<SongDNA>",
  "const waveform=buildWaveformEnvelope(channels);onProgress?.(.06);if(typeof Worker==='undefined'){const mono=mixChannels(channels,isCancelled);const dna=analyzePCM(mono,audio.sampleRate,audio.duration,onProgress,isCancelled,preferredBpm??null);latestWaveform=waveform;return dna}return new Promise<SongDNA>",
  'capture waveform before worker transfer')
replaceIn(analysisPath,
  "if(m.type==='result')finish(()=>resolve(m.dna));else finish(()=>reject(new Error(m.message)))",
  "if(m.type==='result')finish(()=>{latestWaveform=waveform;resolve(m.dna)});else finish(()=>reject(new Error(m.message)))",
  'publish waveform after analysis')

const wavePath=src('AudioWaveEntity.ts')
const oldWave=readFileSync(wavePath,'utf8')
if(!oldWave.includes('export class AudioWaveEntity')||!oldWave.includes('setProfile(profile:number[],duration:number)'))throw new Error('Visual.X dynamic patch missing: AudioWaveEntity baseline')
const waveSource=`import * as THREE from 'three';
import type { Cue, LiveFrame } from './directorEngine';
import { getLatestWaveform } from './audioAnalysis';
const C=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
export class AudioWaveEntity{
  root=new THREE.Group();private n=720;private futureGeo=new THREE.BufferGeometry();private pastGeo=new THREE.BufferGeometry();private activeGeo=new THREE.BufferGeometry();private futurePos:THREE.BufferAttribute;private pastPos:THREE.BufferAttribute;private activePos:THREE.BufferAttribute;private future:THREE.LineSegments;private past:THREE.LineSegments;private active:THREE.LineSegments;private playheadGeo=new THREE.BufferGeometry();private playheadPos:THREE.BufferAttribute;private playhead:THREE.Line;private glow:THREE.Mesh;private center:THREE.Mesh;private mins=new Float32Array(this.n);private maxs=new Float32Array(this.n);private duration=0;private ready=false;private radius=30.5;private centerY=-5.8;
  constructor(scene:THREE.Scene,_seed:number){const size=this.n*2*3,a=new Float32Array(size),b=new Float32Array(size),c=new Float32Array(size);this.futureGeo.setAttribute('position',new THREE.BufferAttribute(a,3));this.pastGeo.setAttribute('position',new THREE.BufferAttribute(b,3));this.activeGeo.setAttribute('position',new THREE.BufferAttribute(c,3));this.futurePos=this.futureGeo.getAttribute('position')as THREE.BufferAttribute;this.pastPos=this.pastGeo.getAttribute('position')as THREE.BufferAttribute;this.activePos=this.activeGeo.getAttribute('position')as THREE.BufferAttribute;this.future=new THREE.LineSegments(this.futureGeo,new THREE.LineBasicMaterial({color:0x22d3ee,transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.past=new THREE.LineSegments(this.pastGeo,new THREE.LineBasicMaterial({color:0xff2ba6,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.active=new THREE.LineSegments(this.activeGeo,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.88,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));const ph=new Float32Array(6);this.playheadGeo.setAttribute('position',new THREE.BufferAttribute(ph,3));this.playheadPos=this.playheadGeo.getAttribute('position')as THREE.BufferAttribute;this.playhead=new THREE.Line(this.playheadGeo,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.glow=new THREE.Mesh(new THREE.SphereGeometry(.2,14,10),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.center=new THREE.Mesh(new THREE.TorusGeometry(this.radius,.018,5,256),new THREE.MeshBasicMaterial({color:0x8b5cf6,transparent:true,opacity:.13,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.center.rotation.x=Math.PI/2;this.center.position.y=this.centerY;this.root.add(this.center,this.future,this.past,this.active,this.playhead,this.glow);this.root.visible=false;scene.add(this.root)}
  setProfile(profile:number[],duration:number){this.duration=Math.max(0,duration);const exact=getLatestWaveform(),hasExact=Boolean(exact&&exact.mins.length>1&&exact.maxs.length>1),fallback=profile.length>1;this.ready=(hasExact||fallback)&&this.duration>0;if(!this.ready){this.root.visible=false;return}for(let i=0;i<this.n;i++){const q=i/(this.n-1);let lo=0,hi=0;if(hasExact&&exact){const src=q*(exact.mins.length-1),a=Math.floor(src),b=Math.min(exact.mins.length-1,a+1),f=src-a;lo=exact.mins[a]*(1-f)+exact.mins[b]*f;hi=exact.maxs[a]*(1-f)+exact.maxs[b]*f}else{const src=q*(profile.length-1),a=Math.floor(src),b=Math.min(profile.length-1,a+1),f=src-a,amp=C(profile[a]*(1-f)+profile[b]*f);lo=-amp;hi=amp}this.mins[i]=lo;this.maxs[i]=hi;const ang=q*Math.PI*2,x=Math.cos(ang)*this.radius,z=Math.sin(ang)*this.radius,k=i*2;this.futurePos.setXYZ(k,x,this.centerY+lo*2.65,z);this.futurePos.setXYZ(k+1,x,this.centerY+hi*2.65,z);this.pastPos.setXYZ(k,x,this.centerY+lo*2.65,z);this.pastPos.setXYZ(k+1,x,this.centerY+hi*2.65,z);this.activePos.setXYZ(k,x,this.centerY+lo*2.65,z);this.activePos.setXYZ(k+1,x,this.centerY+hi*2.65,z)}this.futurePos.needsUpdate=true;this.pastPos.needsUpdate=true;this.activePos.needsUpdate=true;this.pastGeo.setDrawRange(0,2);this.root.visible=true}
  update(t:number,_dt:number,c:Cue,l:LiveFrame){if(!this.ready||this.duration<=0){this.root.visible=false;return}this.root.visible=true;const q=C(t/this.duration),i=Math.min(this.n-1,Math.floor(q*(this.n-1))),ang=i/(this.n-1)*Math.PI*2,x=Math.cos(ang)*this.radius,z=Math.sin(ang)*this.radius,lo=this.centerY+this.mins[i]*2.65,hi=this.centerY+this.maxs[i]*2.65,mid=(lo+hi)/2;this.pastGeo.setDrawRange(0,Math.max(2,(i+1)*2));const start=Math.max(0,(i-9)*2),count=Math.min(this.n*2-start,38);this.activeGeo.setDrawRange(start,count);this.playheadPos.setXYZ(0,x,lo-.38,z);this.playheadPos.setXYZ(1,x,hi+.38,z);this.playheadPos.needsUpdate=true;this.glow.position.set(x,mid,z);this.glow.scale.setScalar(.9+c.beatPulse*.55+c.onsetPulse*.28+c.phrasePulse*.2);(this.past.material as THREE.LineBasicMaterial).opacity=.4+l.level*.2+c.phrasePulse*.08;(this.future.material as THREE.LineBasicMaterial).opacity=.07+c.tonalStrength*.06;(this.active.material as THREE.LineBasicMaterial).opacity=.62+c.beatPulse*.25+c.onsetPulse*.18;(this.center.material as THREE.MeshBasicMaterial).opacity=.08+c.barPulse*.07}
  updateAmbient(){this.root.visible=false}
  dispose(){this.futureGeo.dispose();this.pastGeo.dispose();this.activeGeo.dispose();this.playheadGeo.dispose();(this.future.material as THREE.Material).dispose();(this.past.material as THREE.Material).dispose();(this.active.material as THREE.Material).dispose();(this.playhead.material as THREE.Material).dispose();this.glow.geometry.dispose();(this.glow.material as THREE.Material).dispose();this.center.geometry.dispose();(this.center.material as THREE.Material).dispose();this.root.removeFromParent()}
}
`
writeFileSync(wavePath,waveSource)
console.log('Patched Visual.X intra-region variation standard + real 360 waveform envelope')
