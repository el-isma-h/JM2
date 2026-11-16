import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { requireUser } from "@/server/auth";
import { db, schema } from "@/db";
import { BADGES, type BadgeCategory } from "@/domain";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/surface";
import { Progress } from "@/components/ui/progress";
import { BadgeGrid, type BadgeCard } from "@/components/badges/badge-grid";

export const metadata: Metadata = { title: "Badges" };

const CATEGORIES: { id: BadgeCategory; title: string }[] = [
  { id: "progression", title: "Progression" },
  { id: "maitrise", title: "Maîtrise" },
  { id: "regularite", title: "Régularité" },
  { id: "certification", title: "Certification" },
  { id: "exploration", title: "Exploration" },
];

export default async function BadgesPage() {
  const user = await requireUser();
  const owned = await db.select({ badgeId: schema.userBadges.badgeId, at: schema.userBadges.at }).from(schema.userBadges).where(eq(schema.userBadges.userId, user.id));
  const at = new Map(owned.map((o) => [o.badgeId, o.at]));
  const groups = CATEGORIES.map((c) => ({
    id: c.id,
    title: c.title,
    badges: BADGES.filter((b) => b.category === c.id).map(
      (b): BadgeCard => ({ id: b.id, title: b.title, description: b.description, icon: b.icon, category: b.category, earnedAt: at.get(b.id)?.toISOString() ?? null, earnedLabel: at.has(b.id) ? formatDate(at.get(b.id)) : null }),
    ),
  }));
  const count = BADGES.filter((b) => at.has(b.id)).length;

  return (
    <div>
      <PageHeader
        title="Badges"
        description="Chaque badge récompense une étape de votre apprentissage. Ils ne se perdent jamais."
        actions={
          <div className="w-full sm:w-48">
            <p className="num text-[13px] text-ink sm:text-right">
              {count} <span className="text-ink-3">/ {BADGES.length}</span>
            </p>
            <Progress className="mt-2" value={count} max={BADGES.length} label="Badges obtenus" />
          </div>
        }
      />
      <BadgeGrid groups={groups} />
    </div>
  );
}
