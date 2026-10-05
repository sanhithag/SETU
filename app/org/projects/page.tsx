import Nav from "../../../components/Nav"; import ProjectCard from "../../../components/ProjectCard"; import {requireRole,isOrg,orgIdFor} from "../../../lib/auth"; import {readDB} from "../../../lib/db";
export const dynamic="force-dynamic";
export default async function Projects(){
  const u=await requireRole(isOrg);const db=readDB();const list=db.projects.filter((p:any)=>p.universityOrgId===orgIdFor(u));
  return <><Nav/><main className="container"><div className="eyebrow">Project workspace</div><h1>Active projects</h1><div className="grid section" style={{gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))"}}>{list.length?list.map((p:any)=><ProjectCard key={p.id} p={p} mode="org" title={db.problems.find((x:any)=>x.id===p.problemId)?.title}/>):<div className="card empty">No projects yet — win a bid to get started.</div>}</div></main></>}
