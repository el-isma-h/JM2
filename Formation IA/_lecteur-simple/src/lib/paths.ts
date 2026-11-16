/**
 * Chemins et URL. Next ajoute automatiquement le basePath (/ia) aux <Link>, redirect() et router.push().
 * Il NE l'ajoute PAS à fetch(), aux <form action="…">, aux <img src> bruts ni aux URL absolues : utiliser `withBase`.
 */
export const BASE_PATH = "/ia";

/** Préfixe un chemin interne par /ia (pour fetch côté client, formulaires vers un route handler, liens e-mail). */
export function withBase(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return path === "/" ? BASE_PATH : `${BASE_PATH}${path}`;
}

/** URL absolue publique (e-mails d'invitation, QR code de certificat). APP_URL = origine sans /ia. */
export function absoluteUrl(path: string): string {
  const origin = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "").replace(/\/ia$/, "");
  return `${origin}${withBase(path)}`;
}

/** Routes de l'application (sans basePath) : à utiliser plutôt que des chaînes en dur. */
export const routes = {
  home: "/",
  login: "/connexion",
  logout: "/deconnexion",
  invitation: (token: string) => `/invitation/${encodeURIComponent(token)}`,
  parcours: "/parcours",
  level: (levelId: string) => `/parcours/${levelId.toLowerCase()}`,
  lesson: (lessonId: string) => `/lecon/${lessonId}`,
  quiz: (moduleId: string) => `/quiz/${moduleId}`,
  exam: (levelId: string) => `/examen/${levelId.toLowerCase()}`,
  examTake: (levelId: string) => `/examen/${levelId.toLowerCase()}/passer`,
  examResult: (levelId: string, attemptId: string) => `/examen/${levelId.toLowerCase()}/resultat/${attemptId}`,
  certificates: "/certificats",
  verify: (number: string) => `/verifier/${encodeURIComponent(number)}`,
  badges: "/badges",
  profile: "/profil",
  apiKey: "/cle-api",
  resources: "/ressources",
  admin: "/admin",
  adminLearners: "/admin/apprenants",
  adminLearner: (id: string) => `/admin/apprenants/${id}`,
  adminInvitations: "/admin/invitations",
  adminExports: "/admin/exports",
  adminSettings: "/admin/reglages",
  api: {
    tutor: "/api/tutor",
    time: "/api/time",
    certificatePdf: (number: string) => `/api/certificats/${encodeURIComponent(number)}/pdf`,
    adminExport: (type: string) => `/api/admin/export/${type}`,
    demoLogin: "/api/auth/demo",
    health: "/api/health",
  },
} as const;

/** Segment d'URL de niveau (« n1 » ou « N1 ») → id de niveau « N1 » ; null si invalide. */
export function levelIdFromParam(param: string): string | null {
  const m = /^n([1-9])$/i.exec(param);
  return m ? `N${m[1]}` : null;
}

/** Segment d'URL de module (« m01 » / « M01 ») → « M01 ». */
export function moduleIdFromParam(param: string): string | null {
  const m = /^m(\d{2})$/i.exec(param);
  return m ? `M${m[1]}` : null;
}

/** Segment d'URL de leçon (« l001 » / « L001 ») → « L001 ». */
export function lessonIdFromParam(param: string): string | null {
  const m = /^l(\d{3})$/i.exec(param);
  return m ? `L${m[1]}` : null;
}
