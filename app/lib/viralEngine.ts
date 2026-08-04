import type { CardSlide, Category, ContentFormat } from "./cardTypes";
import { pickHumor } from "./humorSnippets";

/** 유치한 어미·밈 톤 금지 — 공포·기회 기반 후킹 */
const SPICY_HEADLINES: Record<string, string> = {
  "dsr-reform-winners": "DSR 3단계 시행\n내 대출 한도부터 줄어든다",
  "my-home-oneroom-first": "내 집 마련?\nLTV 여력부터 다시 계산",
  "jeonse-vs-wolse-story": "전세 vs 월세\nDSR·현금흐름으로 고르기",
  "policy-dsr-story": "세제 완화 뉴스\n내 월급통장은 왜 그대로인가",
  "timely-live-in-tax": "실거주 세제 강화\n전세 매물이 줄어든다",
  "timely-tax-reform-aug": "8.3 세법개편\n보유·양도·취득 동시에 움직인다",
  "timely-jongbu-yangdo-aug": "종부세·양도세 윤곽\n다주택 LTV와 맞물린다",
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function humorKey(blueprintId: string): string {
  if (blueprintId.startsWith("top10-")) return "top10";
  if (blueprintId.includes("jeonse") || blueprintId.includes("wolse")) return "jeonse";
  if (blueprintId.includes("dsr")) return "dsr";
  if (blueprintId.includes("brand") || blueprintId.includes("apt")) return "brand";
  if (blueprintId.startsWith("timely-")) return "timely";
  return "default";
}

function spiceHeadline(slide: CardSlide, blueprintId: string): CardSlide {
  const spicy = SPICY_HEADLINES[blueprintId];
  if (!spicy) return slide;
  return { ...slide, headline: spicy };
}

function injectCommentSlide(slides: CardSlide[], blueprintId: string, date: string): CardSlide[] {
  if (slides.length < 2 || slides.some((s) => s.bestComment)) return slides;
  const humor = pickHumor(humorKey(blueprintId), hash(`${date}-${blueprintId}-humor`));
  return [
    ...slides,
    {
      layout: "insight",
      headline: "커뮤니티\n반응",
      bestComment: humor.bestComment,
      slideIndex: slides.length + 1,
      totalSlides: slides.length + 1,
      accent: "light",
    },
  ];
}

export interface ViralInjectOptions {
  blueprintId: string;
  category: Category;
  format: ContentFormat;
  date: string;
}

export function injectViralSlides(slides: CardSlide[], opts: ViralInjectOptions): CardSlide[] {
  let out = slides.map((s, i) => {
    let slide = i === 0 ? spiceHeadline(s, opts.blueprintId) : s;
    if (slide.layout === "top10") slide = { ...slide, coverImage: undefined, accent: "dark" };
    return slide;
  });

  if (opts.format === "carousel" && out.length >= 3 && out.length <= 6) {
    out = injectCommentSlide(out, opts.blueprintId, opts.date);
  }
  return out;
}

/** 캡션 — 슬랭·ㅋㅋ 훅 제거, 정보 밀도 유지 */
export function injectViralCaption(caption: string, _opts: ViralInjectOptions): string {
  return caption;
}
