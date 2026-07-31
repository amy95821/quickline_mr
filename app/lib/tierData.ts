export type Category =
  | "부동산"
  | "아파트 브랜드"
  | "서울 집값"
  | "경제·재테크"
  | "댓글 핫픽";

export type Region = "서울" | "경기" | "인천";

export type TierGrade = "S" | "A" | "B" | "C" | "D";

export interface RankedItem {
  rank: number;
  label: string;
  tier: TierGrade;
  hook: string;
  icon?: string;
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
  mode: "ranking" | "comment-pick";
}

export const CATEGORIES: Category[] = [
  "부동산",
  "아파트 브랜드",
  "서울 집값",
  "경제·재테크",
  "댓글 핫픽",
];

export const REGIONS: Region[] = ["서울", "경기", "인천"];

export const TIER_COLORS: Record<TierGrade, string> = {
  S: "#FF6B6B",
  A: "#FFB347",
  B: "#77DD77",
  C: "#A8D8EA",
  D: "#C9B1FF",
};

export const TIER_EMOJI: Record<TierGrade, string> = {
  S: "👑",
  A: "🥇",
  B: "🥈",
  C: "🥉",
  D: "💫",
};

export const RANK_STICKERS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
