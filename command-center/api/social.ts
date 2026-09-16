// Social analytics are read from the shared Supabase archive populated through the free Metricool MCP path.
const ENDPOINT=process.env.PLANETX_SOCIAL_ANALYTICS_URL||'https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-social-analytics';
const HEADER='X-PlanetX-Analytics-Key';
const json=(res:any,status:number,body:unknown)=>res.status(status).json(body);
const allowedRange=(v:unknown)=>{const value=String(v||'30d').toLowerCase();return ['24h','7d','30d','90d'].includes(value)?value:'30d'};
const allowedNetwork=(v:unknown)=>{const value=String(v||'all').toLowerCase();return ['all','pinterest','facebook','instagram','linkedin','youtube','tiktok'].includes(value)?value:'all'};

export default async function handler(req:any,res:any){
 if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
 const key=process.env.PLANETX_ANALYTICS_INGEST_KEY||process.env.PLANETX_ANALYTICS_KEY||'';
 const range=allowedRange(req.query?.range),network=allowedNetwork(req.query?.network);
 if(!key)return json(res,200,{status:'setup_required',configured:false,provider:'Metricool MCP archive',range,message:'The Command Center analytics key is not configured for the social archive.'});
 try{
  const url=new URL(ENDPOINT);url.searchParams.set('range',range);url.searchParams.set('network',network);
  const upstream=await fetch(url,{headers:{[HEADER]:key,Accept:'application/json'},cache:'no-store'});
  const body=await upstream.json().catch(()=>({error:'Invalid social analytics response'}));
  if(!upstream.ok){console.error('Social archive read failed',upstream.status,body);return json(res,upstream.status===401?500:upstream.status,{status:'error',configured:true,provider:'Metricool MCP archive',range,message:'Social analytics archive read failed.'})}
  return json(res,200,body);
 }catch(cause){console.error('Social archive unavailable',cause);return json(res,502,{status:'error',configured:true,provider:'Metricool MCP archive',range,message:'Social analytics archive is temporarily unavailable.'})}
}
