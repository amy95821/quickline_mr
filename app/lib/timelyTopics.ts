import type { TopicBlueprint } from "./contentLibrary";
import { pickHumor } from "./humorSnippets";
import { PHOTOS, BUILDER_LOGOS } from "./cardImages";

/** 2026년 8월 시사성 토픽 — 데일리 풀에 주입 */
export const TIMELY_AUG2026: TopicBlueprint[] = [
  {
    id: "timely-wolse-52",
    category: "부동산",
    format: "carousel",
    summary:
      "8.3 국토부·머니투데이 — 서울 아파트 월세 비중 52% 역대 첫 돌파. '사라진 전세' + 실거주 세제 여파 4장 스토리",
    searchQueries: ["서울 월세 52%", "전세 월세화 2026", "실거주 세제"],
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: "전세\n사라졌대요",
        subheadline: "서울 월세 52% · 8월 국토부",
        coverImage: PHOTOS.apartmentNight,
        bestComment: "전세 매물 0건… 새로고침만 47번 ㅋㅋ",
        reactionLine: "무한 새로고침",
        accent: "dark",
        slideIndex: 1,
        totalSlides: 4,
      },
      {
        layout: "story",
        headline: "숫자가 말해줌",
        body: [
          "서울 아파트 임대 거래 중 월세 52% — 처음",
          "비아파트는 월세 78% 육박",
          "전세 매물↓ + 갱신↑ = 신규 전세 어려움",
        ],
        highlight: "실거주 세제 → 집주인 직접 입주↑",
        slideIndex: 2,
        totalSlides: 4,
      },
      {
        layout: "story",
        headline: "월급쟁이 체감",
        body: [
          "전세→월세 전환 = 월 40만+ 추가 (1억 기준)",
          "반전세 제안 늘어남",
          "20억 이하도 임대물량 줄 수 있음",
        ],
        slideIndex: 3,
        totalSlides: 4,
      },
      {
        layout: "insight",
        headline: "그래서\n지금은",
        highlight: "전세 찾기보다 '월 현금흐름' 먼저 계산",
        body: ["계약 만기 3개월 전부터 대안", "안심신탁 조건 8월 확인"],
        accent: "green",
        slideIndex: 4,
        totalSlides: 4,
      },
    ],
    buildCaption: () => {
      const h = pickHumor("timely", 1);
      return [
        "서울 월세 52% 돌파 — 전세 '사라진' 거 실감하시죠?",
        "",
        "8월 국토부 통계: 아파트 월세 비중 52%, 비아파트 78%.",
        "실거주 세제 + 전세대출 DSR → 집주인 입주·월세 전환 가속.",
        "",
        h.bestComment ? `💬 "${h.bestComment}"` : "",
        "",
        "👉 스와이프해서 숫자·대응법 확인",
      ]
        .filter(Boolean)
        .join("\n");
    },
  },
  {
    id: "timely-trust-august",
    category: "시사",
    format: "single",
    summary:
      "8.2 머니투데이 — HUG 안심신탁 8월 윤곽. 전세금 공적관리·연 4~5%·PF 연계, 임대인·세입자 영향 한 장+",
    searchQueries: ["안심신탁", "전세신탁 HUG", "8월 부동산"],
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: "안심신탁\n8월 나온다",
        subheadline: "전세금, 공적기구가 관리?",
        coverImage: PHOTOS.contract,
        logoImages: [BUILDER_LOGOS.hug],
        bestComment: "4%? 전세금 넣으면 되는 거죠? …복잡하대요",
        reactionLine: "조건 지옥각",
        accent: "dark",
      },
      {
        layout: "insight",
        headline: "한 줄 요약",
        body: [
          "전세금 → HUG PF 보증 대출 → 연 4~5% 수익",
          "갭투자 막고 '생산적 금융'으로",
          "8월 중 윤곽 · 하반기 시행 논의",
        ],
        highlight: "전세·월세 시장 + 공급 둘 다 건드림",
        accent: "green",
      },
    ],
    buildCaption: () =>
      [
        "안심신탁 8월 윤곽 나온다 — 전세 시장 판 바뀔 수 있어요.",
        "",
        "전세금 공적 관리 + PF 연계. 갭투자·고액 전세 규제랑 겹침.",
        "👉 카드에서 핵심만 확인",
      ].join("\n"),
  },
  {
    id: "timely-live-in-tax",
    category: "시사",
    format: "carousel",
    summary:
      "8.3 실거주 중심 세제 — '집주인 들어오면 나가야죠' 전세·월세난 심화 우려 (머니투데이)",
    searchQueries: ["실거주 세제", "종부세", "비거주 1주택"],
    buildSlides: () => [
      {
        layout: "hook",
        headline: "집주인\n들어온대요",
        subheadline: "실거주 세제 · 8.3 이슈",
        bestComment: "집주인: 그럼 나 들어갈게요 / 나: ???",
        slideIndex: 1,
        totalSlides: 3,
      },
      {
        layout: "story",
        headline: "왜 난리?",
        body: [
          "비거주 1주택 세↑ → 직접 입주 유인",
          "보유세를 월세·전세에 전가 가능",
          "20억 이하도 임대물량 감소 우려",
        ],
        slideIndex: 2,
        totalSlides: 3,
      },
      {
        layout: "insight",
        headline: "세입자는",
        highlight: "계약 만기 전 '갱신 vs 이사' 미리 시뮬레이션",
        accent: "green",
        slideIndex: 3,
        totalSlides: 3,
      },
    ],
    buildCaption: () =>
      [
        "실거주 세제 바뀌면 전세·월세 더 빡세질 수 있어요.",
        "",
        "8.3 머니투데이: 집주인 입주↑ → 전세 물량↓.",
        "💬 '들어온다고? 무한이탈 각' — 공감되면 저장",
      ].join("\n"),
  },
];

export function getTimelyTopicsForMonth(date: string): TopicBlueprint[] {
  const m = new Date(date + "T12:00:00").getMonth() + 1;
  if (m === 8) return TIMELY_AUG2026;
  return TIMELY_AUG2026.slice(0, 1);
}
