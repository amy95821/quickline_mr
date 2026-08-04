/** 기사 베스트댓글·무한도전식 리액션 — 카드에 크게 노출 */

export interface HumorOverlay {
  bestComment?: string;
  reactionLine?: string;
}

const POOL: Record<string, HumorOverlay[]> = {
  default: [
    {
      bestComment: "월세로 갈아탔는데 월급이 집에 들어가네 ㅋㅋㅋㅋ",
      reactionLine: "🎬 현실: 무한 월세",
    },
    {
      bestComment: "전세 구하러 갔더니 집주인이 먼저 들어간대요 ㅋㅋ",
      reactionLine: "🎬 이게 된다고???",
    },
    {
      bestComment: "DSR 계산기 돌리다 하루가 갔어요 ㅋㅋㅋ",
      reactionLine: "🎬 숨 참고 대출",
    },
    {
      bestComment: "부동산 카드뉴스 보다가 내 통장 울음",
      reactionLine: "🎬 무한 슬픈",
    },
  ],
  jeonse: [
    {
      bestComment: "전세 매물 0건… 네이버 F5만 47번 ㅋㅋㅋ",
      reactionLine: "🎬 사라진 전세",
    },
    {
      bestComment: "반전세? 반만 월세가 아니라 반만 살라는 거 같음 ㅋㅋ",
      reactionLine: "🎬 무한 월세 각",
    },
    {
      bestComment: "전세금 올리겠대요. 무한도전 탈출각",
      reactionLine: "🎬 집주인 등장",
    },
  ],
  dsr: [
    {
      bestComment: "갭투자? 갭이 아니라 터널이네요 ㅋㅋㅋ",
      reactionLine: "🎬 레버리지 지옥",
    },
    {
      bestComment: "은행: 가능합니다 / DSR: ㄴㄴ",
      reactionLine: "🎬 무한 거절",
    },
    {
      bestComment: "대출 승인 떴는데 DSR에 막혔어요 ㅋㅋ",
      reactionLine: "🎬 기쁨 3초",
    },
  ],
  brand: [
    {
      bestComment: "브랜드값 내다가 실거래 보고 멘붕 ㅋㅋ",
      reactionLine: "🎬 프리미엄 함정",
    },
    {
      bestComment: "로고만 보고 샀다가 하자에 무한도전 ㅋㅋㅋ",
      reactionLine: "🎬 AS 지옥",
    },
  ],
  top10: [
    {
      bestComment: "TOP10인데 내 동네 11위… ㅋㅋㅋㅋ",
      reactionLine: "🎬 11위도 어디야",
    },
    {
      bestComment: "성수동 10억? 10억이 아니라 10년이네 ㅋㅋ",
      reactionLine: "🎬 현실 직시",
    },
    {
      bestComment: "신혼부부 선호 층수 1위: 탈출 ㅋㅋㅋ",
      reactionLine: "🎬 층수 전쟁",
    },
  ],
  timely: [
    {
      bestComment: "실거주 세제? 집주인: 그럼 나 들어갈게요 ㅋㅋ",
      reactionLine: "🎬 전세 증발",
    },
    {
      bestComment: "월세 52%? 나 그 52%야 ㅋㅋㅋㅋ",
      reactionLine: "🎬 통계 속 나",
    },
    {
      bestComment: "안심신탁 4%? …조건 보고 포기",
      reactionLine: "🎬 조건 지옥",
    },
  ],
};

export function pickHumor(topicKey: string, seed: number): HumorOverlay {
  const list = POOL[topicKey] ?? POOL.default;
  return list[seed % list.length];
}
