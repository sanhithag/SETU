import Nav from "../../components/Nav"; import {MarkAllRead} from "../../components/Actions"; import {requireRole} from "../../lib/auth"; import {readDB} from "../../lib/db";
export const dynamic="force-dynamic";
export default async function Notifications(){
  const u=await requireRole(()=>true);const list=readDB().notifications.filter((n:any)=>n.userId===u.id);
  return <><Nav/><main className="container"><div className="row"><div><div className="eyebrow">Inbox</div><h1>Notifications</h1></div>{list.some((n:any)=>!n.read)&&<MarkAllRead/>}</div>
  <div className="section">{list.length?list.map((n:any)=><div key={n.id} className={`card ${n.read?"":"unread"}`} style={{marginBottom:10}}><b>{n.title}</b><div className="muted">{n.body}</div>{n.createdAt&&<div className="muted">{new Date(n.createdAt).toLocaleString("en-IN")}</div>}</div>):<div className="card empty">You’re all caught up.</div>}</div></main></>}
