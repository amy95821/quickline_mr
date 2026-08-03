export type Category =
  | "부동산"
  | "경제"
  | "시사"
  | "아파트 브랜드"
  | "미분양·공급";

/** A=짤·밈  B=swipe  C=달력  D=데이터대조  tier=순위(20~40%만) */
export type CardTemplateType =
  | "meme"
  | "swipe"
  | "calendar"
  | "data-compare"
  | "tier";

export interface RankedItem {
  rank: number;
  label: string;
  hook: string;
  tier?: "S" | "A" | "B" | "C";
}

export interface CalendarEvent {
  day: number;
  label: string;
  tag?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DataComparePayload {
  regionTag: string;
  headline: string;
  insight: string;
  priceSeries: ChartPoint[];
  supplySeries: ChartPoint[];
  priceLabel?: string;
  supplyLabel?: string;
}

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

export interface MemePayload {
  categoryTag: string;
  punchline: string;
  memeKey: "frog" | "cat" | "office";
}

export interface SwipePayload {
  question: string;
  accent: "cream" | "green" | "charcoal";
}

export interface CalendarPayload {
  month: number;
  year: number;
  title: string;
  events: CalendarEvent[];
}

export interface TierPayload {
  tag: string;
  title: string;
  subtitle: string;
  items: RankedItem[];
}

export interface UnsoldPayload {
  region: string;
  title: string;
  topRegions: { name: string; count: number; rate: string }[];
  insight: string;
}

export type CardPayload =
  | { template: "meme"; data: MemePayload }
  | { template: "swipe"; data: SwipePayload }
  | { template: "calendar"; data: CalendarPayload }
  | { template: "data-compare"; data: DataComparePayload }
  | { template: "tier"; data: TierPayload }
  | { template: "unsold"; data: UnsoldPayload };

export interface GeneratedContent {
  topicId: string;
  topicTitle: string;
  template: CardTemplateType | "unsold";
  payload: CardPayload;
  caption: string;
  hashtags: string[];
  headlines: string[];
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

export const BRAND_HANDLE = "@quickline_mr";

export const TEMPLATE_LABELS: Record<CardTemplateType, string> = {
  meme: "Type A · 공감",
  swipe: "Type B · Swipe",
  calendar: "Type C · 달력",
  "data-compare": "Type D · 데이터",
  tier: "Tier · 순위",
};
