const byId = id => document.getElementById(id);
const conditions = {
  tattoo: "Tatovering", back: "Rygg", knee: "Kne", shoulder: "Skulder",
  ankle: "Ankel / akilles", foot: "Fot / tær", wrist: "Håndledd", hand: "Hånd / fingre",
  head: "Hode / ansikt", chest: "Bryst / ribbein", abdomen: "Mage", pelvis: "Bekken / halebein",
  neck: "Nakke", elbow: "Albue", forearm: "Underarm", upperArm: "Overarm", arm: "Arm", thigh: "Lår", hip: "Hofte / lyske", lowerLeg: "Legg", other: "Annen skade"
};
const symptomPatterns = {
  tattoo: /\b(?:tattoo\w*|tatover\w*|tattover\w*|tattver\w*)\b/,
  back: /\b(?:back|lower back|lumbar|sciatica|slipped disc|herniated disc|rygg\w*|korsryg\w*|isjias|prolaps)\b/,
  knee: /\b(?:knee\w*|kne(?:et|smerter|skal|skade|plager)?|hopperkne|loperkne|patellar\w*|menis[ck]\w*|korsband\w*|acl)\b/,
  shoulder: /\b(?:shoulder\w*|rotator\s*cuff|skulder\w*)\b/,
  ankle: /\b(?:ankle\w*|achil{1,2}es\w*|ak{1,2}il{1,2}es\w*|ankel\w*|overtrakk\w*)\b/,
  wrist: /\b(?:wrist\w*|carpal tunnel|handledd\w*)\b/,
  elbow: /\b(?:elbow\w*|albu\w*|tennisalbue\w*|golfalbue\w*)\b/,
  neck: /\b(?:neck|nakke\w*)\b/,
  hip: /\b(?:hip\w*|hofte\w*|groin|lyske\w*|setesmerte\w*|glute\w*)\b/,
  lowerLeg: /\b(?:legg\w*|calf|shin\w*|beinhinne\w*)\b/,
  forearm: /\b(?:forearms?|underarm\w*)\b/,
  upperArm: /\b(?:upper arms?|overarm\w*|biceps\w*|triceps\w*)\b/,
  arm: /\b(?:arms?|armen|armsmerter|armskade\w*)\b/,
  thigh: /\b(?:thigh\w*|lar(?:et|ene|smerte\w*|strekk\w*|skade\w*|muskel\w*)?|hamstrin\w*|quadriceps\w*|quads)\b/,
  foot: /\b(?:foot|feet|toe\w*|fot\w*|tarne|ta(?:en|er|smerte\w*|skade\w*)|heel\w*|plantar\s*fasci\w*|plantarfasci\w*|hal(?:en|smerte\w*|spore\w*)?)\b/,
  hand: /\b(?:hands?|handen|hand(?:flate|smerte|skade)\w*|finger\w*|thumb\w*|tommel\w*|knuckle\w*|kno(?:ke\w*|en|er))\b/,
  head: /\b(?:head|hode\w*|skull|kran\w*|face|ansikt\w*|jaw|kjeve\w*|eye|oye\w*|nose|nese\w*)\b/,
  chest: /\b(?:rib\w*|chest|bryst\w*|sternum|pectoral\w*)\b/,
  abdomen: /\b(?:abdom\w*|mage\w*|buk(?:vegg\w*|muskel\w*|smerte\w*)?)\b/,
  pelvis: /\b(?:pelvi\w*|bekken\w*|tailbone|coccyx|halebein\w*|haleben\w*|sacrum|korsbein\w*)\b/
};

const normalize = value => value.toLowerCase().normalize("NFD")
  .replace(/\p{M}/gu, "").replace(/ø/g, "o").replace(/[’']/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

// FHI's 2005 review supplies terminology. The exercise filters are independent.
const conditionsFromReview = [
  {name:"Korsryggsmerter", area:"back", terms:/\b(?:low(?:er)? back pain|lumbago|korsryg\w*|ryggsmerter)\b/},
  {name:"Skiveprolaps", area:"back", pause:true, terms:/\b(?:(?:herniated|slipped|prolapsed|bulging) dis[ck]|dis[ck] herniation|(?:skive)?prolaps\w*)\b/},
  {name:"Nakkesmerter", area:"neck", terms:/\b(?:neck pain|sore neck|stiff neck|nakke\w*|vond nakke|cervicalgia)\b/},
  {name:"Nerverotplager", area:"neck", pause:true, terms:/\b(?:cervical radiculopathy|cervical nerve root|nerverot\w*|rotkompresjon\w*)\b/},
  {name:"Skuldersmerter", area:"shoulder", terms:/\b(?:shoulder pain|sore shoulder|skuldersmerte\w*|vond skulder)\b/},
  {name:"Ankelskade", area:"ankle", terms:/\b(?:ankle (?:injury|sprain)|sprained ankle|ankelskade\w*|overtrakk\w*|forstu\w* ankel)\b/},
  {name:"Tennisalbue", area:"elbow", terms:/\b(?:tennis elbow|tennisalbue\w*|lateral epicondyl\w*|lateral epikondyl\w*)\b/},
  {name:"Seneplager", area:null, terms:/\b(?:tendin\w*|tendonitis|senebetennelse\w*|seneplage\w*)\b/},
  {name:"Myofasciale smerter", area:null, terms:/\b(?:myofascial\w*|trigger ?point\w*|trigger ?punkt\w*|muskelknute\w*)\b/},
  {name:"Hodepine", area:null, pause:true, terms:/\b(?:headache\w*|hodepine\w*|spenningshodepine\w*|stresshodepine\w*|tensjonshodepine\w*|migren\w*)\b/},
  {name:"Kjeveleddsplager", area:null, pause:true, terms:/\b(?:tmj|tmd|temporomandibular\w*|kjeveledd\w*|costen\w*)\b/},
  {name:"Fibromyalgi", area:null, pause:true, terms:/\b(?:fibromyalg\w*)\b/},
  {name:"Hofteprotese", area:null, pause:true, terms:/\b(?:hip replacement|hip surgery|hofteoper\w*|hofteprotes\w*)\b/},
  {name:"Bløtvevsskade", area:null, terms:/\b(?:soft tissue (?:injury|damage)|blotvevsskade\w*|blotdelsskade\w*)\b/},
  {name:"Beinskjørhet", area:null, pause:true, terms:/\b(?:osteoporos\w*|beinskjor\w*|benskjor\w*)\b/},
  {name:"Brudd eller ledd ute av stilling", area:null, pause:true, terms:/\b(?:fractur\w*|fraktur\w*|\w*brudd\w*|broken|dislocat\w*|dislok\w*|luksasj\w*|subluks\w*|sublux\w*|ute av ledd)\b/},
  {name:"Ryggmargs- eller cauda equina-symptomer", area:null, urgent:true, terms:/\b(?:caud[ai] equina|spinal cord (?:injur\w*|compress\w*)|ryggmargsskade\w*|ryggmargskompresj\w*)\b/},
  {name:"Hjerneslag eller karskade", area:null, urgent:true, terms:/\b(?:stroke|hjerneslag\w*|arteriedisseksj\w*|arter\w* dissection|wallenberg\w*|epidural\w* (?:hematom\w*|haematom\w*))\b/},
  {name:"Blodpropp eller blødningsforstyrrelse", area:null, pause:true, terms:/\b(?:venetrombos\w*|trombos\w*|thrombosis|blood clot|blodpropp\w*|blodningsforstyr\w*|bleeding disorder)\b/},
  {name:"Skade i nakkevirvlene", area:null, pause:true, terms:/\b(?:odontoid\w*|atlanto[ -]?axial\w*|vertebraskade\w*|nakkebrudd\w*|cervical spine injury)\b/},
  {name:"Hodepine etter skade", area:null, pause:true, terms:/\b(?:post ?traumatic headache|posttraumatisk hodepine)\b/},
  {name:"Treningsstølhet", area:null, terms:/\b(?:muskelstol\w*|treningsverk|muscle soreness|doms)\b/},
  {name:"Hudskade eller infeksjon", area:null, pause:true, terms:/\b(?:brannsar\w*|burn injury|skin infection|hudinfeksj\w*|open wound|apne? sar|eksem\w*|eczema)\b/}
];

const additionalConditions = [
  {name:"Hjernerystelse eller hodeskade", area:"head", pause:true, terms:/\b(?:concussion\w*|head injur\w*|head trauma|hjerneryst\w*|hodeskade\w*|slag mot hodet|slo hodet)\b/},
  {name:"Ansikts- eller øyeskade", area:"head", pause:true, terms:/\b(?:facial injur\w*|eye injur\w*|ansiktsskade\w*|oyeskade\w*|nesebrudd\w*)\b/},
  {name:"Kragebeinsskade", area:"shoulder", terms:/\b(?:clavicl\w*|collar\s*bone\w*|kragebein\w*|krageben\w*)\b/},
  {name:"Skade i AC-leddet", area:"shoulder", pause:true, terms:/\b(?:ac joint|ac ledd\w*|acromioclavicular\w*)\b/},
  {name:"Rotatorcuffplager", area:"shoulder", terms:/\b(?:rotator\s*cuff\w*|subacromial\w*|subakromial\w*|impingement|impingment|inopingmenet|supraspinatus)\b/},
  {name:"Labrumskade", area:null, pause:true, terms:/\b(?:labrum\w*|labral\w*|slap (?:tear|lesion|skade))\b/},
  {name:"Biceps- eller tricepsplager", area:"upperArm", terms:/\b(?:biceps\w*|triceps\w*)\b/},
  {name:"Karpaltunnelplager", area:"wrist", terms:/\b(?:carpal tunnel|karpaltunnel\w*)\b/},
  {name:"Plager på tommelsiden av håndleddet", area:"wrist", terms:/\b(?:de quervain\w*|quervain\w*)\b/},
  {name:"Tommel- eller fingerskade", area:"hand", pause:true, terms:/\b(?:skier'?s thumb|gamekeeper'?s thumb|skitommel\w*|mallet finger|droppfinger\w*|jersey finger|triggerfinger\w*|trigger finger)\b/},
  {name:"Håndleddsskade som bør vurderes", area:"wrist", pause:true, terms:/\b(?:tfcc|scapholunate\w*|skafoid\w*|scaphoid\w*|batbein\w*|batben\w*)\b/},
  {name:"Ribbeins- eller brystskade", area:"chest", terms:/\b(?:rib\w*|sternum|brystbein\w*|brystben\w*|intercostal\w*|mellomribb\w*)\b/},
  {name:"Bukveggsskade", area:"abdomen", terms:/\b(?:abdominal strain|bukvegg\w*|magemuskel\w*|(?:inguinal )?hernia\w*|(?:lyske|navle)brokk\w*)\b/},
  {name:"Halebeinsplager", area:"pelvis", terms:/\b(?:coccydynia|tailbone\w*|coccyx|halebe[ni]+\w*)\b/},
  {name:"Bekkenleddsplager", area:"pelvis", terms:/\b(?:si joint|sacroiliac\w*|iliosakral\w*|bekkenleddsmerte\w*|bekkenlosning\w*)\b/},
  {name:"Muskelplager i hofte eller lyske", area:"hip", terms:/\b(?:adductor\w*|adduktor\w*|hip flexor\w*|hofteboyer\w*|iliopsoas|lyskestrekk\w*|groin strain|gluteal tendin\w*|trochanter\w*|trokanter\w*|piriformis\w*)\b/},
  {name:"Løperkne", area:"knee", terms:/\b(?:it band|itbs|iliotibial\w*|loperkne\w*|runners knee)\b/},
  {name:"Plager rundt kneskålen", area:"knee", terms:/\b(?:patellofemoral\w*|kneskal\w*|kneecap\w*|chondromalacia\w*|kondromalasi\w*|osgood schlatter)\b/},
  {name:"Meniskskade", area:"knee", pause:true, terms:/\b(?:menis[ck]\w*)\b/},
  {name:"Leddbåndsskade i kneet", area:"knee", pause:true, terms:/\b(?:acl|pcl|mcl|lcl|korsband\w*|cruciate ligament|collateral ligament|sideband\w*)\b/},
  {name:"Beinhinneplager", area:"lowerLeg", terms:/\b(?:shin splints|medial tibial stress syndrome|beinhinnebetennelse\w*)\b/},
  {name:"Stressbrudd eller stressreaksjon i bein", area:null, pause:true, terms:/\b(?:stress fractur\w*|stress reaction|stressreaksjon\w*|stressbrudd\w*|tretthetsbrudd\w*|marsjfraktur\w*)\b/},
  {name:"Høy ankelforstuing", area:"ankle", pause:true, terms:/\b(?:syndesmos\w*|high ankle sprain)\b/},
  {name:"Smerter under hælen", area:"foot", terms:/\b(?:plantar\s*fasci\w*|heel spur\w*|halspore\w*|plantar heel pain)\b/},
  {name:"Plager i forfot eller tær", area:"foot", terms:/\b(?:turf toe|metatarsal\w*|mortons? neurom\w*|hallux\w*|bunion\w*|forfot\w*|storta\w*)\b/},
  {name:"Skade i mellomfoten", area:"foot", pause:true, terms:/\b(?:lisfranc\w*|navicular\w*)\b/},
  {name:"Muskelstrekk", area:null, terms:/\b(?:muscle strain|pulled muscle|muskelstrekk\w*|strekk|forstrek\w*|strekte\w*)\b/},
  {name:"Forstuing", area:null, terms:/\b(?:sprain\w*|forstu\w*|leddband\w*)\b/},
  {name:"Slagskade eller blåmerke", area:null, terms:/\b(?:bruise\w*|contusion\w*|blamerke\w*|kontusjon\w*|larskade\w*|larhone\w*)\b/},
  {name:"Sene- eller muskelruptur", area:null, pause:true, terms:/\b(?:torn|tear\w*|ruptur\w*|avriv\w*|avrev\w*|avslit\w*|revet av|rok(?:et|ket|ne|net)?|snapped)\b/},
  {name:"Slimposeplager", area:null, terms:/\b(?:bursitis|bursitt\w*|slimpose\w*)\b/},
  {name:"Artrose eller leddbetennelse", area:null, pause:true, terms:/\b(?:osteoarthritis|arthritis|artrose\w*|artritt\w*|leddgikt\w*)\b/},
  {name:"Opptrening etter operasjon", area:null, pause:true, terms:/\b(?:post operativ\w*|postop\w*|operasjon\w*|surgery|kirurgi\w*)\b/},
  {name:"Bakside lår / hamstring", area:"thigh", terms:/\b(?:hamstrin\w*|(?:bakside\w*|bak pa) (?:av )?lar\w*|back of (?:the )?thigh)\b/},
  {name:"Forside lår / quadriceps", area:"thigh", terms:/\b(?:quadriceps\w*|quads|(?:forside\w*|foran pa) (?:av )?lar\w*|front of (?:the )?thigh)\b/},
  {name:"Nakkeskade etter ulykke", area:"neck", pause:true, terms:/\b(?:whiplash|nakkesleng|nakkeskade\w*)\b/},
  {name:"Leggplager", area:"lowerLeg", terms:/\b(?:calf|shin\w*|legg\w*|beinhinne\w*)\b/},
  {name:"Hopperkne", area:"knee", terms:/\b(?:jumpers? knee|jumpere knee|hopperkne\w*|patellar tendin\w*|patellartendin\w*)\b/},
  {name:"Akillesplager", area:"ankle", terms:/\b(?:achil{1,2}es\w*|ak{1,2}il{1,2}es\w*)\b/},
  {name:"Isjias", area:"back", terms:/\b(?:sciatic\w*|isjias\w*)\b/},
  {name:"Frossen skulder", area:"shoulder", terms:/\b(?:frozen shoulder|frossen skulder)\b/},
  {name:"Golfalbue", area:"elbow", terms:/\b(?:golfers? elbow|golfalbue\w*|medial epi[ck]ondyl\w*)\b/}
];

const achillesTerm = /\b(?:achil{1,2}es\w*|ak{1,2}il{1,2}es\w*)\b/;
const ruptureTerm = /\b(?:ruptur\w*|rok(?:et|ket|ne|net)?|revnet|avrev\w*|avriv\w*|revet av|torn|tear\w*|snapped)\b/;

function readSymptoms(query) {
  const normalized = normalize(query);
  if (["ingen skade", "ingen plager", "no injury"].includes(normalized)) return {areas:[], names:[], healthy:true};
  if (!normalized) return {areas: query.trim() ? ["other"] : [], names: [], acute:false, urgent:false};
  const matches = [...conditionsFromReview, ...additionalConditions].filter(entry => entry.terms.test(normalized));
  const areas = new Set(matches.map(entry => entry.area).filter(Boolean));
  const tattooLocation = /\b(?:underarm\w*|forearms?|overarm\w*|upper arms?|armen|arms?|skulder\w*|shoulder\w*|hand(?:en)?|handledd\w*|wrist\w*|finger\w*)\b/.test(normalized) ? "arm" :
    /\b(?:lar\w*|thigh\w*|leg|legg\w*|foot|fot\w*|kne\w*|ankel\w*|ankle\w*|toe\w*)\b/.test(normalized) ? "leg" :
    /\b(?:rygg\w*|back|chest|bryst\w*|abdomen|mage\w*)\b/.test(normalized) ? "torso" : "";
  for (const [area, pattern] of Object.entries(symptomPatterns)) {
    if (pattern.test(normalized)) areas.add(area);
  }
  if (areas.has("tattoo") && !/\b(?:pain|ache|strain|injur\w*|sprain|vondt|smerte\w*|strekk|skade\w*|ruptur\w*)\b/.test(normalized)) {
    for (const area of areas) {
      if (area !== "tattoo") areas.delete(area);
    }
  }
  if (areas.has("forearm") || areas.has("upperArm")) areas.delete("arm");
  const achillesRupture = normalized.split(/\b(?:og|and|men|but)\b/).some(part =>
    achillesTerm.test(part) && (ruptureTerm.test(part) || /(?:akill?es|achilles)\w*ruptur\w*/.test(part)));
  const additionalAssessment = matches.some(entry => entry.pause && entry.name !== "Sene- eller muskelruptur");
  const bicepsRupture = normalized.split(/\b(?:og|and|men|but)\b/).some(part =>
    /\bbiceps\w*/.test(part) && (ruptureTerm.test(part) || /\bbiceps\w*ruptur/.test(part)));
  const newNumbness = /\b(?:nummen\w*|numb\w*|dov\w*|sov(?:er|net)?)\b/.test(normalized) &&
    (areas.has("lowerLeg") || areas.has("foot"));
  const acute = achillesRupture || bicepsRupture || additionalAssessment || matches.some(entry => entry.pause) ||
    /\b(?:trauma\w*|accident|ulykke\w*|operat\w*|surgery|kirurgi\w*)\b/.test(normalized) ||
    /\b(?:rok\w*|avrevet|revet av|ruptur\w*|torn|tear|snapped|concussion|hjerneryst\w*)\b/.test(normalized);
  return {
    areas: areas.size ? [...areas] : ["other"],
    names: achillesRupture
      ? ["Mulig akillesruptur", ...matches.map(entry => entry.name).filter(name => !["Akillesplager", "Sene- eller muskelruptur"].includes(name))]
      : bicepsRupture ? ["Mulig bicepsruptur"] : matches.map(entry => entry.name),
    achillesRupture,
    bicepsRupture,
    additionalAssessment,
    tattooLocation,
    acute,
    urgent: newNumbness || matches.some(entry => entry.urgent)
  };
}

// These areas can be found by search but need an individual exercise plan.
const assessmentAreas = new Set(["head", "chest", "abdomen", "pelvis", "other"]);

const restrictions = {
  grip: "Grep", squat: "Knebøy", load: "Belastning på beina", overhead: "Over hodet",
  support: "Støtte på hendene", bend: "Bøy / vridning i rygg", neckTurn: "Bevegelse av nakken"
};
const phases = { early: "Fersk / akutt", recovery: "Opptrening", return: "Tilbake til trening", normal: "Vanlig trening" };

const symptomSearch = byId("symptomSearch");
const guide = new URLSearchParams(location.search).get("guide");
if (guide === "knee") symptomSearch.value = "Hopperkne";
if (guide === "tattoo") symptomSearch.value = "Ny tatovering";

byId("restrictions").innerHTML = Object.entries(restrictions).map(([key, label]) =>
  `<label><input type="checkbox" value="${key}"><span>${label}</span></label>`
).join("");
const selected = id => [...byId(id).querySelectorAll(":checked")].map(input => input.value);

function updateSymptomFields() {
  const symptoms = readSymptoms(symptomSearch.value);
  const phase = byId("phase");
  phase.hidden = Boolean(symptoms.healthy);
  byId("phaseLabel").hidden = phase.hidden;
  phase.required = !phase.hidden;
  if (symptoms.healthy) phase.value = "normal";
  else if (phase.value === "normal") phase.value = "";
  const tattoo = symptoms.areas.includes("tattoo");
  byId("locationField").hidden = !tattoo;
  const clearance = byId("upperBodyClearanceField");
  byId("activityClearanceField").hidden = symptoms.healthy || tattoo || !symptoms.areas.length ||
    symptoms.urgent || (symptoms.acute && !symptoms.bicepsRupture) ||
    symptoms.additionalAssessment || symptoms.areas.some(area => assessmentAreas.has(area)) ||
    !(phase.value === "early" || symptoms.bicepsRupture);
  if (byId("activityClearanceField").hidden) byId("activityClearance").checked = false;
  byId("returnClearanceField").hidden = phase.value !== "return" || symptoms.healthy || symptoms.acute || tattoo;
  if (byId("returnClearanceField").hidden) byId("returnClearance").checked = false;
  clearance.hidden = !symptoms.achillesRupture || symptoms.additionalAssessment || symptoms.urgent || symptoms.areas.some(area => area !== "ankle") ||
    !["recovery", "return"].includes(phase.value);
  if (clearance.hidden) byId("upperBodyClearance").checked = false;
  byId("tattooReadyField").hidden = !tattoo || byId("phase").value !== "early" || byId("location").value !== "arm";
}
updateSymptomFields();

const filters = {
  back: ["bend", "weighted"], knee: ["load", "leg"], ankle: ["load", "leg"],
  shoulder: ["grip", "overhead", "support", "arm"], wrist: ["grip", "support", "arm"],
  neck: ["arm", "weighted", "bend", "overhead"], elbow: ["arm", "grip", "support"],
  hip: ["load", "leg", "bend"], lowerLeg: ["load", "leg"], thigh: ["load", "leg"],
  forearm: ["arm", "grip", "support"], upperArm: ["arm", "grip", "support", "overhead"],
  arm: ["arm", "grip", "support", "overhead"], foot: ["load", "leg"], hand: ["grip", "support", "handMotion"]
};
const tattooFilters = {
  arm: ["grip", "support", "arm"], leg: ["load", "leg"], torso: ["bend", "torso", "weighted"],
  other: ["arm", "leg", "torso", "load", "weighted", "bend", "grip", "support"]
};

const exercises = [
  {name:"Rolig gange på flatt underlag", tags:["load"], dose:"3–5 min", detail:"Gå i et tempo der du kan snakke uanstrengt."},
  {name:"Rolige skulderbladbevegelser", tags:["arm"], dose:"6–8 repetisjoner", detail:"Sitt eller stå med armene avslappet. Før skulderbladene forsiktig sammen og slipp."},
  {name:"Sett deg og reis deg fra en stol", tags:["load","squat","leg"], dose:"5–8 repetisjoner", detail:"Bruk en stabil stol og hold armene avslappet. Beveg deg rolig."},
  {name:"Stående tåhev", tags:["load","leg"], dose:"6–10 repetisjoner", detail:"Løft hælene rolig med begge føtter på gulvet. Stå nær en vegg om du trenger balanse."},
  {name:"Sittende lett bicepscurl", tags:["grip","arm","weighted"], gear:"free", returnOnly:true, dose:"6–8 repetisjoner", detail:"Hold albuene ved siden av kroppen og velg en lett manual."},
  {name:"Knebøy med lette manualer langs siden", tags:["load","squat","leg","grip","arm","weighted"], gear:"free", returnOnly:true, dose:"5–8 repetisjoner", detail:"Bruk et bevegelsesutslag du allerede tåler og en lett belastning."},
  {name:"Rolig håndåpning", tags:["arm","handMotion"], dose:"6–8 repetisjoner", detail:"Sitt med avslappede skuldre. Åpne og lukk hånden rolig."}
];

const armBend = {name:"Albuebøy uten vekt", tags:["arm"], dose:"2–3 repetisjoner", detail:"Hold overarmen inntil kroppen. Bøy og strekk albuen rolig så langt det kjennes greit."};
const thighSlide = {name:"Hælglidning med støtte", tags:["leg"], dose:"2–3 repetisjoner", detail:"La beinet hvile på underlaget. Trekk hælen rolig inn mot deg og skyv den ut igjen."};
const tattooWorkout = [
  {name:"Rolig knebøy med kroppsvekt", tags:["load","squat","leg"], dose:"1 × 6–8", detail:"Sett deg rolig bakover og ned før du reiser deg. Hold armene avslappet."},
  {name:"Oppsteg på lav kasse", tags:["load","leg"], dose:"1 × 4–6 per side", detail:"Gå opp på et lavt, stødig trinn. Bytt bein og hold jevnt tempo."},
  {name:"Bakoverutfall", tags:["load","leg"], dose:"1 × 4–6 per side", detail:"Ta et kort steg bakover. Senk deg rolig med avslappede armer."},
  {name:"Seteløft", tags:["leg","torso"], dose:"1 × 6–8", detail:"Ligg med bøyde knær og løft hoftene rolig. Hold tatoveringen unna underlaget."},
  {name:"Død bille med bare bein", tags:["leg","torso"], dose:"1 × 4–6 per side", detail:"Ligg på ryggen. Hold armene avslappet unna matta og senk én hæl av gangen."}
];

const crossfitExercises = [
  {name:"Marsj på stedet", tags:["load","leg"], dose:"20 sek", detail:"Løft føttene lett og hold jevnt tempo."},
  {name:"Knebøy til stol", tags:["load","squat","leg"], dose:"5–8 repetisjoner", detail:"Sett deg kontrollert mot en stødig stol, og reis deg rolig."},
  {name:"Armheving mot vegg", tags:["arm","support","load","torso"], dose:"5–8 repetisjoner", detail:"Stå mot en vegg. Bøy albuene og skyv rolig fra."},
  {name:"Sittende utadrotasjon uten vekt", tags:["arm"], dose:"5–8 repetisjoner", detail:"Hold albuene inntil kroppen og før underarmene rolig litt ut."},
  {name:"Sittende skulderpress med manualer", tags:["arm","overhead","grip","weighted"], gear:"free", returnOnly:true, dose:"5–8 repetisjoner", detail:"Bruk lette manualer og et utslag du allerede tåler."},
  {name:"Tå- og hælløft med støtte", tags:["load","leg","support"], dose:"5–8 repetisjoner", detail:"Hold lett i noe stødig. Løft hælene, senk dem og løft deretter tærne."}
];

const fullBodyMobility = [
  {name:"Bryststrekk i døråpning", tags:["arm","support","load","torso"], dose:"20 sek per side", detail:"Hvil underarmen lett mot karmen. Ta et lite steg fram til du kjenner en mild strekk."},
  {name:"Leggstrekk mot vegg", tags:["load","leg","support"], dose:"20 sek per side", detail:"Stå i kort splittstilling og la den bakerste hælen hvile i gulvet."},
  {name:"Sittende strekk av bakside lår", tags:["leg","bend","torso"], dose:"20 sek per side", detail:"Sett én hæl foran deg. Len deg litt fram fra hofta med avslappet rygg."},
  {name:"Sittende setestrekk", tags:["leg","bend","torso"], dose:"20 sek per side", detail:"Legg ankelen over motsatt kne. Len deg litt fram hvis det kjennes greit."},
  {name:"Sittende underarmsstrekk", tags:["arm","grip","handMotion"], dose:"20 sek per side", detail:"Hold armen lavt og før hånden forsiktig bakover med den andre hånden."}
];

const workoutFormats = [
  {name:"Kontrollerte runder", instruction:(minutes, count) =>
    `Gjør øvelse 1 til ${count} i rekkefølge. Hvil 45–60 sekunder mellom rundene. Ta opptil tre runder, innenfor ${minutes} minutter.`,
   amount:item => item.dose},
  {name:"EMOM i rolig tempo", instruction:(minutes, count) =>
    `Start én øvelse på hvert hele minutt. Gå fra øvelse 1 til ${count} og begynn på toppen igjen. Hvil resten av hvert minutt. Avslutt etter ${minutes} minutter.`,
   amount:item => item.dose.includes("sek") ? "20 sek" : "4 rolige repetisjoner" + (item.dose.includes("per side") ? " per side" : "")},
  {name:"Arbeid og pause", instruction:(minutes, count) =>
    `Jobb rolig i 20 sekunder, hvil i 40, og gå videre. Gjenta øvelse 1 til ${count} i opptil ${minutes} minutter.`,
   amount:() => "20 sek rolig arbeid"}
];

function createWorkout(allowed, minutes, index, gentleTattoo, phase) {
  if (["early", "recovery"].includes(phase) && !gentleTattoo) {
    const start = index % allowed.length;
    const ordered = [...allowed.slice(start), ...allowed.slice(0, start)];
    const items = ordered.slice(0, phase === "early" ? 2 : 3);
    return {title:phase === "early" ? "Hold kroppen i gang" : "Tren rundt skaden",
      items, instruction:phase === "early"
        ? "Gjør hver øvelse én gang i rolig tempo. Ta pauser underveis."
        : "Gjør ett kontrollert sett av hver øvelse. Hvil minst ett minutt mellom øvelsene.",
      amount:item => item.dose};
  }
  if (gentleTattoo || allowed.length < 2) {
    return {title:gentleTattoo ? "Rolig aktivitet" : "Én øvelse denne gangen", items:allowed,
      instruction:"Hold et rolig tempo.", amount:item => item.dose};
  }
  const timed = allowed.filter(item => !item.dose.includes("min"));
  if (timed.length < 2) {
    return {title:"Rolig økt", items:allowed, instruction:"Ta én øvelse av gangen med pause imellom.", amount:item => item.dose};
  }
  const start = index % timed.length;
  const items = [...timed.slice(start), ...timed.slice(0, start)].slice(0, minutes === 10 ? 2 : 3);
  const format = workoutFormats[index % workoutFormats.length];
  return {title:format.name, items, instruction:format.instruction(minutes, items.length), amount:format.amount};
}

const rehabExercises = {
  hand: [exercises.find(item => item.tags.includes("handMotion"))],
  forearm: [{name:"Vri håndflaten opp og ned", tags:["arm"], dose:"2–3 hver vei", detail:"Hold albuen bøyd inntil kroppen. Vri underarmen rolig slik at håndflaten vender opp og ned."}],
  upperArm: [armBend],
  arm: [armBend],
  thigh: [thighSlide],
  neck: [
    {name:"Sittende hodevending", tags:["neckTurn"], dose:"2–3 hver vei", detail:"Sitt oppreist og vend hodet rolig litt til hver side."},
    {name:"Små nikk", tags:["neckTurn"], dose:"2–3 repetisjoner", detail:"Sitt oppreist. Nikk lett og gå tilbake til midtstilling."}
  ],
  back: [
    {name:"Bekkenvipp", tags:["bend","leg","torso"], dose:"2–3 repetisjoner", detail:"Ligg med bøyde knær. Vipp bekkenet lett så korsryggen flater ut. Slapp av igjen."}
  ],
  knee: [
    {name:"Sittende knestrekk", tags:["leg"], dose:"2–3 per side", detail:"Sitt stødig. Strekk ett kne rolig så langt det kjennes greit, og senk foten. Bruk kroppsvekt."}
  ],
  ankle: [
    {name:"Sittende ankelbøy", tags:["leg"], dose:"2–3 repetisjoner", detail:"Støtt foten og vipp tærne rolig mot deg og fra deg innenfor et behagelig utslag."}
  ],
  shoulder: [
    {name:"Skulderpendel med støtte", tags:["arm","bend","support","load"], dose:"2–3 små pendelbevegelser", detail:"Støtt deg med den andre hånden mot et stødig underlag. La armen henge og pendle forsiktig."},
    {name:"Sittende skulderbladsklem", tags:["arm"], dose:"2–3 repetisjoner", detail:"La armene henge avslappet. Trekk skulderbladene lett sammen og slipp opp."}
  ],
  elbow: [
    {name:"Albuebøy", tags:["arm"], dose:"2–3 repetisjoner", detail:"Hold overarmen inntil kroppen. Bøy og strekk albuen rolig uten vekt."}
  ],
  wrist: [
    {name:"Håndleddsbøy med støtte", tags:["arm"], dose:"2–3 repetisjoner", detail:"Hvil underarmen på et bord med hånden over kanten. Løft og senk hånden rolig."}
  ],
  hip: [
    {name:"Stående hofteføring bakover", tags:["load","leg","support"], dose:"2–3 per side", detail:"Hold i noe stødig. Før ett bein litt bakover og hold overkroppen oppreist."}
  ],
  lowerLeg: [
    {name:"Sittende ankelbevegelse", tags:["leg"], dose:"2–3 repetisjoner", detail:"Støtt leggen og vipp foten rolig fram og tilbake uten motstand."}
  ]
};

const mobilityByArea = {
  neck: [
    rehabExercises.neck[0],
    {name:"Rolig sidebøy i nakken", tags:["neckTurn"], dose:"2–3 ganger per side",
      detail:"Sitt oppreist. Vipp hodet litt mot én skulder, og gå rolig tilbake til midten. Bruk et utslag du tåler."}
  ],
  back: rehabExercises.back,
  shoulder: rehabExercises.shoulder,
  elbow: rehabExercises.elbow,
  forearm: rehabExercises.forearm,
  upperArm: rehabExercises.upperArm,
  arm: rehabExercises.arm,
  wrist: rehabExercises.wrist,
  hand: rehabExercises.hand,
  hip: rehabExercises.hip,
  thigh: rehabExercises.thigh,
  knee: rehabExercises.knee,
  lowerLeg: rehabExercises.lowerLeg,
  ankle: rehabExercises.ankle,
  foot: [{name:"Rolig bevegelse av tærne", tags:["leg"], dose:"2–3 repetisjoner",
    detail:"Sitt med foten støttet. Bøy og strekk tærne lett innenfor et utslag du tåler."}]
};

const seatedUpperBody = [
  {name:"Sittende skulderbladsklem", tags:["arm"], dose:"5–8 repetisjoner",
    detail:"Sitt med ryggstøtte og det skadde beinet støttet. Trekk skulderbladene lett sammen."},
  {name:"Sittende albuebøy", tags:["arm"], dose:"5–8 repetisjoner",
    detail:"Hold overarmene langs siden. Bøy og strekk albuene uten vekt. La det skadde beinet hvile."},
  {name:"Sittende utadrotasjon", tags:["arm"], dose:"5–8 repetisjoner",
    detail:"Hold albuene bøyd inntil siden. Før underarmene litt ut og inn med avslappede skuldre."},
  {name:"Sittende bicepscurl med lette manualer", tags:["arm","grip","weighted"], gear:"free", dose:"5–8 repetisjoner",
    detail:"Bruk bare manualer du kan få tak i fra stolen. Hold ryggen og det skadde beinet støttet hele tiden."}
];

const achillesHelp = "Følg planen fra behandleren for ortose, belastning og øvelser. Vent med egen tøying av legg og akilles til behandleren har godkjent det.";

const lowerBodyAreas = new Set(["hip", "thigh", "knee", "lowerLeg", "ankle", "foot"]);
const upperLimbAreas = new Set(["arm", "upperArm", "forearm", "hand", "wrist", "elbow", "shoulder"]);
const easyLegMovement = [exercises[0], {...exercises[2], detail:"Bruk en stødig, litt høy stol. Reis deg rolig uten å skyve fra med hendene, hvis du kan gjøre det med god balanse."}];
const legWorkout = [...tattooWorkout.slice(0, 3), ...easyLegMovement];

const returnMovements = {
  knee: exercises[2],
  hip: exercises[2],
  ankle: exercises[3],
  lowerLeg: exercises[3],
  foot: exercises[3]
};

function plan({areas, names = [], healthy, acute, achillesRupture, additionalAssessment, bicepsRupture, upperBodyClearance, activityClearance, returnClearance, blocked, phase, location, gear, alert, hold, tattooReady}) {
  const injury = areas.some(area => area !== "tattoo");
  if (alert) return {message:"Sett treningen på pause", detail:"Kontakt legevakt på 116 117 hvis det haster. Ved akutt alvorlige symptomer, ring 113."};
  if (hold) return {message:"Vent med å lage økt", detail:"Følg restriksjonene du har fått fra behandler eller tatovør."};
  if (achillesRupture && !additionalAssessment) {
    if (!upperBodyClearance || areas.some(area => area !== "ankle") || !["recovery", "return"].includes(phase)) {
      return {message:"Avklar belastning ved mulig akillesruptur",
        detail:"Få rask medisinsk vurdering hvis skaden er fersk og ikke er undersøkt. Etter vurdering kan du velge opptrening og bekrefte at du har fått klarsignal til sittende overkroppstrening."};
    }
    const allowed = seatedUpperBody.filter(item =>
      (!item.gear || item.gear === gear) && !item.tags.some(tag => blocked.includes(tag)));
    return {allowed, rehab:[], mobility:[], achillesHelp};
  }
  if (bicepsRupture && !additionalAssessment && activityClearance && areas.every(area => upperLimbAreas.has(area))) {
    const pool = phase === "early" ? easyLegMovement : legWorkout;
    const allowed = pool.filter(item => !item.tags.some(tag => blocked.includes(tag)));
    return {allowed, rehab:[], mobility:[], advice:"Følg planen for den skadde armen. Velg beinøvelser du kan gjøre uten grep, armstøtte eller utstyr du må bære."};
  }
  if (acute) return {
    message: "Følg rådene fra behandleren før trening",
    detail: "Få rask medisinsk vurdering ved mistanke om fersk ruptur eller brudd. Hvis skaden er vurdert, følg aktivitetsplanen fra behandleren."
  };
  if (!areas.length && !healthy) return {message:"Skriv hva du trenger å skåne", detail:"Skriv en plage, skade eller annen grunn til at du vil tilpasse økta."};
  if (areas.some(area => assessmentAreas.has(area))) return {
    message:"Du trenger råd tilpasset skaden",
    detail:"Spør en behandler hvilke bevegelser og belastninger som passer før du følger et øktforslag."
  };
  if (injury && phase === "early" && !activityClearance) return {message:"Avvent en treningsøkt", detail:"Ved fersk skade må valg av aktivitet ta hensyn til hva som har skjedd og hva du kan belaste. Følg råd fra behandleren."};
  const excluded = new Set([...blocked, ...areas.flatMap(area =>
    area === "tattoo" ? tattooFilters[location] : filters[area])]);
  const gentleTattoo = areas.includes("tattoo") && phase === "early";
  if (gentleTattoo && location !== "arm") return {message:"Vent med en strukturert økt", detail:"Følg etterbehandlingen fra tatovøren. Unngå friksjon og trykk på tatoveringen mens den gror."};
  const tattooSession = areas.includes("tattoo") && location === "arm" && (!gentleTattoo || tattooReady);
  const lowerBodyOnly = areas.length > 0 && areas.every(area => lowerBodyAreas.has(area));
  const upperLimbOnly = areas.length > 0 && areas.every(area => upperLimbAreas.has(area));
  let workout = [...exercises, ...crossfitExercises];
  if (tattooSession) workout = tattooWorkout;
  else if (gentleTattoo) workout = exercises.slice(0, 1);
  else if (lowerBodyOnly) workout = seatedUpperBody;
  else if (upperLimbOnly) workout = legWorkout;
  if (phase === "early" && injury) {
    workout = lowerBodyOnly ? seatedUpperBody.filter(item => !item.gear) : upperLimbOnly ? easyLegMovement : [];
  }
  const allowed = workout.filter(item =>
    (!item.gear || item.gear === gear) &&
    (!item.returnOnly || phase === "return" || healthy) && !item.tags.some(tag => excluded.has(tag)));
  const movementFits = (item, target) => {
    const excludedForArea = [...blocked, ...areas.filter(area => area !== target).flatMap(area =>
      area === "tattoo" ? tattooFilters[location] : filters[area])];
    return !item.tags.some(tag => excludedForArea.includes(tag));
  };
  const rehab = phase === "early" ? [] : areas.flatMap(area => {
    const movements = [...(rehabExercises[area] ?? [])];
    if (area === "thigh" && names.includes("Bakside lår / hamstring")) {
      movements.push({name:"Lett hælpress", tags:["leg"], dose:"2–3 lette hold", detail:"Bøy kneet litt. Press hælen lett ned uten å bevege beinet, og slipp opp."});
    }
    if (area === "thigh" && names.includes("Forside lår / quadriceps")) {
      movements.push({name:"Lett lårspenn", tags:["leg"], dose:"2–3 lette hold", detail:"Støtt beinet. Press knehasen lett ned i et håndkle, og slipp opp."});
    }
    return movements.filter(item => movementFits(item, area));
  });
  const mobility = phase === "early" ? [] : healthy ? fullBodyMobility.filter(item => movementFits(item)) :
    [...new Set(areas.flatMap(area => (mobilityByArea[area] ?? []).filter(item => movementFits(item, area))))];
  const returnToArea = phase === "return" && returnClearance
    ? [...new Set(areas.filter(area => returnMovements[area] && movementFits(returnMovements[area], area)).map(area => returnMovements[area]))]
    : [];
  return {allowed, rehab, mobility, returnToArea, gentleTattoo, tattooSession};
}

const key = "tren-tilpasset-logg-v1";
let history = [];
try {
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  if (Array.isArray(saved)) history = saved;
} catch {}
function saveHistory(next) {
  try { localStorage.setItem(key, JSON.stringify(next)); } catch { return false; }
  history = next;
  return true;
}

let variation = 0;
function renderPlan() {
  const {areas, names, healthy, acute, urgent, achillesRupture, additionalAssessment, bicepsRupture} = readSymptoms(symptomSearch.value);
  const phase = byId("phase").value;
  const minutes = Number(byId("length").value);
  const result = byId("result");
  const selection = plan({areas, names, healthy, acute, achillesRupture, additionalAssessment, bicepsRupture, activityClearance:byId("activityClearance").checked,
    returnClearance:byId("returnClearance").checked, upperBodyClearance:byId("upperBodyClearance").checked, phase, tattooReady:byId("tattooReady").checked, blocked:selected("restrictions"), location:byId("location").value,
    gear:byId("gear").value, alert:urgent || byId("alert").checked, hold:byId("hold").checked});
  const labels = [...new Set([...names, ...areas.filter(area => area !== "other").map(area => conditions[area])])];
  const matched = labels.length ? `<p class="meta">Gjenkjent: ${labels.join(" · ")}</p>` :
    healthy ? "" : '<p class="meta">Fant ingen kjent plage</p>';
  if (selection.message) {
    result.innerHTML = `${matched}<h2>${selection.message}</h2><p class="note warn">${selection.detail}</p>`;
    return;
  }
  const focus = byId("focus").value;
  const workout = focus === "mobility" || !selection.allowed.length ? null :
    createWorkout(selection.allowed, minutes, variation, selection.gentleTattoo && !selection.tattooSession, phase);
  const rehab = focus === "mobility" ? [] : selection.rehab;
  const mobility = focus === "workout" ? [] : selection.mobility.filter(item => !rehab.includes(item));
  const adviceText = selection.achillesHelp || selection.advice;
  const advice = adviceText ? `<p class="note">${adviceText}</p>` : "";
  const returnToArea = focus === "mobility" ? [] : selection.returnToArea ?? [];
  if (!workout && !mobility.length && !rehab.length && !returnToArea.length) {
    result.innerHTML = `${matched}<h2>Ingen øvelser passer</h2>${advice || '<p class="note">Den valgte økttypen har ingen øvelser som passer med fasen og bevegelsene du trenger å skåne.</p>'}`;
    return;
  }
  void fetch("/usage", {method:"POST", credentials:"omit", keepalive:true}).catch(() => {});
  const areasToTrain = areas.filter(area => mobilityByArea[area]).map(area => conditions[area].toLowerCase());
  const mobilityTitle = areasToTrain.length ? `Bevegelighet for ${areasToTrain.join(" og ")}` : "Tøyeprogram";
  const title = selection.achillesHelp && workout ? "Sittende overkroppsøkt" : workout?.title ?? (mobility.length ? mobilityTitle : "Opptrening");
  const exerciseRow = (item, amount) =>
    `<div class="exercise"><strong>${item.name}</strong><span class="dose">${amount}</span><small>${item.detail}</small></div>`;
  const rehabSection = rehab.length ? `<section class="plan-section"><h3>Opptrening</h3>
    <p class="subtle">Gjør bevegelsene rolig hvis de passer med opplegget fra behandleren.</p>
    ${rehab.map(item => exerciseRow(item, item.dose)).join("")}</section>` : "";
  const workoutSection = workout ? `<section class="plan-section"><h3>${selection.achillesHelp ? "Økt uten belastning på den skadde foten" : "Tilpasset treningsøkt"}</h3><p class="subtle">${selection.achillesHelp ? workout.title + ". " : ""}${workout.instruction}</p>
    ${workout.items.map(item => exerciseRow(item, workout.amount(item))).join("")}
    ${workout.items.length > 1 ? '<button class="remove" id="nextWorkout" type="button">Vis en annen treningsøkt</button>' : ""}</section>` : "";
  const mobilitySection = mobility.length ? `<section class="plan-section">${title === mobilityTitle ? "" : `<h3>${mobilityTitle}</h3>`}
    <p class="subtle">Ta øvelsene i rekkefølge. Bruk rolige bevegelser og hold bare stillingen der øvelsen angir en holdetid.</p>
    ${mobility.map(item => exerciseRow(item, item.dose)).join("")}</section>` :
    focus === "both" && !rehab.length && !advice ? '<p class="subtle">Ingen tøyeøvelser passer med valgene dine.</p>' : "";
  const returnSection = returnToArea.length ? `<section class="plan-section"><h3>Prøv belastning på området igjen</h3>
    <p class="subtle">Gjør dette separat fra treningsøkta. Bruk et utslag du allerede tåler.</p>
    ${returnToArea.map(item => exerciseRow(item, "1 × 3 rolige repetisjoner")).join("")}</section>` : "";
  const tattooNote = areas.includes("tattoo") ? " Unngå trykk og gnissing på tatoveringen, og følg rådene fra tatovøren." : "";
  result.innerHTML = `${matched}<p class="meta">${phases[phase]}</p>
    <h2>${title}</h2><p class="note">${selection.gentleTattoo && !selection.tattooSession ?
      "Hvis etterbehandlingen tillater det, kan du ta en kort, rolig gåtur." :
      "Start lett. Stopp hvis plagene øker underveis, og sjekk hvordan kroppen reagerer samme dag og neste dag."}${tattooNote}</p>
    ${advice}${rehabSection}${workoutSection}${returnSection}${mobilitySection}
    <label class="check">Hvordan gikk økten?<select id="feedback"><option value="">Velg respons</option><option value="Gikk fint">Gikk fint</option><option value="Ubehag">Ubehag</option><option value="Stoppet økten">Stoppet økten</option></select></label>
    <button class="primary" id="save" type="button">Lagre i loggen</button><p id="saveStatus" role="status"></p>`;
  const nextWorkout = byId("nextWorkout");
  if (nextWorkout) nextWorkout.onclick = () => {
    variation += 1;
    renderPlan();
    byId("nextWorkout")?.focus();
  };
  byId("save").onclick = () => {
    const feedback = byId("feedback").value;
    if (!feedback) { byId("feedback").focus(); return; }
    const ok = saveHistory([{title, areas:areas.map(area => conditions[area]).join(" · "), phase:phases[phase],
      feedback, date:new Date().toISOString(), exercises:[...rehab, ...(workout?.items ?? []), ...returnToArea, ...mobility].map(item => item.name)}, ...history]);
    byId("saveStatus").textContent = ok ? "Økten er lagret." : "Kunne ikke lagre økten på denne enheten.";
    if (ok) byId("save").disabled = true;
  };
}

function showLog() {
  const list = byId("entries");
  list.replaceChildren();
  if (!history.length) list.textContent = "Ingen registrerte økter ennå.";
  history.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "entry";
    const heading = document.createElement("strong");
    heading.textContent = entry.title;
    const detail = document.createElement("p");
    detail.className = "subtle";
    detail.textContent = [new Date(entry.date).toLocaleDateString(document.documentElement.lang), entry.areas, entry.phase, entry.feedback].filter(Boolean).join(" · ");
    const exerciseList = document.createElement("p");
    exerciseList.textContent = (entry.exercises || []).join(", ");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "remove";
    button.textContent = "Slett økt";
    button.onclick = () => {
      if (saveHistory(history.filter((_, i) => i !== index))) showLog();
      else button.textContent = "Kunne ikke slette";
    };
    row.append(heading, detail, exerciseList, button);
    list.append(row);
  });
}

function showView(log) {
  byId("planView").hidden = log;
  byId("logView").hidden = !log;
  byId("planTab").setAttribute("aria-current", String(!log));
  byId("logTab").setAttribute("aria-current", String(log));
  if (log) showLog();
}
byId("planTab").onclick = () => showView(false);
byId("logTab").onclick = () => showView(true);
const resultPanel = byId("result");
byId("planner").addEventListener("submit", event => {
  event.preventDefault();
  renderPlan();
  resultPanel.hidden = false;
  resultPanel.focus();
});

function resetResult() {
  updateSymptomFields();
  variation = 0;
  resultPanel.hidden = true;
  resultPanel.replaceChildren();
}
byId("planner").addEventListener("change", resetResult);
symptomSearch.addEventListener("input", () => {
  const {tattooLocation} = readSymptoms(symptomSearch.value);
  if (tattooLocation) byId("location").value = tattooLocation;
  byId("tattooReady").checked = false;
  byId("upperBodyClearance").checked = false;
  byId("activityClearance").checked = false;
  byId("returnClearance").checked = false;
  resetResult();
});
