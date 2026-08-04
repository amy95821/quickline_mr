import type { CardSlide, CoverStyle } from "./cardTypes";

import type { TopicBlueprint } from "./contentLibrary";

import { PHOTOS, pickPhoto, type PhotoKey } from "./cardImages";



export interface EnhanceOptions {

  blueprintId: string;

  date: string;

  coverStyle?: CoverStyle;

  photoKey?: PhotoKey;

  isTop10?: boolean;

}



function hash(s: string): number {

  let h = 0;

  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;

  return Math.abs(h);

}



function photoFor(opts: EnhanceOptions, slideIndex = 0): string {

  if (opts.photoKey) {

    const keys = Object.keys(PHOTOS) as PhotoKey[];

    const base = keys.indexOf(opts.photoKey);

    const idx = base >= 0 ? (base + slideIndex) % keys.length : hash(opts.blueprintId) % keys.length;

    return PHOTOS[keys[idx]];

  }

  return pickPhoto(hash(`${opts.date}-${opts.blueprintId}-${slideIndex}`)) ?? PHOTOS.apartmentNight;
}

function clampPhotoSplitBody(body: string[] | undefined, highlight?: string): string[] | undefined {
  if (!body?.length) return body;
  const max = highlight ? 3 : 4;
  return body.slice(0, max);
}

/** 슬롯별 coverStyle — 실사를 1~4번에 골고루 분산 */

export function enhanceSlides(slides: CardSlide[], opts: EnhanceOptions): CardSlide[] {

  if (!slides.length) return slides;



  const style = opts.isTop10 || opts.blueprintId.startsWith("top10-") ? "scan-rank" : (opts.coverStyle ?? "none");



  if (style === "none") {

    return fillMissingPhoto(slides, opts);

  }



  return slides.map((slide, i) => enhanceOne(slide, i, style, photoFor(opts, i), slides.length, opts));

}



function enhanceOne(

  slide: CardSlide,

  index: number,

  style: CoverStyle,

  photo: string,

  total: number,

  opts: EnhanceOptions,

): CardSlide {

  switch (style) {

    case "full-photo":

      if (index !== 0) return slide;

      if (slide.layout === "photo-hook") {

        return { ...slide, coverImage: slide.coverImage ?? photo, accent: "dark" };

      }

      if (slide.layout === "hook" || slide.layout === "insight") {

        return { ...slide, layout: "photo-hook", coverImage: photo, accent: "dark" };

      }

      if (slide.layout === "story") {

        return { ...slide, coverImage: slide.coverImage ?? photo };

      }

      return { ...slide, coverImage: slide.coverImage ?? photo };



    case "photo-split":

      if (index !== 0) return slide;

      if (slide.layout === "policy") {

        return {

          layout: "photo-hook",

          headline: slide.headline,

          coverImage: photo,

          body: clampPhotoSplitBody(
            slide.body ?? slide.people?.map((p) => `${p.name} ${p.stat} — ${p.role}`),
            slide.highlight,
          ) ?? [],

          highlight: slide.highlight,

        };

      }

      return {

        ...slide,

        layout: "photo-hook",

        coverImage: slide.coverImage ?? photo,

        body: clampPhotoSplitBody(
          slide.body ?? (slide.people ? slide.people.map((p) => `${p.name} — ${p.role} (${p.stat})`) : undefined),
          slide.highlight,
        ),

        highlight: slide.highlight,

      };



    case "story":

      if (index === 0 && (slide.layout === "hook" || slide.layout === "photo-hook" || slide.layout === "insight")) {

        return { ...slide, layout: "photo-hook", coverImage: slide.coverImage ?? photo, accent: "dark" };

      }

      if (slide.layout === "story" || slide.layout === "insight") {

        const storyPhoto = photoFor(opts, index + 1);

        return { ...slide, coverImage: slide.coverImage ?? storyPhoto };

      }

      if (index === 1 && total > 2 && !slide.coverImage) {

        return { ...slide, coverImage: photoFor(opts, 2) };

      }

      return slide;



    case "data-rank":

      if (index === 0 && ["ranking", "top10", "chart", "policy"].includes(slide.layout)) {

        return { ...slide, coverImage: slide.coverImage ?? photo, accent: slide.accent ?? "light" };

      }

      return slide;



    case "scan-rank":

      if (index === 0) {

        return { ...slide, coverImage: slide.coverImage ?? photo, accent: slide.accent ?? "dark" };

      }

      return slide;



    case "chart-card":

      if (index === 0) {

        return { ...slide, coverImage: slide.coverImage ?? photo };

      }

      return slide;



    default:

      return slide;

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



/** 카드에서 source 제거 — 본문(caption)으로 이동 */

export function stripSourcesFromSlides(slides: CardSlide[]): {

  slides: CardSlide[];

  sources: string[];

} {

  const sources = [...new Set(slides.map((s) => s.source).filter(Boolean) as string[])];

  const cleaned = slides.map((s) => ({ ...s, source: undefined }));

  return { slides: cleaned, sources };

}



export function appendSourcesToCaption(caption: string, sources: string[]): string {

  if (!sources.length) return caption;

  const hashIdx = caption.indexOf("\n\n#");

  const body = hashIdx >= 0 ? caption.slice(0, hashIdx) : caption;

  const tags = hashIdx >= 0 ? caption.slice(hashIdx) : "";

  const line = "출처: " + sources.join(" · ");

  if (body.includes("출처:")) return caption;

  const merged = body.trimEnd() + "\n\n" + line;

  return tags ? merged + "\n\n" + tags : merged;

}

