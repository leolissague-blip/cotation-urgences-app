// ui.js — interface en une seule page : chaque changement recalcule aussitôt.
// Aucune donnée n'est enregistrée ; la page repart vide à chaque ouverture.
(function () {
  "use strict";
  const R = window.REGLES;
  const moteur = window.Moteur(R);
  const $ = (s) => document.querySelector(s);
  const ech = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Libellés courts pour les puces d'actes (affichage seulement ; le libellé
  // complet et le tarif restent ceux du fichier de règles).
  const COURT = {
    DEQP003: "ECG", GLHF001: "Gaz du sang",
    QZJA002: "Suture < 3 cm", QZJA017: "Suture 3–10 cm", QZJA015: "Suture > 10 cm",
    QAJA013: "Suture face < 3", QAJA005: "Suture face 3–10", QAJA002: "Suture face > 10",
    QZJA016: "Plaie prof. < 3", QZJA012: "Plaie prof. 3–10", QZJA001: "Plaie prof. > 10", QZJA022: "Plaie pulpo-unguéale",
    QZJA020: "Brûlure < 1 %", QZJA005: "Brûlure 1–10 %",
    QZJA009: "Abcès superficiel", QZJA011: "Abcès profond", MJPA010: "Panaris",
    QZJB001: "Hématome sous-ongle", QZFA020: "Ongle (tablette)",
    QAGA003: "CE peau visage/main", BDGP002: "CE cornée", CAGD001: "CE oreille / cérumen", GAGD002: "CE nez",
    GABD002: "Méchage antérieur", GABD001: "Méchage ant. + post.", LAEP002: "Fracture du nez",
    MZMP006: "Attelle avant-bras/poignet", MZMP011: "Plâtre avec coude", MZMP004: "Plâtre poignet (fract.)",
    MZMP013: "Plâtre ABP (fract.)", MZMP007: "Plâtre BABP (fract.)", NZMP003: "Botte / attelle cheville",
    NZMP007: "Attelle genou", NZMP014: "Plâtre cruropédieux (fract.)",
    MEEP002: "Lux. épaule", MEEP001: "Lux. acromio-clav.", MFEP001: "Pronation douloureuse", MFEP002: "Lux. coude",
    MHEP002: "Lux. doigt", MHEP001: "Lux. doigts (plusieurs)", NFEP001: "Lux. patella", LBEP005: "Lux. mâchoire",
    NZHB002: "Ponction genou / MI", MZHB002: "Ponction art. MS", GGHB001: "Ponction pleurale", AFHB002: "Ponction lombaire",
    JDLD001: "Sondage vésical",
    GFQM001: "Écho pleuro-pulm.", ZCQM008: "Écho abdomen", ZCQM003: "Écho pelvis", ZCQM005: "Écho abdo + pelvis",
    JAQM003: "Écho rein", JDQM001: "Écho vessie", PBQM002: "Écho articulation", QZQM001: "Écho tissus mous",
    EJQM003: "Doppler veineux MI", DZQM005: "Échocardio.",
  };
  const ORDRE = ["exploration", "echographie", "suture", "immobilisation", "reduction", "abces", "corps_etranger", "orl", "ponction", "urologie", "ongle", "brulure"];
  const NOM = { exploration: "Explorations", echographie: "Échographies", suture: "Sutures", immobilisation: "Immobilisations", reduction: "Réductions", abces: "Abcès", corps_etranger: "Corps étrangers", orl: "ORL", ponction: "Ponctions", urologie: "Uro", ongle: "Ongle", brulure: "Brûlures" };

  const etat = { jour: "semaine", urgence: false, age: "16-44", arrivee: "autre", ccmu: 2, hospitalise: false, actes: new Set(), famille: "exploration", choisie: null, etab: new Set() };
  let dernier = null;

  // --- Groupes de puces exclusives
  function groupe(id, cle, conv) {
    const c = document.getElementById(id);
    c.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      c.querySelectorAll("button").forEach((x) => x.classList.toggle("actif", x === b));
      etat[cle] = conv ? conv(b.dataset.v) : b.dataset.v;
      etat.choisie = null;
      calculer();
    });
  }
  groupe("jour", "jour"); groupe("age", "age"); groupe("arrivee", "arrivee");
  groupe("ccmu", "ccmu", Number); groupe("hospitalise", "hospitalise", (v) => v === "true"); groupe("urgence", "urgence", (v) => v === "true");
  // Cadran établissement : puces à bascule, plusieurs possibles
  $("#etab").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (etat.etab.has(b.dataset.v)) etat.etab.delete(b.dataset.v); else etat.etab.add(b.dataset.v);
    b.classList.toggle("actif", etat.etab.has(b.dataset.v));
    calculer();
  });
  $("#info-art14").addEventListener("click", (e) => { e.stopPropagation(); $("#texte-art14").classList.toggle("cache"); });

  // --- Heures et date
  const maintenant = new Date();
  const hh = (d) => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  $("#heureActe").value = hh(maintenant); $("#heureAppel").value = hh(maintenant);
  $("#date").value = [maintenant.getFullYear(), String(maintenant.getMonth() + 1).padStart(2, "0"), String(maintenant.getDate()).padStart(2, "0")].join("-");
  function jourDepuisDate() {
    const j = new Date($("#date").value + "T12:00:00").getDay();
    const v = j === 0 ? "dimanche" : j === 6 ? "samedi" : "semaine";
    if (etat.jour !== "ferie") { etat.jour = v; document.querySelectorAll("#jour button").forEach((b) => b.classList.toggle("actif", b.dataset.v === v)); }
  }
  // Tout changement de saisie annule un choix manuel de voie (le contexte n'est plus le même).
  $("#date").addEventListener("change", () => { jourDepuisDate(); etat.choisie = null; calculer(); });
  ["#heureActe", "#heureAppel"].forEach((s) => $(s).addEventListener("change", () => { etat.choisie = null; calculer(); }));
  jourDepuisDate();

  // --- Actes : une famille affichée à la fois, les actes cochés restent visibles
  const parFamille = {};
  R.actes_ccam.forEach((a) => { (parFamille[a.famille] = parFamille[a.famille] || []).push(a); });
  const familles = ORDRE.filter((f) => parFamille[f]).concat(Object.keys(parFamille).filter((f) => !ORDRE.includes(f)));
  function rendreFamilles() {
    $("#familles").innerHTML = familles.map((f) => {
      const n = parFamille[f].filter((a) => etat.actes.has(a.code)).length;
      return `<button data-f="${f}" class="${f === etat.famille ? "actif" : ""}">${NOM[f] || f}${n ? " (" + n + ")" : ""}</button>`;
    }).join("");
  }
  function rendreActes() {
    const liste = parFamille[etat.famille] || [];
    const coches = R.actes_ccam.filter((a) => etat.actes.has(a.code) && a.famille !== etat.famille);
    $("#actes").innerHTML = coches.concat(liste).map((a) => `<button data-code="${a.code}" class="${etat.actes.has(a.code) ? "actif" : ""}" title="${ech(a.libelle)}">${ech(COURT[a.code] || a.libelle)}<span class="prix">${moteur.euros(a.montant)}</span></button>`).join("");
  }
  $("#familles").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; etat.famille = b.dataset.f; rendreFamilles(); rendreActes(); });
  $("#actes").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (etat.actes.has(b.dataset.code)) etat.actes.delete(b.dataset.code); else etat.actes.add(b.dataset.code);
    etat.choisie = null; rendreFamilles(); rendreActes(); calculer();
  });
  rendreFamilles(); rendreActes();

  // --- Calcul et affichage
  function contexte() {
    return {
      date: new Date($("#date").value + "T12:00:00").toLocaleDateString("fr-FR"),
      heureActe: $("#heureActe").value || "12:00", heureAppel: $("#heureAppel").value || $("#heureActe").value || "12:00",
      jour: etat.jour, age: etat.age, arrivee: etat.arrivee, urgence: etat.urgence, ccmu: etat.ccmu, hospitalise: etat.hospitalise,
      actes: Array.from(etat.actes),
      biologie: etat.etab.has("biologie"), imagerie: etat.etab.has("imagerie"), avis_specialiste: etat.etab.has("avis_specialiste"),
    };
  }
  function tableLignes(v) {
    return `<table class="lignes">${v.lignes.map((l) => `<tr><td class="code">${l.code}</td><td>${ech(l.libelle)}${l.note ? `<span class="note">${ech(l.note)}</span>` : ""}</td><td class="montant">${moteur.euros(l.montant)}</td></tr>`).join("")}</table>` +
      v.exclus.map((x) => `<p class="exclu">${x.code} non facturé : ${ech(x.motif)}</p>`).join("");
  }
  function calculer() {
    dernier = moteur.calculer(contexte());
    const r = dernier;
    const rec = r.voies.find((v) => v.id === r.retenue);
    const ret = r.voies.find((v) => v.id === (etat.choisie || r.retenue));
    const manuel = ret.id !== rec.id;
    const nbAlertes = r.avertissements.length + (manuel && r.contexte.hospitalise && r.contexte.ccmu >= 3 && ret.id !== "B" ? 1 : 0);
    $("#resume").innerHTML = `<div><div class="nom">${ech(ret.nom.replace(/ \(.*\)$/, ""))}${nbAlertes ? ` <span class="manuel">⚠ ${nbAlertes}</span>` : ""}</div>${manuel ? `<div class="manuel">Choix manuel — recommandé : ${ech(rec.nom)} ${moteur.euros(rec.total)} €</div>` : ""}</div><div class="total">${moteur.euros(ret.total)} €</div>`;
    const chips = (codes) => codes.map((k) => `<span class="c">${ech(k)}</span>`).join("");
    const etabTxt = r.etablissement.length ? `<div class="etab">Établissement : ${chips(r.etablissement.map((e) => e.code))} <small>(facturé par la clinique, indicatif)</small></div>` : (r.contexte.hospitalise ? `<div class="etab"><small>Hospitalisé : pas de forfait âge ni de supplément d'urgence pour l'établissement (GHS).</small></div>` : "");
    $("#codes").innerHTML = `<div>Codes : ${chips(ret.lignes.map((l) => l.code + (l.taux && l.taux !== 100 ? " " + l.taux + " %" : "")))}</div>${etabTxt}`;
    const NOM_COURT = { A: "Consultation", B: "Hospitalisation", C: "Actes CCAM" };
    $("#voies").innerHTML = r.voies.map((v) => `<button data-voie="${v.id}" class="${v.id === ret.id ? "retenue" : ""} ${v.id === rec.id ? "recommandee" : ""}" ${v.disponible ? "" : "disabled"} title="${ech(v.disponible ? v.nom : v.motif || "")}">${NOM_COURT[v.id]}<span class="m">${v.disponible ? moteur.euros(v.total) + " €" : "—"}</span></button>`).join("");
    const detail = $("#detail") || Object.assign(document.createElement("div"), { id: "detail" });
    detail.innerHTML = tableLignes(ret) + ret.avertissements.map((a) => `<p class="aide">${ech(a)}</p>`).join("");
    $("#voies").after(detail);
    const infos = (R.informations || []).filter((i) => (i.id === "FPU" && !r.contexte.hospitalise) || (i.id === "GHS" && r.contexte.hospitalise));
    const alertes = r.avertissements.slice();
    if (manuel && r.contexte.hospitalise && r.contexte.ccmu >= 3 && ret.id !== "B") {
      alertes.push(`Voie ${ret.id === "A" ? "consultation" : "actes CCAM"} retenue manuellement pour un patient hospitalisé CCMU ${r.contexte.ccmu} : la substitution à ${r.contexte.ccmu >= 4 ? "U45" : "U03"} est une interprétation à confirmer (R8).`);
    }
    $("#alertes").innerHTML = alertes.map((a) => `<p>⚠ ${ech(a)}</p>`).join("") + infos.map((i) => `<p class="info-p">ℹ ${ech(i.enonce)}</p>`).join("");
    $("#transmission").value = moteur.transmission(r.contexte, ret, { recommandee: rec, etablissement: r.etablissement });
  }
  $("#voies").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-voie]"); if (!b || b.disabled || !dernier) return;
    etat.choisie = b.dataset.voie === dernier.retenue ? null : b.dataset.voie;
    calculer();
  });
  // Le bandeau de résultat est replié par défaut ; un appui sur le résumé ouvre le détail.
  $("#resume").addEventListener("click", () => $("#resultat").classList.toggle("ouvert"));
  $("#transmettre").addEventListener("click", () => { $("#bloc-transmission").classList.toggle("cache"); $("#transmission").scrollIntoView({ block: "nearest" }); });
  $("#copier").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#transmission").value); $("#copier").textContent = "Copié"; setTimeout(() => ($("#copier").textContent = "Copier"), 1500); }
    catch (e) { $("#transmission").select(); document.execCommand && document.execCommand("copy"); }
  });
  $("#partager").addEventListener("click", async () => {
    const texte = $("#transmission").value;
    if (navigator.share) { try { await navigator.share({ text: texte }); } catch (e) { /* annulé */ } }
    else { $("#copier").click(); alert("Partage non disponible sur cet appareil : texte copié."); }
  });

  // --- Références (repliées)
  function rendreReferences() {
    const m = R.meta;
    const src = Object.entries(m.sources).map(([k, v]) => `<dt>${ech(k)}</dt><dd>${ech(v)}</dd>`).join("");
    const regles = (R.regles || []).map((r) => `<dt>${ech(r.id)}${r.a_confirmer ? " (à confirmer)" : ""}</dt><dd>${ech(r.enonce)}<br><em>${ech(r.article || "")}</em></dd>`).join("");
    const aConfirmer = [].concat(R.majorations_ngap, R.modificateurs_ccam).filter((e) => e.a_confirmer || e.actif === false).map((e) => `<li>${e.code} : ${ech(e.note || e.libelle)}${e.actif === false ? " — inactif" : ""}</li>`).join("");
    $("#bloc-references").innerHTML = `<div class="carte"><strong>Base de règles</strong> v${ech(m.version)}, vérifiée le ${ech(m.verifie_le)}. Profil : ${ech(m.profil.qualification)}, secteur ${m.profil.secteur}, ${ech(m.profil.territoire)}.</div>
      <div class="carte"><strong>Règles de cumul</strong><dl>${regles}</dl></div>
      <div class="carte"><strong>Points à confirmer</strong><ul>${aConfirmer}</ul><p class="aide">Les 57 tarifs CCAM proviennent d'une source secondaire (V84) : vérification sur la base ameli à faire.</p></div>
      <div class="carte"><strong>Sources</strong><dl>${src}</dl></div>`;
  }
  rendreReferences();
  $("#references").addEventListener("click", () => { const b = $("#bloc-references"); b.classList.toggle("cache"); if (!b.classList.contains("cache")) b.scrollIntoView({ block: "start" }); });
  $("#version").textContent = "Règles v" + R.meta.version;

  calculer();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
