import Link from "next/link"; import Nav from "../components/Nav";
export default function NotFound(){return <><Nav/><main className="container"><div className="card empty"><h1>Page not found</h1><p>The page you’re looking for doesn’t exist or was moved.</p><Link className="btn primary" href="/">Back to home</Link></div></main></>}
