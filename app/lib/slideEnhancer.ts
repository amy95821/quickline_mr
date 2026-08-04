import type { CardSlide, CoverStyle } from "./cardTypes";
import type { TopicBlueprint } from "./contentLibrary";
import { PHOTOS, pickPhoto } from "./cardImages";

export interface EnhanceOptions {
  blueprintId: string;
  date: string;
  coverStyle?: CoverStyle;
  photoKey?: keyof typeof PHOTOS;
  isTop10?: boolean;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function photoFor(opts: EnhanceOptions): string {
  if (opts.photoKey) return PHOTOS[opts.photoKey];
  return pickPhoto(hash(`${opts.date}-${opts.blueprintId}`)) ?? PHOTOS.apartmentNight;
}

/**
 * 토픽별 coverStyle만 반영 — 일괄 photo-hook 변환 금지
 */
export function enhanceSlides(slides: CardSlide[], opts: EnhanceOptions): CardSlide[] {
  if (!slides.length || opts.isTop10 || opts.blueprintId.startsWith("top10-")) {
    return slides;
  }

  const style = opts.coverStyle ?? "none";
  if (style === "none" || style === "story" || style === "chart-card") {
    return fillMissingPhoto(slides, opts);
  }

  const photo = photoFor(opts);
  const [first, ...rest] = slides;

  switch (style) {
    case "full-photo": {
      if (first.layout === "photo-hook" && first.coverImage) return slides;
      if (first.layout === "hook" || first.layout === "photo-hook") {
        return [{ ...first, layout: "photo-hook", coverImage: first.coverImage ?? photo, accent: "dark" }, ...rest];
      }
      return slides;
    }
    case "photo-split": {
      if (first.layout === "photo-hook") {
        return [{ ...first, coverImage: first.coverImage ?? photo }, ...rest];
      }
      if (first.layout === "insight" || first.layout === "hook") {
        return [
          {
            ...first,
            layout: "photo-hook",
            coverImage: photo,
            body: first.body,
            highlight: first.highlight,
          },
        ];
      }
      return slides;
    }
    case "data-rank":
    case "scan-rank": {
      if (slides.length === 1 && !first.coverImage && ["ranking", "top10", "unsold"].includes(first.layout)) {
        return [{ ...first, accent: style === "scan-rank" ? "dark" : "light" }];
      }
      return slides;
    }
    default:
      return fillMissingPhoto(slides, opts);
  }
}

function fillMissingPhoto(slides: CardSlide[], opts: EnhanceOptions): CardSlide[] {
  const first = slides[0];
  if (first.layout === "photo-hook" && !first.coverImage) {
    return [{ ...first, coverImage: photoFor(opts) }, ...slides.slice(1)];
  }
  return slides;
}

export function enhanceSingleSlide(slide: CardSlide): CardSlide[] {
  return [slide];
}

export function coverStyleFromBlueprint(bp: TopicBlueprint): CoverStyle {
  return bp.coverStyle ?? (bp.format === "carousel" ? "story" : "none");
}
