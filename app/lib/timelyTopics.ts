import type { TopicBlueprint } from "./contentLibrary";
import { PHOTOS } from "./cardImages";

/** 8월 2026 — 포맷·테마·본문 각각 다르게 */
export const TIMELY_CATALOG: TopicBlueprint[] = [
  {
    id: "timely-tax-reform-aug",
    category: "부동산",
    format: "single",
    theme: "tax",
    coverStyle: "full-photo",
    photoKey: "officeTower",
    summary: "8.3 세법개편 — 실거주·종부세·양도세·취득세, 30대 무주택·1주택자가 지금 확인할 것",
    searchQueries: ["세법개편 2026", "실거주 세제", "종부세 8월"],
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: "8월 세법개편\n지금 뭐가 바뀌나",
        coverImage: PHOTOS.officeTower,
        accent: "dark",
      },
    ],
    buildCaption: () =>
      [
        "8.3 세법개편안 나왔어요. 부동산 판 바뀌는 타이밍.",
        "",
        "① 실거주 중심 — 비거주 1주택 보유세↑, 집주인 직접 입주 유인",
        "② 종부세·양도세 — 다주택·갭투자 부담↑ / 1주택 실수요는 상대적 유리",
        "③ 취득세·LTV — 급매수·급매도 전 시행일·공포일 확인",
        "④ 임대소득·전세 — 보유세 전가 → 월세·전세난 겹칠 수 있음",
        "",
        "발표 ≠ 즉시 시행. 8월 국회 일정·시행일 캘린더부터 저장.",
      ].join("\n"),
  },
  {
    id: "timely-live-in-tax",
    category: "부동산",
    format: "single",
    theme: "tax",
    coverStyle: "photo-split",
    photoKey: "apartmentNight",
    summary: "실거주 세제 — 집주인 입주↑ 전세 물량↓, 세입자·무주택 30대 체크리스트",
    searchQueries: ["실거주 세제", "종부세", "비거주 1주택"],
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: "실거주 세제\n집주인 들어온대",
        coverImage: PHOTOS.apartmentNight,
        body: [
          "비거주 1주택 보유세↑ → 직접 입주 유인",
          "20억 이하도 임대물량 줄 수 있다는 분석",
          "보유세 전가·갱신 협상 — 만기 전 시뮬레이션",
        ],
        highlight: "무주택은 전세보다 거주·현금흐름 먼저",
      },
    ],
    buildCaption: () =>
      [
        "실거주 세제, 전세·월세랑 겹치면 더 빡세져요.",
        "",
        "집주인 입주↑ → 전세 매물↓. 만기 전에 대안부터.",
        "무주택은 전세 찾기보다 거주 안정·현금흐름 먼저.",
        "",
        "출처: 8.3 세법개편 · 국회",
      ].join("\n"),
  },
  {
    id: "timely-jongbu-yangdo-aug",
    category: "부동산",
    format: "single",
    theme: "tax",
    coverStyle: "photo-split",
    photoKey: "contract",
    summary: "종부세·양도세 8월 윤곽 — 1주택 실수요 vs 다주택·갭투자 세금 비교",
    searchQueries: ["종부세 2026", "양도세 1주택", "다주택 세금"],
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: "종부세·양도세\n8월 윤곽",
        coverImage: PHOTOS.contract,
        body: [
          "다주택·비거주 — 종부세·양도세 부담↑",
          "1주택·실거주 — 상대적 변화 적을 수 있음",
          "갭투자 — 세금 + DSR 이중 압박",
        ],
        highlight: "실수요 버티기 / 갭·다주택 세금·대출 동시 체크",
      },
    ],
    buildCaption: () =>
      ["종부세·양도세 8월 윤곽 — 다주택 vs 1주택 갈림.", "", "실수요는 버티기, 갭·다주택은 세금·DSR 동시."].join(
        "\n",
      ),
  },
  {
    id: "timely-cheongyak-aug",
    category: "부동산",
    format: "single",
    theme: "calendar",
    coverStyle: "photo-split",
    photoKey: "construction",
    summary: "8월 청약 캘린더 — 3기 신도시·수도권 분양, 무주택 30대 체크",
    searchQueries: ["8월 청약", "3기 신도시", "청약 2026"],
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: "8월 청약\n놓치면 1년",
        coverImage: PHOTOS.construction,
        body: [
          "3기 신도시·수도권 분양 8월 몰림",
          "청약통장 가점·무주택 여부 재확인",
          "전매·실거주 의무 — 세법개편과 겹치면 리스크↑",
        ],
        highlight: "청약 = '싸게'보다 '버틸 현금흐름' 기준",
      },
    ],
    buildCaption: () =>
      ["8월 청약 촘촘 — 무주택이면 캘린더 필수.", "", "세법·DSR 바뀌는 타이밍, 현금흐름부터."].join("\n"),
  },
  {
    id: "timely-wolse-52",
    category: "부동산",
    format: "single",
    theme: "rental",
    coverStyle: "data-rank",
    photoKey: "cafeStreet",
    summary: "서울 월세 52% — 시장 숫자 (세법 이슈 배경 데이터)",
    searchQueries: ["서울 월세 52%", "전세 월세화"],
    buildSlides: () => [
      {
        layout: "top10",
        headline: "월세화 빠른 동네\n서울 52% 돌파",
        top10Items: [
          { rank: 1, label: "마포·연남", note: "비아파트 월세화", value: "78%", highlight: true },
          { rank: 2, label: "성동·성수", note: "갱신↑ 전세↓", value: "65%" },
          { rank: 3, label: "용산", note: "재건축+전세절벽", value: "62%" },
          { rank: 4, label: "강남", note: "전세가 고점", value: "35억+" },
          { rank: 5, label: "송파", note: "반전세↑", value: "58%" },
        ],
        highlightRank: 1,
        accent: "light",
      },
    ],
    buildCaption: () =>
      ["서울 월세 52% — 숫자 확인용.", "", "8월 메인은 세법·정책. 이건 배경 데이터.", "", "출처: 국토부 8월"].join("\n"),
  },
  {
    id: "timely-trust-august",
    category: "시사",
    format: "single",
    theme: "policy",
    coverStyle: "scan-rank",
    photoKey: "contract",
    summary: "HUG 안심신탁 8월 — 전세금 공적관리·PF·세법과 겹치는 포인트",
    searchQueries: ["안심신탁", "HUG 2026"],
    buildSlides: () => [
      {
        layout: "top10",
        headline: "안심신탁\n8월 Q&A TOP10",
        top10Items: [
          { rank: 1, label: "연 4~5%?", note: "조건·한도", value: "?", highlight: true },
          { rank: 2, label: "전세금 안전", note: "공적 관리", value: "O" },
          { rank: 3, label: "갭투자", note: "생산적 금융", value: "△" },
          { rank: 4, label: "임대인 동의", note: "필수", value: "필수" },
          { rank: 5, label: "세법 겹침", note: "실거주 세제", value: "?" },
        ],
        highlightRank: 1,
        accent: "dark",
      },
    ],
    buildCaption: () => ["안심신탁 8월 — 전세·공급·세금 세 축.", ""].join("\n"),
  },
];

export function getTimelyTopicsForMonth(_date: string): TopicBlueprint[] {
  return TIMELY_CATALOG;
}

export function getTimelyForCategory(category: import("./cardTypes").Category, date: string): TopicBlueprint[] {
  return getTimelyTopicsForMonth(date).filter((t) => t.category === category);
}

/** @deprecated use TIMELY_CATALOG */
export const TIMELY_AUG2026 = TIMELY_CATALOG;
