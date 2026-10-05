import {MilestoneButton} from "./Actions";
export default function ProjectCard({p,title,orgName,mode}:{p:any,title?:string,orgName?:string,mode:"org"|"gov"|"view"}){
  const done=p.milestones.filter((m:any)=>m.status==="VERIFIED").length;const pct=Math.round(done/p.milestones.length*100);
  return <div className="card"><div className="row"><h3>{title}</h3><span className="status">{p.status}</span></div>
  <p className="muted">{orgName&&<>{orgName} · </>}Funding ₹{p.funding.toLocaleString("en-IN")} · Target {p.targetCompletionAt}</p>
  <div className="bar" aria-label={`${pct}% complete`}><div style={{width:pct+"%"}}/></div><p className="muted">{done}/{p.milestones.length} milestones verified</p>
  {p.milestones.map((m:any)=><div className="notice row" key={m.id}><span><b>{m.title}</b><br/><span className="muted">{m.status.replaceAll("_"," ")} · due {m.dueDate}</span></span><MilestoneButton projectId={p.id} milestoneId={m.id} status={m.status} mode={mode}/></div>)}</div>
}
