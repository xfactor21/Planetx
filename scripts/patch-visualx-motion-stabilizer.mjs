import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')

const path = join(appDir, 'src', 'VisualEngine.ts')
let source = readFileSync(path, 'utf8')

const replace = (from, to, label) => {
  if (!source.includes(from)) throw new Error(`Visual.X motion stabilizer missing: ${label}`)
  source = source.replace(from, to)
}

replace(
  'private plan:PerformancePlan|null=null;private lastT=-1;private shake=0;private blackout=0;private flash=0;private diagnostic=false;private lastDiag=-1;',
  'private plan:PerformancePlan|null=null;private lastT=-1;private shake=0;private blackout=0;private flash=0;private diagnostic=false;private lastDiag=-1;private smoothLive:LiveFrame={bass:0,mid:0,treble:0,level:0,flux:0};private smoothPulse={beatPulse:0,barPulse:0,phrasePulse:0,onsetPulse:0,bassPulse:0,midPulse:0,highPulse:0,tonalPulse:0,dropPulse:0};',
  'smoothing state',
)

replace(
  "private safe(c:CameraCue):CameraCue{const f=(v:number,d:number)=>Number.isFinite(v)?v:d;return{...c,fov:C(f(c.fov,64),30,100),z:C(f(c.z,11),-46,46),x:C(f(c.x,0),-46,46),y:C(f(c.y,0),-24,24),roll:C(f(c.roll,0),-.35,.35),focusX:C(f(c.focusX,0),-42,42),focusY:C(f(c.focusY,0),-22,22),focusZ:C(f(c.focusZ,0),-42,42)}}",
  "private safe(c:CameraCue):CameraCue{const f=(v:number,d:number)=>Number.isFinite(v)?v:d;return{...c,fov:C(f(c.fov,64),30,100),z:C(f(c.z,11),-46,46),x:C(f(c.x,0),-46,46),y:C(f(c.y,0),-24,24),roll:C(f(c.roll,0),-.35,.35),focusX:C(f(c.focusX,0),-42,42),focusY:C(f(c.focusY,0),-22,22),focusZ:C(f(c.focusZ,0),-42,42)}}\n  private follow(v:number,target:number,dt:number,attack=7,release=4){const rate=target>v?attack:release;return v+(target-v)*(1-Math.exp(-Math.max(.001,dt)*rate))}\n  private condition(live:LiveFrame,cue:Cue,dt:number){this.smoothLive.bass=this.follow(this.smoothLive.bass,live.bass,dt,6.5,4.2);this.smoothLive.mid=this.follow(this.smoothLive.mid,live.mid,dt,6,3.8);this.smoothLive.treble=this.follow(this.smoothLive.treble,live.treble,dt,6,3.6);this.smoothLive.level=this.follow(this.smoothLive.level,live.level,dt,5.5,3.5);this.smoothLive.flux=this.follow(this.smoothLive.flux,live.flux,dt,8,5);for(const k of Object.keys(this.smoothPulse) as Array<keyof typeof this.smoothPulse>){const target=cue[k] as number;const attack=k==='beatPulse'||k==='onsetPulse'||k==='bassPulse'?11:7;const release=k==='beatPulse'?4.2:k==='onsetPulse'?5.2:3.6;this.smoothPulse[k]=this.follow(this.smoothPulse[k],target,dt,attack,release)}const conditionedCue={...cue,...this.smoothPulse,reactions:cue.reactions.slice(0,2)};return{live:{...this.smoothLive},cue:conditionedCue}}\n  private contain(c:CameraCue):CameraCue{let{x,z,focusX,focusZ}=c;const r=Math.hypot(x,z),fr=Math.hypot(focusX,focusZ),maxR=25.8,maxF=23.5;if(r>maxR){const s=maxR/r;x*=s;z*=s}if(fr>maxF){const s=maxF/fr;focusX*=s;focusZ*=s}return{...c,x,z,focusX,focusZ}}",
  'conditioning helpers',
)

replace(
  "if(r==='fracture')this.shake=Math.max(this.shake,.56);else if(r==='shockwave')this.shake=Math.max(this.shake,.11);",
  "if(r==='fracture')this.shake=Math.max(this.shake,.24);else if(r==='shockwave')this.shake=Math.max(this.shake,.07);",
  'camera shake reduction',
)

replace(
  "update(t:number,cue:Cue,live:LiveFrame,pcm:Float32Array<ArrayBufferLike>|null=null){const dt=this.step(t);this.module.root.visible=false;cue.reactions.forEach(r=>this.react(r,Math.max(live.flux,cue.beatPulse,cue.dropPulse,cue.tonalPulse)));this.constellation.update(t,dt,cue,live);const focus=this.constellation.focus();const actorInterest={position:focus.position.clone(),weight:0};const cam=this.safe(this.constellation.cameraCue(this.safe(cue.camera),t,cue,live,actorInterest));this.wave.update(t,dt,cue,live);this.projectM.update(t,dt,cue,live,focus.position,Math.max(cue.dropPulse*.18,cue.hero?.28:0),this.camera,pcm);",
  "update(t:number,cue:Cue,live:LiveFrame,pcm:Float32Array<ArrayBufferLike>|null=null){const dt=this.step(t);this.module.root.visible=false;const conditioned=this.condition(live,cue,dt),c=conditioned.cue,l=conditioned.live;c.reactions.forEach(r=>this.react(r,Math.max(l.flux,c.beatPulse,c.dropPulse,c.tonalPulse)*.68));this.constellation.update(t,dt,c,l);const focus=this.constellation.focus();const actorInterest={position:focus.position.clone(),weight:0};const cam=this.contain(this.safe(this.constellation.cameraCue(this.safe(c.camera),t,c,l,actorInterest)));this.wave.update(t,dt,c,l);this.projectM.update(t,dt,c,l,focus.position,Math.max(c.dropPulse*.14,c.hero?.22:0),this.camera,pcm);",
  'conditioned runtime update',
)

replace(
  "const bg=new THREE.Color(0x020208),accent=new THREE.Color(PALETTES[(cue.tonalClass+focus.index)%PALETTES.length][2]);bg.lerp(accent,.012+cue.tonalStrength*.018+this.flash*.02);this.renderer.setClearColor(bg,1)}const bloom=Math.min(.5,Math.max(.04,cue.post.bloom*this.profile.bloom*this.world.bloom*.52));this.post.render({...cue.post,bloom,threshold:Math.max(.8,cue.post.threshold),exposure:Math.min(1,Math.max(.82,cue.post.exposure*this.world.exposure*.92))},dt);",
  "const bg=new THREE.Color(0x020208),accent=new THREE.Color(PALETTES[(c.tonalClass+focus.index)%PALETTES.length][2]);bg.lerp(accent,.012+c.tonalStrength*.018+this.flash*.02);this.renderer.setClearColor(bg,1)}const bloom=Math.min(.5,Math.max(.04,c.post.bloom*this.profile.bloom*this.world.bloom*.52));this.post.render({...c.post,bloom,threshold:Math.max(.8,c.post.threshold),exposure:Math.min(1,Math.max(.82,c.post.exposure*this.world.exposure*.92))},dt);",
  'conditioned post processing',
)

writeFileSync(path, source)
console.log('Patched Visual.X source-motion conditioning + camera containment')
