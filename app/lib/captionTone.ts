import type { CardSlide } from "./cardTypes";

type CaptionFn = (slides: CardSlide[]) => string;

const CAPTIONS: Record<string, CaptionFn> = {
  "dsr-reform-winners": () =>
    [
      "DSR 3단계가 시행되면 은행이 대출 한도를 계산하는 방식 자체가 달라져요. 연봉 6천만 원 기준으로도 한도가 3천만 원 넘게 줄어드는 사례가 나오고 있어요.",
      "",
      "전세나 월세로 거주 중인 무주택자라면 오히려 마음이 편해질 수 있어요. 이미 고정된 주거비로 살고 있으니 대출 한도 변화의 직격탄을 덜 맞거든요.",
      "반면 갭투자나 레버리지로 여러 채를 굴리던 분들은 LTV와 DSR이 동시에 조여오면서 숨이 막히는 구간이 올 거예요.",
      "",
      "지금은 '언제 사느냐'보다 '현금흐름을 얼마나 버틸 수 있느냐'가 더 중요한 시점이에요. 무리해서 매수하기보다 전세를 유지하며 저축하는 쪽이 유리한 국면입니다.",
      "",
      "카드를 넘겨서 내가 이기는 쪽인지 지는 쪽인지 확인해보세요.",
    ].join("\n"),

  "jeonse-vs-wolse-story": () =>
    [
      "전세와 월세, 요즘 기준으로 정리해봤어요.",
      "",
      "목돈이 있고 2년 이상 한 곳에서 살 계획이라면 전세가 유리해요. 반대로 이사가 잦거나 당장 현금 유동성이 필요하다면 월세가 더 현실적인 선택이 될 수 있어요.",
      "전세가율이 70%를 넘어가는 지역이라면 사실 전세도 마냥 안전하지만은 않아요. DSR이 빠듯한 상황이라면 월세로 살면서 그 차액을 저축하는 게 더 나은 전략일 수 있어요.",
      "",
      "결국 정답은 '내 통장 사정'에 맞는 쪽이에요.",
    ].join("\n"),

  "my-home-oneroom-first": () =>
    [
      "내 집 마련, 꼭 아파트부터 시작해야 할까요? 요즘은 원룸이나 오피스텔에서 시작하는 게 더 똑똑한 선택일 수 있어요.",
      "",
      "1인 가구가 전체의 40%에 달하는 시대예요. 첫 목표가 반드시 '아파트 소유'일 필요는 없어요.",
      "전세나 월세로 거주비를 고정해두고 그 사이 종잣돈을 모은 다음, 매수 타이밍을 노리는 것도 충분히 현실적인 전략이에요. 무리해서 첫 집을 서둘러 사면 오히려 DSR과 금리에 발목 잡히기 쉬워요.",
      "",
      "지금은 '내 집'보다 '거주 안정'이 먼저라는 걸 기억해두세요.",
    ].join("\n"),

  "us-kr-rate-compare": () =>
    [
      "미국과 한국 기준금리, 지금 어디쯤 와 있는지 헷갈리시죠?",
      "",
      "금리 인상 사이클의 정점은 지났지만, 그렇다고 예전 같은 저금리 시대로 돌아가는 건 아니에요.",
      "변동금리로 대출을 받은 분들이라면 이자 부담이 조금씩 줄어드는 구간에 들어서고 있어요.",
      "",
      "대출이든 전월세든 투자든, 지금은 금리 방향부터 먼저 체크하는 습관이 필요해요.",
    ].join("\n"),

  "2040-retire-story": () =>
    [
      "은퇴까지 매달 얼마씩 모아야 할까, 다들 한 번쯤 고민해보셨을 거예요.",
      "",
      "국민연금만으로는 부족해요. IRP나 연금저축 같은 세액공제 상품부터 챙기는 게 먼저예요.",
      "30대에 매달 80만 원씩 30년을 모으면 복리 효과로 3억 원 넘게 만들 수 있어요.",
      "",
      "이미 늦었다고 포기하지 마세요. 오늘 자동이체 하나 걸어두는 것부터 시작하면 됩니다.",
    ].join("\n"),

  "housing-policy-meeting": () =>
    [
      "국회 부동산 간담회에서 나온 이야기, 우리한테 중요한 부분만 쉽게 정리했어요.",
      "",
      "접수된 7,500건의 의견 중 32%는 '공급', 25%는 '대출(금융)'에 대한 것이었어요. 결국 DSR과 청약, 전세 정책으로 이어질 가능성이 큰 이슈들이에요.",
      "",
      "세금 정책은 체감까지 시간이 걸리지만, 대출 규제는 바로 다음 날부터 느껴져요. 저장해두고 참고하세요.",
    ].join("\n"),

  "policy-dsr-story": () =>
    [
      "정부의 DSR·주택정책이 또 바뀐다는데, 나한테는 뭐가 달라지는 걸까요?",
      "",
      "전세대출 심사가 더 깐깐해지고, 갭투자는 사실상 막히는 쪽으로 가고 있어요.",
      "무주택자나 청약을 준비 중인 분들에게는 여전히 유리한 흐름이니, 매수는 신중하게 접근하세요.",
      "",
      "카드를 넘겨서 내 상황별로 어떤 영향이 있는지 확인해보세요.",
    ].join("\n"),

  "apt-brand-ranking": () =>
    [
      "경기 32평 실거래 TOP 7을 뽑아봤는데, 같은 평수인데 가격 차이가 어마어마해요.",
      "",
      "판교는 28억, 광명은 9.5억 — 3배 가까이 차이가 나요.",
      "결국 브랜드나 학군, 교통이 가격을 갈라놓는 건데, 내 예산과 출퇴근 동선을 기준으로 현실적으로 판단하는 게 중요해요.",
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

/** 기계적 ">>" 프리픽스 대신 원문 톤을 그대로 유지 — 딱딱한 기호 삽입 금지 */
function brightenGeneric(text: string): string {
  return text;
}

export function applyFeedbackToCaption(caption: string, feedback: string): string {
  const hashIdx = caption.indexOf("\n\n#");
  const body = hashIdx >= 0 ? caption.slice(0, hashIdx) : caption;
  const tags = hashIdx >= 0 ? caption.slice(hashIdx + 2) : "";
  const note = [body.trimEnd(), "", "[피드백 반영]", feedback.trim()].join("\n");
  return tags ? note + "\n\n" + tags : note;
}

export function applyFeedbackToSlide(slide: CardSlide, feedback: string): CardSlide {
  return {
    ...slide,
    highlight: feedback.trim().slice(0, 120),
    body: [...(slide.body ?? []), feedback.trim()],
  };
}
