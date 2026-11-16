import type { Metadata } from "next";
import { requireUser } from "@/server/auth";
import { getResourceLibrary } from "@/content";
import { PageHeader } from "@/components/ui/surface";
import { ResourceBrowser } from "@/components/ressources/resource-browser";

export const metadata: Metadata = { title: "Ressources" };

export default async function RessourcesPage() {
  await requireUser();
  const lib = getResourceLibrary();
  return (
    <div>
      <PageHeader
        title="Ressources"
        description={`${lib.linkCount} liens vérifiés, classés par fournisseur et par thème : documentations officielles, cours, outils. Tapez « / » pour rechercher.`}
      />
      <ResourceBrowser sections={lib.sections} total={lib.linkCount} />
    </div>
  );
}
