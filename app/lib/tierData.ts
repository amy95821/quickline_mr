export type Category =
  | "부동산"
  | "아파트 브랜드 티어"
  | "시공사 티어"
  | "상권 티어"
  | "학군 티어"
  | "서울 집값 티어"
  | "경제·재테크 TOP";

export type Region = "서울" | "경기" | "인천";

export type TierGrade = "S" | "A" | "B" | "C" | "D";

export interface RankedItem {
  rank: number;
  label: string;
  tier: TierGrade;
  hook: string;
}

export interface ClipSource {
  name: string;
  query: string;
}

export interface CategoryContent {
  headlines: string[];
  cardTag: string;
  cardTitle: string;
  cardSubtitle: string;
  rankedItems: RankedItem[];
  caption: string;
  hashtags: string[];
  clipSources: ClipSource[];
  clipStrategy: string;
  defaultCount: number;
}

export const CATEGORIES: Category[] = [
  "부동산",
  "아파트 브랜드 티어",
  "시공사 티어",
  "상권 티어",
  "학군 티어",
  "서울 집값 티어",
  "경제·재테크 TOP",
];

export const REGIONS: Region[] = ["서울", "경기", "인천"];

export const TIER_COLORS: Record<TierGrade, string> = {
  S: "#f97316",
  A: "#22d3ee",
  B: "#a3e635",
  C: "#94a3b8",
  D: "#64748b",
};

export const TIER_EMOJI: Record<TierGrade, string> = {
  S: "👑",
  A: "🥇",
  B: "🥈",
  C: "🥉",
  D: "📘",
};
