export const C = {
  blue: "#2196F3",
  blueDeep: "#1565C0",
  blueLight: "#64B5F6",
  green: "#00C853",
  greenDeep: "#2E7D32",
  greenLight: "#69F0AE",
  mint: "#E8F8F5",
  sky: "#E3F2FD",
  white: "#FFFFFF",
  ink: "#0D2137",
  coral: "#FF6B6B",
} as const;

export const GRAD = {
  hook: "linear-gradient(145deg, #1E88E5 0%, #00E676 55%, #00C853 100%)",
  header: "linear-gradient(90deg, #42A5F5 0%, #00E676 100%)",
  highlightBlue: "linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)",
  highlightGreen: "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
  cardBg: "linear-gradient(165deg, #E3F2FD 0%, #B9F6CA 45%, #E8F5E9 100%)",
} as const;

/** 카드 PNG·미리보기 공통 — CDN 폰트 직접 지정 */
export const CARD_FONT_FAMILY = '"GmarketSans", "Pretendard", sans-serif';
