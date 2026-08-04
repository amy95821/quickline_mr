import type { CardSlide, Category } from "./cardTypes";
import type { TopicBlueprint } from "./contentLibrary";
import { pickHumor } from "./humorSnippets";
import { BUILDER_LOGOS, PHOTOS } from "./cardImages";

export interface Top10Entry {
  id: string;
  headline: string;
  subheadline: string;
  summary: string;
  searchQueries: string[];
  items: { rank: number; label: string; note: string }[];
  photoKey?: keyof typeof PHOTOS;
  logoKeys?: (keyof typeof BUILDER_LOGOS)[];
  humorKey?: string;
  /** 시의성 태그 — 8월 2026 등 */
  timely?: string;
}

/** 날짜·카테고리별 TOP10 풀 — 매일 다른 조합 */
const TOP10_POOL: Record<Category, Top10Entry[]> = {
  부동산: [
    {
      id: "top10-wolse52",
      headline: "서울 월세 52%\n역대 첫 돌파",
      subheadline: "TOP10 · 전세 사라진 동네",
      summary: "8월 국토부 통계 — 서울 아파트 월세 비중 52% 돌파. 전세 대신 월세 고착화된 동네 TOP10 (실거주·세제 이슈 반영)",
      searchQueries: ["서울 월세 52%", "전세 월세화", "2026 임대차"],
      timely: "8.3 실거주 세제 · 월세 52% (국토부)",
      items: [
        { rank: 1, label: "마포·연남", note: "비아파트 월세 80% 육박" },
        { rank: 2, label: "성동·성수", note: "갱신↑ 신규 전세↓" },
        { rank: 3, label: "용산", note: "재건축+전세 절벽" },
        { rank: 4, label: "강남·역삼", note: "전세가 역대 최고" },
        { rank: 5, label: "송파·잠실", note: "반전세 급증" },
        { rank: 6, label: "영등포", note: "월세 전환율↑" },
        { rank: 7, label: "동작·노량진", note: "대학가 월세화" },
        { rank: 8, label: "광진·건대", note: "원룸→월세" },
        { rank: 9, label: "서대문", note: "전세 매물 급감" },
        { rank: 10, label: "은평", note: "중저가도 월세↑" },
      ],
      photoKey: "apartmentNight",
      humorKey: "timely",
    },
    {
      id: "top10-seongsu-10eok",
      headline: "성수·뚝섬\n10억대 동네",
      subheadline: "TOP10 · 요즘 뜨는 실거래",
      summary: "성수동·뚝섬·송정 일대 10억 전후 실수요 아파트·오피스텔 동네 순위 (8월 실거래·전세가율 기준)",
      searchQueries: ["성수동 아파트", "10억 아파트", "뚝섬 실거래"],
      items: [
        { rank: 1, label: "성수동1가", note: "리모델링·카페거리" },
        { rank: 2, label: "뚝섬", note: "한강뷰 10억대" },
        { rank: 3, label: "송정", note: "전세가율 65%" },
        { rank: 4, label: "금호", note: "재건축 기대" },
        { rank: 5, label: "옥수", note: "역세권 10억" },
        { rank: 6, label: "행당", note: "왕십리 spillover" },
        { rank: 7, label: "용답", note: "신축 분양 잔여" },
        { rank: 8, label: "마장", note: "한강 접근" },
        { rank: 9, label: "신답", note: "가성비 9억대" },
        { rank: 10, label: "서울숲 인근", note: "프리미엄↑" },
      ],
      photoKey: "cafeStreet",
      humorKey: "top10",
    },
    {
      id: "top10-newlywed-floor",
      headline: "신혼부부\n선호 층수 TOP10",
      subheadline: "청약·실거래 설문 믹스",
      summary: "신혼·첫 내 집 문의 중 '몇 층?' 질문 답변 모음 — 저층vs고층, 실제 계약 비율 반영",
      searchQueries: ["신혼 아파트 층수", "선호 층", "청약 층"],
      items: [
        { rank: 1, label: "15~20층", note: "뷰+소음 밸런스" },
        { rank: 2, label: "10~14층", note: "가장 무난" },
        { rank: 3, label: "21~25층", note: "고층 선호↑" },
        { rank: 4, label: "5~9층", note: "엘리베이터 대기↓" },
        { rank: 5, label: "26층+", note: "풍경파" },
        { rank: 6, label: "3~4층", note: "아이 키우는 집" },
        { rank: 7, label: "1~2층", note: "반려인·노약" },
        { rank: 8, label: "탑층", note: "프리미엄·누수 걱정" },
        { rank: 9, label: "중간층(랜덤)", note: "타워별 차" },
        { rank: 10, label: "저층(일조)", note: "일조권 이슈" },
      ],
      photoKey: "movingBoxes",
      humorKey: "brand",
    },
  ],
  경제: [
    {
      id: "top10-rate-cut-benefit",
      headline: "금리 인하\n누가 이득?",
      subheadline: "TOP10 · 8월 금통위 전",
      summary: "한은·Fed 금리 방향 — 변동금리·예금·채권 각각 이득 보는 순위",
      searchQueries: ["한국은행 금리", "FOMC 2026", "변동금리"],
      timely: "8.21 한은 금통위 예정",
      items: [
        { rank: 1, label: "변동금리 대출자", note: "이자↓" },
        { rank: 2, label: "전세대출 보유", note: "DSR 여유" },
        { rank: 3, label: "적금·예금", note: "금리 상대적" },
        { rank: 4, label: "채권 ETF", note: "가격↑" },
        { rank: 5, label: "신규 주담대", note: "한도 소폭↑" },
        { rank: 6, label: "코스피 배당주", note: "대안 수익" },
        { rank: 7, label: "IRP·연금", note: "장기 유리" },
        { rank: 8, label: "부동산 매수", note: "심리 개선" },
        { rank: 9, label: "달러 보유", note: "환율 리스크" },
        { rank: 10, label: "고금리 채권", note: "손실 가능" },
      ],
      photoKey: "officeTower",
      humorKey: "dsr",
    },
  ],
  시사: [
    {
      id: "top10-trust-august",
      headline: "안심신탁\n8월 뭐가 바뀌나",
      subheadline: "TOP10 · 궁금한 것들",
      summary: "8월 시행 예정 HUG 안심신탁 — 임대인·세입자가 검색하는 질문 TOP10",
      searchQueries: ["안심신탁", "전세신탁", "HUG 2026"],
      timely: "8월 안심신탁 윤곽 (머니투데이)",
      items: [
        { rank: 1, label: "연 4~5% 수익?", note: "조건 확인" },
        { rank: 2, label: "전세금 안전?", note: "공적 관리" },
        { rank: 3, label: "갭투자 막히나", note: "생산적 금융" },
        { rank: 4, label: "임대인 동의", note: "필수" },
        { rank: 5, label: "PF 연계", note: "주택 공급" },
        { rank: 6, label: "기존 전세와 차이", note: "제도 비교" },
        { rank: 7, label: "세금 영향", note: "실거주 세제" },
        { rank: 8, label: "전세대출 한도", note: "DSR 연동" },
        { rank: 9, label: "수도권만?", note: "시범 여부" },
        { rank: 10, label: "언제부터", note: "8월 중 발표" },
      ],
      photoKey: "contract",
      humorKey: "timely",
    },
  ],
  "아파트 브랜드": [
    {
      id: "top10-builder-newlywed",
      headline: "신혼부부\n물어보는 건설사",
      subheadline: "TOP10 · 상담·검색량",
      summary: "신혼·첫 아파트 상담에서 가장 많이 나오는 건설사·브랜드 순위 (하자·AS·프리미엄 믹스)",
      searchQueries: ["아파트 브랜드", "건설사 순위", "신혼 아파트"],
      items: [
        { rank: 1, label: "삼성물산", note: "브랜드·프리미엄" },
        { rank: 2, label: "현대건설", note: "역세권 강세" },
        { rank: 3, label: "GS건설", note: "디에이치" },
        { rank: 4, label: "포스코이앤씨", note: "더샵" },
        { rank: 5, label: "대림", note: "e편한세상" },
        { rank: 6, label: "HDC", note: "아이파크" },
        { rank: 7, label: "롯데", note: "캐슬" },
        { rank: 8, label: "한화", note: "포레나" },
        { rank: 9, label: "SK에코", note: "SK VIEW" },
        { rank: 10, label: "호반", note: "가성비" },
      ],
      photoKey: "construction",
      logoKeys: ["samsung", "hyundai", "gs", "posco"],
      humorKey: "brand",
    },
    {
      id: "top10-seongsu-brand",
      headline: "성수·한강\n브랜드 단지 TOP10",
      subheadline: "실거래·전세가율",
      summary: "성수·뚝섬·송파 접근권 — 30대 검색 많은 브랜드 단지 TOP10",
      searchQueries: ["성수 아파트", "브랜드 아파트", "실거래"],
      items: [
        { rank: 1, label: "래미안 옥수", note: "28억대" },
        { rank: 2, label: "자이 성수", note: "신축 프리미엄" },
        { rank: 3, label: "e편한세상 금호", note: "10억대" },
        { rank: 4, label: "힐스테이트", note: "한강뷰" },
        { rank: 5, label: "아크로", note: "고층 선호" },
        { rank: 6, label: "디에이치", note: "브랜드값" },
        { rank: 7, label: "더샵", note: "커뮤니티" },
        { rank: 8, label: "포레나", note: "신혼" },
        { rank: 9, label: "푸르지오", note: "가성비" },
        { rank: 10, label: "SK VIEW", note: "역세권" },
      ],
      photoKey: "seoulSkyline",
      humorKey: "top10",
    },
  ],
  "미분양·공급": [
    {
      id: "top10-unsold-region",
      headline: "악성 미분양\nTOP10 지역",
      subheadline: "준공 후 미분양 2.5만+",
      summary: "8월 국토부 — 지방 악성 미분양 2.5만가구 돌파. 지역별 TOP10 (분양·협상력 참고)",
      searchQueries: ["악성 미분양", "미분양 2026", "지방 미분양"],
      timely: "7.31 국토부 6월 통계",
      items: [
        { rank: 1, label: "경북", note: "준공 미분양↑" },
        { rank: 2, label: "전남", note: "공급 과잉" },
        { rank: 3, label: "충남", note: "신도시" },
        { rank: 4, label: "경남", note: "분양률↓" },
        { rank: 5, label: "전북", note: "입주 물량" },
        { rank: 6, label: "강원", note: "관광·이차" },
        { rank: 7, label: "충북", note: "청주" },
        { rank: 8, label: "제주", note: "외지 수요↓" },
        { rank: 9, label: "대구", note: "회복 지연" },
        { rank: 10, label: "부산", note: "해운대 제외" },
      ],
      photoKey: "construction",
      humorKey: "timely",
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

export function buildTop10Blueprint(category: Category, date: string): TopicBlueprint {
  const entry = pickTop10ForDay(category, date);
  const seed = hashDate(date + entry.id);
  const humor = pickHumor(entry.humorKey ?? "top10", seed);
  const photo = entry.photoKey ? PHOTOS[entry.photoKey] : PHOTOS.apartmentNight;

  return {
    id: entry.id,
    category,
    format: "single",
    summary: entry.summary + (entry.timely ? ` · ${entry.timely}` : ""),
    searchQueries: entry.searchQueries,
    buildSlides: () => [
      {
        layout: "photo-hook",
        headline: entry.headline,
        subheadline: entry.subheadline,
        coverImage: photo,
        logoImages: entry.logoKeys?.map((k) => BUILDER_LOGOS[k]),
        bestComment: humor.bestComment,
        reactionLine: humor.reactionLine,
        accent: "dark",
      },
      {
        layout: "top10",
        headline: entry.subheadline,
        subheadline: entry.timely,
        top10Items: entry.items,
        bestComment: humor.reactionLine,
        accent: "light",
      },
    ],
    buildCaption: () =>
      [
        entry.headline.replace("\n", " "),
        "",
        entry.summary,
        "",
        humor.bestComment ? `💬 "${humor.bestComment}"` : "",
        "",
        "TOP10 저장해두고 비교해보세요 👉",
      ]
        .filter(Boolean)
        .join("\n"),
  };
}
