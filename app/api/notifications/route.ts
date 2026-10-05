import {NextResponse} from "next/server"; import {readDB,writeDB} from "../../../lib/db"; import {getSession} from "../../../lib/auth";
export async function POST(){const u=await getSession();if(!u)return NextResponse.json({error:"Sign in."},{status:401});const db=readDB();db.notifications.forEach((n:any)=>{if(n.userId===u.id)n.read=true});writeDB(db);return NextResponse.json({ok:true})}
