import type { Metadata } from "next";
import Link from "next/link";
import { DownloadSimple, LockSimple } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { loadAccess } from "@/server/learner";
import { certificateShortTitle, holderName, levelShortTitle, listUserCertificates } from "@/server/certificate-data";
import { getLevels } from "@/content";
import { absoluteUrl, routes, withBase } from "@/lib/paths";
import { cn, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { CopyLink } from "@/components/exam/copy-link";

export const metadata: Metadata = { title: "Certificats" };

export default async function CertificatsPage() {
  const user = await requireUser();
  const [{ access }, certs] = await Promise.all([loadAccess(user.id), listUserCertificates(user.id)]);
  const levels = getLevels();
  const obtained = levels.filter((l) => certs.some((c) => c.levelId === l.id && !c.revokedAt)).length;

  return (
    <div>
      <PageHeader
        title="Certificats"
        description={`Un certificat par niveau réussi, avec un lien public de vérification. ${obtained} sur ${levels.length} obtenu${obtained > 1 ? "s" : ""}.`}
      />
      <Stagger className="grid gap-4 md:grid-cols-2">
        {levels.map((level, i) => {
          const cert = certs.find((c) => c.levelId === level.id && !c.revokedAt) ?? certs.find((c) => c.levelId === level.id);
          const la = access.levels[level.id];
          const n = i + 1;
          const title = certificateShortTitle(level.id);
          const revoked = Boolean(cert?.revokedAt);
          return (
            <StaggerItem key={level.id}>
              <article
                className={cn("grid h-full grid-cols-[1fr_88px] border sm:grid-cols-[1fr_112px]", cert && !revoked ? "border-line-strong bg-bg-elev" : "border-dashed border-line-strong")}
                aria-label={`Niveau ${n} : ${title}`}
              >
                <div className="flex min-w-0 flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    {cert ? <StatusBadge status={revoked ? "revoked" : "valid"} /> : la?.unlocked ? <StatusBadge status={la.examUnlocked ? "available" : "in_progress"} /> : <StatusBadge status="locked" />}
                  </div>
                  <h2 className={cn("mt-4 text-[19px] leading-tight sm:text-[21px]", cert && !revoked ? "text-ink" : "text-ink-2")}>{title}</h2>
                  <p className="mt-1.5 text-[13px] text-ink-2">
                    {levelShortTitle(level.id)} · {level.hours} h
                  </p>

                  {cert ? (
                    <>
                      <dl className="mt-5 grid grid-cols-[max-content_1fr] gap-x-5 gap-y-1.5 text-[13px]">
                        <dt className="text-ink-3">Titulaire</dt>
                        <dd className="text-ink">{holderName(user)}</dd>
                        <dt className="text-ink-3">Délivré le</dt>
                        <dd className="text-ink">{formatDate(cert.issuedAt)}</dd>
                        <dt className="text-ink-3">Numéro</dt>
                        <dd className="num text-ink">{cert.number}</dd>
                      </dl>
                      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
                        <Button asChild variant="accent" size="sm">
                          <a href={withBase(routes.api.certificatePdf(cert.number))}>
                            <DownloadSimple size={13} aria-hidden /> Télécharger le PDF
                          </a>
                        </Button>
                        <Link href={routes.verify(cert.number)} className="text-[12.5px] text-accent underline-offset-4 hover:underline">
                          Page de vérification
                        </Link>
                        <CopyLink url={absoluteUrl(routes.verify(cert.number))} />
                      </div>
                    </>
                  ) : la?.unlocked ? (
                    <div className="mt-auto pt-6">
                      <div className="mb-2 flex justify-between text-[12px] text-ink-3">
                        <span>
                          {la.modulesCompleted} module{la.modulesCompleted > 1 ? "s" : ""} sur {la.modulesTotal}
                        </span>
                        <span className="num">{Math.round((la.lessonsCompleted / Math.max(1, la.lessonsTotal)) * 100)} %</span>
                      </div>
                      <Progress value={la.lessonsCompleted} max={la.lessonsTotal} label={`Progression du niveau ${n}`} />
                      <div className="mt-5">
                        {la.examUnlocked ? (
                          <Button asChild variant="primary" size="sm">
                            <Link href={routes.exam(level.id)}>Passer l&apos;examen</Link>
                          </Button>
                        ) : (
                          <Button asChild variant="secondary" size="sm">
                            <Link href={routes.level(level.id)}>Continuer le niveau</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-auto flex items-center gap-2 pt-6 text-[13px] text-ink-3">
                      <LockSimple size={14} aria-hidden /> S&apos;ouvre après l&apos;examen du niveau {n - 1}.
                    </p>
                  )}
                </div>
                <div className={cn("flex flex-col items-center justify-between border-l py-5", cert && !revoked ? "border-line-strong bg-bg-sunken" : "border-dashed border-line-strong")}>
                  <span className="text-[11px] text-ink-3">Niveau</span>
                  <span className={cn("font-display tabular-nums text-[64px] font-extralight leading-none sm:text-[80px]", cert && !revoked ? "text-accent" : "text-ink-3/60")}>{n}</span>
                  <span className="text-[11px] text-ink-3">sur 4</span>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
      <p className="mt-8 max-w-[80ch] text-[12.5px] text-ink-3">
        Certificat de réalisation et de compétences Next Formation : il prépare aux certifications tierces (Anthropic, Google, Microsoft, n8n…) et ne s&apos;y substitue pas.
      </p>
    </div>
  );
}
