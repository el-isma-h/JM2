// Lecteur local de la Formation IA — aucune dépendance (Node 20+).
// Usage : node app/server.mjs   puis ouvrir http://localhost:4000
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const PORT = Number(process.env.PORT ?? 4000);

const routes = {
  "/": [join(here, "index.html"), "text/html; charset=utf-8"],
  "/app.js": [join(here, "app.js"), "text/javascript; charset=utf-8"],
  "/style.css": [join(here, "style.css"), "text/css; charset=utf-8"],
  "/data/modules.json": [join(root, "export", "elearning-modules.json"), "application/json; charset=utf-8"],
  "/data/catalogue.json": [join(root, "export", "programme-catalogue.json"), "application/json; charset=utf-8"],
};

createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  const route = routes[path];
  if (!route) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Introuvable");
    return;
  }
  try {
    // Relu à chaque requête : une reconstruction (node scripts/build.mjs) est visible sans redémarrer.
    const body = await readFile(route[0]);
    res.writeHead(200, { "content-type": route[1], "cache-control": "no-store" }).end(body);
  } catch (e) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end(String(e));
  }
}).listen(PORT, "127.0.0.1", () => console.log(`Formation IA : http://localhost:${PORT}`));
