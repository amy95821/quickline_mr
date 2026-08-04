import type { Category } from "./cardTypes";
import {
  ALL_TOPICS,
  buildDataCompareTopic,
  buildEconomyCalendar,
  resolveBlueprint,
  type TopicBlueprint,
} from "./contentLibrary";
import { pickHumor } from "./humorSnippets";
import { pickPhoto, PHOTOS, BUILDER_LOGOS } from "./cardImages";
import { buildTop10Blueprint } from "./top10Library";
import { getTimelyTopicsForMonth } from "./timelyTopics";

export interface TopicPickMeta {
  blueprint: TopicBlueprint;
  hasPhotoCover: boolean;
  isTop10: boolean;
  timelinessTag?: string;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function isCompareDay(date: string): boolean {
  const d = new Date(date + "T12:00:00");
  const wd = d.getDay() === 0 ? 7 : d.getDay();
  const seed = hash(date.slice(0, 7));
  return wd === (seed % 5) + 1 || wd === ((seed >> 3) % 5) + 1;
}

function pickCompareId(date: string) {
  const ids = [
    "seoul-supply-cliff",
    "gangnam-vs-mapo",
    "mapo-yongsan-seongdong",
    "jeonse-vs-maemae",
    "redevelop-vs-new",
    "gyeonggi-vs-seoul-outer",
    "changwon-supply",
  ] as const;
  return ids[hash(date) % ids.length];
}

/** 카테고리별 확장 풀 — 고정 4개 반복 방지 */
function basePool(category: Category, date: string): TopicBlueprint[] {
  const timely = getTimelyTopicsForMonth(date).filter((t) => t.category === category);
  const staticForCat = ALL_TOPICS.filter((t) => t.category === category && !t.unsoldRegion);

  if (category === "부동산") {
    const compare = buildDataCompareTopic(
      isCompareDay(date) ? pickCompareId(date) : "seoul-supply-cliff",
      date,
    );
    return [...timely, ...staticForCat, compare];
  }
  if (category === "경제") {
    return [...timely, buildEconomyCalendar(date), ...staticForCat];
  }
  if (category === "미분양·공급") {
    return [
      ...timely,
      ...ALL_TOPICS.filter((t) => t.unsoldRegion),
      buildDataCompareTopic("gyeonggi-vs-seoul-outer", date),
      buildDataCompareTopic("changwon-supply", date),
    ];
  }
  return [...timely, ...staticForCat];
}

function shufflePick<T>(items: T[], count: number, seed: string): T[] {
  const arr = [...items];
  let s = hash(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) | 0;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const id = (item as TopicBlueprint).id;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(item);
    if (out.length >= count) break;
  }
  return out;
}

/** 첫 슬라이드를 실사 커버로 보강 */
function withPhotoCover(bp: TopicBlueprint, date: string): TopicBlueprint {
  const orig = bp.buildSlides;
  const seed = hash(date + bp.id);
  const humor = pickHumor(
    bp.id.includes("brand") ? "brand" : bp.id.includes("dsr") ? "dsr" : "jeonse",
    seed,
  );
  const photo = pickPhoto(seed);
  const logos =
    bp.category === "아파트 브랜드"
      ? [BUILDER_LOGOS.samsung, BUILDER_LOGOS.hyundai]
      : undefined;

  return {
    ...bp,
    buildSlides: (dateStr) => {
      const slides = orig(dateStr);
      if (!slides.length || slides[0].layout === "photo-hook") return slides;
      const first = slides[0];
      if (first.layout === "hook") {
        slides[0] = {
          ...first,
          layout: "photo-hook",
          coverImage: photo,
          logoImages: logos,
          bestComment: humor.bestComment,
          reactionLine: humor.reactionLine,
        };
      }
      return slides;
    },
  };
}

export function getDailyTopicPicks(category: Category, date: string): TopicPickMeta[] {
  const pool = basePool(category, date);
  const picked = shufflePick(pool, 4, `${date}-${category}-daily`);

  const photoIndices = new Set<number>();
  const h = hash(`${date}-${category}-photo`);
  photoIndices.add(h % 4);
  photoIndices.add((h >> 2) % 4);
  if (photoIndices.size < 2) photoIndices.add((h >> 4) % 4);

  const daily: TopicPickMeta[] = picked.map((bp, i) => {
    const timely = bp.summary.includes("8.") || bp.id.startsWith("timely");
    const usePhoto = photoIndices.has(i);
    return {
      blueprint: usePhoto ? withPhotoCover(bp, date + i) : bp,
      hasPhotoCover: usePhoto || bp.buildSlides(date)[0]?.layout === "photo-hook",
      isTop10: false,
      timelinessTag: timely ? "이번 주 이슈" : undefined,
    };
  });

  const top10 = buildTop10Blueprint(category, date);
  daily.push({
    blueprint: top10,
    hasPhotoCover: true,
    isTop10: true,
    timelinessTag: top10.summary.includes("8.") ? "오늘의 TOP10" : "TOP10",
  });

  return daily;
}

export { resolveBlueprint };
