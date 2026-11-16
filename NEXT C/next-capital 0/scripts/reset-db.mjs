// Supprime la base de démonstration et les pièces : elle sera recréée au prochain démarrage.
import fs from "node:fs";
import path from "node:path";
const dossier = path.join(process.cwd(), "data");
fs.rmSync(dossier, { recursive: true, force: true });
console.log("Base de démonstration supprimée : relancez `npm run dev`.");
