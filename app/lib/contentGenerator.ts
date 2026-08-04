import type { CardSlide, GeneratedContent } from "./cardTypes";
import { buildBrightCaption } from "./captionTone";
import { buildHashtags } from "./hashtags";
import { enhanceSlides, enhanceSingleSlide, stripSourcesFromSlides, appendSourcesToCaption } from "./slideEnhancer";
import { injectViralSlides, injectViralCaption } from "./viralEngine";
import { findBlueprint, type SuggestedTopic } from "./topicSuggester";
import { analyzeUnsold, MOCK_UNSOLD_ROWS } from "./unsoldParser";

function buildUnsoldSlides(region: string): CardSlide[] {
  const { top, insight } = analyzeUnsold(MOCK_UNSOLD_ROWS, region);
  return [
    {
      layout: "unsold",
      headline: `${region}\n미분양 1위 어디?`,
      region,
      topRegions: top.map((t) => ({
        name: t.district,
        count: t.unsoldUnits,
        rate: `${t.unsoldRate.toFixed(1)}%`,
      })),
      highlight: insight,
      conclusion: `${top[0]?.district ?? region} 미분양률 ${top[0]?.unsoldRate.toFixed(1) ?? "-"}% — 분양·입주 타이밍 주의`,
      source: "국토교통부 미분양 현황",
      accent: "light",
    },
  ];
}

function buildUnsoldCaption(region: string, slides: CardSlide[]): string {
  const slide = slides[0];
  const lines = [
    `${region} 미분양 TOP 3 — 주목 구역만 쏙!`,
    "",
    ...(slide?.topRegions?.map(
      (r, i) => `${i + 1}. ${r.name} — ${r.rate} (${r.count.toLocaleString()}호)`,
    ) ?? []),
    "",
    slide?.conclusion ?? slide?.highlight ?? "",
    "",
    "저장해두면 나중에 진짜 도움됩니다",
  ].filter(Boolean);
  return lines.join("\n");
}

export function generateFromTopic(
  topic: SuggestedTopic,
  date: string,
): GeneratedContent {
  const bp = findBlueprint(topic.blueprintId, date, topic.category);
  if (!bp) {
    throw new Error(`주제를 찾을 수 없습니다: ${topic.blueprintId}`);
  }

  let slides: CardSlide[] =
    bp.unsoldRegion || topic.unsoldRegion
      ? buildUnsoldSlides(topic.unsoldRegion ?? bp.unsoldRegion ?? "경기")
      : bp.buildSlides(date);

  slides = enhanceSlides(slides, {
    blueprintId: topic.blueprintId,
    date,
    coverStyle: topic.coverStyle ?? bp.coverStyle,
    photoKey: bp.photoKey,
    isTop10: topic.isTop10 ?? topic.blueprintId.startsWith("top10-"),
  });

  slides = injectViralSlides(slides, {
    blueprintId: topic.blueprintId,
    category: topic.category,
    format: bp.format,
    date,
  });

  const { slides: cleaned, sources } = stripSourcesFromSlides(slides);
  slides = cleaned;

  const hashtags = buildHashtags(topic.category);
  const fallbackCaption =
    bp.unsoldRegion || topic.unsoldRegion
      ? buildUnsoldCaption(topic.unsoldRegion ?? bp.unsoldRegion ?? "경기", slides)
      : bp.buildCaption(slides);

  let bodyCaption = buildBrightCaption(topic.blueprintId, fallbackCaption, slides);
  bodyCaption = injectViralCaption(bodyCaption, {
    blueprintId: topic.blueprintId,
    category: topic.category,
    format: bp.format,
    date,
  });
  bodyCaption = appendSourcesToCaption(bodyCaption, sources);
  const caption = `${bodyCaption}\n\n${hashtags.join(" ")}`;

  return {
    topicId: topic.id,
    summary: bp.summary,
    format: bp.format,
    slides,
    caption,
    hashtags,
  };
}

export function generateUnsoldFromUpload(
  region: string,
  rows: typeof MOCK_UNSOLD_ROWS,
): GeneratedContent {
  const { top, insight } = analyzeUnsold(rows, region);
  const raw: CardSlide = {
    layout: "unsold",
    headline: `${region}\n미분양 1위 어디?`,
    region,
    topRegions: top.map((t) => ({
      name: t.district,
      count: t.unsoldUnits,
      rate: `${t.unsoldRate.toFixed(1)}%`,
    })),
    highlight: insight,
    conclusion: `${top[0]?.district ?? region}가 ${top[0]?.unsoldRate.toFixed(1) ?? "-"}%로 최고`,
    source: "업로드 엑셀 · 정부 미분양 공시",
    accent: "light",
  };

  const slides = enhanceSingleSlide(raw);
  const { slides: cleaned, sources } = stripSourcesFromSlides(slides);

  const hashtags = buildHashtags("미분양·공급");
  let caption = buildUnsoldCaption(region, cleaned);
  caption = appendSourcesToCaption(caption, sources.length ? sources : ["국토교통부 미분양 현황"]);
  caption = `${caption}\n\n${hashtags.join(" ")}`;

  return {
    topicId: `unsold-upload-${region}`,
    summary: `${region} 미분양 TOP 3 — 업로드 데이터`,
    format: "single",
    slides: cleaned,
    caption,
    hashtags,
  };
}
