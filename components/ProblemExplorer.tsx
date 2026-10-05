"use client";
import {useMemo,useState} from "react"; import ProblemCard from "./ProblemCard";
export default function ProblemExplorer({problems}:{problems:any[]}){
  const [q,setQ]=useState(""); const [domain,setDomain]=useState("All"); const [status,setStatus]=useState("All"); const [sort,setSort]=useState("new");
  const domains=useMemo(()=>["All",...Array.from(new Set(problems.map(p=>p.domain)))],[problems]);
  const statuses=useMemo(()=>["All",...Array.from(new Set(problems.map(p=>p.status)))],[problems]);
  const list=useMemo(()=>problems.filter(p=>(domain==="All"||p.domain===domain)&&(status==="All"||p.status===status)&&(p.title+" "+p.description+" "+p.location).toLowerCase().includes(q.toLowerCase()))
    .sort((a,b)=>sort==="priority"?a.priority.localeCompare(b.priority):sort==="support"?b.corroborationCount-a.corroborationCount:b.createdAt.localeCompare(a.createdAt)),[problems,q,domain,status,sort]);
  return <>
    <div className="filters"><input aria-label="Search" placeholder="Search problems, places…" value={q} onChange={e=>setQ(e.target.value)}/>
      <select aria-label="Domain" value={domain} onChange={e=>setDomain(e.target.value)}>{domains.map(d=><option key={d}>{d}</option>)}</select>
      <select aria-label="Status" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(d=><option key={d} value={d}>{d.replaceAll("_"," ")}</option>)}</select>
      <select aria-label="Sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Newest</option><option value="priority">Priority</option><option value="support">Most supported</option></select></div>
    <p className="muted">{list.length} of {problems.length} problems</p>
    <div className="grid">{list.length?list.map(p=><ProblemCard key={p.id} p={p}/>):<div className="card empty">No problems match your filters.</div>}</div></>
}
