const STEPS=[["SUBMITTED","Submitted"],["PENDING_MODERATION","Moderation"],["OPEN_FOR_BIDS","Open for bids"],["AWARDED","Awarded"],["IN_PROGRESS","In progress"],["IMPACT_VERIFIED","Impact verified"]];
const ORDER:Record<string,number>={SUBMITTED:0,AI_TRIAGE:0,SPAM_QUARANTINE:1,NEEDS_CLARIFICATION:1,PENDING_MODERATION:1,VALIDATED:2,ROUTED:2,OPEN_FOR_BIDS:2,BIDDING_CLOSED:2,AWARDED:3,IN_PROGRESS:4,UNDER_REVIEW:4,SOLUTION_VALIDATED:4,DEPLOYED:4,IMPACT_VERIFIED:5};
export default function Timeline({status}:{status:string}){
  if(status==="REJECTED")return <div className="notice dangerbox">This problem was rejected by a moderator.</div>;
  const cur=ORDER[status]??0;
  return <ol className="timeline">{STEPS.map(([k,l],i)=><li key={k} className={i<cur?"done":i===cur?"now":""}><i>{i<cur?"✓":i+1}</i><span>{l}</span></li>)}</ol>
}
