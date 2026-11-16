"""Décision de diffusion (humain dans la boucle) et envoi SMTP facultatif."""
from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage

AVERTISSEMENT = "\n\n⚠️ CONTRÔLE AUTOMATIQUE : chiffres non reconnus {liste} — rapport à relire avant diffusion."


def decider(kpi: dict, inconnus: list[str]) -> str:
    """« non_genere » si la source est vide, « responsable » si le contrôle a échoué, sinon « direction »."""
    # TODO 5 : l'alerte (source vide) prime sur le contrôle ; un chiffre inconnu → relecture humaine
    raise NotImplementedError("TODO 5 : décider de la diffusion (decider)")


def texte_final(texte: str, inconnus: list[str]) -> str:
    return texte + AVERTISSEMENT.format(liste=", ".join(inconnus)) if inconnus else texte


def envoyer(texte: str, destinataire: str) -> bool:
    """Envoie par SMTP si SMTP_HOST et SMTP_USER sont définis ; sinon ne fait rien et renvoie False."""
    if not (os.environ.get("SMTP_HOST") and os.environ.get("SMTP_USER") and destinataire):
        return False
    msg = EmailMessage()
    msg["Subject"] = texte.splitlines()[0].replace("Objet : ", "")
    msg["From"], msg["To"] = os.environ["SMTP_USER"], destinataire
    msg.set_content(texte)
    with smtplib.SMTP(os.environ["SMTP_HOST"], int(os.environ.get("SMTP_PORT", "587"))) as s:
        s.starttls()
        s.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
        s.send_message(msg)
    return True
