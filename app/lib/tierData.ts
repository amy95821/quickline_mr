export type Category =
  | "부동산"
  | "아파트 브랜드 티어"
  | "시공사 티어"
  | "상권 티어"
  | "학군 티어"
  | "서울 집값 티어"
  | "경제·재테크 TOP"
  | "댓글 핫픽";

export type Region = "서울" | "경기" | "인천";

export type TierGrade = "S" | "A" | "B" | "C" | "D";

export type ContentMode = "ranking" | "editorial";

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
  topicId: string;
  topicTitle: string;
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
  mode: ContentMode;
}

export const CATEGORIES: Category[] = [
  "부동산",
  "아파트 브랜드 티어",
  "시공사 티어",
  "상권 티어",
  "학군 티어",
  "서울 집값 티어",
  "경제·재테크 TOP",
  "댓글 핫픽",
];

export const REGIONS: Region[] = ["서울", "경기", "인천"];

export const TIER_COLORS: Record<TierGrade, string> = {
  S: "#C45C4A",
  A: "#D4845A",
  B: "#7BAE7F",
  C: "#7BA4C4",
  D: "#9B8EC4",
};

export const TIER_LABELS: Record<TierGrade, string> = {
  S: "S",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
};
