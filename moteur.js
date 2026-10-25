// moteur.js — calcul des voies de cotation. Code pur : aucune dépendance au
// navigateur, utilisable aussi dans Node pour les tests.
//
// Entrée (contexte) :
//   heureActe  "HH:MM"   heure de réalisation (par défaut : heure d'arrivée)
//   heureAppel "HH:MM"   heure d'appel/arrivée (sert à la condition 19 h–7 h)
//   jour       "semaine" | "samedi" | "dimanche" | "ferie"
//   age        "<4m" | "<6" | "6-15" | "16-44" | "45-74" | ">75"  (">75" = 75 ans et plus)
//   biologie, imagerie, avis_specialiste  bool — pour les suppléments de l'établissement
//   arrivee    "ambulance" | "samu" | "autre"
//   urgence    bool — situation d'urgence au sens de l'art. 14 NGAP
//   ccmu       1..5
//   hospitalise bool (UHCD comprise)
//   actes      [codes CCAM cochés]
//
// Sortie : { voies: [...], retenue: id, avertissements: [...], transmission }
(function (racine) {
  "use strict";

  const arrondi = (x) => Math.round(x * 100 + 1e-9) / 100;
  const euros = (x) => arrondi(x).toFixed(2).replace(".", ",");

  function minutes(hhmm) {
    const [h, m] = String(hhmm).split(":").map(Number);
    return h * 60 + (m || 0);
  }
  // Plage "20:00-24:00" ou traversant minuit "19:00-07:00". Borne haute exclue.
  function dansPlage(hhmm, plage) {
    const [a, b] = plage.split("-");
    const t = minutes(hhmm), ta = minutes(a), tb = minutes(b);
    return ta <= tb ? t >= ta && t < tb : t >= ta || t < tb;
  }
  const dansPlages = (hhmm, plages) => plages.some((p) => dansPlage(hhmm, p));

  // Une majoration/un modificateur est-il applicable dans ce contexte ?
  function applicable(entree, ctx) {
    const c = entree.conditions || {};
    if (c.plages_acte && !dansPlages(ctx.heureActe, c.plages_acte)) return false;
    if (c.appel_entre && !dansPlage(ctx.heureAppel || ctx.heureActe, c.appel_entre)) return false;
    if (c.urgence_art14 && !ctx.urgence) return false;
    if (c.urgence && !ctx.urgence) return false;
    if (c.jour && !c.jour.includes(ctx.jour)) return false;
    if (c.age_max_ans_exclu !== undefined && !["<4m", "<6"].includes(ctx.age)) return false;
    if (c.age_min_ans_exclu !== undefined && ctx.age !== ">75") return false;
    if (c.arrivee && !c.arrivee.includes(ctx.arrivee)) return false;
    if (c.hospitalise !== undefined && Boolean(ctx.hospitalise) !== c.hospitalise) return false;
    if (c.ccmu && !c.ccmu.includes(ctx.ccmu)) return false;
    if (c.ages && !c.ages.includes(ctx.age)) return false;
    if (c.biologie && !ctx.biologie) return false;
    if (c.imagerie && !ctx.imagerie) return false;
    if (c.avis_specialiste && !ctx.avis_specialiste) return false;
    if (c.creneaux && !c.creneaux.some((k) => k.jour.includes(ctx.jour) && dansPlages(ctx.heureActe, k.plages))) return false;
    return true;
  }

  // Parmi des entrées exclusives entre elles, garde la plus élevée.
  function meilleure(entrees, ctx) {
    const ok = entrees.filter((e) => e.actif !== false && applicable(e, ctx));
    if (!ok.length) return { choix: null, concurrentes: [] };
    ok.sort((a, b) => b.montant - a.montant);
    return { choix: ok[0], concurrentes: ok.slice(1) };
  }

  function ligne(code, libelle, montant, opts) {
    return Object.assign({ code, libelle, montant: arrondi(montant), taux: 100 }, opts || {});
  }

  function Moteur(regles) {
    const R = regles;
    const parCode = {};
    R.actes_ccam.forEach((a) => (parCode[a.code] = a));
    const cons = {};
    R.consultations.forEach((c) => (cons[c.code] = c));
    const majNgap = {};
    R.majorations_ngap.forEach((m) => (majNgap[m.code] = m));
    const modif = {};
    R.modificateurs_ccam.forEach((m) => (modif[m.code] = m));
    const regleParId = {};
    (R.regles || []).forEach((r) => (regleParId[r.id] = r));
    const horairesNgap = ["MN", "MM", "F"].map((c) => majNgap[c]).filter(Boolean);
    const horairesCcam = ["P", "S", "F"].map((c) => modif[c]).filter(Boolean);
    const ECG = "DEQP003";

    // Majoration horaire NGAP (MN / MM / F) : une seule, la plus élevée.
    function majorationHoraire(ctx, avert) {
      const { choix, concurrentes } = meilleure(horairesNgap, ctx);
      if (!choix) return null;
      if (concurrentes.length) {
        avert.push(`${choix.code} retenue plutôt que ${concurrentes.map((c) => c.code).join(", ")} (exclusivité nuit/dimanche, à confirmer).`);
      }
      const note = choix.conditions.jour ? "dimanche ou férié, urgence art. 14" : `appel ${ctx.heureAppel || ctx.heureActe}, acte ${ctx.heureActe}, urgence art. 14`;
      return ligne(choix.code, choix.libelle, choix.montant, { note, regle: choix.article });
    }

    function majorationsPatient(base, ctx, avert) {
      const out = [];
      const meg = majNgap.MEG;
      if (meg && applicable(meg, ctx)) out.push(ligne("MEG", meg.libelle, meg.montant, { regle: meg.article }));
      const mvu = majNgap.MVU;
      if (mvu && mvu.actif !== false && applicable(mvu, ctx) && (mvu.s_applique_a || []).includes(base)) {
        out.push(ligne("MVU", mvu.libelle, mvu.montant, { regle: mvu.article }));
        if (mvu.a_confirmer && base === "G") avert.push("MVU appliquée à G (CCMU 1-2) : à confirmer (art. 22-1).");
      }
      return out;
    }

    // Voie « consultation » : base G (ou U03/U45 si fournie), + majorations,
    // + ECG à 100 %, + annexe 22 (G seulement, 2 actes max, 100 % / 50 %).
    function voieConsultation(id, nom, baseCode, ctx) {
      const avert = [];
      const base = cons[baseCode];
      const lignes = [ligne(base.code, base.libelle, base.montant, { regle: base.article })];
      const mh = majorationHoraire(ctx, avert);
      if (mh) lignes.push(mh);
      lignes.push(...majorationsPatient(baseCode, ctx, avert));
      const exclus = [];
      const actes = ctx.actes.map((c) => parCode[c]).filter(Boolean);
      let annexe = 0;
      actes
        .slice()
        .sort((a, b) => b.montant - a.montant)
        .forEach((a) => {
          if (a.code === ECG) {
            lignes.push(ligne(a.code, a.libelle, a.montant, { note: "cumul à 100 % (R2)", regle: "CCAM III-3 A ; NGAP 22-1" }));
          } else if (a.annexe22 && baseCode === "G" && annexe < 2) {
            const taux = annexe === 0 ? 100 : 50;
            lignes.push(ligne(a.code, a.libelle, (a.montant * taux) / 100, { taux, note: `annexe 22, ${taux} % (R3)`, regle: "convention art. 83, annexe 22" }));
            annexe += 1;
          } else {
            exclus.push({ code: a.code, motif: baseCode === "G" ? "non cumulable avec la consultation (R1)" : `exclu par ${baseCode} (R5)` });
          }
        });
      const total = arrondi(lignes.reduce((s, l) => s + l.montant, 0));
      return { id, nom, disponible: true, lignes, exclus, total, avertissements: avert };
    }

    // Voie « actes CCAM » : actes triés, 100 % / 50 % / 0 %, un modificateur
    // d'urgence au plus par séance, consultation non facturée.
    function voieActes(ctx) {
      const avert = [];
      const actes = ctx.actes.map((c) => parCode[c]).filter(Boolean).sort((a, b) => b.montant - a.montant);
      if (!actes.length) return { id: "C", nom: "Actes CCAM seuls", disponible: false, lignes: [], exclus: [], total: 0, avertissements: [], motif: "aucun acte CCAM coché" };
      const lignes = [];
      const exclus = [];
      actes.forEach((a, i) => {
        const taux = i === 0 ? 100 : i === 1 ? 50 : 0;
        if (taux === 0) exclus.push({ code: a.code, motif: "3e acte et suivants à 0 % (R4)" });
        else lignes.push(ligne(a.code, a.libelle, (a.montant * taux) / 100, { taux, note: taux === 50 ? "2e acte à 50 % (R4)" : undefined, regle: "CCAM III-3 B" }));
      });
      // Modificateur horaire : le plus élevé applicable, posé une fois, sur le
      // premier acte facturé qui l'admet.
      const { choix, concurrentes } = meilleure(horairesCcam, ctx);
      if (choix) {
        const porteur = actes.slice(0, 2).find((a) => (a.modif || []).includes(choix.code));
        if (porteur) {
          lignes.push(ligne(choix.code, choix.libelle, choix.montant, { note: `sur ${porteur.code}, une fois par séance (R7)`, regle: choix.article }));
          if (choix.a_confirmer) avert.push(`Modificateur ${choix.code} : montant et règle « une fois par séance » à confirmer sur le livre III.`);
          if (concurrentes.length) avert.push(`${choix.code} retenu plutôt que ${concurrentes.map((c) => c.code).join(", ")} (modificateurs exclusifs).`);
        } else {
          avert.push(`Modificateur ${choix.code} applicable mais aucun acte facturé ne l'admet.`);
        }
      }
      const m = modif.M;
      if (m && m.actif === false && ctx.urgence && actes.some((a) => (a.modif || []).includes("M"))) {
        avert.push("Modificateur M (26,88 €) non appliqué : usage en établissement non confirmé.");
      }
      const total = arrondi(lignes.reduce((s, l) => s + l.montant, 0));
      return { id: "C", nom: "Actes CCAM seuls", disponible: true, lignes, exclus, total, avertissements: avert };
    }

    function calculer(ctxIn) {
      const ctx = Object.assign({ actes: [], arrivee: "autre", age: "16-44", jour: "semaine", urgence: false, hospitalise: false, ccmu: 1 }, ctxIn);
      ctx.heureActe = ctx.heureActe || ctx.heureAppel || "12:00";
      ctx.heureAppel = ctx.heureAppel || ctx.heureActe;
      ctx.actes = Array.from(new Set(ctx.actes));

      const voies = [];
      voies.push(voieConsultation("A", "Consultation (retour à domicile ou hospitalisé)", "G", ctx));
      if (ctx.hospitalise) {
        const baseB = ctx.ccmu >= 4 ? "U45" : ctx.ccmu === 3 ? "U03" : "G";
        const vb = voieConsultation("B", "Hospitalisation (art. 22-1)", baseB, ctx);
        voies.push(vb);
      } else {
        voies.push({ id: "B", nom: "Hospitalisation (art. 22-1)", disponible: false, lignes: [], exclus: [], total: 0, avertissements: [], motif: "patient non hospitalisé" });
      }
      voies.push(voieActes(ctx));

      const dispo = voies.filter((v) => v.disponible);
      let retenue = dispo[0];
      dispo.forEach((v) => { if (v.total > retenue.total + 1e-9) retenue = v; });
      // À montant égal, A et B : préférer B si hospitalisé (c'est la voie prévue par le texte).
      const vb = voies.find((v) => v.id === "B");
      if (vb.disponible && Math.abs(vb.total - retenue.total) < 1e-9 && retenue.id === "A") retenue = vb;

      const avert = [];
      if (ctx.hospitalise && retenue.id === "C") avert.push("Patient hospitalisé : facturer l'acte CCAM à la place de la consultation (R8) est une interprétation à confirmer.");
      if (ctx.hospitalise && ctx.ccmu >= 3 && retenue.id === "A") avert.push("Patient hospitalisé CCMU " + ctx.ccmu + " : facturer G + acte annexe 22 à la place de " + (ctx.ccmu >= 4 ? "U45" : "U03") + " n'est couvert par aucune règle sourcée (R3 exclut U03/U45) : interprétation à confirmer, comme R8.");
      if (R.actes_ccam.some((a) => a.verif_ameli === false) && ctx.actes.length) avert.push("Tarifs CCAM relevés sur une source secondaire (V84) : vérification ameli non faite.");
      const ageBase = joursDepuis(R.meta.verifie_le);
      if (ageBase > (R.meta.alerte_apres_jours || 180)) avert.push(`Base de règles vérifiée il y a ${ageBase} jours : à mettre à jour.`);
      ctx.actes.forEach((c) => { const a = parCode[c]; if (a && a.a_confirmer) avert.push(`${a.code} : ${a.note || "usage à confirmer"}.`); });

      const etab = etablissement(ctx);
      return { contexte: ctx, voies, retenue: retenue.id, avertissements: avert, etablissement: etab, transmission: transmission(ctx, retenue, R, { etablissement: etab }) };
    }

    // Forfaits et suppléments facturés par l'établissement (indicatif, sans montant),
    // uniquement pour un passage non suivi d'hospitalisation.
    function etablissement(ctx) {
      const E = R.etablissement;
      if (!E || ctx.hospitalise) return [];
      const out = [];
      const fu = (E.forfaits_age || []).find((f) => f.ages.includes(ctx.age));
      if (!fu) return [];   // aucun supplément sans forfait âge (condition générale)
      out.push({ code: fu.code, libelle: fu.libelle });
      const sup = (E.supplements || []).filter((x) => applicable(x, ctx));
      // SUN et SUF exclusifs : SUN prime (nuit profonde)
      const codes = sup.map((x) => x.code);
      sup.forEach((x) => {
        if (x.exclusif_avec && x.exclusif_avec.some((e) => codes.includes(e)) && x.code === "SUF") return;
        out.push({ code: x.code + (x.incertain ? " ?" : ""), libelle: x.libelle });
      });
      return out;
    }

    function joursDepuis(iso) {
      if (!iso) return 0;
      const d = new Date(iso + "T00:00:00");
      return Math.floor((Date.now() - d.getTime()) / 86400000);
    }

    // Texte de transmission pour une voie donnée. `opts.recommandee` : la voie
    // que le moteur recommandait, si le médecin en a retenu une autre (choix manuel).
    function transmission(ctx, voie, R, opts) {
      const o = opts || {};
      const date = ctx.date || new Date().toLocaleDateString("fr-FR");
      const entete = [
        `Passage ${date} ${ctx.heureActe}`,
        ctx.hospitalise ? "hospitalisé" : "retour à domicile",
        `CCMU ${ctx.ccmu}`,
        "tarif opposable",
      ].join(" — ");
      const larg = Math.max(...voie.lignes.map((l) => l.code.length), 7);
      const corps = voie.lignes.map((l) => {
        const taux = l.taux && l.taux !== 100 ? ` (${l.taux} %)` : "";
        return `${l.code.padEnd(larg)}  ${euros(l.montant).padStart(7)}${taux}${l.note ? "  — " + l.note : ""}`;
      });
      corps.push(`${"Total".padEnd(larg)}  ${euros(voie.total).padStart(7)} €`);
      const pied = [`Règles v${R.meta.version} — ${voie.nom}`];
      if (o.etablissement && o.etablissement.length) pied.unshift(`Établissement (indicatif, facturé par la clinique) : ${o.etablissement.map((e) => e.code).join(" · ")}`);
      if (o.recommandee && o.recommandee.id !== voie.id) {
        pied.unshift(`Choix manuel — recommandation du moteur : ${o.recommandee.nom} (${euros(o.recommandee.total)} €)`);
      }
      return [entete, ...corps, ...pied].join("\n");
    }

    return { calculer, applicable, dansPlage, arrondi, euros, regles: R, etablissement,
      transmission: (ctx, voie, opts) => transmission(ctx, voie, R, opts) };
  }

  racine.Moteur = Moteur;
  if (typeof module !== "undefined" && module.exports) module.exports = Moteur;
})(typeof window !== "undefined" ? window : globalThis);
