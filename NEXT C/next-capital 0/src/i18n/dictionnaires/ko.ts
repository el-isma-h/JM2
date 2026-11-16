import type { DeepPartial } from "..";
import type { Dict } from "./fr";

const ko: DeepPartial<Dict> = {
  meta: { titre: "NEXT Capital: 토큰화 투자 펀드", description: "NEXT Capital은 AI·양자·식품·스포츠 분야의 유망 스타트업에 투자하는 토큰화 참여형 펀드입니다. 데모 플랫폼." },
  commun: { demo: "데모 플랫폼: NEXT Capital은 아직 인가를 받지 않았습니다. 실제 청약은 불가능합니다.", demoCourt: "데모", exemple: "가상의 예시", risque: "비상장 기업 투자는 원금 손실 및 유동성 위험을 수반합니다. 당장 필요하지 않은 자금만 투자하십시오.", enSavoirPlus: "자세히 보기", decouvrir: "둘러보기", candidater: "신청하기", connexion: "로그인", deconnexion: "로그아웃", monEspace: "내 계정", admin: "관리", retour: "뒤로", suivant: "다음", precedent: "이전", envoyer: "보내기", valider: "확정", confirmer: "확인", annuler: "취소", enregistrer: "저장", chargement: "불러오는 중…", oui: "예", non: "아니요", langue: "언어", total: "합계", date: "날짜", montant: "금액", statut: "상태", reference: "참조번호", actions: "작업", aucun: "아직 항목이 없습니다." },
  nav: { fonds: "펀드", theses: "투자 테마", marches: "시장", token: "토큰", deals: "딜", adhesion: "멤버십", parcours: "절차", apropos: "소개", faq: "FAQ", risques: "위험" },
  pied: { accroche: "차세대 투자 펀드: 하나의 토큰, 최고의 딜.", investir: "투자", ressources: "자료", legal: "법적 고지", mentions: "법적 고지", confidentialite: "개인정보", cookies: "쿠키", siege: "본사: 룩셈부르크 (설립 진행 중)" },
  accueil: {
    sur: "토큰화 투자 펀드", titre1: "하나의 토큰.", titre2: "시장 최고의 딜.",
    accroche: "NEXT Capital은 적격 투자자를 단일 토큰 NXT로 모아, 그 자본을 유럽과 미국의 가장 유망한 스타트업에 투입합니다: 인공지능, 양자, 식품, 스포츠.",
    cta: "펀드 참여하기", cta2: "토큰 이해하기", des: "최소", parInvestissement: "청약당",
    chiffres: [{ v: "4", l: "투자 테마" }, { v: "1,500 €", l: "최소 청약 금액" }, { v: "20 %", l: "수익에 대해서만 성과보수" }, { v: "8", l: "개 언어, 하나의 플랫폼" }],
    piliersSur: "왜 NEXT Capital인가", piliersTitre: "대형 펀드의 모델, 클럽의 접근성",
    piliers: [
      { t: "하나의 토큰, 하나의 포트폴리오", d: "NXT를 청약하면 펀드가 엄선한 스타트업에 자본을 투입합니다. 하나의 대시보드에서 전체를 확인합니다." },
      { t: "최고의 딜에 대한 접근", d: "Y Combinator 배치, 시드부터 시리즈 A/B까지의 유럽 스타트업, 내부 딜, 룩셈부르크·마이애미 네트워크." },
      { t: "엄격한 선별", d: "검토한 안건 중 1 % 미만만 채택됩니다. 모든 안건은 재무·법률·산업 실사를 거칩니다." },
      { t: "완전한 추적성", d: "모든 입금, 청약, 1유로 단위의 흐름이 언제든 열람 가능한 원장에 기록됩니다. NXT 토큰은 ERC-20으로 발행될 예정입니다." },
    ],
    canauxSur: "딜 채널", canauxTitre: "최고의 거래가 이루어지는 곳", thesesSur: "4가지 테마", thesesTitre: "자본을 집중하는 영역", parcoursSur: "절차", parcoursTitre: "신청에서 포트폴리오까지",
    ctaFinalTitre: "새로운 물결에 합류할 준비가 되셨나요?", ctaFinalTexte: "신청은 10분이면 됩니다. 계정 개설 전 저희 팀이 서류를 검토합니다.",
  },
  theses: { titre: "4가지 투자 테마", allocation: "목표 배분", stades: "단계", horizon: "기간", perf: "목표 수익", ans: "년",
    ia: { nom: "인공지능", accroche: "인프라, 에이전트, 산업별 애플리케이션" }, quantique: { nom: "양자", accroche: "다음 10년의 컴퓨팅" }, agroalimentaire: { nom: "식품·농업", accroche: "더 잘 먹고, 다르게 생산하기" }, sport: { nom: "스포츠", accroche: "퍼포먼스, 데이터, 경험" } },
  fonds: { titre: "펀드" }, token: { titre: "NXT 토큰", comment: "작동 방식" }, deals: { titre: "딜", ouvert: "진행 중", a_venir: "예정", cloture: "마감", objectif: "목표", alloue: "배정", voir: "안건 보기" },
  adhesion: { titre: "멤버십과 등급", niveauxTitre: "멤버십 레벨", parAn: "/ 년", plafondAn: "연간 최대 투자", plafondOp: "청약당 최대", frais: "구조화 수수료", bons: "우선권", illimite: "무제한", chargeAffaire: "전담 매니저", vip: "VIP 이벤트", diners: "프라이빗 디너", statutsTitre: "투자 자본에 따른 등급",
    statuts: { membre: { nom: "멤버" }, partenaire: { nom: "파트너" }, associe: { nom: "어소시에이트" }, club50: { nom: "클럽 50" }, cercle100: { nom: "서클 100" } }, aPartirDe: "최소", choisir: "이 레벨 선택" },
  parcours: { titre: "투자 절차" }, apropos: { titre: "소개" }, faq: { titre: "자주 묻는 질문" }, risques: { titre: "위험 고지" },
  connexion: { titre: "로그인", email: "이메일 주소", motDePasse: "비밀번호", bouton: "로그인", erreur: "로그인 정보가 올바르지 않습니다.", pasDeCompte: "아직 계정이 없으신가요?", candidater: "신청서 제출", demoTitre: "데모 계정" },
  candidature: { titre: "신청", intro: "계정 개설 전 저희 팀이 서류를 검토합니다. 약 10분이 소요됩니다.", etapes: ["신원", "상황", "투자자 프로필", "멤버십", "서류", "확인"],
    identite: { prenom: "이름", nom: "성", email: "이메일 주소", telephone: "전화번호", pays: "거주 국가", naissance: "생년월일", nationalite: "국적", adresse: "주소", motDePasse: "비밀번호 (8자 이상)" },
    situation: { situation: "직업 상황", secteur: "활동 분야", revenus: "연간 소득", patrimoine: "금융 자산", origineFonds: "자금 출처" },
    profil: { zones: "선호 투자 지역", theses: "관심 테마", risque: "위험 감수 성향", rendement: "목표 수익", horizon: "투자 기간", experience: "비상장 투자 경험" },
    adhesionTitre: "멤버십 레벨을 선택하세요", merciTitre: "신청이 접수되었습니다" },
  compte: { bienvenue: "환영합니다", tableau: "대시보드", wallet: "지갑", souscrire: "청약", historique: "내역", portefeuille: "포트폴리오", documents: "서류", statut: "등급", profil: "프로필", solde: "사용 가능 잔액", tokens: "보유 NXT", capitalInvesti: "투자 자본", deposer: "입금하기", sepa: "SEPA 이체", carte: "카드 / Apple Pay", crypto: "암호화폐", souscrireTitre: "NXT 청약", confirmerSous: "청약 확정", payerAdhesion: "멤버십 결제" },
  chatbot: { titre: "NEXT 어시스턴트", accroche: "펀드, 토큰, 멤버십, 절차를 안내합니다.", placeholder: "질문을 입력하세요…", avertissement: "자동 응답: 일반 정보이며 투자 조언이 아닙니다.", suggestions: ["NXT 토큰은 어떻게 작동하나요?", "최소 청약 금액은?", "수수료는?", "신청 방법은?"], ouvrir: "어시스턴트 열기", fermer: "닫기" },
};
export default ko;
