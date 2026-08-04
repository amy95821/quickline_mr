import type { Category, ContentFormat } from "./cardTypes";
import { resolveBlueprint as resolveStatic } from "./contentLibrary";
import { buildTop10Blueprint } from "./top10Library";
import { getTimelyTopicsForMonth } from "./timelyTopics";
import { getDailyTopicPicks, type TopicPickMeta } from "./topicPool";
import type { TopicBlueprint } from "./contentLibrary";

export interface SuggestedTopic {
  id: string;
  blueprintId: string;
  category: Category;
  format: ContentFormat;
  summary: string;
  searchQueries: string[];
  unsoldRegion?: string;
  isTop10?: boolean;
  hasPhotoCover?: boolean;
  timelinessTag?: string;
}

export async function suggestDailyTopics(
  category: Category,
  date: string,
): Promise<SuggestedTopic[]> {
  const picks = getDailyTopicPicks(category, date);

  return picks.map(({ blueprint: bp, isTop10, hasPhotoCover, timelinessTag }) => ({
    id: `${date}-${bp.id}`,
    blueprintId: bp.id,
    category: bp.category,
    format: bp.format,
    summary: bp.summary,
    searchQueries: bp.searchQueries,
    unsoldRegion: bp.unsoldRegion,
    isTop10,
    hasPhotoCover,
    timelinessTag,
  }));
}

export function findBlueprint(
  blueprintId: string,
  date: string,
  category?: Category,
): TopicBlueprint | undefined {
  const staticBp = resolveStatic(blueprintId, date);
  if (staticBp) return staticBp;

  const timely = getTimelyTopicsForMonth(date).find((t) => t.id === blueprintId);
  if (timely) return timely;

  if (blueprintId.startsWith("top10-") && category) {
    const top10 = buildTop10Blueprint(category, date);
    if (top10.id === blueprintId) return top10;
  }

  return undefined;
}

export type { TopicPickMeta };
