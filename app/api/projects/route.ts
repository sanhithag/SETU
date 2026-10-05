import {NextResponse} from "next/server"; import {readDB,writeDB} from "../../../lib/db"; import {getSession,isGov,isOrg,pushAudit,notify} from "../../../lib/auth";
export async function GET(){const db=readDB();return NextResponse.json({projects:db.projects})}
export async function POST(req:Request){
  const user=await getSession();if(!user||!isGov(user.role))return NextResponse.json({error:"Government access only."},{status:403});
  const {problemId,bidId}=await req.json();const db=readDB();
  const bid=db.bids.find((b:any)=>b.id===bidId);const problem=db.problems.find((p:any)=>p.id===problemId);
  if(!bid||!problem)return NextResponse.json({error:"Bid or problem not found."},{status:404});
  if(db.projects.some((p:any)=>p.problemId===problemId))return NextResponse.json({error:"This problem already has a project."},{status:409});
  const d=(n:number)=>new Date(Date.now()+n*86400000).toISOString().slice(0,10);const t=Date.now();
  const project={id:"pr"+t,problemId,solutionBidId:bidId,universityOrgId:bid.orgId,status:"ACTIVE",funding:bid.budget,targetCompletionAt:d(60),milestones:[{id:"m"+t+"1",title:"Baseline assessment",dueDate:d(14),status:"PENDING"},{id:"m"+t+"2",title:"Prototype and field test",dueDate:d(40),status:"PENDING"},{id:"m"+t+"3",title:"Community validation",dueDate:d(60),status:"PENDING"}]};
  db.projects.push(project);problem.status="AWARDED";
  db.bids.forEach((b:any)=>{if(b.problemId===problemId)b.status=b.id===bidId?"AWARDED":"NOT_SELECTED"});
  pushAudit(db,user,"Project",project.id,"AWARDED");
  notify(db,problem.submittedById,"A solution partner was selected",`Work has begun on “${problem.title}”.`);
  const orgUser=db.users.find((u:any)=>({u3:"o1",u4:"o3"} as any)[u.id]===bid.orgId);if(orgUser)notify(db,orgUser.id,"Your bid was awarded 🎉",`“${bid.title}” is now an active project.`);
  writeDB(db);return NextResponse.json({project})}
export async function PATCH(req:Request){
  const user=await getSession();if(!user)return NextResponse.json({error:"Sign in."},{status:401});
  const {projectId,milestoneId,status}=await req.json();const db=readDB();
  const pr=db.projects.find((p:any)=>p.id===projectId);const m=pr?.milestones.find((x:any)=>x.id===milestoneId);if(!m)return NextResponse.json({error:"Not found."},{status:404});
  if(status==="VERIFIED"?!isGov(user.role):!isOrg(user.role))return NextResponse.json({error:"Not permitted."},{status:403});
  m.status=status;pushAudit(db,user,"Milestone",m.id,"MILESTONE_"+status);
  if(pr.milestones.every((x:any)=>x.status==="VERIFIED")){pr.status="COMPLETED";const pb=db.problems.find((p:any)=>p.id===pr.problemId);if(pb)pb.status="IMPACT_VERIFIED"}
  writeDB(db);return NextResponse.json({ok:true})}
