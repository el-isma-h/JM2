import { Play } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { routes, withBase } from "@/lib/paths";

/**
 * « Essayer le compte démo » : formulaire POST classique vers le route handler /api/auth/demo
 * (fonctionne sans JavaScript ; origine vérifiée côté serveur). Le basePath doit être ajouté à la main (withBase).
 */
export function DemoButton({ className }: { className?: string }) {
  return (
    <form action={withBase(routes.api.demoLogin)} method="post">
      <Button type="submit" variant="secondary" size="lg" className={className}>
        <Play size={14} weight="fill" aria-hidden /> Essayer le compte démo
      </Button>
    </form>
  );
}
