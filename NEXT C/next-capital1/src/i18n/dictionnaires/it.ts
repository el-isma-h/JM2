import type { DeepPartial } from "..";
import type { Dict } from "./fr";

const it: DeepPartial<Dict> = {
  meta: { titre: "NEXT Capital: fondo di investimento tokenizzato", description: "NEXT Capital, fondo partecipativo tokenizzato che investe nelle migliori startup di IA, quantistica, agroalimentare e sport. Piattaforma dimostrativa." },
  commun: { demo: "Piattaforma dimostrativa: NEXT Capital non è ancora autorizzato. Nessuna sottoscrizione reale è possibile.", demoCourt: "Dimostrazione", exemple: "Esempio fittizio", risque: "Investire in società non quotate comporta un rischio di perdita del capitale e di liquidità. Investa solo il denaro di cui non ha bisogno immediato.", enSavoirPlus: "Scopri di più", decouvrir: "Scopri", candidater: "Candidati", connexion: "Accedi", deconnexion: "Esci", monEspace: "Il mio spazio", admin: "Amministrazione", retour: "Indietro", suivant: "Avanti", precedent: "Precedente", envoyer: "Invia", valider: "Convalida", confirmer: "Conferma", annuler: "Annulla", enregistrer: "Salva", chargement: "Caricamento…", oui: "Sì", non: "No", langue: "Lingua", total: "Totale", date: "Data", montant: "Importo", statut: "Stato", reference: "Riferimento", actions: "Azioni", aucun: "Nessun elemento per ora." },
  nav: { fonds: "Il fondo", theses: "Tesi", marches: "Mercati", token: "Il token", deals: "Operazioni", adhesion: "Adesione", parcours: "Percorso", apropos: "Chi siamo", faq: "FAQ", risques: "Rischi" },
  pied: { accroche: "La nuova generazione dei fondi di investimento: un token, le migliori operazioni.", investir: "Investire", ressources: "Risorse", legal: "Legale", mentions: "Note legali", confidentialite: "Privacy", cookies: "Cookie", siege: "Sede: Lussemburgo (in costituzione)" },
  accueil: {
    sur: "Fondo di investimento tokenizzato", titre1: "Un solo token.", titre2: "Le migliori operazioni del mercato.",
    accroche: "NEXT Capital riunisce investitori qualificati attorno a un token unico, l'NXT, il cui capitale viene impiegato nelle startup più promettenti d'Europa e degli Stati Uniti: intelligenza artificiale, quantistica, agroalimentare, sport.",
    cta: "Unisciti al fondo", cta2: "Capire il token", des: "da", parInvestissement: "per sottoscrizione",
    chiffres: [{ v: "4", l: "tesi di investimento" }, { v: "1.500 €", l: "ticket d'ingresso" }, { v: "20 %", l: "commissione solo sulla plusvalenza" }, { v: "8", l: "lingue, una sola piattaforma" }],
    piliersSur: "Perché NEXT Capital", piliersTitre: "Il modello dei grandi fondi, l'accessibilità di un club",
    piliers: [
      { t: "Un token, un portafoglio", d: "Sottoscrivi NXT. Il fondo impiega il capitale in una selezione di startup. Segui tutto da un unico cruscotto." },
      { t: "Accesso alle migliori operazioni", d: "Batch di Y Combinator, startup europee da Seed a Serie A/B, operazioni interne, reti di Lussemburgo e Miami." },
      { t: "Selezione rigorosa", d: "Meno dell'1 % dei dossier esaminati viene trattenuto. Ogni dossier è oggetto di due diligence finanziaria, legale e settoriale." },
      { t: "Tracciabilità integrale", d: "Ogni deposito, ogni sottoscrizione, ogni euro è iscritto in un libro consultabile in ogni momento. Il token NXT sarà emesso in ERC-20." },
    ],
    canauxSur: "Canali di accesso", canauxTitre: "Dove nascono le migliori operazioni", thesesSur: "Quattro tesi", thesesTitre: "Dove concentriamo il capitale", parcoursSur: "Percorso", parcoursTitre: "Dalla candidatura al portafoglio",
    ctaFinalTitre: "Pronto a unirti alla nuova ondata?", ctaFinalTexte: "La candidatura richiede dieci minuti. Il nostro team esamina il dossier prima di aprire il conto.",
  },
  theses: { titre: "Le nostre quattro tesi di investimento", allocation: "Allocazione target", stades: "Fasi", horizon: "Orizzonte", perf: "Obiettivo di performance", ans: "anni",
    ia: { nom: "Intelligenza artificiale", accroche: "Infrastrutture, agenti e applicazioni verticali" }, quantique: { nom: "Quantistica", accroche: "Il calcolo del prossimo decennio" }, agroalimentaire: { nom: "Agroalimentare", accroche: "Nutrire meglio, produrre diversamente" }, sport: { nom: "Sport", accroche: "Performance, dati ed esperienza" } },
  fonds: { titre: "Il fondo" }, token: { titre: "Il token NXT", comment: "Come funziona" }, deals: { titre: "Operazioni", ouvert: "In corso", a_venir: "In arrivo", cloture: "Chiusa", objectif: "Obiettivo", alloue: "Allocato", voir: "Vedi dossier" },
  adhesion: { titre: "Adesione e status", niveauxTitre: "Livelli di adesione", parAn: "/ anno", plafondAn: "Investimento max. / anno", plafondOp: "Investimento max. / sottoscrizione", frais: "Commissione di strutturazione", bons: "Buoni di priorità", illimite: "Illimitato", chargeAffaire: "Referente dedicato", vip: "Eventi VIP", diners: "Cene private", statutsTitre: "Status per capitale investito",
    statuts: { membre: { nom: "Membro" }, partenaire: { nom: "Partner" }, associe: { nom: "Associato" }, club50: { nom: "Club 50" }, cercle100: { nom: "Cerchio 100" } }, aPartirDe: "da", choisir: "Scegli questo livello" },
  parcours: { titre: "Il percorso di investimento" }, apropos: { titre: "Chi siamo" }, faq: { titre: "Domande frequenti" }, risques: { titre: "Avvertenza sui rischi" },
  connexion: { titre: "Accedi", email: "Indirizzo e-mail", motDePasse: "Password", bouton: "Accedi", erreur: "Credenziali errate.", pasDeCompte: "Non hai ancora un conto?", candidater: "Invia una candidatura", demoTitre: "Account dimostrativi" },
  candidature: { titre: "Candidatura", intro: "Il nostro team esamina il dossier prima di aprire il conto. Conta dieci minuti.", etapes: ["Identità", "Situazione", "Profilo investitore", "Adesione", "Documenti", "Conferma"],
    identite: { prenom: "Nome", nom: "Cognome", email: "Indirizzo e-mail", telephone: "Telefono", pays: "Paese di residenza", naissance: "Data di nascita", nationalite: "Nazionalità", adresse: "Indirizzo postale", motDePasse: "Password (minimo 8 caratteri)" },
    situation: { situation: "Situazione professionale", secteur: "Settore di attività", revenus: "Reddito annuo", patrimoine: "Patrimonio finanziario", origineFonds: "Origine dei fondi" },
    profil: { zones: "Aree di investimento preferite", theses: "Tesi di interesse", risque: "Tolleranza al rischio", rendement: "Rendimento atteso", horizon: "Orizzonte di investimento", experience: "Esperienza nel non quotato" },
    adhesionTitre: "Scegli il tuo livello di adesione", merciTitre: "Candidatura ricevuta" },
  compte: { bienvenue: "Benvenuto", tableau: "Cruscotto", wallet: "Wallet", souscrire: "Sottoscrivi", historique: "Storico", portefeuille: "Portafoglio", documents: "Documenti", statut: "Status", profil: "Profilo", solde: "Saldo disponibile", tokens: "NXT detenuti", capitalInvesti: "Capitale investito", deposer: "Deposita fondi", sepa: "Bonifico SEPA", carte: "Carta / Apple Pay", crypto: "Cripto", souscrireTitre: "Sottoscrivi NXT", confirmerSous: "Conferma la sottoscrizione", payerAdhesion: "Paga la mia adesione" },
  chatbot: { titre: "Assistente NEXT", accroche: "Ti oriento: fondo, token, adesione, percorso.", placeholder: "Fai la tua domanda…", avertissement: "Assistente automatico: informazioni generali, non consulenza finanziaria.", suggestions: ["Come funziona il token NXT?", "Qual è il ticket minimo?", "Quali sono le commissioni?", "Come candidarsi?"], ouvrir: "Apri l'assistente", fermer: "Chiudi" },
};
export default it;
