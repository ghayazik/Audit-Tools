import { useState, useCallback, useMemo } from "react";

/* ═══════ DATA ═══════ */
const CHAINS = {
  laitier:{label:"Chaîne Laitière",steps:[
    {id:"r1",name:"Réception du lait cru",icon:"🚛",type:"reception",ccp:false,details:"T° ≤6°C, acidité, antibiotiques"},
    {id:"r2",name:"Filtration / Clarification",icon:"🔬",type:"process",ccp:false,details:"Élimination impuretés"},
    {id:"r3",name:"Stockage réfrigéré",icon:"❄️",type:"stockage",ccp:false,details:"Tank ≤4°C"},
    {id:"r4",name:"Standardisation",icon:"⚙️",type:"process",ccp:false,details:"Ajustement MG"},
    {id:"r5",name:"Homogénéisation",icon:"🌀",type:"process",ccp:false,details:"150-200 bars"},
    {id:"r6",name:"Pasteurisation",icon:"🔥",type:"process",ccp:true,details:"CCP — 72°C/15s"},
    {id:"r7",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"≤4°C en <2h"},
    {id:"r8",name:"Fermentation",icon:"🧫",type:"process",ccp:false,details:"Ferments, pH, T°"},
    {id:"r9",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Emballage aseptique"},
    {id:"r10",name:"Stockage PF",icon:"🏭",type:"stockage",ccp:false,details:"+2 à +6°C"},
    {id:"r11",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"Véhicules réfrigérés"},
    {id:"r12",name:"Détection métaux",icon:"🔍",type:"controle",ccp:true,details:"CCP — Détecteur calibré"},
    {id:"r13",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"DLC, allergènes, NM"},
    {id:"r14",name:"CIP Nettoyage",icon:"🧹",type:"support",ccp:false,details:"NEP validé"},
    {id:"r15",name:"Traitement eau",icon:"💧",type:"support",ccp:false,details:"Potabilité NM"},
  ]},
  viande:{label:"Chaîne Viande",steps:[
    {id:"v1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Inspection ante-mortem"},
    {id:"v2",name:"Abattage halal",icon:"🔪",type:"process",ccp:false,details:"Rituel halal"},
    {id:"v3",name:"Éviscération",icon:"⚙️",type:"process",ccp:true,details:"CCP — Contamination fécale"},
    {id:"v4",name:"Inspection post-mortem",icon:"🔬",type:"controle",ccp:true,details:"CCP — Vétérinaire"},
    {id:"v5",name:"Refroidissement",icon:"❄️",type:"process",ccp:true,details:"CCP — ≤7°C <24h"},
    {id:"v6",name:"Découpe",icon:"🥩",type:"process",ccp:false,details:"Salle ≤12°C"},
    {id:"v7",name:"Transformation",icon:"🔥",type:"process",ccp:true,details:"CCP — ≥72°C cœur"},
    {id:"v8",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Sous vide, MAP"},
    {id:"v9",name:"Détection métaux",icon:"🔍",type:"controle",ccp:true,details:"CCP"},
    {id:"v10",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"0-4°C / ≤-18°C"},
    {id:"v11",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"Frigorifique"},
    {id:"v12",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"DLC, halal"},
    {id:"v13",name:"Nettoyage",icon:"🧹",type:"support",ccp:false,details:"Protocole validé"},
  ]},
  poisson:{label:"Chaîne Produits Mer",steps:[
    {id:"p1",name:"Réception",icon:"🚛",type:"reception",ccp:true,details:"CCP — ≤2°C, histamine"},
    {id:"p2",name:"Tri & Lavage",icon:"💧",type:"process",ccp:false,details:"Eau potable"},
    {id:"p3",name:"Filetage",icon:"🔪",type:"process",ccp:false,details:"≤12°C"},
    {id:"p4",name:"Cuisson/Fumage",icon:"🔥",type:"process",ccp:true,details:"CCP — Barème validé"},
    {id:"p5",name:"Congélation",icon:"🧊",type:"process",ccp:true,details:"CCP — ≤-18°C"},
    {id:"p6",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Sous vide"},
    {id:"p7",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},
    {id:"p8",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"≤-18°C"},
    {id:"p9",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"Chaîne froid"},
    {id:"p10",name:"Nettoyage",icon:"🧹",type:"support",ccp:false,details:"Spécifique"},
  ]},
  conserve:{label:"Chaîne Conserves",steps:[
    {id:"c1",name:"Réception MP",icon:"🚛",type:"reception",ccp:false,details:"Contrôle qualité"},
    {id:"c2",name:"Lavage/Triage",icon:"💧",type:"process",ccp:false,details:"Eau potable"},
    {id:"c3",name:"Blanchiment",icon:"♨️",type:"process",ccp:false,details:"85-95°C"},
    {id:"c4",name:"Préparation",icon:"⚙️",type:"process",ccp:false,details:"Recette"},
    {id:"c5",name:"Remplissage",icon:"🫙",type:"process",ccp:false,details:"Poids net"},
    {id:"c6",name:"Sertissage",icon:"🔧",type:"process",ccp:true,details:"CCP — Contrôle serti"},
    {id:"c7",name:"Stérilisation",icon:"🔥",type:"process",ccp:true,details:"CCP — Barème Fo"},
    {id:"c8",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"≤40°C"},
    {id:"c9",name:"Étuvage",icon:"🌡️",type:"controle",ccp:false,details:"37°C/7j"},
    {id:"c10",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"DLUO"},
    {id:"c11",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Sec"},
    {id:"c12",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"},
  ]},
  boisson:{label:"Chaîne Boissons",steps:[
    {id:"b1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Certificats"},
    {id:"b2",name:"Traitement eau",icon:"💧",type:"process",ccp:true,details:"CCP — UV, NM"},
    {id:"b3",name:"Préparation sirop",icon:"⚙️",type:"process",ccp:false,details:"Dosage"},
    {id:"b4",name:"Carbonatation",icon:"🫧",type:"process",ccp:false,details:"CO2"},
    {id:"b5",name:"Pasteurisation",icon:"🔥",type:"process",ccp:true,details:"CCP — pH"},
    {id:"b6",name:"Remplissage",icon:"🍶",type:"process",ccp:false,details:"Aseptique"},
    {id:"b7",name:"Bouchage",icon:"🔧",type:"process",ccp:true,details:"CCP — Étanchéité"},
    {id:"b8",name:"Inspection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},
    {id:"b9",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"DLC, NM"},
    {id:"b10",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Abri chaleur"},
    {id:"b11",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"},
    {id:"b12",name:"CIP",icon:"🧹",type:"support",ccp:false,details:"Soude/acide"},
  ]},
  cereale:{label:"Chaîne Céréales",steps:[
    {id:"ce1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Mycotoxines"},
    {id:"ce2",name:"Stockage silos",icon:"🏭",type:"stockage",ccp:false,details:"Ventilation"},
    {id:"ce3",name:"Nettoyage",icon:"🔬",type:"process",ccp:false,details:"Aimant"},
    {id:"ce4",name:"Mouture",icon:"⚙️",type:"process",ccp:false,details:"Granulométrie"},
    {id:"ce5",name:"Pétrissage",icon:"🌀",type:"process",ccp:false,details:"Recette"},
    {id:"ce6",name:"Fermentation",icon:"🧫",type:"process",ccp:false,details:"T°/durée"},
    {id:"ce7",name:"Cuisson",icon:"🔥",type:"process",ccp:true,details:"CCP — T° cœur"},
    {id:"ce8",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"Zone propre"},
    {id:"ce9",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"MAP"},
    {id:"ce10",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},
    {id:"ce11",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Gluten, DLC"},
    {id:"ce12",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"},
  ]},
  huile:{label:"Chaîne Huiles",steps:[
    {id:"h1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"État sanitaire"},
    {id:"h2",name:"Lavage",icon:"💧",type:"process",ccp:false,details:"Eau potable"},
    {id:"h3",name:"Broyage",icon:"⚙️",type:"process",ccp:false,details:"Inox"},
    {id:"h4",name:"Malaxage",icon:"🌀",type:"process",ccp:false,details:"≤27°C"},
    {id:"h5",name:"Extraction",icon:"🫒",type:"process",ccp:false,details:"Décanteur"},
    {id:"h6",name:"Filtration",icon:"🔬",type:"process",ccp:false,details:"Séparation"},
    {id:"h7",name:"Raffinage",icon:"🔥",type:"process",ccp:false,details:"Si applicable"},
    {id:"h8",name:"Contrôle qualité",icon:"🧪",type:"controle",ccp:true,details:"CCP — Acidité, peroxyde"},
    {id:"h9",name:"Embouteillage",icon:"🍶",type:"process",ccp:false,details:"Verre teinté"},
    {id:"h10",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Catégorie"},
    {id:"h11",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Abri lumière"},
    {id:"h12",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"},
  ]},
  confiserie:{label:"Chaîne Confiserie",steps:[
    {id:"cf1",name:"Réception MP",icon:"🚛",type:"reception",ccp:false,details:"Cacao, sucre"},
    {id:"cf2",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"T°/humidité"},
    {id:"cf3",name:"Pesage",icon:"⚖️",type:"process",ccp:false,details:"Recette"},
    {id:"cf4",name:"Mélange",icon:"🌀",type:"process",ccp:false,details:"Conchage"},
    {id:"cf5",name:"Tempérage",icon:"🌡️",type:"process",ccp:false,details:"45→27→31°C"},
    {id:"cf6",name:"Cuisson",icon:"🔥",type:"process",ccp:true,details:"CCP"},
    {id:"cf7",name:"Moulage",icon:"🍫",type:"process",ccp:false,details:"Moules"},
    {id:"cf8",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"Cristallisation"},
    {id:"cf9",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},
    {id:"cf10",name:"Emballage",icon:"📦",type:"process",ccp:false,details:"Protection"},
    {id:"cf11",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Allergènes"},
    {id:"cf12",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"Éviter chaleur"},
  ]},
  fruit:{label:"Chaîne Fruits & Légumes",steps:[
    {id:"f1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Pesticides"},
    {id:"f2",name:"Triage",icon:"🔬",type:"process",ccp:false,details:"Calibrage"},
    {id:"f3",name:"Lavage",icon:"💧",type:"process",ccp:true,details:"CCP — Eau chlorée"},
    {id:"f4",name:"Découpe",icon:"🔪",type:"process",ccp:false,details:"Marche en avant"},
    {id:"f5",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"MAP"},
    {id:"f6",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"Pré-cooling"},
    {id:"f7",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"T° produit"},
    {id:"f8",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Origine, DLC"},
    {id:"f9",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"},
  ]},
  epice:{label:"Chaîne Épices",steps:[
    {id:"e1",name:"Réception",icon:"🚛",type:"reception",ccp:false,details:"Mycotoxines"},
    {id:"e2",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Sec"},
    {id:"e3",name:"Nettoyage",icon:"💧",type:"process",ccp:false,details:"Triage"},
    {id:"e4",name:"Séchage",icon:"☀️",type:"process",ccp:false,details:"Contrôlé"},
    {id:"e5",name:"Broyage",icon:"⚙️",type:"process",ccp:false,details:"Inox"},
    {id:"e6",name:"Décontamination",icon:"🔥",type:"process",ccp:true,details:"CCP — Vapeur"},
    {id:"e7",name:"Mélange",icon:"🌀",type:"process",ccp:false,details:"Recette"},
    {id:"e8",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},
    {id:"e9",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Sachets"},
    {id:"e10",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Allergènes"},
    {id:"e11",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"Sec"},
  ]},
  autre:{label:"Chaîne Générique",steps:[
    {id:"g1",name:"Réception MP",icon:"🚛",type:"reception",ccp:false,details:"Contrôle"},
    {id:"g2",name:"Stockage",icon:"🏭",type:"stockage",ccp:false,details:"Adapté"},
    {id:"g3",name:"Transformation",icon:"⚙️",type:"process",ccp:false,details:"Process"},
    {id:"g4",name:"Traitement thermique",icon:"🔥",type:"process",ccp:true,details:"CCP"},
    {id:"g5",name:"Refroidissement",icon:"🧊",type:"process",ccp:false,details:"Rapide"},
    {id:"g6",name:"Conditionnement",icon:"📦",type:"process",ccp:false,details:"Adapté"},
    {id:"g7",name:"Détection",icon:"🔍",type:"controle",ccp:true,details:"CCP"},
    {id:"g8",name:"Étiquetage",icon:"🏷️",type:"controle",ccp:false,details:"Conforme"},
    {id:"g9",name:"Stockage PF",icon:"🏭",type:"stockage",ccp:false,details:"Adapté"},
    {id:"g10",name:"Expédition",icon:"🚚",type:"expedition",ccp:false,details:"FIFO"},
    {id:"g11",name:"Nettoyage",icon:"🧹",type:"support",ccp:false,details:"Validé"},
  ]}
};

const CATS = {
  engagement:{title:"Engagement Direction",icon:"🏛️",questions:{all:["Direction a désigné un responsable qualité ?","Politique sécurité alimentaire documentée ?","Ressources suffisantes allouées au HACCP ?","Revues de direction planifiées ?","Objectifs communiqués au personnel ?"]}},
  equipe:{title:"Équipe HACCP",icon:"👥",questions:{all:["Équipe pluridisciplinaire constituée ?","Formation spécifique reçue ?","Compétences couvrent tous domaines ?","Coordinateur HACCP nommé ?","Rôles et responsabilités définis ?"]}},
  produit:{title:"Description Produits",icon:"📦",questions:{all:["Fiche descriptive complète par produit ?","Usage prévu et consommateurs identifiés ?","Conditions stockage/distribution spécifiées ?","DLC/DLUO validée scientifiquement ?","Allergènes déclarés ?"],laitier:["Traitements thermiques documentés ?","Chaîne du froid assurée ?"],viande:["Abattage halal conforme ?","Traçabilité animal-assiette ?"],conserve:["Barèmes stérilisation validés ?","Tests étuvage par lot ?"],boisson:["Sources eau analysées NM ?","Traitement eau documenté ?"],cereale:["Contrôles mycotoxines ?","Stockage anti-moisissures ?"],huile:["Indices qualité contrôlés ?","Traçabilité lots ?"]}},
  diagramme:{title:"Diagramme Fabrication",icon:"🔄",questions:{all:["Diagramme détaillé par produit ?","Toutes étapes réception-expédition ?","Vérifié sur site ?","Paramètres clés indiqués ?","Flux matières/personnel/déchets ?"]}},
  dangers:{title:"Analyse Dangers",icon:"⚠️",questions:{all:["Dangers bio/chimiques/physiques identifiés ?","Gravité et probabilité évaluées ?","Mesures préventives définies ?","Analyse revue lors de changements ?","Allergènes spécifiquement traités ?"],laitier:["Listeria/Salmonella/E.coli évalués ?","Résidus antibiotiques ?"],viande:["Dangers parasitaires évalués ?","Contamination croisée cru/fini ?"],poisson:["Histamine évalué ?","Biotoxines marines ?"]}},
  ccp:{title:"Points Critiques CCP",icon:"🎯",questions:{all:["CCP par arbre de décision ?","Limites critiques mesurables ?","Limites basées données scientifiques ?","Surveillance en place ?","Actions correctives prédéfinies ?","Enregistrements CCP conservés ?"]}},
  prp:{title:"Programmes Préalables",icon:"🧹",questions:{all:["Plan nettoyage/désinfection vérifié ?","Lutte nuisibles en place ?","Eau potable contrôlée ?","Installations sanitaires suffisantes ?","Gestion déchets maîtrisée ?","Marche en avant respectée ?","Éclairage/ventilation adaptés ?","Surfaces contact alimentaire ?"],export:["Exigences pays importateurs ?","Agrément ONSSA export ?"]}},
  hygiene:{title:"Hygiène Personnel",icon:"🧤",questions:{all:["Règles hygiène affichées/appliquées ?","Visites médicales (Dahir 1-10-08) ?","Formation hygiène en place ?","Visiteurs mêmes règles ?","Tenues fournies/adaptées ?"]}},
  tracabilite:{title:"Traçabilité",icon:"🔗",questions:{all:["Traçabilité amont ?","Interne MP-PF ?","Aval assurée ?","Exercices rappel annuels ?","Conforme loi 28-07 ?"]}},
  verification:{title:"Vérification",icon:"✅",questions:{all:["Audits internes ?","Analyses labo ?","Tendances analysées ?","Revalidation si modification ?","Instruments étalonnés ?"]}},
  documentation:{title:"Documentation",icon:"📋",questions:{all:["Procédures documentées ?","Enregistrements datés/signés ?","Maîtrise documentaire ?","Enregistrements CCP protégés ?","Conforme ONSSA ?"]}},
  reglementation:{title:"Conformité Réglementaire",icon:"⚖️",questions:{all:["Agrément ONSSA valide ?","Produits conformes NM ?","Étiquetage loi 28-07 ?","Additifs autorisés ?","Rejets conformes ?"],export:["Certifications export ?","Listé registres export ?"],bio:["Certification bio accréditée ?","Séparation bio/conventionnel ?"]}}
};

const SECTEURS = [
  {id:"laitier",label:"Produits laitiers",icon:"🥛"},{id:"viande",label:"Viandes",icon:"🥩"},
  {id:"poisson",label:"Produits mer",icon:"🐟"},{id:"conserve",label:"Conserves",icon:"🥫"},
  {id:"boisson",label:"Boissons",icon:"🥤"},{id:"cereale",label:"Céréales",icon:"🌾"},
  {id:"huile",label:"Huiles",icon:"🫒"},{id:"confiserie",label:"Confiserie",icon:"🍫"},
  {id:"fruit",label:"Fruits & Légumes",icon:"🍎"},{id:"epice",label:"Épices",icon:"🌶️"},
  {id:"autre",label:"Autre",icon:"📦"}
];
const TAILLES = [{id:"tpe",label:"TPE",sub:"< 10"},{id:"pme",label:"PME",sub:"10-250"},{id:"grande",label:"GE",sub:"> 250"}];
const REGIONS = ["Casablanca-Settat","Rabat-Salé-Kénitra","Tanger-Tétouan-Al Hoceima","Fès-Meknès","Marrakech-Safi","Souss-Massa","Oriental","Béni Mellal-Khénifra","Drâa-Tafilalet","Laâyoune-Sakia El Hamra","Guelmim-Oued Noun","Dakhla-Oued Ed Dahab"];
const CERTIFS = ["ISO 22000","FSSC 22000","IFS Food","BRC Food","ISO 9001","GlobalG.A.P.","Bio","Halal","ONSSA Export"];
const RO = [{value:0,label:"Non conforme",color:"#DC2626",bg:"#FEE2E2"},{value:1,label:"Partiel",color:"#D97706",bg:"#FEF3C7"},{value:2,label:"Conforme",color:"#059669",bg:"#D1FAE5"},{value:-1,label:"N/A",color:"#6B7280",bg:"#F3F4F6"}];
const TC_MAP = {reception:{bg:"#0F1D32",border:"#3B82F6",text:"#93C5FD"},process:{bg:"#0F2118",border:"#059669",text:"#6EE7B7"},stockage:{bg:"#1A1230",border:"#8B5CF6",text:"#C4B5FD"},controle:{bg:"#261A10",border:"#F59E0B",text:"#FCD34D"},expedition:{bg:"#0F1F2E",border:"#06B6D4",text:"#67E8F9"},support:{bg:"#1E1A10",border:"#A78BFA",text:"#DDD6FE"}};

function genQ(info) {
  const q = {};
  Object.entries(CATS).forEach(([k, cat]) => {
    let qs = [...(cat.questions.all || [])];
    if (cat.questions[info.secteur]) qs.push(...cat.questions[info.secteur]);
    if (info.exporte && cat.questions.export) qs.push(...cat.questions.export);
    if (info.bio && cat.questions.bio) qs.push(...cat.questions.bio);
    q[k] = { title: cat.title, icon: cat.icon, questions: qs.map((t, i) => ({ id: k + "_" + i, text: t, rating: null, observation: "" })) };
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
      if (qq.rating === 2) c++;
      else if (qq.rating === 1) { p++; ncs.push({ text: qq.text, obs: qq.observation, level: "mineure" }); }
      else if (qq.rating === 0) { n++; ncs.push({ text: qq.text, obs: qq.observation, level: "majeure" }); }
      else a++;
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
  if (chain) {
    const ab = chain.filter((s) => s.status === "absent");
    chA = { total: chain.length, present: chain.filter((s) => s.status === "present").length, absent: ab.length, ccpMissing: ab.filter((s) => s.ccp), absentSteps: ab };
  }
  return { categories: cats, globalScore: gs, totalConf: tC, totalPartial: tP, totalNonConf: tN, totalNA: tA, totalQ: tQ, certification: cert, certColor: cc, chainAnalysis: chA };
}

function Gauge({ score, size }) {
  const sz = size || 130;
  const r = (sz - 16) / 2;
  const ci = 2 * Math.PI * r;
  const of = ci - (score / 100) * ci;
  const co = score >= 90 ? "#059669" : score >= 70 ? "#D97706" : "#DC2626";
  return (
    <div style={{ position: "relative", width: sz, height: sz }}>
      <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="#1E293B" strokeWidth="8" />
        <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={co} strokeWidth="8" strokeDasharray={ci} strokeDashoffset={of} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: sz * 0.28, fontWeight: 800, color: co, fontFamily: "monospace" }}>{score}%</span>
      </div>
    </div>
  );
}

/* ═══════ MAIN APP ═══════ */
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [loginPwd, setLoginPwd] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [loginShake, setLoginShake] = useState(false);

  const handleLogin = () => {
    if (loginPwd === "1317") {
      setAuthed(true);
      setLoginErr(false);
    } else {
      setLoginErr(true);
      setLoginShake(true);
      setTimeout(() => { setLoginShake(false); }, 500);
    }
  };

  const handleLoginKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const [step, setStep] = useState("company");
  const [ci, rawSetCi] = useState({
    nom: "", ville: "", region: "", secteur: "", taille: "", effectif: "",
    exporte: false, bio: false, produits_principaux: "", certifications: [],
    adresse: "", ice: "", rc: "", contact_tel: "", contact_email: "",
    date_audit: new Date().toISOString().split("T")[0],
    auditeur: "", auditeur_organisme: "", responsable_qualite: "",
    perimetre: "Ensemble des lignes de production",
    reference_normes: "Codex Alimentarius, NM 08.0.002, Loi 28-07"
  });
  const [chain, setChain] = useState(null);
  const [quest, setQuest] = useState(null);
  const [curCat, setCurCat] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [expStep, setExpStep] = useState(null);
  const [cTab, setCTab] = useState(0);
  const [pdfGen, setPdfGen] = useState(false);

  const setCi = useCallback((k, v) => { rawSetCi((p) => ({ ...p, [k]: v })); }, []);
  const togCert = useCallback((c) => { rawSetCi((p) => ({ ...p, certifications: p.certifications.includes(c) ? p.certifications.filter((x) => x !== c) : [...p.certifications, c] })); }, []);

  const catKeys = quest ? Object.keys(quest) : [];
  const canGo = ci.nom && ci.secteur && ci.taille;

  // Progress computed safely
  const prog = useMemo(() => {
    if (!quest) return 0;
    let a = 0, t = 0;
    Object.values(quest).forEach((c) => c.questions.forEach((q) => { t++; if (q.rating !== null) a++; }));
    return t > 0 ? Math.round((a / t) * 100) : 0;
  }, [quest]);

  const catProg = (k) => {
    if (!quest || !quest[k]) return 0;
    const c = quest[k];
    return Math.round((c.questions.filter((q) => q.rating !== null).length / c.questions.length) * 100);
  };

  const goTo = (t) => {
    if (t === "chain" && canGo) {
      if (!chain || chain._s !== ci.secteur) {
        const ch = (CHAINS[ci.secteur] || CHAINS.autre).steps.map((s) => ({ ...s, status: "present", observation: "" }));
        ch._s = ci.secteur;
        setChain(ch);
      }
    }
    if (t === "audit" && !quest) { setQuest(genQ(ci)); setCurCat(0); }
    if (t === "report" && quest) { setAnalysis(doAnalyze(quest, chain)); }
    setStep(t);
  };

  // Pre-compute all derived data
  const chainDef = CHAINS[ci.secteur] || CHAINS.autre;
  const chainPr = chain ? chain.filter((s) => s.status === "present").length : 0;
  const chainAb = chain ? chain.filter((s) => s.status === "absent").length : 0;
  const chainCcT = chain ? chain.filter((s) => s.ccp).length : 0;
  const chainCcP = chain ? chain.filter((s) => s.ccp && s.status === "present").length : 0;
  const curCk = catKeys[curCat] || null;
  const curCatData = quest && curCk ? quest[curCk] : null;

  const rCrit = [];
  const rMinor = [];
  const rCd = [];
  if (analysis) {
    Object.values(analysis.categories).forEach((c) => {
      c.nonConformities.forEach((n) => {
        if (n.level === "majeure") rCrit.push({ category: c.title, ...n });
        else rMinor.push({ category: c.title, ...n });
      });
      rCd.push({ label: c.title.length > 22 ? c.title.substring(0, 22) + "…" : c.title, icon: c.icon, value: c.score });
    });
  }

  const genPDF = async () => {
    if (!analysis) return;
    setPdfGen(true);
    try {
      const sl = SECTEURS.find((s) => s.id === ci.secteur)?.label || ci.secteur;
      const tl = TAILLES.find((t) => t.id === ci.taille)?.label || ci.taille;
      const d = { company: { ...ci, secteur_label: sl, taille_label: tl }, chainLabel: chainDef.label, processChain: chain || [], chainAnalysis: analysis.chainAnalysis, analysis: { globalScore: analysis.globalScore, totalConf: analysis.totalConf, totalPartial: analysis.totalPartial, totalNonConf: analysis.totalNonConf, totalNA: analysis.totalNA, totalQ: analysis.totalQ, certification: analysis.certification, categories: analysis.categories } };
      const prompt = "Genere un rapport HTML complet d'audit HACCP professionnel (A4, @media print, page-break) a partir de: " + JSON.stringify(d) + ". Sections: Couverture, Sommaire, Infos generales, Chaine production, Synthese, Resultats categorie, Ecarts (majeures+mineures), Preconisations (P1 30j P2 90j P3 continu + tableau), Signatures (auditeur: " + (d.company.auditeur || "N/R") + ", resp qualite: " + (d.company.responsable_qualite || "N/R") + ", visa direction). Pas d'emoji. HTML seul sans markdown.";
      const r = await fetch("/.netlify/functions/generate-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }) });
      const res = await r.json();
      let h = (res.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
      h = h.replace(/```html/gi, "").replace(/```/gi, "").trim();
      const w = window.open("", "_blank");
      if (w) { w.document.write(h); w.document.close(); setTimeout(() => { w.print(); }, 1500); }
    } catch (e) { alert("Erreur PDF"); }
    finally { setPdfGen(false); }
  };

  /* Styles */
  const card = { background: "rgba(15,23,42,0.7)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 18, marginBottom: 20, overflow: "hidden" };
  const cIn = { padding: "22px 26px" };
  const cHd = { padding: "16px 26px", borderBottom: "1px solid rgba(59,130,246,0.1)", display: "flex", alignItems: "center", gap: 12 };
  const inp = { width: "100%", padding: "12px 16px", background: "rgba(6,13,27,0.8)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12, color: "#E2E8F0", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const lblS = { display: "block", fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" };
  const bp = { padding: "13px 28px", background: "linear-gradient(135deg,#059669,#34D399)", color: "#0B1121", border: "none", borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" };
  const bs = { padding: "10px 20px", background: "rgba(59,130,246,0.08)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" };
  const ib = (bg, co) => ({ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, background: bg, color: co });
  const chp = (on) => ({ padding: "10px 16px", borderRadius: 12, background: on ? "rgba(5,150,105,0.15)" : "rgba(15,23,42,0.5)", border: "1.5px solid " + (on ? "#059669" : "rgba(59,130,246,0.1)"), color: on ? "#34D399" : "#94A3B8", cursor: "pointer", fontSize: 13, fontWeight: on ? 700 : 500, fontFamily: "inherit" });

  const stI = ["company", "chain", "audit", "report"];
  const stN = ["Société", "Chaîne", "Audit", "Rapport"];
  const stIc = ["🏢", "🔄", "📝", "📊"];
  const cIdx = stI.indexOf(step);

  /* ═══════ RENDER ═══════ */

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#060D1B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes shakeX { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-10px)} 40%,80%{transform:translateX(10px)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pulse { 0%,100%{box-shadow:0 0 30px rgba(5,150,105,0.15)} 50%{box-shadow:0 0 60px rgba(5,150,105,0.3)} }
        `}</style>
        <div style={{ width: "100%", maxWidth: 420, padding: "0 20px", animation: "fadeUp 0.6s ease" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#059669,#34D399)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: "#0B1121", marginBottom: 20, animation: "pulse 3s ease-in-out infinite" }}>H</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", margin: "0 0 6px", fontFamily: "'Playfair Display',serif", letterSpacing: "-0.02em" }}>HACCP Audit</h1>
            <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>Plateforme de certification agro-alimentaire — Maroc</p>
          </div>

          {/* Login card */}
          <div style={{
            background: "rgba(15,23,42,0.7)", border: "1px solid rgba(59,130,246,0.12)",
            borderRadius: 22, padding: "36px 32px", backdropFilter: "blur(12px)",
            animation: loginShake ? "shakeX 0.4s ease" : "none"
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 4 }}>Authentification</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>Veuillez saisir votre code d'accès</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Code d'accès</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 18 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type="password"
                  value={loginPwd}
                  onChange={(e) => { setLoginPwd(e.target.value); setLoginErr(false); }}
                  onKeyDown={handleLoginKey}
                  placeholder="••••"
                  autoFocus
                  style={{
                    width: "100%", padding: "14px 16px 14px 48px",
                    background: "rgba(6,13,27,0.8)",
                    border: "1.5px solid " + (loginErr ? "#DC2626" : "rgba(59,130,246,0.2)"),
                    borderRadius: 14, color: "#F1F5F9", fontSize: 18, letterSpacing: "0.15em",
                    outline: "none", fontFamily: "monospace", boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              {loginErr && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span style={{ fontSize: 13, color: "#F87171", fontWeight: 500 }}>Code incorrect. Veuillez réessayer.</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogin}
              style={{
                width: "100%", padding: "14px", border: "none", borderRadius: 14,
                background: "linear-gradient(135deg,#059669,#34D399)", color: "#0B1121",
                fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                boxShadow: "0 4px 24px rgba(5,150,105,0.3)", transition: "transform 0.1s"
              }}
            >
              Se connecter
            </button>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 32, color: "#475569", fontSize: 11 }}>
            <div>Accès réservé aux auditeurs habilités</div>
            <div style={{ marginTop: 4, color: "#334155" }}>HACCP Audit v2.0 — Certification Maroc</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060D1B", color: "#E2E8F0", fontFamily: "'Outfit',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "rgba(8,15,35,0.9)", borderBottom: "1px solid rgba(59,130,246,0.15)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#059669,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#0B1121" }}>H</div>
          <div><div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9" }}>HACCP Audit</div><div style={{ fontSize: 9, color: "#64748B" }}>Certification Agro-alimentaire Maroc</div></div>
        </div>
        {step === "audit" && <div style={{ padding: "4px 12px", borderRadius: 8, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)", fontSize: 12, fontWeight: 700, color: "#34D399", fontFamily: "monospace" }}>{prog}%</div>}
      </div>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "24px 20px" }}>

        {/* STEPPER */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28, background: "rgba(15,23,42,0.5)", borderRadius: 16, padding: "8px 12px", border: "1px solid rgba(59,130,246,0.08)" }}>
          {stN.map((s, i) => {
            const a = i === cIdx;
            const d = i < cIdx;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
                <button onClick={() => { if (d) goTo(stI[i]); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, border: "none", cursor: d ? "pointer" : "default", background: a ? "rgba(5,150,105,0.15)" : d ? "rgba(5,150,105,0.06)" : "transparent", fontFamily: "inherit" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: a ? "linear-gradient(135deg,#059669,#34D399)" : d ? "#059669" : "rgba(30,58,95,0.5)", color: a || d ? "#0B1121" : "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>{d ? "✓" : stIc[i]}</div>
                  <div style={{ fontSize: 12, fontWeight: a ? 700 : d ? 600 : 500, color: a ? "#34D399" : d ? "#059669" : "#475569" }}>{s}</div>
                </button>
                {i < 3 && <div style={{ flex: 1, height: 2, background: d ? "rgba(5,150,105,0.4)" : "rgba(30,58,95,0.3)", margin: "0 6px", borderRadius: 1 }} />}
              </div>
            );
          })}
        </div>

        {/* ═══════ STEP 1: COMPANY ═══════ */}
        {step === "company" && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9", margin: "0 0 6px", fontFamily: "'Playfair Display',serif" }}>Fiche Société</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 22 }}>Le questionnaire et la chaîne de production s'adapteront au secteur choisi.</p>

            <div style={{ display: "flex", gap: 4, marginBottom: 22, background: "rgba(15,23,42,0.4)", borderRadius: 14, padding: 4 }}>
              {["🏢 Identité", "⚙️ Activité", "📋 Audit"].map((t, i) => (
                <button key={i} onClick={() => setCTab(i)} style={{ flex: 1, padding: 12, borderRadius: 11, border: "none", cursor: "pointer", background: cTab === i ? "rgba(5,150,105,0.12)" : "transparent", color: cTab === i ? "#34D399" : "#64748B", fontWeight: cTab === i ? 700 : 500, fontSize: 13, fontFamily: "inherit", borderBottom: cTab === i ? "2px solid #059669" : "2px solid transparent" }}>{t}</button>
              ))}
            </div>

            {cTab === 0 && (
              <div>
                <div style={card}><div style={cHd}><div style={ib("rgba(59,130,246,0.12)", "#60A5FA")}>🏢</div><div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Identification</div></div></div>
                  <div style={cIn}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ gridColumn: "1/-1" }}><label style={lblS}>Raison sociale *</label><input style={inp} value={ci.nom} onChange={(e) => setCi("nom", e.target.value)} placeholder="Ex: Laiterie Atlas SARL" /></div>
                    <div><label style={lblS}>Ville</label><input style={inp} value={ci.ville} onChange={(e) => setCi("ville", e.target.value)} placeholder="Casablanca" /></div>
                    <div><label style={lblS}>Région</label><select style={{ ...inp, appearance: "auto" }} value={ci.region} onChange={(e) => setCi("region", e.target.value)}><option value="">— Sélectionner —</option>{REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}</select></div>
                    <div style={{ gridColumn: "1/-1" }}><label style={lblS}>Adresse</label><input style={inp} value={ci.adresse} onChange={(e) => setCi("adresse", e.target.value)} placeholder="Zone industrielle, rue…" /></div>
                    <div><label style={lblS}>ICE</label><input style={inp} value={ci.ice} onChange={(e) => setCi("ice", e.target.value)} /></div>
                    <div><label style={lblS}>RC</label><input style={inp} value={ci.rc} onChange={(e) => setCi("rc", e.target.value)} /></div>
                    <div><label style={lblS}>Téléphone</label><input style={inp} value={ci.contact_tel} onChange={(e) => setCi("contact_tel", e.target.value)} placeholder="+212…" /></div>
                    <div><label style={lblS}>Email</label><input style={inp} value={ci.contact_email} onChange={(e) => setCi("contact_email", e.target.value)} placeholder="contact@societe.ma" /></div>
                  </div></div></div>
                <div style={card}><div style={cHd}><div style={ib("rgba(139,92,246,0.12)", "#A78BFA")}>👥</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Taille *</div></div>
                  <div style={cIn}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                      {TAILLES.map((t) => (<button key={t.id} onClick={() => setCi("taille", t.id)} style={{ ...chp(ci.taille === t.id), padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderRadius: 14 }}><span style={{ fontSize: 18, fontWeight: 800 }}>{t.label}</span><span style={{ fontSize: 11, opacity: 0.7 }}>{t.sub}</span></button>))}
                    </div>
                    <label style={lblS}>Effectif exact</label><input style={inp} type="number" value={ci.effectif} onChange={(e) => setCi("effectif", e.target.value)} placeholder="Nombre d'employés" />
                  </div></div>
              </div>
            )}

            {cTab === 1 && (
              <div>
                <div style={card}><div style={cHd}><div style={ib("rgba(245,158,11,0.12)", "#FBBF24")}>⚙️</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Secteur d'activité *</div></div>
                  <div style={cIn}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
                    {SECTEURS.map((s) => (<button key={s.id} onClick={() => setCi("secteur", s.id)} style={{ ...chp(ci.secteur === s.id), padding: "14px 12px", display: "flex", alignItems: "center", gap: 10, borderRadius: 14 }}><span style={{ fontSize: 22 }}>{s.icon}</span><span style={{ fontSize: 12 }}>{s.label}</span></button>))}
                  </div></div></div>
                <div style={card}><div style={cHd}><div style={ib("rgba(6,182,212,0.12)", "#67E8F9")}>📦</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Produits & Options</div></div>
                  <div style={cIn}>
                    <div style={{ marginBottom: 16 }}><label style={lblS}>Produits principaux</label><textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={ci.produits_principaux} onChange={(e) => setCi("produits_principaux", e.target.value)} placeholder="Yaourt, Lait, Fromage…" /></div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 18px", borderRadius: 12, background: ci.exporte ? "rgba(5,150,105,0.12)" : "rgba(15,23,42,0.4)", border: "1.5px solid " + (ci.exporte ? "#059669" : "rgba(59,130,246,0.1)") }}><input type="checkbox" checked={ci.exporte} onChange={(e) => setCi("exporte", e.target.checked)} style={{ accentColor: "#059669", width: 18, height: 18 }} /><div><div style={{ fontSize: 13, fontWeight: 600, color: ci.exporte ? "#34D399" : "#94A3B8" }}>Export</div><div style={{ fontSize: 10, color: "#64748B" }}>Questions export</div></div></label>
                      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 18px", borderRadius: 12, background: ci.bio ? "rgba(5,150,105,0.12)" : "rgba(15,23,42,0.4)", border: "1.5px solid " + (ci.bio ? "#059669" : "rgba(59,130,246,0.1)") }}><input type="checkbox" checked={ci.bio} onChange={(e) => setCi("bio", e.target.checked)} style={{ accentColor: "#059669", width: 18, height: 18 }} /><div><div style={{ fontSize: 13, fontWeight: 600, color: ci.bio ? "#34D399" : "#94A3B8" }}>Bio</div><div style={{ fontSize: 10, color: "#64748B" }}>Questions bio</div></div></label>
                    </div>
                    <label style={lblS}>Certifications</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{CERTIFS.map((c) => (<button key={c} onClick={() => togCert(c)} style={{ ...chp(ci.certifications.includes(c)), padding: "8px 14px", fontSize: 12, borderRadius: 10 }}>{ci.certifications.includes(c) ? "✓ " : ""}{c}</button>))}</div>
                  </div></div>
              </div>
            )}

            {cTab === 2 && (
              <div>
                <div style={card}><div style={cHd}><div style={ib("rgba(220,38,38,0.12)", "#F87171")}>📋</div><div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Informations de l'audit</div></div>
                  <div style={cIn}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div><label style={lblS}>Date d'audit</label><input style={inp} type="date" value={ci.date_audit} onChange={(e) => setCi("date_audit", e.target.value)} /></div>
                    <div><label style={lblS}>Auditeur</label><input style={inp} value={ci.auditeur} onChange={(e) => setCi("auditeur", e.target.value)} placeholder="Nom complet" /></div>
                    <div><label style={lblS}>Organisme</label><input style={inp} value={ci.auditeur_organisme} onChange={(e) => setCi("auditeur_organisme", e.target.value)} placeholder="Bureau Veritas…" /></div>
                    <div><label style={lblS}>Resp. qualité</label><input style={inp} value={ci.responsable_qualite} onChange={(e) => setCi("responsable_qualite", e.target.value)} placeholder="Nom complet" /></div>
                    <div style={{ gridColumn: "1/-1" }}><label style={lblS}>Périmètre</label><textarea style={{ ...inp, minHeight: 50, resize: "vertical" }} value={ci.perimetre} onChange={(e) => setCi("perimetre", e.target.value)} /></div>
                    <div style={{ gridColumn: "1/-1" }}><label style={lblS}>Normes</label><input style={inp} value={ci.reference_normes} onChange={(e) => setCi("reference_normes", e.target.value)} /></div>
                  </div></div></div>
                {canGo && (
                  <div style={{ ...card, border: "1px solid rgba(5,150,105,0.2)" }}><div style={cHd}><div style={ib("rgba(5,150,105,0.12)", "#34D399")}>✓</div><div style={{ fontSize: 15, fontWeight: 700, color: "#34D399" }}>Récapitulatif</div></div>
                    <div style={cIn}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      {[{ l: "Société", v: ci.nom }, { l: "Secteur", v: SECTEURS.find((s) => s.id === ci.secteur)?.label || "" }, { l: "Taille", v: TAILLES.find((t) => t.id === ci.taille)?.label || "" }, { l: "Ville", v: ci.ville || "—" }, { l: "Date", v: ci.date_audit }, { l: "Auditeur", v: ci.auditeur || "—" }].map((x, i) => (
                        <div key={i} style={{ padding: "10px 14px", background: "rgba(6,13,27,0.6)", borderRadius: 10 }}><div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase" }}>{x.l}</div><div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", marginTop: 3 }}>{x.v}</div></div>
                      ))}
                    </div></div></div>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <div>{cTab > 0 && <button style={bs} onClick={() => setCTab(cTab - 1)}>← Précédent</button>}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {cTab < 2 && <button style={{ ...bp, background: "linear-gradient(135deg,#2563EB,#60A5FA)" }} onClick={() => setCTab(cTab + 1)}>Suivant →</button>}
                {cTab === 2 && <button style={{ ...bp, opacity: canGo ? 1 : 0.4 }} onClick={() => goTo("chain")} disabled={!canGo}>Chaîne de Production →</button>}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ STEP 2: CHAIN ═══════ */}
        {step === "chain" && chain && (
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
                const isPr = p.status === "present";
                const isAb = p.status === "absent";
                const isEx = expStep === idx;
                return (
                  <div key={p.id}>
                    {idx > 0 && (<div style={{ display: "flex", justifyContent: "center" }}><div style={{ width: 2, height: 16, background: isAb ? "rgba(239,68,68,0.3)" : tc.border }} /></div>)}
                    <div onClick={() => setExpStep(isEx ? null : idx)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: isAb ? "rgba(127,29,29,0.12)" : tc.bg, border: "1.5px solid " + (isAb ? "#DC2626" : tc.border), borderRadius: 12, cursor: "pointer", opacity: isAb ? 0.75 : 1, position: "relative" }}>
                      {p.ccp && (<div style={{ position: "absolute", top: -7, right: 10, background: "#F59E0B", color: "#000", fontSize: 9, fontWeight: 900, padding: "1px 7px", borderRadius: 5 }}>CCP</div>)}
                      <div style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isAb ? "#F87171" : tc.text, textDecoration: isAb ? "line-through" : "none" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isEx ? "normal" : "nowrap" }}>{p.details}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
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
              <button style={bs} onClick={() => goTo("company")}>← Société</button>
              <button style={bp} onClick={() => goTo("audit")}>Questionnaire →</button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 3: AUDIT ═══════ */}
        {step === "audit" && quest && curCatData && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div><h2 style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9", margin: 0, fontFamily: "'Playfair Display',serif" }}>Questionnaire d'Audit</h2><p style={{ color: "#64748B", fontSize: 12, marginTop: 3 }}>{ci.nom} — {ci.date_audit}</p></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: "#64748B" }}>Progression</div><div style={{ width: 130, height: 6, background: "#1E293B", borderRadius: 4, marginTop: 3 }}><div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#059669,#34D399)", width: prog + "%", transition: "width 0.5s" }} /></div></div>
            </div>

            <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
              {catKeys.map((k, i) => {
                const c = quest[k]; const p = catProg(k); const a = i === curCat;
                return (<button key={k} onClick={() => setCurCat(i)} style={{ flexShrink: 0, padding: "6px 11px", borderRadius: 7, background: a ? "rgba(5,150,105,0.15)" : "transparent", border: a ? "1px solid #059669" : "1px solid transparent", color: a ? "#34D399" : "#64748B", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}><span>{c.icon}</span><span style={{ whiteSpace: "nowrap" }}>{c.title}</span>{p === 100 && <span style={{ color: "#059669" }}>✓</span>}</button>);
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
              <button style={bs} onClick={() => curCat > 0 ? setCurCat(curCat - 1) : goTo("chain")}>← {curCat > 0 ? "Précédent" : "Chaîne"}</button>
              {curCat < catKeys.length - 1 ? (<button style={bp} onClick={() => setCurCat(curCat + 1)}>Suivant →</button>) : (<button style={{ ...bp, background: "linear-gradient(135deg,#2563EB,#60A5FA)" }} onClick={() => goTo("report")}>Générer le rapport →</button>)}
            </div>
          </div>
        )}

        {/* ═══════ STEP 4: REPORT ═══════ */}
        {step === "report" && analysis && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
              <div><h2 style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", margin: 0, fontFamily: "'Playfair Display',serif" }}>Rapport d'Audit HACCP</h2><p style={{ color: "#64748B", fontSize: 12, marginTop: 3 }}>{ci.nom} — {ci.ville} — {ci.date_audit}</p></div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button style={bs} onClick={() => goTo("company")}>Société</button>
                <button style={bs} onClick={() => goTo("chain")}>Chaîne</button>
                <button style={bs} onClick={() => goTo("audit")}>Audit</button>
                <button style={{ ...bp, background: pdfGen ? "#334" : "linear-gradient(135deg,#DC2626,#F87171)", opacity: pdfGen ? 0.7 : 1 }} onClick={genPDF} disabled={pdfGen}>{pdfGen ? "…" : "PDF ↓"}</button>
              </div>
            </div>

            <div style={{ padding: 20, borderRadius: 16, marginBottom: 18, background: analysis.certColor + "12", border: "2px solid " + analysis.certColor, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: analysis.certColor }}>{analysis.certification}</div></div>

            {analysis.chainAnalysis && (
              <div style={card}><div style={cHd}><div style={ib("rgba(59,130,246,0.12)", "#60A5FA")}>🔄</div><span style={{ fontWeight: 700, color: "#F1F5F9" }}>Chaîne de Production</span></div><div style={cIn}>
                <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                  {[{ l: "Présentes", v: analysis.chainAnalysis.present, t: analysis.chainAnalysis.total, c: "#34D399" }, { l: "Manquantes", v: analysis.chainAnalysis.absent, t: analysis.chainAnalysis.total, c: "#F87171" }, { l: "CCP manquants", v: analysis.chainAnalysis.ccpMissing.length, t: chain ? chain.filter((s) => s.ccp).length : 0, c: analysis.chainAnalysis.ccpMissing.length ? "#F87171" : "#34D399" }].map((m, i) => (
                    <div key={i} style={{ flex: 1, minWidth: 100, padding: 12, background: "rgba(6,13,27,0.6)", borderRadius: 10, textAlign: "center" }}><div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase" }}>{m.l}</div><div style={{ fontSize: 20, fontWeight: 800, color: m.c, fontFamily: "monospace" }}>{m.v}<span style={{ fontSize: 12, color: "#64748B" }}>/{m.t}</span></div></div>
                  ))}
                </div>
                {analysis.chainAnalysis.ccpMissing.length > 0 && (<div style={{ padding: 12, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 4 }}>CCP MANQUANTS</div>{analysis.chainAnalysis.ccpMissing.map((s, i) => (<div key={i} style={{ fontSize: 11, color: "#F87171" }}>• <b>{s.name}</b> — {s.details}</div>))}</div>)}
              </div></div>
            )}

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

            <div style={card}><div style={cIn}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: "0 0 12px" }}>Plan d'Actions</h3>
              {(analysis.chainAnalysis?.ccpMissing.length > 0 || rCrit.length > 0) && (<div style={{ padding: 14, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)", borderRadius: 12, marginBottom: 10 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 5 }}>P1 — Immédiat (30j)</div><div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.7 }}>{(analysis.chainAnalysis?.ccpMissing || []).map((s, i) => (<div key={"cp" + i}>• CCP : {s.name}</div>))}{rCrit.map((f, i) => (<div key={"cr" + i}>• {f.text.substring(0, 80)}…</div>))}</div></div>)}
              {rMinor.length > 0 && (<div style={{ padding: 14, background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.12)", borderRadius: 12, marginBottom: 10 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 5 }}>P2 — Correctif (90j)</div><div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.7 }}>{rMinor.slice(0, 5).map((f, i) => (<div key={"mn" + i}>• {f.text.substring(0, 80)}…</div>))}</div></div>)}
              <div style={{ padding: 14, background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.12)", borderRadius: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 5 }}>P3 — Amélioration continue</div><div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.7 }}>• Audit suivi 6 mois • Formation • MAJ doc HACCP • Conformité ONSSA</div></div>
            </div></div>
          </div>
        )}

      </div>
    </div>
  );
}
