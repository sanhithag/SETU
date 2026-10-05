import Nav from "../../components/Nav"; import Stats from "../../components/Stats"; import {readDB} from "../../lib/db";
export const dynamic="force-dynamic";
function Bars({data}:{data:[string,number][]}){const max=Math.max(1,...data.map(d=>d[1]));return <>{data.map(([k,v])=><div className="barrow" key={k}><span>{k}</span><div className="bar"><div style={{width:(v/max*100)+"%"}}/></div><b>{v}</b></div>)}</>}
export default function Impact(){
  const db=readDB();const ps=db.problems.filter((p:any)=>!["REJECTED","SPAM_QUARANTINE"].includes(p.status));
  const tally=(f:(p:any)=>string)=>Object.entries(ps.reduce((a:any,p:any)=>{const k=f(p);a[k]=(a[k]||0)+1;return a},{})).sort((a:any,b:any)=>b[1]-a[1]) as [string,number][];
  const funding=db.projects.reduce((s:number,p:any)=>s+p.funding,0);const ms=db.projects.flatMap((p:any)=>p.milestones);
  return <><Nav/><main className="container"><div className="eyebrow">Public transparency</div><h1>Impact dashboard</h1>
  <Stats items={[{label:"Problems reported",value:ps.length},{label:"Citizen corroborations",value:ps.reduce((s:number,p:any)=>s+p.corroborationCount,0)},{label:"Funding committed",value:"₹"+funding.toLocaleString("en-IN")},{label:"Milestones verified",value:`${ms.filter((m:any)=>m.status==="VERIFIED").length}/${ms.length}`}]}/>
  <div className="grid"><div className="card"><h3>By domain</h3><Bars data={tally(p=>p.domain)}/></div><div className="card"><h3>By district</h3><Bars data={tally(p=>db.districts.find((d:any)=>d.id===p.districtId)?.name||"Other")}/></div><div className="card"><h3>By stage</h3><Bars data={tally(p=>p.status.replaceAll("_"," "))}/></div></div></main></>}
