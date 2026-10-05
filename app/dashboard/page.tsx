import Link from "next/link"; import Nav from "../../components/Nav"; import Stats from "../../components/Stats"; import ProblemCard from "../../components/ProblemCard"; import {requireRole} from "../../lib/auth"; import {readDB} from "../../lib/db";
export default async function Dashboard(){
  const user=await requireRole(r=>r==="CITIZEN");const db=readDB();
  const ps=db.problems.filter((p:any)=>p.submittedById===user.id);
  const ids=ps.map((p:any)=>p.id);const projects=db.projects.filter((x:any)=>ids.includes(x.problemId));
  const notes=db.notifications.filter((n:any)=>n.userId===user.id).slice(0,3);
  return <><Nav/><main className="container"><div className="eyebrow">Citizen dashboard</div><h1>Welcome, {user.name.split(" ")[0]}</h1>
  <Stats items={[{label:"My submissions",value:ps.length},{label:"Corroborations",value:ps.reduce((a:number,p:any)=>a+p.corroborationCount,0)},{label:"Active projects",value:projects.length},{label:"Awaiting review",value:ps.filter((p:any)=>["PENDING_MODERATION","NEEDS_CLARIFICATION"].includes(p.status)).length}]}/>
  <div className="actions"><Link className="btn primary" href="/submit">+ Report a new problem</Link><Link className="btn" href="/problems">Browse &amp; support others</Link></div>
  {notes.length>0&&<section className="section"><div className="row"><h2>Latest updates</h2><Link className="muted" href="/notifications">All →</Link></div>{notes.map((n:any)=><div key={n.id} className={`card ${n.read?"":"unread"}`} style={{marginBottom:10}}><b>{n.title}</b><div className="muted">{n.body}</div></div>)}</section>}
  <section className="section"><h2>My submissions</h2><div className="grid">{ps.length?ps.map((p:any)=><ProblemCard key={p.id} p={p}/>):<div className="card empty">No submissions yet. <Link href="/submit" style={{color:"var(--brand)"}}>Report your first problem</Link>.</div>}</div></section></main></>}
