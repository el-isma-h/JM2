import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SealCheck, SealWarning, SealQuestion } from "@phosphor-icons/react/ssr";
import { normalizeCertificateNumber, parseCertificateNumber } from "@/domain";
import { findCertificate } from "@/server/certificates";
import { certificateShortTitle, levelShortTitle } from "@/server/certificate-data";
import { getLevel, getProgramme } from "@/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Vérifier un certificat", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * Vérification publique (lien du QR code). N'affiche que : statut, nom du titulaire, niveau, date.
 * Aucune autre donnée personnelle (ni e-mail, ni score, ni identifiant).
 */
export default async function VerifierPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  let raw = numero;
  try {
    raw = decodeURIComponent(numero);
  } catch {
    notFound();
  }
  const number = normalizeCertificateNumber(raw);
  const row = number ? await findCertificate(number) : null;
  const programme = getProgramme();

  if (!row) {
    const parsed = number ? parseCertificateNumber(number) : null;
    return (
      <Verdict tone="unknown" number={number ?? raw.slice(0, 40)} title="Certificat introuvable">
        <p className="max-w-[56ch] text-[14px] text-ink-2">
          {parsed ? "Ce numéro a un format valide mais ne correspond à aucun certificat délivré par Next Formation." : "Ce numéro ne respecte pas le format des certificats Next Formation (NF-IA-N1-2026-XXXXXX)."} Vérifiez la saisie : les caractères 0, O, 1, I et L ne sont jamais utilisés.
        </p>
      </Verdict>
    );
  }

  const { c } = row;
  const level = getLevel(c.levelId);
  const revoked = c.revokedAt !== null;
  const name = `${row.firstName} ${row.lastName}`.trim() || "Titulaire";
  return (
    <Verdict tone={revoked ? "revoked" : "valid"} number={c.number} title={revoked ? "Certificat révoqué" : "Certificat valide"}>
      <dl className="grid gap-px border border-line bg-line sm:grid-cols-2">
        <Field k="Titulaire" v={name} wide />
        <Field k="Certificat" v={`Niveau ${level?.index ?? c.levelId.slice(1)} « ${certificateShortTitle(c.levelId)} »`} wide />
        <Field k="Niveau" v={`${levelShortTitle(c.levelId)}${level ? ` · ${level.hours} h` : ""}`} />
        <Field k="Délivré le" v={formatDate(c.issuedAt)} />
        {revoked ? <Field k="Révoqué le" v={formatDate(c.revokedAt)} /> : null}
      </dl>
      <p className="mt-6 max-w-[64ch] text-[12.5px] text-ink-3">
        {revoked
          ? "Ce certificat a été délivré puis révoqué par l'organisme : il ne peut plus être présenté comme preuve de réussite."
          : `Délivré par ${programme.organisme} après réussite de l'examen final du niveau (formation ${programme.code}). Certificat de réalisation et de compétences : il prépare aux certifications tierces et ne s'y substitue pas.`}
      </p>
    </Verdict>
  );
}

function Field({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={wide ? "bg-bg px-5 py-4 sm:col-span-2" : "bg-bg px-5 py-4"}>
      <dt className="text-[12px] text-ink-3">{k}</dt>
      <dd className="mt-1 text-[16px] text-ink">{v}</dd>
    </div>
  );
}

function Verdict({ tone, number, title, children }: { tone: "valid" | "revoked" | "unknown"; number: string; title: string; children: React.ReactNode }) {
  const Icon = tone === "valid" ? SealCheck : tone === "revoked" ? SealWarning : SealQuestion;
  const color = tone === "valid" ? "text-accent" : tone === "revoked" ? "text-danger-ink" : "text-ink-3";
  const border = tone === "valid" ? "border-accent" : tone === "revoked" ? "border-danger" : "border-line-strong";
  return (
    <div>
      <p className="text-[12px] text-ink-3">Vérification d&apos;un certificat Next Formation IA</p>
      <div className={`mt-4 border-t-2 ${border} pt-8`}>
        <div className="flex items-start gap-5">
          <div>
            <Icon size={56} weight="thin" className={color} aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className={`text-[30px] sm:text-[40px] ${tone === "revoked" ? "text-danger-ink" : "text-ink"}`}>{title}</h1>
            <p className="num mt-2 break-all text-[14px] text-ink-2">{number}</p>
          </div>
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
      <p className="mt-12 text-[12.5px] text-ink-3">
        Vous êtes apprenant ? <Link href="/connexion" className="text-accent underline-offset-4 hover:underline">Connectez-vous</Link> pour télécharger vos certificats.
      </p>
    </div>
  );
}
