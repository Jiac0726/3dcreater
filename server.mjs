import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {planScene,validateScene} from './src/scene-spec.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||8000);
const MIME={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8'};
const json=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data))};
function readBody(req){return new Promise((resolve,reject)=>{let data='';req.on('data',c=>{data+=c;if(data.length>65536){reject(new Error('request too large'));req.destroy()}});req.on('end',()=>{try{resolve(JSON.parse(data))}catch{reject(new Error('invalid JSON'))}});req.on('error',reject)})}
export function parseModelScene(text){
 let data=String(text).trim().replace(/^\x60{3}(?:json)?\s*/,'').replace(/\s*\x60{3}$/,'');
 return validateScene(JSON.parse(data));
}
export async function generateScene(prompt,quality='balanced'){
 const key=process.env.SCENE_AI_API_KEY;
 if(!key)return {spec:planScene(prompt,quality),mode:'rules',note:'No AI API key configured'};
 const endpoint=process.env.SCENE_AI_ENDPOINT;
 const model=process.env.SCENE_AI_MODEL;
 if(!endpoint||!model)throw Error('SCENE_AI_ENDPOINT and SCENE_AI_MODEL are required when a key is set');
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),30000);
 try{
 const response=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+key},body:JSON.stringify({model,temperature:0.2,messages:[{role:'system',content:'Produce ONLY a JSON SceneSpec, no markdown. Allowed types: iceberg,penguin,icebreaker,ice,water,island,volcano,tree,boat,animal,jelly,press. Fields: version=0.2,id,kind=polar|volcano|lab,title,prompt,quality,environment:{background,palette:mint|blue|purple|pink,waves:0-100,transparency:10-95},objects:[{id,type,position:[number,number,number],scale:[1,1,1],count?,behaviors?:string[]}],interactions:string[]. Output should be compatible with requested types.'},{role:'user',content:String(prompt).slice(0,2000)}]}),signal:ctrl.signal});
 if(!response.ok)throw Error('AI provider HTTP '+response.status);
 const raw=await response.json();const txt=raw?.choices?.[0]?.message?.content;
 if(typeof txt!=='string')throw Error('AI provider returned no text');
 return {spec:parseModelScene(txt),mode:'ai'};
 }finally{clearTimeout(timer)}
}
export function createServer(){
 return http.createServer(async(req,res)=>{
 const url=new URL(req.url||'/', 'http://localhost');
 if(req.method==='POST'&&url.pathname==='/api/generate'){
  try{const body=await readBody(req);const prompt=String(body.prompt||'').trim();if(!prompt)return json(res,400,{error:'prompt required'});return json(res,200,await generateScene(prompt,body.quality||'balanced'))}
  catch(e){return json(res,502,{error:e.message})}
 }
 if(req.method!=='GET')return json(res,405,{error:'method not allowed'});
 let pathname=url.pathname==='/'?'/index.html':url.pathname;
 try{
  let full=path.resolve(base,'.'+decodeURIComponent(pathname));if(!full.startsWith(base+path.sep))return json(res,403,{error:'forbidden'});
  const bytes=await readFile(full);res.writeHead(200,{'content-type':MIME[path.extname(full)]||'application/octet-stream'});res.end(bytes);
 }catch{return json(res,404,{error:'not found'})}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 createServer().listen(PORT,()=>console.log('Scene Studio http://localhost:'+PORT));
}
