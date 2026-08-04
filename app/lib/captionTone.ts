import type { CardSlide } from "./cardTypes";

type CaptionFn = (slides: CardSlide[]) => string;

const CAPTIONS: Record<string, CaptionFn> = {
  "dsr-reform-winners": () =>
    [
      "DSR 3단계 강화... 솔직히 누가 웃고 누가 울어야 하는지 정리해봤어요 😅",
      "",
      "✅ 전세·월세 무주택러 → 주거비 고정! 오히려 편함",
      "❌ 갭투자·레버리지 → LTV/DSR 막혀서 숨 막힘",
      "",
      "지금은 '타이밍'보다 '현금흐름'이 먼저야!",
      "무리해서 집 사지 말고, 전세 안정 + 저축이 이기는 구간이에요",
      "",
      "넘겨서 이기는 쪽/지는 쪽 확인해봐!",
    ].join("\n"),

  "jeonse-vs-wolse-story": () =>
    [
      "전세 vs 월세... 요즘 기준으로 딱 정리해드릴게요!",
      "",
      "목돈 있고 2년+ 거주 확정 -> 전세가 유리",
      "이사 잦고 유동성 필요 -> 월세가 현실적",
      "",
      "전세가율 70% 넘으면 전세도 부담이에요. DSR 빠듯하면 월세+저축 GO!",
      "",
      "정답은 '내 통장'에 맞는 쪽",
    ].join("\n"),

  "my-home-oneroom-first": () =>
    [
      "내 집 마련? ㅋㅋ 일단 원룸부터가 정답일 수도...",
      "",
      "1인 가구 40% 시대, 첫 목표가 '아파트 소유'일 필요 없어요!",
      "전세/월세로 거주비 고정 -> 저축 -> 그다음 매수 타이밍 잡기",
      "",
      "무리해서 첫 매수하면 DSR/금리에 발목 잡혀요.",
      "지금은 '내 집'보다 '거주 안정'이 먼저! 저장해두세요",
    ].join("\n"),

  "us-kr-rate-compare": () =>
    [
      "미/한 금리 지금 어디쯤? 솔직히 헷갈리죠?",
      "",
      "피크는 지났지만 '저금리 시대'로 돌아가진 않아요!",
      "변동금리 대출자 -> 이자 부담 조금씩 줄어드는 중",
      "",
      "대출/전월세/투자 모두 '금리 방향' 먼저 체크!",
    ].join("\n"),

  "2040-retire-story": () =>
    [
      "은퇴까지 월 얼마 모아야 할까...?",
      "",
      "국민연금만으론 부족해요! IRP/연금저축 세액공제부터 챙기세요!",
      "30대에 월 80만원 x 30년 = 3억+ (복리의 마법)",
      "",
      "늦었다고 포기 NO! 오늘부터 자동이체부터 시작",
    ].join("\n"),

  "housing-policy-meeting": () =>
    [
      "국회 부동산 간담회, 우리한테 뭐가 중요한지 쉽게 정리!",
      "",
      "7,500건 의견 중 32%가 '공급', 25%가 '대출(금융)'",
      "직결 -> DSR/청약/전세 정책!",
      "",
      "세금은 간접 영향, 대출 규제는 바로 체감. 저장 추천!",
    ].join("\n"),

  "policy-dsr-story": () =>
    [
      "정부 DSR/주택정책 바뀐다... 나한테 뭐가 달라져?",
      "",
      "전세대출 빡세지고, 갭투자는 사실상 막혀요",
      "무주택/청약은 여전히 유리! 매수는 신중하게~",
      "",
      "넘겨서 내 상황별 영향 확인!",
    ].join("\n"),

  "apt-brand-ranking": () =>
    [
      "경기 32평 실거래 TOP 7... 같은 평수인데 가격 미쳤다",
      "",
      "판교 28억 vs 광명 9.5억 — 3배 차이!",
      "브랜드/학군/교통이 가격 갈라요. 내 예산/출퇴근 기준으로 현실적으로 보세요",
    ].join("\n"),
};

export function buildBrightCaption(
  blueprintId: string,
  fallback: string,
  slides: CardSlide[],
): string {
  const fn = CAPTIONS[blueprintId];
  if (fn) return fn(slides);

  if (blueprintId.startsWith("compare-")) {
    const insight = slides[0]?.conclusion ?? slides[0]?.highlight ?? "";
    return [
      "데이터로 보는 부동산, 한 장에 정리했어요",
      "",
      insight,
      "",
      "입주 줄면 집값 어떻게 되는지 — 저장해두고 타이밍 잡을 때 쓰세요!",
    ].join("\n");
  }

  if (blueprintId.startsWith("unsold-")) {
    const top = slides[0]?.topRegions ?? [];
    const region = slides[0]?.region ?? "";
    return [
      region + " 미분양 TOP 3 — 주목 구역만 쏙!",
      "",
      ...top.map((r, i) => (i + 1) + ". " + r.name + " — " + r.rate + " (" + r.count.toLocaleString() + "호)"),
      "",
      slides[0]?.conclusion ?? "분양/입주 타이밍 잡을 때 참고!",
      "",
      "저장해두면 나중에 진짜 도움됩니다",
    ].join("\n");
  }

  if (blueprintId.startsWith("economy-calendar-")) {
    const headline = slides[0]?.headline ?? "이번 달";
    return [
      headline + " — 놓치면 손해 보는 날들!",
      "",
      "FOMC/한은 금리/청약/세금 마감까지 한 장에~",
      "저장해두고 해당 날짜 전에 미리 체크하세요",
    ].join("\n");
  }

  return brightenGeneric(fallback);
}

function brightenGeneric(text: string): string {
  const lines = text.split("\n");
  const first = lines[0] ?? "";
  if (first && !first.startsWith("[") && first.length > 0) {
    lines[0] = ">> " + first;
  }
  return lines.join("\n");
}

export function applyFeedbackToCaption(
  caption: string,
  feedback: string,
  author: string,
): string {
  const hashIdx = caption.indexOf("\n\n#");
  const body = hashIdx >= 0 ? caption.slice(0, hashIdx) : caption;
  const tags = hashIdx >= 0 ? caption.slice(hashIdx + 2) : "";
  const who = author || "팀";
  const note = [body.trimEnd(), "", "[" + who + " 피드백 반영]", feedback.trim()].join("\n");
  return tags ? note + "\n\n" + tags : note;
}

export function applyFeedbackToSlide(
  slide: CardSlide,
  feedback: string,
  author: string,
): CardSlide {
  const who = author || "팀";
  const note = who + ": " + feedback.trim();
  return {
    ...slide,
    highlight: feedback.trim().slice(0, 120),
    body: [...(slide.body ?? []), note],
  };
}
