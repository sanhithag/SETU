import Nav from "../../../components/Nav"; import {AwardButton} from "../../../components/Actions"; import {requireRole,isGov} from "../../../lib/auth"; import {readDB} from "../../../lib/db";
export const dynamic="force-dynamic";
export default async function Bids(){
  await requireRole(isGov);const db=readDB();
  const groups=db.problems.filter((p:any)=>db.bids.some((b:any)=>b.problemId===p.id));
  return <><Nav/><main className="container"><div className="eyebrow">Government</div><h1>Bid evaluation</h1><p className="muted">Bids are grouped by problem. Awarding one closes the others.</p>
  {groups.length?groups.map((p:any)=>{const bs=db.bids.filter((b:any)=>b.problemId===p.id).sort((a:any,b:any)=>b.score-a.score);const awarded=db.projects.some((x:any)=>x.problemId===p.id);
   return <section className="section" key={p.id}><h2>{p.title}</h2><table><thead><tr><th>Bid</th><th>Organisation</th><th>Budget</th><th>Score</th><th></th></tr></thead><tbody>{bs.map((b:any)=><tr key={b.id}><td><b>{b.title}</b><br/><span className="muted">{b.timeline}</span></td><td>{db.organisations.find((o:any)=>o.id===b.orgId)?.name}</td><td>₹{b.budget.toLocaleString("en-IN")}</td><td>{b.score}/100</td><td>{b.status==="NOT_SELECTED"?<span className="muted">Not selected</span>:<AwardButton problemId={p.id} bidId={b.id} disabled={awarded}/>}</td></tr>)}</tbody></table></section>}):<div className="card empty section">No bids yet.</div>}</main></>}
