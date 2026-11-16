import type { TheseId } from "./fonds";

/**
 * Études de marché par thèse, construites uniquement à partir de publications
 * de BlackRock, J.P. Morgan, Morgan Stanley et Goldman Sachs (lues le 16/10/2026).
 * Chaque chiffre renvoie à sa source. Rien n'est extrapolé : quand une maison
 * n'a pas publié d'étude chiffrée sur un secteur, c'est indiqué tel quel.
 */

export type Banque = "BlackRock" | "J.P. Morgan" | "Morgan Stanley" | "Goldman Sachs";

export interface Bilingue { fr: string; en: string }

export interface Chiffre {
  valeur: string;
  libelle: Bilingue;
  banque: Banque;
  url: string;
  date: string; // AAAA-MM
}

export interface Etude {
  banque: Banque;
  titre: string; // titre original
  date: string; // AAAA-MM-JJ ou AAAA-MM
  url: string;
  points: Bilingue[];
  chiffree: boolean; // false = publication qualitative
}

export interface EtudeMarche {
  these: TheseId;
  synthese: Bilingue;
  chiffres: Chiffre[];
  etudes: Etude[];
  lecture: Bilingue; // ce que NEXT Capital en retient pour sa thèse
}

export const ETUDES_MARCHE: EtudeMarche[] = [
  {
    these: "ia",
    synthese: {
      fr: "Les quatre maisons convergent : l'IA est entrée dans une phase de construction d'infrastructures sans précédent (de l'ordre de 1 000 milliards de dollars d'investissement mondial en 2026 selon Goldman Sachs), dont le retour sur investissement reste le sujet central du débat. BlackRock décrit trois phases (construction, adoption, transformation) ; J.P. Morgan souligne que le capex IA pèse encore moins sur le PIB que les cycles télécoms ou pétrole de schiste.",
      en: "All four houses converge: AI has entered an unprecedented infrastructure build-out (around $1 trillion of global investment in 2026 according to Goldman Sachs), whose return on investment remains the central debate. BlackRock describes three phases (build-out, adoption, transformation); J.P. Morgan notes that AI capex still weighs less on GDP than the telecom or shale cycles did.",
    },
    chiffres: [
      { valeur: "~1 000 Md$", libelle: { fr: "investissement mondial en IA prévu en 2026 (dont 581 Md$ aux États-Unis)", en: "global AI investment forecast for 2026 (of which $581bn in the US)" }, banque: "Goldman Sachs", url: "https://www.goldmansachs.com/insights/articles/global-investment-is-forecast-to-exceed-1-trillion-in-2026", date: "2026-08" },
      { valeur: "1 800 Md$", libelle: { fr: "investissements cumulés en IA depuis 2022, fin 2026", en: "cumulative AI investment since 2022, by end-2026" }, banque: "Goldman Sachs", url: "https://www.goldmansachs.com/insights/articles/global-investment-is-forecast-to-exceed-1-trillion-in-2026", date: "2026-08" },
      { valeur: "> 3 000 Md$", libelle: { fr: "capex d'infrastructures IA attendu d'ici 2028", en: "AI infrastructure capex expected through 2028" }, banque: "Morgan Stanley", url: "https://www.morganstanley.com/insights/articles/ai-diffusion-tech-roundtable", date: "2025-07" },
      { valeur: "> 700 Md$ / an", libelle: { fr: "investissements dans les data centers et puces IA d'ici 2030, soit plus de 2 % du PIB américain", en: "data-center and AI-chip investment by 2030, over 2% of US GDP" }, banque: "BlackRock", url: "https://www.blackrock.com/corporate/insights/blackrock-investment-institute/publications/mega-forces/artificial-intelligence", date: "2024-11" },
      { valeur: "1,05 % du PIB", libelle: { fr: "poids du capex IA, contre 2,67 % pour les télécoms en 2000 et 4,75 % pour le pétrole de schiste", en: "AI capex weight, vs 2.67% for telecoms in 2000 and 4.75% for shale" }, banque: "J.P. Morgan", url: "https://www.jpmorgan.com/insights/markets-and-economy/top-market-takeaways/tmt-4-trends-were-watching-in-the-artificial-intelligence-investing-space", date: "2025-09" },
      { valeur: "+60 %", libelle: { fr: "hausse de l'adoption de l'IA par les entreprises américaines sur un an ; 9,1 % l'utilisent pour produire", en: "year-on-year rise in AI adoption by US firms; 9.1% use it in production" }, banque: "J.P. Morgan", url: "https://www.jpmorgan.com/insights/markets-and-economy/top-market-takeaways/tmt-4-trends-were-watching-in-the-artificial-intelligence-investing-space", date: "2025-09" },
    ],
    etudes: [
      { banque: "Goldman Sachs", titre: "Global AI Investment Is Forecast to Exceed $1 Trillion in 2026", date: "2026-08-07", url: "https://www.goldmansachs.com/insights/articles/global-investment-is-forecast-to-exceed-1-trillion-in-2026", chiffree: true, points: [
        { fr: "L'IA représenterait 1,8 % du PIB américain en 2026, 2,5 % en 2027, 2,8 % en 2028 ; les pics des cycles technologiques passés se situaient entre 2 et 5 % du PIB.", en: "AI would account for 1.8% of US GDP in 2026, 2.5% in 2027, 2.8% in 2028; past technology cycles peaked at 2–5% of GDP." },
        { fr: "Le consensus de capex des hyperscalers américains pour 2026 est d'environ 800 milliards de dollars.", en: "Consensus 2026 capex for US hyperscalers is about $800 billion." },
      ] },
      { banque: "Goldman Sachs", titre: "Will the $1 trillion of generative AI investment pay off?", date: "2024-08-05", url: "https://www.goldmansachs.com/insights/articles/will-the-1-trillion-of-generative-ai-investment-pay-off", chiffree: true, points: [
        { fr: "Le retour sur investissement est « au centre de tous les débats » ; l'innovation viendra des modèles verticaux spécialisés plutôt que de la seule infrastructure.", en: "Return on investment is 'the center of all debate'; innovation will come from specialised vertical models rather than infrastructure alone." },
      ] },
      { banque: "Morgan Stanley", titre: "As AI Proliferates, What Comes Next?", date: "2025-07-23", url: "https://www.morganstanley.com/insights/articles/ai-diffusion-tech-roundtable", chiffree: true, points: [
        { fr: "Marché adressable rapporté au marché mondial du travail : 40 000 milliards de dollars ; chaque cycle de calcul serait environ dix fois plus grand que le précédent.", en: "Addressable market framed against the $40 trillion global labour market; each compute cycle is roughly ten times the previous one." },
      ] },
      { banque: "Morgan Stanley", titre: "Bridging a $1.5tr Data Center Financing Gap", date: "2025", url: "https://www.morganstanley.com/content/dam/msdotcom/en/assets/pdfs/Research_Bridging-Data-Center-Gap.pdf", chiffree: true, points: [
        { fr: "Les marchés de crédit et privés devront combler un écart de financement des data centers estimé à 1 500 milliards de dollars.", en: "Credit and private markets will need to bridge an estimated $1.5 trillion data-center financing gap." },
      ] },
      { banque: "BlackRock", titre: "Digital disruption and artificial intelligence (BlackRock Investment Institute)", date: "2024-11-21", url: "https://www.blackrock.com/corporate/insights/blackrock-investment-institute/publications/mega-forces/artificial-intelligence", chiffree: true, points: [
        { fr: "Trois phases : construction, adoption, transformation. Les marchés privés sont jugés clés pour financer l'infrastructure et repérer les gagnants avant leur introduction en bourse.", en: "Three phases: build-out, adoption, transformation. Private markets are seen as key to financing infrastructure and spotting winners before IPO." },
      ] },
      { banque: "J.P. Morgan", titre: "4 Trends We're Watching In the Artificial Intelligence Investing Space", date: "2025-09-26", url: "https://www.jpmorgan.com/insights/markets-and-economy/top-market-takeaways/tmt-4-trends-were-watching-in-the-artificial-intelligence-investing-space", chiffree: true, points: [
        { fr: "PER des grandes valeurs IA autour de 30, contre plus de 60 au pic de 2000 ; bilans solides des hyperscalers (Oracle excepté).", en: "P/E of large AI names around 30 vs over 60 at the 2000 peak; strong hyperscaler balance sheets (Oracle excepted)." },
      ] },
    ],
    lecture: {
      fr: "NEXT Capital privilégie la phase 2 décrite par BlackRock : applications verticales et agents d'entreprise, là où Goldman Sachs et Morgan Stanley attendent la création de valeur, plutôt que l'infrastructure déjà financée par les hyperscalers.",
      en: "NEXT Capital favours BlackRock's phase 2: vertical applications and enterprise agents, where Goldman Sachs and Morgan Stanley expect value creation, rather than infrastructure already funded by hyperscalers.",
    },
  },
  {
    these: "quantique",
    synthese: {
      fr: "Le quantique est traité par les quatre maisons comme un horizon long à fort potentiel de rupture. J.P. Morgan documente une accélération nette du capital-risque (investissements multipliés par dix-sept en dix ans) ; Morgan Stanley suit les progrès de la correction d'erreurs ; BlackRock analyse la menace cryptographique et a lancé un ETF dédié ; Goldman Sachs s'intéresse à la course Europe – États-Unis – Chine. Aucune des quatre ne publie de taille de marché ferme : l'avantage quantique pratique reste « à plusieurs années ».",
      en: "All four houses treat quantum as a long-horizon, high-disruption theme. J.P. Morgan documents a sharp acceleration of venture funding (investment up seventeenfold in ten years); Morgan Stanley tracks error-correction progress; BlackRock analyses the cryptographic threat and launched a dedicated ETF; Goldman Sachs looks at the Europe–US–China race. None publishes a firm market size: practical quantum advantage remains 'years away'.",
    },
    chiffres: [
      { valeur: "× 17", libelle: { fr: "multiplication des investissements mondiaux dans le quantique en dix ans", en: "increase in global quantum investment over ten years" }, banque: "J.P. Morgan", url: "https://www.jpmorgan.com/insights/technology/unlocking-quantum-technologys-potential", date: "2025-11" },
      { valeur: "2,8 Md$ + 1,6 Md$", libelle: { fr: "levés par les startups quantiques américaines et hors États-Unis jusqu'au T3 2025, année record", en: "raised by US and non-US quantum start-ups through Q3 2025, a record year" }, banque: "J.P. Morgan", url: "https://www.jpmorgan.com/insights/technology/unlocking-quantum-technologys-potential", date: "2025-11" },
      { valeur: "> 1 Md$ / an", libelle: { fr: "budgets fédéraux américains de R&D en sciences de l'information quantique (FY2022-FY2025)", en: "US federal R&D budgets for quantum information science (FY2022–FY2025)" }, banque: "J.P. Morgan", url: "https://www.jpmorgan.com/insights/technology/unlocking-quantum-technologys-potential", date: "2025-11" },
      { valeur: "3 sur 5", libelle: { fr: "dirigeants dont l'entreprise explore le quantique, notamment le « quantum AI » (enquête SAS, mai 2025)", en: "executives whose company explores quantum, notably 'quantum AI' (SAS survey, May 2025)" }, banque: "J.P. Morgan", url: "https://www.jpmorgan.com/insights/technology/unlocking-quantum-technologys-potential", date: "2025-11" },
    ],
    etudes: [
      { banque: "J.P. Morgan", titre: "The second quantum revolution: Unlocking transformative potential", date: "2025-11-07", url: "https://www.jpmorgan.com/insights/technology/unlocking-quantum-technologys-potential", chiffree: true, points: [
        { fr: "Cas d'usage actuels : optimisation de portefeuille par recuit quantique, simulation de chimie, génération de nombres aléatoires, distribution quantique de clés ; cas futurs : optimisation à grande échelle, cryptographie post-quantique, capteurs.", en: "Current use cases: portfolio optimisation via quantum annealing, chemistry simulation, random-number generation, quantum key distribution; future: large-scale optimisation, post-quantum cryptography, sensing." },
      ] },
      { banque: "J.P. Morgan", titre: "What is quantum computing? (J.P. Morgan Asset Management)", date: "2026-03-06", url: "https://am.jpmorgan.com/us/en/asset-management/adv/insights/market-insights/market-updates/on-the-minds-of-investors/what-is-quantum-computing/", chiffree: false, points: [
        { fr: "L'avantage pratique sur le calcul classique est jugé « à plusieurs années » ; le capital-risque quantique exige des horizons d'investissement plus longs.", en: "Practical advantage over classical computing is 'years away'; quantum venture capital requires longer investment horizons." },
      ] },
      { banque: "Morgan Stanley", titre: "Quantum Computing Revisited (Counterpoint Global)", date: "2026-09-29", url: "https://www.morganstanley.com/im/en-us/institutional-investor/insights/articles/quantum-computing-revisited.html", chiffree: false, points: [
        { fr: "Des systèmes de correction d'erreurs plus grands rendent l'information quantique plus fiable ; qubits logiques et taux d'erreur logiques sont les bons indicateurs de progrès. Passage à l'échelle et applications rentables restent ouverts.", en: "Larger error-correction systems make quantum information more reliable; logical qubits and logical error rates are the right progress metrics. Scaling and cost-justifying applications remain open." },
      ] },
      { banque: "BlackRock", titre: "Quantum Computing and Blockchains", date: "2026-07-31", url: "https://www.blackrock.com/us/financial-professionals/insights/quantum-computing-and-blockchains", chiffree: false, points: [
        { fr: "Les avancées récentes ont raccourci l'horizon d'une menace pour la cryptographie à clé publique ; des standards post-quantiques existent déjà et le secteur passe de la recherche à la mise en œuvre.", en: "Recent advances have shortened the horizon of a threat to public-key cryptography; post-quantum standards already exist and the industry is moving from research to implementation." },
      ] },
      { banque: "BlackRock", titre: "iShares Quantum Computing UCITS ETF", date: "2026", url: "https://www.blackrock.com/lu/individual/products/345953/ishares-quantum-computing-ucits-etf", chiffree: false, points: [
        { fr: "BlackRock a ouvert une exposition cotée dédiée au quantique, signe que le thème est désormais investissable pour les allocataires institutionnels.", en: "BlackRock has opened a listed exposure dedicated to quantum, a sign the theme is now investable for institutional allocators." },
      ] },
      { banque: "Goldman Sachs", titre: "Can Europe beat China and the US in quantum computing?", date: "2023-03-31", url: "https://www.goldmansachs.com/insights/articles/can-europe-beat-china-and-the-us-in-quantum-computing", chiffree: false, points: [
        { fr: "Analyse qualitative de la compétition entre blocs ; l'Europe dispose d'atouts scientifiques mais doit accélérer le passage à l'industrialisation.", en: "Qualitative analysis of the race between blocs; Europe has scientific strengths but must accelerate industrialisation." },
      ] },
    ],
    lecture: {
      fr: "Thèse la plus longue du fonds (7 à 10 ans), en cohérence avec les horizons décrits par J.P. Morgan et Morgan Stanley. NEXT Capital cible les briques qui créent de la valeur avant l'ordinateur universel : correction d'erreurs, électronique cryogénique, logiciels et capteurs.",
      en: "The fund's longest thesis (7 to 10 years), consistent with the horizons described by J.P. Morgan and Morgan Stanley. NEXT Capital targets the building blocks that create value before the universal computer: error correction, cryogenic electronics, software and sensing.",
    },
  },
  {
    these: "agroalimentaire",
    synthese: {
      fr: "Morgan Stanley chiffre les protéines alternatives (150 milliards de dollars d'ici 2030) et la fermentation de précision (au moins 30 milliards en 2030, jusqu'à 120 dans le scénario haut). J.P. Morgan et Goldman Sachs documentent la volatilité des prix alimentaires et la dépendance aux engrais ; BlackRock rappelle qu'il faudra produire plus de nourriture dans les quarante prochaines années que dans les huit mille dernières. Un secteur résilient, sous tension, où la technologie crée les prochains leaders.",
      en: "Morgan Stanley sizes alternative proteins ($150 billion by 2030) and precision fermentation (at least $30 billion in 2030, up to $120 billion in the bull case). J.P. Morgan and Goldman Sachs document food-price volatility and fertiliser dependence; BlackRock recalls that more food must be produced in the next forty years than in the past eight thousand. A resilient sector under strain, where technology creates the next leaders.",
    },
    chiffres: [
      { valeur: "150 Md$", libelle: { fr: "marché des protéines alternatives à l'horizon 2030, croissance d'environ 20 % par an", en: "alternative-protein market by 2030, growing about 20% a year" }, banque: "Morgan Stanley", url: "https://www.morganstanley.com/ideas/food-production-technology", date: "2023-05" },
      { valeur: "30 à 120 Md$", libelle: { fr: "marché des technologies de fermentation en 2030 (scénario de base et scénario haut)", en: "fermentation-technology market in 2030 (base and bull cases)" }, banque: "Morgan Stanley", url: "https://www.morganstanley.com/insights/articles/fermentation-technology-surpass-30-billion-2030", date: "2025-04" },
      { valeur: "+50 %", libelle: { fr: "hausse des demandes de brevets en fermentation depuis 2011", en: "increase in fermentation patent filings since 2011" }, banque: "Morgan Stanley", url: "https://www.morganstanley.com/insights/articles/fermentation-technology-surpass-30-billion-2030", date: "2025-04" },
      { valeur: "+30 à 40 %", libelle: { fr: "envolée des prix alimentaires mondiaux en 2022 ; prix à la consommation américains +20 %, sans retour en arrière", en: "surge in global food prices in 2022; US consumer food prices +20%, with no reversal" }, banque: "J.P. Morgan", url: "https://am.jpmorgan.com/us/en/asset-management/institutional/insights/market-insights/eye-on-the-market/animal-farm/", date: "2024-05" },
      { valeur: "~20 %", libelle: { fr: "part des engrais dans le coût des céréales ; plus d'un quart du commerce mondial d'engrais azotés transite par Ormuz", en: "share of fertiliser in grain costs; over a quarter of global nitrogen-fertiliser trade transits Hormuz" }, banque: "Goldman Sachs", url: "https://www.goldmansachs.com/insights/articles/how-the-conflict-in-the-strait-of-hormuz-could-affect-global-agriculture-prices", date: "2026-04" },
      { valeur: "40 ans vs 8 000", libelle: { fr: "il faudra produire plus de nourriture dans les 40 prochaines années que dans les 8 000 dernières", en: "more food must be produced in the next 40 years than in the past 8,000" }, banque: "BlackRock", url: "https://www.blackrock.com/corporate/literature/whitepaper/ideas-exchange-summary-netherlands-how-resilient-is-the-food-supply-in-times-of-crisis-april-2023.pdf", date: "2023-04" },
    ],
    etudes: [
      { banque: "Morgan Stanley", titre: "Can Fermentation Unlock the Future of Food?", date: "2025-04-25", url: "https://www.morganstanley.com/insights/articles/fermentation-technology-surpass-30-billion-2030", chiffree: true, points: [
        { fr: "Deux phases : 2025-2027 (protéines de lactosérum, nutrition animale) puis 2028-2030 (substituts d'œufs, de viande, de produits laitiers) ; investissements requis d'environ 22 puis 78 milliards de dollars.", en: "Two phases: 2025–2027 (whey proteins, animal nutrition) then 2028–2030 (egg, meat and dairy substitutes); about $22bn then $78bn of investment required." },
      ] },
      { banque: "Morgan Stanley", titre: "Why Sustainable Food Is Poised for Primetime", date: "2023-05-03", url: "https://www.morganstanley.com/ideas/food-production-technology", chiffree: true, points: [
        { fr: "Les protéines alternatives pourraient atteindre 150 milliards de dollars en 2030 avec une croissance annuelle d'environ 20 %.", en: "Alternative proteins could reach $150 billion by 2030 with about 20% annual growth." },
      ] },
      { banque: "J.P. Morgan", titre: "Animal Farm (Eye on the Market, Michael Cembalest)", date: "2024-05-15", url: "https://am.jpmorgan.com/us/en/asset-management/institutional/insights/market-insights/eye-on-the-market/animal-farm/", chiffree: true, points: [
        { fr: "Marge de la distribution alimentaire au plus haut depuis 2000 (environ 7 %) ; terres agricoles américaines valorisées 3 500 milliards de dollars, détenues à environ 4 % par des investisseurs non familiaux.", en: "Food-retail margins at their highest since 2000 (about 7%); US farmland valued at $3.5 trillion, about 4% held by non-family investors." },
      ] },
      { banque: "J.P. Morgan", titre: "Climate Intuition: Food security, the fates of farming and food in a warming world", date: "2026-01-16", url: "https://jpmorgan.com/insights/research/global-food-security", chiffree: false, points: [
        { fr: "Analyse qualitative des effets du climat sur la production, les sols et les échanges agricoles.", en: "Qualitative analysis of climate effects on production, soils and agricultural trade." },
      ] },
      { banque: "Goldman Sachs", titre: "How the Conflict in the Strait of Hormuz Could Affect Global Agriculture Prices", date: "2026-04-01", url: "https://www.goldmansachs.com/insights/articles/how-the-conflict-in-the-strait-of-hormuz-could-affect-global-agriculture-prices", chiffree: true, points: [
        { fr: "Les engrais azotés représentent environ 60 % des engrais utilisés dans le monde ; une rupture d'approvisionnement se répercute sur les prix des céréales avec un décalage de l'ordre d'un mois.", en: "Nitrogen fertilisers are about 60% of global fertiliser use; a supply disruption feeds into grain prices with roughly a one-month lag." },
      ] },
      { banque: "BlackRock", titre: "How resilient is the food supply in times of crisis? (Ideas Exchange)", date: "2023-04", url: "https://www.blackrock.com/corporate/literature/whitepaper/ideas-exchange-summary-netherlands-how-resilient-is-the-food-supply-in-times-of-crisis-april-2023.pdf", chiffree: true, points: [
        { fr: "La guerre en Ukraine a touché 6 % de l'approvisionnement alimentaire mondial direct ; la résilience des chaînes alimentaires devient un sujet d'allocation.", en: "The war in Ukraine affected 6% of the world's direct food supply; food-chain resilience becomes an allocation topic." },
      ] },
    ],
    lecture: {
      fr: "NEXT Capital cible les segments chiffrés par Morgan Stanley (protéines, fermentation) et les réponses aux tensions documentées par J.P. Morgan et Goldman Sachs : agriculture de précision, réduction des intrants, traçabilité.",
      en: "NEXT Capital targets the segments sized by Morgan Stanley (proteins, fermentation) and the answers to the strains documented by J.P. Morgan and Goldman Sachs: precision agriculture, input reduction, traceability.",
    },
  },
  {
    these: "sport",
    synthese: {
      fr: "Le sport est devenu une classe d'actifs. Morgan Stanley évalue le marché mondial à 521 milliards de dollars en 2024, avec 130 milliards de revenus additionnels possibles grâce à la technologie. Goldman Sachs documente des rendements cumulés des ligues américaines supérieurs à 1 000 % depuis 2001 ; J.P. Morgan estime la valeur des quatre grandes ligues américaines à près de 500 milliards de dollars et note l'entrée du private equity dans une équipe sur cinq. BlackRock n'a pas publié d'étude sectorielle dédiée dans nos sources.",
      en: "Sport has become an asset class. Morgan Stanley values the global market at $521 billion in 2024, with $130 billion of additional revenue possible through technology. Goldman Sachs documents cumulative returns of US leagues above 1,000% since 2001; J.P. Morgan puts the four major US leagues at close to $500 billion and notes private equity now sits in one team in five. BlackRock has published no dedicated sector study in our sources.",
    },
    chiffres: [
      { valeur: "521 Md$", libelle: { fr: "ventes mondiales du sport en 2024, croissance d'environ 8 % par an", en: "global sports sales in 2024, growing about 8% a year" }, banque: "Morgan Stanley", url: "https://www.morganstanley.com/insights/articles/global-sports-industry-technology-adoption", date: "2025-08" },
      { valeur: "+130 Md$", libelle: { fr: "revenus annuels additionnels (+25 %) accessibles par l'adoption des technologies, dont l'IA : billetterie +21 %, médias +36 %, engagement +23 %", en: "additional annual revenue (+25%) unlocked by technology adoption incl. AI: ticketing +21%, media +36%, engagement +23%" }, banque: "Morgan Stanley", url: "https://www.morganstanley.com/insights/articles/global-sports-industry-technology-adoption", date: "2025-08" },
      { valeur: "+1 917 %", libelle: { fr: "rendement cumulé des franchises NBA depuis 2001 (TCAC 14 %) ; NFL +1 130 %, top 10 clubs européens +483 %", en: "cumulative return of NBA franchises since 2001 (14% CAGR); NFL +1,130%, top-10 European clubs +483%" }, banque: "Goldman Sachs", url: "https://www.goldmansachs.com/what-we-do/investment-banking/multimedia/report.pdf", date: "2024" },
      { valeur: "~500 Md$", libelle: { fr: "valorisation cumulée des équipes des quatre grandes ligues américaines ; une équipe NFL vaut environ 7 Md$", en: "combined valuation of the four major US leagues' teams; an NFL team is worth about $7bn" }, banque: "J.P. Morgan", url: "https://am.jpmorgan.com/us/en/asset-management/adv/insights/market-insights/market-updates/on-the-minds-of-investors/what-is-behind-the-growth-of-private-equity-in-sports/", date: "2025-10" },
      { valeur: "1 sur 5", libelle: { fr: "équipes des grandes ligues américaines comptant un fonds de private equity au capital", en: "major US league teams with a private-equity fund in their capital" }, banque: "J.P. Morgan", url: "https://am.jpmorgan.com/us/en/asset-management/adv/insights/market-insights/market-updates/on-the-minds-of-investors/what-is-behind-the-growth-of-private-equity-in-sports/", date: "2025-10" },
      { valeur: "50 à 70 %", libelle: { fr: "part des revenus des ligues provenant des droits médias nationaux partagés", en: "share of league revenue from shared national media rights" }, banque: "J.P. Morgan", url: "https://am.jpmorgan.com/us/en/asset-management/institutional/insights/market-insights/eye-on-the-market/a-piece-of-the-action/", date: "2024-06" },
    ],
    etudes: [
      { banque: "Morgan Stanley", titre: "The Sports Industry's $130 Billion Ticket", date: "2025-08-22", url: "https://www.morganstanley.com/insights/articles/global-sports-industry-technology-adoption", chiffree: true, points: [
        { fr: "Seules 30 % des entreprises sportives personnalisent leur marketing par la technologie, contre 92 % dans le commerce de détail ; la billetterie pèse près de la moitié du chiffre d'affaires.", en: "Only 30% of sports businesses use technology to personalise marketing, vs 92% in retail; ticketing is close to half of revenue." },
      ] },
      { banque: "Goldman Sachs", titre: "Changing the Game: Unlocking New Opportunities in Sports", date: "2024", url: "https://www.goldmansachs.com/what-we-do/investment-banking/multimedia/report.pdf", chiffree: true, points: [
        { fr: "Droits médias NFL : 402 M$ par équipe en 2023-2024 contre 180 M$ en 2012 ; paris sportifs en ligne américains de 6,5 Md$ (2022) à 20,7 Md$ attendus en 2027 ; marché sportif estimé entre 630 et 1 000 Md$.", en: "NFL media rights: $402m per team in 2023–24 vs $180m in 2012; US online sports betting from $6.5bn (2022) to $20.7bn expected in 2027; sports market estimated at $630bn–1tn." },
      ] },
      { banque: "Goldman Sachs", titre: "What's the Lifetime Value of a Fan?", date: "2026-02-05", url: "https://www.goldmansachs.com/what-we-do/investment-banking/insights/articles/whats-the-lifetime-value-of-a-fan", chiffree: false, points: [
        { fr: "Le sport est décrit comme une classe d'actifs à part entière ; la relation directe avec le fan et la valeur vie du fan deviennent les indicateurs clés.", en: "Sport is described as an asset class in its own right; the direct fan relationship and lifetime fan value become the key metrics." },
      ] },
      { banque: "J.P. Morgan", titre: "What is behind the growth of private equity in sports? (J.P. Morgan Asset Management)", date: "2025-10-15", url: "https://am.jpmorgan.com/us/en/asset-management/adv/insights/market-insights/market-updates/on-the-minds-of-investors/what-is-behind-the-growth-of-private-equity-in-sports/", chiffree: true, points: [
        { fr: "Rendements cumulés des quatre ligues supérieurs au S&P 500 depuis 2014 ; 80 des 100 meilleures audiences télévisées de 2024 étaient des événements sportifs.", en: "Cumulative returns of the four leagues above the S&P 500 since 2014; 80 of the 100 most-watched broadcasts of 2024 were sports events." },
      ] },
      { banque: "J.P. Morgan", titre: "A Piece of the Action (Eye on the Market)", date: "2024-06-06", url: "https://am.jpmorgan.com/us/en/asset-management/institutional/insights/market-insights/eye-on-the-market/a-piece-of-the-action/", chiffree: true, points: [
        { fr: "Les participations de contrôle des franchises américaines valent de 1 à 10 milliards de dollars ; quatre ligues sur cinq ont ouvert leur capital au private equity.", en: "Controlling stakes in US franchises are worth $1–10 billion; four of five leagues have opened their capital to private equity." },
      ] },
      { banque: "BlackRock", titre: "Aucune étude sectorielle dédiée identifiée", date: "2026-10", url: "https://www.blackrock.com/corporate/insights/blackrock-investment-institute", chiffree: false, points: [
        { fr: "BlackRock aborde le sport via ses plateformes de marchés privés et de crédit privé, sans publication thématique dédiée dans nos sources au 16/10/2026.", en: "BlackRock addresses sport through its private-markets and private-credit platforms, with no dedicated thematic publication in our sources as of 16/10/2026." },
      ] },
    ],
    lecture: {
      fr: "Les franchises sont désormais hors de portée des tickets du fonds ; NEXT Capital cible ce que Morgan Stanley identifie comme le gisement de 130 milliards : données, billetterie intelligente, médias et expérience, santé des athlètes.",
      en: "Franchises are now beyond the fund's ticket sizes; NEXT Capital targets what Morgan Stanley identifies as the $130 billion pool: data, smart ticketing, media and experience, athlete health.",
    },
  },
];

export function etudePour(these: TheseId): EtudeMarche {
  return ETUDES_MARCHE.find((e) => e.these === these)!;
}

export const BANQUES: Banque[] = ["BlackRock", "J.P. Morgan", "Morgan Stanley", "Goldman Sachs"];
