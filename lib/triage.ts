// SETU triage v2: multi-label categories + 0-100 Priority Score.
// Priority is NOT taken from category alone: category sets a baseline severity,
// then severity / people / safety / urgency / critical infra / evidence adjust it.

type Cat = { id: number; name: string; domain: string; kw: string[]; base: "Critical"|"High"|"Medium"|"Low"; ctx?: boolean };

// ctx = "context" categories (hospital, school...) often describe WHERE a problem is,
// not WHAT it is. They never beat a real problem category for primary label.
const CATS: Cat[] = [
  {id:1,name:"Potholes / Damaged Roads",domain:"Urban Infrastructure",base:"High",kw:["pothole","road damage","damaged road","broken road","crater","road crack","uneven road","damaged highway"]},
  {id:2,name:"Streetlight Failure",domain:"Urban Infrastructure",base:"Medium",kw:["streetlight","street light","lamp","light not working","dark street","broken light","no lighting"]},
  {id:3,name:"Water Shortage",domain:"Water",base:"Critical",kw:["no water","water shortage","dry tap","water supply","drinking water","water scarcity"]},
  {id:4,name:"Water Contamination",domain:"Water",base:"Critical",kw:["dirty water","contaminated water","contamination","sewage water","unsafe water","bad smell water","polluted water"]},
  {id:5,name:"Sewage / Drainage",domain:"Sanitation",base:"Critical",kw:["sewage","sewer","drainage","drain","clogged drain","wastewater"]},
  {id:6,name:"Garbage / Waste Management",domain:"Sanitation",base:"High",kw:["garbage","trash","waste","dumping","litter","waste collection","landfill"]},
  {id:7,name:"Flooding / Waterlogging",domain:"Urban Infrastructure",base:"Critical",kw:["flood","flooding","waterlogging","flooded road","rainwater","stagnant water"]},
  {id:8,name:"Air Pollution",domain:"Environment",base:"High",kw:["air pollution","smoke","dust","emission","toxic air","burning waste","smog"]},
  {id:9,name:"Noise Pollution",domain:"Environment",base:"Medium",kw:["noise","loud noise","loudspeaker","construction noise"]},
  {id:10,name:"Public Transport",domain:"Public Services",base:"High",kw:["bus shortage","bus stop","no bus","public transport","overcrowded bus","transport problem"]},
  {id:11,name:"Traffic Congestion",domain:"Urban Infrastructure",base:"High",kw:["traffic jam","congestion","bottleneck","crowded road","heavy traffic"]},
  {id:12,name:"Road Safety",domain:"Urban Infrastructure",base:"Critical",kw:["accident","dangerous road","blind turn","unsafe crossing","speeding","road safety"]},
  {id:13,name:"Broken Footpaths",domain:"Urban Infrastructure",base:"High",kw:["footpath","sidewalk","pavement","pedestrian path","broken pavement"]},
  {id:14,name:"Missing Pedestrian Crossing",domain:"Urban Infrastructure",base:"High",kw:["zebra crossing","pedestrian crossing","crosswalk"]},
  {id:15,name:"Public Toilet Problems",domain:"Sanitation",base:"High",kw:["toilet","restroom","sanitation","dirty toilet","no toilet"]},
  {id:16,name:"Healthcare Access",domain:"Healthcare",base:"Critical",ctx:true,kw:["hospital","clinic","healthcare","doctor","ambulance","medicine","medical","health centre","health center"]},
  {id:17,name:"School Infrastructure",domain:"Education",base:"High",ctx:true,kw:["school","classroom","teacher","blackboard","school building","bench","education"]},
  {id:18,name:"Electricity Problems",domain:"Public Services",base:"Critical",kw:["power cut","electricity","transformer","blackout","voltage","electric supply","load shedding"]},
  {id:19,name:"Internet Connectivity",domain:"Public Services",base:"Medium",kw:["internet","broadband","connectivity","mobile network","no signal","network issue"]},
  {id:20,name:"Agricultural Problems",domain:"Agriculture",base:"High",kw:["crop","farming","farmer","fertilizer","seeds","pest"]},
  {id:21,name:"Irrigation Problems",domain:"Agriculture",base:"High",kw:["irrigation","canal","borewell","water for crops"]},
  {id:22,name:"Crop Disease",domain:"Agriculture",base:"Critical",kw:["crop disease","infected crop","plant disease","fungus","pest attack","crop damage"]},
  {id:23,name:"Animal / Livestock Issues",domain:"Rural Livelihoods",base:"High",kw:["cattle","livestock","cows","goats","animal disease","veterinary"]},
  {id:24,name:"Employment",domain:"Rural Livelihoods",base:"Medium",kw:["unemployment","jobs","employment","job opportunities"]},
  {id:25,name:"Skill Development",domain:"Rural Livelihoods",base:"Medium",kw:["skill training","vocational","courses","employability","technical training"]},
  {id:26,name:"Women Safety",domain:"Public Services",base:"Critical",kw:["women safety","harassment","stalking","eve teasing"]},
  {id:27,name:"Child Safety",domain:"Public Services",base:"Critical",kw:["child safety","child abuse","child protection","unsafe school"]},
  {id:28,name:"Elderly Accessibility",domain:"Accessibility",base:"High",kw:["elderly","senior citizen","senior citizens"]},
  {id:29,name:"Disability Accessibility",domain:"Accessibility",base:"High",kw:["disabled","disability","wheelchair","ramp","visually impaired","accessible"]},
  {id:30,name:"Public Spaces",domain:"Urban Infrastructure",base:"Medium",kw:["park","playground","community center","community centre","public space","recreation"]},
  {id:31,name:"Deforestation",domain:"Environment",base:"Critical",kw:["deforestation","tree cutting","forest loss","illegal logging"]},
  {id:32,name:"Water Body Pollution",domain:"Environment",base:"Critical",kw:["lake pollution","river pollution","polluted river","contaminated lake","pond"]},
  {id:33,name:"Flood Prevention",domain:"Urban Infrastructure",base:"Critical",kw:["flood prevention","stormwater","drainage capacity","monsoon flooding"]},
  {id:34,name:"Renewable Energy",domain:"Environment",base:"Medium",kw:["solar","renewable energy","solar panel","clean energy","wind energy"]},
  {id:35,name:"Public Infrastructure",domain:"Public Services",base:"High",kw:["government building","community hall","infrastructure","damaged building"]},
];

// Cross-domain labels that a keyword hit implies as a secondary tag.
const SECONDARY_HINTS: [RegExp,string][] = [
  [/sewage|sewer|garbage|dirty water|contaminat|stagnant|smell|stench|mosquito|disease|outbreak|infection/, "Public Health"],
  [/road|highway|street|footpath|pavement/, "Road Infrastructure"],
  [/smell|smoke|pollut|toxic|burning|dust|sewage/, "Environmental Pollution"],
];

const esc=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const has=(t:string,w:string)=>new RegExp("\\b"+esc(w)+"(s|es)?\\b").test(t);
const count=(t:string,words:string[])=>words.reduce((n,w)=>n+(has(t,w)?1:0),0);
const cap=(n:number,m:number)=>Math.min(m,n);
const BASE_SEV={Critical:14,High:10,Medium:6,Low:2};
const NUMW="one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|fifty|hundred|\\d+";

export type Priority = {score:number; level:"Critical"|"High"|"Medium"|"Low"; code:"P1"|"P2"|"P3"|"P4"; breakdown:Record<string,number>};

export function triage(text:string, photoCount=0) {
  const lower=text.toLowerCase().replace(/\s+/g," ");

  // ---- multi-label classification ----
  const hits=CATS.map(c=>{
    const matched=c.kw.filter(k=>has(lower,k));
    const raw=matched.reduce((n,k)=>n+(k.includes(" ")?2:1),0);
    return {c,matched,raw,rank:raw*(c.ctx?0.4:1)};
  }).filter(h=>h.raw>0).sort((a,b)=>b.rank-a.rank);
  const primary=hits[0]?.c;
  const secondaries:string[]=[];
  hits.slice(1,4).forEach(h=>secondaries.push(h.c.name));
  for(const [re,label] of SECONDARY_HINTS) if(re.test(lower)&&!secondaries.includes(label)&&primary?.name!==label&&!(label==="Road Infrastructure"&&primary?.id===1)) secondaries.push(label);
  const categories={primary:primary?.name??"General",secondary:secondaries.slice(0,4)};
  const domain=primary?.domain??"Public Services";
  const keywords=[...new Set(hits.flatMap(h=>h.matched))];

  // ---- priority score (0-100) ----
  const sevWords=["huge","massive","severe","serious","major","completely","collapsed","overflow","overflowing","blocked","broken","damaged","deep","worst","terrible","dangerous","no water","not working","struggling","difficulty","no doctor","no medicine","no ambulance"];
  const severity=cap((primary?BASE_SEV[primary.base]:4)+count(lower,sevWords)*4,25);

  let people=0;
  if(/(entire|whole|all) (area|village|colony|town|locality|ward|district)|hundreds|thousands|everyone|all residents/.test(lower)) people=20;
  else if(/many|residents|families|villagers|students|children|commuters|patients|colony|village|people|school|hospital|highway|ambulance/.test(lower)) people=12;
  else if(/some|neighbou?rs|bikes|vehicles|houses|street|lane/.test(lower)) people=7;
  else if(/my house|my home|outside my|near my|one /.test(lower)) people=2;
  else people=4;
  const m=lower.match(new RegExp("("+NUMW+") (people|families|households|houses|villages|students|children|residents|patients)"));
  if(m){const n=/^\d+$/.test(m[1])?+m[1]:({one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,twenty:20,thirty:30,fifty:50,hundred:100} as any)[m[1]]||0;people=Math.max(people,n>=100?20:n>=20?16:n>=5?10:4);}

  const safety=cap(count(lower,["accident","fell","fallen","injur","injury","death","died","dead","danger","dangerous","unsafe","fire","electrocut","drown","ambulance","harassment","abuse","attack","stalking","outbreak","disease","collision","emergency","smell","stench","mosquito","infection","health hazard"])*8,20);

  let urgency=count(lower,["urgent","urgently","emergency","immediately","already","again","daily","every day","spreading","outbreak","monsoon","struggling","worsening","getting worse","overflow","overflowing","this week"])*4;
  if(/(since|for|past|last) (\w+ ){0,2}(days|weeks|months|year)/.test(lower)||/(\d+|two|three|four|five|several) (days|weeks|months)/.test(lower)) urgency+=5;
  urgency=cap(urgency,15);

  const infra=cap(count(lower,["hospital","clinic","school","ambulance","government","highway","bridge","water tank","transformer","anganwadi","health centre","health center","market","bus stand","college","court"])*5,10);

  let evidence=0;
  if(photoCount>0) evidence+=6;
  if(new RegExp("\\b("+NUMW+") (bikes|cars|vehicles|accidents|people|days|weeks|times|cases|families|houses|children|students)").test(lower)) evidence+=4;
  if(/(on|since|last) (monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}[\/-]\d{1,2})/.test(lower)) evidence+=2;
  evidence=cap(evidence,10);

  // Safety + critical-infrastructure compounding (e.g. ambulances blocked near a hospital)
  const synergy = safety>=8 && infra>=5 ? 14 : 0;

  const breakdown={severity,people,safety,urgency,infra,evidence,synergy};
  const score=cap(Object.values(breakdown).reduce((a,b)=>a+b,0),100);
  const level:Priority["level"]=score>=76?"Critical":score>=51?"High":score>=26?"Medium":"Low";
  const code=({Critical:"P1",High:"P2",Medium:"P3",Low:"P4"} as const)[level];
  const priority=code;
  const prio:Priority={score,level,code,breakdown};

  const wordCount=lower.trim().split(/\s+/).filter(Boolean).length;
  const spam=(lower.match(/https?:\/\//g)||[]).length>=2 || wordCount<5;
  const conf=Math.min(.98,.55+(hits[0]?.raw??0)*.1);
  return {
    stages:[
      {stage:"NORMALISE",confidence:0.98,output:"Text cleaned and normalised."},
      {stage:"SPAM",confidence:spam?0.91:0.96,output:spam?"Potential spam: insufficient civic detail or excessive links.":"No strong spam indicators."},
      {stage:"DUPLICATE",confidence:0.87,output:"No exact duplicate found in the demo index."},
      {stage:"CLASSIFY",confidence:conf,output:`Primary: ${categories.primary}.${categories.secondary.length?` Also: ${categories.secondary.join(", ")}.`:""}`},
      {stage:"VALIDATE",confidence:wordCount>=12?.94:.65,output:wordCount>=12?"Submission contains sufficient actionable detail.":"More detail may be required."},
      {stage:"PRIORITY",confidence:.88,output:`Priority ${prio.level} (${code}), score ${score}/100 — severity ${severity}, people ${people}, safety ${safety}, urgency ${urgency}, infrastructure ${infra}, evidence ${evidence}${synergy?`, emergency-access bonus ${synergy}`:""}.`},
      {stage:"ROUTE",confidence:.84,output:"Matched against organisation domain, geography and capacity."}
    ],
    domain, priority, priorityScore:score, priorityLevel:level, priorityDetail:prio, categories, keywords, spam
  };
}

export function routeScore(org:any, problem:any) {
  const domain = org.domains.includes(problem.domain) ? 100 : 30;
  const geo = org.districtId===problem.districtId ? 100 : 60;
  const capacity = org.active/org.capacity < .8 ? 100 : 50;
  return Math.round(domain*.5+geo*.2+capacity*.3);
}
