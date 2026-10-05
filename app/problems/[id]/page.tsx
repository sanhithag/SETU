import Link from "next/link"; import Nav from "../../../components/Nav"; import Status from "../../../components/Status"; import Timeline from "../../../components/Timeline"; import {CorroborateButton,ModerationButtons} from "../../../components/Actions"; import {readDB} from "../../../lib/db"; import {getSession,isGov,isOrg} from "../../../lib/auth";
export const dynamic="force-dynamic";
const STAGES=["NORMALISE","SPAM","DUPLICATE","CLASSIFY","VALIDATE","PRIORITY","ROUTE"];
export default async function Detail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const db=readDB();const u=await getSession();const p=db.problems.find((x:any)=>x.id===id);
  if(!p)return <><Nav/><main className="container"><div className="card empty"><h1>Problem not found</h1><Link className="btn" href="/problems">Browse problems</Link></div></main></>;
  const district=db.districts.find((d:any)=>d.id===p.districtId);const bids=db.bids.filter((b:any)=>b.problemId===p.id);const project=db.projects.find((x:any)=>x.problemId===p.id);
  const mine=u&&p.submittedById===u.id;const pending=["PENDING_MODERATION","NEEDS_CLARIFICATION","SPAM_QUARANTINE"].includes(p.status);
  return <><Nav/><main className="container"><Link className="muted" href="/problems">← All problems</Link><div className="eyebrow" style={{marginTop:10}}>{p.domain} · {district?.name}</div><h1>{p.title}</h1>
  <div className="row" style={{justifyContent:"flex-start"}}><Status>{p.status.replaceAll("_"," ")}</Status><span className={`priority ${p.priority}`}>{p.priority}</span></div>
  <Timeline status={p.status}/>
  <div className="split section"><div><div className="card"><h2>Problem</h2><p>{p.description}</p>{(p.photos||[]).length>0&&<div className="thumbs">{p.photos.map((f:string,i:number)=><a key={f} className="thumb" href={`/api/photos/${f}`} target="_blank" rel="noopener"><img src={`/api/photos/${f}`} alt={`Photo ${i+1} of the reported problem`} loading="lazy"/></a>)}</div>}<p className="muted">📍 {p.location} · Reported {new Date(p.createdAt).toLocaleDateString("en-IN")}</p><CorroborateButton id={p.id} count={p.corroborationCount} already={!!u&&(p.corroboratedBy||[]).includes(u.id)} canAct={!!u}/></div>
    {u&&isGov(u.role)&&pending&&<div className="card section"><h3>Moderator decision</h3><p className="muted">AI is advisory — you make the final call.</p><ModerationButtons id={p.id}/></div>}
    <div className="card section"><h2>AI triage</h2><p>{p.aiSummary||"Triage pending."}</p><div className="pipeline">{STAGES.map((s,i)=><div className="stage" key={s}><b>{i+1}. {s}</b><span>completed</span></div>)}</div></div></div>
  <aside><div className="card"><h3>Collaboration</h3><p className="muted">{bids.length} solution bid(s) received.</p>{bids.map((b:any)=><div key={b.id} className="notice"><b>{b.title}</b><br/>{b.timeline} · ₹{b.budget.toLocaleString("en-IN")}</div>)}
    {u&&isOrg(u.role)&&p.status==="OPEN_FOR_BIDS"&&<Link className="btn primary" href={`/org/bid/${p.id}`}>Submit a bid</Link>}
    {project&&<><h3>Active project</h3><p>{project.milestones.filter((m:any)=>m.status==="VERIFIED").length}/{project.milestones.length} milestones verified.</p><Link className="btn primary" href="/org/projects">Open workspace</Link></>}
    {mine&&p.status==="NEEDS_CLARIFICATION"&&<div className="notice">A moderator asked for more detail. Please submit a clearer report.</div>}</div></aside></div></main></>}
