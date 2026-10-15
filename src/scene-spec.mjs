// Deterministic v0.2 SceneSpec planner. No model API is implied.
export const SCENE_VERSION = "0.2";
const CATALOG = new Set(["iceberg","penguin","icebreaker","ice","water","island","volcano","tree","boat","animal","jelly","press"]);
const palettes = {mint:"#63ced1",blue:"#3e9de8",purple:"#9c80d3",pink:"#ff8fb0"};
const O=(id,type,position,extra={})=>({id,type,position,scale:[1,1,1],...extra});
export function planScene(input,quality="balanced"){
 const prompt=String(input||"").trim().slice(0,2000);
 if(!prompt) throw Error("请输入场景描述");
 let kind=/火山|熔岩|热带岛/.test(prompt)?"volcano":/实验室|液压|压力机|压碎|citrus|水果果冻/.test(prompt)?"lab":"polar";
 const objects=kind==="volcano"?[
 O("island","island",[0,0,0]),O("volcano","volcano",[-.7,.8,-.4],{behaviors:["erupt"]}),
 O("tree-1","tree",[1,.8,1]),O("tree-2","tree",[-1,.8,1.2]),
 O("boat","boat",[1,.7,-1],{behaviors:["sail"]}),O("animal","animal",[.8,1,.8],{behaviors:["wander"]}),
 O("ocean","water",[0,.7,0],{behaviors:["ripple"]})
 ]:kind==="lab"?[
 O("jelly","jelly",[0,1,0],{behaviors:["wobble","drag"]}),
 O("press","press",[0,2.4,0],{behaviors:["compress"]})
 ]:[
 O("glacier","iceberg",[-1.3,1.8,-1.3],{behaviors:["calve"]}),
 O("penguins","penguin",[1.6,.8,1.5],{count:22,behaviors:["wander"]}),
 O("polaris","icebreaker",[.25,.9,.2],{behaviors:["sail"]}),
 O("floating-ice","ice",[.6,.85,.3],{count:6,behaviors:["float","drag"]}),
 O("sea","water",[0,.75,0],{behaviors:["ripple"]})
 ];
 const col=/紫|黑莓/.test(prompt)?"purple":/粉|草莓/.test(prompt)?"pink":/深蓝|蓝莓/.test(prompt)?"blue":"mint";
 const penguinCount=prompt.match(/(\d+)\s*只企鹅/);
 if(kind==="polar"){let p=objects.find(x=>x.type==="penguin");p.count=penguinCount?Math.min(40,Number(penguinCount[1])):/没有企鹅|无企鹅/.test(prompt)?0:/更多企鹅|成群企鹅/.test(prompt)?34:22;}
 const wave=/巨浪|大海浪|波涛/.test(prompt)?85:/平静|无波浪/.test(prompt)?8:38;
 const title=kind==="volcano"?"Volcanic Island":kind==="lab"?"Jelly Laboratory":"Iceberg Jelly";
 return validateScene({version:SCENE_VERSION,id:"scene-"+kind,kind,title,prompt,quality,environment:{background:kind==="volcano"?"#284553":kind==="lab"?"#30283a":"#19313f",palette:col,waves:wave,transparency:65},objects,interactions:[...new Set(objects.flatMap(o=>o.behaviors||[]))]});
}
export function validateScene(spec){
 if(!spec||typeof spec!=="object"||!Array.isArray(spec.objects))throw Error("invalid SceneSpec");
 if(spec.objects.length>150)throw Error("too many scene objects");
 const ids=new Set();
 for(const o of spec.objects){if(!CATALOG.has(o.type))throw Error("unsupported object type: "+o.type);
 if(typeof o.id!=="string"||ids.has(o.id))throw Error("duplicate/invalid object id");
 ids.add(o.id);if(!Array.isArray(o.position)||o.position.length!==3||!o.position.every(x=>typeof x==="number"&&Number.isFinite(x)))throw Error("invalid position: "+o.id);
 if(o.count!==undefined&&(!Number.isInteger(o.count)||o.count<0||o.count>100))throw Error("invalid count");
 }
 if(!Object.hasOwn(palettes,spec.environment?.palette))throw Error("invalid palette");
 return spec;
}
export function applySceneEdit(spec,instruction){
 const next=structuredClone(validateScene(spec)),txt=String(instruction||"").trim();if(!txt)throw Error("empty edit");
 const count=txt.match(/(\d+)\s*只企鹅/);
 if(count){const p=next.objects.find(o=>o.type==="penguin");if(!p)throw Error("scene has no penguins");p.count=Math.min(40,Number(count[1]));}
 if(/去掉企鹅|删除企鹅/.test(txt))next.objects=next.objects.filter(x=>x.type!=="penguin");
 if(/添加企鹅|增加企鹅/.test(txt)&&!next.objects.some(x=>x.type==="penguin"))next.objects.push(O("penguins","penguin",[1,.8,1],{count:10,behaviors:["wander"]}));
 if(/紫|黑莓/.test(txt))next.environment.palette="purple";
 else if(/粉|草莓/.test(txt))next.environment.palette="pink";
 else if(/蓝莓/.test(txt))next.environment.palette="blue";
 else if(/薄荷/.test(txt))next.environment.palette="mint";
 if(/大海浪|巨浪/.test(txt))next.environment.waves=85;
 if(/平静|小浪/.test(txt))next.environment.waves=10;
 next.prompt=spec.prompt+"\n修改："+txt;return validateScene(next);
}
