import Link from "next/link";
import Status from "./Status";
export default function ProblemCard({p}:{p:any}){return <Link className="card problem-card" href={`/problems/${p.id}`}><div className="row"><span className={`priority ${p.priority}`}>{p.priority}</span><Status>{p.status.replaceAll("_"," ")}</Status></div><h3>{p.title}</h3><p className="clamp">{p.description}</p><div className="muted">{p.domain} · {p.location} · {p.corroborationCount} people corroborated</div></Link>}
