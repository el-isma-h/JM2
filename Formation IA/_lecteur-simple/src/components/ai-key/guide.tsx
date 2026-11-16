"use client";

/**
 * Guide pas à pas pour obtenir une clé API : un onglet par fournisseur, quatre étapes (un vrai déroulé, d'où la
 * numérotation), chacune illustrée par un écran schématique. L'apprenant coche les étapes faites ; les quatre
 * cochées, le formulaire d'enregistrement est mis en avant.
 */
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowSquareOut, Check, Copy, CreditCard, Key, UserPlus } from "@phosphor-icons/react";
import { AI_PROVIDERS, PROVIDERS, estimateSessionCost, type AiProviderId } from "@/lib/ai";
import { cn } from "@/lib/utils";

type Step = { title: string; body: React.ReactNode; link?: { href: string; label: string }; screen: React.ReactNode };

function steps(p: AiProviderId): Step[] {
  const info = PROVIDERS[p];
  const host = new URL(info.consoleUrl).host;
  const credit =
    p === "anthropic"
      ? "Dans Settings › Billing, ajoutez un moyen de paiement et achetez des crédits (le minimum suffit pour des mois de tutorat)."
      : p === "openai"
        ? "Dans Settings › Billing, ajoutez une carte puis un crédit prépayé. Désactivez la recharge automatique si vous voulez un plafond strict."
        : "Dans la console, ouvrez la facturation de l'équipe et ajoutez des crédits prépayés.";
  const create =
    p === "anthropic"
      ? "Ouvrez Settings › API keys, cliquez sur « Create key », nommez-la « Next Formation » et choisissez le workspace par défaut."
      : p === "openai"
        ? "Ouvrez API keys, cliquez sur « Create new secret key », nommez-la « Next Formation », projet par défaut, permissions « All »."
        : "Ouvrez API Keys, cliquez sur « Create API key », nommez-la « Next Formation » et laissez les modèles autorisés par défaut.";
  return [
    {
      title: "Créer le compte",
      body: (
        <>
          Rendez-vous sur <span className="num text-ink">{host}</span> et inscrivez-vous avec votre e-mail professionnel. Ce compte « développeur » est distinct d&apos;un abonnement {info.name} grand public : votre abonnement éventuel ne donne pas accès à l&apos;API.
        </>
      ),
      link: { href: info.consoleUrl, label: `Ouvrir ${host}` },
      screen: <ScreenSignup host={host} />,
    },
    { title: "Ajouter du crédit", body: credit, link: { href: info.billingUrl, label: "Ouvrir la facturation" }, screen: <ScreenCredit /> },
    { title: "Créer la clé", body: create, link: { href: info.keysUrl, label: "Ouvrir la page des clés" }, screen: <ScreenCreate prefix={info.keyPrefix} /> },
    {
      title: "La copier",
      body: (
        <>
          La clé complète ne s&apos;affiche <strong className="text-ink">qu&apos;une seule fois</strong>. Copiez-la tout de suite et collez-la dans le formulaire plus bas. Si vous la perdez, révoquez-la et créez-en une autre.
        </>
      ),
      screen: <ScreenCopy example={info.keyExample} />,
    },
  ];
}

export function ApiKeyGuide() {
  const reduce = useReducedMotion();
  const [provider, setProvider] = React.useState<AiProviderId>("anthropic");
  const [done, setDone] = React.useState<Record<string, boolean>>({});
  const [active, setActive] = React.useState(0);

  const list = steps(provider);
  const key = (i: number) => `${provider}:${i}`;
  const count = list.filter((_, i) => done[key(i)]).length;
  const step = list[active];

  function toggle(i: number) {
    setDone((d) => ({ ...d, [key(i)]: !d[key(i)] }));
    if (!done[key(i)] && i < list.length - 1) setActive(i + 1);
  }

  return (
    <div className="border border-line bg-bg-elev">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 pt-4">
        <div className="flex gap-6" role="tablist" aria-label="Fournisseur">
          {AI_PROVIDERS.map((p) => (
            <button
              key={p}
              role="tab"
              type="button"
              aria-selected={provider === p}
              onClick={() => {
                setProvider(p);
                setActive(0);
              }}
              className={cn("relative pb-3 text-[14px] transition-colors", provider === p ? "text-ink" : "text-ink-3 hover:text-ink")}
            >
              {PROVIDERS[p].company}
              {provider === p ? <motion.span layoutId="guide-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-accent" /> : null}
            </button>
          ))}
        </div>
        <p className="pb-3 text-[12.5px] text-ink-3">
          <span className="num text-ink">{count}</span> / 4 étapes faites
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <ol className="divide-y divide-line">
          {list.map((s, i) => {
            const isDone = Boolean(done[key(i)]);
            return (
              <li key={s.title} className={cn("transition-colors", active === i && "bg-bg")}>
                <div className="flex items-start gap-4 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={isDone}
                    aria-label={isDone ? `Étape ${i + 1} faite, annuler` : `Marquer l'étape ${i + 1} comme faite`}
                    className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-[12px] transition-colors duration-300", isDone ? "border-accent bg-accent text-accent-ink" : "border-line-strong text-ink hover:border-ink")}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isDone ? (
                        <motion.span key="ok" initial={reduce ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 500, damping: 24 }}>
                          <Check size={15} weight="bold" />
                        </motion.span>
                      ) : (
                        <motion.span key="n" initial={false} animate={{ opacity: 1 }}>
                          {i + 1}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <div className="min-w-0 flex-1">
                    <button type="button" onClick={() => setActive(i)} className={cn("text-left text-[15px] transition-colors", isDone ? "text-ink-2 line-through decoration-line-strong" : "text-ink hover:text-accent")}>
                      {s.title}
                    </button>
                    <AnimatePresence initial={false}>
                      {active === i ? (
                        <motion.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }} className="overflow-hidden">
                          <p className="mt-2 max-w-[56ch] text-[13.5px] text-ink-2">{s.body}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            {s.link ? (
                              <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-accent underline-offset-4 hover:underline">
                                {s.link.label} <ArrowSquareOut size={13} />
                              </a>
                            ) : null}
                            {!isDone ? (
                              <button type="button" onClick={() => toggle(i)} className="text-[13px] text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                                C&apos;est fait
                              </button>
                            ) : null}
                          </div>
                          <div className="mt-4 lg:hidden">{s.screen}</div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="hidden border-l border-line bg-bg-sunken p-8 lg:flex lg:items-center lg:justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={`${provider}-${active}`} className="w-full max-w-[420px]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}>
              {step.screen}
              <p className="mt-3 text-center text-[11.5px] text-ink-3">Schéma indicatif : l&apos;écran réel peut différer légèrement.</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {count === 4 ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <a href="#enregistrer" className="flex items-center justify-between gap-3 border-t border-accent bg-accent px-5 py-3.5 text-[13.5px] text-accent-ink">
              <span>Votre clé est copiée : enregistrez-la maintenant.</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Aller au formulaire</span>
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ---------- Écrans schématiques ----------

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ecran" aria-hidden>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="h-2 w-2 border border-line-strong" />
        <span className="h-2 w-2 border border-line-strong" />
        <span className="ml-2 truncate font-mono text-[10px] text-ink-3">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Bar({ w, strong }: { w: string; strong?: boolean }) {
  return <span className={cn("block h-2", strong ? "bg-ink/70" : "bg-ink/10")} style={{ width: w }} />;
}

function ScreenSignup({ host }: { host: string }) {
  return (
    <Frame title={`${host}/signup`}>
      <UserPlus size={22} weight="light" className="text-accent" />
      <div className="mt-4 space-y-3">
        <Bar w="45%" strong />
        <div className="h-8 border border-line-strong px-2 py-2.5">
          <Bar w="60%" />
        </div>
        <div className="h-8 border border-line-strong px-2 py-2.5">
          <Bar w="35%" />
        </div>
        <div className="flex h-8 items-center justify-center bg-ink font-mono text-[9px] uppercase tracking-[0.2em] text-bg">Continuer</div>
      </div>
    </Frame>
  );
}

function ScreenCredit() {
  return (
    <Frame title="settings / billing">
      <div className="flex items-center justify-between">
        <CreditCard size={22} weight="light" className="text-accent" />
        <span className="num text-[11px] text-ink-3">Solde</span>
      </div>
      <p className="num mt-3 text-[28px] font-light text-ink">5,00 $</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["5 $", "10 $", "25 $"].map((v, i) => (
          <span key={v} className={cn("border px-2 py-2 text-center font-mono text-[10px]", i === 0 ? "border-accent text-accent" : "border-line-strong text-ink-3")}>
            {v}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10.5px] text-ink-3">
        <span>Recharge automatique</span>
        <span className="inline-flex h-3.5 w-7 items-center border border-line-strong p-[2px]">
          <span className="h-2 w-2 bg-ink/40" />
        </span>
      </div>
    </Frame>
  );
}

function ScreenCreate({ prefix }: { prefix: string }) {
  return (
    <Frame title="api-keys">
      <div className="flex items-center justify-between">
        <Key size={22} weight="light" className="text-accent" />
        <span className="bg-ink px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-bg">+ Create key</span>
      </div>
      <div className="mt-4 border border-line-strong bg-bg p-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">Name</p>
        <p className="mt-1 border-b border-ink pb-1 text-[12px] text-ink">Next Formation</p>
      </div>
      <div className="mt-3 space-y-2 text-[10.5px] text-ink-3">
        {["Ancienne clé", "Tests"].map((n) => (
          <div key={n} className="flex items-center justify-between border-b border-line pb-2">
            <span>{n}</span>
            <span className="num">{prefix}…••••</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ScreenCopy({ example }: { example: string }) {
  const reduce = useReducedMotion();
  const base = example.replace("…", "");
  const full = `${base}${"x7Kq2mVp9LwR4tYc".slice(0, 16 - Math.min(base.length, 8))}…`;
  return (
    <Frame title="api-keys / new">
      <p className="text-[12px] text-ink">Enregistrez cette clé maintenant</p>
      <p className="mt-1 text-[10.5px] text-ink-3">Elle ne sera plus affichée.</p>
      <div className="mt-4 flex items-center border border-accent">
        <motion.span className="num min-w-0 flex-1 truncate px-2.5 py-2 text-[11.5px] text-ink" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={reduce ? { duration: 0 } : { duration: 1.1, ease: "linear" }}>
          {full}
        </motion.span>
        <span className="flex items-center gap-1 self-stretch bg-accent px-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent-ink">
          <Copy size={11} /> Copier
        </span>
      </div>
    </Frame>
  );
}

// ---------- Coûts ----------

export function CostEstimator({ lessonTokens = 5500 }: { lessonTokens?: number }) {
  const [questions, setQuestions] = React.useState(10);
  const rows = AI_PROVIDERS.flatMap((p) => PROVIDERS[p].models.slice(0, 2).map((m) => ({ p, m, cost: estimateSessionCost(m, { questions, lessonTokens }) })));
  const nf = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const usd = { format: (v: number) => `${nf.format(v)} $` };
  return (
    <div>
      <label htmlFor="q-count" className="flex flex-wrap items-baseline justify-between gap-2 text-[13.5px] text-ink-2">
        <span>Questions posées au tuteur pendant une session</span>
        <span className="num text-[22px] font-light text-ink">{questions}</span>
      </label>
      <input id="q-count" type="range" min={1} max={40} value={questions} onChange={(e) => setQuestions(Number(e.target.value))} className="mt-3 w-full accent-[var(--accent)]" />
      <div className="mt-5 overflow-x-auto">
      <table className="data-table text-[13px]">
        <thead>
          <tr>
            <th>Modèle</th>
            <th className="num hidden sm:table-cell">Prix entrée / sortie</th>
            <th className="num">Session</th>
            <th className="num">30 sessions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ p, m, cost }, i) => (
            <tr key={m.id}>
              <td>
                <span className="whitespace-nowrap text-ink">{m.label.split(" — ")[0]}</span>
                <p className="text-[11.5px] text-ink-3">
                  {PROVIDERS[p].company}
                  {i % 2 === 0 ? <span className="text-accent"> · par défaut</span> : null}
                </p>
              </td>
              <td className="num hidden text-ink-2 sm:table-cell">
                {m.inputPerMTok.toLocaleString("fr-FR")} / {m.outputPerMTok.toLocaleString("fr-FR")} $
              </td>
              <td className="num">{usd.format(cost.usd)}</td>
              <td className="num">{usd.format(cost.usd * 30)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="mt-3 text-[12px] text-ink-3">
        Calcul : chaque question renvoie la leçon (≈ {lessonTokens.toLocaleString("fr-FR")} tokens) et l&apos;historique de la conversation, la réponse fait ≈ 450 tokens. Prix publics en dollars par million de tokens, relevés en novembre 2026, hors taxes et hors
        remises de cache : à vérifier sur le site du fournisseur.
      </p>
    </div>
  );
}
