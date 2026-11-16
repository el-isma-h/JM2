/**
 * Catalogue des fournisseurs d'API gérés depuis la page Développeur de HPT.
 *
 * Chaque fournisseur décrit :
 * - son adresse de base (fixe : la passerelle n'appelle jamais une autre adresse, sauf `urlLibre`) ;
 * - la façon de présenter la clé (`auth`) ;
 * - une vérification sans coût quand elle existe (`test`), sinon la clé est vérifiée au premier appel ;
 * - la variable d'environnement de repli (`env`) : si aucune clé n'est enregistrée dans HPT, celle du .env est utilisée.
 */

export type FamilleFournisseur = "ia" | "recherche" | "voix" | "image" | "business" | "pub" | "outils";

export type ModeAuth =
  | { type: "bearer" }
  | { type: "entete"; nom: string; prefixe?: string }
  | { type: "requete"; nom: string }
  | { type: "basic" }
  | { type: "aucune" };

export type Fournisseur = {
  id: string;
  nom: string;
  famille: FamilleFournisseur;
  description: string;
  /** Adresse de base ; vide si l'adresse est fournie par l'admin (`urlLibre`). */
  base: string;
  auth: ModeAuth;
  /** En-têtes fixes ajoutés à chaque appel (version d'API…), sauf si l'appelant les fournit. */
  entetes?: Record<string, string>;
  /** Vérification sans coût : chemin GET relatif à la base, ou adresse complète. */
  test?: string;
  env: string;
  /** L'admin saisit l'adresse (Ollama, Azure OpenAI, SAWM). */
  urlLibre?: boolean;
  urlParDefaut?: string;
  /** La clé n'est pas obligatoire (Ollama local). */
  sansCle?: boolean;
  /** Format attendu, affiché sous le champ. */
  format?: string;
  /** Fournisseur annoncé mais pas encore livré : enregistrable, inactif dans la passerelle. */
  enCours?: boolean;
  documentation: string;
};

export const FAMILLES: Record<FamilleFournisseur, { titre: string; description: string }> = {
  ia: { titre: "IA texte", description: "Modèles de langage, agents, raisonnement" },
  recherche: { titre: "Recherche et lecture du web", description: "Recherche en ligne, extraction de pages" },
  voix: { titre: "Voix et audio", description: "Synthèse vocale, transcription" },
  image: { titre: "Image et vidéo", description: "Génération et retouche d'images, vidéo" },
  business: { titre: "Entreprise, paiement, signature", description: "Données d'entreprises françaises, banque, paiement, e-mail, SMS, signature" },
  pub: { titre: "Publicité", description: "Régies publicitaires (utilisées par Next Ads)" },
  outils: { titre: "Outils et données", description: "Cartographie, e-mail transactionnel, collaboration, infrastructure" },
};

const bearer: ModeAuth = { type: "bearer" };

export const FOURNISSEURS: Fournisseur[] = [
  // ── IA texte ──────────────────────────────────────────────
  { id: "sawm", nom: "SAWM", famille: "ia", description: "API en cours de livraison — https://sawm.io", base: "", auth: bearer, env: "SAWM_API_KEY", urlLibre: true, enCours: true, documentation: "https://sawm.io" },
  { id: "openai", nom: "OpenAI", famille: "ia", description: "GPT, embeddings, images, voix", base: "https://api.openai.com/v1", auth: bearer, test: "/models", env: "OPENAI_API_KEY", format: "sk-…", documentation: "https://platform.openai.com/docs" },
  { id: "anthropic", nom: "Anthropic", famille: "ia", description: "Modèles Claude", base: "https://api.anthropic.com/v1", auth: { type: "entete", nom: "x-api-key" }, entetes: { "anthropic-version": "2023-06-01" }, test: "/models", env: "ANTHROPIC_API_KEY", format: "sk-ant-…", documentation: "https://docs.claude.com" },
  { id: "mistral", nom: "Mistral AI", famille: "ia", description: "Modèles Mistral, hébergés en Europe", base: "https://api.mistral.ai/v1", auth: bearer, test: "/models", env: "MISTRAL_API_KEY", documentation: "https://docs.mistral.ai" },
  { id: "perplexity", nom: "Perplexity", famille: "ia", description: "Réponses sourcées depuis le web (Sonar)", base: "https://api.perplexity.ai", auth: bearer, env: "PERPLEXITY_API_KEY", format: "pplx-…", documentation: "https://docs.perplexity.ai" },
  { id: "gemini", nom: "Google Gemini", famille: "ia", description: "Modèles Gemini (Google AI Studio)", base: "https://generativelanguage.googleapis.com/v1beta", auth: { type: "entete", nom: "x-goog-api-key" }, test: "/models", env: "GEMINI_API_KEY", documentation: "https://ai.google.dev/gemini-api/docs" },
  { id: "xai", nom: "xAI Grok", famille: "ia", description: "Modèles Grok (moteur de Next Ads et secours de HPT)", base: "https://api.x.ai/v1", auth: bearer, test: "/models", env: "XAI_API_KEY", format: "xai-…", documentation: "https://docs.x.ai" },
  { id: "deepseek", nom: "DeepSeek", famille: "ia", description: "Modèles DeepSeek", base: "https://api.deepseek.com", auth: bearer, test: "/models", env: "DEEPSEEK_API_KEY", documentation: "https://api-docs.deepseek.com" },
  { id: "groq", nom: "Groq", famille: "ia", description: "Inférence très rapide de modèles ouverts", base: "https://api.groq.com/openai/v1", auth: bearer, test: "/models", env: "GROQ_API_KEY", format: "gsk_…", documentation: "https://console.groq.com/docs" },
  { id: "cohere", nom: "Cohere", famille: "ia", description: "Command, embeddings, reranking", base: "https://api.cohere.com", auth: bearer, test: "/v1/models", env: "COHERE_API_KEY", documentation: "https://docs.cohere.com" },
  { id: "together", nom: "Together AI", famille: "ia", description: "Modèles ouverts hébergés", base: "https://api.together.xyz/v1", auth: bearer, test: "/models", env: "TOGETHER_API_KEY", documentation: "https://docs.together.ai" },
  { id: "fireworks", nom: "Fireworks AI", famille: "ia", description: "Modèles ouverts hébergés", base: "https://api.fireworks.ai/inference/v1", auth: bearer, test: "/models", env: "FIREWORKS_API_KEY", documentation: "https://docs.fireworks.ai" },
  { id: "openrouter", nom: "OpenRouter", famille: "ia", description: "Accès unifié à des centaines de modèles", base: "https://openrouter.ai/api/v1", auth: bearer, test: "/key", env: "OPENROUTER_API_KEY", format: "sk-or-…", documentation: "https://openrouter.ai/docs" },
  { id: "huggingface", nom: "Hugging Face", famille: "ia", description: "Modèles ouverts (Inference Providers)", base: "https://router.huggingface.co", auth: bearer, test: "https://huggingface.co/api/whoami-v2", env: "HF_TOKEN", format: "hf_…", documentation: "https://huggingface.co/docs/inference-providers" },
  { id: "azure-openai", nom: "Azure OpenAI", famille: "ia", description: "OpenAI hébergé sur votre ressource Azure", base: "", auth: { type: "entete", nom: "api-key" }, env: "AZURE_OPENAI_API_KEY", urlLibre: true, format: "Adresse : https://<ressource>.openai.azure.com", documentation: "https://learn.microsoft.com/azure/ai-services/openai/" },
  { id: "ollama", nom: "Ollama (local)", famille: "ia", description: "Modèles sur la machine HPT, aucune donnée ne sort", base: "", auth: { type: "aucune" }, test: "/api/tags", env: "OLLAMA_URL", urlLibre: true, urlParDefaut: "http://localhost:11434", sansCle: true, documentation: "https://github.com/ollama/ollama/blob/main/docs/api.md" },

  // ── Recherche et lecture du web ───────────────────────────
  { id: "tavily", nom: "Tavily", famille: "recherche", description: "Recherche web pour agents IA", base: "https://api.tavily.com", auth: bearer, env: "TAVILY_API_KEY", format: "tvly-…", documentation: "https://docs.tavily.com" },
  { id: "exa", nom: "Exa", famille: "recherche", description: "Recherche sémantique du web", base: "https://api.exa.ai", auth: { type: "entete", nom: "x-api-key" }, env: "EXA_API_KEY", documentation: "https://docs.exa.ai" },
  { id: "firecrawl", nom: "Firecrawl", famille: "recherche", description: "Lecture et extraction de sites", base: "https://api.firecrawl.dev", auth: bearer, env: "FIRECRAWL_API_KEY", format: "fc-…", documentation: "https://docs.firecrawl.dev" },
  { id: "brave", nom: "Brave Search", famille: "recherche", description: "Index de recherche indépendant", base: "https://api.search.brave.com", auth: { type: "entete", nom: "X-Subscription-Token" }, env: "BRAVE_API_KEY", documentation: "https://api-dashboard.search.brave.com/app/documentation" },
  { id: "serpapi", nom: "SerpApi", famille: "recherche", description: "Résultats Google, Maps, Shopping", base: "https://serpapi.com", auth: { type: "requete", nom: "api_key" }, test: "/account.json", env: "SERPAPI_API_KEY", documentation: "https://serpapi.com/search-api" },
  { id: "jina", nom: "Jina AI", famille: "recherche", description: "Lecture de pages, embeddings, reranking", base: "https://api.jina.ai", auth: bearer, env: "JINA_API_KEY", format: "jina_…", documentation: "https://jina.ai" },

  // ── Voix et audio ─────────────────────────────────────────
  { id: "elevenlabs", nom: "ElevenLabs", famille: "voix", description: "Voix de synthèse, clonage, doublage", base: "https://api.elevenlabs.io/v1", auth: { type: "entete", nom: "xi-api-key" }, test: "/user", env: "ELEVENLABS_API_KEY", documentation: "https://elevenlabs.io/docs" },
  { id: "deepgram", nom: "Deepgram", famille: "voix", description: "Transcription et voix en temps réel", base: "https://api.deepgram.com/v1", auth: { type: "entete", nom: "Authorization", prefixe: "Token " }, test: "/projects", env: "DEEPGRAM_API_KEY", documentation: "https://developers.deepgram.com" },
  { id: "assemblyai", nom: "AssemblyAI", famille: "voix", description: "Transcription et analyse audio", base: "https://api.assemblyai.com/v2", auth: { type: "entete", nom: "Authorization" }, test: "/transcript?limit=1", env: "ASSEMBLYAI_API_KEY", documentation: "https://www.assemblyai.com/docs" },
  { id: "cartesia", nom: "Cartesia", famille: "voix", description: "Voix de synthèse à faible latence", base: "https://api.cartesia.ai", auth: { type: "entete", nom: "X-API-Key" }, entetes: { "Cartesia-Version": "2024-06-10" }, env: "CARTESIA_API_KEY", documentation: "https://docs.cartesia.ai" },

  // ── Image et vidéo ────────────────────────────────────────
  { id: "stability", nom: "Stability AI", famille: "image", description: "Génération et retouche d'images", base: "https://api.stability.ai", auth: bearer, test: "/v1/user/account", env: "STABILITY_API_KEY", format: "sk-…", documentation: "https://platform.stability.ai/docs" },
  { id: "replicate", nom: "Replicate", famille: "image", description: "Milliers de modèles image, vidéo, audio", base: "https://api.replicate.com/v1", auth: bearer, test: "/account", env: "REPLICATE_API_TOKEN", format: "r8_…", documentation: "https://replicate.com/docs" },
  { id: "fal", nom: "fal", famille: "image", description: "Génération d'images et de vidéos rapide", base: "https://fal.run", auth: { type: "entete", nom: "Authorization", prefixe: "Key " }, env: "FAL_KEY", documentation: "https://docs.fal.ai" },
  { id: "bfl", nom: "Black Forest Labs", famille: "image", description: "Modèles d'image FLUX", base: "https://api.bfl.ai/v1", auth: { type: "entete", nom: "x-key" }, env: "BFL_API_KEY", documentation: "https://docs.bfl.ai" },
  { id: "ideogram", nom: "Ideogram", famille: "image", description: "Images avec texte lisible", base: "https://api.ideogram.ai", auth: { type: "entete", nom: "Api-Key" }, env: "IDEOGRAM_API_KEY", documentation: "https://developer.ideogram.ai" },
  { id: "runway", nom: "Runway", famille: "image", description: "Génération de vidéo", base: "https://api.dev.runwayml.com/v1", auth: bearer, entetes: { "X-Runway-Version": "2024-11-06" }, test: "/organization", env: "RUNWAYML_API_SECRET", documentation: "https://docs.dev.runwayml.com" },
  { id: "luma", nom: "Luma AI", famille: "image", description: "Génération de vidéo (Dream Machine)", base: "https://api.lumalabs.ai/dream-machine/v1", auth: bearer, env: "LUMA_API_KEY", documentation: "https://docs.lumalabs.ai" },
  { id: "heygen", nom: "HeyGen", famille: "image", description: "Vidéos avec avatars", base: "https://api.heygen.com", auth: { type: "entete", nom: "X-Api-Key" }, env: "HEYGEN_API_KEY", documentation: "https://docs.heygen.com" },

  // ── Entreprise, paiement, signature ───────────────────────
  { id: "pappers", nom: "Pappers", famille: "business", description: "Données légales et financières des entreprises françaises", base: "https://api.pappers.fr/v2", auth: { type: "requete", nom: "api_token" }, env: "PAPPERS_API_KEY", documentation: "https://www.pappers.fr/api/documentation" },
  { id: "insee", nom: "INSEE Sirene", famille: "business", description: "Répertoire officiel des entreprises (SIREN, SIRET)", base: "https://api.insee.fr/api-sirene/3.11", auth: { type: "entete", nom: "X-INSEE-Api-Key-Integration" }, test: "/informations", env: "INSEE_API_KEY", documentation: "https://portail-api.insee.fr" },
  { id: "api-entreprise", nom: "API Entreprise", famille: "business", description: "Attestations URSSAF, fiscales, Kbis (administrations)", base: "https://entreprise.api.gouv.fr", auth: bearer, env: "API_ENTREPRISE_TOKEN", documentation: "https://entreprise.api.gouv.fr/developpeurs" },
  { id: "stripe", nom: "Stripe", famille: "business", description: "Paiements et abonnements HPT", base: "https://api.stripe.com/v1", auth: bearer, test: "/balance", env: "STRIPE_SECRET_KEY", format: "sk_test_… ou sk_live_…", documentation: "https://docs.stripe.com/api" },
  { id: "qonto", nom: "Qonto", famille: "business", description: "Compte professionnel, transactions", base: "https://thirdparty.qonto.com/v2", auth: { type: "entete", nom: "Authorization" }, test: "/organization", env: "QONTO_API_KEY", format: "identifiant:clé-secrète", documentation: "https://api-doc.qonto.com" },
  { id: "pennylane", nom: "Pennylane", famille: "business", description: "Comptabilité et facturation", base: "https://app.pennylane.com/api/external/v2", auth: bearer, env: "PENNYLANE_API_KEY", documentation: "https://pennylane.readme.io" },
  { id: "gocardless", nom: "GoCardless", famille: "business", description: "Prélèvements SEPA", base: "https://api.gocardless.com", auth: bearer, entetes: { "GoCardless-Version": "2015-07-06" }, env: "GOCARDLESS_ACCESS_TOKEN", documentation: "https://developer.gocardless.com" },
  { id: "brevo", nom: "Brevo", famille: "business", description: "E-mails et SMS marketing (ex-Sendinblue)", base: "https://api.brevo.com/v3", auth: { type: "entete", nom: "api-key" }, test: "/account", env: "BREVO_API_KEY", format: "xkeysib-…", documentation: "https://developers.brevo.com" },
  { id: "twilio", nom: "Twilio", famille: "business", description: "SMS, appels, WhatsApp", base: "https://api.twilio.com/2010-04-01", auth: { type: "basic" }, test: "/Accounts.json", env: "TWILIO_API_KEY", format: "SID du compte:jeton d'authentification", documentation: "https://www.twilio.com/docs" },
  { id: "yousign", nom: "Yousign", famille: "business", description: "Signature électronique française", base: "https://api.yousign.app/v3", auth: bearer, env: "YOUSIGN_API_KEY", documentation: "https://developers.yousign.com" },
  { id: "docusign", nom: "DocuSign", famille: "business", description: "Signature électronique (jeton OAuth)", base: "", auth: bearer, env: "DOCUSIGN_ACCESS_TOKEN", urlLibre: true, urlParDefaut: "https://demo.docusign.net/restapi", format: "Jeton d'accès OAuth", documentation: "https://developers.docusign.com" },

  // ── Publicité ─────────────────────────────────────────────
  { id: "meta", nom: "Meta (Facebook, Instagram)", famille: "pub", description: "Graph API et Marketing API", base: "https://graph.facebook.com/v21.0", auth: bearer, test: "/me", env: "META_ACCESS_TOKEN", format: "Jeton d'accès système", documentation: "https://developers.facebook.com/docs/marketing-apis" },
  { id: "google-ads", nom: "Google Ads", famille: "pub", description: "Campagnes Google (jeton OAuth + jeton développeur)", base: "https://googleads.googleapis.com", auth: bearer, env: "GOOGLE_ADS_ACCESS_TOKEN", format: "Jeton d'accès OAuth", documentation: "https://developers.google.com/google-ads/api/docs/start" },
  { id: "tiktok-ads", nom: "TikTok Ads", famille: "pub", description: "TikTok API for Business", base: "https://business-api.tiktok.com/open_api/v1.3", auth: { type: "entete", nom: "Access-Token" }, env: "TIKTOK_ADS_ACCESS_TOKEN", documentation: "https://business-api.tiktok.com/portal/docs" },
  { id: "linkedin", nom: "LinkedIn", famille: "pub", description: "Marketing et publication", base: "https://api.linkedin.com", auth: bearer, env: "LINKEDIN_ACCESS_TOKEN", format: "Jeton d'accès OAuth", documentation: "https://learn.microsoft.com/linkedin/" },
  { id: "snapchat-ads", nom: "Snapchat Ads", famille: "pub", description: "Marketing API Snapchat", base: "https://adsapi.snapchat.com/v1", auth: bearer, env: "SNAPCHAT_ADS_ACCESS_TOKEN", documentation: "https://developers.snap.com/api/marketing-api" },

  // ── Outils et données ─────────────────────────────────────
  { id: "google-maps", nom: "Google Maps", famille: "outils", description: "Géocodage, adresses, itinéraires", base: "https://maps.googleapis.com/maps/api", auth: { type: "requete", nom: "key" }, env: "GOOGLE_MAPS_API_KEY", documentation: "https://developers.google.com/maps" },
  { id: "mapbox", nom: "Mapbox", famille: "outils", description: "Cartes et géocodage", base: "https://api.mapbox.com", auth: { type: "requete", nom: "access_token" }, env: "MAPBOX_ACCESS_TOKEN", format: "pk.… ou sk.…", documentation: "https://docs.mapbox.com/api" },
  { id: "resend", nom: "Resend", famille: "outils", description: "E-mails transactionnels", base: "https://api.resend.com", auth: bearer, test: "/domains", env: "RESEND_API_KEY", format: "re_…", documentation: "https://resend.com/docs" },
  { id: "sendgrid", nom: "SendGrid", famille: "outils", description: "E-mails transactionnels", base: "https://api.sendgrid.com/v3", auth: bearer, test: "/scopes", env: "SENDGRID_API_KEY", format: "SG.…", documentation: "https://www.twilio.com/docs/sendgrid" },
  { id: "slack", nom: "Slack", famille: "outils", description: "Messages et alertes dans Slack", base: "https://slack.com/api", auth: bearer, test: "/auth.test", env: "SLACK_BOT_TOKEN", format: "xoxb-…", documentation: "https://api.slack.com" },
  { id: "notion", nom: "Notion", famille: "outils", description: "Pages et bases Notion", base: "https://api.notion.com/v1", auth: bearer, entetes: { "Notion-Version": "2022-06-28" }, test: "/users/me", env: "NOTION_API_KEY", format: "ntn_… ou secret_…", documentation: "https://developers.notion.com" },
  { id: "airtable", nom: "Airtable", famille: "outils", description: "Bases Airtable", base: "https://api.airtable.com/v0", auth: bearer, test: "/meta/whoami", env: "AIRTABLE_API_KEY", format: "pat…", documentation: "https://airtable.com/developers/web/api" },
  { id: "hubspot", nom: "HubSpot", famille: "outils", description: "CRM, contacts, transactions", base: "https://api.hubapi.com", auth: bearer, env: "HUBSPOT_ACCESS_TOKEN", format: "pat-…", documentation: "https://developers.hubspot.com/docs/api" },
  { id: "github", nom: "GitHub", famille: "outils", description: "Dépôts et automatisations", base: "https://api.github.com", auth: bearer, test: "/user", env: "GITHUB_TOKEN", format: "ghp_… ou github_pat_…", documentation: "https://docs.github.com/rest" },
  { id: "cloudflare", nom: "Cloudflare", famille: "outils", description: "DNS, sécurité, Workers", base: "https://api.cloudflare.com/client/v4", auth: bearer, test: "/user/tokens/verify", env: "CLOUDFLARE_API_TOKEN", documentation: "https://developers.cloudflare.com/api" },
];

export const fournisseurParId = (id: string) => FOURNISSEURS.find((f) => f.id === id);

/** Aperçu masqué d'une clé : « sk-p…a4F2 ». */
export function masquer(valeur: string): string {
  const v = valeur.trim();
  if (v.length <= 8) return "••••";
  return `${v.slice(0, 4)}…${v.slice(-4)}`;
}
