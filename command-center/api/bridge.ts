const EXTERNAL_INGEST='https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-analytics-ingest';
const BRIDGE='https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-command-center-bridge';
const HEADER='x-planetx-analytics-key';
const KEY_NAME='PLANETX_ANALYTICS_INGEST_KEY';
const GOOGLE_NAME='GOOGLE_INSIGHTS_CONFIG';
const GOOGLE_MIN_REFRESH_MS=5*60*60*1000;

const allowedOrigins=new Set(['https://planet-x.co','https://www.planet-x.co','https://dashboard.planet-x.co']);
const str=(value:unknown,max=512)=>String(value??'').slice(0,max);
function cors(origin:string){const allowed=allowedOrigins.has(origin)?origin:'https://planet-x.co';return{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'Content-Type, X-PlanetX-Analytics-Key','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Vary':'Origin'}}
async function jsonBody(response:Response){return response.json().catch(()=>({error:'Upstream returned an invalid response.'}))}
function cleanRange(value:unknown){const range=str(value||'30d',8).toLowerCase();return['24h','7d','30d','90d','all'].includes(range)?range:'30d'}
function cleanNetwork(value:unknown){const network=str(value||'all',24).toLowerCase();return['all','pinterest','facebook','instagram','linkedin','youtube','tiktok'].includes(network)?network:'all'}

type GoogleConfig={client_email:string;private_key:string;search_console_site_url?:string;analytics_property_id?:string};
const enc=(value:string)=>new TextEncoder().encode(value);
function b64url(value:string|Uint8Array){const bytes=typeof value==='string'?enc(value):value;let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function googleConfig():Promise<GoogleConfig|null>{const raw=process.env[GOOGLE_NAME];if(!raw)return null;try{const parsed=JSON.parse(raw) as GoogleConfig;if(!parsed.client_email||!parsed.private_key)return null;return parsed}catch{return null}}
async function googleToken(config:GoogleConfig){const now=Math.floor(Date.now()/1000);const header=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));const payload=b64url(JSON.stringify({iss:config.client_email,scope:'https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));const pem=config.private_key.replace(/\\n/g,'\n').replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,'');const der=Uint8Array.from(atob(pem),char=>char.charCodeAt(0));const key=await crypto.subtle.importKey('pkcs8',der,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);const signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,enc(`${header}.${payload}`));const assertion=`${header}.${payload}.${b64url(new Uint8Array(signature))}`;const body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion});const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});if(!response.ok)throw new Error('Google authorization failed');const token=await response.json() as {access_token?:string};if(!token.access_token)throw new Error('Google authorization returned no token');return token.access_token}
const isoDate=(date:Date)=>date.toISOString().slice(0,10);
function dateRange(days:number,lag=0){const end=new Date();end.setUTCDate(end.getUTCDate()-lag);const start=new Date(end);start.setUTCDate(start.getUTCDate()-days+1);return{startDate:isoDate(start),endDate:isoDate(end)}}
async function googleJson(url:string,token:string,body:unknown){const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body)});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Google API returned ${response.status}`);return payload as any}
async function googleOverview(){const config=await googleConfig();if(!config)return{status:'setup_required',configured:false,searchConsole:{status:'setup_required'},analytics:{status:'setup_required'}};let token:string;try{token=await googleToken(config)}catch{return{status:'error',configured:true,searchConsole:{status:'error'},analytics:{status:'error'},message:'Google credentials could not be authorized.'}}const search:any={status:config.search_console_site_url?'loading':'setup_required'};const analytics:any={status:config.analytics_property_id?'loading':'setup_required'};const tasks:Promise<void>[]=[];
  if(config.search_console_site_url){tasks.push((async()=>{try{const range=dateRange(28,2);const endpoint=`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.search_console_site_url!)}/searchAnalytics/query`;const[daily,queries,pages]=await Promise.all([googleJson(endpoint,token,{...range,dimensions:['date'],rowLimit:100}),googleJson(endpoint,token,{...range,dimensions:['query'],rowLimit:8}),googleJson(endpoint,token,{...range,dimensions:['page'],rowLimit:8})]);const rows=daily.rows||[];search.status='connected';search.totals=rows.reduce((a:any,r:any)=>({clicks:a.clicks+(r.clicks||0),impressions:a.impressions+(r.impressions||0),positionSum:a.positionSum+(r.position||0)*(r.impressions||0)}),{clicks:0,impressions:0,positionSum:0});search.totals.ctr=search.totals.impressions?Math.round(search.totals.clicks/search.totals.impressions*1000)/10:0;search.totals.position=search.totals.impressions?Math.round(search.totals.positionSum/search.totals.impressions*10)/10:0;delete search.totals.positionSum;search.trend=rows.map((r:any)=>({date:r.keys?.[0]||'',clicks:r.clicks||0,impressions:r.impressions||0,ctr:Math.round((r.ctr||0)*1000)/10,position:Math.round((r.position||0)*10)/10}));search.queries=(queries.rows||[]).map((r:any)=>({label:r.keys?.[0]||'Unknown query',clicks:r.clicks||0,impressions:r.impressions||0}));search.pages=(pages.rows||[]).map((r:any)=>({label:String(r.keys?.[0]||'').replace(/^https?:\/\/[^/]+/,'')||'/',clicks:r.clicks||0,impressions:r.impressions||0}));const inspectionUrls=(pages.rows||[]).map((r:any)=>String(r.keys?.[0]||'')).filter((url:string)=>/^https?:\/\//.test(url)).slice(0,5);search.indexing=await Promise.all(inspectionUrls.map(async(inspectionUrl:string)=>{try{const result=await googleJson('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',token,{inspectionUrl,siteUrl:config.search_console_site_url,languageCode:'en-US'});const status=result.inspectionResult?.indexStatusResult||{};return{url:inspectionUrl,verdict:status.verdict||'VERDICT_UNSPECIFIED',coverageState:status.coverageState||'Unknown',indexingState:status.indexingState||'Unknown',pageFetchState:status.pageFetchState||'Unknown',robotsTxtState:status.robotsTxtState||'Unknown',lastCrawlTime:status.lastCrawlTime||null,googleCanonical:status.googleCanonical||null,userCanonical:status.userCanonical||null}}catch{return{url:inspectionUrl,verdict:'ERROR',coverageState:'Inspection unavailable'}}}))}catch{search.status='error';search.message='Search Console is configured but unavailable.'}})())}
  if(config.analytics_property_id){tasks.push((async()=>{try{const range={startDate:'28daysAgo',endDate:'today'};const endpoint=`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(config.analytics_property_id!)}:runReport`;const[summary,daily,channels]=await Promise.all([googleJson(endpoint,token,{dateRanges:[range],metrics:[{name:'activeUsers'},{name:'sessions'},{name:'screenPageViews'},{name:'eventCount'},{name:'totalRevenue'}]}),googleJson(endpoint,token,{dateRanges:[range],dimensions:[{name:'date'}],metrics:[{name:'activeUsers'},{name:'sessions'}],orderBys:[{dimension:{dimensionName:'date'}}],limit:'40'}),googleJson(endpoint,token,{dateRanges:[range],dimensions:[{name:'sessionDefaultChannelGroup'}],metrics:[{name:'sessions'}],orderBys:[{metric:{metricName:'sessions'},desc:true}],limit:'8'})]);const values=summary.rows?.[0]?.metricValues||[];analytics.status='connected';analytics.totals={activeUsers:Number(values[0]?.value||0),sessions:Number(values[1]?.value||0),pageViews:Number(values[2]?.value||0),events:Number(values[3]?.value||0),revenue:Number(values[4]?.value||0)};analytics.trend=(daily.rows||[]).map((r:any)=>({date:r.dimensionValues?.[0]?.value||'',users:Number(r.metricValues?.[0]?.value||0),sessions:Number(r.metricValues?.[1]?.value||0)}));analytics.channels=(channels.rows||[]).map((r:any)=>({label:r.dimensionValues?.[0]?.value||'Unassigned',value:Number(r.metricValues?.[0]?.value||0)}))}catch{analytics.status='error';analytics.message='Google Analytics is configured but unavailable.'}})())}
  await Promise.all(tasks);return{status:search.status==='connected'||analytics.status==='connected'?'connected':search.status==='error'||analytics.status==='error'?'error':'setup_required',configured:true,searchConsole:search,analytics,fetchedAt:new Date().toISOString()}}


export default async function handler(req:any,res:any){
  const route=String(Array.isArray(req.query?.route)?req.query.route.join('/'):req.query?.route||'');
  const origin=str(req.headers?.origin||req.headers?.Origin,300);
  for(const[key,value]of Object.entries(cors(origin)))res.setHeader(key,value as string);
  res.setHeader('Content-Type','application/json');

  if(req.method==='OPTIONS')return res.status(204).end();

  if(route==='events/config'&&req.method==='GET'){
    return res.status(200).json({
      endpoint:EXTERNAL_INGEST,
      header:'X-PlanetX-Analytics-Key',
      schema:['event','timestamp','source_product','source_surface','session_id','anonymous_user_id','path','platform','properties'],
      configured:true,
      summaryAccess:'aggregate-only',
      commandCenterKeyAuthority:true,
      authAuthority:'ingest-validation',
      googleInsights:true,
      googleSource:'direct-google-cron',
      googleRefreshSchedule:'0 */6 * * *',
      socialInsights:true,
      socialSource:'metricool-mcp-archive'
    });
  }

  if(route==='events/authorize'&&req.method==='GET'){
    try{
      const key=str(req.headers?.[HEADER]||req.headers?.['X-PlanetX-Analytics-Key'],512);
      const upstream=await fetch(`${BRIDGE}?mode=authorize`,{headers:{'X-PlanetX-Analytics-Key':key,'User-Agent':'planetx-command-center/3.1'},cache:'no-store'});
      const payload=await jsonBody(upstream);
      return res.status(upstream.status).json(payload);
    }catch(cause){console.error('Auth bridge failed.',cause);return res.status(502).json({error:'Analytics key authority unavailable.'})}
  }

  if(route==='events'&&req.method==='POST'){
    try{
      const key=str(req.headers?.[HEADER]||req.headers?.['X-PlanetX-Analytics-Key'],512);
      const upstream=await fetch(EXTERNAL_INGEST,{method:'POST',headers:{'Content-Type':'application/json','X-PlanetX-Analytics-Key':key},body:JSON.stringify(req.body??{}),cache:'no-store'});
      const payload=await jsonBody(upstream);
      return res.status(upstream.status).json(payload);
    }catch(cause){console.error('Analytics write bridge failed.',cause);return res.status(502).json({error:'Shared analytics write failed.'})}
  }

  if(route==='google/overview'&&req.method==='GET'){
    try{
      const upstream=await fetch(`${BRIDGE}?mode=google-overview`,{headers:{Accept:'application/json','User-Agent':'planetx-command-center/3.1'},cache:'no-store'});
      const payload=await jsonBody(upstream);
      return res.status(upstream.status).json(payload);
    }catch(cause){console.error('Google snapshot bridge failed.',cause);return res.status(502).json({status:'error',configured:true,searchConsole:{status:'error'},analytics:{status:'error'},message:'Google insights bridge unavailable.'})}
  }


  if(route==='google/refresh'&&req.method==='GET'){
    try{
      const currentResponse=await fetch(`${BRIDGE}?mode=google-overview`,{headers:{Accept:'application/json','User-Agent':'planetx-command-center/3.3'},cache:'no-store'});
      const current=await jsonBody(currentResponse) as any;
      const capturedAt=Date.parse(String(current?.snapshotCapturedAt||''));
      const ageMs=Number.isFinite(capturedAt)?Date.now()-capturedAt:Number.POSITIVE_INFINITY;
      if(ageMs<GOOGLE_MIN_REFRESH_MS){
        return res.status(200).json({ok:true,skipped:true,reason:'snapshot-fresh',snapshotCapturedAt:current.snapshotCapturedAt,ageMinutes:Math.max(0,Math.round(ageMs/60000)),nextEligibleAt:new Date(capturedAt+GOOGLE_MIN_REFRESH_MS).toISOString()});
      }

      const payload=await googleOverview() as any;
      if(payload?.status!=='connected'){
        return res.status(502).json({ok:false,error:'Google refresh did not return a connected dataset.',googleStatus:payload?.status||'error',message:payload?.message||payload?.searchConsole?.message||payload?.analytics?.message||'Google API refresh failed.'});
      }
      const key=process.env[KEY_NAME];
      if(!key)return res.status(503).json({ok:false,error:'Snapshot writer key is not configured.'});

      const write=await fetch(`${BRIDGE}?mode=google-snapshot-write`,{
        method:'POST',
        headers:{'Content-Type':'application/json','X-PlanetX-Analytics-Key':key,'User-Agent':'planetx-command-center-google-refresh/3.3'},
        body:JSON.stringify({source:'direct-google-cron',payload}),
        cache:'no-store'
      });
      const result=await jsonBody(write);
      if(!write.ok)return res.status(write.status).json(result);
      return res.status(200).json({ok:true,skipped:false,refreshedAt:payload.fetchedAt,latestSearchDate:payload.searchConsole?.trend?.at?.(-1)?.date||null,write:result});
    }catch(cause){
      console.error('Google automatic refresh failed.',cause);
      return res.status(502).json({ok:false,error:'Google automatic refresh failed. Existing snapshot was preserved.'});
    }
  }

  if(route==='social/overview'&&req.method==='GET'){
    try{
      const range=cleanRange(req.query?.range),network=cleanNetwork(req.query?.network);
      const upstream=await fetch(`${BRIDGE}?mode=social-overview&range=${encodeURIComponent(range)}&network=${encodeURIComponent(network)}`,{headers:{Accept:'application/json','User-Agent':'planetx-command-center/3.1'},cache:'no-store'});
      const payload=await jsonBody(upstream);
      return res.status(upstream.status).json(payload);
    }catch(cause){console.error('Social archive bridge failed.',cause);return res.status(502).json({status:'error',configured:true,provider:'Metricool MCP archive',message:'Social insights bridge unavailable.'})}
  }

  return res.status(404).json({error:'Not found'});
}
