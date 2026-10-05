"use client";
import Link from "next/link"; import {Bell} from "lucide-react"; import {usePathname,useRouter} from "next/navigation";
export default function NavLinks({items,signedIn,name,unread}:{items:string[][];signedIn:boolean;name?:string;unread:number}){
  const path=usePathname(); const router=useRouter();
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.push("/login");router.refresh()}
  return <>
    {items.map(([href,label])=><Link key={href} href={href} aria-current={path===href?"page":undefined} className={path===href||(href!=="/"&&path.startsWith(href+"/"))?"active":""}>{label}</Link>)}
    {signedIn&&<Link href="/notifications" className="bell" aria-label={unread>0?`Notifications, ${unread} unread`:"Notifications"}><Bell size={18} aria-hidden="true"/>{unread>0&&<span className="badge" aria-hidden="true">{unread}</span>}</Link>}
    {signedIn?<button className="nav-login" onClick={logout} title="Sign out">{name?.split(" ")[0]} · Sign out</button>:<Link href="/login" className="nav-login">Sign in</Link>}
  </>
}
