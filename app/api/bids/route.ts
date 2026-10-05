import {NextResponse} from "next/server"; import {readDB,writeDB} from "../../../lib/db"; import {getSession,isOrg,orgIdFor,pushAudit,notify} from "../../../lib/auth";
export async function GET(){const db=readDB();return NextResponse.json({bids:db.bids.map((b:any)=>({...b,problemTitle:db.problems.find((p:any)=>p.id===b.problemId)?.title||"Unknown",orgName:db.organisations.find((o:any)=>o.id===b.orgId)?.name||"Unknown"}))})}
export async function POST(req:Request){
  const user=await getSession();if(!user||!isOrg(user.role))return NextResponse.json({error:"Only university or industry accounts can bid."},{status:403});
  const body=await req.json();const db=readDB();const orgId=orgIdFor(user);
  const problem=db.problems.find((p:any)=>p.id===body.problemId);
  if(!problem||problem.status!=="OPEN_FOR_BIDS")return NextResponse.json({error:"This problem is not open for bids."},{status:400});
  if(db.bids.some((b:any)=>b.problemId===problem.id&&b.orgId===orgId))return NextResponse.json({error:"Your organisation already bid on this problem."},{status:409});
  if(!body.title||!body.approach||Number(body.budget)<=0)return NextResponse.json({error:"Title, approach and a positive budget are required."},{status:400});
  const org=db.organisations.find((o:any)=>o.id===orgId);
  const domainFit=org?.domains.includes(problem.domain)?40:20;
  const b={id:"b"+Date.now(),problemId:problem.id,orgId,title:body.title,approach:body.approach,teamMembers:body.teamMembers||[],timeline:body.timeline||"8 weeks",budget:Number(body.budget),status:"SUBMITTED",score:Math.min(95,50+domainFit+Math.min(10,Math.floor(body.approach.length/60)))};
  db.bids.push(b);pushAudit(db,user,"Bid",b.id,"BID_SUBMITTED");
  db.users.filter((u:any)=>isOrg(u.role)===false&&u.role.startsWith("GOV")).forEach((g:any)=>notify(db,g.id,"New bid received",`${org?.name} bid on “${problem.title}”.`));
  writeDB(db);return NextResponse.json({bid:b})}
