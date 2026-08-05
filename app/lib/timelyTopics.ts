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
        "먼저 실거주 중심 개편이에요. 비거주 1주택의 보유세가 오르면서 집주인이 직접 들어와 사는 유인이 커지고 있어요.",
        "종부세·양도세는 다주택·갭투자자의 부담이 커지는 반면, 1주택 실수요자는 상대적으로 유리해지는 구조예요.",
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
    photoKey: "financeDesk",
    summary: "실거주 세제 — 집주인 직접 입주가 늘면서 전세 물량이 줄어드는 흐름, 세입자·무주택 30대 체크리스트",
    searchQueries: ["실거주 세제", "종부세", "비거주 1주택"],
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: "실거주 세제 강화\n전세 매물이 줄어든다",
        coverImage: PHOTOS.financeDesk,
        body: [
          "비거주 1주택에 보유세(종부세)를 더 매기면, 집주인이 직접 입주해 세입자를 내보내는 사례가 늘어납니다. 전세 매물이 줄면 갱신 협상에서 불리해질 수 있습니다.",
          "20억 이하 구간도 임대물량이 빠지는 분석이 나왔습니다. 보유세를 월세·전세료에 전가하려는 집주인과 마주할 각오가 필요합니다.",
        ],
        highlight:
          "만기 3~6개월 전, DSR 40% 기준으로 내 연봉 대비 최대 대출 한도를 먼저 계산하고 대체 전·월세 매물 2곳을 리스트업하세요.",
      },
    ],
    buildCaption: () =>
      [
        "8.3 실거주 세제 — 비거주 1주택 보유세 강화 윤곽입니다.",
        "",
        "집주인 입주 유인이 커지면 전세 공급이 줄고, 갱신·전세금 반환 리스크가 동시에 올라갑니다.",
        "무주택·세입자라면 만기 전 DSR 여력과 대체 주거(월세 전환 포함)를 숫자로 확인하는 게 우선입니다.",
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
          "다주택자와 비거주 1주택자는 종부세·양도세 부담이 함께 커져요",
          "1주택·실거주 — 상대적 변화 적을 수 있음",
          "갭투자 — 세금 + DSR 이중 압박",
        ],
        highlight: "1주택 실거주는 종부세 12억 특례공제 유지 여부를, 다주택은 취득세 중과(8~12%) 완화 폭을 국회 통과 전 확인하세요.",
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
          "전매·실거주 의무가 세법개편과 맞물리면 리스크가 커질 수 있어요",
        ],
        highlight: "가점 낮으면 신혼·생초 특별공급 소득 완화 기준부터 확인 — 당첨 후 중도금 DSR까지 미리 계산하세요.",
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
