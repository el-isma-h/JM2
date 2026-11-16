// npx tsx src/cli.ts "texte de la demande"
import { modeSimulation, traiterDemande } from "./orchestrateur.js";

const demande = process.argv[2] ?? "Bonjour, je voudrais ajouter 3 prises dans le salon et déplacer l'interrupteur du couloir. Maison de 1998. Mme Fabre";
console.log(`Mode : ${modeSimulation() ? "SIMULATION (sans clé, aucun appel réseau)" : "RÉEL (API Anthropic)"}`);
traiterDemande(demande).then((d) => console.log(JSON.stringify(d, null, 2)));
