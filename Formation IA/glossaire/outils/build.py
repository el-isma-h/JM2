# -*- coding: utf-8 -*-
"""Construit glossaire/glossaire.json à partir des fichiers d*.py.
Le champ `lecons` est calculé par recherche (regex) dans les leçons :
on ne retient que les leçons où le terme est réellement traité
(présent dans le titre, en gras, dans un intertitre, ou mentionné souvent)."""
import json, re, glob, os, sys, importlib, collections
sys.path.insert(0, os.path.dirname(__file__))
import core
for m in ["d1_ia_ml", "d2_dl_llm", "d3_pr_dev", "d4_ag_rag_inf", "d5_auto_data", "d6_sec_droit_form", "d7_data_eng"]:
    importlib.import_module(m)

ROOT = "/home/claude/formation-ia"
prog = json.load(open(f"{ROOT}/programme/programme.json"))
LESSON_LEVEL, LESSON_TITLE = {}, {}
for lv in prog["levels"]:
    for mo in lv["modules"]:
        for le in mo["lessons"]:
            LESSON_LEVEL[le["id"]] = lv["id"]
            LESSON_TITLE[le["id"]] = le["title"]

LESSONS = {}
for f in glob.glob(f"{ROOT}/niveaux/**/L*.md", recursive=True):
    txt = open(f, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n", txt, re.S)
    head = m.group(1) if m else ""
    body = txt[m.end():] if m else txt
    lid = re.search(r"^id:\s*(L\d{3})", head, re.M).group(1)
    LESSONS[lid] = body

# Restrictions (sigles homonymes, mots génériques propres à un outil ou à un niveau)
def rng(a, b): return {f"L{i:03d}" for i in range(a, b + 1)}
N8N = rng(24, 27) | rng(32, 38) | {"L046", "L048", "L052", "L058"}
MAKE = rng(39, 40)
N4, N5, UPTO_N3 = rng(111, 150), rng(151, 184), rng(1, 110)
RAGL = {"L035", "L047", "L048", "L049", "L050"} | rng(89, 94) | rng(175, 184)
RESTRICT = {
    "dpo": {"L082"} | rng(133, 140),
    "module-make": MAKE, "scenario-make": MAKE, "credits-operations": MAKE | N8N, "zap": MAKE,
    "expression-n8n": N8N, "item-n8n": N8N, "sous-workflow": N8N, "cluster-nodes": N8N,
    "chat-trigger": N8N, "noeud-ai-agent": N8N, "data-tables": N8N, "queue-mode": N8N | {"L102"},
    "execution": N8N | MAKE, "http-request": N8N | MAKE,
    "batch": N4, "perplexite": N4, "prefill-decode": N4 | N5, "decontamination": N4 | N5,
    "streaming-de-donnees": N5, "watermark": N5, "kafka-topic": N5, "schema-en-etoile": N5,
    "data-vault": N5, "architecture-medaillon": N5, "snapshot-dbt": N5, "chargement-incremental": N5,
    "shuffle": N5, "dask-ray": N5, "stockage-objet": N5, "avro-orc-arrow": N5, "cte-et-fenetres": N5,
    "top-k-recuperation": RAGL, "fidelite": RAGL | rng(65, 184), "prompt-template": UPTO_N3,
    "objectif-pedagogique": set(), "positionnement": set(), "prerequis": set(), "jury-de-certification": set(),
    "assiduite-foad": set(), "open-badge": {"L011", "L025"}, "prefill": UPTO_N3, "vision-api": rng(65, 110), "distanciel": set(),
}
EXCLUDE = {
    "delegue-protection-donnees": {"L082"} | rng(133, 140),
    "watermarking": N5, "streaming": N5, "top-k": RAGL,
}
# Leçons où le terme est expliqué même s'il y est peu répété (ajoutées seulement si le motif y figure)
FORCE = {
    "intelligence-artificielle": ["L001"], "systeme-expert": ["L001"], "test-de-turing": ["L001"],
    "agi": ["L001", "L004"], "hiver-de-l-ia": ["L001"], "ia-etroite": ["L001"], "modele": ["L002"],
    "entrainement": ["L002"], "inference": ["L002"], "donnees-d-entrainement": ["L002"],
    "tokenizer": ["L005", "L130"], "post-entrainement": ["L007"], "modele-de-raisonnement": ["L007", "L009"],
    "benchmark": ["L009"], "prompt-engineering": ["L015", "L017"], "projet-claude": ["L011"],
    "ia-agentique": ["L026"], "on-premise": ["L041", "L062"], "watermarking": ["L029", "L030"],
    "deepfake": ["L030"], "nettoyage-des-donnees": ["L155"], "valeurs-manquantes": ["L155"],
    "knowledge-cutoff": ["L005", "L008"], "zero-shot": ["L016"], "fonction-d-activation": ["L121"],
    "self-attention": ["L128"], "explicabilite": ["L003"], "moindre-privilege": ["L109"],
    "sandbox": ["L074"], "big-data": ["L151"], "data-warehouse": ["L158"], "lakehouse": ["L157"],
    "rncp": ["L151"], "ia-responsable": ["L029", "L030", "L063"], "impact-environnemental": ["L004"],
    "secnumcloud": ["L041", "L062", "L143"], "souverainete-numerique": ["L041", "L062"], "sycophantie": ["L008"], "endpoint": ["L024", "L066"], "fonction-de-cout": ["L114"],
}

def compile_motif(p):
    flags = 0 if p.startswith("=") else re.I
    p = p[1:] if p.startswith("=") else p
    return re.compile(r"(?<![\w])(?:" + p + r")(?![\w])", flags)

def score(regs, lid):
    body = LESSONS[lid]
    title = LESSON_TITLE.get(lid, "")
    s, strong = 0, False
    if any(r.search(title) for r in regs):
        s += 12; strong = True
    heads = [l for l in body.splitlines() if l.startswith("#")]
    h = sum(1 for l in heads if any(r.search(l) for r in regs))
    s += min(h * 4, 8)
    bolds = re.findall(r"\*\*([^*\n]{1,80})\*\*", body)
    b = sum(1 for x in bolds if any(r.search(x) for r in regs))
    s += min(b * 4, 8)
    n = sum(len(r.findall(body)) for r in regs)
    s += min(n, 12)
    if (h or b) and n >= 1: strong = True
    if n >= 3: strong = True
    return s, n, strong


# Sources non institutionnelles (blogs, cabinets, organismes privés) : écartées, le champ est alors omis
BAN_SRC = {"tissot_cpf", "edof", "rnq", "qualiopi_2026", "droit_auteur", "laion", "sren", "omnibus",
           "oa_terms", "ccbyncsa", "cms_literacy"}
SRC_OVERRIDE = {"cpf": "fc_rs", "llama-cpp": None}
TERME_OVERRIDE = {
    "gpu": "GPU (Graphics Processing Unit, processeur graphique)",
    "cpu": "CPU (Central Processing Unit, processeur central)",
    "vram": "VRAM (Video RAM, mémoire de la carte graphique)",
    "kv-cache": "KV cache (cache clés-valeurs)",
    "lstm": "LSTM (Long Short-Term Memory)",
    "relu": "ReLU (Rectified Linear Unit)",
    "json": "JSON (JavaScript Object Notation)",
    "rest": "REST (Representational State Transfer)",
    "gpqa": "GPQA (Graduate-level Google-Proof Q&A)",
    "mmlu": "MMLU (Massive Multitask Language Understanding)",
    "cuda": "CUDA (Compute Unified Device Architecture)",
    "ipaas": "iPaaS (Integration Platform as a Service)",
    "nist-ai-rmf": "NIST AI RMF (AI Risk Management Framework)",
    "csv": "CSV (Comma-Separated Values)",
    "sql": "SQL (Structured Query Language)",
    "kpi": "KPI (Key Performance Indicator, indicateur clé de performance)",
    "sla": "SLA (Service Level Agreement, accord de niveau de service)",
    "sse": "SSE (Server-Sent Events)",
    "sdk": "SDK (Software Development Kit, kit de développement)",
    "npu": "NPU (Neural Processing Unit, processeur neuronal)",
    "dag": "DAG (Directed Acyclic Graph, graphe orienté acyclique)",
    "mfa": "MFA (Multi-Factor Authentication, authentification multifacteur)",
    "gguf": "GGUF (format de fichier des modèles quantifiés)",
}

THRESH = 5
out, report = [], []
from suppl1 import SUPPL
for term in core.TERMS:
    if term["slug"] in SUPPL:
        term["definition"] = term["definition"].rstrip() + " " + SUPPL[term["slug"]]
    regs = [compile_motif(p) for p in term["motifs"]]
    sc, counts = {}, {}
    for lid in LESSONS:
        if term["slug"] in RESTRICT and lid not in RESTRICT[term["slug"]]:
            continue
        if term["slug"] in EXCLUDE and lid in EXCLUDE[term["slug"]]:
            continue
        s, n, strong = score(regs, lid)
        counts[lid] = n
        if s >= THRESH and strong:
            sc[lid] = s
    top = sorted(sc, key=lambda k: (-sc[k], k))[:4]
    early = sorted(k for k in sc if sc[k] >= 8)
    if early and early[0] not in top:
        top.append(early[0])
    for lid in FORCE.get(term["slug"], []):
        if lid in LESSONS and counts.get(lid, 0) >= 1 and lid not in top:
            top.append(lid); sc[lid] = sc.get(lid, 0)
    lecons = sorted(top)
    niveau = LESSON_LEVEL.get(lecons[0], term["niv"]) if lecons else term["niv"]
    e = {
        "terme": term["terme"],
        "slug": term["slug"],
        "categorie": core.CATS[term["cat"]],
        "niveau": niveau,
        "definition": term["definition"],
        "analogie": term["analogie"],
        "exemple": term["exemple"],
        "voirAussi": term["voir"],
        "lecons": lecons,
    }
    src = SRC_OVERRIDE.get(term["slug"], term["src"])
    if src in BAN_SRC:
        src = None
    e["terme"] = TERME_OVERRIDE.get(term["slug"], e["terme"])
    if src:
        title, url = core.S[src]
        e["source"] = {"title": title, "url": url}
    out.append(e)
    report.append((term["slug"], term["niv"], niveau, lecons, {k: sc[k] for k in lecons}))

slugs = {e["slug"] for e in out}
# voirAussi : on ne garde que les slugs existants (et on signale les manquants)
missing = collections.Counter()
for e in out:
    keep = []
    for v in e["voirAussi"]:
        if v in slugs and v != e["slug"] and v not in keep:
            keep.append(v)
        elif v not in slugs:
            missing[v] += 1
    e["voirAussi"] = keep

out.sort(key=lambda e: core.slugify(e["terme"]))
os.makedirs(f"{ROOT}/glossaire", exist_ok=True)
with open(f"{ROOT}/glossaire/glossaire.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
    f.write("\n")

with open(os.path.join(os.path.dirname(__file__), "report.txt"), "w") as f:
    for r in report:
        f.write(f"{r[0]:40s} def={r[1]} calc={r[2]} {r[3]} {r[4]}\n")
print("termes:", len(out))
print("voirAussi manquants:", dict(missing))
dup = [s for s, c in collections.Counter(e["slug"] for e in out).items() if c > 1]
print("slugs dupliqués:", dup)
print("sans leçon:", sum(1 for e in out if not e["lecons"]))
