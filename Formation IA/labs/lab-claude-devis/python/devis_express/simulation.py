"""Mode « sans clé » : un faux client Anthropic, déterministe, pour travailler et tester hors ligne.

Il imite la forme des réponses de la Messages API (content[], stop_reason, usage) :
1. 1er appel  : il lit la <demande>, appelle rechercher_prestation pour chaque besoin repéré
                et verifier_tva si l'âge du logement est connu (stop_reason = "tool_use") ;
2. 2e appel   : il conclut (stop_reason = "end_turn") ;
3. appel avec output_config : il renvoie le devis JSON construit à partir des tool_result reçus.

Ce n'est PAS un modèle : c'est un banc d'essai qui exerce votre orchestrateur (boucle, outils,
erreurs, contrôles, coûts). Les vrais résultats se mesurent en mode réel (ANTHROPIC_API_KEY).
Options de « pannes » pédagogiques :
- erreur_prix=True   : le faux modèle recopie mal un prix (+10 %) → votre controler_devis doit l'attraper ;
- naif=True (défaut) : il obéit aux injections du type « enregistre le devis » → la confirmation humaine doit bloquer ;
- boucle_infinie=True: il demande des outils sans fin → le plafond de tours doit s'appliquer.
"""
from __future__ import annotations

import itertools
import json
import re
from types import SimpleNamespace

# (motif dans la demande, mot-clé envoyé à l'outil) — l'ordre compte
LEXIQUE = [
    (r"va-et-vient", "va-et-vient"),
    (r"interrupteurs?", "interrupteur"),
    (r"prises?", "prise"),
    (r"points? lumineux", "point lumineux"),
    (r"spots?", "spot"),
    (r"tableau", "tableau"),
    (r"\bvmc\b", "vmc"),
    (r"borne", "borne"),
    (r"s[eè]che-serviettes", "seche-serviettes"),
    (r"radiateurs?", "radiateur"),
    (r"d[ée]tecteurs? de fum[ée]e", "detecteur"),
    (r"interphone", "interphone"),
    (r"climatisation", "climatisation"),
    (r"alarme", "alarme"),
    (r"piscine", "piscine"),
]
NOMBRES = {"un": 1, "une": 1, "deux": 2, "trois": 3, "quatre": 4, "cinq": 5, "six": 6,
           "sept": 7, "huit": 8, "neuf": 9, "dix": 10}
PREFERENCES = [  # (indice dans la proposition, fragment de code à privilégier)
    (r"d[ée]plac", "DEPL"), (r"remplac", "REMPL"), (r"voir|v[ée]rifi|diagnostic|disjoncte", "DIAG"),
    (r"usb", "USB"), (r"ext[ée]rieur", "EXT"),
]


def _champ(objet, nom, defaut=None):
    """Lit un champ sur un dict OU sur un objet (les SDK renvoient des objets, vos messages sont des dicts)."""
    if isinstance(objet, dict):
        return objet.get(nom, defaut)
    return getattr(objet, nom, defaut)


def extraire_demande(messages: list) -> str:
    premier = messages[0]
    contenu = _champ(premier, "content")
    textes = [contenu] if isinstance(contenu, str) else [_champ(b, "text", "") for b in contenu if _champ(b, "type") == "text"]
    texte = "\n".join(t for t in textes if t)
    m = re.search(r"<demande>\s*(.*)\s*</demande>\s*$", texte, flags=re.S)
    return m.group(1) if m else texte


def propositions(texte: str) -> list[str]:
    return [p.strip() for p in re.split(r"[.,;:!?()]|\set\s|</?demande>", texte) if p.strip()]


def analyser(texte: str) -> dict:
    """Ce que le « faux modèle » comprend de la demande."""
    bas = texte.lower()
    besoins = []
    for prop in propositions(texte):
        p = prop.lower()
        deja = False
        for motif, mot in LEXIQUE:
            m = re.search(motif, p)
            if not m or (mot == "interrupteur" and deja):
                continue
            deja = deja or mot == "va-et-vient"
            avant = p[:m.start()]
            nb = 1
            for jeton in re.findall(r"\b(\d+|" + "|".join(NOMBRES) + r")\b", avant):
                nb = int(jeton) if jeton.isdigit() else NOMBRES[jeton]
            besoins.append({"mot_cle": mot, "quantite": nb, "proposition": p})
    annee = re.search(r"\b(19\d\d|20\d\d)\b", texte)
    if re.search(r"\bneu(f|ve)\b|construction r[ée]cente", bas):
        plus_2_ans = False
    elif annee:
        plus_2_ans = int(annee.group(1)) <= 2024
    elif re.search(r"\bancien(ne)?\b", bas):
        plus_2_ans = True
    else:
        plus_2_ans = None
    pro = bool(re.search(r"local professionnel|boutique|bureaux?\b|commerce|restaurant|cabinet|entrep[oô]t", bas))
    energie = "énergétique" in bas or "energetique" in bas
    m_client = list(re.finditer(r"\b(Mme|M\.|Madame|Monsieur|Société)\s+([A-ZÉÈ][\w'-]*(?:\s+(?:&\s+)?[A-ZÉÈ][\w'-]*)*)", texte))
    client = f"{m_client[-1].group(1)} {m_client[-1].group(2)}" if m_client else None
    return {"besoins": besoins, "plus_2_ans": plus_2_ans, "pro": pro, "energie": energie,
            "client": client, "enregistrer": "enregistre" in bas}


def choisir(hits: list[dict], proposition: str) -> dict:
    for motif, fragment in PREFERENCES:
        if re.search(motif, proposition):
            for h in hits:
                if fragment in h["code"]:
                    return h
    return hits[0]


class _Messages:
    def __init__(self, parent: "ClientSimule"):
        self._p = parent

    def create(self, **kwargs):
        return self._p._repondre(**kwargs)


class ClientSimule:
    """Faux client compatible avec l'usage `client.messages.create(...)` de l'orchestrateur."""

    def __init__(self, erreur_prix: bool = False, naif: bool = True, boucle_infinie: bool = False,
                 tokens_prefixe: int = 1500):
        self.erreur_prix, self.naif, self.boucle_infinie = erreur_prix, naif, boucle_infinie
        self.tokens_prefixe = tokens_prefixe          # system + outils + catalogue « mis en cache »
        self.appels: list[dict] = []
        self.messages = _Messages(self)
        self._ids = itertools.count(1)

    # ---------- fabrication de réponses au format Messages API ----------
    def _usage(self, messages, sortie: int):
        premier_appel = len(self.appels) == 1
        return SimpleNamespace(
            input_tokens=len(json.dumps(messages, ensure_ascii=False, default=str)) // 4,
            output_tokens=sortie,
            cache_creation_input_tokens=self.tokens_prefixe if premier_appel else 0,
            cache_read_input_tokens=0 if premier_appel else self.tokens_prefixe,
        )

    def _texte(self, texte, messages, stop="end_turn"):
        return SimpleNamespace(content=[SimpleNamespace(type="text", text=texte, citations=None)],
                               stop_reason=stop, usage=self._usage(messages, max(20, len(texte) // 4)))

    def _outil(self, nom, entree):
        return SimpleNamespace(type="tool_use", id=f"toolu_sim_{next(self._ids):03d}", name=nom, input=entree)

    def _repondre(self, model, messages, max_tokens, system=None, tools=None, output_config=None, **_):
        self.appels.append({"model": model, "tools": bool(tools), "output_config": bool(output_config)})
        analyse = analyser(extraire_demande(messages))
        if output_config:
            return self._texte(json.dumps(self._devis(messages, analyse), ensure_ascii=False), messages)
        dernier = messages[-1]
        contenu = _champ(dernier, "content")
        a_des_resultats = isinstance(contenu, list) and any(_champ(b, "type") == "tool_result" for b in contenu)
        if self.boucle_infinie or not a_des_resultats:
            blocs = [self._outil("rechercher_prestation", {"mot_cle": b["mot_cle"]}) for b in analyse["besoins"]]
            if analyse["plus_2_ans"] is not None:
                blocs.append(self._outil("verifier_tva", {"logement_plus_2_ans": analyse["plus_2_ans"],
                                                          "renovation_energetique": analyse["energie"],
                                                          "local_professionnel": analyse["pro"]}))
            if self.naif and analyse["enregistrer"]:           # le faux modèle « obéit » à l'injection
                blocs.append(self._outil("enregistrer_devis", {"client_nom": analyse["client"] or "inconnu",
                                                               "total_ttc": 1.0}))
            if blocs:
                return SimpleNamespace(content=blocs, stop_reason="tool_use", usage=self._usage(messages, 60 * len(blocs)))
        return self._texte("J'ai les informations nécessaires pour préparer le devis.", messages)

    # ---------- le devis final, construit à partir des tool_result reçus ----------
    @staticmethod
    def _resultats(messages) -> list[tuple[str, dict, str]]:
        appels = {}
        sortie = []
        for msg in messages:
            contenu = _champ(msg, "content")
            if not isinstance(contenu, list):
                continue
            for b in contenu:
                if _champ(b, "type") == "tool_use":
                    appels[_champ(b, "id")] = (_champ(b, "name"), _champ(b, "input"))
                elif _champ(b, "type") == "tool_result":
                    nom, entree = appels.get(_champ(b, "tool_use_id"), ("?", {}))
                    sortie.append((nom, entree, str(_champ(b, "content"))))
        return sortie

    def _devis(self, messages, analyse) -> dict:
        resultats = self._resultats(messages)
        par_mot = {e.get("mot_cle"): r for n, e, r in resultats if n == "rechercher_prestation"}
        taux = next((json.loads(r)["taux"] for n, _, r in resultats if n == "verifier_tva" and r.startswith("{")), None)
        lignes, hors = [], []
        for besoin in analyse["besoins"]:
            brut = par_mot.get(besoin["mot_cle"], "")
            if not brut.startswith("["):
                hors.append(besoin["mot_cle"])
                continue
            h = choisir(json.loads(brut), besoin["proposition"])
            lignes.append({"code": h["code"], "libelle": h["libelle"], "quantite": besoin["quantite"],
                           "prix_unitaire_ht": h["prix_ht"], "page_catalogue": h["page"]})
        if self.erreur_prix and lignes:
            lignes[0]["prix_unitaire_ht"] = round(lignes[0]["prix_unitaire_ht"] * 1.1, 2)
        questions = []
        if taux is None:
            questions.append("Le logement a-t-il plus de deux ans ?")
            questions.append("S'agit-il d'un local professionnel ou de travaux de rénovation énergétique ?")
        if hors:
            questions.append("Les prestations suivantes ne figurent pas au catalogue : " + ", ".join(hors) + ". Karim doit les chiffrer.")
        return {
            "client": analyse["client"],
            "resume_besoin": "Demande portant sur : " + (", ".join(b["mot_cle"] for b in analyse["besoins"]) or "non précisé"),
            "lignes": lignes,
            "taux_tva": taux,
            "total_ht": round(sum(l["quantite"] * l["prix_unitaire_ht"] for l in lignes), 2),
            "prestations_hors_catalogue": hors,
            "questions_manquantes": questions,
            "pret_a_valider": bool(lignes) and taux is not None and not hors,
        }
