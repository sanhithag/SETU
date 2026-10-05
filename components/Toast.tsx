export default function Toast({kind="success",children}:{kind?:"success"|"error"|"info";children:React.ReactNode}){
  return <div className={`notice ${kind==="success"?"success":kind==="error"?"dangerbox":""}`} role={kind==="error"?"alert":"status"} aria-live="polite">{children}</div>
}
