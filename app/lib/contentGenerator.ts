import type { SuggestedTopic } from "./topicSuggester";
import type { CategoryContent, RankedItem, TierGrade } from "./tierData";
import type { SearchResult } from "./webSearch";
import { topicToSubtitle } from "./topicSuggester";
import type { Region } from "./tierData";

function rankToTier(rank: number): TierGrade {
  if (rank <= 3) return "S";
  if (rank <= 7) return "A";
  if (rank <= 11) return "B";
  if (rank <= 14) return "C";
  return "D";
}

function shorten(text: string, max: number): string {
  const c = text.replace(/\s+/g, " ").trim();
  return c.length <= max ? c : c.slice(0, max - 1) + "…";
}

const ENTITY_PATTERNS = [
  /([가-힣]{2,12}(?:아파트|APT|단지|브랜드|역|동|구|시))/g,
  /([가-힣]{2,10}(?:챌린지|적금|ETF|DSR|LTV|청약))/gi,
];

const BRANDS = [
  "힐스테이트", "래미안", "자이", "푸르지오", "e편한세상",
  "아이파크", "롯데캐슬", "더샵", "디에이치",
];

function extractEntities(text: string): string[] {
  const found: string[] = [];
  for (const b of BRANDS) if (text.includes(b)) found.push(b);
  for (const p of ENTITY_PATTERNS) {
    for (const m of text.matchAll(p)) {
      const e = m[1]?.trim();
      if (e && e.length >= 2) found.push(e);
    }
  }
  return found;
}

function uniqueEntities(results: SearchResult[], count: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    for (const e of extractEntities(`${r.title} ${r.snippet}`)) {
      const k = e.replace(/\s/g, "");
      if (!seen.has(k)) {
        seen.add(k);
        out.push(e);
      }
    }
  }
  if (out.length < count) {
    for (const r of results) {
      const fb = shorten(r.title.split(/[-–|:]/)[0], 18);
      const k = fb.replace(/\s/g, "");
      if (!seen.has(k) && fb.length >= 3) {
        seen.add(k);
        out.push(fb);
      }
      if (out.length >= count) break;
    }
  }
  return out.slice(0, count);
}

function hookForEntity(entity: string, results: SearchResult[]): string {
  for (const r of results) {
    if (`${r.title} ${r.snippet}`.includes(entity) && r.snippet) {
      return shorten(r.snippet, 12);
    }
  }
  return "관심↑";
}

function buildRankingItems(
  results: SearchResult[],
  count: number,
): RankedItem[] {
  const entities = uniqueEntities(results, count);
  return entities.map((label, i) => ({
    rank: i + 1,
    label: shorten(label, 20),
    tier: rankToTier(i + 1),
    hook: hookForEntity(label, results),
  }));
}

function cleanHeadline(raw: string): string {
  return raw
    .split(" - ")[0]
    .split("|")[0]
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

const EDITORIAL_FRAMES = [
  (core: string) => ({ label: `${core}, 아직 모르는 쪽`, hook: "논점" }),
  (core: string) => ({ label: `${core}의 반대편`, hook: "찬반" }),
  (core: string) => ({ label: `왜 ${core}인가`, hook: "배경" }),
  (core: string) => ({ label: `${core} 다음 수`, hook: "전망" }),
  (core: string) => ({ label: `${core} vs 현실`, hook: "비교" }),
  (core: string) => ({ label: `${core} 숨은 조건`, hook: "체크" }),
];

function toEditorialItem(result: SearchResult, index: number): RankedItem {
  const core = shorten(cleanHeadline(result.title), 16);
  const frame = EDITORIAL_FRAMES[index % EDITORIAL_FRAMES.length];
  const { label, hook } = frame(core);

  return {
    rank: index + 1,
    label,
    tier: rankToTier(index + 1),
    hook: result.snippet ? shorten(result.snippet, 10) : hook,
  };
}

function buildEditorialItems(
  results: SearchResult[],
  count: number,
): RankedItem[] {
  return results.slice(0, count).map((r, i) => toEditorialItem(r, i));
}

function buildCaption(
  topic: SuggestedTopic,
  subtitle: string,
  items: RankedItem[],
  sources: SearchResult[],
): string {
  const header = `${topic.title}\n${subtitle}`;

  const lines =
    topic.mode === "editorial"
      ? items
          .map((it) => `${it.rank}. ${it.label}\n   ${it.hook}`)
          .join("\n")
      : items.map((it) => `${it.rank}. ${it.label} — ${it.hook}`).join("\n");

  const refs = sources.slice(0, 4).map((s) => `- ${s.source}`).join("\n");

  return `${header}

${lines}

참고: ${refs}

저장 후 공유해 주세요.`;
}

export function generateContentFromTopic(
  topic: SuggestedTopic,
  results: SearchResult[],
  displayCount: number,
  region?: Region,
): CategoryContent {
  const subtitle = topicToSubtitle(topic, displayCount, region);
  const rankedItems =
    topic.mode === "editorial"
      ? buildEditorialItems(results, displayCount)
      : buildRankingItems(results, displayCount);

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    headlines: results.slice(0, 5).map((r) => r.title),
    cardTag: topic.tag,
    cardTitle: topic.title,
    cardSubtitle: subtitle,
    rankedItems,
    caption: buildCaption(topic, subtitle, rankedItems, results),
    hashtags: topic.hashtags,
    clipSources: results.slice(0, 4).map((r) => ({
      name: r.source,
      query: shorten(r.title, 30),
    })),
    clipStrategy: `웹 검색 → ${topic.mode === "editorial" ? "논점 재구성" : "항목 추출"} TOP ${displayCount}`,
    defaultCount: displayCount,
    mode: topic.mode,
  };
}
