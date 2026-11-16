/**
 * État de la clé API personnelle pour la page Profil (composant serveur) :
 * configurée ou non, fournisseur, clé masquée. Jamais la clé en clair.
 */
import { ShieldCheck } from "@phosphor-icons/react/ssr";
import { getPersonalKey, statusOf } from "@/server/ai/keys";
import { PROVIDERS } from "@/lib/ai";

export async function ApiKeyProfileStatus({ userId }: { userId: string }) {
  const status = statusOf(await getPersonalKey(userId));
  if (!status.configured) {
    return <p className="text-[13px] text-ink-2">Aucune clé personnelle. Le guide explique comment en obtenir une et la tester en un clic.</p>;
  }
  return (
    <div className="text-[13px]">
      <p className="inline-flex items-center gap-2 text-ok-ink">
        <ShieldCheck size={15} weight="fill" aria-hidden /> Clé configurée
      </p>
      <p className="mt-1 text-ink-2">
        {PROVIDERS[status.provider].company} · <span className="num text-ink">{status.masked}</span> · {status.model}
      </p>
    </div>
  );
}
