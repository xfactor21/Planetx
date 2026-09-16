declare const process:{env:Record<string,string|undefined>};
type GoogleConfig={client_email:string;private_key:string;search_console_site_url?:string;analytics_property_id?:string};
type MetricRow={keys?:string[];clicks?:number;impressions?:number;ctr?:number;position?:number};
const GOOGLE_NAME='GOOGLE_INSIGHTS_CONFIG';
const DEFAULT_SITE='sc-domain:planet-x.co';
const enc=(value:string)=>new TextEncoder().encode(value);
const json=(res:any,status:number,body:unknown)=>{res.status(status).setHeader('Content-Type','application/json');res.setHeader('Cache-Control','private, max-age=0, s-maxage=900, stale-while-revalidate=1800');return res.json(body)};
function b64url(value:string|Uint8Array){const bytes=typeof value==='string'?enc(value):value;let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function config():Promise<GoogleConfig|null>{const raw=process.env[GOOGLE_NAME];if(!raw)return null;try{const parsed=JSON.parse(raw) as GoogleConfig;return parsed.client_email&&parsed.private_key?parsed:null}catch{return null}}
async function tokenFor(c:GoogleConfig){const now=Math.floor(Date.now()/1000),header=b64url(JSON.stringify({alg:'RS256',typ:'JWT'})),payload=b64url(JSON.stringify({iss:c.client_email,scope:'https://www.googleapis.com/auth/webmasters.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));const pem=c.private_key.replace(/\\n/g,'\n').replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,'');const der=Uint8Array.from(atob(pem),char=>char.charCodeAt(0));const key=await crypto.subtle.importKey('pkcs8',der,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);const signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,enc(`${header}.${payload}`));const assertion=`${header}.${payload}.${b64url(new Uint8Array(signature))}`;const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});if(!response.ok)throw new Error(`Google authorization failed (${response.status})`);const data=await response.json() as {access_token?:string};if(!data.access_token)throw new Error('Google authorization returned no token');return data.access_token}
const iso=(d:Date)=>d.toISOString().slice(0,10);
function range(days:number,lag=2){const end=new Date();end.setUTCDate(end.getUTCDate()-lag);const start=new Date(end);start.setUTCDate(start.getUTCDate()-days+1);const prevEnd=new Date(start);prevEnd.setUTCDate(prevEnd.getUTCDate()-1);const prevStart=new Date(prevEnd);prevStart.setUTCDate(prevStart.getUTCDate()-days+1);return{current:{startDate:iso(start),endDate:iso(end)},previous:{startDate:iso(prevStart),endDate:iso(prevEnd)}}}
async function google(url:string,t:string,options:RequestInit={}){const response=await fetch(url,{...options,headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json',...(options.headers||{})},cache:'no-store'});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Google API ${response.status}`);return payload as any}
async function query(endpoint:string,t:string,dates:{startDate:string;endDate:string},dimensions:string[],rowLimit=25000,extra:Record<string,unknown>={}){return google(endpoint,t,{method:'POST',body:JSON.stringify({...dates,dimensions,rowLimit,dataState:'final',...extra})})}
const round=(n:number,d=1)=>Number(n.toFixed(d));
function summarize(rows:MetricRow[]=[]){const totals=rows.reduce<{clicks:number;impressions:number;positionWeight:number}>((a,r)=>{a.clicks+=r.clicks||0;a.impressions+=r.impressions||0;a.positionWeight+=(r.position||0)*(r.impressions||0);return a},{clicks:0,impressions:0,positionWeight:0});return{clicks:round(totals.clicks,0),impressions:round(totals.impressions,0),ctr:totals.impressions?round(totals.clicks/totals.impressions*100,2):0,position:totals.impressions?round(totals.positionWeight/totals.impressions,1):0}}
function delta(current:number,previous:number){if(!previous)return current?100:0;return round((current-previous)/previous*100,1)}
function metrics(rows:MetricRow[]=[]){return rows.map(r=>({label:r.keys?.join(' / ')||'Unknown',clicks:r.clicks||0,impressions:r.impressions||0,ctr:round((r.ctr||0)*100,2),position:round(r.position||0,1)}))}
function pathOf(value:string){try{return new URL(value).pathname||'/'}catch{return value}}
const PAGE_GROUPS=[
  {name:'Store & Xupply',match:(p:string)=>p.startsWith('/store')},
  {name:'xFactor Music',match:(p:string)=>p==='/music'||p.startsWith('/music/')},
  {name:'Apps & Product Pages',match:(p:string)=>p.startsWith('/apps/')||p==='/visual-x'||p==='/studyhive'},
  {name:'Guides & Free Resources',match:(p:string)=>p.startsWith('/guides')||p.startsWith('/store/free')},
  {name:'Core Site',match:(_:string)=>true},
];
const TOPIC_CLUSTERS=[
  {name:'planet.X Brand',terms:['planet.x','planet x','planetx','planet x apps','planet x app','planet x software','planet x tech','planet x company','planet x official','xupply']},
  {name:'xFactor Music',terms:['xfactor','xfactor music','xfactor songs','x factor music','x factor songs','planet x music','digital decay xfactor','coming down that hill xfactor','glitch god xfactor','ghost in the machine xfactor','xs in my head xfactor']},
  {name:'Store & Product Discovery',terms:['chrome extension workspace manager','tab workspace manager','encrypted developer workspace','developer credential manager','chrome extension credential manager','ui sound effects','interface sound library','glitch transition sound effects','hud interface kit','creator editing overlays','indie app launch kit','website effects pack','digital wallpaper pack','producer transition effects']},
  {name:'Chrome Extension Discovery',terms:['chrome extension','chrome extensions','tab manager extension','workspace manager extension','chrome tab manager','chrome workspace manager','encrypted credentials extension','developer credentials chrome extension','chrome web store listing','chrome extension screenshots']},
];
function aggregatePageGroups(rows:MetricRow[]=[]){return PAGE_GROUPS.map(group=>{const picked=rows.filter(r=>group.match(pathOf(r.keys?.[0]||'')));return{name:group.name,...summarize(picked)}})}
function aggregateClusters(rows:MetricRow[]=[]){return TOPIC_CLUSTERS.map(cluster=>{const picked=rows.filter(r=>{const q=(r.keys?.[0]||'').toLowerCase();return cluster.terms.some(term=>q.includes(term))});return{name:cluster.name,...summarize(picked)}})}
function opportunities(pageRows:MetricRow[]=[]){const rows=metrics(pageRows).map(r=>({...r,label:pathOf(r.label)}));return rows.filter(r=>r.impressions>0&&((r.position>=8&&r.position<=20)||r.ctr<1)).sort((a,b)=>{const aScore=a.impressions*(a.position>=8&&a.position<=20?2:1),bScore=b.impressions*(b.position>=8&&b.position<=20?2:1);return bScore-aScore}).slice(0,12).map(r=>({...r,reason:r.position>=8&&r.position<=20?(r.ctr<1?'Near page one + low CTR':'Near page one'):'Low CTR'}))}
const PRIORITY_PATHS=['/','/about','/music','/store','/store/software','/store/audio-fx','/store/creator-resources','/guides','/visual-x','/store/free'];
async function inspect(site:string,t:string){return Promise.all(PRIORITY_PATHS.map(async path=>{const url=`https://www.planet-x.co${path}`;try{const result=await google('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',t,{method:'POST',body:JSON.stringify({inspectionUrl:url,siteUrl:site,languageCode:'en-US'})});const s=result.inspectionResult?.indexStatusResult||{};return{path,url,verdict:s.verdict||'VERDICT_UNSPECIFIED',coverageState:s.coverageState||'Unknown',indexingState:s.indexingState||'Unknown',pageFetchState:s.pageFetchState||'Unknown',lastCrawlTime:s.lastCrawlTime||null,googleCanonical:s.googleCanonical||null,userCanonical:s.userCanonical||null}}catch{return{path,url,verdict:'ERROR',coverageState:'Inspection unavailable'}}}))}
async function sitemaps(site:string,t:string){const url=`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps`;try{const data=await google(url,t);return(data.sitemap||[]).map((s:any)=>({path:s.path,lastSubmitted:s.lastSubmitted||null,isPending:Boolean(s.isPending),isSitemapsIndex:Boolean(s.isSitemapsIndex),warnings:Number(s.warnings||0),errors:Number(s.errors||0),contents:(s.contents||[]).map((c:any)=>({type:c.type,submitted:Number(c.submitted||0),indexed:Number(c.indexed||0)}))}))}catch{return[]}}
async function hourly(endpoint:string,t:string){const end=new Date(),start=new Date(end);start.setUTCDate(start.getUTCDate()-1);try{const data=await google(endpoint,t,{method:'POST',body:JSON.stringify({startDate:iso(start),endDate:iso(end),dimensions:['date','hour'],rowLimit:250,dataState:'hourly_all'})});return{status:'partial',note:'Fresh Search Console data can be partial and may change after Google finalizes it.',trend:(data.rows||[]).map((r:MetricRow)=>({date:r.keys?.[0]||'',hour:r.keys?.[1]||'',clicks:r.clicks||0,impressions:r.impressions||0,ctr:round((r.ctr||0)*100,2),position:round(r.position||0,1)})),totals:summarize(data.rows||[])}}catch{return{status:'unavailable',note:'Hourly Search Console data is not available for this property right now.',trend:[],totals:{clicks:0,impressions:0,ctr:0,position:0}}}}
export default async function handler(req:any,res:any){
  if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
  const c=await config();if(!c)return json(res,503,{status:'setup_required',error:'GOOGLE_INSIGHTS_CONFIG is not configured for the Command Center.'});
  try{
    const token=await tokenFor(c),site=c.search_console_site_url||DEFAULT_SITE,days=Math.max(7,Math.min(90,Number(req.query?.days)||28)),dates=range(days,2),endpoint=`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
    const[currentDaily,previousDaily,queryRows,pageRows,countryRows,deviceRows,appearanceRows,fresh,indexing,sitemapRows]=await Promise.all([
      query(endpoint,token,dates.current,['date'],500),
      query(endpoint,token,dates.previous,['date'],500),
      query(endpoint,token,dates.current,['query'],25000),
      query(endpoint,token,dates.current,['page'],25000),
      query(endpoint,token,dates.current,['country'],1000),
      query(endpoint,token,dates.current,['device'],100),
      query(endpoint,token,dates.current,['searchAppearance'],100),
      hourly(endpoint,token),
      inspect(site,token),
      sitemaps(site,token),
    ]);
    const current=summarize(currentDaily.rows||[]),previous=summarize(previousDaily.rows||[]);
    return json(res,200,{
      status:'connected',site,days,dateRange:dates.current,comparisonRange:dates.previous,
      freshness:{finalizedThrough:dates.current.endDate,lagDays:2,note:'Main comparisons use finalized Search Console data. The 24-hour pulse is explicitly partial.'},
      totals:current,previous,change:{clicks:delta(current.clicks,previous.clicks),impressions:delta(current.impressions,previous.impressions),ctr:delta(current.ctr,previous.ctr),position:previous.position?round(previous.position-current.position,1):0},
      trend:metrics(currentDaily.rows||[]),queries:metrics(queryRows.rows||[]).slice(0,40),pages:metrics(pageRows.rows||[]).map(r=>({...r,label:pathOf(r.label)})).slice(0,40),
      countries:metrics(countryRows.rows||[]).slice(0,20),devices:metrics(deviceRows.rows||[]),searchAppearance:metrics(appearanceRows.rows||[]),
      pageGroups:aggregatePageGroups(pageRows.rows||[]),topicClusters:aggregateClusters(queryRows.rows||[]),opportunities:opportunities(pageRows.rows||[]),
      hourly:fresh,indexing,sitemaps:sitemapRows,fetchedAt:new Date().toISOString()
    });
  }catch(cause){console.error('Search Console intelligence failed.',cause);return json(res,502,{status:'error',error:cause instanceof Error?cause.message:'Search Console is unavailable.'})}
}
