import Nav from "../../components/Nav"; import SubmitWizard from "../../components/SubmitWizard"; import {requireRole} from "../../lib/auth";
export default async function Submit(){await requireRole(r=>r==="CITIZEN");return <><Nav/><main className="container"><SubmitWizard/></main></>}
