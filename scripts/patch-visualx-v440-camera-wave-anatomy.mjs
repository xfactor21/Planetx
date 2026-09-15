// v4.4.0 preview candidate
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')
const src = (...parts) => join(appDir, 'src', ...parts)

const replaceIn = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Visual.X v4.4.0 patch missing: ${label}`)
  return text.replace(from, to)
}

const wavePath = src('AudioWaveEntity.ts')
let wave = readFileSync(wavePath, 'utf8')
wave = replaceIn(wave,
  "const seam=Math.min(u,1-u),boost=seam<.014?(1-seam/.014)*1.08:0;if(boost>0)this.tempColor.lerp(new THREE.Color(0xffffff),boost);",
  "const seam=Math.min(u,1-u),nowGlow=seam<.022?(1-seam/.022):0,pastTrail=u>.955?(u-.955)/.045:0,boost=Math.min(1,Math.max(nowGlow,pastTrail*.62));if(boost>0)this.tempColor.lerp(pastTrail>nowGlow?this.cyan:new THREE.Color(0xffffff),boost);",
  'waveform now gate and trailing highlight')
wave = replaceIn(wave,
  'this.playheadPos.setXYZ(0,p.x,p.lo-.98,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+.98,p.z);',
  'this.playheadPos.setXYZ(0,p.x,p.lo-1.7,p.z);this.playheadPos.setXYZ(1,p.x,p.hi+1.7,p.z);',
  'full-height playback gate')
wave = replaceIn(wave,
  '(this.wave.material as THREE.LineBasicMaterial).opacity=.8+l.level*.1;',
  '(this.wave.material as THREE.LineBasicMaterial).opacity=.66+l.level*.07;',
  'waveform background restraint')
writeFileSync(wavePath, wave)

const constellationPath = src('RegionConstellationSystem.ts')
let constellation = readFileSync(constellationPath, 'utf8')
constellation = replaceIn(constellation,'this.nextFocusAt=t+9.2;','this.nextFocusAt=t+14.5;','initial camera hold')
constellation = replaceIn(constellation,'this.nextFocusAt=t+9+(h&2047)/2047*3','this.nextFocusAt=t+15+(h&2047)/2047*5','longer hero-region shot duration')
constellation = replaceIn(constellation,
  "const fov=C((isBreak?71:57)+wide*13+c.onsetPulse*.45-c.buildPressure*3.2,46,82),damping=wide>.2?2.9:5.1+c.motionSpeed*1.25;return{...base,x:pos.x,y:pos.y,z:pos.z,focusX:focus.x,focusY:focus.y,focusZ:focus.z,fov,roll:Math.sin(a*.42)*.012*(1-wide),damping,snap:false,shot:wide>.35?'reveal':'orbit'}}",
  "const fov=C((isBreak?66:58)+wide*6-c.buildPressure*1.1,52,70),damping=wide>.2?8.2:10.4;return{...base,x:pos.x,y:pos.y,z:pos.z,focusX:focus.x,focusY:focus.y,focusZ:focus.z,fov,roll:0,damping,snap:false,shot:wide>.35?'reveal':'orbit'}}",
  'locked fov roll and high camera damping')
writeFileSync(constellationPath, constellation)

const enginePath = src('VisualEngine.ts')
let engine = readFileSync(enginePath, 'utf8')
engine = replaceIn(engine,"const waveTour=t>=30&&(t%30)<3;","const waveTour=false;",'remove periodic waveform camera takeover')
engine = replaceIn(engine,
  "const raw=cue[k] as number,scale=k==='beatPulse'?.34:k==='onsetPulse'?.48:k==='bassPulse'?.72:k==='midPulse'?.82:k==='highPulse'?.82:1,target=raw*scale,attack=k==='beatPulse'?4.8:k==='onsetPulse'?5.4:6.2,release=k==='beatPulse'?2.3:k==='onsetPulse'?3.2:3.5;",
  "const raw=cue[k] as number,scale=k==='beatPulse'?.18:k==='onsetPulse'?.28:k==='bassPulse'?.55:k==='midPulse'?.7:k==='highPulse'?.7:1,target=raw*scale,attack=k==='beatPulse'?3.8:k==='onsetPulse'?4.4:5.4,release=k==='beatPulse'?2:k==='onsetPulse'?2.8:3.2;",
  'less impulsive component drive')
writeFileSync(enginePath, engine)

const worldPath = src('worldModules.ts')
let world = readFileSync(worldPath, 'utf8')
world = replaceIn(world,
  'const rollTarget=this.precession*.09*Math.sin(t*.14);this.root.rotation.z+=(rollTarget-this.root.rotation.z)*Math.min(1,dt*1.35)',
  'const rollTarget=this.precession*.04*Math.sin(t*.11);this.root.rotation.z+=(rollTarget-this.root.rotation.z)*Math.min(1,dt*.9)',
  'orbital root motion reduced so planet and ring motion reads independently')
world = replaceIn(world,'this.root.rotation.y+=dt*(.0015+l.mid*.0035);','this.root.rotation.y+=dt*(.0005+l.mid*.0012);','monolith root motion reduced to near-static stage')
world = replaceIn(world,
  'this.root.rotation.y+=dt*(.008+l.mid*.035);this.root.rotation.x=Math.sin(t*.045)*.035',
  'this.root.rotation.y+=dt*(.0025+l.mid*.012);this.root.rotation.x=Math.sin(t*.035)*.014',
  'crystal lattice root motion reduced so propagation reads locally')
writeFileSync(worldPath, world)

const appPath = src('App.tsx')
let app = readFileSync(appPath, 'utf8')
if (!app.includes('EXPERT MODE')) throw new Error('Visual.X v4.4.0 patch missing: Expert drawer heading')
app = app.replace('EXPERT MODE', 'VISUAL.X v4.4.0 · EXPERT MODE')
writeFileSync(appPath, app)

console.log('Patched Visual.X v4.4.0 camera stability, waveform NOW indicator, component anatomy cleanup, and build label')
