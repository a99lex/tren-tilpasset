const englishCopy = {
  "Tatovering": "Tattoo",
  "Rygg": "Back",
  "Kne": "Knee",
  "Skulder": "Shoulder",
  "Ankel / fot": "Ankle / foot",
  "Håndledd": "Wrist",
  "Annen skade": "Other injury",
  "Grep": "Gripping",
  "Knebøy": "Squats",
  "Belastning på beina": "Weight on the legs",
  "Over hodet": "Overhead movements",
  "Støtte på hendene": "Weight on the hands",
  "Bøy / vridning i rygg": "Bending / twisting the back",
  "Fersk / akutt": "Recent / acute",
  "Opptrening": "Rehabilitation",
  "Tilbake til trening": "Return to training",
  "Rolig gange på flatt underlag": "Easy walk on level ground",
  "Gå i et tempo der du kan snakke uanstrengt.": "Walk at a pace where you can comfortably hold a conversation.",
  "Rolige skulderbladbevegelser": "Gentle shoulder blade squeezes",
  "Sitt eller stå med armene avslappet. Før skulderbladene forsiktig sammen og slipp.": "Sit or stand with your arms relaxed. Gently bring your shoulder blades together and release.",
  "Sett deg og reis deg fra en stol": "Sit-to-stand",
  "Bruk en stabil stol og hold armene avslappet. Beveg deg rolig.": "Use a stable chair, relax your arms and move slowly.",
  "Stående tåhev": "Standing calf raises",
  "Løft hælene rolig med begge føtter på gulvet. Stå nær en vegg om du trenger balanse.": "Slowly raise your heels with both feet on the floor. Stand near a wall if you need balance.",
  "Sittende lett bicepscurl": "Seated light biceps curl",
  "Hold albuene ved siden av kroppen og velg en lett manual.": "Keep your elbows by your sides and use a light dumbbell.",
  "Knebøy med lette manualer langs siden": "Squat with light dumbbells at your sides",
  "Bruk et bevegelsesutslag du allerede tåler og en lett belastning.": "Use a light load and a range of motion you already tolerate.",
  "Rolig håndåpning": "Gentle hand opening",
  "Sitt med avslappede skuldre. Åpne og lukk hånden rolig.": "Sit with your shoulders relaxed. Slowly open and close your hand.",
  "Sett treningen på pause": "Pause your workout",
  "Kontakt legevakt på 116 117 hvis det haster. Ved akutt alvorlige symptomer, ring 113.": "Seek urgent medical care. For severe or rapidly worsening symptoms, call your local emergency number.",
  "Vent med å lage økt": "Wait before planning a workout",
  "Følg restriksjonene du har fått fra behandler eller tatovør.": "Follow the restrictions from your clinician or tattoo artist.",
  "Bruk opplegget fra behandleren": "Follow your clinician’s plan",
  "En annen skade trenger konkrete rammer for hva som kan belastes. Legg inn en støttet kategori hvis den beskriver skaden din.": "This description needs more specific guidance on which movements and loads are appropriate. Follow your clinician’s exercise plan.",
  "Avvent en treningsøkt": "Hold off on a workout",
  "Ved fersk skade må valg av aktivitet ta hensyn til hva som har skjedd og hva du kan belaste. Følg råd fra behandleren.": "After a recent injury, follow your clinician’s advice on activity and how much weight you can put on the injured area.",
  "Vent med en strukturert økt": "Hold off on a structured workout",
  "Følg etterbehandlingen fra tatovøren. Unngå friksjon og trykk på tatoveringen mens den gror.": "Follow your tattoo artist’s aftercare advice. Avoid friction and pressure on the tattoo while it heals.",
  "Ingen øvelser i dette utvalget": "No matching exercises",
  "Øvelsene i appen passer ikke med kombinasjonen du valgte.": "The exercise library has no matches for the combination you selected.",
  "2 sett": "2 sets",
  "1 sett": "1 set",
  "Rolig aktivitet": "Gentle activity",
  "Lett treningsøkt": "Light workout",
  "Rolig økt": "Easy workout",
  "Generell økt": "General workout",
  " Unngå trykk og gnissing på tatoveringen, og følg rådene fra tatovøren.": " Avoid pressure and rubbing on your tattoo and follow your tattoo artist’s advice.",
  "Hvis etterbehandlingen tillater det, kan du ta en kort, rolig gåtur.": "If your aftercare instructions allow it, you can take a short, easy walk.",
  "Start lett. Stopp hvis symptomene øker under økten, og sjekk hvordan kroppen reagerer etterpå og neste dag.": "Start gently. Stop if symptoms increase during exercise and check how you feel afterwards and the next day.",
  "Hvordan gikk økten?": "How did the workout go?",
  "Velg respons": "Choose a response",
  "Gikk fint": "Went well",
  "Ubehag": "Discomfort",
  "Stoppet økten": "Stopped the workout",
  "Lagre i loggen": "Save to log",
  "Økten er lagret.": "Workout saved.",
  "Kunne ikke lagre økten på denne enheten.": "Could not save the workout on this device.",
  "Ingen registrerte økter ennå.": "No workouts logged yet.",
  "Slett økt": "Delete workout",
  "Kunne ikke slette": "Could not delete",
  "Øktforslag": "Suggested workout",
  "Trykk «Lag økt» for å bruke de nye valgene.": "Select “Build workout” to apply your changes.",
  "Velg det som passer situasjonen din, og trykk «Lag økt».": "Choose what fits your situation and select “Build workout”."
};
const t = value => englishCopy[value] ?? value;
const byId = id => document.getElementById(id);
const conditions = {
  tattoo: "Tatovering", back: "Rygg", knee: "Kne", shoulder: "Skulder",
  ankle: "Ankel / fot", wrist: "Håndledd", other: "Annen skade"
};
const symptomPatterns = {
  tattoo: /\b(?:tattoo\w*|tatover\w*|tattover\w*|tattver\w*)\b/,
  back: /\b(?:back|lower back|lumbar|sciatica|slipped disc|herniated disc|rygg\w*|korsryg\w*|isjias|prolaps)\b/,
  knee: /\b(?:knee\w*|kne(?:et|smerter|skal|skade|plager)?|hopperkne|loperkne|patellar\w*|menis[ck]\w*|korsband\w*|acl)\b/,
  shoulder: /\b(?:shoulder\w*|rotator\s*cuff|skulder\w*)\b/,
  ankle: /\b(?:ankle\w*|foot|feet|toe\w*|achil{1,2}es\w*|ak{1,2}il{1,2}es\w*|ankel\w*|fot\w*|overtrakk\w*|heel\w*|plantar\s*fasci\w*|plantarfasci\w*|hal\w*)\b/,
  wrist: /\b(?:wrist\w*|hand|finger\w*|thumb\w*|carpal tunnel|handledd\w*|tommel\w*)\b/,
  other: /\b(?:elbow\w*|albue\w*|neck|nakke\w*|hip|hofte\w*|groin|lyske\w*|hamstring\w*|laret|larsmerter|legg\w*|calf|shin\w*|rib\w*|chest|bryst\w*|concussion|hjerneryst\w*)\b/
};

const normalize = value => value.toLowerCase().normalize("NFD")
  .replace(/\p{M}/gu, "").replace(/ø/g, "o").replace(/[’']/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

function readSymptoms(query) {
  const normalized = normalize(query);
  if (!normalized) return {areas: query.trim() ? ["other"] : [], acute: false};
  const areas = Object.entries(symptomPatterns).filter(([, pattern]) => pattern.test(normalized)).map(([area]) => area);
  const acute = /\b(?:rok\w*|avrevet|ruptur\w*|torn|tear|snapped|fractur\w*|broken|brudd\w*|dislocat\w*|luksasj\w*|concussion|hjerneryst\w*)\b/.test(normalized);
  return {areas: areas.length ? areas : ["other"], acute};
}

const restrictions = {
  grip: "Grep", squat: "Knebøy", load: "Belastning på beina", overhead: "Over hodet",
  support: "Støtte på hendene", bend: "Bøy / vridning i rygg"
};
const phases = { early: "Fersk / akutt", recovery: "Opptrening", return: "Tilbake til trening" };

const symptomSearch = byId("symptomSearch");
const guide = new URLSearchParams(location.search).get("guide");
if (guide === "knee") symptomSearch.value = "Jumper’s knee";
if (guide === "tattoo") symptomSearch.value = "New tattoo";

byId("restrictions").innerHTML = Object.entries(restrictions).map(([key, label]) =>
  `<label><input type="checkbox" value="${key}"><span>${t(label)}</span></label>`
).join("");
const selected = id => [...byId(id).querySelectorAll(":checked")].map(input => input.value);

function updateSymptomFields() {
  byId("locationField").hidden = !readSymptoms(symptomSearch.value).areas.includes("tattoo");
}
updateSymptomFields();

const filters = {
  back: ["bend", "weighted"], knee: ["load"], ankle: ["load"],
  shoulder: ["grip", "overhead", "support", "arm"], wrist: ["grip", "support", "arm"]
};
const tattooFilters = {
  arm: ["grip", "support", "arm"], leg: ["load", "leg"], torso: ["bend", "torso", "weighted"],
  other: ["arm", "leg", "torso", "load", "weighted", "bend", "grip", "support"]
};

const exercises = [
  {name:"Rolig gange på flatt underlag", tags:["load"], dose:"3–5 min", detail:"Gå i et tempo der du kan snakke uanstrengt."},
  {name:"Rolige skulderbladbevegelser", tags:["arm"], dose:"6–8 reps", detail:"Sitt eller stå med armene avslappet. Før skulderbladene forsiktig sammen og slipp."},
  {name:"Sett deg og reis deg fra en stol", tags:["load","squat","leg"], dose:"5–8 reps", detail:"Bruk en stabil stol og hold armene avslappet. Beveg deg rolig."},
  {name:"Stående tåhev", tags:["load","leg"], dose:"6–10 reps", detail:"Løft hælene rolig med begge føtter på gulvet. Stå nær en vegg om du trenger balanse."},
  {name:"Sittende lett bicepscurl", tags:["grip","arm","weighted"], gear:"free", dose:"6–8 reps", detail:"Hold albuene ved siden av kroppen og velg en lett manual."},
  {name:"Knebøy med lette manualer langs siden", tags:["load","squat","leg","grip","arm","weighted"], gear:"free", returnOnly:true, dose:"5–8 reps", detail:"Bruk et bevegelsesutslag du allerede tåler og en lett belastning."},
  {name:"Rolig håndåpning", tags:["arm"], dose:"6–8 reps", detail:"Sitt med avslappede skuldre. Åpne og lukk hånden rolig."}
];

function plan({areas, acute, blocked, phase, location, gear, alert, hold}) {
  const injury = areas.some(area => area !== "tattoo");
  if (alert) return {message:"Sett treningen på pause", detail:"Kontakt legevakt på 116 117 hvis det haster. Ved akutt alvorlige symptomer, ring 113."};
  if (acute) return {
    message: "Check with a clinician before training",
    detail: "If this is a recent suspected rupture, fracture or other serious injury, seek prompt medical assessment. If it has already been assessed, follow your clinician’s return-to-training plan."
  };
  if (!areas.length) return {message:"Describe what you need to protect", detail:"Enter a symptom, injury or other reason to adapt your workout."};
  if (hold) return {message:"Vent med å lage økt", detail:"Følg restriksjonene du har fått fra behandler eller tatovør."};
  if (areas.includes("other")) return {message:"Bruk opplegget fra behandleren", detail:"En annen skade trenger konkrete rammer for hva som kan belastes. Legg inn en støttet kategori hvis den beskriver skaden din."};
  if (injury && phase === "early") return {message:"Avvent en treningsøkt", detail:"Ved fersk skade må valg av aktivitet ta hensyn til hva som har skjedd og hva du kan belaste. Følg råd fra behandleren."};
  const excluded = new Set([...blocked, ...areas.flatMap(area =>
    area === "tattoo" ? tattooFilters[location] : filters[area])]);
  const gentleTattoo = areas.includes("tattoo") && phase === "early";
  if (gentleTattoo && location !== "arm") return {message:"Vent med en strukturert økt", detail:"Følg etterbehandlingen fra tatovøren. Unngå friksjon og trykk på tatoveringen mens den gror."};
  const allowed = exercises.filter((item, index) =>
    (!gentleTattoo || index === 0) && (!item.gear || item.gear === gear) &&
    (!item.returnOnly || phase === "return") && !item.tags.some(tag => excluded.has(tag)));
  return {allowed, gentleTattoo};
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

function renderPlan() {
  const {areas, acute} = readSymptoms(symptomSearch.value);
  const phase = byId("phase").value;
  const minutes = Number(byId("length").value);
  const result = byId("result");
  const selection = plan({areas, acute, phase, blocked:selected("restrictions"), location:byId("location").value,
    gear:byId("gear").value, alert:byId("alert").checked, hold:byId("hold").checked});
  if (selection.message) {
    result.innerHTML = `<h2>${t(selection.message)}</h2><p class="note warn">${t(selection.detail)}</p>`;
    return;
  }
  if (!selection.allowed.length) {
    result.innerHTML = `<h2>${t("Ingen øvelser i dette utvalget")}</h2><p class="note">${t("Øvelsene i appen passer ikke med kombinasjonen du valgte.")}</p>`;
    return;
  }
  void fetch("/usage", {method:"POST", credentials:"omit", keepalive:true}).catch(() => {});
  const dose = phase === "return" && minutes >= 15 ? "2 sett" : "1 sett";
  const title = selection.gentleTattoo ? "Rolig aktivitet" : phase === "return" ? "Lett treningsøkt" : "Rolig økt";
  const chosen = selection.allowed.slice(0, minutes === 10 ? 3 : minutes === 15 ? 5 : 7);
  const tattooNote = areas.includes("tattoo") ? " Unngå trykk og gnissing på tatoveringen, og følg rådene fra tatovøren." : "";
  result.innerHTML = `<p class="meta">${areas.map(area => t(conditions[area])).join(" · ") || t("Generell økt")} · ${t(phases[phase])}</p>
    <h2>${t(title)}</h2><p class="note">${t(selection.gentleTattoo ? "Hvis etterbehandlingen tillater det, kan du ta en kort, rolig gåtur." : "Start lett. Stopp hvis symptomene øker under økten, og sjekk hvordan kroppen reagerer etterpå og neste dag.")}${t(tattooNote)}</p>
    ${chosen.map(item => `<div class="exercise"><strong>${t(item.name)}</strong><span class="dose">${item.dose.includes("reps") ? t(dose) + " × " : ""}${item.dose}</span><small>${t(item.detail)}</small></div>`).join("")}
    <label class="check">${t("Hvordan gikk økten?")}<select id="feedback"><option value="">${t("Velg respons")}</option><option value="Gikk fint">${t("Gikk fint")}</option><option value="Ubehag">${t("Ubehag")}</option><option value="Stoppet økten">${t("Stoppet økten")}</option></select></label>
    <button class="primary" id="save" type="button">${t("Lagre i loggen")}</button><p id="saveStatus" role="status"></p>`;
  byId("save").onclick = () => {
    const feedback = byId("feedback").value;
    if (!feedback) { byId("feedback").focus(); return; }
    const ok = saveHistory([{title, areas:areas.map(area => conditions[area]).join(" · "), phase:phases[phase],
      feedback, date:new Date().toISOString(), exercises:chosen.map(item => item.name)}, ...history]);
    byId("saveStatus").textContent = ok ? t("Økten er lagret.") : t("Kunne ikke lagre økten på denne enheten.");
    if (ok) byId("save").disabled = true;
  };
}

function showLog() {
  const list = byId("entries");
  list.replaceChildren();
  if (!history.length) list.textContent = t("Ingen registrerte økter ennå.");
  history.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "entry";
    const heading = document.createElement("strong");
    heading.textContent = t(entry.title);
    const detail = document.createElement("p");
    detail.className = "subtle";
    detail.textContent = [new Date(entry.date).toLocaleDateString(document.documentElement.lang), (entry.areas || "").split(" · ").map(t).join(" · "), t(entry.phase), t(entry.feedback)].filter(Boolean).join(" · ");
    const exerciseList = document.createElement("p");
    exerciseList.textContent = (entry.exercises || []).map(t).join(", ");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "remove";
    button.textContent = t("Slett økt");
    button.onclick = () => {
      if (saveHistory(history.filter((_, i) => i !== index))) showLog();
      else button.textContent = t("Kunne ikke slette");
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
byId("planner").addEventListener("submit", event => { event.preventDefault(); renderPlan(); });
function resetResult() {
  updateSymptomFields();
  byId("result").innerHTML = `<h2>${t("Øktforslag")}</h2><p class="empty">${t("Trykk «Lag økt» for å bruke de nye valgene.")}</p>`;
}
byId("planner").addEventListener("change", resetResult);
symptomSearch.addEventListener("input", resetResult);
byId("result").innerHTML = `<h2>${t("Øktforslag")}</h2><p class="empty">${t("Velg det som passer situasjonen din, og trykk «Lag økt».")}</p>`;
