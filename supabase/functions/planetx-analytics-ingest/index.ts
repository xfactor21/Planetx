import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'npm:jose@6.1.0';
import { filterSummaryRows } from './summary-filter.mjs';

const COMMAND_CENTER_AUTH = 'https://dashboard.planet-x.co/api/events/authorize';
const HEADER = 'X-PlanetX-Analytics-Key';
const ALLOWED_ORIGINS = new Set([
  'https://planet-x.co', 'https://www.planet-x.co', 'https://dashboard.planet-x.co',
  'https://planet-x-command-center-y9yp7m.v2.appdeploy.ai',
  'https://vsx-new.vercel.app', 'https://studyhive.buzz', 'https://www.studyhive.buzz',
  'https://bdxm-beta.vercel.app', 'https://projectx-tau-six.vercel.app', 'https://xfactor-os.vercel.app',
  'https://xmemiors.vercel.app', 'https://xos-nexus-live.vercel.app', 'https://xforge-beta.vercel.app',
  'https://xconnect-six.vercel.app', 'https://xos95.vercel.app',
]);
const SOURCE_ALIASES: Record<string, string[]> = {
  'planet-x.co': ['planet-x.co', 'planetx', 'planet-x', 'website'],
  'visual-x': ['visual-x', 'visualx', 'visual-x-app'],
  'voice-studio-x': ['voice-studio-x', 'voice-studio', 'vsx'],
  'studyhive': ['studyhive', 'study-hive'],
  'bdxm': ['bdxm', 'bdxm-app'],
  'project-x': ['project-x', 'projectx'],
  'xfactor-os': ['xfactor-os', 'xfactor.os'],
  'xmemoirs': ['xmemoirs', 'xmemiors', 'cortex'],
  'xos-nexus': ['xos-nexus', 'xos-nexus-live', 'nexus'],
  'xforge': ['xforge', 'xforge-beta'],
  'xconnect': ['xconnect', 'x-connect'],
  'xos-95': ['xos-95', 'xos95', 'xos.95'],
};
const VISUAL_METADATA = ['generation_id','world_id','song_source','remix_parent_world_id','referral_world_id','quality','duration_seconds','aspect_ratio','export_format','share_source','featured_track_id','analysis_cache','file_type','remix'] as const;
const PAGE_VIEW_EVENTS = new Set(['page_view', 'pageview']);
const BATCH_SIZE = 1000;
const MAX_SUMMARY_ROWS = 10000;

type Row = { event:string; timestamp:string; source_product:string; source_surface:string; session_id:string; anonymous_user_id:string; path:string; platform:string; properties:Record<string,unknown>|string|null };
const text=(value:unknown,max=300)=>String(value??'').trim().slice(0,max);
const object=(value:unknown):Record<string,unknown>=>{if(value&&typeof value==='object'&&!Array.isArray(value))return value as Record<string,unknown>;if(typeof value==='string'){try{const parsed=JSON.parse(value);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))return parsed as Record<string,unknown>}catch{return {}}}return {}};
const normalizeSource=(value:unknown)=>{const source=text(value,64).toLowerCase();for(const[canonical,aliases]of Object.entries(SOURCE_ALIASES))if(aliases.includes(source))return canonical;return source};
const headersFor=(req:Request)=>{const origin=req.headers.get('Origin')||'';const allowed=ALLOWED_ORIGINS.has(origin)?origin:'https://planet-x.co';return{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':`Content-Type, ${HEADER}`,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Cache-Control':'no-store, max-age=0','Content-Type':'application/json','Vary':'Origin'}};
const response=(req:Request,body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:headersFor(req)});

const VERCEL_ISSUERS=new Set(['https://oidc.vercel.com','https://oidc.vercel.com/xfactor21s-projects']);
const VERCEL_PROJECT_SOURCES:Record<string,string>={'vsx-new':'voice-studio-x','studyhive-a':'studyhive','bdxm':'bdxm','projectx':'project-x','xfactor-os':'xfactor-os','xmemiors':'xmemoirs','xos-nexus-live':'xos-nexus','xforge-beta':'xforge','xconnect':'xconnect','xos.95':'xos-95','xos95':'xos-95'};
const jwksByIssuer=new Map<string,ReturnType<typeof createRemoteJWKSet>>();
async function authorizeVercel(value:string,source:string){const token=value.startsWith('Bearer ')?value.slice(7):'';if(!token)return false;try{const issuer=text(decodeJwt(token).iss,200);if(!VERCEL_ISSUERS.has(issuer))return false;let jwks=jwksByIssuer.get(issuer);if(!jwks){jwks=createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks`));jwksByIssuer.set(issuer,jwks)}const{payload}=await jwtVerify(token,jwks,{issuer,audience:'https://vercel.com/xfactor21s-projects'});const match=/^owner:xfactor21s-projects:project:([^:]+):environment:(production|preview)$/.exec(text(payload.sub,300));return Boolean(match&&VERCEL_PROJECT_SOURCES[match[1]]===source)}catch{return false}}
async function authorize(key:string,authorization:string,source:string){const localKey=Deno.env.get('PLANETX_ANALYTICS_KEY')||Deno.env.get('PLANETX_ANALYTICS_INGEST_KEY')||'';if(key&&localKey&&key===localKey)return true;if(key){try{if((await fetch(COMMAND_CENTER_AUTH,{method:'GET',headers:{[HEADER]:key,'User-Agent':'planetx-analytics-ingress/2.0'}})).ok)return true}catch{}}return authorizeVercel(authorization,source)}
async function loadRows(client:ReturnType<typeof createClient>,product:string,from:string,to:string){const rows:Row[]=[];for(let offset=0;offset<MAX_SUMMARY_ROWS;offset+=BATCH_SIZE){let query=client.from('planetx_analytics_events').select('event,timestamp,source_product,source_surface,session_id,anonymous_user_id,path,platform,properties').in('source_product',SOURCE_ALIASES[product]).order('timestamp',{ascending:false}).range(offset,offset+BATCH_SIZE-1);if(from)query=query.gte('timestamp',from);if(to)query=query.lte('timestamp',to);const{data,error}=await query;if(error)throw error;const page=(data||[])as Row[];rows.push(...page);if(page.length<BATCH_SIZE)break}return{rows,sampled:rows.length>=MAX_SUMMARY_ROWS}}

function helpers(rows:Row[]){
  const counts:Record<string,number>={};for(const row of rows)counts[row.event]=(counts[row.event]||0)+1;
  const count=(...names:string[])=>names.reduce((sum,name)=>sum+(counts[name]||0),0);
  const top=(values:string[],limit=8)=>{const result:Record<string,number>={};for(const value of values)if(value)result[value]=(result[value]||0)+1;return Object.entries(result).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit).map(([label,value])=>({label,value}))};
  const unique=(set:Row[],field:'session_id'|'anonymous_user_id')=>new Set(set.map(row=>text(row[field],128)).filter(Boolean)).size;
  const daily=Array.from(rows.reduce((map,row)=>{const date=row.timestamp.slice(0,10);const item=map.get(date)||{date,events:0,visitors:new Set<string>(),sessions:new Set<string>(),pageViews:0,primary:0,secondary:0};item.events++;if(row.anonymous_user_id)item.visitors.add(row.anonymous_user_id);if(row.session_id)item.sessions.add(row.session_id);if(PAGE_VIEW_EVENTS.has(row.event)||row.event==='visual_x_page_view')item.pageViews++;if(row.event==='product_view'||row.event==='generation_started')item.primary++;if(row.event==='product_cta_click'||row.event==='generation_completed')item.secondary++;map.set(date,item);return map},new Map<string,{date:string;events:number;visitors:Set<string>;sessions:Set<string>;pageViews:number;primary:number;secondary:number}>()).values()).sort((a,b)=>a.date.localeCompare(b.date)).map(d=>({date:d.date,events:d.events,visitors:d.visitors.size,sessions:d.sessions.size,pageViews:d.pageViews,primary:d.primary,secondary:d.secondary}));
  const pulse=rows.slice(0,16).map(row=>{const props=object(row.properties);return{event:row.event,timestamp:row.timestamp,path:text(row.path,120),platform:text(row.platform,40),surface:text(row.source_surface,48),label:text(props.product_name||props.product_id||props.app_name||props.song_source||'',80)}});
  return{counts,count,top,unique,daily,pulse};
}

function summarize(req:Request,rows:Row[],product:string,sampled:boolean,from:string,to:string){
  const h=helpers(rows);const window={from:from||null,to:to||null,label:from||to?'Selected window':'All recorded history'};
  if(product==='visual-x'){
    const generatedEvents=new Set(['generation_completed','generation_complete']);
    const referred=rows.filter(row=>generatedEvents.has(row.event)&&Boolean(text(object(row.properties).referral_world_id||object(row.properties).referralWorldId,128))).length;
    return response(req,{source:'Visual.X',status:'online',systemOfRecord:'shared-ledger',fetchedAt:new Date().toISOString(),total:rows.length,sampled,window,counts:h.counts,trend:h.daily,pulse:h.pulse,funnel:{started:h.count('generation_started','generation_start'),generated:h.count('generation_completed','generation_complete'),recorded:h.count('record_completed','record_complete'),exported:h.count('export_completed','export_complete'),shared:h.count('share_invoked','share'),converted:h.count('planetx_conversion'),referred}});
  }
  if(product!=='planet-x.co'){
    const pageViews=rows.filter(row=>PAGE_VIEW_EVENTS.has(row.event));
    return response(req,{source:product,status:'online',systemOfRecord:'shared-ledger',fetchedAt:new Date().toISOString(),total:rows.length,sampled,window,trend:h.daily,pulse:h.pulse,traffic:{visitors:h.unique(rows,'anonymous_user_id'),sessions:h.unique(rows,'session_id'),pageViews:pageViews.length,topPages:h.top(pageViews.map(row=>text(row.path,300))),platforms:h.top(rows.map(row=>text(row.platform,64)||'unknown'))},events:h.top(rows.map(row=>text(row.event,96)),16)});
  }
  const pageViews=rows.filter(row=>PAGE_VIEW_EVENTS.has(row.event));const earliestBySession=new Map<string,Row>();for(const row of pageViews){const key=text(row.session_id,128)||text(row.anonymous_user_id,128)||`${row.timestamp}:${row.path}`;const previous=earliestBySession.get(key);if(!previous||Date.parse(row.timestamp)<Date.parse(previous.timestamp))earliestBySession.set(key,row)}
  const betaStarts=h.count('beta_application_submit_attempt','beta_application_started');const betaDone=h.count('beta_application_submit_success','beta_application_completed');const visualWrapperViews=pageViews.filter(row=>/^\/visual-x(?:\/|$)/.test(text(row.path,300).split('?')[0])).length;
  const storeMap=new Map<string,{label:string;views:number;clicks:number;launches:number}>();for(const row of rows){if(!['product_view','product_cta_click','external_app_launch'].includes(row.event))continue;const props=object(row.properties);const label=text(props.product_name||props.product_id||props.app_name||'Unlabeled product',80);const item=storeMap.get(label)||{label,views:0,clicks:0,launches:0};if(row.event==='product_view')item.views++;if(row.event==='product_cta_click')item.clicks++;if(row.event==='external_app_launch')item.launches++;storeMap.set(label,item)}
  const products=[...storeMap.values()].sort((a,b)=>(b.views+b.clicks+b.launches)-(a.views+a.clicks+a.launches)).map(item=>({...item,intentRate:item.views?Math.round(item.clicks/item.views*100):0}));
  return response(req,{source:'planet-x.co',status:'online',systemOfRecord:'shared-ledger',fetchedAt:new Date().toISOString(),total:rows.length,sampled,window,trend:h.daily,pulse:h.pulse,traffic:{visitors:h.unique(rows,'anonymous_user_id'),sessions:h.unique(rows,'session_id'),pageViews:pageViews.length,topLandingPages:h.top([...earliestBySession.values()].map(row=>text(row.path,300))),referrers:h.top(pageViews.map(row=>{const props=object(row.properties);return text(props.referrer||props.source||'Direct / unknown',300)})),platforms:h.top(rows.map(row=>text(row.platform,64)||'unknown'))},interest:{productViews:h.count('product_view'),productClicks:h.count('product_cta_click'),betaCtaClicks:h.count('beta_cta_click'),externalAppLaunches:h.count('external_app_launch'),visualXTraffic:visualWrapperViews+h.count('visual_x_page_view','visual_x_interest_click')},conversion:{betaStarts,betaCompletions:betaDone,waitlistJoins:h.count('waitlist_submit_success'),conversionRate:betaStarts?Math.round(betaDone/betaStarts*100):0},music:{engagements:h.count('music_play','music_track_complete','music_download','music_first_play'),plays:h.count('music_play','music_first_play'),completes:h.count('music_track_complete'),downloads:h.count('music_download')},store:{views:h.count('product_view'),purchaseIntents:h.count('product_cta_click'),externalLaunches:h.count('external_app_launch'),intentRate:h.count('product_view')?Math.round(h.count('product_cta_click')/h.count('product_view')*100):0,products},events:h.top(rows.map(row=>text(row.event,96)),16)});
}

Deno.serve(async(req:Request)=>{if(req.method==='OPTIONS')return new Response(null,{status:204,headers:headersFor(req)});const url=new URL(req.url);const client=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  if(req.method==='POST'){const key=req.headers.get(HEADER)||'';let body:Record<string,unknown>;try{body=object(await req.json())}catch{return response(req,{error:'Invalid JSON'},400)}const requestedSource=normalizeSource(body.source_product);if(!(await authorize(key,req.headers.get('Authorization')||'',requestedSource)))return response(req,{error:'Unauthorized'},401);const event=text(body.event,96);if(!/^[a-z0-9_.-]{2,96}$/i.test(event))return response(req,{error:'Invalid event'},400);const sourceProduct=normalizeSource(body.source_product);if(!SOURCE_ALIASES[sourceProduct])return response(req,{error:'Invalid source_product'},400);const timestamp=text(body.timestamp,64)||new Date().toISOString();if(!Number.isFinite(Date.parse(timestamp)))return response(req,{error:'Invalid timestamp'},400);const properties={...object(body.properties)};for(const field of VISUAL_METADATA)if(properties[field]===undefined&&body[field]!==undefined)properties[field]=body[field];delete properties.ip;delete properties.ip_address;delete properties.remote_addr;if(JSON.stringify(properties).length>16000)return response(req,{error:'Properties too large'},400);const row={id:crypto.randomUUID(),event,timestamp,source_product:sourceProduct,source_surface:text(body.source_surface,64)||(sourceProduct==='visual-x'?'visual-x-app':'website'),session_id:text(body.session_id,128),anonymous_user_id:text(body.anonymous_user_id,128),path:text(body.path,300),platform:text(body.platform,64),properties};if(!row.session_id||!row.anonymous_user_id||!row.path)return response(req,{error:'Missing analytics identity or path'},400);let writeError:unknown=null;for(let attempt=0;attempt<2;attempt++){const result=await client.from('planetx_analytics_events').upsert(row,{onConflict:'id',ignoreDuplicates:true});writeError=result.error;if(!writeError)break;if(attempt===0)await new Promise(resolve=>setTimeout(resolve,75))}if(writeError)return response(req,{error:'Write failed'},500);return response(req,{ok:true})}
  if(req.method==='GET'&&url.searchParams.get('mode')==='summary'){const product=normalizeSource(url.searchParams.get('source_product'));if(!SOURCE_ALIASES[product])return response(req,{error:'Invalid source_product'},400);const from=text(url.searchParams.get('from'),64);const to=text(url.searchParams.get('to'),64);if((from&&!Number.isFinite(Date.parse(from)))||(to&&!Number.isFinite(Date.parse(to))))return response(req,{error:'Invalid time window'},400);try{const{rows,sampled}=await loadRows(client,product,from,to);const summaryRows=filterSummaryRows(rows);return summarize(req,summaryRows,product,sampled,from,to)}catch(cause){console.error('Summary read failed',cause);return response(req,{error:'Read failed'},500)}}return response(req,{error:'Not found'},404)});
