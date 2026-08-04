import type { CardSlide, Category } from "./cardTypes";
import type { TopicBlueprint } from "./contentLibrary";
import { BUILDER_LOGOS, PHOTOS, type PhotoKey } from "./cardImages";

export interface Top10Entry {
  id: string;
  headline: string;
  summary: string;
  searchQueries: string[];
  items: { rank: number; label: string; note: string; value: string; logoKey?: keyof typeof BUILDER_LOGOS }[];
  highlightRank?: number;
  photoKey?: PhotoKey;
  timely?: string;
}

const TOP10_POOL: Record<Category, Top10Entry[]> = {
  부동산: [
    {
      id: "top10-tax-aug",
      headline: "8월 세법개편\n체크 TOP10",
      summary: "8.3 세법개편 — 30대가 지금 확인해야 할 세금·정책 키워드 순위",
      searchQueries: ["세법개편 2026", "실거주 세제", "종부세"],
      timely: "Source · 8.3 세법개편 · 국회",
      highlightRank: 1,
      photoKey: "officeTower",
      items: [
        { rank: 1, label: "실거주 세제", note: "비거주 1주택↑", value: "핵심" },
        { rank: 2, label: "종부세", note: "다주택 강화", value: "↑" },
        { rank: 3, label: "양도세", note: "1주택·장특공", value: "확인" },
        { rank: 4, label: "취득세", note: "LTV 연계", value: "?" },
        { rank: 5, label: "임대소득", note: "전세→월세", value: "↑" },
        { rank: 6, label: "DSR 3단계", note: "대출 한도", value: "↓" },
        { rank: 7, label: "8월 청약", note: "3기 신도시", value: "일정" },
        { rank: 8, label: "안심신탁", note: "HUG 8월", value: "윤곽" },
        { rank: 9, label: "전세대출", note: "DSR 연동", value: "?" },
        { rank: 10, label: "시행일", note: "국회·공포", value: "필수" },
      ],
    },
    {
      id: "top10-seongsu-10eok",
      headline: "요즘 뜨는 실거래\n성수·뚝섬 10억대",
      summary: "성수·뚝섬·송정 — 30대가 실제로 검색·계약하는 10억 전후 동네 순위",
      searchQueries: ["성수동 아파트", "10억 아파트", "뚝섬 실거래"],
      timely: "Source · 국토부 실거래 · 2026.7",
      highlightRank: 1,
      photoKey: "apartmentNight",
      items: [
        { rank: 1, label: "성수동1가", note: "리모델링·카페거리", value: "12.4억" },
        { rank: 2, label: "뚝섬", note: "한강뷰 10억대", value: "11.8억" },
        { rank: 3, label: "송정", note: "전세가율 65%", value: "10.2억" },
        { rank: 4, label: "금호", note: "재건축 기대", value: "9.8억" },
        { rank: 5, label: "옥수", note: "역세권 10억", value: "10.5억" },
        { rank: 6, label: "행당", note: "왕십리 spillover", value: "9.1억" },
        { rank: 7, label: "용답", note: "신축 분양 잔여", value: "8.7억" },
        { rank: 8, label: "마장", note: "한강 접근", value: "9.3억" },
        { rank: 9, label: "신답", note: "가성비 9억대", value: "8.9억" },
        { rank: 10, label: "서울숲 인근", note: "프리미엄↑", value: "13.1억" },
      ],
    },
    {
      id: "top10-newlywed-floor",
      headline: "신혼부부가\n고르는 층수 TOP10",
      summary: "청약·실거래 설문 — '몇 층?' 질문에 대한 실제 답변 순위",
      searchQueries: ["신혼 아파트 층수", "선호 층", "청약 층"],
      timely: "Source · 청약·실거래 설문",
      highlightRank: 1,
      photoKey: "apartmentNight",
      items: [
        { rank: 1, label: "15~20층", note: "뷰+소음 밸런스", value: "32%" },
        { rank: 2, label: "10~14층", note: "가장 무난", value: "24%" },
        { rank: 3, label: "21~25층", note: "고층 선호↑", value: "18%" },
        { rank: 4, label: "5~9층", note: "엘리베이터 대기↓", value: "11%" },
        { rank: 5, label: "26층+", note: "풍경파", value: "8%" },
        { rank: 6, label: "3~4층", note: "아이 키우는 집", value: "4%" },
        { rank: 7, label: "1~2층", note: "반려·노약", value: "2%" },
        { rank: 8, label: "탑층", note: "프리미엄·누수", value: "1%" },
        { rank: 9, label: "중간층", note: "타워별 차이", value: "—" },
        { rank: 10, label: "저층(일조)", note: "일조권 이슈", value: "—" },
      ],
    },
  ],
  경제: [
    {
      id: "top10-rate-cut-benefit",
      headline: "금리 인하\n누가 이득?",
      summary: "8.21 한은 금통위 전 — 변동금리·예금·채권 각각 이득 보는 순위",
      searchQueries: ["한국은행 금리", "FOMC 2026", "변동금리"],
      timely: "Source · 8.21 한은 금통위",
      highlightRank: 1,
      photoKey: "apartmentNight",
      items: [
        { rank: 1, label: "변동금리 대출자", note: "이자↓", value: "★★★" },
        { rank: 2, label: "전세대출 보유", note: "DSR 여유", value: "★★★" },
        { rank: 3, label: "적금·예금", note: "금리 상대적", value: "★★" },
        { rank: 4, label: "채권 ETF", note: "가격↑", value: "★★★" },
        { rank: 5, label: "신규 주담대", note: "한도 소폭↑", value: "★★" },
        { rank: 6, label: "코스피 배당주", note: "대안 수익", value: "★★" },
        { rank: 7, label: "IRP·연금", note: "장기 유리", value: "★★" },
        { rank: 8, label: "부동산 매수", note: "심리 개선", value: "★" },
        { rank: 9, label: "달러 보유", note: "환율 리스크", value: "★" },
        { rank: 10, label: "고금리 채권", note: "손실 가능", value: "↓" },
      ],
    },
  ],
  시사: [
    {
      id: "top10-trust-august",
      headline: "안심신탁\n8월 뭐가 바뀌나",
      summary: "8월 HUG 안심신탁 — 임대인·세입자가 검색하는 질문 TOP10",
      searchQueries: ["안심신탁", "전세신탁", "HUG 2026"],
      timely: "Source · HUG 8월 윤곽",
      highlightRank: 1,
      photoKey: "apartmentNight",
      items: [
        { rank: 1, label: "연 4~5% 수익?", note: "조건 확인", value: "?" },
        { rank: 2, label: "전세금 안전?", note: "공적 관리", value: "O" },
        { rank: 3, label: "갭투자 막히나", note: "생산적 금융", value: "△" },
        { rank: 4, label: "임대인 동의", note: "필수", value: "필수" },
        { rank: 5, label: "PF 연계", note: "주택 공급", value: "—" },
        { rank: 6, label: "기존 전세와 차이", note: "제도 비교", value: "—" },
        { rank: 7, label: "세금 영향", note: "실거주 세제", value: "?" },
        { rank: 8, label: "전세대출 한도", note: "DSR 연동", value: "?" },
        { rank: 9, label: "수도권만?", note: "시범 여부", value: "?" },
        { rank: 10, label: "언제부터", note: "8월 중 발표", value: "8월" },
      ],
    },
  ],
  "아파트 브랜드": [
    {
      id: "top10-builder-newlywed",
      headline: "신혼부부\n물어보는 건설사",
      summary: "첫 아파트 상담에서 가장 많이 나오는 건설사·브랜드 순위",
      searchQueries: ["아파트 브랜드", "건설사 순위", "신혼 아파트"],
      timely: "Source · 상담·검색량",
      highlightRank: 1,
      photoKey: "apartmentNight",
      items: [
        { rank: 1, label: "삼성물산", note: "브랜드·프리미엄", value: "래미안", logoKey: "samsung" },
        { rank: 2, label: "현대건설", note: "역세권 강세", value: "힐스테이트", logoKey: "hyundai" },
        { rank: 3, label: "GS건설", note: "디에이치", value: "자이", logoKey: "gs" },
        { rank: 4, label: "포스코이앤씨", note: "더샵", value: "더샵", logoKey: "posco" },
        { rank: 5, label: "대림", note: "e편한세상", value: "e편한" },
        { rank: 6, label: "HDC", note: "아이파크", value: "아이파크" },
        { rank: 7, label: "롯데", note: "캐슬", value: "캐슬" },
        { rank: 8, label: "한화", note: "포레나", value: "포레나" },
        { rank: 9, label: "SK에코", note: "SK VIEW", value: "SK" },
        { rank: 10, label: "호반", note: "가성비", value: "호반" },
      ],
    },
    {
      id: "top10-seongsu-brand",
      headline: "성수·한강\n브랜드 단지 TOP10",
      summary: "성수·뚝섬·송파 접근권 — 30대 검색 많은 브랜드 단지",
      searchQueries: ["성수 아파트", "브랜드 아파트", "실거래"],
      timely: "Source · 실거래·전세가율",
      highlightRank: 1,
      photoKey: "apartmentNight",
      items: [
        { rank: 1, label: "래미안 옥수", note: "28억대", value: "28.4억" },
        { rank: 2, label: "자이 성수", note: "신축 프리미엄", value: "18.2억" },
        { rank: 3, label: "e편한세상 금호", note: "10억대", value: "10.8억" },
        { rank: 4, label: "힐스테이트", note: "한강뷰", value: "15.6억" },
        { rank: 5, label: "아크로", note: "고층 선호", value: "22.1억" },
        { rank: 6, label: "디에이치", note: "브랜드값", value: "19.3억" },
        { rank: 7, label: "더샵", note: "커뮤니티", value: "14.7억" },
        { rank: 8, label: "포레나", note: "신혼", value: "11.2억" },
        { rank: 9, label: "푸르지오", note: "가성비", value: "9.8억" },
        { rank: 10, label: "SK VIEW", note: "역세권", value: "12.5억" },
      ],
    },
  ],
  "미분양·공급": [
    {
      id: "top10-unsold-region",
      headline: "악성 미분양\nTOP10 지역",
      summary: "7월 국토부 — 준공 후 미분양 2.5만가구 돌파. 지역별 TOP10",
      searchQueries: ["악성 미분양", "미분양 2026", "지방 미분양"],
      timely: "Source · 국토부 7.31",
      highlightRank: 1,
      photoKey: "apartmentNight",
      items: [
        { rank: 1, label: "경북", note: "준공 미분양↑", value: "3,842호" },
        { rank: 2, label: "전남", note: "공급 과잉", value: "2,910호" },
        { rank: 3, label: "충남", note: "신도시", value: "2,654호" },
        { rank: 4, label: "경남", note: "분양률↓", value: "2,401호" },
        { rank: 5, label: "전북", note: "입주 물량", value: "1,987호" },
        { rank: 6, label: "강원", note: "관광·이차", value: "1,756호" },
        { rank: 7, label: "충북", note: "청주", value: "1,623호" },
        { rank: 8, label: "제주", note: "외지 수요↓", value: "1,402호" },
        { rank: 9, label: "대구", note: "회복 지연", value: "1,289호" },
        { rank: 10, label: "부산", note: "해운대 제외", value: "1,156호" },
      ],
    },
  ],
};

function hashDate(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function pickTop10ForDay(category: Category, date: string): Top10Entry {
  const pool = TOP10_POOL[category];
  const idx = hashDate(`${date}-${category}-top10`) % pool.length;
  return pool[idx];
}

export function findTop10Entry(category: Category, blueprintId: string, date: string): Top10Entry {
  const pool = TOP10_POOL[category];
  return pool.find((e) => e.id === blueprintId) ?? pickTop10ForDay(category, date);
}

function buildTop10FromEntry(entry: Top10Entry, category: Category): TopicBlueprint {
  const highlight = entry.highlightRank ?? 1;

  return {
    id: entry.id,
    category,
    format: "single",
    summary: entry.summary,
    searchQueries: entry.searchQueries,
    buildSlides: () => [
      {
        layout: "top10",
        headline: entry.headline,
        source: entry.timely,
        top10Items: entry.items.map((item) => ({
          rank: item.rank,
          label: item.label,
          note: item.note,
          value: item.value,
          highlight: item.rank === highlight,
          logoUrl: item.logoKey ? BUILDER_LOGOS[item.logoKey] : undefined,
        })),
        highlightRank: highlight,
        coverImage: entry.photoKey ? PHOTOS[entry.photoKey] : undefined,
        accent: "dark",
      },
    ],
    buildCaption: () =>
      [
        entry.headline.replace("\n", " "),
        "",
        entry.summary,
        "",
        ...entry.items.slice(0, 3).map((i) => `${i.rank}. ${i.label} — ${i.value}`),
        "",
        "저장해두고 비교해보세요 👉",
      ].join("\n"),
  };
}

/** TOP10 = 한 장 순위 카드 (apt_lap · scan.real.data 스타일) */
export function buildTop10Blueprint(category: Category, date: string, blueprintId?: string): TopicBlueprint {
  const entry = blueprintId
    ? findTop10Entry(category, blueprintId, date)
    : pickTop10ForDay(category, date);
  const bp = buildTop10FromEntry(entry, category);
  return bp;
}
