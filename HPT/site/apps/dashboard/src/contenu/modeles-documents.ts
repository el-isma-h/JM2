/**
 * Modèles de documents HPT GIE : courriers types du métier (URSSAF, taxe foncière, énergie, fournisseurs…).
 * Chaque modèle a des champs variables `{{id}}`, pré-remplis par l'Atelier à partir de la pièce traitée
 * (société, SIRET, organisme, montant, période…) puis ajustables à la main ou par l'assistant.
 * Aucun chiffre n'est inventé : un champ sans valeur reste signalé « [à compléter] ».
 */

export type SourceChamp = "societe" | "siret" | "organisme" | "montant" | "periode" | "echeance" | "nomPiece" | "nomTitulaire" | "date" | "reference";

export type ChampModele = {
  id: string;
  libelle: string;
  /** Donnée du contexte qui pré-remplit le champ. */
  source?: SourceChamp;
  /** Indication pour l'utilisateur quand rien n'est pré-rempli. */
  indication?: string;
  multiligne?: boolean;
};

export type ModeleDocument = {
  id: string;
  titre: string;
  description: string;
  /** urssaf | fiscal | energie | fournisseur | recouvrement | pieces */
  categorie: string;
  champs: ChampModele[];
  /** Corps Markdown avec variables {{id}}. */
  corps: string;
};

const EN_TETE = `**HPT GIE** · Conseil aux entreprises
*{{date}}*

**Expéditeur :** {{societe}}{{siretLigne}}
**Destinataire :** {{organisme}}

`;

const SIGNATURE = `

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

**{{societe}}**
Avec l'accompagnement de HPT GIE`;

const SOCIETE: ChampModele = { id: "societe", libelle: "Société", source: "societe" };
const SIRET: ChampModele = { id: "siret", libelle: "SIRET", source: "siret", indication: "14 chiffres" };
const ORGANISME = (indication: string): ChampModele => ({ id: "organisme", libelle: "Destinataire", source: "organisme", indication });
const MONTANT: ChampModele = { id: "montant", libelle: "Montant", source: "montant", indication: "ex. 4 850,00 €" };
const PERIODE: ChampModele = { id: "periode", libelle: "Période", source: "periode", indication: "ex. 3e trimestre 2026" };
const REFERENCE: ChampModele = { id: "reference", libelle: "Référence du document", source: "reference", indication: "numéro d'avis, de facture ou de dossier" };
const PIECE: ChampModele = { id: "piece", libelle: "Pièce concernée", source: "nomPiece" };

export const MODELES_DOCUMENTS: ModeleDocument[] = [
  {
    id: "urssaf-trop-paye",
    titre: "Réclamation de trop-payé URSSAF",
    description: "Demande de remboursement de cotisations versées à tort ou en excédent, avec rappel des textes et des pièces jointes.",
    categorie: "urssaf",
    champs: [SOCIETE, SIRET, ORGANISME("ex. URSSAF Île-de-France"), MONTANT, PERIODE, REFERENCE, PIECE, { id: "motif", libelle: "Motif du trop-payé", multiligne: true, indication: "ex. taux de cotisation AT/MP erroné, réduction générale non appliquée…" }],
    corps: `${EN_TETE}# Objet : demande de remboursement de cotisations indûment versées – {{periode}}

Madame, Monsieur,

Après vérification de nos déclarations et des pièces en notre possession (notamment {{piece}}{{referenceLigne}}), il apparaît que notre société a versé à votre organisme un montant excédentaire de **{{montant}}** au titre de la période **{{periode}}**.

## Motif de la réclamation
{{motif}}

## Fondement
Conformément aux articles L. 243-6 et R. 243-6 et suivants du Code de la sécurité sociale, les cotisations indûment versées peuvent faire l'objet d'une demande de remboursement dans un délai de trois ans à compter de la date à laquelle elles ont été acquittées.

## Demande
Nous vous demandons en conséquence :
1. de procéder au remboursement de la somme de **{{montant}}**, majorée des intérêts légaux le cas échéant ;
2. de nous adresser un décompte rectificatif pour la période concernée ;
3. de nous confirmer la correction de nos bases pour les périodes à venir.

Vous trouverez ci-joint les justificatifs correspondants. Nous restons à votre disposition pour tout complément.${SIGNATURE}`,
  },
  {
    id: "taxe-fonciere-degrevement",
    titre: "Demande de dégrèvement de taxe foncière",
    description: "Réclamation contentieuse auprès du service des impôts fonciers : erreur de surface, de catégorie, de valeur locative ou de taux.",
    categorie: "fiscal",
    champs: [SOCIETE, SIRET, ORGANISME("ex. Service des impôts des entreprises / Centre des finances publiques"), MONTANT, { id: "annee", libelle: "Année d'imposition", source: "periode", indication: "ex. 2026" }, REFERENCE, { id: "adresseBien", libelle: "Adresse du bien", indication: "adresse du local ou du terrain imposé" }, PIECE, { id: "motif", libelle: "Motif de la contestation", multiligne: true, indication: "ex. surface pondérée surévaluée, local vacant, catégorie erronée…" }],
    corps: `${EN_TETE}# Objet : réclamation – taxe foncière {{annee}} – {{adresseBien}}

Madame, Monsieur,

Notre société est redevable de la taxe foncière sur les propriétés bâties pour le bien situé **{{adresseBien}}**, au titre de l'année **{{annee}}**{{referenceLigne}}, pour un montant de **{{montant}}** (voir {{piece}}).

## Motif de la réclamation
{{motif}}

## Fondement
En application des articles R*. 196-2 et R*. 197-1 et suivants du Livre des procédures fiscales, le contribuable peut présenter une réclamation jusqu'au 31 décembre de l'année suivant celle de la mise en recouvrement. Nous sollicitons également, à titre conservatoire, le sursis de paiement prévu à l'article L. 277 du même livre pour la part contestée.

## Demande
Nous vous demandons :
1. le réexamen de la valeur locative cadastrale du bien et la correction des éléments erronés ;
2. le dégrèvement correspondant pour l'année {{annee}} et, le cas échéant, pour les années non prescrites ;
3. la notification de la décision à l'adresse ci-dessus.

Les justificatifs (plans, surfaces, baux, photographies) sont joints à la présente.${SIGNATURE}`,
  },
  {
    id: "energie-contestation-facture",
    titre: "Contestation de facture d'énergie",
    description: "Contestation d'une facture d'électricité ou de gaz : index, puissance souscrite, taxes, régularisation ou prix hors contrat.",
    categorie: "energie",
    champs: [SOCIETE, SIRET, ORGANISME("ex. service clients du fournisseur d'énergie"), MONTANT, PERIODE, REFERENCE, { id: "pdl", libelle: "Point de livraison (PDL / PCE)", indication: "numéro figurant sur la facture" }, PIECE, { id: "motif", libelle: "Points contestés", multiligne: true, indication: "ex. index estimé sans relève, puissance facturée différente du contrat, TICFE/CTA erronées…" }],
    corps: `${EN_TETE}# Objet : contestation de la facture {{reference}} – période {{periode}}

Madame, Monsieur,

Nous accusons réception de votre facture {{reference}} d'un montant de **{{montant}}** pour la période **{{periode}}**, relative au point de livraison **{{pdl}}** ({{piece}}).

## Points contestés
{{motif}}

## Demande
Conformément aux conditions générales de notre contrat et aux dispositions du Code de l'énergie relatives à la facturation, nous vous demandons :
1. de nous communiquer le détail des index, des puissances et des taxes retenus pour cette facture ;
2. d'émettre une facture rectificative tenant compte des éléments ci-dessus ;
3. de suspendre le recouvrement de la part contestée jusqu'au règlement du litige.

À défaut de réponse sous trente jours, nous saisirons le médiateur national de l'énergie.${SIGNATURE}`,
  },
  {
    id: "remise-gracieuse-majorations",
    titre: "Demande de remise gracieuse de majorations",
    description: "Demande de remise des majorations et pénalités de retard (URSSAF, impôts), motivée par la bonne foi et la régularisation.",
    categorie: "recouvrement",
    champs: [SOCIETE, SIRET, ORGANISME("ex. URSSAF, Service des impôts des entreprises"), { id: "montantMajorations", libelle: "Montant des majorations", source: "montant", indication: "montant des seules majorations/pénalités" }, PERIODE, REFERENCE, PIECE, { id: "motif", libelle: "Circonstances", multiligne: true, indication: "ex. difficulté ponctuelle de trésorerie, erreur de virement, premier retard en N années…" }],
    corps: `${EN_TETE}# Objet : demande de remise gracieuse des majorations de retard – {{periode}}

Madame, Monsieur,

Par {{piece}}{{referenceLigne}}, vous nous avez notifié des majorations et pénalités de retard d'un montant de **{{montantMajorations}}** au titre de la période **{{periode}}**.

## Circonstances
{{motif}}

Le principal a été intégralement régularisé et notre société est, par ailleurs, à jour de ses obligations déclaratives et de paiement.

## Demande
Compte tenu de notre bonne foi et du caractère exceptionnel de ce retard, nous sollicitons la remise gracieuse totale des majorations et pénalités, ou, à défaut, leur réduction la plus large possible.

Nous vous remercions de l'attention que vous porterez à cette demande.${SIGNATURE}`,
  },
  {
    id: "fournisseur-renegociation",
    titre: "Courrier au fournisseur : renégociation",
    description: "Demande de révision tarifaire ou des conditions d'un contrat (énergie, télécoms, assurance, maintenance, location).",
    categorie: "fournisseur",
    champs: [SOCIETE, SIRET, ORGANISME("nom du fournisseur et service concerné"), { id: "contrat", libelle: "Contrat concerné", source: "reference", indication: "numéro ou objet du contrat" }, { id: "montantActuel", libelle: "Montant actuel", source: "montant", indication: "montant facturé (mensuel, annuel…)" }, PIECE, { id: "demande", libelle: "Ce que nous demandons", multiligne: true, indication: "ex. baisse de 10 % du tarif, alignement sur l'offre du marché, suppression des frais de…" }],
    corps: `${EN_TETE}# Objet : demande de révision des conditions du contrat {{contrat}}

Madame, Monsieur,

Notre société est cliente de vos services au titre du contrat **{{contrat}}**, pour un montant actuel de **{{montantActuel}}** ({{piece}}).

Dans le cadre d'une revue de l'ensemble de nos charges menée avec le cabinet HPT GIE, nous avons comparé nos conditions actuelles avec celles proposées sur le marché.

## Notre demande
{{demande}}

Nous souhaitons poursuivre notre relation avec vous et vous proposons un échange dans les quinze jours afin de convenir de nouvelles conditions. À défaut d'accord, nous nous réservons la possibilité de faire jouer la concurrence à la prochaine échéance contractuelle.${SIGNATURE}`,
  },
  {
    id: "mise-en-demeure-payer",
    titre: "Mise en demeure de payer",
    description: "Dernier rappel formel avant recouvrement : facture impayée, pénalités de retard et indemnité forfaitaire.",
    categorie: "recouvrement",
    champs: [SOCIETE, SIRET, ORGANISME("débiteur : société et adresse"), MONTANT, { id: "facture", libelle: "Facture(s) impayée(s)", source: "reference", indication: "numéros et dates" }, { id: "echeance", libelle: "Échéance dépassée", source: "echeance", indication: "date d'échéance initiale" }, PIECE, { id: "delai", libelle: "Délai accordé", indication: "ex. 8 jours" }],
    corps: `${EN_TETE}# Objet : mise en demeure de payer – {{facture}}

**Lettre recommandée avec accusé de réception**

Madame, Monsieur,

Malgré nos précédents rappels, la ou les factures **{{facture}}**, d'un montant total de **{{montant}}**, échues le **{{echeance}}**, demeurent impayées à ce jour ({{piece}}).

## Mise en demeure
Par la présente, nous vous mettons en demeure de nous régler la somme de **{{montant}}** sous **{{delai}}** à compter de la réception de ce courrier.

Conformément à l'article L. 441-10 du Code de commerce, cette somme est majorée des pénalités de retard prévues à nos conditions générales de vente ainsi que de l'indemnité forfaitaire pour frais de recouvrement de 40 € par facture.

À défaut de règlement dans ce délai, nous engagerons sans autre avis les poursuites nécessaires au recouvrement de notre créance, et les frais en résultant resteront à votre charge.${SIGNATURE}`,
  },
  {
    id: "accompagnement-pieces",
    titre: "Courrier d'accompagnement de pièces",
    description: "Lettre ou attestation accompagnant l'envoi de documents à un organisme, un client ou un partenaire, avec liste des pièces.",
    categorie: "pieces",
    champs: [SOCIETE, SIRET, ORGANISME("destinataire de l'envoi"), { id: "objet", libelle: "Objet de l'envoi", indication: "ex. dossier de demande de remboursement, réponse à votre courrier du…" }, REFERENCE, { id: "listePieces", libelle: "Pièces transmises", source: "nomPiece", multiligne: true, indication: "une pièce par ligne" }],
    corps: `${EN_TETE}# Objet : transmission de pièces – {{objet}}

Madame, Monsieur,

Nous vous prions de bien vouloir trouver ci-joint les pièces suivantes, relatives à **{{objet}}**{{referenceLigne}} :

{{listePieces}}

Nous attestons que ces documents sont conformes aux originaux en notre possession.

Nous vous remercions de bien vouloir nous en accuser réception et restons à votre disposition pour tout complément.${SIGNATURE}`,
  },
  {
    id: "echeancier-paiement",
    titre: "Demande d'échéancier de paiement",
    description: "Demande de délais de paiement et proposition d'un échéancier, pour une dette sociale, fiscale ou fournisseur.",
    categorie: "recouvrement",
    champs: [SOCIETE, SIRET, ORGANISME("créancier"), MONTANT, PERIODE, REFERENCE, PIECE, { id: "proposition", libelle: "Échéancier proposé", multiligne: true, indication: "ex. 6 mensualités égales à compter du…" }, { id: "motif", libelle: "Motif", multiligne: true, indication: "ex. décalage de trésorerie lié à…" }],
    corps: `${EN_TETE}# Objet : demande de délais de paiement – {{periode}}

Madame, Monsieur,

Notre société est redevable envers votre organisme de la somme de **{{montant}}** au titre de la période **{{periode}}**{{referenceLigne}} ({{piece}}).

## Situation
{{motif}}

## Proposition d'échéancier
{{proposition}}

Nous nous engageons à respecter strictement cet échéancier et à régler les échéances courantes à leur date. Nous sollicitons, en parallèle, la suspension des poursuites et la remise des majorations qui résulteraient de ce décalage.

Nous vous remercions de nous confirmer votre accord par écrit.${SIGNATURE}`,
  },
];

export const CATEGORIES_MODELES: Record<string, string> = { urssaf: "URSSAF et cotisations", fiscal: "Impôts et taxe foncière", energie: "Énergie", fournisseur: "Fournisseurs", recouvrement: "Recouvrement et délais", pieces: "Pièces et attestations" };

export const modeleParId = (id: string) => MODELES_DOCUMENTS.find((m) => m.id === id) ?? null;

/** Remplace les variables du modèle ; un champ vide devient « [à compléter] ». Les lignes dérivées (SIRET, référence) disparaissent si vides. */
export function remplirModele(m: ModeleDocument, valeurs: Record<string, string>): string {
  const v = (id: string) => (valeurs[id] ?? "").trim();
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date());
  const derivees: Record<string, string> = {
    date: valeurs.date?.trim() || date,
    siretLigne: v("siret") ? `\n**SIRET :** ${v("siret")}` : "",
    referenceLigne: v("reference") ? ` (référence ${v("reference")})` : "",
  };
  return m.corps.replace(/\{\{(\w+)\}\}/g, (_, id: string) => {
    if (id in derivees) return derivees[id];
    const val = v(id);
    if (val) return val;
    const champ = m.champs.find((c) => c.id === id);
    return `[à compléter${champ ? ` : ${champ.libelle.toLowerCase()}` : ""}]`;
  });
}
