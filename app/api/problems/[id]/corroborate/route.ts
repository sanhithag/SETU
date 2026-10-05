import {NextResponse} from "next/server"; import {readDB,writeDB} from "../../../../../lib/db"; import {getSession} from "../../../../../lib/auth";
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getSession(); if(!user)return NextResponse.json({error:"Please sign in to corroborate."},{status:401});
  const {id}=await params;const db=readDB();const p=db.problems.find((x:any)=>x.id===id);if(!p)return NextResponse.json({error:"Not found."},{status:404});
  p.corroboratedBy=p.corroboratedBy||[];if(p.corroboratedBy.includes(user.id))return NextResponse.json({error:"Already corroborated."},{status:409});
  p.corroboratedBy.push(user.id);p.corroborationCount++;writeDB(db);return NextResponse.json({count:p.corroborationCount});
}
