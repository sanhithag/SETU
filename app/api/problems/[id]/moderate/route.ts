import {NextResponse} from "next/server"; import {readDB,writeDB} from "../../../../../lib/db"; import {getSession,isGov,pushAudit,notify} from "../../../../../lib/auth";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getSession(); if(!user||!isGov(user.role))return NextResponse.json({error:"Government access only."},{status:403});
  const {id}=await params;const {action}=await req.json();const db=readDB();const p=db.problems.find((x:any)=>x.id===id);
  if(!p)return NextResponse.json({error:"Problem not found."},{status:404});
  const map:Record<string,[string,string]>={approve:["OPEN_FOR_BIDS","Approved and opened for bids."],reject:["REJECTED","Problem rejected."],clarify:["NEEDS_CLARIFICATION","Asked the citizen for more detail."]};
  if(!map[action])return NextResponse.json({error:"Unknown action."},{status:400});
  p.status=map[action][0];pushAudit(db,user,"Problem",id,"MODERATION_"+action.toUpperCase());
  notify(db,p.submittedById,`Update on “${p.title}”`,map[action][1]);
  writeDB(db);return NextResponse.json({ok:true,message:map[action][1]});
}
