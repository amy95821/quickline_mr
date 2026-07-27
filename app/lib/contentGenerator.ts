import type { CategoryContent, RankedItem, TierGrade } from "./tierData";
import { getSearchProfile, getSearchQueries } from "./searchConfig";
import type { SearchResult } from "./webSearch";
import type { Category, Region } from "./tierData";

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

function extractLabel(title: string): string {
  const withoutSource = title.split(" - ")[0].trim();
  return shorten(withoutSource, 22);
}

function extractHook(result: SearchResult): string {
  if (result.snippet) return shorten(result.snippet, 14);
  const parts = result.title.split(/[:·\-|]/);
  if (parts.length > 1) return shorten(parts[parts.length - 1].trim(), 14);
  return shorten(result.source, 14);
}

function buildRankedItems(
  results: SearchResult[],
  count: number,
): RankedItem[] {
  return results.slice(0, count).map((result, i) => ({
    rank: i + 1,
    label: extractLabel(result.title),
    tier: rankToTier(i + 1),
    hook: extractHook(result),
  }));
}

function buildCaption(
  emoji: string,
  title: string,
  subtitle: string,
  items: RankedItem[],
  sources: SearchResult[],
): string {
  const lines = items
    .map(
      (item) =>
        `${item.rank}. ${item.label} (${item.tier}티어) — ${item.hook}`,
    )
    .join("\n");

  const sourceList = sources
    .slice(0, 5)
    .map((s) => `• ${s.source}: ${shorten(s.title, 50)}`)
    .join("\n");

  return `${emoji} ${title}
${subtitle}

${lines}

📰 웹 검색 출처
${sourceList}

저장해두고 친구한테도 공유 👇`;
}

export function generateContentFromSearch(
  category: import("./tierData").Category,
  results: SearchResult[],
  displayCount: number,
  region?: Region,
): CategoryContent {
  const profile = getSearchProfile(category, region, displayCount);
  const rankedItems = buildRankedItems(results, displayCount);
  const headlines = results.slice(0, 5).map((r) => r.title);

  const clipSources = results.slice(0, 4).map((r) => ({
    name: r.source,
    query: shorten(r.title, 30),
  }));

  return {
    headlines,
    cardTag: profile.cardTag,
    cardTitle: profile.cardTitle,
    cardSubtitle: profile.cardSubtitle,
    rankedItems,
    caption: buildCaption(
      profile.emoji,
      profile.cardTitle,
      profile.cardSubtitle,
      rankedItems,
      results,
    ),
    hashtags: profile.hashtags,
    clipSources,
    clipStrategy: profile.clipStrategy,
    defaultCount: displayCount,
  };
}

export { getSearchQueries, getSearchProfile };
