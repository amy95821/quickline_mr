/** SNS 카드뉴스 — 디자인 시스템 (4차 개정: Soft & Bright + 캐릭터 호스트) */
export const C = {
  black: "#0A0A0A",
  navy: "#1A2744",
  cream: "#F7F4EF",
  white: "#FFFFFF",
  lime: "#CCFF00",
  coral: "#FF4757",
  ink: "#111111",
  muted: "#888888",
  cardBg: "#0A0A0A",
  rowBg: "#1A1A1A",
  /** 파스텔 블루 · 웜 그레이 — 소프트 톤 */
  softBlue: "#E3EEFF",
  softBlueDeep: "#4C6FE0",
  softNavy: "#2B3A55",
  warmGray: "#F4F0E9",
  paper: "#FBFAF7",
} as const;

/** 하드룰: padding은 2.5rem(40px) 고정. 로고는 별도 footer row라 절대 겹치지 않음 */
export const CARD_SAFE = { x: 40, top: 40, bottom: 40 } as const;
export const FOOTER_H = 44;

export const LAYOUT = {
  pad: 40,
  gapSm: 10,
  gapMd: 16,
  gapLg: 24,
  bodyLh: 1.65,
} as const;

export const FONT_PUNCH = "var(--font-title)";
export const FONT_HEAD = "var(--font-title)";
export const FONT_BODY = "var(--font-body)";
export const FONT_DATA = "var(--font-data)";
export const INSET_X = "px-10";

export function cardPad() {
  return {
    paddingTop: CARD_SAFE.top,
    paddingLeft: CARD_SAFE.x,
    paddingRight: CARD_SAFE.x,
  };
}

/** 디자인 있는 딤 — 단순 검정 뭉개기 대신 그라디언트 + 콘트라스트 구간 */
export const DIM_GRADIENT =
  "linear-gradient(185deg, rgba(10,14,24,0.55) 0%, rgba(10,14,24,0.72) 40%, rgba(6,8,14,0.94) 100%)";
export const DIM_GRADIENT_HEAVY =
  "linear-gradient(185deg, rgba(10,14,24,0.7) 0%, rgba(8,10,18,0.85) 45%, rgba(4,5,10,0.97) 100%)";

/** 소프트 톤 — 파스텔 블루 글래스, 어둡게 뭉개지 않고 밝게 필터링 */
export const SOFT_GRADIENT =
  "linear-gradient(185deg, rgba(227,238,255,0.35) 0%, rgba(76,111,224,0.45) 55%, rgba(30,42,74,0.82) 100%)";

/** "AI 냄새" 제거 — Action Item → 인플루언서 톤 라벨 로테이션 */
export const KEY_POINT_LABELS = ["✅ 당장 실행할 것", "💡 오늘의 전략", "📍 핵심 체크리스트"] as const;

export function pickKeyPointLabel(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return KEY_POINT_LABELS[Math.abs(h) % KEY_POINT_LABELS.length];
}

/** 본문 150자 하드 캡 — 컨테이너 이탈 방지 안전망 */
export function clampText(text: string, max = 150): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

/** slideIndex 기반 톤 자동 배정 — 카드뉴스 전체 50%+ 파스텔 소프트 톤 보장 */
export function resolveTone(explicit: "dark" | "soft" | undefined, seedIndex = 0): "dark" | "soft" {
  if (explicit) return explicit;
  return seedIndex % 2 === 0 ? "soft" : "dark";
}

/** 텍스트 길이에 따라 폰트 크기를 자동으로 낮추는 방어적 스케일링 (잘림 방지) */
export function fitBodyClass(text: string): string {
  const len = text.length;
  if (len > 220) return "text-sm";
  if (len > 140) return "text-base";
  return "text-lg";
}

export const CHARACTER_BADGE = "/characters/mooney-badge.png";
