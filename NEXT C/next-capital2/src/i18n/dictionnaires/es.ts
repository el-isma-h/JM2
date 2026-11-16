import type { DeepPartial } from "..";
import type { Dict } from "./fr";

const es: DeepPartial<Dict> = {
  meta: { titre: "NEXT Capital: fondo de inversión tokenizado", description: "NEXT Capital, fondo participativo tokenizado que invierte en las mejores startups de IA, cuántica, agroalimentación y deporte. Plataforma de demostración." },
  commun: { demo: "Plataforma de demostración: NEXT Capital aún no cuenta con autorización. No es posible ninguna suscripción real.", demoCourt: "Demostración", exemple: "Ejemplo ficticio", risque: "Invertir en empresas no cotizadas conlleva riesgo de pérdida de capital y de liquidez. Invierta solo el dinero que no necesite de inmediato.", enSavoirPlus: "Más información", decouvrir: "Descubrir", candidater: "Solicitar", connexion: "Iniciar sesión", deconnexion: "Cerrar sesión", monEspace: "Mi cuenta", admin: "Administración", retour: "Volver", suivant: "Siguiente", precedent: "Anterior", envoyer: "Enviar", valider: "Validar", confirmer: "Confirmar", annuler: "Cancelar", enregistrer: "Guardar", chargement: "Cargando…", oui: "Sí", non: "No", langue: "Idioma", total: "Total", date: "Fecha", montant: "Importe", statut: "Estado", reference: "Referencia", actions: "Acciones", aucun: "Nada por ahora." },
  nav: { fonds: "El fondo", theses: "Tesis", marches: "Mercados", token: "El token", deals: "Operaciones", adhesion: "Membresía", parcours: "Recorrido", apropos: "Acerca de", faq: "FAQ", risques: "Riesgos" },
  pied: { accroche: "La nueva generación de fondos de inversión: un token, las mejores operaciones.", investir: "Invertir", ressources: "Recursos", legal: "Legal", mentions: "Aviso legal", confidentialite: "Privacidad", cookies: "Cookies", siege: "Sede: Luxemburgo (en constitución)" },
  accueil: {
    sur: "Fondo de inversión tokenizado", titre1: "Un solo token.", titre2: "Las mejores operaciones del mercado.",
    accroche: "NEXT Capital reúne a inversores cualificados en torno a un token único, el NXT, cuyo capital se despliega en las startups más prometedoras de Europa y Estados Unidos: inteligencia artificial, cuántica, agroalimentación, deporte.",
    cta: "Unirse al fondo", cta2: "Entender el token", des: "desde", parInvestissement: "por suscripción",
    chiffres: [{ v: "4", l: "tesis de inversión" }, { v: "1.500 €", l: "ticket de entrada" }, { v: "20 %", l: "comisión solo sobre la plusvalía" }, { v: "8", l: "idiomas, una sola plataforma" }],
    piliersSur: "Por qué NEXT Capital", piliersTitre: "El modelo de los grandes fondos, la accesibilidad de un club",
    piliers: [
      { t: "Un token, una cartera", d: "Suscribe NXT. El fondo despliega el capital en una selección de startups. Lo sigue todo desde un único panel." },
      { t: "Acceso a las mejores operaciones", d: "Promociones de Y Combinator, startups europeas de Seed a Serie A/B, operaciones internas, redes de Luxemburgo y Miami." },
      { t: "Selección exigente", d: "Menos del 1 % de los expedientes analizados se retienen. Cada uno pasa una due diligence financiera, jurídica y sectorial." },
      { t: "Trazabilidad total", d: "Cada depósito, cada suscripción, cada euro queda inscrito en un libro consultable en todo momento. El token NXT se emitirá en ERC-20." },
    ],
    canauxSur: "Canales de acceso", canauxTitre: "Donde se hacen las mejores operaciones", thesesSur: "Cuatro tesis", thesesTitre: "Donde concentramos el capital", parcoursSur: "Recorrido", parcoursTitre: "De la solicitud a la cartera",
    ctaFinalTitre: "¿Listo para unirse a la nueva ola?", ctaFinalTexte: "La solicitud lleva diez minutos. Nuestro equipo revisa su expediente antes de abrir su cuenta.",
  },
  theses: { titre: "Nuestras cuatro tesis de inversión", allocation: "Asignación objetivo", stades: "Etapas", horizon: "Horizonte", perf: "Objetivo de rendimiento", ans: "años",
    ia: { nom: "Inteligencia artificial", accroche: "Infraestructuras, agentes y aplicaciones verticales" }, quantique: { nom: "Cuántica", accroche: "La computación de la próxima década" }, agroalimentaire: { nom: "Agroalimentación", accroche: "Alimentar mejor, producir de otra manera" }, sport: { nom: "Deporte", accroche: "Rendimiento, datos y experiencia" } },
  fonds: { titre: "El fondo" }, token: { titre: "El token NXT", comment: "Cómo funciona" }, deals: { titre: "Operaciones", ouvert: "En curso", a_venir: "Próximamente", cloture: "Cerrada", objectif: "Objetivo", alloue: "Asignado", voir: "Ver expediente" },
  adhesion: { titre: "Membresía y estatus", niveauxTitre: "Niveles de membresía", parAn: "/ año", plafondAn: "Inversión máx. / año", plafondOp: "Inversión máx. / suscripción", frais: "Comisión de estructuración", bons: "Bonos de prioridad", illimite: "Ilimitado", chargeAffaire: "Gestor dedicado", vip: "Eventos VIP", diners: "Cenas privadas", statutsTitre: "Estatus por capital invertido",
    statuts: { membre: { nom: "Miembro" }, partenaire: { nom: "Socio" }, associe: { nom: "Asociado" }, club50: { nom: "Club 50" }, cercle100: { nom: "Círculo 100" } }, aPartirDe: "desde", choisir: "Elegir este nivel" },
  parcours: { titre: "El recorrido de inversión" }, apropos: { titre: "Acerca de" }, faq: { titre: "Preguntas frecuentes" }, risques: { titre: "Advertencia sobre los riesgos" },
  connexion: { titre: "Iniciar sesión", email: "Correo electrónico", motDePasse: "Contraseña", bouton: "Entrar", erreur: "Credenciales incorrectas.", pasDeCompte: "¿Aún sin cuenta?", candidater: "Presentar una solicitud", demoTitre: "Cuentas de demostración" },
  candidature: { titre: "Solicitud", intro: "Nuestro equipo revisa su expediente antes de abrir su cuenta. Cuente diez minutos.", etapes: ["Identidad", "Situación", "Perfil inversor", "Membresía", "Documentos", "Confirmación"],
    identite: { prenom: "Nombre", nom: "Apellidos", email: "Correo electrónico", telephone: "Teléfono", pays: "País de residencia", naissance: "Fecha de nacimiento", nationalite: "Nacionalidad", adresse: "Dirección postal", motDePasse: "Contraseña (mínimo 8 caracteres)" },
    situation: { situation: "Situación profesional", secteur: "Sector de actividad", revenus: "Ingresos anuales", patrimoine: "Patrimonio financiero", origineFonds: "Origen de los fondos" },
    profil: { zones: "Zonas de inversión preferidas", theses: "Tesis que le interesan", risque: "Tolerancia al riesgo", rendement: "Rentabilidad objetivo", horizon: "Horizonte de inversión", experience: "Experiencia en no cotizado" },
    adhesionTitre: "Elija su nivel de membresía", merciTitre: "Solicitud recibida" },
  compte: { bienvenue: "Bienvenido", tableau: "Panel", wallet: "Wallet", souscrire: "Suscribir", historique: "Historial", portefeuille: "Cartera", documents: "Documentos", statut: "Estatus", profil: "Perfil", solde: "Saldo disponible", tokens: "NXT en cartera", capitalInvesti: "Capital invertido", deposer: "Depositar fondos", sepa: "Transferencia SEPA", carte: "Tarjeta / Apple Pay", crypto: "Cripto", souscrireTitre: "Suscribir NXT", confirmerSous: "Confirmar suscripción", payerAdhesion: "Pagar mi membresía" },
  chatbot: { titre: "Asistente NEXT", accroche: "Le oriento: fondo, token, membresía, recorrido.", placeholder: "Haga su pregunta…", avertissement: "Asistente automático: información general, no asesoramiento de inversión.", suggestions: ["¿Cómo funciona el token NXT?", "¿Cuál es el ticket mínimo?", "¿Cuáles son las comisiones?", "¿Cómo solicito?"], ouvrir: "Abrir el asistente", fermer: "Cerrar" },
};
export default es;
