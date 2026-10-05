import Nav from "../../../components/Nav"; import ProjectCard from "../../../components/ProjectCard"; import {requireRole,isGov} from "../../../lib/auth"; import {readDB} from "../../../lib/db";
export const dynamic="force-dynamic";
export default async function GovProjects(){
  await requireRole(isGov);const db=readDB();
  return <><Nav/><main className="container"><div className="eyebrow">Government</div><h1>Project oversight</h1><p className="muted">Verify milestones once an organisation submits them.</p><div className="grid section" style={{gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))"}}>{db.projects.length?db.projects.map((p:any)=><ProjectCard key={p.id} p={p} mode="gov" title={db.problems.find((x:any)=>x.id===p.problemId)?.title} orgName={db.organisations.find((o:any)=>o.id===p.universityOrgId)?.name}/>):<div className="card empty">No projects yet.</div>}</div></main></>}
