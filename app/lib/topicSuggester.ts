import type { Category, ContentFormat } from "./cardTypes";
import { FORMAT_LABELS } from "./cardTypes";
import { getTopicsForCategory, type TopicBlueprint } from "./contentLibrary";

export interface SuggestedTopic {
  id: string;
  blueprintId: string;
  category: Category;
  format: ContentFormat;
  summary: string;
  searchQueries: string[];
  unsoldRegion?: string;
}

export async function suggestDailyTopics(
  category: Category,
  date: string,
): Promise<SuggestedTopic[]> {
  const blueprints = getTopicsForCategory(category, date);

  return blueprints.map((bp: TopicBlueprint) => ({
    id: `${date}-${bp.id}`,
    blueprintId: bp.id,
    category: bp.category,
    format: bp.format,
    summary: bp.summary,
    searchQueries: bp.searchQueries,
    unsoldRegion: bp.unsoldRegion,
  }));
}

export function findBlueprint(
  blueprintId: string,
  category: Category,
  date: string,
): TopicBlueprint | undefined {
  return getTopicsForCategory(category, date).find((t) => t.id === blueprintId);
}
