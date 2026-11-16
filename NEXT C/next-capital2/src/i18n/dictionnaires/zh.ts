import type { DeepPartial } from "..";
import type { Dict } from "./fr";

const zh: DeepPartial<Dict> = {
  meta: { titre: "NEXT Capital：代币化投资基金", description: "NEXT Capital 是一只代币化参与型基金，投资于人工智能、量子、农业食品和体育领域最具潜力的初创企业。演示平台。" },
  commun: { demo: "演示平台：NEXT Capital 尚未获得监管许可。无法进行任何真实认购。", demoCourt: "演示", exemple: "虚构示例", risque: "投资非上市公司存在本金损失和流动性风险。请仅投资您近期不需要的资金。", enSavoirPlus: "了解更多", decouvrir: "探索", candidater: "申请", connexion: "登录", deconnexion: "退出", monEspace: "我的账户", admin: "管理", retour: "返回", suivant: "下一步", precedent: "上一步", envoyer: "发送", valider: "确认", confirmer: "确认", annuler: "取消", enregistrer: "保存", chargement: "加载中…", oui: "是", non: "否", langue: "语言", total: "合计", date: "日期", montant: "金额", statut: "状态", reference: "参考号", actions: "操作", aucun: "暂无内容。" },
  nav: { fonds: "基金", theses: "投资主题", marches: "市场", token: "代币", deals: "项目", adhesion: "会员", parcours: "流程", apropos: "关于", faq: "常见问题", risques: "风险" },
  pied: { accroche: "新一代投资基金：一枚代币，最优项目。", investir: "投资", ressources: "资源", legal: "法律", mentions: "法律声明", confidentialite: "隐私", cookies: "Cookie", siege: "注册地：卢森堡（设立中）" },
  accueil: {
    sur: "代币化投资基金", titre1: "一枚代币。", titre2: "市场上最优的项目。",
    accroche: "NEXT Capital 将合格投资者汇聚于单一代币 NXT，其资本投向欧洲和美国最具潜力的初创企业：人工智能、量子、农业食品、体育。",
    cta: "加入基金", cta2: "了解代币", des: "起", parInvestissement: "每次认购",
    chiffres: [{ v: "4", l: "投资主题" }, { v: "1,500 €", l: "最低认购额" }, { v: "20 %", l: "仅对收益收取业绩报酬" }, { v: "8", l: "种语言，一个平台" }],
    piliersSur: "为什么选择 NEXT Capital", piliersTitre: "大型基金的模式，俱乐部的亲近",
    piliers: [
      { t: "一枚代币，一个组合", d: "您认购 NXT，基金将资本投向精选初创企业。您在一个仪表盘上跟踪全部情况。" },
      { t: "获取最优项目", d: "Y Combinator 批次、从种子轮到 A/B 轮的欧洲初创企业、内部项目、卢森堡与迈阿密网络。" },
      { t: "严格筛选", d: "经审核的项目中不足 1 % 被采纳。每个项目都经过财务、法律和行业尽职调查。" },
      { t: "全程可追溯", d: "每一笔存款、每一次认购、每一欧元都记录在可随时查阅的账本中。NXT 代币将以 ERC-20 发行。" },
    ],
    canauxSur: "项目渠道", canauxTitre: "最优交易发生的地方", thesesSur: "四大主题", thesesTitre: "我们集中资本的领域", parcoursSur: "流程", parcoursTitre: "从申请到投资组合",
    ctaFinalTitre: "准备好加入新浪潮了吗？", ctaFinalTexte: "申请仅需十分钟。开户前由我们的团队审核您的资料。",
  },
  theses: { titre: "我们的四大投资主题", allocation: "目标配置", stades: "阶段", horizon: "期限", perf: "业绩目标", ans: "年",
    ia: { nom: "人工智能", accroche: "基础设施、智能体与垂直应用" }, quantique: { nom: "量子", accroche: "下一个十年的计算" }, agroalimentaire: { nom: "农业食品", accroche: "吃得更好，生产方式不同" }, sport: { nom: "体育", accroche: "表现、数据与体验" } },
  fonds: { titre: "基金" }, token: { titre: "NXT 代币", comment: "运作方式" }, deals: { titre: "项目", ouvert: "进行中", a_venir: "即将推出", cloture: "已结束", objectif: "目标", alloue: "已配置", voir: "查看项目" },
  adhesion: { titre: "会员与等级", niveauxTitre: "会员等级", parAn: "/ 年", plafondAn: "年度最高投资额", plafondOp: "单次认购上限", frais: "结构化费用", bons: "优先权", illimite: "无限制", chargeAffaire: "专属客户经理", vip: "VIP 活动", diners: "私人晚宴", statutsTitre: "按投资额划分的等级",
    statuts: { membre: { nom: "会员" }, partenaire: { nom: "合作伙伴" }, associe: { nom: "联席成员" }, club50: { nom: "50 俱乐部" }, cercle100: { nom: "100 圈层" } }, aPartirDe: "起", choisir: "选择此等级" },
  parcours: { titre: "投资流程" }, apropos: { titre: "关于" }, faq: { titre: "常见问题" }, risques: { titre: "风险提示" },
  connexion: { titre: "登录", email: "电子邮箱", motDePasse: "密码", bouton: "登录", erreur: "账号或密码错误。", pasDeCompte: "还没有账户？", candidater: "提交申请", demoTitre: "演示账户" },
  candidature: { titre: "申请", intro: "开户前由我们的团队审核您的资料。约需十分钟。", etapes: ["身份", "情况", "投资者画像", "会员", "文件", "确认"],
    identite: { prenom: "名", nom: "姓", email: "电子邮箱", telephone: "电话", pays: "居住国", naissance: "出生日期", nationalite: "国籍", adresse: "邮寄地址", motDePasse: "密码（至少 8 个字符）" },
    situation: { situation: "职业状况", secteur: "行业", revenus: "年收入", patrimoine: "金融资产", origineFonds: "资金来源" },
    profil: { zones: "偏好的投资地区", theses: "感兴趣的主题", risque: "风险承受度", rendement: "目标回报", horizon: "投资期限", experience: "非上市投资经验" },
    adhesionTitre: "选择您的会员等级", merciTitre: "申请已收到" },
  compte: { bienvenue: "欢迎", tableau: "仪表盘", wallet: "钱包", souscrire: "认购", historique: "历史", portefeuille: "投资组合", documents: "文件", statut: "等级", profil: "个人资料", solde: "可用余额", tokens: "持有 NXT", capitalInvesti: "已投资本", deposer: "存入资金", sepa: "SEPA 转账", carte: "银行卡 / Apple Pay", crypto: "加密货币", souscrireTitre: "认购 NXT", confirmerSous: "确认认购", payerAdhesion: "支付会员费" },
  chatbot: { titre: "NEXT 助手", accroche: "为您指引：基金、代币、会员、流程。", placeholder: "请输入您的问题…", avertissement: "自动助手：仅提供一般信息，不构成投资建议。", suggestions: ["NXT 代币如何运作？", "最低认购额是多少？", "费用有哪些？", "如何申请？"], ouvrir: "打开助手", fermer: "关闭" },
};
export default zh;
