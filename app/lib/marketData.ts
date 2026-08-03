import type { ChartPoint, CompareTopicId } from "./cardTypes";

export interface CompareTopic {
  id: CompareTopicId;
  /** 주제 제안 목록에 노출되는 굵직한 타이틀 */
  title: string;
  /** 카드 상단 태그 */
  regionTag: string;
  /** 카드 내 헤드라인 */
  headline: string;
  priceSeries: ChartPoint[];
  supplySeries: ChartPoint[];
  priceLabel: string;
  supplyLabel: string;
  insight: string;
}

export const COMPARE_TOPICS: CompareTopic[] = [
  {
    id: "gangnam-vs-mapo",
    title: "강남 vs 마포, 같은 전세인데 왜 체감이 다를까?",
    regionTag: "서울 · 동네 비교",
    headline: "강남·마포 KB 매매지수 vs 입주물량",
    priceLabel: "강남 매매지수",
    supplyLabel: "마포 입주물량(지수)",
    priceSeries: [
      { label: "22.03", value: 100 },
      { label: "22.09", value: 98 },
      { label: "23.03", value: 104 },
      { label: "23.09", value: 112 },
      { label: "24.03", value: 118 },
    ],
    supplySeries: [
      { label: "22.03", value: 100 },
      { label: "22.09", value: 82 },
      { label: "23.03", value: 68 },
      { label: "23.09", value: 55 },
      { label: "24.03", value: 48 },
    ],
    insight: "마포 입주 절벽 구간과 강남 가격 반등 타이밍이 겹칩니다.",
  },
  {
    id: "seoul-supply-cliff",
    title: "공급이 줄면 집값은? 서울 입주절벽 구간 한 장 정리",
    regionTag: "서울 · 공급",
    headline: "서울 매매지수 vs 입주물량 대조",
    priceLabel: "매매지수",
    supplyLabel: "입주물량(지수)",
    priceSeries: [
      { label: "20.03", value: 100 },
      { label: "20.09", value: 104 },
      { label: "21.03", value: 110 },
      { label: "21.09", value: 118 },
      { label: "22.03", value: 122 },
    ],
    supplySeries: [
      { label: "20.03", value: 100 },
      { label: "20.09", value: 92 },
      { label: "21.03", value: 76 },
      { label: "21.09", value: 61 },
      { label: "22.03", value: 48 },
    ],
    insight: "서울은 입주 절벽 구간과 가격 랠리 타이밍이 뚜렷하게 겹칩니다.",
  },
  {
    id: "mapo-yongsan-seongdong",
    title: "마포·용산·성동, 서울 핵심 3구 중 지금 주목할 곳",
    regionTag: "서울 · 3구",
    headline: "핵심 3구 매매지수 추이",
    priceLabel: "용산·성동 지수",
    supplyLabel: "마포 신규 입주(지수)",
    priceSeries: [
      { label: "23.01", value: 100 },
      { label: "23.06", value: 106 },
      { label: "23.12", value: 114 },
      { label: "24.06", value: 121 },
      { label: "25.01", value: 126 },
    ],
    supplySeries: [
      { label: "23.01", value: 100 },
      { label: "23.06", value: 88 },
      { label: "23.12", value: 72 },
      { label: "24.06", value: 58 },
      { label: "25.01", value: 44 },
    ],
    insight: "재건축·신규 단지 공급 타이밍마다 구별 상승 폭이 갈립니다.",
  },
  {
    id: "jeonse-vs-maemae",
    title: "전세 vs 매매, 지금 2040에게 어느 쪽이 유리할까?",
    regionTag: "수도권 · 전월세",
    headline: "전세가율·매매지수 동행 추이",
    priceLabel: "매매지수",
    supplyLabel: "전세가율(지수)",
    priceSeries: [
      { label: "22.06", value: 100 },
      { label: "22.12", value: 95 },
      { label: "23.06", value: 92 },
      { label: "23.12", value: 98 },
      { label: "24.06", value: 105 },
    ],
    supplySeries: [
      { label: "22.06", value: 100 },
      { label: "22.12", value: 108 },
      { label: "23.06", value: 115 },
      { label: "23.12", value: 102 },
      { label: "24.06", value: 96 },
    ],
    insight: "전세가율 급등기엔 매매 전환, 하락기엔 전세 선호가 두드러집니다.",
  },
  {
    id: "redevelop-vs-new",
    title: "재개발 vs 신축, 같은 돈 넣었을 때 5년 후 차이",
    regionTag: "서울 · 재개발",
    headline: "재개발·신축 구간 가격 대조",
    priceLabel: "재개발 추진지",
    supplyLabel: "신축 입주(지수)",
    priceSeries: [
      { label: "21.01", value: 100 },
      { label: "21.12", value: 108 },
      { label: "22.12", value: 118 },
      { label: "23.12", value: 128 },
      { label: "24.12", value: 135 },
    ],
    supplySeries: [
      { label: "21.01", value: 100 },
      { label: "21.12", value: 90 },
      { label: "22.12", value: 75 },
      { label: "23.12", value: 62 },
      { label: "24.12", value: 50 },
    ],
    insight: "재개발 기대감은 입주 공백과 맞물릴 때 프리미엄이 커집니다.",
  },
  {
    id: "gyeonggi-vs-seoul-outer",
    title: "경기 신도시 vs 서울 외곽, 같은 예산 다른 결과",
    regionTag: "수도권 · 비교",
    headline: "신도시·서울 외곽 매매지수",
    priceLabel: "서울 외곽",
    supplyLabel: "경기 신도시 입주",
    priceSeries: [
      { label: "22.01", value: 100 },
      { label: "22.07", value: 96 },
      { label: "23.01", value: 92 },
      { label: "23.07", value: 95 },
      { label: "24.01", value: 102 },
    ],
    supplySeries: [
      { label: "22.01", value: 100 },
      { label: "22.07", value: 115 },
      { label: "23.01", value: 128 },
      { label: "23.07", value: 118 },
      { label: "24.01", value: 105 },
    ],
    insight: "신도시 대량 입주기엔 외곽 대비 상대적 조정이 나타납니다.",
  },
  {
    id: "changwon-supply",
    title: "지방도 똑같다 — 공급 바닥 칠 때 집값이 튀는 이유",
    regionTag: "창원 · 사례",
    headline: "창원 매매지수 vs 입주물량",
    priceLabel: "매매지수",
    supplyLabel: "입주물량(지수)",
    priceSeries: [
      { label: "20.06", value: 100 },
      { label: "20.12", value: 105 },
      { label: "21.03", value: 108 },
      { label: "21.07", value: 118 },
    ],
    supplySeries: [
      { label: "20.06", value: 100 },
      { label: "20.12", value: 72 },
      { label: "21.03", value: 58 },
      { label: "21.07", value: 42 },
    ],
    insight: "입주물량 바닥(21.07) 직후 매매지수 급등 구간이 겹칩니다.",
  },
];

const TOPIC_MAP = Object.fromEntries(
  COMPARE_TOPICS.map((t) => [t.id, t]),
) as Record<CompareTopicId, CompareTopic>;

export function getCompareTopic(id: CompareTopicId): CompareTopic {
  return TOPIC_MAP[id];
}

export function getComparePayload(id: CompareTopicId) {
  const t = getCompareTopic(id);
  return {
    regionTag: t.regionTag,
    headline: t.headline,
    insight: t.insight,
    priceSeries: t.priceSeries,
    supplySeries: t.supplySeries,
    priceLabel: t.priceLabel,
    supplyLabel: t.supplyLabel,
  };
}

/** 주차 기준 1~2일만 데이터 대조 주제 노출 */
export function isDataCompareDay(date: string): boolean {
  const d = new Date(date + "T12:00:00");
  const jsDay = d.getDay();
  const weekday = jsDay === 0 ? 7 : jsDay;

  const jan1 = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
  );
  let seed = weekNum * 7 + d.getFullYear();
  seed = Math.abs(((seed << 5) - seed) | 0);

  const slot1 = (seed % 5) + 1;
  const slot2 = ((seed >> 3) % 5) + 1;
  return weekday === slot1 || weekday === slot2;
}

export function pickCompareTopicForDate(date: string): CompareTopic {
  const seed = date.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
  return COMPARE_TOPICS[Math.abs(seed) % COMPARE_TOPICS.length];
}
