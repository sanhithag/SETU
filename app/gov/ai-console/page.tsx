import Nav from "../../../components/Nav"; import {requireRole,isGov} from "../../../lib/auth"; import {readDB} from "../../../lib/db"; import {triage} from "../../../lib/triage";
export const dynamic="force-dynamic";
export default async function AIConsole(){
  await requireRole(isGov);const db=readDB();
  return <><Nav/><main className="container"><div className="eyebrow">Transparent AI triage</div><h1>AI console</h1><p className="muted">LocalProvider uses keyword scoring and heuristics. Gemini can be added later through the same provider interface. Every stage shows its output and confidence.</p>
  {db.problems.slice(0,6).map((p:any)=>{const t=triage(p.title+" "+p.description);return <div className="card section" key={p.id}><div className="row"><h3>{p.title}</h3><span className="status">{t.domain} · {t.priority}</span></div><div className="pipeline">{t.stages.map((s,i)=><div className="stage" key={s.stage} style={{flex:1}}><b>{i+1}. {s.stage}</b><span>{Math.round(s.confidence*100)}% — {s.output}</span></div>)}</div></div>})}
  <div className="notice">Routing stays explainable: domain match (50%) + geography (20%) + capacity (30%). Government can override any stage.</div></main></>}
