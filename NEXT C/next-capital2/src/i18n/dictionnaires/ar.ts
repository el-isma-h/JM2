import type { DeepPartial } from "..";
import type { Dict } from "./fr";

const ar: DeepPartial<Dict> = {
  meta: { titre: "NEXT Capital: صندوق استثمار مرمَّز", description: "NEXT Capital، صندوق استثمار تشاركي مرمَّز يستثمر في أفضل الشركات الناشئة في الذكاء الاصطناعي والحوسبة الكمية والصناعات الغذائية والرياضة. منصة تجريبية." },
  commun: { demo: "منصة تجريبية: لم يحصل NEXT Capital بعد على الترخيص. لا يمكن إجراء أي اكتتاب حقيقي.", demoCourt: "عرض تجريبي", exemple: "مثال افتراضي", risque: "ينطوي الاستثمار في الشركات غير المدرجة على مخاطر خسارة رأس المال ونقص السيولة. لا تستثمر إلا المال الذي لا تحتاجه فورًا.", enSavoirPlus: "اعرف المزيد", decouvrir: "اكتشف", candidater: "تقديم طلب", connexion: "تسجيل الدخول", deconnexion: "تسجيل الخروج", monEspace: "حسابي", admin: "الإدارة", retour: "رجوع", suivant: "التالي", precedent: "السابق", envoyer: "إرسال", valider: "تأكيد", confirmer: "تأكيد", annuler: "إلغاء", enregistrer: "حفظ", chargement: "جارٍ التحميل…", oui: "نعم", non: "لا", langue: "اللغة", total: "المجموع", date: "التاريخ", montant: "المبلغ", statut: "الحالة", reference: "المرجع", actions: "الإجراءات", aucun: "لا يوجد شيء حاليًا." },
  nav: { fonds: "الصندوق", theses: "الأطروحات", marches: "الأسواق", token: "الرمز", deals: "الصفقات", adhesion: "العضوية", parcours: "المسار", apropos: "من نحن", faq: "الأسئلة الشائعة", risques: "المخاطر" },
  pied: { accroche: "الجيل الجديد من صناديق الاستثمار: رمز واحد، وأفضل الصفقات.", investir: "الاستثمار", ressources: "الموارد", legal: "قانوني", mentions: "إشعار قانوني", confidentialite: "الخصوصية", cookies: "ملفات تعريف الارتباط", siege: "المقر: لوكسمبورغ (قيد التأسيس)" },
  accueil: {
    sur: "صندوق استثمار مرمَّز", titre1: "رمز واحد.", titre2: "أفضل الصفقات في السوق.",
    accroche: "يجمع NEXT Capital مستثمرين مؤهلين حول رمز واحد، NXT، يُستثمر رأسماله في أكثر الشركات الناشئة الواعدة في أوروبا والولايات المتحدة: الذكاء الاصطناعي، الحوسبة الكمية، الصناعات الغذائية، الرياضة.",
    cta: "الانضمام إلى الصندوق", cta2: "فهم الرمز", des: "ابتداءً من", parInvestissement: "لكل اكتتاب",
    chiffres: [{ v: "4", l: "أطروحات استثمارية" }, { v: "1,500 €", l: "تذكرة الدخول" }, { v: "20 %", l: "عمولة على الأرباح فقط" }, { v: "8", l: "لغات، منصة واحدة" }],
    piliersSur: "لماذا NEXT Capital", piliersTitre: "نموذج الصناديق الكبرى، وسهولة الوصول إلى نادٍ",
    piliers: [
      { t: "رمز واحد، محفظة واحدة", d: "تكتتب في NXT. يستثمر الصندوق رأس المال في مجموعة مختارة من الشركات الناشئة. تتابع كل شيء من لوحة واحدة." },
      { t: "الوصول إلى أفضل الصفقات", d: "دفعات Y Combinator، شركات أوروبية ناشئة من Seed إلى Series A/B، صفقات داخلية، شبكات لوكسمبورغ وميامي." },
      { t: "اختيار صارم", d: "أقل من 1 % من الملفات المدروسة يتم اعتمادها. يخضع كل ملف لعناية واجبة مالية وقانونية وقطاعية." },
      { t: "تتبع كامل", d: "كل إيداع، وكل اكتتاب، وكل يورو يُسجَّل في دفتر يمكن الاطلاع عليه في أي وقت. سيُصدر رمز NXT بمعيار ERC-20." },
    ],
    canauxSur: "قنوات الوصول", canauxTitre: "حيث تتم أفضل العمليات", thesesSur: "أربع أطروحات", thesesTitre: "أين نركز رأس المال", parcoursSur: "المسار", parcoursTitre: "من الطلب إلى المحفظة",
    ctaFinalTitre: "مستعد للانضمام إلى الموجة الجديدة؟", ctaFinalTexte: "يستغرق الطلب عشر دقائق. يراجع فريقنا ملفك قبل فتح حسابك.",
  },
  theses: { titre: "أطروحاتنا الاستثمارية الأربع", allocation: "التخصيص المستهدف", stades: "المراحل", horizon: "الأفق", perf: "هدف الأداء", ans: "سنوات",
    ia: { nom: "الذكاء الاصطناعي", accroche: "البنى التحتية والوكلاء والتطبيقات القطاعية" }, quantique: { nom: "الحوسبة الكمية", accroche: "حوسبة العقد القادم" }, agroalimentaire: { nom: "الصناعات الغذائية", accroche: "تغذية أفضل، إنتاج مختلف" }, sport: { nom: "الرياضة", accroche: "الأداء والبيانات والتجربة" } },
  fonds: { titre: "الصندوق" }, token: { titre: "رمز NXT", comment: "كيف يعمل" }, deals: { titre: "الصفقات", ouvert: "مفتوحة", a_venir: "قادمة", cloture: "مغلقة", objectif: "الهدف", alloue: "المخصص", voir: "عرض الملف" },
  adhesion: { titre: "العضوية والمكانة", niveauxTitre: "مستويات العضوية", parAn: "/ سنة", plafondAn: "الحد الأقصى للاستثمار / سنة", plafondOp: "الحد الأقصى / اكتتاب", frais: "رسوم الهيكلة", bons: "قسائم الأولوية", illimite: "غير محدود", chargeAffaire: "مدير علاقات مخصص", vip: "فعاليات VIP", diners: "عشاءات خاصة", statutsTitre: "المكانة حسب رأس المال المستثمر",
    statuts: { membre: { nom: "عضو" }, partenaire: { nom: "شريك" }, associe: { nom: "مساهم" }, club50: { nom: "نادي 50" }, cercle100: { nom: "دائرة 100" } }, aPartirDe: "ابتداءً من", choisir: "اختيار هذا المستوى" },
  parcours: { titre: "مسار الاستثمار" }, apropos: { titre: "من نحن" }, faq: { titre: "الأسئلة الشائعة" }, risques: { titre: "تحذير من المخاطر" },
  connexion: { titre: "تسجيل الدخول", email: "البريد الإلكتروني", motDePasse: "كلمة المرور", bouton: "دخول", erreur: "بيانات الدخول غير صحيحة.", pasDeCompte: "ليس لديك حساب بعد؟", candidater: "تقديم طلب", demoTitre: "حسابات تجريبية" },
  candidature: { titre: "طلب الانضمام", intro: "يراجع فريقنا ملفك قبل فتح حسابك. خصص عشر دقائق.", etapes: ["الهوية", "الوضع", "ملف المستثمر", "العضوية", "المستندات", "التأكيد"],
    identite: { prenom: "الاسم الأول", nom: "اسم العائلة", email: "البريد الإلكتروني", telephone: "الهاتف", pays: "بلد الإقامة", naissance: "تاريخ الميلاد", nationalite: "الجنسية", adresse: "العنوان البريدي", motDePasse: "كلمة المرور (8 أحرف على الأقل)" },
    situation: { situation: "الوضع المهني", secteur: "قطاع النشاط", revenus: "الدخل السنوي", patrimoine: "الأصول المالية", origineFonds: "مصدر الأموال" },
    profil: { zones: "مناطق الاستثمار المفضلة", theses: "الأطروحات التي تهمك", risque: "تحمل المخاطر", rendement: "العائد المستهدف", horizon: "أفق الاستثمار", experience: "الخبرة في الأسواق الخاصة" },
    adhesionTitre: "اختر مستوى عضويتك", merciTitre: "تم استلام الطلب" },
  compte: { bienvenue: "مرحبًا", tableau: "لوحة التحكم", wallet: "المحفظة", souscrire: "اكتتاب", historique: "السجل", portefeuille: "الاستثمارات", documents: "المستندات", statut: "المكانة", profil: "الملف الشخصي", solde: "الرصيد المتاح", tokens: "NXT المملوكة", capitalInvesti: "رأس المال المستثمر", deposer: "إيداع الأموال", sepa: "تحويل SEPA", carte: "بطاقة / Apple Pay", crypto: "عملات رقمية", souscrireTitre: "اكتتاب في NXT", confirmerSous: "تأكيد الاكتتاب", payerAdhesion: "دفع عضويتي" },
  chatbot: { titre: "مساعد NEXT", accroche: "أرشدك: الصندوق، الرمز، العضوية، المسار.", placeholder: "اطرح سؤالك…", avertissement: "مساعد آلي: معلومات عامة وليست نصيحة استثمارية.", suggestions: ["كيف يعمل رمز NXT؟", "ما هو الحد الأدنى للاكتتاب؟", "ما هي الرسوم؟", "كيف أقدم طلبًا؟"], ouvrir: "فتح المساعد", fermer: "إغلاق" },
};
export default ar;
