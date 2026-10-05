import Link from "next/link"; import {Landmark} from "lucide-react";
import NavLinks from "./NavLinks";
import {getSession,isGov,isOrg} from "../lib/auth";
import {readDB} from "../lib/db";
export default async function Nav(_props:{role?:string}){
  const u=await getSession();
  const role=u?.role||"";
  const items=isGov(role)?[["/gov","Overview"],["/gov/moderation","Moderation"],["/gov/bids","Bids"],["/gov/ai-console","AI Console"],["/gov/audit","Audit"]]:
    isOrg(role)?[["/org","Workspace"],["/org/marketplace","Marketplace"],["/org/bids","My Bids"],["/org/projects","Projects"]]:
    u?[["/dashboard","Dashboard"],["/submit","Report a Problem"],["/problems","Browse"]]:
    [["/problems","Browse Problems"],["/impact","Impact"],["/about","How it works"]];
  const unread=u?readDB().notifications.filter((n:any)=>n.userId===u.id&&!n.read).length:0;
  return <nav className="nav" aria-label="Main"><Link href="/" className="brand"><Landmark size={18} aria-hidden="true"/> SETU</Link><div className="nav-links"><NavLinks items={items} signedIn={!!u} name={u?.name} unread={unread}/></div></nav>
}
