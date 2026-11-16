"""Mode « sans clé » : deux faux clients (OpenAI Responses et Anthropic Messages) pilotés par la MÊME politique.

La politique (neutre) lit la demande et les résultats d'outils ; chaque faux client la présente dans le format
de son fournisseur. Les faux clients sont STRICTS sur le format, comme les vraies API : ils rejettent les
erreurs classiques du portage (piège de la section 4.3 de la leçon), par exemple :
- un `function_call_output` enveloppé dans un rôle `user` (OpenAI) ;
- un appel de fonction resté sans `function_call_output` correspondant ;
- des outils au format Anthropic (`input_schema`) envoyés à OpenAI, ou l'inverse ;
- un `tool_result` envoyé ailleurs que dans un message `user` (Anthropic).
Ce ne sont PAS des modèles : ils exercent votre adaptateur. La qualité réelle se mesure en mode réel.
"""
from __future__ import annotations

import itertools
import json
import re
from types import SimpleNamespace

from .devis_core import CATALOGUE, Devis


class ErreurRequeteSimulee(Exception):
    """Équivalent simulé d'une erreur HTTP 400 de l'API."""

    def __init__(self, message: str):
        super().__init__(f"400 (simulé) : {message}")


# ---------------------------------------------------------------- politique neutre
NOMBRES = {"un": 1, "une": 1, "deux": 2, "trois": 3, "quatre": 4, "cinq": 5, "six": 6}
ANNEE_COURANTE = 2026


def _nombre_avant(p: str, fin: int, defaut: int | None = 1) -> int | None:
    nb = defaut
    for j in re.findall(r"\b(\d{1,2}|" + "|".join(NOMBRES) + r")\b", p[:fin]):
        nb = int(j) if j.isdigit() else NOMBRES[j]
    return nb


def analyser(demande: str) -> dict:
    texte = demande.lower()
    besoins, questions = [], []
    for prop in [x.strip() for x in re.split(r"[.,;!?]|\set\s|\savec\s", texte) if x.strip()]:
        if (m := re.search(r"\bportes?\b", prop)) and "porte de" not in prop[m.start():m.start() + 9]:
            if re.search(r"blind|d'entr[ée]e", prop):
                besoins.append({"mots_cles": "porte blindée", "quantite": _nombre_avant(prop, m.start()), "ouvrage": "porte"})
            else:
                mat = re.search(r"ch[êe]ne|sapin", prop)
                dim = re.search(r"\d{3}x\d{2}\b", prop)
                if mat and dim:
                    besoins.append({"mots_cles": f"porte {mat.group(0).replace('chene', 'chêne')} {dim.group(0)}",
                                    "quantite": _nombre_avant(prop, m.start()), "ouvrage": "porte"})
                else:
                    questions.append("Quelles sont les dimensions et l'essence de la porte souhaitée ?")
        if m := re.search(r"\bfen[êe]tres?\b", prop):
            mat, dim = re.search(r"pvc|bois", prop), re.search(r"\d{3}x\d{3}", prop)
            if mat and dim:
                besoins.append({"mots_cles": f"fenêtre {mat.group(0)} {dim.group(0)}",
                                "quantite": _nombre_avant(prop, m.start()), "ouvrage": "fenetre"})
            else:
                questions.append("Quelles sont les dimensions et le matériau de la fenêtre ?")
        if m := re.search(r"\bplacards?\b", prop):
            besoins.append({"mots_cles": "placard coulissant", "quantite": _nombre_avant(prop, m.start()), "ouvrage": "placard"})
        if m := re.search(r"\bpoign[ée]es?\b", prop):
            besoins.append({"mots_cles": "poignée inox" if "inox" in prop else "poignée",
                            "quantite": _nombre_avant(prop, m.start(), defaut=None), "ouvrage": None})
        if m := re.search(r"\bseuils?\b", prop):
            besoins.append({"mots_cles": "seuil", "quantite": _nombre_avant(prop, m.start()), "ouvrage": None})
    nb_portes = sum(b["quantite"] for b in besoins if b["ouvrage"] == "porte")
    for b in besoins:                                   # « avec poignées » : une par porte
        if b["quantite"] is None:
            b["quantite"] = nb_portes or 1
    pose = bool(re.search(r"\bpos(e|ée|ées|er)\b", texte)) and "sans pose" not in texte
    pro = bool(re.search(r"local (commercial|professionnel)|bureaux?\b|boutique|commerce", texte))
    age = None
    if re.search(r"\bneu(f|ve)\b", texte):
        age = 0
    elif m := re.search(r"\b(\d{1,3}) ans?\b", texte):
        age = int(m.group(1))
    elif m := re.search(r"\b(19\d\d|20\d\d)\b", texte):
        age = ANNEE_COURANTE - int(m.group(1))
    m_client = re.search(r"client\s*:\s*([^.\n]+)", demande, flags=re.I)
    return {"besoins": besoins, "questions": questions, "pose": pose, "pro": pro, "age": age,
            "client": m_client.group(1).strip() if m_client else "Client non précisé"}


def appels_a_faire(demande: str) -> list[tuple[str, dict]]:
    a = analyser(demande)
    appels = [("chercher_article", {"mots_cles": b["mots_cles"]}) for b in a["besoins"]]
    if a["pose"]:
        for ouvrage in dict.fromkeys(b["ouvrage"] for b in a["besoins"] if b["ouvrage"]):
            appels.append(("tarif_pose", {"type_ouvrage": ouvrage}))
    return appels


def construire_devis(demande: str, resultats: list[tuple[str, dict, str]]) -> Devis:
    """Le « raisonnement » final du faux modèle : il recopie les prix renvoyés par les outils."""
    a = analyser(demande)
    articles = {e["mots_cles"]: json.loads(r) for n, e, r in resultats if n == "chercher_article"}
    poses = {e["type_ouvrage"]: json.loads(r)["prix_ht"] for n, e, r in resultats if n == "tarif_pose"}
    lignes, hypotheses, questions = [], ["Prix du catalogue Menuiserie Dupont 2026."], list(a["questions"])
    poses_qte: dict[str, int] = {}
    for b in a["besoins"]:
        trouves = articles.get(b["mots_cles"], [])
        if not trouves:
            questions.append(f"L'article « {b['mots_cles']} » n'est pas au catalogue : souhaitez-vous une étude sur mesure ?")
            continue
        art = trouves[0]
        lignes.append({"designation": art["libelle"], "quantite": b["quantite"], "prix_unitaire_ht": art["prix_ht"]})
        if art.get("ouvrage"):
            poses_qte[art["ouvrage"]] = poses_qte.get(art["ouvrage"], 0) + b["quantite"]
    for ouvrage, qte in poses_qte.items():
        if ouvrage in poses:
            lignes.append({"designation": f"Pose {ouvrage}", "quantite": qte, "prix_unitaire_ht": poses[ouvrage]})
    if a["pro"]:
        tva = 20.0; hypotheses.append("Local professionnel : TVA 20 %.")
    elif a["age"] is None:
        tva = 20.0; hypotheses.append("Âge du logement inconnu : TVA 20 % par défaut.")
        questions.append("Le logement a-t-il plus de 2 ans ? (TVA 10 % possible)")
    else:
        tva = 10.0 if a["age"] > 2 else 20.0
    ht = round(sum(l["quantite"] * l["prix_unitaire_ht"] for l in lignes), 2)
    return Devis(client=a["client"], lignes=lignes, total_ht=ht, tva_pct=tva, total_ttc=round(ht * (1 + tva / 100), 2),
                 hypotheses=hypotheses, questions_en_suspens=questions)


def _g(o, k, d=None):
    return o.get(k, d) if isinstance(o, dict) else getattr(o, k, d)


# ---------------------------------------------------------------- faux client OpenAI (Responses API)
class _Responses:
    def __init__(self, p): self._p = p
    def create(self, **kw): return self._p._create(**kw)
    def parse(self, **kw): return self._p._parse(**kw)


class FauxOpenAI:
    PREFIXE_TOKENS = 900          # instructions + outils, identiques à chaque appel → « en cache » dès le 2e appel

    def __init__(self, boucle_infinie: bool = False):
        self.boucle_infinie = boucle_infinie
        self.responses = _Responses(self)
        self.requetes: list[dict] = []
        self._ids = itertools.count(1)

    def _verifier(self, input, tools):
        if not isinstance(input, list):
            raise ErreurRequeteSimulee("`input` doit être une liste d'items dans ce lab")
        for t in tools or []:
            if "input_schema" in t or _g(t, "type") != "function" or "parameters" not in t:
                raise ErreurRequeteSimulee("outil au mauvais format : attendu {type: 'function', name, description, parameters}")
        appels, sorties = set(), set()
        for it in input:
            t, role = _g(it, "type"), _g(it, "role")
            if role and isinstance(_g(it, "content"), list) and any(_g(c, "type") in ("function_call_output", "tool_result") for c in _g(it, "content")):
                raise ErreurRequeteSimulee("un résultat de fonction ne s'enveloppe pas dans un rôle : item de premier niveau `function_call_output`")
            if t == "function_call":
                appels.add(_g(it, "call_id"))
            elif t == "function_call_output":
                if role:
                    raise ErreurRequeteSimulee("`function_call_output` ne prend pas de rôle")
                if not isinstance(_g(it, "output"), str):
                    raise ErreurRequeteSimulee("`output` doit être une chaîne (JSON sérialisé)")
                sorties.add(_g(it, "call_id"))
        if appels - sorties:
            raise ErreurRequeteSimulee(f"No tool output found for function call {sorted(appels - sorties)[0]}")

    @staticmethod
    def _demande(input) -> str:
        for it in input:
            if _g(it, "role") == "user":
                c = _g(it, "content")
                return c if isinstance(c, str) else " ".join(_g(x, "text", "") for x in c)
        return ""

    @staticmethod
    def _resultats(input):
        appels = {_g(it, "call_id"): (_g(it, "name"), json.loads(_g(it, "arguments"))) for it in input if _g(it, "type") == "function_call"}
        return [(*appels[_g(it, "call_id")], _g(it, "output")) for it in input if _g(it, "type") == "function_call_output"]

    def _usage(self, input, sortie):
        n = len(self.requetes)
        total = self.PREFIXE_TOKENS + len(json.dumps(input, ensure_ascii=False, default=str)) // 4
        return SimpleNamespace(input_tokens=total, output_tokens=sortie,
                               input_tokens_details=SimpleNamespace(cached_tokens=0 if n == 1 else 768))

    def _create(self, model, input, instructions=None, tools=None, max_output_tokens=None, stream=False, **kw):
        self.requetes.append({"model": model, "stream": stream, "tool_choice": kw.get("tool_choice"),
                              "max_output_tokens": max_output_tokens, "instructions": bool(instructions)})
        self._verifier(input, tools)
        demande = self._demande(input)
        deja = self._resultats(input)
        if self.boucle_infinie or not deja:
            output = [SimpleNamespace(type="function_call", id=f"fc_{next(self._ids)}", call_id=f"call_sim_{next(self._ids)}",
                                      name=n, arguments=json.dumps(a, ensure_ascii=False), status="completed")
                      for n, a in appels_a_faire(demande)]
            texte = ""
        else:
            output, texte = [], "Merci pour votre demande. J'ai consulté le catalogue et la grille de pose ; voici le chiffrage."
        if texte:
            output.append(SimpleNamespace(type="message", role="assistant", id=f"msg_{next(self._ids)}",
                                          content=[SimpleNamespace(type="output_text", text=texte, annotations=[])]))
        rep = SimpleNamespace(id=f"resp_sim_{len(self.requetes)}", status="completed", output=output, output_text=texte,
                              usage=self._usage(input, max(30, len(texte) // 4 + 40 * len(output))))
        if not stream:
            return rep
        def evenements():
            for i in range(0, len(texte), 24):
                yield SimpleNamespace(type="response.output_text.delta", delta=texte[i:i + 24])
            yield SimpleNamespace(type="response.completed", response=rep)
        return evenements()

    def _parse(self, model, input, instructions=None, tools=None, text_format=None, tool_choice=None, **kw):
        self.requetes.append({"model": model, "parse": True, "tool_choice": tool_choice})
        self._verifier(input, tools)
        if text_format is None:
            raise ErreurRequeteSimulee("`text_format` (modèle Pydantic) attendu pour une sortie structurée")
        devis = construire_devis(self._demande(input), self._resultats(input))
        return SimpleNamespace(output_parsed=text_format.model_validate(devis.model_dump()),
                               usage=self._usage(input, 250))


# ---------------------------------------------------------------- faux client Anthropic (Messages API)
class _Messages:
    def __init__(self, p): self._p = p
    def create(self, **kw): return self._p._create(**kw)
    def parse(self, **kw): return self._p._parse(**kw)


class FauxAnthropic:
    PREFIXE_TOKENS = 900

    def __init__(self, boucle_infinie: bool = False):
        self.boucle_infinie = boucle_infinie
        self.messages = _Messages(self)
        self.requetes: list[dict] = []
        self._ids = itertools.count(1)

    def _verifier(self, messages, tools, max_tokens):
        if not max_tokens:
            raise ErreurRequeteSimulee("max_tokens est obligatoire sur la Messages API")
        for t in tools or []:
            if "input_schema" not in t or t.get("type") == "function":
                raise ErreurRequeteSimulee("outil au mauvais format : attendu {name, description, input_schema}")
        for m in messages:
            c = _g(m, "content")
            if isinstance(c, list) and any(_g(b, "type") == "tool_result" for b in c) and _g(m, "role") != "user":
                raise ErreurRequeteSimulee("les tool_result vont dans un message de rôle user")

    @staticmethod
    def _demande(messages) -> str:
        c = _g(messages[0], "content")
        return c if isinstance(c, str) else " ".join(_g(b, "text", "") for b in c if _g(b, "type") == "text")

    @staticmethod
    def _resultats(messages):
        appels, res = {}, []
        for m in messages:
            c = _g(m, "content")
            if not isinstance(c, list):
                continue
            for b in c:
                if _g(b, "type") == "tool_use":
                    appels[_g(b, "id")] = (_g(b, "name"), _g(b, "input"))
                elif _g(b, "type") == "tool_result":
                    res.append((*appels[_g(b, "tool_use_id")], _g(b, "content")))
        return res

    def _usage(self, messages, sortie):
        premier = len(self.requetes) == 1
        return SimpleNamespace(input_tokens=len(json.dumps(messages, ensure_ascii=False, default=str)) // 4, output_tokens=sortie,
                               cache_creation_input_tokens=self.PREFIXE_TOKENS if premier else 0,
                               cache_read_input_tokens=0 if premier else self.PREFIXE_TOKENS)

    def _create(self, model, messages, max_tokens=None, system=None, tools=None, **kw):
        self.requetes.append({"model": model})
        self._verifier(messages, tools, max_tokens)
        if self.boucle_infinie or not self._resultats(messages):
            blocs = [SimpleNamespace(type="tool_use", id=f"toolu_sim_{next(self._ids)}", name=n, input=a)
                     for n, a in appels_a_faire(self._demande(messages))]
            if blocs:
                return SimpleNamespace(content=blocs, stop_reason="tool_use", usage=self._usage(messages, 40 * len(blocs)))
        texte = "Merci pour votre demande. J'ai consulté le catalogue et la grille de pose ; voici le chiffrage."
        return SimpleNamespace(content=[SimpleNamespace(type="text", text=texte)], stop_reason="end_turn",
                               usage=self._usage(messages, 40))

    def _parse(self, model, messages, max_tokens=None, system=None, output_format=None, **kw):
        self.requetes.append({"model": model, "parse": True})
        self._verifier(messages, kw.get("tools"), max_tokens)
        devis = construire_devis(self._demande(messages), self._resultats(messages))
        return SimpleNamespace(parsed_output=output_format.model_validate(devis.model_dump()), stop_reason="end_turn",
                               usage=self._usage(messages, 250))
