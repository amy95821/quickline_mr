/** 기사 베스트댓글·리액션 톤 — 카드 곁들임 요소 (본문과 분리) */

export interface HumorOverlay {
  bestComment?: string;
  reactionLine?: string;
}

const POOL: Record<string, HumorOverlay[]> = {
  default: [
    { bestComment: "월세로 갈아탔는데 월급이 집에 들어가네 ㅋㅋ", reactionLine: "현실: 무한 월세" },
    { bestComment: "전세 구하러 갔더니 집주인이 먼저 들어간대요", reactionLine: "이게 된다고?" },
    { bestComment: "DSR 계산기 돌리다 하루가 갔습니다", reactionLine: "숨 참고 대출" },
  ],
  jeonse: [
    { bestComment: "전세 매물 0건… 네이버 새로고침만 47번", reactionLine: "사라진 전세" },
    { bestComment: "반전세 제안 받았는데 반만 월세가 아니라 반만 살라는 거 같음", reactionLine: "무한 월세 각" },
  ],
  dsr: [
    { bestComment: "갭투자? 갭이 아니라 터널이네요", reactionLine: "레버리지 지옥" },
    { bestComment: "은행: 가능합니다 / DSR: 아니요", reactionLine: "무한 거절" },
  ],
  brand: [
    { bestComment: "브랜드값 내다가 실거래 보고 멘붕", reactionLine: "프리미엄의 함정" },
    { bestComment: "건설사 로고만 보고 샀다가 하자에 무한도전", reactionLine: "AS 지옥각" },
  ],
  top10: [
    { bestComment: "TOP10 보고 내 동네 11위인 거 알고 좌절", reactionLine: "11위도 어디야" },
    { bestComment: "성수동 10억? 10억이 아니라 10년이네", reactionLine: "현실 직시" },
  ],
  timely: [
    { bestComment: "실거주 세제? 집주인: 그럼 나 들어갈게요", reactionLine: "전세 증발" },
    { bestComment: "안심신탁 4%? 전세금 넣으면 되는 거죠? …아니래요", reactionLine: "조건 지옥" },
  ],
};

export function pickHumor(topicKey: string, seed: number): HumorOverlay {
  const list = POOL[topicKey] ?? POOL.default;
  return list[seed % list.length];
}
