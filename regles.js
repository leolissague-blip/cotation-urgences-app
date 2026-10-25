// Fichier généré par scripts/01_convertir_regles.py — ne pas éditer.
// Source : regles-cotation.yaml
window.REGLES = {
 "meta": {
  "version": "2026-10-24",
  "verifie_le": "2026-10-24",
  "alerte_apres_jours": 180,
  "profil": {
   "qualification": "medecine_generale",
   "secteur": 1,
   "territoire": "metropole",
   "exercice": "service_urgence_prive_autorise_ARS"
  },
  "sources": {
   "ngap": "NGAP version en vigueur du 01/09/2026 — https://www.ameli.fr/sites/default/files/Documents/NGAP%2001.09.2026%20VF.pdf",
   "tarifs": "Tarifs conventionnels ameli, mise à jour 17/03/2026 — https://www.ameli.fr/medecin/exercice-liberal/facturation-remuneration/consultations-actes/tarifs/tarifs-conventionnels-medecins-generalistes-specialistes",
   "uncam2024": "Décision UNCAM du 29/10/2024, art. 7 (JO 30/11/2024) — https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000050685633",
   "ccam": "CCAM V84, tarifs relevés sur medcode.fr (extraction 25/09/2026), recoupés iccam.fr ; vérification ameli à faire",
   "mgfrance": "Plaquette MG France 2026 — https://www.mgfrance.org/images/telechargements/MGFrance_Plaquette_Metro_2026.pdf",
   "snmr": "SNMR, cumul consultation + acte technique (circ. CIR-14/2025 màj 20/02/2026) — https://snmr.org/cotation-consultation-acte-technique/",
   "fpu": "Arrêté du 27/02/2026 (JO 28/02/2026), FPU au 01/03/2026 — https://www.fhf.fr/expertises/finances/budget-eprd/forfait-patient-urgences-fpu-au-1er-mars-2026",
   "etablissement": "Forfaits et suppléments des structures d'urgence : arrêté du 27/12/2021 (JO 29/12/2021) — https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044592184 ; arrêté du 31/03/2023, art. 9 (FU0, PE1, PE2) — https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000047399060 ; FHF, « Urgences : facturation des soins (ex forfaits âge) », màj 26/09/2023 — https://www.fhf.fr/expertises/finances/reforme-du-mode-de-financement-de-lhospitalisation-tarification-lactivite/urgences-facturation-des-soins-ex-forfaits-age"
  }
 },
 "consultations": [
  {
   "code": "G",
   "libelle": "Consultation de référence du médecin généraliste",
   "montant": 30.0,
   "conditions": {},
   "cumul_autorise": [
    "MN",
    "MM",
    "F",
    "MEG",
    "MVU",
    "DEQP003",
    "ANNEXE22"
   ],
   "source": "tarifs",
   "article": "NGAP art. 2 ; convention 2024-2029",
   "valide_depuis": "2024-12-22"
  },
  {
   "code": "U03",
   "libelle": "Consultation du médecin urgentiste, CCMU 3, passage suivi d'hospitalisation",
   "montant": 40.0,
   "conditions": {
    "hospitalise": true,
    "ccmu": [
     3
    ],
    "tarif_opposable": true,
    "compte_rendu_dossier_urgences": true
   },
   "cumul_autorise": [
    "MN",
    "MM",
    "F",
    "MEG",
    "MVU",
    "DEQP003"
   ],
   "cumul_interdit": [
    "tout autre acte réalisé dans le même temps",
    "majorations PDSA art. 22-3"
   ],
   "source": "uncam2024",
   "article": "NGAP art. 22-1",
   "valide_depuis": "2024-11-30"
  },
  {
   "code": "U45",
   "libelle": "Consultation du médecin urgentiste, CCMU 4 ou 5, passage suivi d'hospitalisation",
   "montant": 50.0,
   "conditions": {
    "hospitalise": true,
    "ccmu": [
     4,
     5
    ],
    "tarif_opposable": true,
    "compte_rendu_dossier_urgences": true
   },
   "cumul_autorise": [
    "MN",
    "MM",
    "F",
    "MEG",
    "MVU",
    "DEQP003"
   ],
   "cumul_interdit": [
    "tout autre acte réalisé dans le même temps",
    "majorations PDSA art. 22-3"
   ],
   "source": "uncam2024",
   "article": "NGAP art. 22-1",
   "valide_depuis": "2024-11-30"
  }
 ],
 "majorations_ngap": [
  {
   "code": "MN",
   "libelle": "Majoration de nuit, 20 h–0 h et 6 h–8 h (généraliste)",
   "montant": 35.0,
   "conditions": {
    "plages_acte": [
     "20:00-24:00",
     "06:00-08:00"
    ],
    "appel_entre": "19:00-07:00",
    "urgence_art14": true
   },
   "exclusif_avec": [
    "MM",
    "F"
   ],
   "a_confirmer": false,
   "source": "tarifs",
   "article": "NGAP art. 14 (modifié décision UNCAM 29/10/24)",
   "valide_depuis": "2024-11-30"
  },
  {
   "code": "MM",
   "libelle": "Majoration de milieu de nuit, 0 h–6 h (généraliste)",
   "montant": 40.0,
   "conditions": {
    "plages_acte": [
     "00:00-06:00"
    ],
    "appel_entre": "19:00-07:00",
    "urgence_art14": true
   },
   "exclusif_avec": [
    "MN",
    "F"
   ],
   "source": "tarifs",
   "article": "NGAP art. 14",
   "valide_depuis": "2024-11-30"
  },
  {
   "code": "F",
   "libelle": "Majoration dimanche et jour férié (consultation)",
   "montant": 19.06,
   "conditions": {
    "jour": [
     "dimanche",
     "ferie"
    ],
    "urgence_art14": true
   },
   "exclusif_avec": [
    "MN",
    "MM"
   ],
   "note": "Si nuit ET dimanche : la règle d'exclusivité et le choix de la plus élevée sont à confirmer (a_confirmer).",
   "a_confirmer": true,
   "source": "tarifs",
   "article": "NGAP art. 14",
   "valide_depuis": "2024-11-30"
  },
  {
   "code": "MEG",
   "libelle": "Majoration enfant jusqu'à 6 ans (généraliste)",
   "montant": 5.0,
   "conditions": {
    "age_max_ans_exclu": 6
   },
   "source": "tarifs",
   "article": "NGAP art. 14.7 ; art. 22-1 (ouvre droit)",
   "valide_depuis": "2024-12-22"
  },
  {
   "code": "MVU",
   "libelle": "Majoration patient > 75 ans arrivé en ambulance ou avec le SAMU, hospitalisé",
   "montant": 20.0,
   "conditions": {
    "age_min_ans_exclu": 75,
    "arrivee": [
     "ambulance",
     "samu"
    ],
    "hospitalise": true
   },
   "s_applique_a": [
    "G",
    "U03",
    "U45"
   ],
   "note": "Le texte vise « ces consultations du médecin urgentiste » : application à G (CCMU 1-2) à confirmer.",
   "a_confirmer": true,
   "source": "uncam2024",
   "article": "NGAP art. 22-1",
   "valide_depuis": "2024-11-30"
  }
 ],
 "modificateurs_ccam": [
  {
   "code": "P",
   "libelle": "Acte en urgence, 20 h–0 h, par un généraliste",
   "montant": 35.0,
   "conditions": {
    "plages_acte": [
     "20:00-24:00"
    ],
    "urgence": true
   },
   "exclusif_avec": [
    "S",
    "F"
   ],
   "une_fois_par_seance": true,
   "a_confirmer": true,
   "source": "mgfrance",
   "article": "CCAM livre III, art. III-2 / chap. 19.03",
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "S",
   "libelle": "Acte en urgence, 0 h–8 h, par un généraliste",
   "montant": 40.0,
   "conditions": {
    "plages_acte": [
     "00:00-08:00"
    ],
    "urgence": true
   },
   "exclusif_avec": [
    "P",
    "F"
   ],
   "une_fois_par_seance": true,
   "a_confirmer": true,
   "source": "mgfrance",
   "article": "CCAM livre III, art. III-2 / chap. 19.03",
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "F",
   "libelle": "Acte en urgence, dimanche ou jour férié",
   "montant": 19.06,
   "conditions": {
    "jour": [
     "dimanche",
     "ferie"
    ],
    "urgence": true
   },
   "exclusif_avec": [
    "P",
    "S"
   ],
   "une_fois_par_seance": true,
   "a_confirmer": true,
   "source": "mgfrance",
   "article": "CCAM livre III, art. III-2 / chap. 19.03",
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "M",
   "libelle": "Majoration forfaitaire d'urgence du généraliste (liste d'actes), cumulable avec P/S/F",
   "montant": 26.88,
   "conditions": {
    "urgence": true,
    "acte_admet_M": true
   },
   "actif": false,
   "a_confirmer": true,
   "source": "mgfrance",
   "article": "CCAM livre III, art. III-2",
   "valide_depuis": "2026-01-01"
  }
 ],
 "regles": [
  {
   "id": "R1_consultation_vs_acte",
   "enonce": "Les honoraires de la consultation ne se cumulent pas avec ceux d'autres actes de la même séance ; seul l'acte le plus élevé est facturé, sauf exceptions.",
   "exceptions": [
    "DEQP003",
    "ANNEXE22"
   ],
   "source": "ngap",
   "article": "NGAP art. 11 A ; CCAM art. III-3 A"
  },
  {
   "id": "R2_ecg",
   "enonce": "L'ECG (DEQP003) se cumule à 100 % avec G, U03 et U45.",
   "source": "uncam2024",
   "article": "CCAM art. III-3 A (à 100 % depuis le 22/12/2024) ; NGAP art. 22-1"
  },
  {
   "id": "R3_annexe22",
   "enonce": "Depuis le 01/01/2026, G à tarif opposable se cumule à 100 % avec au plus deux actes de la liste fermée annexe 22 (ponctions et injections articulaires sans guidage : NZHB002, MZHB002, NZJB001, MZJB001, LHLB001, NZLB001, MZLB001). Pas avec U03/U45. Majorations nuit/férié art. 14 compatibles.",
   "source": "snmr",
   "article": "Convention 2024-2029 art. 83, annexe 22 ; LAP art. III-3"
  },
  {
   "id": "R4_association_ccam",
   "enonce": "Plusieurs actes CCAM dans la même séance : le plus cher à 100 %, le second à 50 %, les suivants à 0 %. Les modificateurs s'ajoutent après application du taux.",
   "source": "snmr",
   "article": "CCAM art. III-3 B"
  },
  {
   "id": "R5_u03_u45_exclusifs",
   "enonce": "U03 et U45 excluent tout autre acte du même temps, sauf l'ECG.",
   "source": "uncam2024",
   "article": "NGAP art. 22-1"
  },
  {
   "id": "R6_majorations_non_croisees",
   "enonce": "Les majorations NGAP ne s'appliquent pas aux actes CCAM, et les modificateurs CCAM ne s'appliquent pas aux actes NGAP.",
   "source": "ngap",
   "article": "NGAP art. 11 A"
  },
  {
   "id": "R7_une_majoration_urgence",
   "enonce": "Une seule majoration d'urgence horaire par séance (MN/MM/F côté NGAP, ou P/S/F côté CCAM), jamais les deux.",
   "a_confirmer": true,
   "source": "mgfrance",
   "article": "CCAM chap. 19.03 (modificateurs exclusifs) ; NGAP art. 14"
  },
  {
   "id": "R8_hospitalisation_choix_voie",
   "enonce": "Patient hospitalisé : la consultation est valorisée G/U03/U45 selon la CCMU. Facturer à la place un acte CCAM plus élevé (sans consultation) reste possible au titre de l'art. 11 A : interprétation à confirmer.",
   "a_confirmer": true,
   "source": "ngap",
   "article": "NGAP art. 22-1 et 11 A"
  },
  {
   "id": "R9_pds_exclue",
   "enonce": "Pas de majorations de permanence des soins ambulatoires (art. 22-3) pour l'activité en service d'urgence.",
   "source": "ngap",
   "article": "NGAP art. 22-1"
  }
 ],
 "informations": [
  {
   "id": "FPU",
   "enonce": "Forfait patient urgences 23 € (minoré 9,96 € ALD / AT-MP ; exonérations art. L.160-13 CSS), facturé par la clinique si le passage n'est pas suivi d'hospitalisation. Sans effet sur les honoraires du médecin.",
   "source": "fpu",
   "valide_depuis": "2026-03-01"
  },
  {
   "id": "GHS",
   "enonce": "En clinique privée le GHS revient à l'établissement et n'inclut pas les honoraires médicaux.",
   "source": "Syndicat national des cardiologues, « Activité libérale à l'hôpital et en clinique privée » (source secondaire) — https://www.lecardiologue.com/nomenclature/activite-liberale-a-lhopital-et-en-clinique-privee/",
   "a_confirmer": true
  },
  {
   "id": "UHCD",
   "enonce": "Critères cumulatifs d'admission en UHCD (guide SFMU 2024) : état instable ou diagnostic incertain ; surveillance impossible hors hospitalisation ; examens ou actes nécessaires. Rappel, jamais aide au choix.",
   "source": "Guide de bonnes pratiques UHCD 2024, SFMU — https://www.sfmu.org/upload/referentielsSFMU/UHCDguide2024.pdf"
  }
 ],
 "moteur": {
  "entrees": [
   "heure_arrivee",
   "heure_appel",
   "jour",
   "tranche_age",
   "arrivee",
   "urgence_art14",
   "ccmu",
   "hospitalise",
   "actes"
  ],
  "voies": {
   "A_consultation": {
    "base": "G",
    "ajouts": [
     "MN|MM|F selon horaire et urgence_art14",
     "MEG",
     "DEQP003 à 100 %",
     "jusqu'à 2 actes ANNEXE22 à 100 %/50 %"
    ],
    "disponible_si": "toujours"
   },
   "B_hospitalisation": {
    "base": "G si CCMU 1-2 ; U03 si CCMU 3 ; U45 si CCMU 4-5",
    "ajouts": [
     "MN|MM|F",
     "MEG",
     "MVU",
     "DEQP003 à 100 %"
    ],
    "exclut": "tout autre acte",
    "disponible_si": "hospitalise = true"
   },
   "C_actes_ccam": {
    "base": "actes triés par tarif décroissant : 100 %, 50 %, 0 %",
    "ajouts": [
     "P|S|F une fois si urgence",
     "M si actif et acte_admet_M"
    ],
    "disponible_si": "au moins un acte CCAM coché"
   }
  },
  "sortie": "voie au total le plus élevé, détail ligne à ligne, voies écartées avec motif, avertissements (a_confirmer, base ancienne), texte de transmission"
 },
 "actes_ccam": [
  {
   "code": "QZJA002",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie superficielle < 3 cm, hors face",
   "montant": 26.6,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA017",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie superficielle 3–10 cm, hors face",
   "montant": 53.95,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA015",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie superficielle > 10 cm, hors face",
   "montant": 64.29,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QAJA013",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie superficielle de la face < 3 cm",
   "montant": 31.35,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QAJA005",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie superficielle de la face 3–10 cm",
   "montant": 77.6,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QAJA002",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie superficielle de la face > 10 cm",
   "montant": 86.46,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA016",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie profonde < 3 cm, hors face et main",
   "montant": 50.99,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA012",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie profonde 3–10 cm, hors face et main",
   "montant": 64.29,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA001",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture plaie profonde > 10 cm, hors face et main",
   "montant": 88.68,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA022",
   "source": "ccam",
   "famille": "suture",
   "libelle": "Parage/suture d'une plaie pulpo-unguéale",
   "montant": 84.25,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA020",
   "source": "ccam",
   "famille": "brulure",
   "libelle": "Pansement initial de brûlure < 1 % SC, hors tête et mains",
   "montant": 45.08,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "a_confirmer": true,
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA005",
   "source": "ccam",
   "famille": "brulure",
   "libelle": "Pansement initial de brûlure 1–10 % SC, hors tête et mains",
   "montant": 76.86,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "a_confirmer": true,
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA009",
   "source": "ccam",
   "famille": "abces",
   "libelle": "Évacuation de collection superficielle de la peau",
   "montant": 39.91,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJA011",
   "source": "ccam",
   "famille": "abces",
   "libelle": "Évacuation de collection profonde peau et tissus mous",
   "montant": 49.51,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MJPA010",
   "source": "ccam",
   "famille": "abces",
   "libelle": "Incision ou excision d'un panaris superficiel",
   "montant": 39.91,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZJB001",
   "source": "ccam",
   "famille": "ongle",
   "libelle": "Évacuation d'hématome sous-unguéal par voie transunguéale",
   "montant": 11.82,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZFA020",
   "source": "ccam",
   "famille": "ongle",
   "libelle": "Exérèse partielle ou totale de la tablette d'un ongle",
   "montant": 48.77,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QAGA003",
   "source": "ccam",
   "famille": "corps_etranger",
   "libelle": "Ablation corps étranger superficiel peau visage ou mains",
   "montant": 49.51,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "BDGP002",
   "source": "ccam",
   "famille": "corps_etranger",
   "libelle": "Ablation corps étranger superficiel de la cornée",
   "montant": 20.9,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "CAGD001",
   "source": "ccam",
   "famille": "corps_etranger",
   "libelle": "Bouchon de cérumen ou corps étranger du conduit auditif",
   "montant": 20.0,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "GAGD002",
   "source": "ccam",
   "famille": "corps_etranger",
   "libelle": "Ablation corps étranger de la cavité nasale",
   "montant": 36.8,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "GABD002",
   "source": "ccam",
   "famille": "orl",
   "libelle": "Tamponnement nasal antérieur",
   "montant": 28.8,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "GABD001",
   "source": "ccam",
   "famille": "orl",
   "libelle": "Tamponnement nasal antérieur et postérieur",
   "montant": 58.4,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "LAEP002",
   "source": "ccam",
   "famille": "orl",
   "libelle": "Réduction orthopédique de fracture des os propres du nez",
   "montant": 66.4,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MZMP006",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide avant-bras/poignet/main sans le coude",
   "montant": 27.34,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MZMP011",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide membre supérieur prenant le coude",
   "montant": 34.57,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MZMP004",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide poignet/main, fracture sans réduction",
   "montant": 30.3,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MZMP013",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide antébrachiopalmaire, fracture sans réduction",
   "montant": 35.47,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MZMP007",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide brachio-antébrachio-palmaire, fracture sans réduction",
   "montant": 43.6,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "NZMP003",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide jambe/cheville/pied sans le genou",
   "montant": 27.57,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "NZMP007",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide membre inférieur prenant le genou",
   "montant": 36.95,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "NZMP014",
   "source": "ccam",
   "famille": "immobilisation",
   "libelle": "Appareil rigide cruropédieux, fracture sans réduction",
   "montant": 32.52,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MEEP002",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique luxation scapulohumérale (épaule)",
   "montant": 41.38,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MEEP001",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique luxation acromio/sternoclaviculaire",
   "montant": 36.95,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MFEP001",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique pronation douloureuse du coude",
   "montant": 31.35,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MFEP002",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique luxation du coude",
   "montant": 65.77,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MHEP002",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique luxation d'un doigt (MCP ou IP)",
   "montant": 33.44,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MHEP001",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique de plusieurs luxations de doigt",
   "montant": 71.68,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "NFEP001",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique luxation de la patella",
   "montant": 46.56,
   "modif": [
    "F",
    "M",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "LBEP005",
   "source": "ccam",
   "famille": "reduction",
   "libelle": "Réduction orthopédique luxation temporomandibulaire",
   "montant": 19.95,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "NZHB002",
   "source": "ccam",
   "famille": "ponction",
   "libelle": "Ponction articulaire membre inférieur, sans guidage",
   "montant": 30.1,
   "modif": [],
   "annexe22": true,
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "MZHB002",
   "source": "ccam",
   "famille": "ponction",
   "libelle": "Ponction articulaire membre supérieur, sans guidage",
   "montant": 30.1,
   "modif": [],
   "annexe22": true,
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "GGHB001",
   "source": "ccam",
   "famille": "ponction",
   "libelle": "Ponction d'un épanchement pleural, sans guidage",
   "montant": 38.71,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "AFHB002",
   "source": "ccam",
   "famille": "ponction",
   "libelle": "Ponction lombaire",
   "montant": 35.76,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "JDLD001",
   "source": "ccam",
   "famille": "urologie",
   "libelle": "Pose d'une sonde urétrovésicale",
   "montant": 19.21,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "DEQP003",
   "source": "ccam",
   "famille": "exploration",
   "libelle": "Électrocardiographie ≥ 12 dérivations",
   "montant": 14.77,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "cumul_consultation": true,
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "GLHF001",
   "source": "ccam",
   "famille": "exploration",
   "libelle": "Prélèvement artériel avec gazométrie et pH",
   "montant": 36.48,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "note": "Facturation par le médecin à confirmer selon qui possède l'analyseur",
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "GFQM001",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie thoracique (médiastin, poumon, plèvre)",
   "montant": 37.8,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "ZCQM008",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie de l'abdomen",
   "montant": 54.02,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "ZCQM003",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie du pelvis féminin",
   "montant": 52.45,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "ZCQM005",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie abdomen + pelvis",
   "montant": 75.6,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "incompatible_avec": [
    "JAQM003",
    "PBQM002"
   ],
   "a_confirmer": true,
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "JAQM003",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie du rein et de la région lombaire",
   "montant": 52.45,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "JDQM001",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie de la vessie et/ou de la prostate",
   "montant": 52.45,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "PBQM002",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie d'une articulation",
   "montant": 34.97,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "QZQM001",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échographie peau, ongles, tissus mous",
   "montant": 37.8,
   "modif": [],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "EJQM003",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Écho-doppler veineux membres inférieurs, recherche de TVP",
   "montant": 64.26,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  },
  {
   "code": "DZQM005",
   "source": "ccam",
   "famille": "echographie",
   "libelle": "Échocardiographie-doppler au lit du malade",
   "montant": 108.48,
   "modif": [
    "F",
    "P",
    "S"
   ],
   "verif_ameli": false,
   "valide_depuis": "2026-01-01"
  }
 ],
 "etablissement": {
  "source_principale": "Arrêté du 27/12/2021 (JO 29/12/2021) fixant les modalités de financement des recettes liées à l'activité des structures des urgences — https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044592184 ; arrêté du 31/03/2023 (FU0, PE1, PE2) — https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000047399060 ; FHF, facturation des soins d'urgence (màj 26/09/2023)",
  "a_confirmer": true,
  "condition_generale": "passage non suivi d'hospitalisation dans le même établissement ; prise en charge complète par le médecin urgentiste ; un seul forfait âge par passage ; aucun supplément sans forfait âge",
  "forfaits_age": [
   {
    "code": "FU0",
    "libelle": "Forfait âge, moins de 4 mois",
    "ages": [
     "<4m"
    ],
    "source": "etablissement",
    "valide_depuis": "2023-03-01"
   },
   {
    "code": "FU1",
    "libelle": "Forfait âge, 4 mois à moins de 16 ans",
    "ages": [
     "<6",
     "6-15"
    ],
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "FU2",
    "libelle": "Forfait âge, 16 à moins de 45 ans",
    "ages": [
     "16-44"
    ],
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "FU3",
    "libelle": "Forfait âge, 45 à moins de 75 ans",
    "ages": [
     "45-74"
    ],
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "FU4",
    "libelle": "Forfait âge, 75 ans et plus",
    "ages": [
     ">75"
    ],
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   }
  ],
  "supplements": [
   {
    "code": "SU3",
    "libelle": "Supplément prise en charge spécifique CCMU 3, 4, 5",
    "conditions": {
     "ccmu": [
      3,
      4,
      5
     ]
    },
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SU2",
    "libelle": "Supplément prise en charge spécifique CCMU 2, si acte de l'annexe 2 de l'arrêté (liste non intégrée)",
    "conditions": {
     "ccmu": [
      2
     ]
    },
    "incertain": true,
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SUM",
    "libelle": "Supplément mode d'arrivée (véhicule de catégorie A, B ou C, ou aérien)",
    "conditions": {
     "arrivee": [
      "ambulance",
      "samu"
     ]
    },
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SUN",
    "libelle": "Supplément nuit, prise en charge entre 22 h et 8 h",
    "conditions": {
     "plages_acte": [
      "22:00-24:00",
      "00:00-08:00"
     ]
    },
    "exclusif_avec": [
     "SUF"
    ],
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SUF",
    "libelle": "Supplément férié : 20 h–22 h, samedi 14 h–20 h, dimanche et férié 8 h–20 h",
    "conditions": {
     "creneaux": [
      {
       "jour": [
        "semaine",
        "samedi",
        "dimanche",
        "ferie"
       ],
       "plages": [
        "20:00-22:00"
       ]
      },
      {
       "jour": [
        "samedi"
       ],
       "plages": [
        "14:00-20:00"
       ]
      },
      {
       "jour": [
        "dimanche",
        "ferie"
       ],
       "plages": [
        "08:00-20:00"
       ]
      }
     ]
    },
    "exclusif_avec": [
     "SUN"
    ],
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SUB",
    "libelle": "Supplément biologie, moins de 16 ans",
    "conditions": {
     "biologie": true,
     "ages": [
      "<4m",
      "<6",
      "6-15"
     ]
    },
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SB2",
    "libelle": "Supplément biologie, 16 à moins de 45 ans",
    "conditions": {
     "biologie": true,
     "ages": [
      "16-44"
     ]
    },
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SB3",
    "libelle": "Supplément biologie, 45 ans et plus",
    "conditions": {
     "biologie": true,
     "ages": [
      "45-74",
      ">75"
     ]
    },
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SIM",
    "libelle": "Supplément imagerie conventionnelle ou échographie réalisée par un radiologue, avec compte rendu",
    "conditions": {
     "imagerie": true
    },
    "note": "SIC si imagerie en coupe (scanner, IRM)",
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   },
   {
    "code": "SAS",
    "libelle": "Supplément avis de spécialiste demandé par l'urgentiste (un par spécialité)",
    "conditions": {
     "avis_specialiste": true
    },
    "source": "etablissement",
    "valide_depuis": "2022-01-01"
   }
  ],
  "non_modelises": [
   "PE1 / PE2 : suppléments pédiatriques sur FU0/FU1 selon le diagnostic principal (listes 1 et 2 de l'annexe 8 de l'arrêté du 31/03/2023) ; non cumulables entre eux",
   "SIC (imagerie en coupe), SSN / SSF (nuit et férié de l'avis spécialiste et de l'imagerie)",
   "Montants : non repris. La grille publique (a–c) au 01/03/2026 est publiée par des établissements publics (HNFC, « Réforme des urgences, tarifs forfaits applicables au 01.03.2026 », https://www.hnfc.fr/files/site/409/2650,R%C3%A9forme%20des%20urgences%20_%20tarifs%20forfaits%20applicables%20au%2001.03.2026.pdf ; CH de Bry, « Tarifs des urgences 2026 », https://www.ch-bry.com/wp-content/uploads/2026/05/Tarifs-des-urgences-2026.pdf ; relevés le 24/10/2026 par recherche web, PDF non ouverts) ; la grille privée (d–e) 2026 n'a pas été trouvée."
  ]
 }
};
