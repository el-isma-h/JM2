import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "@/db";

/** Dossier des migrations : MIGRATIONS_DIR ou ./drizzle (racine de l'app, aussi dans l'image Docker). */
export function migrationsFolder(): string {
  return process.env.MIGRATIONS_DIR ?? path.resolve(process.cwd(), "drizzle");
}

export async function runMigrations(): Promise<void> {
  await migrate(db, { migrationsFolder: migrationsFolder() });
}
