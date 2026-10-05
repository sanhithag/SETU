import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readDB } from "./db";
import { Role } from "./types";

export async function getSession() {
  const store = await cookies();
  const id = store.get("setu_user")?.value;
  if (!id) return null;
  const db = readDB();
  return db.users.find((u:any)=>u.id===id) ?? null;
}
export function roleHome(role:Role) {
  if (role==="GOV_ADMIN" || role==="GOV_MODERATOR") return "/gov";
  if (role==="UNIVERSITY" || role==="INDUSTRY") return "/org";
  return "/dashboard";
}
export const isGov=(r?:string)=>r==="GOV_ADMIN"||r==="GOV_MODERATOR";
export const isOrg=(r?:string)=>r==="UNIVERSITY"||r==="INDUSTRY";
/** Demo mapping: each org user acts for one organisation. */
export function orgIdFor(user:any){ return ({u3:"o1",u4:"o3"} as Record<string,string>)[user?.id] ?? null }
/** Server-page guard: redirects to login if not signed in / wrong role. */
export async function requireRole(check:(r:string)=>boolean){
  const u=await getSession();
  if(!u) redirect("/login");
  if(!check(u.role)) redirect(roleHome(u.role));
  return u;
}
export function pushAudit(db:any,user:any,entityType:string,entityId:string,action:string){
  db.audit.unshift({id:"a"+Date.now()+Math.floor(Math.random()*999),actorId:user.id,actorRole:user.role,entityType,entityId,action,createdAt:new Date().toISOString()});
}
export function notify(db:any,userId:string,title:string,body:string){
  db.notifications.unshift({id:"n"+Date.now()+Math.floor(Math.random()*999),userId,title,body,read:false,createdAt:new Date().toISOString()});
}
