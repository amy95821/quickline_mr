import type { Category, CoverStyle, TopicTheme } from "./cardTypes";
import { ALL_TOPICS, buildEconomyCalendar, type TopicBlueprint } from "./contentLibrary";
import { buildTop10Blueprint } from "./top10Library";
import { TIMELY_CATALOG, getTimelyForCategory } from "./timelyTopics";
import { coverStyleFromBlueprint } from "./slideEnhancer";

export interface TopicPickMeta {
  blueprint: TopicBlueprint;
  coverStyle: CoverStyle;
  isTop10: boolean;
  slotLabel?: string;
  timelinessTag?: string;
}

/** 매일 4슬롯 — 타입 섞기: 실사 / 스토리 / 데이터 / 클리핑 */
interface DailySlot {
  label: string;
  themes: TopicTheme[];
  coverStyle: CoverStyle;
  format?: "single" | "carousel";
}

const SLOTS_BY_CATEGORY: Record<Category, DailySlot[]> = {
  부동산: [
    { label: "실사 후킹", themes: ["tax", "policy"], coverStyle: "full-photo", format: "single" },
    { label: "스토리", themes: ["story", "rental"], coverStyle: "story", format: "carousel" },
    { label: "데이터", themes: ["market", "brand"], coverStyle: "data-rank", format: "single" },
    { label: "클리핑", themes: ["tax", "calendar", "supply"], coverStyle: "photo-split", format: "single" },
  ],
  경제: [
    { label: "실사", themes: ["rate", "policy"], coverStyle: "full-photo" },
    { label: "스토리", themes: ["story", "rate"], coverStyle: "story", format: "carousel" },
    { label: "데이터", themes: ["market"], coverStyle: "chart-card" },
    { label: "클리핑", themes: ["policy"], coverStyle: "photo-split" },
  ],
  시사: [
    { label: "실사", themes: ["policy", "tax"], coverStyle: "full-photo" },
    { label: "스토리", themes: ["story"], coverStyle: "story", format: "carousel" },
    { label: "데이터", themes: ["policy"], coverStyle: "scan-rank" },
    { label: "클리핑", themes: ["tax"], coverStyle: "photo-split" },
  ],
  "아파트 브랜드": [
    { label: "실사", themes: ["brand", "market"], coverStyle: "full-photo" },
    { label: "스토리", themes: ["brand"], coverStyle: "story", format: "carousel" },
    { label: "데이터", themes: ["market"], coverStyle: "data-rank" },
    { label: "클리핑", themes: ["brand"], coverStyle: "photo-split" },
  ],
  "미분양·공급": [
    { label: "실사", themes: ["supply"], coverStyle: "full-photo" },
    { label: "스토리", themes: ["supply"], coverStyle: "story" },
    { label: "데이터", themes: ["supply", "market"], coverStyle: "scan-rank" },
    { label: "클리핑", themes: ["supply"], coverStyle: "photo-split" },
  ],
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function basePool(category: Category, date: string): TopicBlueprint[] {
  const timely = getTimelyForCategory(category, date);
  const staticForCat = ALL_TOPICS.filter(
    (t) => t.category === category && !t.unsoldRegion && !t.id.startsWith("compare-"),
  );

  if (category === "경제") {
    return [...timely, buildEconomyCalendar(date), ...staticForCat];
  }
  if (category === "미분양·공급") {
    return [...ALL_TOPICS.filter((t) => t.unsoldRegion && t.category === category), ...timely];
  }
  return [...timely, ...staticForCat];
}

function matchesSlot(bp: TopicBlueprint, slot: DailySlot): boolean {
  const theme = bp.theme ?? inferTheme(bp);
  if (!slot.themes.includes(theme)) return false;
  if (slot.format && bp.format !== slot.format) return false;
  return true;
}

function inferTheme(bp: TopicBlueprint): TopicTheme {
  const s = `${bp.id} ${bp.summary}`;
  if (/세법|세제|종부|양도|취득|tax/i.test(s)) return "tax";
  if (/DSR|정책|국회|policy/i.test(s)) return "policy";
  if (/TOP|순위|실거래|ranking|10억/i.test(s)) return "market";
  if (/전세|월세|원룸|rental|jeonse|wolse/i.test(s)) return "rental";
  if (/브랜드|건설|brand/i.test(s)) return "brand";
  if (/미분양|공급|supply|unsold/i.test(s)) return "supply";
  if (/청약|calendar|달력/i.test(s)) return "calendar";
  if (/금리|rate|FOMC/i.test(s)) return "rate";
  return "story";
}

function pickForSlot(
  pool: TopicBlueprint[],
  slot: DailySlot,
  used: Set<string>,
  date: string,
  category: Category,
  slotIndex: number,
): TopicBlueprint | null {
  const candidates = pool.filter((bp) => !used.has(bp.id) && matchesSlot(bp, slot));
  if (candidates.length) {
    const idx = hash(`${date}-${category}-slot${slotIndex}`) % candidates.length;
    return candidates[idx];
  }
  const fallback = pool.filter((bp) => !used.has(bp.id));
  if (!fallback.length) return null;
  const idx = hash(`${date}-${category}-fb${slotIndex}`) % fallback.length;
  return fallback[idx];
}

export function getDailyTopicPicks(category: Category, date: string): TopicPickMeta[] {
  const pool = basePool(category, date);
  const slots = SLOTS_BY_CATEGORY[category];
  const used = new Set<string>();
  const daily: TopicPickMeta[] = [];

  slots.forEach((slot, i) => {
    const bp = pickForSlot(pool, slot, used, date, category, i);
    if (!bp) return;
    used.add(bp.id);
    daily.push({
      blueprint: bp,
      coverStyle: bp.coverStyle ?? slot.coverStyle,
      isTop10: false,
      slotLabel: slot.label,
      timelinessTag: bp.id.startsWith("timely-") ? slot.label : undefined,
    });
  });

  while (daily.length < 4) {
    const rest = pool.filter((t) => !used.has(t.id));
    if (!rest.length) break;
    const bp = rest[0];
    used.add(bp.id);
    daily.push({
      blueprint: bp,
      coverStyle: coverStyleFromBlueprint(bp),
      isTop10: false,
    });
  }

  daily.push({
    blueprint: buildTop10Blueprint(category, date),
    coverStyle: "scan-rank",
    isTop10: true,
    slotLabel: "TOP10",
    timelinessTag: "TOP10",
  });

  return daily;
}

export { TIMELY_CATALOG };
