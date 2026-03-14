import { useState, useCallback, useMemo } from "react";

/* ══════════════════════════════════════════════════════════════════════
   AUDIT STANDARDS — Questions per norm
   ══════════════════════════════════════════════════════════════════════ */
const AUDIT_STANDARDS = {
  HACCP: {
    label: "HACCP", color: "#059669", icon: "🛡️",
    desc: "Sécurité alimentaire — Codex Alimentarius, Loi 28-07",
    categories: {
      engagement:{title:"Engagement Direction",icon:"🏛️",qs:["Direction a désigné un responsable qualité ?","Politique sécurité alimentaire documentée ?","Ressources suffisantes allouées ?","Revues de direction planifiées ?","Objectifs communiqués au personnel ?"]},
      equipe:{title:"Équipe HACCP",icon:"👥",qs:["Équipe pluridisciplinaire constituée ?","Formation spécifique reçue ?","Compétences couvrent tous domaines ?","Coordinateur HACCP nommé ?","Rôles et responsabilités définis ?"]},
      produit:{title:"Description Produits",icon:"📦",qs:["Fiche descriptive complète par produit ?","Usage prévu et consommateurs identifiés ?","Conditions stockage/distribution spécifiées ?","DLC/DLUO validée scientifiquement ?","Allergènes déclarés ?"]},
      dangers:{title:"Analyse Dangers",icon:"⚠️",qs:["Dangers bio/chimiques/physiques identifiés ?","Gravité et probabilité évaluées ?","Mesures préventives définies ?","Analyse revue lors de changements ?","Allergènes spécifiquement traités ?"]},
      ccp:{title:"Points Critiques CCP",icon:"🎯",qs:["CCP par arbre de décision ?","Limites critiques mesurables ?","Surveillance en place ?","Actions correctives prédéfinies ?","Enregistrements CCP conservés ?"]},
      prp:{title:"Programmes Préalables",icon:"🧹",qs:["Plan nettoyage/désinfection vérifié ?","Lutte nuisibles en place ?","Eau potable contrôlée ?","Installations sanitaires suffisantes ?","Marche en avant respectée ?","Surfaces contact alimentaire conformes ?"]},
      hygiene:{title:"Hygiène Personnel",icon:"🧤",qs:["Règles hygiène affichées/appliquées ?","Visites médicales réalisées ?","Formation hygiène en place ?","Tenues fournies et adaptées ?"]},
      tracabilite:{title:"Traçabilité",icon:"🔗",qs:["Traçabilité amont en place ?","Interne MP-PF assurée ?","Aval assurée ?","Exercices rappel annuels ?","Conforme loi 28-07 ?"]},
      verification:{title:"Vérification",icon:"✅",qs:["Audits internes réalisés ?","Analyses labo réalisées ?","Instruments étalonnés ?","Plan HACCP revalidé si modif ?"]},
      documentation:{title:"Documentation",icon:"📋",qs:["Procédures documentées ?","Enregistrements datés/signés ?","Maîtrise documentaire en place ?","Conforme ONSSA ?"]},
      reglementation:{title:"Conformité Réglementaire",icon:"⚖️",qs:["Agrément ONSSA valide ?","Produits conformes NM ?","Étiquetage loi 28-07 ?","Additifs autorisés ?"]},
    }
  },
  ISO9001: {
    label: "ISO 9001", color: "#2563EB", icon: "📊",
    desc: "Système de management de la qualité",
    categories: {
      contexte:{title:"Contexte de l'organisme",icon:"🏢",qs:["Enjeux internes et externes déterminés ?","Parties intéressées identifiées ?","Domaine d'application défini ?","Processus identifiés et interactions documentées ?"]},
      leadership:{title:"Leadership",icon:"👔",qs:["Politique qualité établie et communiquée ?","Responsabilités et autorités attribuées ?","Engagement de la direction démontré ?","Orientation client intégrée ?"]},
      planification:{title:"Planification",icon:"📐",qs:["Risques et opportunités identifiés ?","Objectifs qualité mesurables définis ?","Planification des modifications maîtrisée ?"]},
      support:{title:"Support",icon:"🔧",qs:["Ressources nécessaires déterminées ?","Compétences du personnel assurées ?","Sensibilisation du personnel effective ?","Communication interne/externe planifiée ?","Informations documentées maîtrisées ?"]},
      realisation:{title:"Réalisation des activités",icon:"⚙️",qs:["Exigences produits/services déterminées ?","Conception et développement planifiés ?","Prestataires externes évalués ?","Production/prestation maîtrisée ?","Libération produits/services vérifiée ?","Non-conformités traitées ?"]},
      evaluation:{title:"Évaluation des performances",icon:"📈",qs:["Satisfaction client surveillée ?","Audits internes planifiés et réalisés ?","Revue de direction réalisée ?","Indicateurs de performance suivis ?"]},
      amelioration:{title:"Amélioration",icon:"🔄",qs:["Non-conformités analysées et corrigées ?","Actions correctives efficaces ?","Amélioration continue démontrée ?"]},
    }
  },
  ISO14001: {
    label: "ISO 14001", color: "#16A34A", icon: "🌿",
    desc: "Système de management environnemental",
    categories: {
      contexte_env:{title:"Contexte environnemental",icon:"🌍",qs:["Enjeux environnementaux identifiés ?","Parties intéressées et attentes déterminées ?","Domaine SME défini ?"]},
      leadership_env:{title:"Leadership environnemental",icon:"👔",qs:["Politique environnementale établie ?","Rôles et responsabilités attribués ?","Engagement direction démontré ?"]},
      planification_env:{title:"Planification",icon:"📐",qs:["Aspects environnementaux significatifs identifiés ?","Obligations de conformité déterminées ?","Risques et opportunités environnementaux traités ?","Objectifs environnementaux définis et planifiés ?"]},
      support_env:{title:"Support",icon:"🔧",qs:["Ressources SME fournies ?","Compétences environnementales assurées ?","Communication environnementale planifiée ?","Informations documentées maîtrisées ?"]},
      realisation_env:{title:"Maîtrise opérationnelle",icon:"⚙️",qs:["Processus à impact environnemental maîtrisés ?","Préparation aux situations d'urgence ?","Cycle de vie pris en compte ?","Critères environnementaux pour achats ?"]},
      evaluation_env:{title:"Évaluation des performances",icon:"📈",qs:["Surveillance et mesure environnementale ?","Évaluation de conformité réalisée ?","Audits internes SME planifiés ?","Revue de direction SME réalisée ?"]},
      amelioration_env:{title:"Amélioration",icon:"🔄",qs:["Non-conformités environnementales traitées ?","Actions correctives environnementales ?","Amélioration continue SME démontrée ?"]},
    }
  },
  ISO27001: {
    label: "ISO 27001", color: "#9333EA", icon: "🔒",
    desc: "Sécurité de l'information",
    categories: {
      contexte_si:{title:"Contexte SMSI",icon:"🏢",qs:["Enjeux sécurité information identifiés ?","Parties intéressées et exigences déterminées ?","Domaine SMSI défini ?"]},
      leadership_si:{title:"Leadership",icon:"👔",qs:["Politique sécurité information établie ?","Rôles SMSI attribués ?","Engagement direction démontré ?"]},
      planification_si:{title:"Planification",icon:"📐",qs:["Appréciation des risques SI réalisée ?","Traitement des risques planifié ?","Déclaration d'applicabilité établie ?","Objectifs sécurité définis ?"]},
      support_si:{title:"Support",icon:"🔧",qs:["Ressources SMSI fournies ?","Compétences SI assurées ?","Sensibilisation sécurité effective ?","Communication SI planifiée ?","Informations documentées maîtrisées ?"]},
      realisation_si:{title:"Fonctionnement",icon:"⚙️",qs:["Appréciation risques exécutée régulièrement ?","Traitement risques mis en œuvre ?","Plan de traitement suivi ?"]},
      evaluation_si:{title:"Évaluation des performances",icon:"📈",qs:["Surveillance et mesure SMSI ?","Audits internes SMSI réalisés ?","Revue de direction SMSI ?","Efficacité des contrôles évaluée ?"]},
      amelioration_si:{title:"Amélioration",icon:"🔄",qs:["Non-conformités SI traitées ?","Actions correctives SI efficaces ?","Amélioration continue SMSI ?"]},
      annexeA:{title:"Annexe A — Contrôles",icon:"🔐",qs:["Contrôle d'accès mis en place ?","Cryptographie appliquée ?","Sécurité physique assurée ?","Sécurité des opérations ?","Sécurité des communications ?","Gestion des incidents SI ?","Continuité d'activité planifiée ?","Conformité légale et réglementaire ?"]},
    }
  }
};

const CHAINS = {
  laitier:{label:"Chaîne Laitière",steps:[{id:"r1",name:"Réception lait cru",icon:"🚛",type:"reception",ccp:false,details:"T° ≤6°C"},{id:"r2",name:"Filtration",icon:"🔬",type:"process",ccp:false,details:"Impuretés"},{id:"r3",name:"Stockage froid",icon:"❄️",type:"stockage",ccp:false,details:"≤4°C"},{id:"r4",name:"Standardisation",icon:"⚙️",type:"process",ccp:false,details:"MG"},{id:"r5",name:"Pasteurisation",icon:"🔥",type:"process",ccp:true,details:"CCP — 72°C/15s"},{id:"r6",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"≤4°C"},{id:"r7",name:"Fermentation",icon:"🧫",type:"process",ccp:false,details:"pH, T°"},{id:"r8",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Aseptique"},{id:"r9",name:"Stockage PF",icon:"🏭",type:"stockage",ccp:false,details:"+2/+6°C"},{id:"r10",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"Réfrigéré"},{id:"r11",name:"Détection métaux",icon:"🔍",type:"controle",ccp:true,details:"CCP"},{id:"r12",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"NM"},{id:"r13",name:"CIP",icon:"🧹",type:"support",ccp:false,details:"NEP"}]},
  viande:{label:"Chaîne Viande",steps:[{id:"v1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Ante-mortem"},{id:"v2",name:"Abattage halal",icon:"🔪",type:"process",ccp:false,details:"Halal"},{id:"v3",name:"Éviscération",icon:"⚙️",type:"process",ccp:true,details:"CCP"},{id:"v4",name:"Inspection",icon:"🔬",type:"controle",ccp:true,details:"CCP — Vétérinaire"},{id:"v5",name:"Refroidissement",icon:"❄️",type:"process",ccp:true,details:"CCP — ≤7°C"},{id:"v6",name:"Découpe",icon:"🥩",type:"process",ccp:false,details:"≤12°C"},{id:"v7",name:"Transformation",icon:"🔥",type:"process",ccp:true,details:"CCP — ≥72°C"},{id:"v8",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Sous vide"},{id:"v9",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},{id:"v10",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"0-4°C"},{id:"v11",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"Frigo"},{id:"v12",name:"Nettoyage",icon:"🧹",type:"support",ccp:false,details:"Validé"}]},
  conserve:{label:"Chaîne Conserves",steps:[{id:"c1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Qualité"},{id:"c2",name:"Lavage",icon:"💧",type:"process",ccp:false,details:"Eau potable"},{id:"c3",name:"Blanchiment",icon:"♨️",type:"process",ccp:false,details:"85-95°C"},{id:"c4",name:"Préparation",icon:"⚙️",type:"process",ccp:false,details:"Recette"},{id:"c5",name:"Remplissage",icon:"🫙",type:"process",ccp:false,details:"Poids"},{id:"c6",name:"Sertissage",icon:"🔧",type:"process",ccp:true,details:"CCP"},{id:"c7",name:"Stérilisation",icon:"🔥",type:"process",ccp:true,details:"CCP — Fo"},{id:"c8",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"≤40°C"},{id:"c9",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"DLUO"},{id:"c10",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Sec"},{id:"c11",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"}]},
  boisson:{label:"Chaîne Boissons",steps:[{id:"b1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Certificats"},{id:"b2",name:"Traitement eau",icon:"💧",type:"process",ccp:true,details:"CCP — NM"},{id:"b3",name:"Préparation",icon:"⚙️",type:"process",ccp:false,details:"Dosage"},{id:"b4",name:"Pasteurisation",icon:"🔥",type:"process",ccp:true,details:"CCP"},{id:"b5",name:"Remplissage",icon:"🍶",type:"process",ccp:false,details:"Aseptique"},{id:"b6",name:"Bouchage",icon:"🔧",type:"process",ccp:true,details:"CCP"},{id:"b7",name:"Inspection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},{id:"b8",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"NM"},{id:"b9",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Abri"},{id:"b10",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"}]},
  cereale:{label:"Chaîne Céréales",steps:[{id:"ce1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Mycotoxines"},{id:"ce2",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Ventilation"},{id:"ce3",name:"Nettoyage",icon:"🔬",type:"process",ccp:false,details:"Aimant"},{id:"ce4",name:"Mouture",icon:"⚙️",type:"process",ccp:false,details:"Granulométrie"},{id:"ce5",name:"Cuisson",icon:"🔥",type:"process",ccp:true,details:"CCP"},{id:"ce6",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"Zone propre"},{id:"ce7",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"MAP"},{id:"ce8",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},{id:"ce9",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"}]},
  huile:{label:"Chaîne Huiles",steps:[{id:"h1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Maturité"},{id:"h2",name:"Lavage",icon:"💧",type:"process",ccp:false,details:"Eau"},{id:"h3",name:"Broyage",icon:"⚙️",type:"process",ccp:false,details:"Inox"},{id:"h4",name:"Malaxage",icon:"🌀",type:"process",ccp:false,details:"≤27°C"},{id:"h5",name:"Extraction",icon:"🫒",type:"process",ccp:false,details:"Presse"},{id:"h6",name:"Contrôle",icon:"🧪",type:"controle",ccp:true,details:"CCP — Acidité"},{id:"h7",name:"Embouteillage",icon:"🍶",type:"process",ccp:false,details:"Verre teinté"},{id:"h8",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Catégorie"},{id:"h9",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Abri"},{id:"h10",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"}]},
  autre:{label:"Chaîne Générique",steps:[{id:"g1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Contrôle"},{id:"g2",name:"Stockage MP",icon:"🏭",type:"stockage",ccp:false,details:"Adapté"},{id:"g3",name:"Transformation",icon:"⚙️",type:"process",ccp:false,details:"Process"},{id:"g4",name:"Traitement thermique",icon:"🔥",type:"process",ccp:true,details:"CCP"},{id:"g5",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"Rapide"},{id:"g6",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Adapté"},{id:"g7",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},{id:"g8",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Conforme"},{id:"g9",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"}]}
};

/* Carbon emission factors (tCO2e) */
const CARBON_CATS = [
  {id:"elec",label:"Électricité",unit:"MWh/an",factor:0.7,icon:"⚡",tip:"Facteur Maroc: 0.7 tCO2/MWh"},
  {id:"gaz",label:"Gaz naturel",unit:"m³/an",factor:0.00202,icon:"🔥",tip:"2.02 kgCO2/m³"},
  {id:"fuel",label:"Fioul / Diesel",unit:"Litres/an",factor:0.00267,icon:"⛽",tip:"2.67 kgCO2/L"},
  {id:"eau",label:"Eau",unit:"m³/an",factor:0.000344,icon:"💧",tip:"0.344 kgCO2/m³"},
  {id:"transport",label:"Transport marchandises",unit:"km/an (total flotte)",factor:0.00021,icon:"🚚",tip:"210 gCO2/km camion moyen"},
  {id:"dechets",label:"Déchets",unit:"Tonnes/an",factor:0.5,icon:"🗑️",tip:"0.5 tCO2/t (enfouissement)"},
  {id:"froid",label:"Fluides frigorigènes",unit:"kg rechargé/an",factor:1.43,icon:"❄️",tip:"R404A: 1430 kgCO2e/kg (facteur moyen)"},
  {id:"deplacements",label:"Déplacements professionnels",unit:"km/an",factor:0.000193,icon:"🚗",tip:"193 gCO2/km voiture"},
];

const SECTEURS = [
  {id:"laitier",label:"Produits laitiers",icon:"🥛"},{id:"viande",label:"Viandes",icon:"🥩"},
  {id:"conserve",label:"Conserves",icon:"🥫"},{id:"boisson",label:"Boissons",icon:"🥤"},
  {id:"cereale",label:"Céréales",icon:"🌾"},{id:"huile",label:"Huiles",icon:"🫒"},
  {id:"autre",label:"Autre",icon:"📦"}
];
const TAILLES = [{id:"tpe",label:"TPE",sub:"< 10"},{id:"pme",label:"PME",sub:"10-250"},{id:"grande",label:"GE",sub:"> 250"}];
const REGIONS = ["Casablanca-Settat","Rabat-Salé-Kénitra","Tanger-Tétouan-Al Hoceima","Fès-Meknès","Marrakech-Safi","Souss-Massa","Oriental","Béni Mellal-Khénifra","Drâa-Tafilalet","Laâyoune-Sakia El Hamra","Guelmim-Oued Noun","Dakhla-Oued Ed Dahab"];
const RO = [{value:0,label:"Non conforme",color:"#DC2626",bg:"#FEE2E2"},{value:1,label:"Partiel",color:"#D97706",bg:"#FEF3C7"},{value:2,label:"Conforme",color:"#059669",bg:"#D1FAE5"},{value:-1,label:"N/A",color:"#6B7280",bg:"#F3F4F6"}];
const TC_MAP = {reception:{bg:"#0F1D32",border:"#3B82F6",text:"#93C5FD"},process:{bg:"#0F2118",border:"#059669",text:"#6EE7B7"},stockage:{bg:"#1A1230",border:"#8B5CF6",text:"#C4B5FD"},controle:{bg:"#261A10",border:"#F59E0B",text:"#FCD34D"},expedition:{bg:"#0F1F2E",border:"#06B6D4",text:"#67E8F9"},support:{bg:"#1E1A10",border:"#A78BFA",text:"#DDD6FE"}};

/* Default users */
const DEFAULT_USERS = [
  {username:"admin",password:"1317",role:"admin",name:"Administrateur"},
  {username:"auditeur1",password:"1317",role:"auditor",name:"Ahmed Benchekroun"},
];

/* ══════════════════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════════════════ */
function genQ(standard) {
  const cats = AUDIT_STANDARDS[standard]?.categories || {};
  const q = {};
  Object.entries(cats).forEach(([k, cat]) => {
    q[k] = { title: cat.title, icon: cat.icon, questions: cat.qs.map((t, i) => ({ id: k + "_" + i, text: t, rating: null, observation: "" })) };
  });
  return q;
}

function doAnalyze(q, chain) {
  const cats = {};
  let tC = 0, tP = 0, tN = 0, tA = 0, tQ = 0;
  Object.entries(q).forEach(([k, cat]) => {
    let c = 0, p = 0, n = 0, a = 0;
    const ncs = [];
    cat.questions.forEach((qq) => {
      if (qq.rating === 2) c++; else if (qq.rating === 1) { p++; ncs.push({ text: qq.text, obs: qq.observation, level: "mineure" }); }
      else if (qq.rating === 0) { n++; ncs.push({ text: qq.text, obs: qq.observation, level: "majeure" }); } else a++;
    });
    const ap = c + p + n;
    const sc = ap > 0 ? Math.round(((c * 2 + p) / (ap * 2)) * 100) : 0;
    cats[k] = { title: cat.title, icon: cat.icon, conf: c, partial: p, nonConf: n, na: a, total: cat.questions.length, score: sc, nonConformities: ncs };
    tC += c; tP += p; tN += n; tA += a; tQ += cat.questions.length;
  });
  const tAp = tC + tP + tN;
  const gs = tAp > 0 ? Math.round(((tC * 2 + tP) / (tAp * 2)) * 100) : 0;
  let cert = "", cc = "";
  if (gs >= 90 && !Object.values(cats).some((c) => c.nonConf > 0)) { cert = "CERTIFICATION RECOMMANDÉE"; cc = "#059669"; }
  else if (gs >= 70) { cert = "CERTIFICATION CONDITIONNELLE — Actions correctives requises"; cc = "#D97706"; }
  else { cert = "CERTIFICATION NON RECOMMANDÉE"; cc = "#DC2626"; }
  let chA = null;
  if (chain) { const ab = chain.filter((s) => s.status === "absent"); chA = { total: chain.length, present: chain.filter((s) => s.status === "present").length, absent: ab.length, ccpMissing: ab.filter((s) => s.ccp), absentSteps: ab }; }
  return { categories: cats, globalScore: gs, totalConf: tC, totalPartial: tP, totalNonConf: tN, totalNA: tA, totalQ: tQ, certification: cert, certColor: cc, chainAnalysis: chA };
}

function Gauge({ score, size }) {
  const sz = size || 130;
  const r = (sz - 16) / 2;
  const ci = 2 * Math.PI * r;
  const of2 = ci - (score / 100) * ci;
  const co = score >= 90 ? "#059669" : score >= 70 ? "#D97706" : "#DC2626";
  return (
    <div style={{ position: "relative", width: sz, height: sz }}>
      <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="#1E293B" strokeWidth="8" />
        <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={co} strokeWidth="8" strokeDasharray={ci} strokeDashoffset={of2} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: sz * 0.28, fontWeight: 800, color: co, fontFamily: "monospace" }}>{score}%</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════════════════ */
export default function App() {
  /* Auth state */
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [loginShake, setLoginShake] = useState(false);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [enabledStandards, setEnabledStandards] = useState(["HACCP", "ISO9001", "ISO14001", "ISO27001"]);

  /* Admin state */
  const [page, setPage] = useState("dashboard"); // "dashboard" | "audit" | "admin" | "carbon"
  const [newUser, setNewUser] = useState({ username: "", password: "", name: "", role: "auditor" });

  /* Audit state */
  const [step, setStep] = useState("company");
  const [auditStandard, setAuditStandard] = useState("");
  const [ci, rawSetCi] = useState({
    nom: "", ville: "", region: "", secteur: "autre", taille: "", effectif: "",
    exporte: false, bio: false, produits_principaux: "",
    adresse: "", ice: "", rc: "", contact_tel: "", contact_email: "",
    date_audit: new Date().toISOString().split("T")[0],
    auditeur: "", responsable_qualite: "",
    perimetre: "Ensemble des lignes de production",
    reference_normes: ""
  });
  const [chain, setChain] = useState(null);
  const [quest, setQuest] = useState(null);
  const [curCat, setCurCat] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [expStep, setExpStep] = useState(null);
  const [cTab, setCTab] = useState(0);
  const [pdfGen, setPdfGen] = useState(false);

  /* Carbon state */
  const [carbonData, setCarbonData] = useState(CARBON_CATS.map((c) => ({ ...c, value: "" })));

  const setCi = useCallback((k, v) => { rawSetCi((p) => ({ ...p, [k]: v })); }, []);
  const catKeys = quest ? Object.keys(quest) : [];
  const canGo = ci.nom && ci.taille && auditStandard;
  const needsChain = auditStandard === "HACCP";

  const prog = useMemo(() => {
    if (!quest) return 0;
    let a = 0, t = 0;
    Object.values(quest).forEach((c) => c.questions.forEach((q) => { t++; if (q.rating !== null) a++; }));
    return t > 0 ? Math.round((a / t) * 100) : 0;
  }, [quest]);
  const catProg = (k) => { if (!quest || !quest[k]) return 0; const c = quest[k]; return Math.round((c.questions.filter((q) => q.rating !== null).length / c.questions.length) * 100); };

  /* Navigation */
  const goTo = (t) => {
    if (t === "chain" && canGo && needsChain) {
      if (!chain || chain._s !== ci.secteur) {
        const ch = (CHAINS[ci.secteur] || CHAINS.autre).steps.map((s) => ({ ...s, status: "present", observation: "" }));
        ch._s = ci.secteur;
        setChain(ch);
      }
    }
    if (t === "audit" && !quest) { setQuest(genQ(auditStandard)); setCurCat(0); }
    if (t === "report" && quest) { setAnalysis(doAnalyze(quest, chain)); }
    setStep(t);
  };

  /* Auth */
  const handleLogin = () => {
    const found = users.find((u) => u.username === loginUser && u.password === loginPwd);
    if (found) {
      setAuthed(true);
      setCurrentUser(found);
      setLoginErr(false);
      rawSetCi((p) => ({ ...p, auditeur: found.name }));
    } else {
      setLoginErr(true);
      setLoginShake(true);
      setTimeout(() => { setLoginShake(false); }, 500);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    setCurrentUser(null);
    setLoginUser("");
    setLoginPwd("");
    setPage("audit");
    setStep("company");
    setQuest(null);
    setAnalysis(null);
    setChain(null);
    setAuditStandard("");
  };

  /* Pre-computed values */
  const chainDef = CHAINS[ci.secteur] || CHAINS.autre;
  const chainPr = chain ? chain.filter((s) => s.status === "present").length : 0;
  const chainAb = chain ? chain.filter((s) => s.status === "absent").length : 0;
  const chainCcT = chain ? chain.filter((s) => s.ccp).length : 0;
  const chainCcP = chain ? chain.filter((s) => s.ccp && s.status === "present").length : 0;
  const curCk = catKeys[curCat] || null;
  const curCatData = quest && curCk ? quest[curCk] : null;
  const stdColor = AUDIT_STANDARDS[auditStandard]?.color || "#059669";

  const rCrit = []; const rMinor = []; const rCd = [];
  if (analysis) {
    Object.values(analysis.categories).forEach((c) => {
      c.nonConformities.forEach((n) => { if (n.level === "majeure") rCrit.push({ category: c.title, ...n }); else rMinor.push({ category: c.title, ...n }); });
      rCd.push({ label: c.title.length > 24 ? c.title.substring(0, 24) + "…" : c.title, icon: c.icon, value: c.score });
    });
  }

  /* Carbon computed */
  const carbonTotal = useMemo(() => {
    return carbonData.reduce((sum, c) => { const v = parseFloat(c.value) || 0; return sum + v * c.factor; }, 0);
  }, [carbonData]);
  const carbonBreakdown = useMemo(() => {
    return carbonData.map((c) => ({ ...c, emission: (parseFloat(c.value) || 0) * c.factor })).filter((c) => c.emission > 0).sort((a, b) => b.emission - a.emission);
  }, [carbonData]);

  /* PDF */
  const genPDF = async () => {
    if (!analysis) return;
    setPdfGen(true);
    try {
      const d = { company: ci, standard: auditStandard, standardLabel: AUDIT_STANDARDS[auditStandard]?.label, processChain: chain || [], chainAnalysis: analysis.chainAnalysis, analysis: { globalScore: analysis.globalScore, totalConf: analysis.totalConf, totalPartial: analysis.totalPartial, totalNonConf: analysis.totalNonConf, totalNA: analysis.totalNA, totalQ: analysis.totalQ, certification: analysis.certification, categories: analysis.categories }, carbon: { total: carbonTotal, breakdown: carbonBreakdown } };
      const prompt = "Genere un rapport HTML complet d'audit " + (AUDIT_STANDARDS[auditStandard]?.label || auditStandard) + " professionnel (A4, @media print, page-break) a partir de: " + JSON.stringify(d) + ". Sections: Couverture, Sommaire, Infos generales, " + (needsChain ? "Chaine production, " : "") + "Synthese, Resultats categorie, Ecarts majeures+mineures, Preconisations P1/P2/P3 + tableau, Empreinte carbone (" + carbonTotal.toFixed(1) + " tCO2e) avec plan reduction, Signatures (auditeur: " + (ci.auditeur || "N/R") + ", resp qualite: " + (ci.responsable_qualite || "N/R") + ", visa direction). Pas d'emoji. HTML seul sans markdown.";
      const r = await fetch("/.netlify/functions/generate-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }) });
      const res = await r.json();
      let h = (res.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
      h = h.replace(/```html/gi, "").replace(/```/gi, "").trim();
      const w = window.open("", "_blank");
      if (w) { w.document.write(h); w.document.close(); setTimeout(() => { w.print(); }, 1500); }
    } catch (e) { alert("Erreur PDF : " + e.message); }
    finally { setPdfGen(false); }
  };

  /* ═══════ STYLES ═══════ */
  const card = { background: "rgba(15,23,42,0.7)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 18, marginBottom: 20, overflow: "hidden" };
  const cIn = { padding: "22px 26px" };
  const cHd = { padding: "16px 26px", borderBottom: "1px solid rgba(59,130,246,0.1)", display: "flex", alignItems: "center", gap: 12 };
  const inp = { width: "100%", padding: "12px 16px", background: "rgba(6,13,27,0.8)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12, color: "#E2E8F0", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const lblS = { display: "block", fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" };
  const bp = { padding: "13px 28px", background: "linear-gradient(135deg,#059669,#34D399)", color: "#0B1121", border: "none", borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" };
  const bsS = { padding: "10px 20px", background: "rgba(59,130,246,0.08)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" };
  const ibx = (bg, co) => ({ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, background: bg, color: co });
  const chp = (on) => ({ padding: "10px 16px", borderRadius: 12, background: on ? "rgba(5,150,105,0.15)" : "rgba(15,23,42,0.5)", border: "1.5px solid " + (on ? "#059669" : "rgba(59,130,246,0.1)"), color: on ? "#34D399" : "#94A3B8", cursor: "pointer", fontSize: 13, fontWeight: on ? 700 : 500, fontFamily: "inherit" });

  const allSteps = needsChain ? ["company", "chain", "audit", "report"] : ["company", "audit", "report"];
  const stepNames = needsChain ? ["Société", "Chaîne", "Audit", "Rapport"] : ["Société", "Audit", "Rapport"];
  const stepIcons = needsChain ? ["🏢", "🔄", "📝", "📊"] : ["🏢", "📝", "📊"];
  const cIdx = allSteps.indexOf(step);

  /* ═══════════════════════════════════════════════════════════════════
     RENDER — LOGIN
     ═══════════════════════════════════════════════════════════════════ */
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#060D1B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
        <style>{`@keyframes shakeX{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{box-shadow:0 0 30px rgba(5,150,105,0.15)}50%{box-shadow:0 0 60px rgba(5,150,105,0.3)}}`}</style>
        <div style={{ width: "100%", maxWidth: 420, padding: "0 20px", animation: "fadeUp 0.6s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#059669,#34D399)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: "#0B1121", marginBottom: 20, animation: "pulse 3s infinite" }}>H</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", margin: "0 0 6px", fontFamily: "'Playfair Display',serif" }}>HACCP Audit Pro</h1>
            <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>Plateforme d'audit multi-référentiel — Maroc</p>
          </div>
          <div style={{ ...card, padding: "36px 32px", animation: loginShake ? "shakeX 0.4s ease" : "none" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9" }}>Connexion</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={lblS}>Identifiant</label>
              <input style={inp} value={loginUser} onChange={(e) => { setLoginUser(e.target.value); setLoginErr(false); }} placeholder="nom d'utilisateur" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={lblS}>Mot de passe</label>
              <input style={{ ...inp, letterSpacing: "0.15em" }} type="password" value={loginPwd} onChange={(e) => { setLoginPwd(e.target.value); setLoginErr(false); }} onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} placeholder="••••" />
            </div>
            {loginErr && (
              <div style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, fontSize: 13, color: "#F87171" }}>Identifiant ou mot de passe incorrect.</div>
            )}
            <button onClick={handleLogin} style={{ ...bp, width: "100%", padding: 14, fontSize: 15 }}>Se connecter</button>
            <div style={{ marginTop: 16, fontSize: 11, color: "#475569", textAlign: "center" }}>Accès : admin / 1317 ou auditeur1 / 1317</div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     RENDER — MAIN APP
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#060D1B", color: "#E2E8F0", fontFamily: "'Outfit',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div style={{ background: "rgba(8,15,35,0.9)", borderBottom: "1px solid rgba(59,130,246,0.15)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("dashboard")}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#059669,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: "#0B1121" }}>H</div>
          <div><div style={{ fontSize: 14, fontWeight: 800, color: "#F1F5F9" }}>Audit Pro</div><div style={{ fontSize: 9, color: "#64748B" }}>Multi-référentiel — Maroc</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Nav tabs */}
          {["dashboard", "audit", currentUser?.role === "admin" ? "admin" : null, "carbon"].filter(Boolean).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: page === p ? "rgba(5,150,105,0.15)" : "transparent", color: page === p ? "#34D399" : "#64748B" }}>
              {p === "dashboard" ? "Accueil" : p === "audit" ? "Audit" : p === "admin" ? "Admin" : "CO₂"}
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: "rgba(59,130,246,0.15)", margin: "0 4px" }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>{currentUser?.name}</span>
          <button onClick={handleLogout} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.06)", color: "#F87171", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Déconnexion</button>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "24px 20px" }}>

        {/* ═══════════════════════════════════════════════════════════════
           PAGE: ADMIN
           ═══════════════════════════════════════════════════════════════ */}
        {page === "admin" && currentUser?.role === "admin" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", margin: "0 0 24px", fontFamily: "'Playfair Display',serif" }}>Administration</h2>

            {/* Standards config */}
            <div style={card}><div style={cHd}><div style={ibx("rgba(139,92,246,0.12)", "#A78BFA")}>⚙️</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Référentiels d'audit activés</div></div>
              <div style={cIn}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                  {Object.entries(AUDIT_STANDARDS).map(([key, std]) => (
                    <label key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, background: enabledStandards.includes(key) ? "rgba(5,150,105,0.1)" : "rgba(15,23,42,0.4)", border: "1.5px solid " + (enabledStandards.includes(key) ? std.color : "rgba(59,130,246,0.1)"), cursor: "pointer" }}>
                      <input type="checkbox" checked={enabledStandards.includes(key)} onChange={(e) => { setEnabledStandards((p) => e.target.checked ? [...p, key] : p.filter((x) => x !== key)); }} style={{ accentColor: std.color, width: 18, height: 18 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: enabledStandards.includes(key) ? "#F1F5F9" : "#64748B" }}>{std.icon} {std.label}</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>{std.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Users list */}
            <div style={card}><div style={cHd}><div style={ibx("rgba(59,130,246,0.12)", "#60A5FA")}>👥</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Auditeurs ({users.length})</div></div>
              <div style={cIn}>
                <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                  {users.map((u, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(6,13,27,0.6)", borderRadius: 12, border: "1px solid rgba(59,130,246,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: u.role === "admin" ? "rgba(147,51,234,0.15)" : "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: u.role === "admin" ? "#A78BFA" : "#60A5FA" }}>{u.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9" }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: "#64748B" }}>@{u.username} — {u.role === "admin" ? "Administrateur" : "Auditeur"}</div>
                        </div>
                      </div>
                      {u.role !== "admin" && (
                        <button onClick={() => { setUsers((p) => p.filter((x, j) => j !== i)); }} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.06)", color: "#F87171", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Supprimer</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add user form */}
                <div style={{ padding: 20, background: "rgba(6,13,27,0.4)", borderRadius: 14, border: "1px solid rgba(59,130,246,0.08)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#93C5FD", marginBottom: 14 }}>Ajouter un auditeur</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={lblS}>Nom complet</label><input style={inp} value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} placeholder="Ahmed El Amrani" /></div>
                    <div><label style={lblS}>Identifiant</label><input style={inp} value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} placeholder="ahmed.amrani" /></div>
                    <div><label style={lblS}>Mot de passe</label><input style={inp} value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} placeholder="Mot de passe" /></div>
                    <div><label style={lblS}>Rôle</label><select style={{ ...inp, appearance: "auto" }} value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}><option value="auditor">Auditeur</option><option value="admin">Administrateur</option></select></div>
                  </div>
                  <button onClick={() => { if (newUser.username && newUser.password && newUser.name) { setUsers((p) => [...p, { ...newUser }]); setNewUser({ username: "", password: "", name: "", role: "auditor" }); } }} style={{ ...bp, marginTop: 14, padding: "10px 24px", fontSize: 13 }}>Ajouter</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
           PAGE: CARBON FOOTPRINT
           ═══════════════════════════════════════════════════════════════ */}
        {page === "carbon" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", margin: "0 0 6px", fontFamily: "'Playfair Display',serif" }}>Empreinte Carbone</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>Estimez les émissions de gaz à effet de serre de l'entreprise et définissez un plan de réduction.</p>

            <div style={card}><div style={cHd}><div style={ibx("rgba(22,163,74,0.12)", "#4ADE80")}>🌍</div><div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Données de consommation</div><div style={{ fontSize: 11, color: "#64748B" }}>Renseignez les consommations annuelles</div></div></div>
              <div style={cIn}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {carbonData.map((c, i) => (
                    <div key={c.id} style={{ padding: 16, background: "rgba(6,13,27,0.6)", borderRadius: 14, border: "1px solid rgba(59,130,246,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{c.icon}</span>
                        <div><div style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9" }}>{c.label}</div><div style={{ fontSize: 10, color: "#64748B" }}>{c.tip}</div></div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input style={{ ...inp, flex: 1 }} type="number" value={c.value} onChange={(e) => { const v = e.target.value; setCarbonData((p) => p.map((x, j) => j === i ? { ...x, value: v } : x)); }} placeholder="0" />
                        <span style={{ fontSize: 11, color: "#64748B", minWidth: 60 }}>{c.unit}</span>
                      </div>
                      {parseFloat(c.value) > 0 && (
                        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: "#34D399" }}>{(parseFloat(c.value) * c.factor).toFixed(2)} tCO2e</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{ ...card, border: "1px solid rgba(22,163,74,0.2)" }}><div style={cHd}><div style={ibx("rgba(22,163,74,0.15)", "#4ADE80")}>📊</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Bilan Carbone Estimé</div></div>
              <div style={cIn}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: carbonTotal > 500 ? "#DC2626" : carbonTotal > 100 ? "#D97706" : "#059669", fontFamily: "monospace" }}>{carbonTotal.toFixed(1)}</div>
                  <div style={{ fontSize: 14, color: "#94A3B8" }}>tonnes CO2 équivalent / an</div>
                </div>
                {carbonBreakdown.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {carbonBreakdown.map((c) => {
                      const pct = carbonTotal > 0 ? (c.emission / carbonTotal) * 100 : 0;
                      return (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ width: 28, textAlign: "center" }}>{c.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                              <span style={{ fontSize: 12, color: "#94A3B8" }}>{c.label}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9", fontFamily: "monospace" }}>{c.emission.toFixed(1)} t ({pct.toFixed(0)}%)</span>
                            </div>
                            <div style={{ height: 6, background: "#1E293B", borderRadius: 3 }}>
                              <div style={{ height: "100%", borderRadius: 3, width: pct + "%", background: "linear-gradient(90deg,#16A34A,#4ADE80)", transition: "width 0.5s" }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Action plan */}
            {carbonTotal > 0 && (
              <div style={card}><div style={cHd}><div style={ibx("rgba(245,158,11,0.12)", "#FBBF24")}>🎯</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Plan d'Action Réduction Carbone</div></div>
                <div style={cIn}>
                  {carbonBreakdown.slice(0, 3).map((c) => {
                    const actions = {
                      elec: ["Installer des panneaux solaires", "Optimiser l'éclairage LED", "Audit énergétique des équipements", "Contrat énergie verte"],
                      gaz: ["Récupération de chaleur sur les process", "Isolation thermique des bâtiments", "Chaudières à condensation"],
                      fuel: ["Transition vers véhicules électriques/GNL", "Optimisation des tournées de livraison", "Biocarburants"],
                      eau: ["Recyclage des eaux de process", "Récupération eaux pluviales", "Détection et réparation fuites"],
                      transport: ["Optimisation logistique (groupage)", "Fournisseurs locaux", "Transport ferroviaire/maritime"],
                      dechets: ["Valorisation des sous-produits", "Compostage des déchets organiques", "Réduction emballages", "Économie circulaire"],
                      froid: ["Maintenance préventive circuits froid", "Transition fluides bas GWP (CO2, NH3)", "Détection fuites automatisée"],
                      deplacements: ["Politique télétravail", "Covoiturage / véhicules partagés", "Visioconférence prioritaire"],
                    };
                    return (
                      <div key={c.id} style={{ padding: 14, background: "rgba(6,13,27,0.4)", borderRadius: 12, border: "1px solid rgba(59,130,246,0.06)", marginBottom: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24", marginBottom: 6 }}>{c.icon} {c.label} — {c.emission.toFixed(1)} tCO2e ({(carbonTotal > 0 ? (c.emission / carbonTotal * 100) : 0).toFixed(0)}%)</div>
                        <div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.8 }}>
                          {(actions[c.id] || ["Optimiser la consommation", "Rechercher des alternatives bas carbone"]).map((a, i) => (
                            <div key={i}>• {a}</div>
                          ))}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: "#059669", fontWeight: 600 }}>Potentiel de réduction estimé : -{(c.emission * 0.25).toFixed(1)} tCO2e/an (-25%)</div>
                      </div>
                    );
                  })}
                  <div style={{ padding: 14, background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.15)", borderRadius: 12, marginTop: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#059669", marginBottom: 4 }}>Objectif global de réduction</div>
                    <div style={{ fontSize: 12, color: "#E2E8F0" }}>En appliquant les mesures prioritaires sur les 3 premiers postes : <b style={{ color: "#34D399" }}>-{(carbonBreakdown.slice(0, 3).reduce((s, c) => s + c.emission * 0.25, 0)).toFixed(1)} tCO2e/an</b> soit une réduction de <b style={{ color: "#34D399" }}>{carbonTotal > 0 ? (carbonBreakdown.slice(0, 3).reduce((s, c) => s + c.emission * 0.25, 0) / carbonTotal * 100).toFixed(0) : 0}%</b></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
           PAGE: DASHBOARD — Sélection du type d'audit
           ═══════════════════════════════════════════════════════════════ */}
        {page === "dashboard" && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9", margin: "0 0 6px", fontFamily: "'Playfair Display',serif" }}>Tableau de bord</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 28 }}>Bienvenue {currentUser?.name}. Sélectionnez le type d'audit à réaliser ou calculez l'empreinte carbone.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
              {enabledStandards.map((std) => {
                const at = AUDIT_STANDARDS[std];
                if (!at) return null;
                return (
                  <div key={std} onClick={() => { setAuditStandard(std); setStep("company"); setCTab(0); setQuest(null); setChain(null); setAnalysis(null); rawSetCi((p) => ({ ...p, auditeur: currentUser?.name || "", reference_normes: at.desc })); setPage("audit"); }} style={{ ...card, cursor: "pointer", border: "1.5px solid " + at.color + "33", transition: "border-color 0.2s" }}>
                    <div style={{ padding: "28px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 42, marginBottom: 12 }}>{at.icon}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: at.color, marginBottom: 6 }}>{at.label}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, marginBottom: 16 }}>{at.desc}</div>
                      <div style={{ padding: "8px 20px", borderRadius: 10, background: at.color + "18", border: "1px solid " + at.color + "44", color: at.color, fontSize: 12, fontWeight: 700, display: "inline-block" }}>Démarrer l'audit</div>
                      {std === "HACCP" && <div style={{ marginTop: 8, fontSize: 10, color: "#64748B" }}>Inclut chaîne de production + CCP</div>}
                    </div>
                  </div>
                );
              })}
              <div onClick={() => setPage("carbon")} style={{ ...card, cursor: "pointer", border: "1.5px solid rgba(22,163,106,0.3)" }}>
                <div style={{ padding: "28px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 42, marginBottom: 12 }}>🌍</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#4ADE80", marginBottom: 6 }}>Empreinte Carbone</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, marginBottom: 16 }}>Calcul et plan de réduction CO₂</div>
                  <div style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(22,163,106,0.12)", border: "1px solid rgba(22,163,106,0.3)", color: "#4ADE80", fontSize: 12, fontWeight: 700, display: "inline-block" }}>Calculer</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
           PAGE: AUDIT
           ═══════════════════════════════════════════════════════════════ */}
        {page === "audit" && (
          <div>
            {/* Stepper */}
            {auditStandard && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: 24, background: "rgba(15,23,42,0.5)", borderRadius: 16, padding: "8px 12px", border: "1px solid rgba(59,130,246,0.08)" }}>
                {stepNames.map((s, i) => {
                  const a = i === cIdx; const d = i < cIdx;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepNames.length - 1 ? 1 : "none" }}>
                      <button onClick={() => { if (d) goTo(allSteps[i]); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, border: "none", cursor: d ? "pointer" : "default", background: a ? "rgba(5,150,105,0.15)" : d ? "rgba(5,150,105,0.06)" : "transparent", fontFamily: "inherit" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: a ? "linear-gradient(135deg," + stdColor + "," + stdColor + "88)" : d ? stdColor : "rgba(30,58,95,0.5)", color: a || d ? "#fff" : "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>{d ? "✓" : stepIcons[i]}</div>
                        <div style={{ fontSize: 12, fontWeight: a ? 700 : d ? 600 : 500, color: a ? stdColor : d ? stdColor : "#475569" }}>{s}</div>
                      </button>
                      {i < stepNames.length - 1 && <div style={{ flex: 1, height: 2, background: d ? stdColor + "66" : "rgba(30,58,95,0.3)", margin: "0 6px", borderRadius: 1 }} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── COMPANY FORM ── */}
            {step === "company" && (
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9", margin: "0 0 20px", fontFamily: "'Playfair Display',serif" }}>Nouvel Audit</h2>

                {/* Standard selection */}
                <div style={card}><div style={cHd}><div style={ibx("rgba(139,92,246,0.12)", "#A78BFA")}>📋</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Type d'audit *</div></div>
                  <div style={cIn}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                      {enabledStandards.map((key) => {
                        const std = AUDIT_STANDARDS[key];
                        if (!std) return null;
                        const on = auditStandard === key;
                        return (
                          <button key={key} onClick={() => { setAuditStandard(key); rawSetCi((p) => ({ ...p, reference_normes: std.desc })); setQuest(null); setAnalysis(null); }} style={{ ...chp(on), padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderRadius: 16, borderColor: on ? std.color : undefined }}>
                            <span style={{ fontSize: 28 }}>{std.icon}</span>
                            <span style={{ fontSize: 15, fontWeight: 800, color: on ? std.color : "#94A3B8" }}>{std.label}</span>
                            <span style={{ fontSize: 10, color: "#64748B", textAlign: "center" }}>{std.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Company tabs */}
                {auditStandard && (
                  <div>
                    <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(15,23,42,0.4)", borderRadius: 14, padding: 4 }}>
                      {["🏢 Identité", "📋 Audit"].map((t, i) => (
                        <button key={i} onClick={() => setCTab(i)} style={{ flex: 1, padding: 12, borderRadius: 11, border: "none", cursor: "pointer", background: cTab === i ? "rgba(5,150,105,0.12)" : "transparent", color: cTab === i ? "#34D399" : "#64748B", fontWeight: cTab === i ? 700 : 500, fontSize: 13, fontFamily: "inherit", borderBottom: cTab === i ? "2px solid " + stdColor : "2px solid transparent" }}>{t}</button>
                      ))}
                    </div>

                    {cTab === 0 && (
                      <div style={card}><div style={cHd}><div style={ibx("rgba(59,130,246,0.12)", "#60A5FA")}>🏢</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Société auditée</div></div>
                        <div style={cIn}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div style={{ gridColumn: "1/-1" }}><label style={lblS}>Raison sociale *</label><input style={inp} value={ci.nom} onChange={(e) => setCi("nom", e.target.value)} placeholder="Laiterie Atlas SARL" /></div>
                          <div><label style={lblS}>Ville</label><input style={inp} value={ci.ville} onChange={(e) => setCi("ville", e.target.value)} placeholder="Casablanca" /></div>
                          <div><label style={lblS}>Région</label><select style={{ ...inp, appearance: "auto" }} value={ci.region} onChange={(e) => setCi("region", e.target.value)}><option value="">—</option>{REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}</select></div>
                          {needsChain && (
                            <div style={{ gridColumn: "1/-1" }}>
                              <label style={lblS}>Secteur (chaîne de production)</label>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{SECTEURS.map((s) => (<button key={s.id} onClick={() => setCi("secteur", s.id)} style={{ ...chp(ci.secteur === s.id), padding: "8px 14px", fontSize: 12, borderRadius: 10 }}>{s.icon} {s.label}</button>))}</div>
                            </div>
                          )}
                          <div><label style={lblS}>Taille *</label><div style={{ display: "flex", gap: 8 }}>{TAILLES.map((t) => (<button key={t.id} onClick={() => setCi("taille", t.id)} style={{ ...chp(ci.taille === t.id), padding: "10px 16px", borderRadius: 10 }}>{t.label} ({t.sub})</button>))}</div></div>
                          <div><label style={lblS}>Effectif</label><input style={inp} type="number" value={ci.effectif} onChange={(e) => setCi("effectif", e.target.value)} placeholder="Employés" /></div>
                        </div></div></div>
                    )}

                    {cTab === 1 && (
                      <div style={card}><div style={cHd}><div style={ibx("rgba(220,38,38,0.12)", "#F87171")}>📋</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Informations audit</div></div>
                        <div style={cIn}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div><label style={lblS}>Date</label><input style={inp} type="date" value={ci.date_audit} onChange={(e) => setCi("date_audit", e.target.value)} /></div>
                          <div><label style={lblS}>Auditeur</label><input style={inp} value={ci.auditeur} onChange={(e) => setCi("auditeur", e.target.value)} /></div>
                          <div><label style={lblS}>Resp. qualité</label><input style={inp} value={ci.responsable_qualite} onChange={(e) => setCi("responsable_qualite", e.target.value)} /></div>
                          <div><label style={lblS}>Référentiel</label><input style={inp} value={ci.reference_normes} onChange={(e) => setCi("reference_normes", e.target.value)} /></div>
                          <div style={{ gridColumn: "1/-1" }}><label style={lblS}>Périmètre</label><textarea style={{ ...inp, minHeight: 50, resize: "vertical" }} value={ci.perimetre} onChange={(e) => setCi("perimetre", e.target.value)} /></div>
                        </div></div></div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                      <div>{cTab > 0 && <button style={bsS} onClick={() => setCTab(0)}>← Identité</button>}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {cTab === 0 && <button style={{ ...bp, background: "linear-gradient(135deg," + stdColor + "," + stdColor + "88)" }} onClick={() => setCTab(1)}>Audit →</button>}
                        {cTab === 1 && <button style={{ ...bp, opacity: canGo ? 1 : 0.4 }} onClick={() => goTo(needsChain ? "chain" : "audit")} disabled={!canGo}>{needsChain ? "Chaîne →" : "Questionnaire →"}</button>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CHAIN (HACCP only) ── */}
            {step === "chain" && chain && needsChain && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", margin: "0 0 4px", fontFamily: "'Playfair Display',serif" }}>{chainDef.label}</h2>
                <p style={{ color: "#64748B", fontSize: 13, marginBottom: 20 }}><span style={{ color: "#34D399", fontWeight: 700 }}>✓ existant</span> ou <span style={{ color: "#F87171", fontWeight: 700 }}>✗ manquant</span></p>
                <div style={card}><div style={{ ...cIn, display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {[{ l: "Total", v: chain.length, c: "#94A3B8" }, { l: "Présentes", v: chainPr, c: "#34D399" }, { l: "Manquantes", v: chainAb, c: chainAb ? "#F87171" : "#34D399" }, { l: "CCP", v: chainCcP + "/" + chainCcT, c: chainCcP === chainCcT ? "#34D399" : "#FBBF24" }].map((m, i) => (
                    <div key={i} style={{ flex: 1, minWidth: 80, textAlign: "center" }}><div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase" }}>{m.l}</div><div style={{ fontSize: 22, fontWeight: 800, color: m.c, fontFamily: "monospace" }}>{m.v}</div></div>
                  ))}
                </div></div>
                <div style={card}><div style={cIn}>
                  {chain.map((p, idx) => {
                    const tc = TC_MAP[p.type] || TC_MAP.process;
                    const isPr = p.status === "present"; const isAb = p.status === "absent"; const isEx = expStep === idx;
                    return (
                      <div key={p.id}>
                        {idx > 0 && (<div style={{ display: "flex", justifyContent: "center" }}><div style={{ width: 2, height: 16, background: isAb ? "rgba(239,68,68,0.3)" : tc.border }} /></div>)}
                        <div onClick={() => setExpStep(isEx ? null : idx)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: isAb ? "rgba(127,29,29,0.12)" : tc.bg, border: "1.5px solid " + (isAb ? "#DC2626" : tc.border), borderRadius: 12, cursor: "pointer", opacity: isAb ? 0.75 : 1, position: "relative" }}>
                          {p.ccp && (<div style={{ position: "absolute", top: -7, right: 10, background: "#F59E0B", color: "#000", fontSize: 9, fontWeight: 900, padding: "1px 7px", borderRadius: 5 }}>CCP</div>)}
                          <div style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isAb ? "#F87171" : tc.text, textDecoration: isAb ? "line-through" : "none" }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: "#64748B", whiteSpace: isEx ? "normal" : "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.details}</div>
                          </div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={(e) => { e.stopPropagation(); setChain((c) => c.map((s, j) => j === idx ? { ...s, status: "present" } : s)); }} style={{ width: 34, height: 34, borderRadius: 8, border: "none", cursor: "pointer", background: isPr ? "#059669" : "#1E293B", color: isPr ? "#fff" : "#64748B", fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</button>
                            <button onClick={(e) => { e.stopPropagation(); setChain((c) => c.map((s, j) => j === idx ? { ...s, status: "absent" } : s)); }} style={{ width: 34, height: 34, borderRadius: 8, border: "none", cursor: "pointer", background: isAb ? "#DC2626" : "#1E293B", color: isAb ? "#fff" : "#64748B", fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✗</button>
                          </div>
                        </div>
                        {isEx && (<div style={{ marginTop: 5, marginLeft: 36, marginRight: 36 }}><textarea style={{ ...inp, minHeight: 48, fontSize: 12 }} placeholder="Observation…" value={p.observation} onClick={(e) => e.stopPropagation()} onChange={(e) => { const v = e.target.value; setChain((c) => c.map((s, j) => j === idx ? { ...s, observation: v } : s)); }} /></div>)}
                      </div>
                    );
                  })}
                </div></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
                  <button style={bsS} onClick={() => goTo("company")}>← Société</button>
                  <button style={bp} onClick={() => goTo("audit")}>Questionnaire →</button>
                </div>
              </div>
            )}

            {/* ── AUDIT QUESTIONNAIRE ── */}
            {step === "audit" && quest && curCatData && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div><h2 style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9", margin: 0, fontFamily: "'Playfair Display',serif" }}>Audit {AUDIT_STANDARDS[auditStandard]?.label}</h2><p style={{ color: "#64748B", fontSize: 12, marginTop: 3 }}>{ci.nom} — {ci.date_audit}</p></div>
                  <div style={{ width: 130, textAlign: "right" }}><div style={{ fontSize: 10, color: "#64748B" }}>Progression</div><div style={{ height: 6, background: "#1E293B", borderRadius: 4, marginTop: 3 }}><div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg," + stdColor + "," + stdColor + "88)", width: prog + "%", transition: "width 0.5s" }} /></div></div>
                </div>
                <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
                  {catKeys.map((k, i) => {
                    const c = quest[k]; const p = catProg(k); const a2 = i === curCat;
                    return (<button key={k} onClick={() => setCurCat(i)} style={{ flexShrink: 0, padding: "6px 11px", borderRadius: 7, background: a2 ? stdColor + "22" : "transparent", border: a2 ? "1px solid " + stdColor : "1px solid transparent", color: a2 ? stdColor : "#64748B", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}><span>{c.icon}</span><span style={{ whiteSpace: "nowrap" }}>{c.title}</span>{p === 100 && <span style={{ color: "#059669" }}>✓</span>}</button>);
                  })}
                </div>
                <div style={card}><div style={cIn}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}><span style={{ fontSize: 24 }}>{curCatData.icon}</span><div><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F1F5F9" }}>{curCatData.title}</h3><span style={{ fontSize: 11, color: "#64748B" }}>{curCatData.questions.length} questions — {catProg(curCk)}%</span></div></div>
                  {curCatData.questions.map((q, qi) => (
                    <div key={q.id} style={{ padding: 16, marginBottom: 10, background: q.rating !== null ? "rgba(15,23,42,0.5)" : "rgba(6,13,27,0.6)", border: "1px solid", borderColor: q.rating === 2 ? "#059669" : q.rating === 1 ? "#D97706" : q.rating === 0 ? "#DC2626" : "rgba(59,130,246,0.1)", borderRadius: 14 }}>
                      <div style={{ fontSize: 13, color: "#E2E8F0", marginBottom: 10, lineHeight: 1.6 }}><span style={{ color: "#64748B", fontFamily: "monospace", marginRight: 7 }}>Q{qi + 1}</span>{q.text}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {RO.map((o) => (<button key={o.value} onClick={() => { setQuest((prev) => { const n = JSON.parse(JSON.stringify(prev)); n[curCk].questions[qi].rating = o.value; return n; }); }} style={{ padding: "5px 13px", borderRadius: 7, background: q.rating === o.value ? o.bg : "transparent", border: "1px solid " + (q.rating === o.value ? o.color : "rgba(59,130,246,0.1)"), color: q.rating === o.value ? o.color : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{o.label}</button>))}
                      </div>
                      {q.rating !== null && q.rating < 2 && q.rating >= 0 && (<textarea style={{ ...inp, minHeight: 50, marginTop: 8, resize: "vertical" }} placeholder="Observation…" value={q.observation} onChange={(e) => { const v = e.target.value; setQuest((prev) => { const n = JSON.parse(JSON.stringify(prev)); n[curCk].questions[qi].observation = v; return n; }); }} />)}
                    </div>
                  ))}
                </div></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                  <button style={bsS} onClick={() => curCat > 0 ? setCurCat(curCat - 1) : goTo(needsChain ? "chain" : "company")}>← {curCat > 0 ? "Précédent" : (needsChain ? "Chaîne" : "Société")}</button>
                  {curCat < catKeys.length - 1 ? (<button style={{ ...bp, background: "linear-gradient(135deg," + stdColor + "," + stdColor + "88)" }} onClick={() => setCurCat(curCat + 1)}>Suivant →</button>) : (<button style={{ ...bp, background: "linear-gradient(135deg,#2563EB,#60A5FA)" }} onClick={() => goTo("report")}>Rapport →</button>)}
                </div>
              </div>
            )}

            {/* ── REPORT ── */}
            {step === "report" && analysis && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
                  <div><h2 style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", margin: 0, fontFamily: "'Playfair Display',serif" }}>Rapport {AUDIT_STANDARDS[auditStandard]?.label}</h2><p style={{ color: "#64748B", fontSize: 12, marginTop: 3 }}>{ci.nom} — {ci.date_audit}</p></div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button style={bsS} onClick={() => goTo("company")}>Société</button>
                    <button style={bsS} onClick={() => goTo("audit")}>Audit</button>
                    <button style={{ ...bp, background: pdfGen ? "#334" : "linear-gradient(135deg,#DC2626,#F87171)", opacity: pdfGen ? 0.7 : 1 }} onClick={genPDF} disabled={pdfGen}>{pdfGen ? "…" : "PDF ↓"}</button>
                  </div>
                </div>
                <div style={{ padding: 20, borderRadius: 16, marginBottom: 18, background: analysis.certColor + "12", border: "2px solid " + analysis.certColor, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: analysis.certColor }}>{analysis.certification}</div></div>

                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, ...card, padding: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}><Gauge score={analysis.globalScore} /><div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8" }}>Score Global</div></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "22px 22px 22px 0" }}>
                    {[{ l: "Conformes", v: analysis.totalConf, c: "#059669", i: "✓" }, { l: "Partiellement", v: analysis.totalPartial, c: "#D97706", i: "◐" }, { l: "Non conformes", v: analysis.totalNonConf, c: "#DC2626", i: "✗" }, { l: "N/A", v: analysis.totalNA, c: "#6B7280", i: "—" }].map((s, i) => (
                      <div key={i} style={{ padding: 10, background: "rgba(6,13,27,0.6)", borderRadius: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: s.c, fontSize: 14 }}>{s.i}</span><span style={{ fontSize: 10, color: "#94A3B8" }}>{s.l}</span></div><div style={{ fontSize: 24, fontWeight: 800, color: s.c, fontFamily: "monospace" }}>{s.v}</div></div>
                    ))}
                  </div>
                </div>

                <div style={card}><div style={cIn}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: "0 0 16px" }}>Scores par catégorie</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {rCd.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 28, textAlign: "center", fontSize: 15 }}>{d.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ fontSize: 11, color: "#94A3B8" }}>{d.label}</span><span style={{ fontSize: 11, fontWeight: 700, color: d.value >= 90 ? "#059669" : d.value >= 70 ? "#D97706" : "#DC2626", fontFamily: "monospace" }}>{d.value}%</span></div>
                          <div style={{ height: 7, background: "#1E293B", borderRadius: 4 }}><div style={{ height: "100%", borderRadius: 4, width: d.value + "%", background: d.value >= 90 ? "linear-gradient(90deg,#059669,#34D399)" : d.value >= 70 ? "linear-gradient(90deg,#D97706,#FBBF24)" : "linear-gradient(90deg,#DC2626,#F87171)", transition: "width 1s" }} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div></div>

                {rCrit.length > 0 && (<div style={{ ...card, borderColor: "rgba(220,38,38,0.3)" }}><div style={cIn}><h3 style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", margin: "0 0 12px" }}>NC majeures ({rCrit.length})</h3>{rCrit.map((f, i) => (<div key={i} style={{ padding: 12, marginBottom: 7, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 12 }}><div style={{ fontSize: 9, color: "#DC2626", fontWeight: 700, textTransform: "uppercase" }}>{f.category}</div><div style={{ fontSize: 12, color: "#E2E8F0", marginTop: 3 }}>{f.text}</div>{f.obs && <div style={{ fontSize: 11, color: "#F87171", marginTop: 4, fontStyle: "italic" }}>→ {f.obs}</div>}</div>))}</div></div>)}
                {rMinor.length > 0 && (<div style={{ ...card, borderColor: "rgba(217,119,6,0.3)" }}><div style={cIn}><h3 style={{ fontSize: 14, fontWeight: 700, color: "#D97706", margin: "0 0 12px" }}>NC mineures ({rMinor.length})</h3>{rMinor.map((f, i) => (<div key={i} style={{ padding: 12, marginBottom: 7, background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", borderRadius: 12 }}><div style={{ fontSize: 9, color: "#D97706", fontWeight: 700, textTransform: "uppercase" }}>{f.category}</div><div style={{ fontSize: 12, color: "#E2E8F0", marginTop: 3 }}>{f.text}</div>{f.obs && <div style={{ fontSize: 11, color: "#FBBF24", marginTop: 4, fontStyle: "italic" }}>→ {f.obs}</div>}</div>))}</div></div>)}

                {/* Carbon in report */}
                {carbonTotal > 0 && (
                  <div style={card}><div style={cIn}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#4ADE80", margin: "0 0 12px" }}>Empreinte Carbone : {carbonTotal.toFixed(1)} tCO2e/an</h3>
                    {carbonBreakdown.slice(0, 3).map((c) => (<div key={c.id} style={{ fontSize: 12, color: "#E2E8F0", marginBottom: 4 }}>• {c.icon} {c.label} : {c.emission.toFixed(1)} tCO2e</div>))}
                  </div></div>
                )}

                <div style={card}><div style={cIn}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: "0 0 12px" }}>Plan d'Actions</h3>
                  {(rCrit.length > 0) && (<div style={{ padding: 14, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)", borderRadius: 12, marginBottom: 10 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 5 }}>P1 — Immédiat (30j)</div><div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.7 }}>{rCrit.map((f, i) => (<div key={i}>• {f.text.substring(0, 80)}…</div>))}</div></div>)}
                  {rMinor.length > 0 && (<div style={{ padding: 14, background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.12)", borderRadius: 12, marginBottom: 10 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 5 }}>P2 — Correctif (90j)</div><div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.7 }}>{rMinor.slice(0, 5).map((f, i) => (<div key={i}>• {f.text.substring(0, 80)}…</div>))}</div></div>)}
                  <div style={{ padding: 14, background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.12)", borderRadius: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 5 }}>P3 — Amélioration continue</div><div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.7 }}>• Audit de suivi 6 mois • Formation • MAJ documentation • Conformité réglementaire</div></div>
                </div></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
