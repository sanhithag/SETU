import Nav from "../../../components/Nav"; import {requireRole,isGov} from "../../../lib/auth"; import {readDB} from "../../../lib/db";
export const dynamic="force-dynamic";
export default async function Audit(){
  await requireRole(isGov);const db=readDB();
  return <><Nav/><main className="container"><div className="eyebrow">Government</div><h1>Audit log</h1><p className="muted">An append-only record of decisions on the platform.</p>
  <table><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Entity</th></tr></thead><tbody>{db.audit.slice(0,100).map((a:any)=><tr key={a.id}><td>{new Date(a.createdAt).toLocaleString("en-IN")}</td><td>{db.users.find((u:any)=>u.id===a.actorId)?.name||a.actorId} <span className="muted">({a.actorRole})</span></td><td><span className="chip">{a.action.replaceAll("_"," ")}</span></td><td>{a.entityType} {a.entityId}</td></tr>)}</tbody></table></main></>}
