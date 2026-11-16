/**
 * Connexion PostgreSQL partagée (pool `pg` + Drizzle).
 *
 * Pas de `import "server-only"` ici : ce module est aussi utilisé par les scripts (setup, migrations) et les tests.
 * Il ne doit JAMAIS être importé depuis un composant client (`pg` ne fonctionne pas dans le navigateur).
 */
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export { schema };
export type Db = NodePgDatabase<typeof schema>;

const DEFAULT_URL = "postgresql://nfia:nfia@localhost:5433/nfia";

type GlobalWithDb = typeof globalThis & { __nfiaPool?: Pool; __nfiaDb?: Db };
const g = globalThis as GlobalWithDb;

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL ?? DEFAULT_URL,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  });
}

/** Pool unique par processus (réutilisé entre rechargements à chaud en développement). */
export const pool: Pool = g.__nfiaPool ?? (g.__nfiaPool = createPool());
export const db: Db = g.__nfiaDb ?? (g.__nfiaDb = drizzle(pool, { schema }));

/** Transaction Drizzle (argument du callback de `db.transaction`). */
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
/** Les fonctions de service acceptent la base OU une transaction en cours. */
export type DbOrTx = Db | Tx;
