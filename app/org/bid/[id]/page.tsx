import Link from "next/link"; import Nav from "../../../../components/Nav"; import BidForm from "../../../../components/BidForm"; import {requireRole,isOrg} from "../../../../lib/auth"; import {readDB} from "../../../../lib/db";
export default async function Bid({params}:{params:Promise<{id:string}>}){
  await requireRole(isOrg);const {id}=await params;const p=readDB().problems.find((x:any)=>x.id===id);
  return <><Nav/><main className="container"><Link className="muted" href="/org/marketplace">← Marketplace</Link><div className="eyebrow" style={{marginTop:10}}>Solution bid composer</div><h1>Submit a solution proposal</h1>
  {p?<div className="card" style={{marginBottom:16}}><b>{p.title}</b><p className="muted">{p.description}</p></div>:<div className="notice dangerbox">Problem not found.</div>}{p&&<BidForm problemId={p.id}/>}</main></>}
