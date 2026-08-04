export type Category =
  | "부동산"
  | "경제"
  | "시사"
  | "아파트 브랜드"
  | "미분양·공급";

export type ContentFormat = "single" | "carousel";

export type SlideLayout =
  | "hook"
  | "photo-hook"
  | "story"
  | "insight"
  | "calendar"
  | "chart"
  | "ranking"
  | "policy"
  | "unsold"
  | "top10";

export interface CalendarEvent {
  day: number;
  endDay?: number;
  label: string;
  type?: "tax" | "policy" | "supply" | "rate" | "general";
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface RankingRow {
  rank: number;
  label: string;
  sub?: string;
  value: string;
  highlight?: boolean;
}

export interface PolicyPerson {
  name: string;
  role: string;
  stat: string;
  statLabel: string;
}

export interface WinnerLoser {
  side: "winner" | "loser" | "neutral";
  label: string;
  reason: string;
}

export interface CardSlide {
  layout: SlideLayout;
  headline: string;
  subheadline?: string;
  body?: string[];
  highlight?: string;
  source?: string;
  slideIndex?: number;
  totalSlides?: number;
  accent?: "dark" | "light" | "green";
  events?: CalendarEvent[];
  month?: number;
  year?: number;
  priceSeries?: ChartPoint[];
  supplySeries?: ChartPoint[];
  priceLabel?: string;
  supplyLabel?: string;
  conclusion?: string;
  winnersLosers?: WinnerLoser[];
  rows?: RankingRow[];
  people?: PolicyPerson[];
  region?: string;
  topRegions?: { name: string; count: number; rate: string }[];
  /** 실사 배경 URL */
  coverImage?: string;
  /** 건설사·기관 로고 URL 배열 */
  logoImages?: string[];
  /** 기사 베스트댓글 스타일 */
  bestComment?: string;
  /** 무한도전식 리액션 한줄 */
  reactionLine?: string;
  top10Items?: { rank: number; label: string; note: string }[];
}

export interface GeneratedContent {
  topicId: string;
  summary: string;
  format: ContentFormat;
  slides: CardSlide[];
  caption: string;
  hashtags: string[];
}

export const CATEGORIES: Category[] = [
  "부동산",
  "경제",
  "시사",
  "아파트 브랜드",
  "미분양·공급",
];

export const UNSOLD_REGIONS = [
  "서울",
  "경기",
  "수원",
  "인천",
  "부산",
  "대구",
] as const;

export const COMPARE_TOPIC_IDS = [
  "gangnam-vs-mapo",
  "seoul-supply-cliff",
  "mapo-yongsan-seongdong",
  "jeonse-vs-maemae",
  "redevelop-vs-new",
  "gyeonggi-vs-seoul-outer",
  "changwon-supply",
] as const;

export type CompareTopicId = (typeof COMPARE_TOPIC_IDS)[number];

export const BRAND_HANDLE = "@quickline_mr";

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  single: "한 장 요약",
  carousel: "스토리 · 캐러셀",
};

export const LAYOUT_LABELS: Record<SlideLayout, string> = {
  hook: "후킹",
  "photo-hook": "실사 커버",
  story: "전개",
  insight: "인사이트",
  calendar: "달력",
  chart: "데이터",
  ranking: "순위",
  policy: "정책",
  unsold: "미분양",
  top10: "TOP10",
};
