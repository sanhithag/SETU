"use client";
import {useState} from "react"; import {useRouter} from "next/navigation";
export default function BidForm({problemId}:{problemId:string}){
  const [f,setF]=useState({title:"",approach:"",budget:"150000",timeline:"8 weeks"});const [err,setErr]=useState("");const [busy,setBusy]=useState(false);const router=useRouter();
  const set=(k:string)=>(e:any)=>setF({...f,[k]:e.target.value});
  async function submit(e:any){e.preventDefault();setBusy(true);setErr("");const r=await fetch("/api/bids",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({problemId,...f})});const j=await r.json();if(!r.ok){setBusy(false);return setErr(j.error)}router.push("/org/bids")}
  return <form className="card form" onSubmit={submit}><div className="field"><label>Proposal title</label><input required value={f.title} onChange={set("title")} placeholder="Community Water Safety Pilot"/></div>
   <div className="field"><label>Approach &amp; methodology</label><textarea required value={f.approach} onChange={set("approach")} placeholder="Explain the technical and field approach."/></div>
   <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}><div className="field"><label>Total budget (₹)</label><input type="number" min="1" required value={f.budget} onChange={set("budget")}/></div><div className="field"><label>Timeline</label><select value={f.timeline} onChange={set("timeline")}>{["4 weeks","8 weeks","12 weeks","6 months"].map(x=><option key={x}>{x}</option>)}</select></div></div>
   {err&&<div className="notice dangerbox" role="alert">{err}</div>}<button className="btn primary" disabled={busy}>{busy?"Submitting…":"Submit sealed bid"}</button></form>
}
