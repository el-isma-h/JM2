/** Catégories du carnet d'adresses (partagées entre le serveur et l'interface). */
export const CATEGORIES_CONTACT = [
  { id: "client", nom: "Client" },
  { id: "organisme", nom: "Organisme (URSSAF, impôts…)" },
  { id: "fournisseur", nom: "Fournisseur" },
  { id: "partenaire", nom: "Partenaire" },
  { id: "autre", nom: "Autre" },
] as const;
export type CategorieContact = (typeof CATEGORIES_CONTACT)[number]["id"];
export const nomCategorie = (id: string) => CATEGORIES_CONTACT.find((c) => c.id === id)?.nom ?? "Autre";
