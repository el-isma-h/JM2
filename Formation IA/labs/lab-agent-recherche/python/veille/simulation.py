"""Mode « sans clé » : faux Claude (planifier, synthétiser, rédiger, relire) et faux moteurs (Perplexity, Grok).

Les faux moteurs renvoient des réponses au format Responses (items *_search_call, message + annotations url_citation)
à partir de donnees/recherche_simulee.json (domaines .test, contenu fictif). Le faux synthétiseur est volontairement
NAÏF : il recopie l'URL injectée par une page piégée et « invente » une URL voisine d'une vraie — c'est votre filtre
déterministe (TODO 2-3) qui doit les rejeter. Les volumes de tokens imitent le tableau de coûts de la section 4.
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path
from types import SimpleNamespace

TOKENS = {"Plan": (1500, 600), "Dossier": (15000, 3000), "Relecture": (9000, 800), "redaction": (6000, 2500),
          "perplexity": (3000, 800), "grok": (5000, 1000)}
ANGLES = [("réglementaire", "reglementaire"), ("chiffres", "chiffres"), ("actualité", "actualite"),
          ("retours de terrain", "retours_terrain")]


def mode_simulation() -> bool:
    mode = os.environ.get("LAB_MODE", "").lower()
    if mode in ("simulation", "reel"):
        return mode == "simulation"
    return not os.environ.get("ANTHROPIC_API_KEY")


def corpus() -> dict:
    for parent in Path(__file__).resolve().parents:
        f = parent / "donnees" / "recherche_simulee.json"
        if f.exists():
            return json.loads(f.read_text(encoding="utf-8"))
    raise FileNotFoundError("donnees/recherche_simulee.json introuvable")


def _usage(cle: str):
    t_in, t_out = TOKENS[cle]
    return SimpleNamespace(input_tokens=t_in, output_tokens=t_out)


class FauxMoteur:
    """Faux client OpenAI-compatible (`client.responses.create`) pour Perplexity ou Grok."""

    def __init__(self, nom: str, panne: bool = False):
        self.nom, self.panne, self.appels = nom, panne, 0
        self.responses = SimpleNamespace(create=self._create)

    def _create(self, model, input, instructions=None, tools=None, **_):
        self.appels += 1
        if self.panne:
            raise ConnectionError(f"{self.nom} indisponible (panne simulée)")
        angle = next((a for mot, a in ANGLES if mot in input.lower()), "reglementaire")
        r = corpus()[angle]
        appels = [SimpleNamespace(type="web_search_call", id=f"ws_{i}") for i in range(2)]
        if any(t.get("type") == "x_search" for t in tools or []):
            appels.append(SimpleNamespace(type="x_search_call", id="xs_0"))
        annotations = [SimpleNamespace(type="url_citation", url=s["url"], title=s["titre"]) for s in r["sources"]]
        message = SimpleNamespace(type="message", content=[SimpleNamespace(type="output_text", text=r["texte"], annotations=annotations)])
        return SimpleNamespace(output=[*appels, message], output_text=r["texte"], usage=_usage(self.nom))


class FauxClaude:
    """Faux client Anthropic : messages.parse(output_format=Plan|Dossier|Relecture) et messages.create (rédaction)."""

    def __init__(self, erreurs_redaction: bool = False, hallucination: bool = True):
        self.erreurs_redaction, self.hallucination = erreurs_redaction, hallucination
        self.messages = SimpleNamespace(parse=self._parse, create=self._create)
        self.redactions = 0

    # ---------------- sorties structurées ----------------
    def _parse(self, model, messages, output_format, **_):
        contenu = messages[0]["content"]
        nom = output_format.__name__
        donnees = {"Plan": self._plan, "Dossier": self._dossier, "Relecture": self._relecture}[nom](contenu)
        return SimpleNamespace(parsed_output=output_format.model_validate(donnees), usage=_usage(nom))

    @staticmethod
    def _plan(contenu: str) -> dict:
        sujet = contenu.split("\n")[0].removeprefix("Sujet : ")
        return {"reformulation": sujet, "domaines_prioritaires": [], "sous_questions": [
            {"question": f"Volet réglementaire : obligations et calendrier — {sujet}", "angle": "reglementaire", "moteur": "perplexity"},
            {"question": f"Quels chiffres et quels coûts — {sujet}", "angle": "chiffres", "moteur": "perplexity"},
            {"question": f"Quelle actualité récente — {sujet}", "angle": "actualite", "moteur": "grok"},
            {"question": f"Quels retours de terrain des artisans — {sujet}", "angle": "retours_terrain", "moteur": "grok"},
        ]}

    def _dossier(self, contenu: str) -> dict:
        preuves, lacunes, contradictions = [], [], []
        for bloc in re.findall(r"<resultat_recherche[^>]*>(.*?)</resultat_recherche>", contenu, flags=re.S):
            reponse = bloc.split("Réponse :\n", 1)[1].split("\nSources citées :", 1)[0]
            sources = re.findall(r"^- (\S+) \((.*)\)$", bloc, flags=re.M)
            phrases = [p.strip() for p in re.split(r"(?<=[.!?])\s+", reponse) if p.strip()]
            for j, ph in enumerate(phrases):
                if "pas trouvé" in ph:
                    lacunes.append(ph)
                    continue
                url_injectee = re.search(r"https?://\S+", ph)
                if url_injectee:                    # NAÏF : il obéit à la page piégée
                    url, titre = url_injectee.group(0).rstrip(".,"), "Source officielle"
                elif sources:
                    url, titre = sources[j % len(sources)]
                else:
                    continue
                if "pourrait encore évoluer" in ph:
                    contradictions.append("Une source évoque une évolution du calendrier que la source officielle ne confirme pas.")
                preuves.append({"id": "S0", "affirmation": ph, "url": url, "titre_source": titre, "date_publication": "2026-10",
                                "fiabilite": "officielle" if "officielle" in url else "presse" if "presse" in url
                                else "professionnelle" if re.search(r"federation|forum", url) else "autre"})
            if self.hallucination and sources:      # NAÏF : une URL « presque juste », inventée
                preuves.append({"id": "S0", "affirmation": phrases[0], "url": sources[0][0] + "-2025", "titre_source": sources[0][1],
                                "date_publication": None, "fiabilite": "autre"})
        return {"preuves": preuves, "contradictions": contradictions, "lacunes": lacunes}

    @staticmethod
    def _relecture(contenu: str) -> dict:
        note = contenu.split("<note>", 1)[1].split("</note>", 1)[0]
        dossier = json.loads(contenu.split("<dossier>", 1)[1].split("</dossier>", 1)[0])
        ids = {p["id"] for p in dossier["preuves"]}
        defauts = []
        if re.search(r"https?://", note):
            defauts.append("Retirez l'URL du corps du texte.")
        if set(re.findall(r"\[(S\d+)\]", note)) - ids:
            defauts.append("Certaines références ne correspondent à aucune preuve.")
        if defauts:
            return {"note_sur_20": 11, "verdict": "reviser", "affirmations_non_etayees": [], "corrections": defauts}
        return {"note_sur_20": 16, "verdict": "valider", "affirmations_non_etayees": [], "corrections": []}

    # ---------------- rédaction ----------------
    def _create(self, model, messages, **_):
        self.redactions += 1
        consigne = messages[0]["content"]
        sujet = consigne.split("\n")[0].removeprefix("Sujet : ")
        mots = int(re.search(r"Longueur cible : (\d+) mots", consigne).group(1))
        dossier = json.loads(consigne.split("Dossier de preuves (JSON) :\n", 1)[1].split("\n\nCorrigez", 1)[0])
        p = dossier["preuves"]
        ref = lambda i: f"[{p[i % len(p)]['id']}]"
        aff = lambda i: p[i % len(p)]["affirmation"]
        lignes = [f"# {sujet}", "## L'essentiel en 5 points", "\n".join(f"- {aff(i)} {ref(i)}" for i in range(5)),
                  "## Contexte", f"La réforme concerne toutes les entreprises assujetties à la TVA {ref(0)}.",
                  "## Ce qui change pour une PME", f"Vous devrez choisir une plateforme agréée et adapter vos outils de devis {ref(1)}."]
        if not (self.erreurs_redaction and "Corrigez" not in consigne):
            lignes.append("## Calendrier et actions recommandées")
        else:                                       # 1re version fautive : section manquante et URL dans le texte
            lignes.append("Consultez https://source-officielle.test/facturation-electronique/calendrier pour le détail.")
        lignes.append(f"Préparez dès maintenant la réception des factures électroniques {ref(0)}.")
        fin = ["## Ce que nous ne savons pas"] + [f"- {c}" for c in dossier["contradictions"]] + [f"- {l}" for l in dossier["lacunes"]]
        i = 2
        while len(" ".join(lignes + fin).split()) < mots:
            lignes.append(f"Nous vous recommandons d'en parler avec votre expert-comptable : {aff(i)} {ref(i)}")
            i += 1
        texte = "\n\n".join(lignes + fin)
        return SimpleNamespace(content=[SimpleNamespace(type="text", text=texte)], usage=_usage("redaction"))
