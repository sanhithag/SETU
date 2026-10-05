"use client";
import {useState} from "react"; import {useRouter} from "next/navigation";
async function post(url:string,body?:any,method="POST"){const r=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});return {ok:r.ok,j:await r.json().catch(()=>({}))}}

export function CorroborateButton({id,count,already,canAct}:{id:string,count:number,already:boolean,canAct:boolean}){
  const [n,setN]=useState(count);const [done,setDone]=useState(already);const [err,setErr]=useState("");const router=useRouter();
  async function go(){if(!canAct){router.push("/login");return}const {ok,j}=await post(`/api/problems/${id}/corroborate`);if(ok){setN(j.count);setDone(true)}else setErr(j.error)}
  return <div><button className={`btn ${done?"":"primary"}`} disabled={done} onClick={go}>{done?"✓ You face this too":"I face this too"} · {n}</button>{err&&<p className="muted">{err}</p>}</div>
}

export function ModerationButtons({id}:{id:string}){
  const [busy,setBusy]=useState("");const [msg,setMsg]=useState("");const router=useRouter();
  async function act(action:string){setBusy(action);const {ok,j}=await post(`/api/problems/${id}/moderate`,{action});setBusy("");if(ok){setMsg(j.message);router.refresh()}else setMsg(j.error)}
  return <div><div className="actions" style={{marginTop:12}}>
    <button className="btn primary" disabled={!!busy} onClick={()=>act("approve")}>{busy==="approve"?"…":"Approve & open for bids"}</button>
    <button className="btn" disabled={!!busy} onClick={()=>act("clarify")}>Ask for details</button>
    <button className="btn danger" disabled={!!busy} onClick={()=>act("reject")}>Reject</button></div>{msg&&<p className="muted">{msg}</p>}</div>
}

export function AwardButton({problemId,bidId,disabled}:{problemId:string,bidId:string,disabled?:boolean}){
  const [state,setState]=useState<"idle"|"busy"|"done"|"err">("idle");const [err,setErr]=useState("");const router=useRouter();
  async function go(){if(!confirm("Award this project? Other bids for the problem will be closed."))return;setState("busy");const {ok,j}=await post("/api/projects",{problemId,bidId});if(ok){setState("done");router.refresh()}else{setErr(j.error);setState("err")}}
  if(disabled||state==="done")return <span className="status">Awarded</span>;
  return <><button className="btn primary" disabled={state==="busy"} onClick={go}>{state==="busy"?"Awarding…":"Award"}</button>{err&&<div className="muted">{err}</div>}</>
}

const NEXT:Record<string,string>={PENDING:"IN_PROGRESS",IN_PROGRESS:"SUBMITTED",SUBMITTED:"VERIFIED"};
export function MilestoneButton({projectId,milestoneId,status,mode}:{projectId:string,milestoneId:string,status:string,mode:"org"|"gov"|"view"}){
  const router=useRouter();const [busy,setBusy]=useState(false);
  const can=(mode==="org"&&(status==="PENDING"||status==="IN_PROGRESS"))||(mode==="gov"&&status==="SUBMITTED");
  if(!can)return null;
  const label=status==="PENDING"?"Start":status==="IN_PROGRESS"?"Submit for review":"Verify";
  async function go(){setBusy(true);await post("/api/projects",{projectId,milestoneId,status:NEXT[status]},"PATCH");setBusy(false);router.refresh()}
  return <button className="btn" style={{padding:"6px 10px"}} disabled={busy} onClick={go}>{busy?"…":label}</button>
}

export function MarkAllRead(){const router=useRouter();return <button className="btn" onClick={async()=>{await post("/api/notifications");router.refresh()}}>Mark all as read</button>}
