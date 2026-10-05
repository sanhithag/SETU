import "./globals.css";
import Link from "next/link";
export const metadata={title:"Setu — Societal Innovation Collaboration Portal",description:"Citizen problems connected to universities, industry and government."};export const viewport={width:"device-width",initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip">Skip to content</a><div id="main">{children}</div><footer className="container footer"><div>SETU · Societal Innovation Collaboration Portal · Demo build for SIH PS 26043</div><div style={{marginTop:6}}><Link href="/about">How it works</Link> · <Link href="/impact">Impact</Link> · <Link href="/problems">Problems</Link></div></footer></body></html>}
