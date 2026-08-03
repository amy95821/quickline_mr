import type { CardTemplateType, Category, CompareTopicId } from "./cardTypes";
import type { SearchResult } from "./webSearch";
import { webSearch } from "./webSearch";
import { isDataCompareDay, pickCompareTopicForDate } from "./marketData";

export interface SuggestedTopic {
  id: string;
  category: Category;
  template: CardTemplateType;
  title: string;
  reason: string;
  searchQueries: string[];
  hashtags: string[];
  /** tier 전용 */
  defaultCount?: 8 | 10;
  /** data-compare 전용 (부동산, 주 1~2회) */
  compareTopicId?: CompareTopicId;
  memeKey?: "frog" | "cat" | "office";
  swipeAccent?: "cream" | "green" | "charcoal";
}

const CATEGORY_QUERIES: Record<Category, string[]> = {
  부동산: ["부동산 인스타 카드뉴스", "전세 전월세 2040", "아파트 트렌드"],
  경제: ["2040 재테크 트렌드", "금리 환율 MZ", "직장인 재테크"],
  시사: ["시사 이슈 2040", "정책 청년 주거", "경제 시사"],
  "아파트 브랜드": ["아파트 브랜드 순위", "브랜드 프리미엄"],
  "미분양·공급": ["미분양 현황", "입주물량 아파트", "공급 부족 집값"],
};

const MEME_PUNCH = [
  "월급은 그대로인데 전세만 올랐을 때",
  "부동산 공부 시작했다가 머리 터진 사람",
  "청약 넣었는데 당첨 문자 온 줄 알았더니",
  "전세 계약서 읽다가 잠든 적 있는 사람",
];

const SWIPE_Q = [
  "2040 직장인이 전세를 절대로 살면 안 되는 이유",
  "갭투자, 지금 들어가도 늦지 않았을까?",
  "내 연봉으로 빌 수 있는 집의 상한선",
  "무주택 기간, 하루 차이로 청약가점이 바뀐다면",
];

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function assignTemplates(
  seed: number,
  category: Category,
  date: string,
): CardTemplateType[] {
  const tierCount = seed % 5 === 0 ? 2 : 1;
  const includeCompare =
    category === "부동산" && isDataCompareDay(date);

  const pool: CardTemplateType[] = includeCompare
    ? ["meme", "swipe", "calendar", "data-compare"]
    : ["meme", "swipe", "calendar"];

  const offset = seed % pool.length;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];

  if (tierCount === 2) {
    return [rotated[0], "tier", rotated[1], "tier", rotated[2]];
  }
  return [rotated[0], rotated[1], "tier", rotated[2], rotated[3] ?? rotated[0]];
}

function extractKeyword(results: SearchResult[], i: number): string {
  const r = results[i];
  if (!r) return "부동산";
  const t = r.title.split(/[-–|]/)[0].trim();
  return t.slice(0, 12) || "트렌드";
}

export async function suggestDailyTopics(
  category: Category,
  date: string,
): Promise<SuggestedTopic[]> {
  const seed = hashSeed(`${date}-${category}`);
  const templates = assignTemplates(seed, category, date);
  const results = await webSearch(CATEGORY_QUERIES[category], 12);
  const hashtags = ["#quickline_mr", "#2040", "#부동산"];

  const accents = ["cream", "green", "charcoal"] as const;
  const memes = ["frog", "cat", "office"] as const;
  const compareTopic = pickCompareTopicForDate(date);

  return templates.map((template, i) => {
    const kw = extractKeyword(results, i);
    const id = `${date}-${category}-${template}-${i}`;

    switch (template) {
      case "meme":
        return {
          id,
          category,
          template,
          title: MEME_PUNCH[(seed + i) % MEME_PUNCH.length],
          reason: results[i]?.snippet?.slice(0, 50) ?? "공감형 Type A",
          searchQueries: CATEGORY_QUERIES[category],
          hashtags,
          memeKey: memes[(seed + i) % 3],
        };
      case "swipe":
        return {
          id,
          category,
          template,
          title: SWIPE_Q[(seed + i) % SWIPE_Q.length],
          reason: "첫 장에서 멈추게 하는 질문형",
          searchQueries: [SWIPE_Q[(seed + i) % SWIPE_Q.length]],
          hashtags,
          swipeAccent: accents[(seed + i) % 3],
        };
      case "calendar": {
        const d = new Date(date);
        return {
          id,
          category,
          template,
          title: `${d.getMonth() + 1}월 ${category} 일정`,
          reason: "저장·공유형 실용 콘텐츠",
          searchQueries: [`${d.getMonth() + 1}월 부동산 일정`, "청약 세금 마감"],
          hashtags,
        };
      }
      case "data-compare":
        return {
          id,
          category,
          template,
          title: compareTopic.title,
          reason: "KB지수·입주물량 대조 (주 1~2회)",
          searchQueries: [compareTopic.regionTag, "매매지수", "입주물량"],
          hashtags,
          compareTopicId: compareTopic.id,
        };
      case "tier":
      default:
        return {
          id,
          category,
          template: "tier",
          title: `${kw} 순위`,
          reason: results[i]?.snippet?.slice(0, 50) ?? "순위형 (주 1~2회)",
          searchQueries: CATEGORY_QUERIES[category],
          hashtags,
          defaultCount: 8,
        };
    }
  });
}
