import type { Category, Region } from "./tierData";
import type { SearchResult } from "./webSearch";
import { webSearch } from "./webSearch";

export type TopicMode = "ranking" | "editorial";

export interface SuggestedTopic {
  id: string;
  category: Category;
  title: string;
  subtitleTemplate: string;
  tag: string;
  reason: string;
  defaultCount: 10 | 12 | 15;
  searchQueries: string[];
  hashtags: string[];
  mode: TopicMode;
}

interface CategoryMeta {
  trendQueries: string[];
  titleFrames: string[];
  subtitleFrames: string[];
  tags: string[];
  hashtags: string[];
  defaultMode: TopicMode;
}

const CATEGORY_META: Record<Category, CategoryMeta> = {
  부동산: {
    trendQueries: [
      "부동산 인스타 카드뉴스 인기",
      "아파트 티어 트렌드",
      "30대 부동산 관심",
      "전세 전월세 이슈",
    ],
    titleFrames: [
      "{kw} {angle} 순위",
      "요즘 {angle} 사이 {kw}",
      "{angle}가 주목하는 {kw}",
      "실전 {kw} {angle} 정리",
      "{kw} {angle} 비교",
    ],
    subtitleFrames: [
      "웹 트렌드 TOP {n}",
      "오늘의 {angle} TOP {n}",
      "30대 Pick TOP {n}",
    ],
    tags: ["부동산", "PICK", "TREND", "LIST", "CHECK"],
    hashtags: ["#부동산", "#아파트", "#30대", "#quickline_mr"],
    defaultMode: "ranking",
  },
  "아파트 브랜드 티어": {
    trendQueries: [
      "아파트 브랜드 순위 인기",
      "K-브랜드지수 아파트",
      "브랜드 프리미엄 비교",
    ],
    titleFrames: [
      "{kw} 브랜드 {angle}",
      "브랜드 {angle} {kw}",
      "{angle} 브랜드 {kw} 순위",
    ],
    subtitleFrames: ["브랜드 TOP {n}", "평판 순위 TOP {n}"],
    tags: ["BRAND", "TIER", "RANK", "TOP"],
    hashtags: ["#아파트브랜드", "#브랜드티어", "#quickline_mr"],
    defaultMode: "ranking",
  },
  "시공사 티어": {
    trendQueries: [
      "시공사 순위 평판",
      "건설사 하자 이슈",
      "아파트 시공사 비교",
    ],
    titleFrames: [
      "시공사 {angle} {kw}",
      "{kw} 시공사 {angle}",
      "{angle} 시공사 {kw} 순위",
    ],
    subtitleFrames: ["시공력 TOP {n}", "평판 TOP {n}"],
    tags: ["BUILD", "TIER", "RANK"],
    hashtags: ["#시공사", "#시공사티어", "#quickline_mr"],
    defaultMode: "ranking",
  },
  "상권 티어": {
    trendQueries: [
      "상권 순위 핫플",
      "MZ 상권 트렌드",
      "서울 상권 분석",
    ],
    titleFrames: [
      "{kw} 상권 {angle}",
      "{angle} 상권 {kw}",
      "핫 상권 {kw} {angle}",
    ],
    subtitleFrames: ["상권 TOP {n}", "유동·성장 TOP {n}"],
    tags: ["상권", "HOT", "ZONE"],
    hashtags: ["#상권", "#상권티어", "#quickline_mr"],
    defaultMode: "ranking",
  },
  "학군 티어": {
    trendQueries: [
      "학군 순위 2026",
      "특목고 학군 인기",
      "학군 아파트 프리미엄",
    ],
    titleFrames: [
      "{region} {kw} {angle}",
      "{region} 학군 {kw} {angle}",
      "{angle} {kw} {region} 순위",
    ],
    subtitleFrames: ["{region} TOP {n}", "학군 TOP {n}"],
    tags: ["학군", "EDU", "PICK"],
    hashtags: ["#학군", "#학군티어", "#quickline_mr"],
    defaultMode: "ranking",
  },
  "서울 집값 티어": {
    trendQueries: [
      "서울 집값 티어 인스타",
      "서울 아파트 실거래 순위",
      "서울 구별 시세",
    ],
    titleFrames: [
      "서울 {kw} {angle}",
      "{kw} 서울 {angle} 순위",
      "서울 집값 {angle} {kw}",
    ],
    subtitleFrames: ["서울 TOP {n}", "구별 TOP {n}"],
    tags: ["서울", "PRICE", "TIER"],
    hashtags: ["#서울집값", "#실거래", "#quickline_mr"],
    defaultMode: "ranking",
  },
  "경제·재테크 TOP": {
    trendQueries: [
      "30대 재테크 트렌드",
      "MZ 재테크 인스타",
      "직장인 재테크 키워드",
    ],
    titleFrames: [
      "{kw} {angle} 정리",
      "30대 {kw} {angle}",
      "{angle} {kw} 순위",
    ],
    subtitleFrames: ["재테크 TOP {n}", "키워드 TOP {n}"],
    tags: ["MONEY", "TIP", "LIST"],
    hashtags: ["#재테크", "#30대", "#quickline_mr"],
    defaultMode: "ranking",
  },
  "댓글 핫픽": {
    trendQueries: [
      "부동산 논란 반응",
      "경제 커뮤니티 화제",
      "재테크 논쟁 이슈",
      "정책 반응 논란",
    ],
    titleFrames: [
      "사람들이 말하는 {kw}",
      "{kw} 숨은 논점",
      "왜 {kw}에 분분할까",
      "{kw} 찬반 정리",
      "오늘의 {kw} 쟁점",
    ],
    subtitleFrames: ["쟁점 TOP {n}", "핵심 논점 {n}"],
    tags: ["ISSUE", "TALK", "POINT"],
    hashtags: ["#핫이슈", "#quickline_mr"],
    defaultMode: "editorial",
  },
};

const ANGLES = [
  "30대",
  "초보",
  "신혼",
  "실전",
  "가성비",
  "장기",
  "단기",
  "핵심",
  "숨은",
  "요즘",
];

const REGION_LABEL: Record<Region, string> = {
  서울: "서울",
  경기: "경기",
  인천: "인천",
};

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length];
}

function extractKeywords(results: SearchResult[], count: number): string[] {
  const kws: string[] = [];
  const seen = new Set<string>();

  for (const r of results) {
    const text = `${r.title} ${r.snippet}`;
    const chunks = text
      .split(/[\s,·\-|/[\]()]+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && s.length <= 10);

    for (const c of chunks) {
      if (/^[가-힣]{2,10}$/.test(c) && !seen.has(c)) {
        seen.add(c);
        kws.push(c);
      }
      if (kws.length >= count + 10) break;
    }
  }

  if (kws.length < count) {
    kws.push("트렌드", "순위", "비교", "정리", "핵심", "이슈", "체크", "분석");
  }

  return kws.slice(0, count + 5);
}

function buildTitle(
  frame: string,
  kw: string,
  angle: string,
  region?: Region,
): string {
  return frame
    .replace("{kw}", kw)
    .replace("{angle}", angle)
    .replace("{region}", region ? REGION_LABEL[region] : "서울");
}

export async function suggestDailyTopics(
  category: Category,
  date: string,
  region?: Region,
  count = 5,
): Promise<SuggestedTopic[]> {
  const meta = CATEGORY_META[category];
  const seed = hashSeed(`${date}-${category}-${region ?? ""}`);

  const trendResults = await webSearch(meta.trendQueries, 15);
  const keywords = extractKeywords(trendResults, count + 3);

  const topics: SuggestedTopic[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    const kw = keywords[i % keywords.length];
    const angle = pick(ANGLES, seed, i * 3);
    const titleFrame = pick(meta.titleFrames, seed, i);
    const subtitleFrame = pick(meta.subtitleFrames, seed, i + 7);
    const tag = pick(meta.tags, seed, i + 2);

    let title = buildTitle(titleFrame, kw, angle, region);
    if (usedTitles.has(title)) {
      title = buildTitle(pick(meta.titleFrames, seed, i + 11), kw, pick(ANGLES, seed, i + 5), region);
    }
    usedTitles.add(title);

    const defaultCount = pick([10, 12, 15] as const, seed, i);
    const searchQueries = [
      `${title} 2026`,
      `${kw} ${category.replace(/ 티어| TOP/g, "")} 트렌드`,
      ...meta.trendQueries.slice(0, 1),
    ];

    const snippet = trendResults[i]?.snippet ?? trendResults[0]?.snippet ?? "";
    const reason = snippet
      ? snippet.slice(0, 60) + (snippet.length > 60 ? "…" : "")
      : "오늘 웹 트렌드 기반 제안";

    topics.push({
      id: `${date}-${category}-${i}-${hashSeed(title) % 10000}`,
      category,
      title,
      subtitleTemplate: subtitleFrame,
      tag,
      reason,
      defaultCount,
      searchQueries,
      hashtags: meta.hashtags,
      mode: meta.defaultMode,
    });
  }

  return topics;
}

export function topicToSubtitle(topic: SuggestedTopic, n: number, region?: Region): string {
  return topic.subtitleTemplate
    .replace("{n}", String(n))
    .replace("{region}", region ? REGION_LABEL[region] : "서울");
}
