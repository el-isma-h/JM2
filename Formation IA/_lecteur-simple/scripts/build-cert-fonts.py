#!/usr/bin/env python3
"""Polices statiques du certificat PDF (pdf-lib + fontkit ne savent pas instancier une police variable).

Source : paquets @fontsource-variable (woff2 variables, sous-ensembles latin + latin-ext fusionnés).
Sortie : public/fonts/certificat/*.ttf (licence SIL OFL 1.1). À relancer seulement si l'on change de graisse.
Dépendances : pip install fonttools brotli
    python3 scripts/build-cert-fonts.py
"""
import io
import pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.merge import Merger

ROOT = pathlib.Path(__file__).resolve().parent.parent
FS = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "public" / "fonts" / "certificat"
OUT.mkdir(parents=True, exist_ok=True)

TARGETS = [
    ("archivo", "archivo", 300, "Archivo-Light.ttf"),
    ("archivo", "archivo", 500, "Archivo-Medium.ttf"),
    ("inter", "inter", 400, "Inter-Regular.ttf"),
    ("jetbrains-mono", "jetbrains-mono", 400, "JetBrainsMono-Regular.ttf"),
]


def static(path: pathlib.Path, wght: int) -> bytes:
    f = TTFont(path)
    f.flavor = None
    inst = instancer.instantiateVariableFont(f, {"wght": wght}, updateFontNames=False)
    buf = io.BytesIO()
    inst.save(buf)
    return buf.getvalue()


for pkg, stem, wght, name in TARGETS:
    parts = []
    for subset in ("latin", "latin-ext"):
        src = FS / pkg / "files" / f"{stem}-{subset}-wght-normal.woff2"
        tmp = OUT / f".{subset}-{name}"
        tmp.write_bytes(static(src, wght))
        parts.append(str(tmp))
    merged = Merger().merge(parts)
    merged.save(OUT / name)
    for p in parts:
        pathlib.Path(p).unlink()
    print("OK", name, (OUT / name).stat().st_size // 1024, "Ko")
