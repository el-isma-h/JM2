#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vérifie glossaire/glossaire.json (format FORMAT.md § 4 « Lexique »).

Usage : python3 glossaire/verifier_glossaire.py   (depuis la racine du projet ou n'importe où)
Code de sortie 0 si tout est conforme, 1 sinon.
"""
import json, re, sys, glob, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLOSS = ROOT / "glossaire" / "glossaire.json"

CATEGORIES = [  # liste fermée (documentée dans glossaire/README.md)
    "IA générale et multimédia",
    "Machine learning et mathématiques",
    "Deep learning",
    "LLM et modèles de langage",
    "Prompt engineering",
    "API et développement",
    "Agents et MCP",
    "RAG et recherche sémantique",
    "LLM locaux, matériel et MLOps",
    "Automatisation",
    "Data et data engineering",
    "Sécurité",
    "Éthique et droit",
    "Formation et certification",
]
NIVEAUX = ["N1", "N2", "N3", "N4", "N5"]
CHAMPS = ["terme", "slug", "categorie", "niveau", "definition", "analogie", "exemple", "voirAussi", "lecons"]
MIN_TERMES = 350

errors, warnings = [], []
def err(m): errors.append(m)
def warn(m): warnings.append(m)

# 1. JSON valide
try:
    data = json.loads(GLOSS.read_text(encoding="utf-8"))
except Exception as e:
    print(f"ÉCHEC : JSON invalide — {e}")
    sys.exit(1)
if not isinstance(data, list):
    print("ÉCHEC : la racine doit être un tableau"); sys.exit(1)

# Référentiels : leçons du programme, fichiers de leçons, URL autorisées
prog = json.loads((ROOT / "programme" / "programme.json").read_text(encoding="utf-8"))
prog_lessons = {le["id"] for lv in prog["levels"] for mo in lv["modules"] for le in mo["lessons"]}
files = {}
for f in glob.glob(str(ROOT / "niveaux" / "**" / "L*.md"), recursive=True):
    m = re.match(r"(L\d{3})", Path(f).name)
    if m: files[m.group(1)] = f
urls_ok = set()
for f in [ROOT / "ressources" / "bibliotheque-liens.md", *sorted((ROOT / "_recherche").glob("*.md"))]:
    urls_ok |= set(re.findall(r"https?://[^\s)\]>|`\"]+", f.read_text(encoding="utf-8")))
urls_ok = {u.rstrip(".,;") for u in urls_ok}

slugs = [e.get("slug") for e in data]
slug_set = set(slugs)
for s, c in collections.Counter(slugs).items():
    if c > 1: err(f"slug dupliqué : {s} ({c}×)")

sentence_end = re.compile(r"[.!?…](?=\s+[A-ZÀ-ÖØ-Ý«\"(]|\s*$)")
for i, e in enumerate(data):
    ref = e.get("slug", f"#{i}")
    for k in CHAMPS:
        if k not in e: err(f"{ref} : champ manquant « {k} »")
    extra = set(e) - set(CHAMPS) - {"source"}
    if extra: err(f"{ref} : champs non prévus {sorted(extra)}")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", str(e.get("slug", ""))):
        err(f"{ref} : slug non kebab-case")
    if e.get("categorie") not in CATEGORIES:
        err(f"{ref} : catégorie hors liste « {e.get('categorie')} »")
    if e.get("niveau") not in NIVEAUX:
        err(f"{ref} : niveau invalide « {e.get('niveau')} »")
    for k in ["terme", "definition", "analogie", "exemple"]:
        if not isinstance(e.get(k), str) or not e.get(k, "").strip():
            err(f"{ref} : « {k} » vide ou non textuel")
    n = len(sentence_end.findall(e.get("definition", "").strip()))
    if not 2 <= n <= 3:
        warn(f"{ref} : définition de {n} phrase(s) (attendu 2-3)")
    va = e.get("voirAussi", [])
    if not isinstance(va, list): err(f"{ref} : voirAussi doit être une liste")
    else:
        for v in va:
            if v not in slug_set: err(f"{ref} : voirAussi non résolu « {v} »")
            if v == e.get("slug"): err(f"{ref} : voirAussi pointe sur lui-même")
        if len(va) != len(set(va)): err(f"{ref} : doublon dans voirAussi")
    le = e.get("lecons", [])
    if not isinstance(le, list): err(f"{ref} : lecons doit être une liste")
    else:
        for l in le:
            if not re.fullmatch(r"L\d{3}", str(l)): err(f"{ref} : id de leçon invalide « {l} »")
            elif l not in prog_lessons: err(f"{ref} : leçon {l} absente de programme.json")
            elif l not in files: err(f"{ref} : fichier de la leçon {l} introuvable")
    src = e.get("source")
    if src is not None:
        if not (isinstance(src, dict) and src.get("title") and str(src.get("url", "")).startswith("http")):
            err(f"{ref} : source mal formée")
        elif src["url"] not in urls_ok:
            err(f"{ref} : URL de source absente de _recherche/ et de la bibliothèque : {src['url']}")

if len(data) < MIN_TERMES:
    err(f"{len(data)} termes seulement (minimum {MIN_TERMES})")
if len(CATEGORIES) > 14:
    err("plus de 14 catégories définies")

# Statistiques
print(f"Termes : {len(data)}  (minimum requis : {MIN_TERMES})")
print(f"Slugs uniques : {len(slug_set)}")
print("\nRépartition par catégorie :")
cc = collections.Counter(e.get("categorie") for e in data)
for c in CATEGORIES:
    print(f"  {cc.get(c, 0):4d}  {c}")
print("\nRépartition par niveau d'introduction :")
nc = collections.Counter(e.get("niveau") for e in data)
for n in NIVEAUX:
    print(f"  {nc.get(n, 0):4d}  {n}")
avec_lecons = sum(1 for e in data if e.get("lecons"))
print(f"\nTermes reliés à ≥ 1 leçon : {avec_lecons} ; sans leçon : {len(data) - avec_lecons}")
print(f"Liens leçon (total) : {sum(len(e.get('lecons', [])) for e in data)} ; leçons distinctes citées : {len({l for e in data for l in e.get('lecons', [])})}")
print(f"Avec source : {sum(1 for e in data if 'source' in e)} ; renvois voirAussi : {sum(len(e.get('voirAussi', [])) for e in data)}")

for w in warnings: print("AVERTISSEMENT :", w)
for x in errors: print("ERREUR :", x)
print(f"\n{'OK' if not errors else 'ÉCHEC'} — {len(errors)} erreur(s), {len(warnings)} avertissement(s)")
sys.exit(1 if errors else 0)
