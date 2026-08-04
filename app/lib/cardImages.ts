/** 카드에 쓸 실사·로고 URL (Unsplash / Wikimedia — 플랜 업그레이드 불필요) */

export const PHOTOS = {
  apartmentNight:
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
  seoulSkyline:
    "https://images.unsplash.com/photo-1517154421773-0529f29ea771?w=900&q=80",
  movingBoxes:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  contract:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
  officeTower:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
  cafeStreet:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80",
  construction:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80",
  subway:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
} as const;

/** 건설사 로고 (Wikimedia Commons) */
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

export function pickPhoto(seed: number): string {
  const keys = Object.keys(PHOTOS) as PhotoKey[];
  return PHOTOS[keys[seed % keys.length]];
}
