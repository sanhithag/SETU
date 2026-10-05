import {NextResponse} from "next/server"; import {readDB,writeDB} from "../../../lib/db"; import {getSession,pushAudit,notify} from "../../../lib/auth"; import {triage} from "../../../lib/triage"; import {savePhotos} from "../../../lib/photos";
export async function GET(){const db=readDB();return NextResponse.json({problems:db.problems})}
export async function POST(req:Request){
  const user=await getSession();if(!user)return NextResponse.json({error:"Please sign in first."},{status:401});
  const body=await req.json();
  if(!body.title?.trim()||!body.description?.trim())return NextResponse.json({error:"Title and description are required."},{status:400});
  const id="p"+Date.now();const ph=savePhotos(id,body.images);if(ph.error)return NextResponse.json({error:ph.error},{status:400});
  const db=readDB();const district=db.districts.find((d:any)=>d.id===body.districtId)||db.districts[0];
  const t=triage(body.title+" "+body.description, ph.files.length);const now=new Date().toISOString();
  const p:any={id,photos:ph.files,title:body.title.trim(),description:body.description.trim(),districtId:district.id,location:district.name+", Jharkhand",domain:t.domain,subdomain:"General",priority:t.priority,priorityScore:t.priorityScore,categories:t.categories,keywords:t.keywords,status:t.spam?"SPAM_QUARANTINE":"PENDING_MODERATION",submittedById:user.id,corroborationCount:0,aiSummary:t.stages.map(s=>s.output).join(" "),createdAt:now,triageCompletedAt:now};
  db.problems.unshift(p);pushAudit(db,user,"Problem",p.id,"SUBMITTED_AND_TRIAGED");
  db.users.filter((u:any)=>u.role.startsWith("GOV")).forEach((g:any)=>notify(db,g.id,"New problem to moderate",p.title));
  notify(db,user.id,"Problem received",t.spam?"Flagged for review by a moderator.":"AI triage done. A moderator will review it shortly.");
  writeDB(db);return NextResponse.json({problem:p})}
