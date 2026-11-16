import type { DeepPartial } from "..";
import type { Dict } from "./fr";

const ja: DeepPartial<Dict> = {
  meta: { titre: "NEXT Capital：トークン化投資ファンド", description: "NEXT Capitalは、AI・量子・食品・スポーツ分野の有望スタートアップに投資するトークン化参加型ファンドです。デモ用プラットフォーム。" },
  commun: { demo: "デモ用プラットフォーム：NEXT Capitalはまだ認可を受けていません。実際の申込はできません。", demoCourt: "デモ", exemple: "架空の例", risque: "非上場企業への投資には元本毀損および流動性のリスクがあります。当面必要のない資金のみを投資してください。", enSavoirPlus: "詳しく見る", decouvrir: "見る", candidater: "申請する", connexion: "ログイン", deconnexion: "ログアウト", monEspace: "マイページ", admin: "管理", retour: "戻る", suivant: "次へ", precedent: "前へ", envoyer: "送信", valider: "確定", confirmer: "確認", annuler: "キャンセル", enregistrer: "保存", chargement: "読み込み中…", oui: "はい", non: "いいえ", langue: "言語", total: "合計", date: "日付", montant: "金額", statut: "ステータス", reference: "参照番号", actions: "操作", aucun: "まだ項目がありません。" },
  nav: { fonds: "ファンド", theses: "投資テーマ", marches: "市場", token: "トークン", deals: "案件", adhesion: "メンバーシップ", parcours: "流れ", apropos: "会社概要", faq: "FAQ", risques: "リスク" },
  pied: { accroche: "次世代の投資ファンド：ひとつのトークンで、最良の案件へ。", investir: "投資", ressources: "リソース", legal: "法務", mentions: "法的表示", confidentialite: "プライバシー", cookies: "クッキー", siege: "所在地：ルクセンブルク（設立手続中）" },
  accueil: {
    sur: "トークン化投資ファンド", titre1: "ひとつのトークン。", titre2: "市場で最良の案件。",
    accroche: "NEXT Capitalは、適格投資家を単一トークンNXTのもとに集め、その資本を欧州および米国の最も有望なスタートアップへ投下します：人工知能、量子、食品、スポーツ。",
    cta: "ファンドに参加", cta2: "トークンを理解する", des: "最低", parInvestissement: "申込あたり",
    chiffres: [{ v: "4", l: "投資テーマ" }, { v: "1,500 €", l: "最低申込額" }, { v: "20 %", l: "成功報酬は利益にのみ" }, { v: "8", l: "言語、ひとつのプラットフォーム" }],
    piliersSur: "NEXT Capitalを選ぶ理由", piliersTitre: "大手ファンドのモデル、クラブの身近さ",
    piliers: [
      { t: "ひとつのトークン、ひとつのポートフォリオ", d: "NXTを申し込むと、ファンドが厳選したスタートアップに資本を投下します。ひとつのダッシュボードで全体を把握できます。" },
      { t: "最良の案件へのアクセス", d: "Y Combinatorのバッチ、シードからシリーズA/Bの欧州スタートアップ、内部案件、ルクセンブルクとマイアミのネットワーク。" },
      { t: "厳格な選定", d: "審査した案件のうち採用されるのは1 %未満。各案件は財務・法務・業界のデューデリジェンスを受けます。" },
      { t: "完全なトレーサビリティ", d: "すべての入金、申込、1ユーロ単位の動きが、いつでも閲覧できる台帳に記録されます。NXTトークンはERC-20で発行予定です。" },
    ],
    canauxSur: "案件チャネル", canauxTitre: "最良の取引が生まれる場所", thesesSur: "4つのテーマ", thesesTitre: "資本を集中する領域", parcoursSur: "流れ", parcoursTitre: "申請からポートフォリオまで",
    ctaFinalTitre: "次の波に乗る準備はできましたか？", ctaFinalTexte: "申請は10分で完了します。口座開設前に当社チームが審査します。",
  },
  theses: { titre: "4つの投資テーマ", allocation: "目標配分", stades: "ステージ", horizon: "期間", perf: "目標リターン", ans: "年",
    ia: { nom: "人工知能", accroche: "インフラ、エージェント、業種特化アプリ" }, quantique: { nom: "量子", accroche: "次の10年のコンピューティング" }, agroalimentaire: { nom: "食品・農業", accroche: "より良く食べ、違う方法で生産する" }, sport: { nom: "スポーツ", accroche: "パフォーマンス、データ、体験" } },
  fonds: { titre: "ファンド" }, token: { titre: "NXTトークン", comment: "仕組み" }, deals: { titre: "案件", ouvert: "募集中", a_venir: "近日公開", cloture: "終了", objectif: "目標額", alloue: "配分済み", voir: "案件を見る" },
  adhesion: { titre: "メンバーシップとステータス", niveauxTitre: "メンバーシップのレベル", parAn: "/ 年", plafondAn: "年間投資上限", plafondOp: "1回あたりの上限", frais: "ストラクチャリング手数料", bons: "優先権", illimite: "無制限", chargeAffaire: "専任担当者", vip: "VIPイベント", diners: "プライベートディナー", statutsTitre: "投資額によるステータス",
    statuts: { membre: { nom: "メンバー" }, partenaire: { nom: "パートナー" }, associe: { nom: "アソシエイト" }, club50: { nom: "クラブ50" }, cercle100: { nom: "サークル100" } }, aPartirDe: "最低", choisir: "このレベルを選ぶ" },
  parcours: { titre: "投資の流れ" }, apropos: { titre: "会社概要" }, faq: { titre: "よくある質問" }, risques: { titre: "リスクに関する警告" },
  connexion: { titre: "ログイン", email: "メールアドレス", motDePasse: "パスワード", bouton: "ログイン", erreur: "認証情報が正しくありません。", pasDeCompte: "アカウントをお持ちでない方", candidater: "申請する", demoTitre: "デモアカウント" },
  candidature: { titre: "申請", intro: "口座開設前に当社チームが審査します。所要時間は約10分です。", etapes: ["本人情報", "状況", "投資家プロフィール", "メンバーシップ", "書類", "確認"],
    identite: { prenom: "名", nom: "姓", email: "メールアドレス", telephone: "電話番号", pays: "居住国", naissance: "生年月日", nationalite: "国籍", adresse: "住所", motDePasse: "パスワード（8文字以上）" },
    situation: { situation: "職業", secteur: "業種", revenus: "年収", patrimoine: "金融資産", origineFonds: "資金の出所" },
    profil: { zones: "希望する投資地域", theses: "関心のあるテーマ", risque: "リスク許容度", rendement: "目標リターン", horizon: "投資期間", experience: "非上場投資の経験" },
    adhesionTitre: "メンバーシップのレベルを選択", merciTitre: "申請を受け付けました" },
  compte: { bienvenue: "ようこそ", tableau: "ダッシュボード", wallet: "ウォレット", souscrire: "申込", historique: "履歴", portefeuille: "ポートフォリオ", documents: "書類", statut: "ステータス", profil: "プロフィール", solde: "利用可能残高", tokens: "保有NXT", capitalInvesti: "投資額", deposer: "入金する", sepa: "SEPA送金", carte: "カード / Apple Pay", crypto: "暗号資産", souscrireTitre: "NXTを申し込む", confirmerSous: "申込を確定", payerAdhesion: "メンバーシップを支払う" },
  chatbot: { titre: "NEXTアシスタント", accroche: "ファンド、トークン、メンバーシップ、流れをご案内します。", placeholder: "質問を入力…", avertissement: "自動応答：一般的な情報であり投資助言ではありません。", suggestions: ["NXTトークンの仕組みは？", "最低申込額は？", "手数料は？", "申請方法は？"], ouvrir: "アシスタントを開く", fermer: "閉じる" },
};
export default ja;
