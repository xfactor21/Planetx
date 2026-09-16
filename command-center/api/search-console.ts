type GoogleConfig={client_email:string;private_key:string;search_console_site_url?:string;analytics_property_id?:string};
const GOOGLE_NAME='GOOGLE_INSIGHTS_CONFIG';
const enc=(value:string)=>new TextEncoder().encode(value);
const json=(res:any,status:number,body:unknown)=>res.status(status).json(body);
const isoDate=(date:Date)=>date.toISOString().slice(0,10);
const num=(value:unknown)=>Number(value||0);
const round=(value:number,digits=1)=>{const m=10**digits;return Math.round(value*m)/m};
const b64url=(value:string|Uint8Array)=>{const bytes=typeof value==='string'?enc(value):value;let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};

async function googleConfig():Promise<GoogleConfig|null>{const raw=process.env[GOOGLE_NAME];if(!raw)return null;try{const parsed=JSON.parse(raw) as GoogleConfig;return parsed.client_email&&parsed.private_key?parsed:null}catch{return null}}
async function googleToken(config:GoogleConfig){const now=Math.floor(Date.now()/1000);const header=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));const payload=b64url(JSON.stringify({iss:config.client_email,scope:'https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));const pem=config.private_key.replace(/\\n/g,'\n').replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,'');const der=Uint8Array.from(atob(pem),c=>c.charCodeAt(0));const key=await crypto.subtle.importKey('pkcs8',der,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);const signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,enc(`${header}.${payload}`));const body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:`${header}.${payload}.${b64url(new Uint8Array(signature))}`});const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});if(!response.ok)throw new Error(`Google authorization returned ${response.status}`);const result=await response.json() as {access_token?:string};if(!result.access_token)throw new Error('Google authorization returned no token');return result.access_token}
async function post(url:string,token:string,body:unknown){const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Google API returned ${response.status}`);return payload as any}
async function get(url:string,token:string){const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'},cache:'no-store'});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Google API returned ${response.status}`);return payload as any}

function parseRange(value:unknown){const range=String(value||'30d').toLowerCase();const valid=new Set(['24h','7d','30d','90d','180d']);return valid.has(range)?range:'30d'}
function ranges(range:string){const now=new Date();const settled=new Date(now);settled.setUTCDate(settled.getUTCDate()-2);const end=range==='24h'?now:settled;const days=range==='24h'?2:Number(range.replace('d',''));const start=new Date(end);start.setUTCDate(start.getUTCDate()-days+1);const previousEnd=new Date(start);previousEnd.setUTCDate(previousEnd.getUTCDate()-1);const previousStart=new Date(previousEnd);previousStart.setUTCDate(previousStart.getUTCDate()-days+1);return{current:{startDate:isoDate(start),endDate:isoDate(end)},previous:{startDate:isoDate(previousStart),endDate:isoDate(previousEnd)},settledThrough:isoDate(settled)}}
function totals(rows:any[]){const agg=(rows||[]).reduce((a,r)=>{a.clicks+=num(r.clicks);a.impressions+=num(r.impressions);a.positionWeighted+=num(r.position)*num(r.impressions);return a},{clicks:0,impressions:0,positionWeighted:0});return{clicks:agg.clicks,impressions:agg.impressions,ctr:agg.impressions?round(agg.clicks/agg.impressions*100,2):0,position:agg.impressions?round(agg.positionWeighted/agg.impressions,2):0}}
function delta(current:number,previous:number){if(!previous)return current?100:0;return round((current-previous)/previous*100,1)}
function metricRow(r:any,label:string){return{label,clicks:num(r.clicks),impressions:num(r.impressions),ctr:round(num(r.ctr)*100,2),position:round(num(r.position),2)}}
function stripHost(value:string){return value.replace(/^https?:\/\/[^/]+/,'')||'/'}
function opportunitySets(rows:any[]){const normalized=(rows||[]).map(r=>metricRow(r,String(r.keys?.[0]||''))).filter(r=>r.label);return{
 nearWins:normalized.filter(r=>r.impressions>=5&&r.position>=4&&r.position<=20).sort((a,b)=>b.impressions-a.impressions).slice(0,20),
 lowCtr:normalized.filter(r=>r.impressions>=5&&r.ctr<2&&r.position<=20).sort((a,b)=>b.impressions-a.impressions).slice(0,20),
 zeroClick:normalized.filter(r=>r.impressions>=3&&r.clicks===0&&r.position<=20).sort((a,b)=>b.impressions-a.impressions).slice(0,20),
}}

export default async function handler(req:any,res:any){
 if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
 const config=await googleConfig();if(!config?.search_console_site_url)return json(res,200,{status:'setup_required',configured:false,message:'Search Console is not configured in GOOGLE_INSIGHTS_CONFIG.'});
 try{
  const token=await googleToken(config);const range=parseRange(req.query?.range);const r=ranges(range);const site=config.search_console_site_url;const endpoint=`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;const dataState=range==='24h'?'hourly_all':'all';
  const base={...r.current,dataState};const previous={...r.previous,dataState:'all'};
  const [trendRaw,previousRaw,queriesRaw,pagesRaw,countriesRaw,devicesRaw,appearanceRaw,sitemapsRaw]=await Promise.all([
   post(endpoint,token,{...base,dimensions:range==='24h'?['date','hour']:['date'],rowLimit:range==='24h'?100:250}),
   post(endpoint,token,{...previous,dimensions:['date'],rowLimit:250}),
   post(endpoint,token,{...base,dimensions:['query'],rowLimit:100}),
   post(endpoint,token,{...base,dimensions:['page'],rowLimit:100}),
   post(endpoint,token,{...base,dimensions:['country'],rowLimit:50}),
   post(endpoint,token,{...base,dimensions:['device'],rowLimit:20}),
   post(endpoint,token,{...base,dimensions:['searchAppearance'],rowLimit:50}).catch(()=>({rows:[]})),
   get(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps`,token).catch(()=>({sitemap:[]})),
  ]);
  let trend=(trendRaw.rows||[]).map((row:any)=>({date:String(row.keys?.[0]||''),hour:range==='24h'?Number(row.keys?.[1]||0):undefined,clicks:num(row.clicks),impressions:num(row.impressions),ctr:round(num(row.ctr)*100,2),position:round(num(row.position),2)}));
  if(range==='24h'){const cutoff=Date.now()-24*60*60*1000;trend=trend.filter((row:any)=>{const stamp=Date.parse(`${row.date}T${String(row.hour).padStart(2,'0')}:00:00Z`);return stamp>=cutoff}).sort((a:any,b:any)=>a.date.localeCompare(b.date)||a.hour-b.hour)}
  const currentTotals=totals(range==='24h'?trend:trendRaw.rows||[]);const previousTotals=totals(previousRaw.rows||[]);
  const queries=(queriesRaw.rows||[]).map((row:any)=>metricRow(row,String(row.keys?.[0]||'Unknown query')));
  const pages=(pagesRaw.rows||[]).map((row:any)=>({...metricRow(row,stripHost(String(row.keys?.[0]||'/'))),url:String(row.keys?.[0]||'')}));
  const countries=(countriesRaw.rows||[]).map((row:any)=>metricRow(row,String(row.keys?.[0]||'Unknown')));
  const devices=(devicesRaw.rows||[]).map((row:any)=>metricRow(row,String(row.keys?.[0]||'Unknown')));
  const searchAppearance=(appearanceRaw.rows||[]).map((row:any)=>metricRow(row,String(row.keys?.[0]||'Unknown')));
  const inspectUrls=pages.slice(0,8).map((p:any)=>p.url).filter((url:string)=>/^https?:\/\//.test(url));
  const indexing=await Promise.all(inspectUrls.map(async(url:string)=>{try{const result=await post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',token,{inspectionUrl:url,siteUrl:site,languageCode:'en-US'});const status=result.inspectionResult?.indexStatusResult||{};return{url,path:stripHost(url),verdict:status.verdict||'VERDICT_UNSPECIFIED',coverageState:status.coverageState||'Unknown',indexingState:status.indexingState||'Unknown',pageFetchState:status.pageFetchState||'Unknown',robotsTxtState:status.robotsTxtState||'Unknown',lastCrawlTime:status.lastCrawlTime||null,googleCanonical:status.googleCanonical||null,userCanonical:status.userCanonical||null}}catch{return{url,path:stripHost(url),verdict:'ERROR',coverageState:'Inspection unavailable'}}}));
  const sitemaps=(sitemapsRaw.sitemap||[]).map((item:any)=>({path:item.path||'',lastSubmitted:item.lastSubmitted||null,lastDownloaded:item.lastDownloaded||null,isPending:Boolean(item.isPending),warnings:num(item.warnings),errors:num(item.errors),contents:(item.contents||[]).map((c:any)=>({type:c.type||'',submitted:num(c.submitted),indexed:num(c.indexed)}))}));
  return json(res,200,{status:'connected',configured:true,site,range,partial:range==='24h',settledThrough:r.settledThrough,fetchedAt:new Date().toISOString(),totals:currentTotals,comparison:{totals:previousTotals,delta:{clicks:delta(currentTotals.clicks,previousTotals.clicks),impressions:delta(currentTotals.impressions,previousTotals.impressions),ctr:round(currentTotals.ctr-previousTotals.ctr,2),position:round(currentTotals.position-previousTotals.position,2)}},trend,queries,pages,countries,devices,searchAppearance,indexing,sitemaps,opportunities:opportunitySets(queriesRaw.rows||[])});
 }catch(cause){console.error('Search intelligence failed.',cause);return json(res,502,{status:'error',configured:true,message:cause instanceof Error?cause.message:'Search Console is currently unavailable.'})}
}
