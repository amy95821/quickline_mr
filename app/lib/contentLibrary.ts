import type { CardSlide, Category, CompareTopicId, ContentFormat } from "./cardTypes";
import { getComparePayload } from "./marketData";

export interface TopicBlueprint {
  id: string;
  category: Category;
  format: ContentFormat;
  summary: string;
  searchQueries: string[];
  compareTopicId?: CompareTopicId;
  unsoldRegion?: string;
  buildSlides: (date: string) => CardSlide[];
  buildCaption: (slides: CardSlide[]) => string;
}

function d(date: string) {
  return new Date(date + "T12:00:00");
}

function monthOf(date: string) {
  return d(date).getMonth() + 1;
}

function yearOf(date: string) {
  return d(date).getFullYear();
}

/* ── 부동산 ── */

const DSR_STORY: TopicBlueprint = {
  id: "dsr-reform-winners",
  category: "부동산",
  format: "carousel",
  summary:
    "DSR 3단계 강화 시 이기는 쪽(전세·월세 거주·무주택) vs 지는 쪽(갭투자·고레버리지)을 5장 스토리로 정리. 결론: 빚 내서 사기보다 버티기.",
  searchQueries: ["DSR 3단계 강화", "주택담보대출 규제", "갭투자 DSR"],
  buildSlides: () => [
    {
      layout: "hook",
      headline: "빚 내서\n집 샀다?",
      subheadline: "DSR 3단계 · 솔직히 누가 망하나",
      accent: "dark",
      slideIndex: 1,
      totalSlides: 5,
    },
    {
      layout: "story",
      headline: "전세·월세 사는 사람",
      body: [
        "대출 한도랑 상관없음. 주거비 고정이면 끝",
        "금리 올라도 월세만 내는 구조",
        "규제 와도 '버티기'만 하면 됨",
      ],
      highlight: "레버리지 없는 사람이 이기는 시장",
      accent: "light",
      slideIndex: 2,
      totalSlides: 5,
    },
    {
      layout: "story",
      headline: "갭투자·전세 끼고 산 사람",
      body: [
        "LTV·DSR 동시에 막힘 → 추가 대출 불가",
        "전세 만기 + 금리 = 이중 타격",
        "팔아도 손해, 안 팔아도 버거움",
      ],
      highlight: "지금 제일 숨 막히는 쪽",
      accent: "light",
      slideIndex: 3,
      totalSlides: 5,
    },
    {
      layout: "story",
      headline: "2040 월급쟁이 현실",
      body: [
        "연봉 대비 DSR 여유 없으면 매수 미루기",
        "전세 깨지면 월세 전환 = 월급 새어나감",
        "타이밍보다 '이번 달 통장'이 먼저",
      ],
      accent: "light",
      slideIndex: 4,
      totalSlides: 5,
    },
    {
      layout: "insight",
      headline: "솔직한 결론",
      subheadline: "지금 집 사는 게 정답 아님",
      body: [
        "DSR 강화기 = 공격 매수 < 버티기",
        "무주택·저축·전세 안정이 먼저",
      ],
      highlight: "지금은 사지 말고, 버텨라",
      accent: "green",
      slideIndex: 5,
      totalSlides: 5,
    },
  ],
  buildCaption: (slides) => {
    const hook = slides[0]?.headline?.replace("\n", " ") ?? "DSR 3단계";
    return [
      `${hook} — 솔직히 누가 이기고 누가 지는지 정리해봤어요.`,
      "",
      "전세·월세로 사는 무주택자? 오히려 유리해요. 대출 한도랑 상관없이 주거비 고정이니까요.",
      "반면 갭투자·전세 끼고 매수하던 분들은 LTV·DSR 동시에 막혀서 숨 쉴 틈이 없어요.",
      "",
      "2040 입장에선 '타이밍'보다 '이번 달 통장'이 먼저예요.",
      "무리한 대출 매수보다 전세 안정 + 저축이 이기는 구간입니다.",
      "",
      "👉 스와이프해서 이기는 쪽·지는 쪽 확인",
    ].join("\n");
  },
};

const MY_HOME_REALITY: TopicBlueprint = {
  id: "my-home-oneroom-first",
  category: "부동산",
  format: "single",
  summary:
    "「내 집 마련? 일단 원룸부터」— 2040 1인가구 40% 시대, '내 집'보다 거주비 고정·저축이 먼저인 이유를 한 장에 정리.",
  searchQueries: ["2040 1인가구", "원룸 전세", "내집마련 순서"],
  buildSlides: () => [
    {
      layout: "insight",
      headline: "내 집 마련?\n일단 원룸부터",
      subheadline: "2040 40%가 혼자 사는데",
      body: [
        "첫 목표는 '아파트 소유'가 아님",
        "전세·월세로 거주비 고정 → 저축 → 그다음",
        "무리한 첫 매수 = DSR·금리에 발목",
      ],
      highlight: "내 집 = 첫 '거주 안정'이 먼저",
      winnersLosers: [
        { side: "winner", label: "전세·월세 안정 후 저축", reason: "통장부터 살림" },
        { side: "loser", label: "무리한 첫 매수", reason: "DSR·금리 지옥" },
        { side: "neutral", label: "원룸 장기 거주", reason: "이사 스트레스↓" },
      ],
      accent: "dark",
    },
  ],
  buildCaption: () =>
    [
      "내 집 마련? 솔직히 원룸부터가 맞아요.",
      "",
      "2040 1인 가구 40% 넘었는데, 첫 목표가 '아파트 소유'일 필요 없어요.",
      "전세·월세로 거주비 고정 → 저축 → 그다음 매수 타이밍 잡는 게 현실적이에요.",
      "",
      "무리해서 첫 매수하면 DSR·금리에 발목 잡혀요.",
      "지금은 '내 집'보다 '거주 안정'이 먼저입니다.",
    ].join("\n"),
};

function buildDataCompareTopic(id: CompareTopicId, date: string): TopicBlueprint {
  const data = getComparePayload(id);
  return {
    id: `compare-${id}`,
    category: "부동산",
    format: "single",
    summary: `${data.headline} — ${data.conclusion ?? data.insight} (KB지수·입주물량 대조, 한 장 요약)`,
    searchQueries: [data.regionTag, "KB 매매지수", "입주물량"],
    compareTopicId: id,
    buildSlides: () => [
      {
        layout: "chart",
        headline: data.headline,
        subheadline: data.regionTag,
        priceSeries: data.priceSeries,
        supplySeries: data.supplySeries,
        priceLabel: data.priceLabel,
        supplyLabel: data.supplyLabel,
        conclusion: data.conclusion ?? data.insight,
        winnersLosers: data.winnersLosers,
        source: "KB부동산 · 통계청 입주물량(지수화)",
        accent: "light",
      },
    ],
    buildCaption: () =>
      [
        data.headline,
        "",
        data.conclusion ?? data.insight,
        "",
        "입주물량 바닥 칠 때 매매지수가 반등하는 패턴, 데이터로 확인해보세요.",
        "저장해 두었다가 매수·전세 타이밍 잡을 때 참고하세요.",
      ].join("\n"),
  };
}

const JEONWOLSE_STORY: TopicBlueprint = {
  id: "jeonse-vs-wolse-story",
  category: "부동산",
  format: "carousel",
  summary:
    "전세 vs 월세, 2040에게 지금 어느 쪽이 유리한지 4장 스토리. DSR·전세가율·현금흐름 기준 결론 포함.",
  searchQueries: ["전세 월세 비교", "전세가율", "2040 전월세"],
  buildSlides: () => [
    {
      layout: "hook",
      headline: "전세 깨지면\n월세 각오?",
      subheadline: "2040, 지금 어느 쪽이 이득?",
      accent: "dark",
      slideIndex: 1,
      totalSlides: 4,
    },
    {
      layout: "story",
      headline: "전세가 이득인 순간",
      body: [
        "목돈(보증금) 여유 있을 때",
        "2년 이상 안 이사할 각오",
        "월세 24개월치 < 전세 보증금이면 GO",
      ],
      highlight: "월 현금흐름 최소화 = 전세",
      slideIndex: 2,
      totalSlides: 4,
    },
    {
      layout: "story",
      headline: "월세가 이득인 순간",
      body: [
        "목돈·대출 여력 부족할 때",
        "이직·이사 가능성 높을 때",
        "전세 사기·보증금 리스크 피하고 싶을 때",
      ],
      highlight: "유동성 > 보증금 묶기",
      slideIndex: 3,
      totalSlides: 4,
    },
    {
      layout: "insight",
      headline: "정답은 하나",
      subheadline: "남들 말 듣지 말 것",
      body: [
        "전세가율 70%↑ → 전세도 부담",
        "DSR 빠듯하면 월세+저축이 현실",
      ],
      highlight: "내 통장에 맞는 쪽이 정답",
      accent: "green",
      slideIndex: 4,
      totalSlides: 4,
    },
  ],
  buildCaption: () =>
    [
      "전세 vs 월세, 2040 기준으로 정리해봤어요.",
      "",
      "목돈 여유 + 장기 거주 = 전세",
      "유동성 필요 + 이사 잦음 = 월세",
      "",
      "전세가율 70% 넘으면 전세도 부담이에요.",
      "DSR 빠듯하면 월세 + 저축이 현실적입니다.",
      "",
      "👉 스와이프해서 내 상황에 맞는 쪽 확인",
    ].join("\n"),
};

/* ── 경제 ── */

function buildEconomyCalendar(date: string): TopicBlueprint {
  const m = monthOf(date);
  const y = yearOf(date);
  return {
    id: `economy-calendar-${m}`,
    category: "경제",
    format: "single",
    summary: `${m}월 2040 재테크·경제 달력 — FOMC·한은 금리·청약·세금·실적발표 일정을 apt_lap 스타일 그리드로 한 장 정리.`,
    searchQueries: [`${m}월 금리`, `${m}월 청약`, "FOMC 일정"],
    buildSlides: () => [
      {
        layout: "calendar",
        headline: `${m}월,\n놓치면 손해`,
        subheadline: "FOMC·청약·세금 마감 한 장에",
        month: m,
        year: y,
        source: `${y}.${String(m).padStart(2, "0")}.01 기준`,
        events: economyEvents(m),
        accent: "light",
      },
    ],
    buildCaption: () =>
      [
        `${m}월 재테크·경제 달력 📅`,
        "",
        "FOMC, 한은 금리, 청약, 세금 마감까지 한 장에 정리했어요.",
        "저장해 두고 해당 날짜 전에 미리 체크하세요.",
        "",
        "2040 필수 일정, 놓치면 손해 보는 날들입니다.",
      ].join("\n"),
  };
}

function economyEvents(m: number) {
  const base: Record<number, CardSlide["events"]> = {
    1: [
      { day: 1, label: "신년 거래 재개", type: "general" },
      { day: 8, label: "12월 고용·물가", type: "rate" },
      { day: 15, label: "FOMC 의사록", type: "rate" },
      { day: 22, label: "4분기 GDP", type: "general" },
    ],
    8: [
      { day: 1, label: "7월 청약 접수", type: "supply", endDay: 3 },
      { day: 7, label: "FOMC 금리 결정", type: "rate" },
      { day: 14, label: "삼성전자 2Q 실적", type: "general" },
      { day: 18, label: "SK하이닉스 실적", type: "general" },
      { day: 21, label: "한은 금통위", type: "rate" },
      { day: 25, endDay: 28, label: "종합부동산세 신고", type: "tax" },
    ],
  };
  return base[m] ?? [
    { day: 5, label: "청약 접수", type: "supply", endDay: 7 },
    { day: 12, label: "금리·물가 발표", type: "rate" },
    { day: 18, label: "FOMC·한은", type: "rate" },
    { day: 25, label: "세금·공과금", type: "tax" },
  ];
}

const RATE_INSIGHT: TopicBlueprint = {
  id: "us-kr-rate-compare",
  category: "경제",
  format: "single",
  summary:
    "미국·한국 금리 동결/인하 구간 비교 — 2040 대출·전월세·투자에 미치는 영향을 한 장 차트+인사이트로 정리.",
  searchQueries: ["FOMC 금리", "한국은행 기준금리", "금리 동결"],
  buildSlides: () => [
    {
      layout: "chart",
      headline: "금리,\n아직 안 내려갔어",
      subheadline: "미·한 2021→2026 추이",
      priceSeries: [
        { label: "21", value: 0.25 },
        { label: "22", value: 2.5 },
        { label: "23", value: 5.25 },
        { label: "24", value: 5.0 },
        { label: "26", value: 3.75 },
      ],
      supplySeries: [
        { label: "21", value: 0.5 },
        { label: "22", value: 2.5 },
        { label: "23", value: 3.5 },
        { label: "24", value: 3.5 },
        { label: "26", value: 2.5 },
      ],
      priceLabel: "미국 기준금리(%)",
      supplyLabel: "한국 기준금리(%)",
      conclusion: "피크는 지났지만 '저금리 시대' 회귀는 아님 — 대출·전월세·투자 모두 금리 먼저 봐야 함",
      winnersLosers: [
        { side: "winner", label: "변동금리 대출자", reason: "이자 부담↓" },
        { side: "winner", label: "예·적금 가입자", reason: "금리 상대적 유리" },
        { side: "loser", label: "고금리 발행 채권", reason: "가격 하락" },
      ],
      source: "Fed · 한국은행",
      accent: "light",
    },
  ],
  buildCaption: () =>
    [
      "미국·한국 금리, 지금 어디쯤일까요?",
      "",
      "피크는 지났지만 '저금리 시대'로 돌아가진 않아요.",
      "변동금리 대출자는 이자 부담이 조금씩 줄어드는 구간.",
      "",
      "2040은 대출·전월세·투자 모두 '금리 방향'을 먼저 봐야 해요.",
    ].join("\n"),
};

const RETIRE_STORY: TopicBlueprint = {
  id: "2040-retire-story",
  category: "경제",
  format: "carousel",
  summary:
    "2040 은퇴·노후 자금 4장 스토리 — 지금 월 얼마 모아야 하는지, 국민연금·IRP·ETF 조합 인사이트.",
  searchQueries: ["2040 은퇴", "노후자금", "IRP ETF"],
  buildSlides: () => [
    {
      layout: "hook",
      headline: "65세에\n월 300만원?",
      subheadline: "2040, 지금부터 얼마 모아야 하나",
      accent: "dark",
      slideIndex: 1,
      totalSlides: 4,
    },
    {
      layout: "story",
      headline: "숫자로 보면 이렇게",
      body: [
        "65세 은퇴, 월 300만원 생활 가정",
        "25년이면 9억 필요 (물가 미반영)",
        "국민연금만으론 월 100~150만원",
      ],
      highlight: "부족분 = 내가 채워야 할 돈",
      slideIndex: 2,
      totalSlides: 4,
    },
    {
      layout: "story",
      headline: "오늘부터 할 수 있는 것",
      body: [
        "IRP·연금저축 세액공제 max",
        "월 50~100만원 자동이체",
        "ETF·배당 혼합 (단일 종목 X)",
      ],
      slideIndex: 3,
      totalSlides: 4,
    },
    {
      layout: "insight",
      headline: "늦었다?\n아직 아님",
      highlight: "30대 월 80만원 × 30년 = 3억+ (복리)",
      body: ["오늘부터 1만원이라도 자동이체", "포기가 제일 비싼 선택"],
      accent: "green",
      slideIndex: 4,
      totalSlides: 4,
    },
  ],
  buildCaption: () =>
    [
      "2040, 은퇴까지 월 얼마 모아야 할까요?",
      "",
      "국민연금만으론 부족해요. IRP·연금저축 세액공제부터 챙기세요.",
      "30대에 월 80만원 × 30년이면 3억+ 가능(복리).",
      "",
      "늦었다고 포기하지 마세요. 오늘부터 자동이체부터.",
    ].join("\n"),
};

/* ── 시사 ── */

const HOUSING_POLICY: TopicBlueprint = {
  id: "housing-policy-meeting",
  category: "시사",
  format: "single",
  summary:
    "국회 부동산 간담회·토론회 쟁점 3가지(공급·금융·세금)를 관련 인물+의견 수치로 한 장 요약.",
  searchQueries: ["국회 부동산 간담회", "주택 공급 정책", "부동산 세제"],
  buildSlides: () => [
    {
      layout: "policy",
      headline: "국회 부동산\n7,500건 민원",
      subheadline: "2040한테 걸리는 건 이 3가지",
      source: "국토부 · 기재부 · 금융위",
      people: [
        { name: "국토부", role: "주택공급", stat: "2,381", statLabel: "건 (32%)" },
        { name: "금융위", role: "주택금융", stat: "1,892", statLabel: "건 (25%)" },
        { name: "기재부", role: "부동산세", stat: "1,654", statLabel: "건 (22%)" },
      ],
      body: [
        "공급: 3기 신도시·신혼희망타운 일정",
        "금융: DSR·스트레스 DSR 강화",
        "세금: 종부세·취득세 개편 논의",
      ],
      highlight: "2040 = 전세·청약·DSR이 핵심 (세금은 간접)",
      accent: "light",
    },
  ],
  buildCaption: () =>
    [
      "국회 부동산 간담회, 2040한테 뭐가 중요한지 정리했어요.",
      "",
      "7,500건 의견 중 32%가 '공급', 25%가 '금융(대출)'",
      "2040한테 직접 걸리는 건 DSR·청약·전세 정책이에요.",
      "",
      "세금 개편은 간접 영향, 대출 규제는 즉시 체감.",
    ].join("\n"),
};

const DSR_POLICY_STORY: TopicBlueprint = {
  id: "policy-dsr-story",
  category: "시사",
  format: "carousel",
  summary:
    "정부 DSR·주택정책 5장 스토리 — 무엇이 바뀌고, 2040 무주택·전세·매수 각각 어떻게 영향받는지.",
  searchQueries: ["DSR 규제", "주택정책 2026", "청년 주거"],
  buildSlides: () => [
    {
      layout: "hook",
      headline: "정부 DSR\n또 바뀐다",
      subheadline: "2040, 나한테 뭐가 달라지나",
      accent: "dark",
      slideIndex: 1,
      totalSlides: 5,
    },
    {
      layout: "story",
      headline: "뭐가 바뀌나",
      body: [
        "스트레스 DSR 3단계 시행",
        "투기·과열지역 LTV 추가 축소",
        "전세대출 한도·심사 더 빡세짐",
      ],
      slideIndex: 2,
      totalSlides: 5,
    },
    {
      layout: "story",
      headline: "무주택·전세 거주",
      body: [
        "전세대출 심사 빡세짐 → 보증금 여력 필요",
        "전세→월세 밀릴 수 있음",
        "청약·무주택 기간은 그대로 유리",
      ],
      highlight: "전세 계약 전에 대출 한도부터 확인",
      slideIndex: 3,
      totalSlides: 5,
    },
    {
      layout: "story",
      headline: "매수·갭투자",
      body: [
        "추가 대출 거의 불가",
        "갭투자·전세 끼고 매수 → 사실상 막힘",
        "실수요·신혼만 일부 우대",
      ],
      slideIndex: 4,
      totalSlides: 5,
    },
    {
      layout: "insight",
      headline: "2040 액션",
      highlight: "정책 따라 '매수'보다 '버티기'",
      body: ["무주택·저축·전세 안정 우선", "급매수는 손해 볼 확률↑"],
      accent: "green",
      slideIndex: 5,
      totalSlides: 5,
    },
  ],
  buildCaption: () =>
    [
      "정부 DSR·주택정책, 2040한테 뭐가 바뀌는지 정리했어요.",
      "",
      "전세대출 빡세지고, 갭투자는 사실상 막혀요.",
      "무주택·청약은 여전히 유리, 매수는 신중하게.",
      "",
      "👉 스와이프해서 내 상황별 영향 확인",
    ].join("\n"),
};

/* ── 아파트 브랜드 ── */

const APT_RANKING: TopicBlueprint = {
  id: "apt-brand-ranking",
  category: "아파트 브랜드",
  format: "single",
  summary:
    "경기 국민평형 실거래 TOP 7 — 단지명·평형·거래가를 apt_lap 스타일 리스트로 한 장 정리.",
  searchQueries: ["경기 아파트 실거래", "국민평형", "브랜드 아파트"],
  buildSlides: () => [
    {
      layout: "ranking",
      headline: "경기 32평\n실거래 TOP 7",
      subheadline: "같은 평수, 3배 차이 난다",
      source: "국토부 실거래가 · '26.8.1 조회",
      rows: [
        { rank: 1, label: "판교", sub: "백현마을 2단지 32평", value: "28.0억", highlight: true },
        { rank: 2, label: "과천", sub: "과천자이 32평", value: "27.8억" },
        { rank: 3, label: "분당", sub: "정자동 아파트 32평", value: "25.2억" },
        { rank: 4, label: "위례", sub: "위례송파 32평", value: "14.5억" },
        { rank: 5, label: "동탄", sub: "동탄역 르엘 32평", value: "11.2억" },
        { rank: 6, label: "광교", sub: "광교 중흥 32평", value: "10.8억" },
        { rank: 7, label: "광명", sub: "광명역세권 32평", value: "9.5억" },
      ],
      highlight: "판교 28억 vs 광명 9.5억 — 입지가 전부",
      accent: "dark",
    },
  ],
  buildCaption: () =>
    [
      "경기 국민평형(32평) 실거래 TOP 7 정리했어요.",
      "",
      "판교 28억 vs 광명 9.5억 — 같은 평수, 3배 차이.",
      "브랜드·학군·교통이 가격을 갈라요.",
      "",
      "내 예산·출퇴근 기준으로 현실적인 동네부터 보세요.",
    ].join("\n"),
};

const BRAND_COMPARE: TopicBlueprint = {
  id: "brand-premium-story",
  category: "아파트 브랜드",
  format: "carousel",
  summary:
    "브랜드 프리미엄 4장 스토리 — 같은 동네·평수에서 건설사별 가격 차이, 2040이 볼 포인트.",
  searchQueries: ["아파트 브랜드 프리미엄", "건설사 순위"],
  buildSlides: () => [
    {
      layout: "hook",
      headline: "같은 동네\n2억 차이?",
      subheadline: "브랜드 프리미엄의 진실",
      accent: "dark",
      slideIndex: 1,
      totalSlides: 4,
    },
    {
      layout: "story",
      headline: "프리미엄 나는 브랜드",
      body: ["대형 건설사 TOP 5", "입지·학군 같으면 5~15% 차", "재건축·관리비·커뮤니티"],
      slideIndex: 2,
      totalSlides: 4,
    },
    {
      layout: "story",
      headline: "2040이 볼 것",
      body: ["실거래가·전세가율", "입주물량·미분양", "역세권·학군"],
      slideIndex: 3,
      totalSlides: 4,
    },
    {
      layout: "insight",
      headline: "솔직히",
      highlight: "브랜드 < 입지 + 실거래",
      body: ["프리미엄만 보고 사면 손해", "실거래·전세가율 먼저"],
      accent: "green",
      slideIndex: 4,
      totalSlides: 4,
    },
  ],
  buildCaption: () =>
    [
      "같은 동네, 브랜드만 다르면 2억 차이 날 수 있어요.",
      "",
      "프리미엄만 보고 사면 손해. 실거래·전세가율 먼저 보세요.",
      "2040은 입지 + 현금흐름이 브랜드보다 중요합니다.",
    ].join("\n"),
};

/* ── 미분양·공급 ── */

function buildUnsoldTopic(region: string): TopicBlueprint {
  return {
    id: `unsold-${region}`,
    category: "미분양·공급",
    format: "single",
    summary: `${region} 미분양 TOP 3 — 미분양률·호수·2040이 주목할 구역을 한 장 인포그래픽으로 정리.`,
    searchQueries: [`${region} 미분양`, "미분양 현황"],
    unsoldRegion: region,
    buildSlides: () => [],
    buildCaption: () => "",
  };
}

/* ── Registry ── */

const ECONOMY_TAX: TopicBlueprint = {
  id: "monthly-tax-checklist",
  category: "경제",
  format: "single",
  summary:
    "이번 달 세금·공과금 마감 체크리스트 — 종부세·취득세·4대보험, 2040이 놓치면 손해 보는 날 한 장 정리.",
  searchQueries: ["종부세 신고", "취득세", "세금 마감"],
  buildSlides: (date) => {
    const m = monthOf(date);
    return [
      {
        layout: "insight",
        headline: `${m}월 세금,\n놓치면 가산세`,
        subheadline: "2040 필수 마감일",
        body: [
          "종합부동산세 · 9월 정기분 신고",
          "취득세 · 매수 후 60일 이내",
          "4대보험 · 매월 10일까지",
          "연말정산 미리보기 · 8월 중간 점검",
        ],
        highlight: "마감 하루 전보다 '한 달 전' 알림이 이득",
        accent: "light",
      },
    ];
  },
  buildCaption: () =>
    [
      "이번 달 세금·공과금, 2040 체크리스트예요.",
      "",
      "종부세·취득세·4대보험 — 마감 놓치면 가산세.",
      "한 달 전에 알림 걸어두세요.",
    ].join("\n"),
};

const ASSEMBLY_LAND: TopicBlueprint = {
  id: "assembly-land-debate",
  category: "시사",
  format: "carousel",
  summary:
    "국회 국토위·정책위 부동산 법안 4장 스토리 — 전세사기 특별법·DSR·공급대책, 2040 영향 정리.",
  searchQueries: ["국회 부동산 법안", "전세사기 특별법", "국토위"],
  buildSlides: () => [
    {
      layout: "hook",
      headline: "국회 부동산법\n통과?",
      subheadline: "2040한테 뭐가 바뀌나",
      accent: "dark",
      slideIndex: 1,
      totalSlides: 4,
    },
    {
      layout: "policy",
      headline: "국토교통위",
      subheadline: "전세·월세·공급",
      people: [
        { name: "국토위", role: "전세사기", stat: "통과", statLabel: "특별법" },
        { name: "국토부", role: "공급", stat: "3기", statLabel: "신도시" },
        { name: "금융위", role: "DSR", stat: "3단", statLabel: "강화" },
      ],
      body: ["전세사기 피해 구제 확대", "3기 신도시 청약 일정", "DSR 스트레스 테스트"],
      slideIndex: 2,
      totalSlides: 4,
    },
    {
      layout: "story",
      headline: "2040 영향",
      body: [
        "전세사기 특별법 → 보증금 반환 절차 단축",
        "DSR 3단계 → 추가 대출 어려움",
        "공급 확대 → 청약 기회↑, 기존 매물은?",
      ],
      slideIndex: 3,
      totalSlides: 4,
    },
    {
      layout: "insight",
      headline: "법안 통과\n≠ 바로 체감",
      highlight: "시행일·시행령 확인이 핵심",
      body: ["전세 계약 전 등기·확정일자", "대출은 규제 전후 비교"],
      accent: "green",
      slideIndex: 4,
      totalSlides: 4,
    },
  ],
  buildCaption: () =>
    [
      "국회 부동산 법안, 2040한테 뭐가 바뀌는지 정리했어요.",
      "",
      "전세사기 특별법·DSR·공급대책 — 시행일 확인이 핵심.",
      "👉 스와이프해서 영향 확인",
    ].join("\n"),
};

const TAX_REFORM: TopicBlueprint = {
  id: "tax-reform-policy",
  category: "시사",
  format: "single",
  summary:
    "7월 정부 세제개편안 — 종부세·취득세·양도세, 2040 다주택·무주택 각각 영향 한 장 정리.",
  searchQueries: ["세제개편", "종부세", "취득세"],
  buildSlides: () => [
    {
      layout: "policy",
      headline: "세제개편\n7월 나온다",
      subheadline: "2040, 급하게 움직이지 말 것",
      people: [
        { name: "기재부", role: "종부세", stat: "강화", statLabel: "다주택" },
        { name: "기재부", role: "취득세", stat: "LTV", statLabel: "연계" },
        { name: "국토부", role: "양도세", stat: "1가구", statLabel: "완화?" },
      ],
      body: [
        "다주택자 종부세·양도세 부담↑",
        "무주택·1주택 실수요 — 변화 적을 수 있음",
        "2040은 '보유'보다 '거주' 전략 유리",
      ],
      highlight: "발표 전 매수·매도 서두르지 말 것 — 시행 시점 확인",
      accent: "light",
    },
  ],
  buildCaption: () =>
    [
      "정부 세제개편, 2040한테 뭐가 바뀌는지 정리했어요.",
      "",
      "다주택자 부담↑, 무주택·실수요는 상대적 유리.",
      "발표 전 급매수·급매도는 시행 시점 보고 결정하세요.",
    ].join("\n"),
};

const SEOUL_APT_RANKING: TopicBlueprint = {
  id: "seoul-apt-ranking",
  category: "아파트 브랜드",
  format: "single",
  summary:
    "서울 국민평형(32평) 실거래 TOP 7 — 강남·마포·송파 등 동네별 거래가 한 장 리스트.",
  searchQueries: ["서울 아파트 실거래", "32평"],
  buildSlides: () => [
    {
      layout: "ranking",
      headline: "서울 32평\n실거래 TOP 7",
      subheadline: "강남 35억 vs 성동 16억",
      source: "국토부 실거래가",
      rows: [
        { rank: 1, label: "강남", sub: "대치동 아파트 32평", value: "35.2억", highlight: true },
        { rank: 2, label: "송파", sub: "잠실 32평", value: "28.5억" },
        { rank: 3, label: "서초", sub: "반포 32평", value: "27.0억" },
        { rank: 4, label: "마포", sub: "공덕 32평", value: "18.2억" },
        { rank: 5, label: "용산", sub: "한남 32평", value: "22.1억" },
        { rank: 6, label: "성동", sub: "성수 32평", value: "16.8억" },
        { rank: 7, label: "영등포", sub: "여의도 32평", value: "19.5억" },
      ],
      highlight: "강남 35억 vs 성동 16억 — 브랜드·입지가 가격",
    },
  ],
  buildCaption: () =>
    [
      "서울 32평 실거래 TOP 7 정리했어요.",
      "강남 35억 vs 성동 16억 — 입지·학군이 가격을 갈라요.",
    ].join("\n"),
};

const BRAND_CHECKLIST: TopicBlueprint = {
  id: "brand-checklist",
  category: "아파트 브랜드",
  format: "single",
  summary:
    "아파트 브랜드 고를 때 2040 체크리스트 5가지 — 실거래·전세가율·입주물량·역세권·관리비.",
  searchQueries: ["아파트 브랜드", "건설사"],
  buildSlides: () => [
    {
      layout: "insight",
      headline: "브랜드만\n믿지 마",
      subheadline: "2040 아파트 고를 때 5가지",
      body: [
        "① 실거래가·전세가율 (네이버·국토부)",
        "② 입주물량·미분양 (공급 압력)",
        "③ 역세권·학군 (프리미엄 근거)",
        "④ 관리비·커뮤니티 (거주 만족)",
        "⑤ 건설사 AS·하자 이력",
      ],
      highlight: "브랜드 < 입지 + 실거래 + 현금흐름",
      accent: "dark",
    },
  ],
  buildCaption: () =>
    [
      "아파트 브랜드, 2040 체크리스트 5가지예요.",
      "프리미엄만 보고 사면 손해 — 실거래·전세가율 먼저.",
    ].join("\n"),
};

const ALL_TOPICS: TopicBlueprint[] = [
  DSR_STORY,
  MY_HOME_REALITY,
  JEONWOLSE_STORY,
  RATE_INSIGHT,
  RETIRE_STORY,
  ECONOMY_TAX,
  HOUSING_POLICY,
  DSR_POLICY_STORY,
  ASSEMBLY_LAND,
  TAX_REFORM,
  APT_RANKING,
  BRAND_COMPARE,
  SEOUL_APT_RANKING,
  BRAND_CHECKLIST,
  buildUnsoldTopic("경기"),
  buildUnsoldTopic("서울"),
];

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function getTopicsForCategory(category: Category, date: string): TopicBlueprint[] {
  if (category === "부동산") {
    const compare = buildDataCompareTopic(
      isCompareDay(date) ? pickCompareId(date) : "seoul-supply-cliff",
      date,
    );
    return dedupe([DSR_STORY, JEONWOLSE_STORY, MY_HOME_REALITY, compare]).slice(0, 4);
  }

  if (category === "경제") {
    return dedupe([
      buildEconomyCalendar(date),
      RATE_INSIGHT,
      RETIRE_STORY,
      ECONOMY_TAX,
    ]).slice(0, 4);
  }

  if (category === "시사") {
    return [HOUSING_POLICY, DSR_POLICY_STORY, ASSEMBLY_LAND, TAX_REFORM].slice(0, 4);
  }

  if (category === "아파트 브랜드") {
    return [APT_RANKING, BRAND_COMPARE, SEOUL_APT_RANKING, BRAND_CHECKLIST].slice(0, 4);
  }

  // 미분양·공급
  return dedupe([
    buildUnsoldTopic("경기"),
    buildUnsoldTopic("서울"),
    buildDataCompareTopic("gyeonggi-vs-seoul-outer", date),
    buildDataCompareTopic("changwon-supply", date),
  ]).slice(0, 4);
}

function dedupe(items: TopicBlueprint[]): TopicBlueprint[] {
  const seen = new Set<string>();
  return items.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}

function isCompareDay(date: string): boolean {
  const d = new Date(date + "T12:00:00");
  const wd = d.getDay() === 0 ? 7 : d.getDay();
  const seed = hashSeed(date.slice(0, 7));
  return wd === (seed % 5) + 1 || wd === ((seed >> 3) % 5) + 1;
}

function pickCompareId(date: string): CompareTopicId {
  const ids = [
    "seoul-supply-cliff",
    "gangnam-vs-mapo",
    "mapo-yongsan-seongdong",
    "jeonse-vs-maemae",
    "redevelop-vs-new",
    "gyeonggi-vs-seoul-outer",
    "changwon-supply",
  ] as CompareTopicId[];
  return ids[hashSeed(date) % ids.length];
}

export function resolveBlueprint(
  blueprintId: string,
  date: string,
): TopicBlueprint | undefined {
  const staticTopic = ALL_TOPICS.find((t) => t.id === blueprintId);
  if (staticTopic) return staticTopic;

  if (blueprintId.startsWith("compare-")) {
    const compareId = blueprintId.slice("compare-".length) as CompareTopicId;
    return buildDataCompareTopic(compareId, date);
  }

  if (blueprintId.startsWith("unsold-")) {
    return buildUnsoldTopic(blueprintId.slice("unsold-".length));
  }

  if (blueprintId.startsWith("economy-calendar-")) {
    return buildEconomyCalendar(date);
  }

  return undefined;
}

export function getTopicById(id: string): TopicBlueprint | undefined {
  return ALL_TOPICS.find((t) => t.id === id);
}

export { ALL_TOPICS };
