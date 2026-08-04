import type { Category, ContentFormat, CoverStyle } from "./cardTypes";
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
  coverStyle?: CoverStyle;
  slotLabel?: string;
  timelinessTag?: string;
}

export async function suggestDailyTopics(
  category: Category,
  date: string,
): Promise<SuggestedTopic[]> {
  const picks = getDailyTopicPicks(category, date);

  return picks.map(({ blueprint: bp, isTop10, coverStyle, timelinessTag, slotLabel }) => ({
    id: `${date}-${bp.id}`,
    blueprintId: bp.id,
    category: bp.category,
    format: bp.format,
    summary: bp.summary,
    searchQueries: bp.searchQueries,
    unsoldRegion: bp.unsoldRegion,
    isTop10,
    coverStyle,
    slotLabel,
    timelinessTag: timelinessTag ?? slotLabel,
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
    return buildTop10Blueprint(category, date, blueprintId);
  }

  return undefined;
}

export type { TopicPickMeta };
