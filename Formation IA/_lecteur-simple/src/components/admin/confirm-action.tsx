"use client";

/**
 * Bouton d'action d'administration avec confirmation : ouvre une boîte de dialogue qui décrit l'effet,
 * exécute la server action, affiche le résultat puis rafraîchit la page.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Notice } from "@/components/ui/surface";

type Result = { ok: true; message: string; url?: string } | { ok: false; error: string };

export function ConfirmAction({
  label,
  title,
  description,
  confirmLabel,
  run,
  variant = "secondary",
  size = "sm",
  danger,
  children,
}: {
  label: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  run: () => Promise<Result>;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  danger?: boolean;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, start] = React.useTransition();
  const [result, setResult] = React.useState<Result | null>(null);
  // Textes figés à l'ouverture : après succès, router.refresh() peut remplacer ce bouton par une autre action.
  const [frozen, setFrozen] = React.useState({ title, description });

  function confirm() {
    start(async () => {
      try {
        const r = await run();
        setResult(r);
        if (r.ok) router.refresh();
      } catch {
        setResult({ ok: false, error: "L'action n'a pas abouti. Rechargez la page et réessayez." });
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setFrozen({ title, description });
        else setResult(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent title={frozen.title} description={frozen.description}>
        {children}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="r" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
              <Notice tone={result.ok ? "ok" : "danger"}>{result.ok ? result.message : result.error}</Notice>
              <div className="mt-5 flex justify-end">
                <DialogClose asChild>
                  <Button variant="secondary">Fermer</Button>
                </DialogClose>
              </div>
            </motion.div>
          ) : (
            <motion.div key="c" className="mt-2 flex flex-wrap justify-end gap-2" exit={{ opacity: 0 }}>
              <DialogClose asChild>
                <Button variant="ghost">Annuler</Button>
              </DialogClose>
              <Button variant={danger ? "danger" : "primary"} loading={pending} onClick={confirm}>
                {confirmLabel}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
