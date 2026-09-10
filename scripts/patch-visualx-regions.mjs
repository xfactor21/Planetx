import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const appDir = process.argv[2]
if (!appDir) throw new Error('Visual.X app directory required')

const regionPath = join(appDir, 'src', 'RegionConstellationSystem.ts')
let source = readFileSync(regionPath, 'utf8')

const replace = (from, to, label) => {
  if (!source.includes(from)) throw new Error(`Visual.X region patch missing: ${label}`)
  source = source.replace(from, to)
}

replace(
  'private slots:Slot[]=[];private leaving:Leaving[]=[];private plan:PerformancePlan|null=null;private epoch=-1;private focusSlot=0;private previousFocus=-1;private focusChangedAt=0;private nextFocusAt=0;private decision=0;private lastSection=-1;private seed:number;private focusPos=new THREE.Vector3();',
  'private slots:Slot[]=[];private leaving:Leaving[]=[];private plan:PerformancePlan|null=null;private epoch=-1;private focusSlot=0;private previousFocus=-1;private focusChangedAt=0;private nextFocusAt=0;private decision=0;private lastSection=-1;private seed:number;private focusPos=new THREE.Vector3();private used:number[]=[];',
  'used-region history state',
)
replace(
  'private count(){return window.innerWidth>=900?6:window.innerWidth>=640?5:4}',
  'private count(){return Math.min(6,WORLD_COUNT)}',
  'six active regions on all viewports',
)
replace(
  'private rebuild(epoch:number,t:number){for(const s of this.slots)this.leaving.push({slot:s,age:0,from:s.world.root.position.clone()});this.slots=[];this.epoch=epoch;const n=this.count(),indices=this.pick(epoch,n);for(let i=0;i<n;i++)this.slots.push(this.createSlot(indices[i],i,epoch,t,n));this.previousFocus=-1;this.focusSlot=0;this.focusChangedAt=t;this.nextFocusAt=t+9.2;this.decision=0}',
  "private remember(index:number){this.used=this.used.filter(x=>x!==index);this.used.push(index);if(this.used.length>WORLD_COUNT)this.used=this.used.slice(-WORLD_COUNT)}\n  private nextUnused(slot:number){const active=new Set(this.slots.map((s,i)=>i===slot?-1:s.index)),fresh=Array.from({length:WORLD_COUNT},(_,i)=>i).filter(i=>!active.has(i)&&!this.used.includes(i)),pool=fresh.length?fresh:Array.from({length:WORLD_COUNT},(_,i)=>i).filter(i=>!active.has(i));const h=this.H(this.epoch*4099+this.decision*977+slot*131);return pool[h%pool.length]}\n  private rotateSlot(slot:number,t:number,c:Cue){if(slot<0||slot>=this.slots.length||WORLD_COUNT<=this.slots.length)return;const old=this.slots[slot],next=this.nextUnused(slot);if(next===old.index)return;this.leaving.push({slot:old,age:0,from:old.world.root.position.clone()});const replacement=this.createSlot(next,slot,this.epoch,t,this.slots.length);replacement.world.setSection(c.section.label,c.section.repeatGroup,c.section.importance);this.slots[slot]=replacement;this.remember(next)}\n  private rebuild(epoch:number,t:number){for(const s of this.slots)this.leaving.push({slot:s,age:0,from:s.world.root.position.clone()});this.slots=[];this.epoch=epoch;const n=this.count(),indices=this.pick(epoch,n);for(let i=0;i<n;i++){this.slots.push(this.createSlot(indices[i],i,epoch,t,n));this.remember(indices[i])}this.previousFocus=-1;this.focusSlot=0;this.focusChangedAt=t;this.nextFocusAt=t+9.2;this.decision=0}",
  'rotation helpers and rebuild history',
)
replace(
  'setPlan(p:PerformancePlan|null){this.plan=p;this.epoch=-1;this.lastSection=-1;if(!p){this.disposeSlots();this.disposeLeaving()}}',
  'setPlan(p:PerformancePlan|null){this.plan=p;this.epoch=-1;this.lastSection=-1;this.used=[];this.decision=0;if(!p){this.disposeSlots();this.disposeLeaving()}}',
  'reset region history for a new plan',
)
replace(
  'private chooseFocus(t:number,c:Cue,l:LiveFrame,force=false){if(!this.slots.length)return;let best=-1,bestScore=-1e9;for(let i=0;i<this.slots.length;i++){if(!force&&i===this.focusSlot)continue;let s=this.score(this.slots[i],c,l);if(this.slots[i].index===this.previousFocus)s-=.22;s+=(this.H(this.decision*997+i*41+this.epoch*131)&255)/255*.055;if(s>bestScore){bestScore=s;best=i}}if(best<0)best=0;this.previousFocus=this.slots[this.focusSlot]?.index??-1;this.focusSlot=best;this.focusChangedAt=t;this.decision++;const h=this.H(this.epoch*1613+this.decision*811);this.nextFocusAt=t+9+(h&2047)/2047*3}',
  'private chooseFocus(t:number,c:Cue,l:LiveFrame,force=false){if(!this.slots.length)return;const oldSlot=this.focusSlot,oldIndex=this.slots[oldSlot]?.index??-1;let best=-1,bestScore=-1e9;for(let i=0;i<this.slots.length;i++){if(!force&&i===this.focusSlot)continue;let s=this.score(this.slots[i],c,l);if(this.slots[i].index===this.previousFocus)s-=.22;s+=(this.H(this.decision*997+i*41+this.epoch*131)&255)/255*.055;if(s>bestScore){bestScore=s;best=i}}if(best<0)best=0;this.previousFocus=oldIndex;this.focusSlot=best;this.focusChangedAt=t;this.decision++;if(!force&&best!==oldSlot)this.rotateSlot(oldSlot,t,c);const h=this.H(this.epoch*1613+this.decision*811);this.nextFocusAt=t+9+(h&2047)/2047*3}',
  'replace departed focus region',
)

writeFileSync(regionPath, source)
console.log('Patched Visual.X region rotation')
