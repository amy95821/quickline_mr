/** 카드 배경 — 주제별 추상·실사 풀 */

export const PHOTOS = {
  apartmentNight:
    "https://images.unsplash.com/photo-1516156008621-3a148a64c113?w=1080&q=80",
  seoulSkyline:
    "https://images.unsplash.com/photo-1517154421773-0529f29ea771?w=1080&q=80",
  cityNightAbstract:
    "https://images.unsplash.com/photo-1477959856237-9a59d2f1f574?w=1080&q=80",
  financeDesk:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1080&q=80",
  documents:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1080&q=80",
  keyCloseup:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1080&q=80",
  minimalArch:
    "https://images.unsplash.com/photo-1487958449943-2429e8be8622?w=1080&q=80",
  movingBoxes:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&q=80",
  contract:
    "https://images.unsplash.com/photo-1560520653-9ee0e4b46db9?w=1080&q=80",
  officeTower:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&q=80",
  cafeStreet:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1080&q=80",
  construction:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1080&q=80",
  subway:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&q=80",
  bokehFinance:
    "https://images.unsplash.com/photo-1611974789855-11c0a45a3957?w=1080&q=80",
} as const;

export const BUILDER_LOGOS = {
  samsung:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Samsung_Logo.svg/320px-Samsung_Logo.svg.png",
  hyundai:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Hyundai_Engineering_%26_Construction_logo.svg/320px-Hyundai_Engineering_%26_Construction_logo.svg.png",
  posco:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/POSCO_logo.svg/320px-POSCO_logo.svg.png",
  gs:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/GS_E%26C_logo.svg/320px-GS_E%26C_logo.svg.png",
  hug:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Emblem_of_South_Korea.svg/120px-Emblem_of_South_Korea.svg.png",
} as const;

export type PhotoKey = keyof typeof PHOTOS;

/** 이미지 로딩 실패 시 대체 그라디언트 (깨진 아이콘 방지) */
export const FALLBACK_GRADIENT = "linear-gradient(135deg, #1A2744 0%, #0A0A0A 100%)";

const TOPIC_POOLS: Record<string, PhotoKey[]> = {
  tax: ["financeDesk", "documents", "keyCloseup", "bokehFinance", "contract"],
  policy: ["officeTower", "cityNightAbstract", "minimalArch", "documents"],
  market: ["seoulSkyline", "minimalArch", "cityNightAbstract", "apartmentNight"],
  rental: ["keyCloseup", "movingBoxes", "cafeStreet", "subway"],
  story: ["cityNightAbstract", "cafeStreet", "movingBoxes", "minimalArch"],
  brand: ["minimalArch", "construction", "seoulSkyline", "officeTower"],
  supply: ["construction", "minimalArch", "officeTower"],
  calendar: ["documents", "financeDesk", "officeTower"],
  rate: ["bokehFinance", "financeDesk", "cityNightAbstract"],
  default: ["cityNightAbstract", "minimalArch", "financeDesk", "documents", "keyCloseup"],
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function pickPhoto(seed: number): string {
  const keys = Object.keys(PHOTOS) as PhotoKey[];
  return PHOTOS[keys[seed % keys.length]];
}

export function pickPhotoForTopic(
  topicKey: string,
  theme?: string,
  photoKey?: PhotoKey,
  slideIndex = 0,
): string {
  if (photoKey) {
    const keys = Object.keys(PHOTOS) as PhotoKey[];
    const base = keys.indexOf(photoKey);
    const idx = base >= 0 ? (base + slideIndex + hash(topicKey)) % keys.length : hash(topicKey);
    return PHOTOS[keys[idx]];
  }
  const pool = TOPIC_POOLS[theme ?? "default"] ?? TOPIC_POOLS.default;
  const idx = (hash(`${topicKey}-${slideIndex}`) + slideIndex) % pool.length;
  return PHOTOS[pool[idx]];
}
