import type {
  CardPayload,
  GeneratedContent,
  RankedItem,
} from "./cardTypes";
import { getComparePayload } from "./marketData";
import type { SuggestedTopic } from "./topicSuggester";
import type { SearchResult } from "./webSearch";

function shorten(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function buildTierItems(results: SearchResult[], count: number): RankedItem[] {
  const items: RankedItem[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    const label = shorten(r.title.split(/[-–|]/)[0], 18);
    if (seen.has(label)) continue;
    seen.add(label);
    items.push({
      rank: items.length + 1,
      label,
      hook: shorten(r.snippet || r.source, 10),
      tier: items.length < 3 ? "S" : items.length < 6 ? "A" : "B",
    });
    if (items.length >= count) break;
  }
  return items;
}

function calendarEventsFromSearch(
  results: SearchResult[],
  month: number,
): { day: number; label: string }[] {
  const defaults = [
    { day: 5, label: "청약 접수" },
    { day: 12, label: "전월세 신고" },
    { day: 18, label: "금리 발표" },
    { day: 25, label: "종소세 안내" },
  ];
  if (results.length === 0) return defaults;
  return defaults.map((d, i) => ({
    day: d.day,
    label: shorten(results[i]?.title.split(/[-–|]/)[0] ?? d.label, 8),
  }));
}

export function generateFromTopic(
  topic: SuggestedTopic,
  results: SearchResult[],
  date: string,
): GeneratedContent {
  const d = new Date(date);
  let payload: CardPayload;
  let caption: string;

  switch (topic.template) {
    case "meme":
      payload = {
        template: "meme",
        data: {
          categoryTag: topic.category,
          punchline: topic.title,
          memeKey: topic.memeKey ?? "frog",
        },
      };
      caption = `${topic.title}\n\n${topic.hashtags.join(" ")}`;
      break;

    case "swipe":
      payload = {
        template: "swipe",
        data: {
          question: topic.title,
          accent: topic.swipeAccent ?? "green",
        },
      };
      caption = `${topic.title}\n\n스와이프해서 확인\n${topic.hashtags.join(" ")}`;
      break;

    case "calendar":
      payload = {
        template: "calendar",
        data: {
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          title: topic.title,
          events: calendarEventsFromSearch(results, d.getMonth() + 1),
        },
      };
      caption = `${topic.title}\n저장해 두세요.\n${topic.hashtags.join(" ")}`;
      break;

    case "data-compare": {
      const compare = getComparePayload(
        topic.compareTopicId ?? "seoul-supply-cliff",
      );
      payload = { template: "data-compare", data: compare };
      caption = `${topic.title}\n${compare.insight}\n${topic.hashtags.join(" ")}`;
      break;
    }

    case "tier":
    default: {
      const items = buildTierItems(results, topic.defaultCount ?? 8);
      payload = {
        template: "tier",
        data: {
          tag: topic.category,
          title: topic.title,
          subtitle: `TOP ${items.length}`,
          items,
        },
      };
      caption = items
        .map((it) => `${it.rank}. ${it.label}`)
        .join("\n")
        .concat(`\n\n${topic.hashtags.join(" ")}`);
      break;
    }
  }

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    template: topic.template,
    payload,
    caption,
    hashtags: topic.hashtags,
    headlines: results.slice(0, 4).map((r) => r.title),
  };
}

export function generateUnsoldContent(
  region: string,
  top: { district: string; unsoldUnits: number; unsoldRate: number }[],
  insight: string,
): GeneratedContent {
  const payload: CardPayload = {
    template: "unsold",
    data: {
      region,
      title: "미분양 주의 구역",
      topRegions: top.map((t) => ({
        name: t.district,
        count: t.unsoldUnits,
        rate: `${t.unsoldRate.toFixed(1)}%`,
      })),
      insight,
    },
  };

  return {
    topicId: `unsold-${region}`,
    topicTitle: "미분양 현황",
    template: "unsold",
    payload,
    caption: `${region} 미분양 TOP3\n${insight}\n#미분양 #부동산 #quickline_mr`,
    hashtags: ["#미분양", "#부동산", "#quickline_mr"],
    headlines: top.map((t) => `${t.district} ${t.unsoldRate.toFixed(1)}%`),
  };
}
