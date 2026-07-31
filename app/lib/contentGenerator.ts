import type { ContentTopic } from "./contentTopics";
import type { CategoryContent, RankedItem, TierGrade } from "./tierData";
import type { SearchResult } from "./webSearch";

function rankToTier(rank: number): TierGrade {
  if (rank <= 3) return "S";
  if (rank <= 7) return "A";
  if (rank <= 11) return "B";
  if (rank <= 14) return "C";
  return "D";
}

function shorten(text: string, max: number): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max - 1) + "…";
}

const ENTITY_PATTERNS = [
  /([가-힣]{2,12}(?:아파트|APT|apt|단지|타운|힐스|자이|래미안|푸르지오))/g,
  /([가-힣]{2,8}(?:동|구|시|역))/g,
  /([가-힣]{2,10}(?:브랜드|건설|증권|은행))/g,
  /([가-힣]{2,8}(?:챌린지|적금|예금|ETF|ISA|DSR|LTV))/gi,
  /([가-힣A-Za-z]{2,12}(?:부업|N잡|투자|재테크))/g,
];

const BRAND_NAMES = [
  "힐스테이트",
  "래미안",
  "자이",
  "푸르지오",
  "e편한세상",
  "아이파크",
  "롯데캐슬",
  "더샵",
  "호반써밋",
  "디에이치",
  "아크로",
];

const SEOUL_DISTRICTS = [
  "강남구",
  "서초구",
  "송파구",
  "용산구",
  "마포구",
  "성동구",
  "광진구",
  "영등포구",
  "양천구",
  "강동구",
  "노원구",
  "관악구",
];

function extractEntities(text: string): string[] {
  const found: string[] = [];

  for (const brand of BRAND_NAMES) {
    if (text.includes(brand)) found.push(brand);
  }
  for (const district of SEOUL_DISTRICTS) {
    if (text.includes(district)) found.push(district);
  }

  for (const pattern of ENTITY_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const m of matches) {
      const entity = m[1]?.trim();
      if (entity && entity.length >= 2 && entity.length <= 16) {
        found.push(entity);
      }
    }
  }

  return found;
}

function uniqueEntities(results: SearchResult[], count: number): string[] {
  const entities: string[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    const text = `${result.title} ${result.snippet}`;
    for (const entity of extractEntities(text)) {
      const key = entity.replace(/\s/g, "");
      if (!seen.has(key) && entities.length < count + 5) {
        seen.add(key);
        entities.push(entity);
      }
    }
  }

  if (entities.length < count) {
    for (const result of results) {
      const fallback = shorten(
        result.title.split(/[-–|:]/)[0].trim(),
        18,
      );
      const key = fallback.replace(/\s/g, "");
      if (!seen.has(key) && fallback.length >= 3) {
        seen.add(key);
        entities.push(fallback);
      }
      if (entities.length >= count) break;
    }
  }

  return entities.slice(0, count);
}

function findHookForEntity(
  entity: string,
  results: SearchResult[],
): string {
  for (const r of results) {
    const text = `${r.title} ${r.snippet}`;
    if (text.includes(entity) && r.snippet) {
      return shorten(r.snippet, 12);
    }
  }
  const hooks = ["급상승 📈", "관심↑", "핫🔥", "주목", "인기", "추천"];
  return hooks[entity.length % hooks.length];
}

function buildRankingItems(
  topic: ContentTopic,
  results: SearchResult[],
  count: number,
): RankedItem[] {
  const entities = uniqueEntities(results, count);

  return entities.slice(0, count).map((entity, i) => ({
    rank: i + 1,
    label: shorten(entity, 20),
    tier: rankToTier(i + 1),
    hook: findHookForEntity(entity, results),
    icon: topic.emoji,
  }));
}

function provocativeRewrite(title: string): string {
  let t = title.split(" - ")[0].split("|")[0].trim();
  t = t.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();

  if (t.length > 28) t = t.slice(0, 26) + "…";

  const prefixes = ["솔직히 ", "아니 ", "진짜 ", "ㄹㅇ "];
  if (t.length < 20) {
    return prefixes[t.length % prefixes.length] + t;
  }
  return t;
}

function buildCommentItems(
  topic: ContentTopic,
  results: SearchResult[],
  count: number,
): RankedItem[] {
  return results.slice(0, count).map((result, i) => {
    const reactions = ["🔥 공감폭발", "💬 댓글폭주", "😱 난리", "👍 추천천", "🤯 충격"];
    return {
      rank: i + 1,
      label: provocativeRewrite(result.title),
      tier: rankToTier(i + 1),
      hook: reactions[i % reactions.length],
      icon: "💬",
    };
  });
}

function buildCaption(
  topic: ContentTopic,
  subtitle: string,
  items: RankedItem[],
  sources: SearchResult[],
): string {
  const header =
    topic.mode === "comment-pick"
      ? `${topic.emoji} ${topic.title}\n${subtitle}\n\n💬 오늘의 핫댓 픽`
      : `${topic.emoji} ${topic.title}\n${subtitle}`;

  const lines = items
    .map((item) => {
      if (topic.mode === "comment-pick") {
        return `${item.rank}. "${item.label}"\n   → ${item.hook}`;
      }
      return `${item.rank}. ${item.label} — ${item.hook}`;
    })
    .join("\n");

  const sourceList = sources
    .slice(0, 4)
    .map((s) => `• ${s.source}`)
    .join("\n");

  const footer =
    topic.mode === "comment-pick"
      ? "※ 실제 댓글을 각색한 콘텐츠입니다. 출처 기사 확인 후 게시하세요."
      : "웹 검색 기반 · 저장 후 공유 👇";

  return `${header}

${lines}

📰 참고 출처
${sourceList}

${footer}`;
}

export function generateContentFromTopic(
  topic: ContentTopic,
  results: SearchResult[],
  displayCount: number,
): CategoryContent {
  const subtitle = topic.subtitleTemplate.replace("{n}", String(displayCount));

  const rankedItems =
    topic.mode === "comment-pick"
      ? buildCommentItems(topic, results, displayCount)
      : buildRankingItems(topic, results, displayCount);

  const headlines = results.slice(0, 5).map((r) => r.title);
  const clipSources = results.slice(0, 4).map((r) => ({
    name: r.source,
    query: shorten(r.title, 30),
  }));

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    headlines,
    cardTag: topic.tag,
    cardTitle: topic.title,
    cardSubtitle: subtitle,
    rankedItems,
    caption: buildCaption(topic, subtitle, rankedItems, results),
    hashtags: topic.hashtags,
    clipSources,
    clipStrategy: topic.clipStrategy,
    defaultCount: displayCount,
    mode: topic.mode,
  };
}
