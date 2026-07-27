import type { Category, Region } from "./tierData";

export interface SearchProfile {
  cardTag: string;
  cardTitle: string;
  cardSubtitleTemplate: string;
  emoji: string;
  queries: string[];
  clipStrategy: string;
  hashtags: string[];
}

export const SEARCH_PROFILES: Record<Category, SearchProfile> = {
  부동산: {
    cardTag: "부동산",
    cardTitle: "오늘 꼭 알아야 할",
    cardSubtitleTemplate: "부동산 핫이슈 TOP {n}",
    emoji: "🏠",
    queries: [
      "부동산 뉴스 오늘",
      "아파트 정책 2026",
      "전세 전월세 시장",
      "주택청약 뉴스",
    ],
    clipStrategy:
      "Google News·네이버 뉴스 RSS 웹 검색 → 당일 부동산 헤드라인 수집 → 30대 관점(청약·전세·매매) 영향도 순 TOP N",
    hashtags: [
      "#부동산",
      "#아파트",
      "#전세",
      "#청약",
      "#30대재테크",
      "#quickline_mr",
    ],
  },
  "아파트 브랜드 티어": {
    cardTag: "브랜드",
    cardTitle: "아파트 브랜드 평판",
    cardSubtitleTemplate: "브랜드 인지도 TOP {n}",
    emoji: "🏢",
    queries: [
      "아파트 브랜드 순위 2026",
      "K-브랜드지수 아파트",
      "래미안 힐스테이트 자이 비교",
    ],
    clipStrategy:
      "웹 검색: K-브랜드지수·부동산 커뮤니티·뉴스 → 브랜드별 언급량·프리미엄 → S~C 티어 TOP N",
    hashtags: [
      "#아파트브랜드",
      "#브랜드티어",
      "#힐스테이트",
      "#래미안",
      "#quickline_mr",
    ],
  },
  "시공사 티어": {
    cardTag: "시공사",
    cardTitle: "시공사 평판 티어",
    cardSubtitleTemplate: "시공력·하자 TOP {n}",
    emoji: "🏗️",
    queries: [
      "아파트 시공사 순위",
      "건설사 하자 평판",
      "삼성물산 현대건설 GS건설",
    ],
    clipStrategy:
      "웹 검색: 하자 이행·시공사 평판·브랜드 연계 기사 → 시공사 TOP N + 티어 분류",
    hashtags: ["#시공사", "#시공사티어", "#재건축", "#quickline_mr"],
  },
  "상권 티어": {
    cardTag: "상권",
    cardTitle: "핫 상권 랭킹",
    cardSubtitleTemplate: "유동·성장성 TOP {n}",
    emoji: "🏪",
    queries: [
      "서울 상권 순위 2026",
      "핫플레이스 상권 MZ",
      "상가 임대료 상권",
    ],
    clipStrategy:
      "웹 검색: 상권분석·유동인구·임대료 기사 → 상권 TOP N + S~C 티어",
    hashtags: ["#상권", "#상권티어", "#창업", "#quickline_mr"],
  },
  "학군 티어": {
    cardTag: "학군",
    cardTitle: "학군 평판 티어",
    cardSubtitleTemplate: "{region} 학군 TOP {n}",
    emoji: "🎓",
    queries: [], // filled dynamically by region
    clipStrategy:
      "웹 검색: 학군 순위·특목고·실거래 프리미엄 기사 → 지역별 학군 TOP N",
    hashtags: ["#학군", "#학군티어", "#교육", "#quickline_mr"],
  },
  "서울 집값 티어": {
    cardTag: "서울",
    cardTitle: "서울 집값 티어",
    cardSubtitleTemplate: "구별 평균가 TOP {n}",
    emoji: "🏆",
    queries: [
      "서울 아파트 집값 순위 2026",
      "서울 구별 아파트 시세",
      "서울 실거래가 순위",
    ],
    clipStrategy:
      "웹 검색: 국토부 실거래·KB시세·나래비인덱스 기사 → 서울 구별 TOP N",
    hashtags: ["#서울집값", "#서울티어", "#실거래", "#quickline_mr"],
  },
  "경제·재테크 TOP": {
    cardTag: "재테크",
    cardTitle: "30대 재테크",
    cardSubtitleTemplate: "지금 꼭 알 TOP {n}",
    emoji: "💰",
    queries: [
      "30대 재테크 2026",
      "금리 환율 뉴스 오늘",
      "직장인 재테크 트렌드",
    ],
    clipStrategy:
      "웹 검색: 한은·금감원·경제지 헤드라인 → 30대 지갑 영향도 TOP N",
    hashtags: ["#재테크", "#30대", "#금리", "#quickline_mr"],
  },
};

const REGION_QUERIES: Record<Region, string[]> = {
  서울: ["서울 학군 순위 2026", "서울 특목고 학군", "강남 송파 목동 학군"],
  경기: ["경기 학군 순위 2026", "분당 판교 학군", "경기도 교육 특목고"],
  인천: ["인천 학군 순위 2026", "송도 청라 학군", "인천 교육"],
};

export function getSearchQueries(
  category: Category,
  region?: Region,
): string[] {
  if (category === "학군 티어" && region) {
    return REGION_QUERIES[region];
  }
  return SEARCH_PROFILES[category].queries;
}

export function getSearchProfile(
  category: Category,
  region?: Region,
  displayCount = 12,
): SearchProfile & { cardSubtitle: string; cardTag: string } {
  const profile = SEARCH_PROFILES[category];
  const tag =
    category === "학군 티어" && region ? region : profile.cardTag;
  const subtitle = profile.cardSubtitleTemplate
    .replace("{n}", String(displayCount))
    .replace("{region}", region ?? "서울");

  return { ...profile, cardTag: tag, cardSubtitle: subtitle };
}
