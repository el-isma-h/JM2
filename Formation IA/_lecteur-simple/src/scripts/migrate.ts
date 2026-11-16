/** `npm run db:migrate` : applique les migrations de drizzle/ (idempotent). */
import { runMigrations } from "./migrate-lib";
import { pool } from "@/db";

runMigrations()
  .then(() => console.log("OK migrations appliquées"))
  .catch((e) => {
    console.error("Échec des migrations :", e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
