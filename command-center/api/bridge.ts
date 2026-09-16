const EXTERNAL_INGEST='https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-analytics-ingest';
const BRIDGE='https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-command-center-bridge';
const HEADER='x-planetx-analytics-key';

const allowedOrigins=new Set(['https://planet-x.co','https://www.planet-x.co','https://dashboard.planet-x.co']);
const str=(value:unknown,max=512)=>String(value??'').slice(0,max);
function cors(origin:string){const allowed=allowedOrigins.has(origin)?origin:'https://planet-x.co';return{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'Content-Type, X-PlanetX-Analytics-Key','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Vary':'Origin'}}
async function jsonBody(response:Response){return response.json().catch(()=>({error:'Upstream returned an invalid response.'}))}
function cleanRange(value:unknown){const range=str(value||'30d',8).toLowerCase();return['24h','7d','30d','90d','all'].includes(range)?range:'30d'}
function cleanNetwork(value:unknown){const network=str(value||'all',24).toLowerCase();return['all','pinterest','facebook','instagram','linkedin','youtube','tiktok'].includes(network)?network:'all'}

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
      googleSource:'gsc-wizard-snapshot',
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
