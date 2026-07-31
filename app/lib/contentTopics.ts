import type { Category } from "./tierData";

export type TopicMode = "ranking" | "comment-pick";

export interface ContentTopic {
  id: string;
  category: Category;
  title: string;
  subtitleTemplate: string;
  tag: string;
  emoji: string;
  sticker: string;
  defaultCount: 10 | 12 | 15;
  searchQueries: string[];
  hashtags: string[];
  mode: TopicMode;
  clipStrategy: string;
}

export const CONTENT_TOPICS: ContentTopic[] = [
  // ── 부동산 주제 ──
  {
    id: "apt-under-1b",
    category: "부동산",
    title: "10억 미만 우상향 아파트",
    subtitleTemplate: "초심자 입문 TOP {n}",
    tag: "입문",
    emoji: "🏠",
    sticker: "✨",
    defaultCount: 12,
    searchQueries: [
      "10억 미만 아파트 추천 2026",
      "자산가치 상승 아파트 10억 이하",
      "부동산 초보 추천 단지",
    ],
    hashtags: ["#10억미만", "#아파트추천", "#부동산초보", "#quickline_mr"],
    mode: "ranking",
    clipStrategy:
      "웹 검색으로 10억 미만·우상향 단지명·지역명 추출 → 초심자 관점 TOP N",
  },
  {
    id: "newlywed-gyeonggi",
    category: "부동산",
    title: "신혼부부 임장 핫동네",
    subtitleTemplate: "경기 TOP {n}",
    tag: "신혼",
    emoji: "💍",
    sticker: "👀",
    defaultCount: 10,
    searchQueries: [
      "신혼부부 임장 경기 추천",
      "경기 신혼집 추천 동네",
      "경기 아파트 신혼부부 인기",
    ],
    hashtags: ["#신혼부부", "#임장", "#경기아파트", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 경기권 신혼·임장 인기 동네·단지명 추출 TOP N",
  },
  {
    id: "first-cheongyak",
    category: "부동산",
    title: "청약 초보 접근성 TOP",
    subtitleTemplate: "무주택 30대 TOP {n}",
    tag: "청약",
    emoji: "📝",
    sticker: "🎯",
    defaultCount: 12,
    searchQueries: [
      "청약 초보 추천 단지 2026",
      "30대 청약 가점 좋은 단지",
      "무주택 청약 접근성",
    ],
    hashtags: ["#청약", "#무주택", "#30대", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 청약 접근성 좋은 단지·지역명 추출 TOP N",
  },
  {
    id: "gap-invest",
    category: "부동산",
    title: "갭투자 가능 전세가율",
    subtitleTemplate: "70% 이상 단지 TOP {n}",
    tag: "갭투자",
    emoji: "📈",
    sticker: "💸",
    defaultCount: 12,
    searchQueries: [
      "전세가율 70% 아파트",
      "갭투자 가능 단지 2026",
      "전세가율 높은 아파트",
    ],
    hashtags: ["#갭투자", "#전세가율", "#부동산", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 전세가율·갭투자 언급 단지명 추출 TOP N",
  },
  {
    id: "jeonse-hot",
    category: "부동산",
    title: "전세 살기 좋은 동네",
    subtitleTemplate: "30대 전세 TOP {n}",
    tag: "전세",
    emoji: "🔑",
    sticker: "🏘️",
    defaultCount: 10,
    searchQueries: [
      "30대 전세 추천 동네",
      "전세 살기 좋은 아파트 2026",
      "전세 가성비 좋은 지역",
    ],
    hashtags: ["#전세", "#전월세", "#30대", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 전세 수요 높은 동네·단지 추출 TOP N",
  },

  // ── 재테크·경제 주제 ──
  {
    id: "genz-100m-keywords",
    category: "경제·재테크",
    title: "자산 1억+ 20대",
    subtitleTemplate: "검색 키워드 TOP {n}",
    tag: "20대",
    emoji: "🔍",
    sticker: "💰",
    defaultCount: 15,
    searchQueries: [
      "20대 재테크 트렌드 2026",
      "MZ세대 투자 키워드",
      "20대 자산관리 검색",
    ],
    hashtags: ["#20대", "#MZ", "#재테크", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 20대·MZ 재테크 키워드·트렌드 추출 TOP N",
  },
  {
    id: "no-spend-challenge",
    category: "경제·재테크",
    title: "무지출 챌린지",
    subtitleTemplate: "30대 핫키워드 TOP {n}",
    tag: "절약",
    emoji: "🐷",
    sticker: "🔥",
    defaultCount: 12,
    searchQueries: [
      "무지출 챌린지 30대",
      "직장인 절약 트렌드",
      "돈 모으기 방법 MZ",
    ],
    hashtags: ["#무지출챌린지", "#절약", "#30대", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 절약·무지출 관련 키워드·방법 추출 TOP N",
  },
  {
    id: "side-hustle",
    category: "경제·재테크",
    title: "N잡·부업 트렌드",
    subtitleTemplate: "30대 부업 TOP {n}",
    tag: "부업",
    emoji: "💼",
    sticker: "⚡",
    defaultCount: 12,
    searchQueries: [
      "30대 N잡 부업 추천 2026",
      "직장인 부업 트렌드",
      "MZ 부수입 방법",
    ],
    hashtags: ["#N잡", "#부업", "#30대", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → N잡·부업 키워드·방법 추출 TOP N",
  },

  // ── 아파트 브랜드 ──
  {
    id: "brand-beginner",
    category: "아파트 브랜드",
    title: "초보가 사기 좋은 브랜드",
    subtitleTemplate: "가성비 브랜드 TOP {n}",
    tag: "브랜드",
    emoji: "🏢",
    sticker: "👍",
    defaultCount: 12,
    searchQueries: [
      "아파트 브랜드 초보 추천",
      "가성비 좋은 아파트 브랜드",
      "아파트 브랜드 순위 2026",
    ],
    hashtags: ["#아파트브랜드", "#브랜드티어", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 브랜드명 추출 + 인지도 순 TOP N",
  },

  // ── 서울 집값 ──
  {
    id: "seoul-value-up",
    category: "서울 집값",
    title: "올해 상승률 TOP",
    subtitleTemplate: "서울 구별 TOP {n}",
    tag: "서울",
    emoji: "🏆",
    sticker: "📊",
    defaultCount: 12,
    searchQueries: [
      "서울 아파트 상승률 2026",
      "서울 집값 오른 구",
      "서울 실거래가 상승",
    ],
    hashtags: ["#서울집값", "#실거래", "#quickline_mr"],
    mode: "ranking",
    clipStrategy: "웹 검색 → 서울 구·동 이름 + 상승 키워드 추출 TOP N",
  },

  // ── 댓글 핫픽 (각 분야별) ──
  {
    id: "comment-realestate",
    category: "댓글 핫픽",
    title: "부동산 댓글 핫픽",
    subtitleTemplate: "자극·공감 TOP {n}",
    tag: "핫댓",
    emoji: "🔥",
    sticker: "💬",
    defaultCount: 12,
    searchQueries: [
      "부동산 댓글 반응 논란",
      "아파트 디시 갤러리 화제",
      "부동산 커뮤니티 베스트",
    ],
    hashtags: ["#부동산", "#핫댓", "#공감", "#quickline_mr"],
    mode: "comment-pick",
    clipStrategy:
      "웹 검색 → 부동산 기사 중 논란·공감·반응 큰 이슈 → 자극적 한 줄로 재구성",
  },
  {
    id: "comment-economy",
    category: "댓글 핫픽",
    title: "경제·재테크 핫픽",
    subtitleTemplate: "자극·공감 TOP {n}",
    tag: "핫댓",
    emoji: "🔥",
    sticker: "💬",
    defaultCount: 12,
    searchQueries: [
      "재테크 댓글 반응",
      "경제 논란 커뮤니티",
      "투자 디시 화제",
    ],
    hashtags: ["#재테크", "#핫댓", "#경제", "#quickline_mr"],
    mode: "comment-pick",
    clipStrategy:
      "웹 검색 → 경제·재테크 논란 기사 → 댓글 반응 많을 법한 자극적 한 줄 재구성",
  },
  {
    id: "comment-politics",
    category: "댓글 핫픽",
    title: "정치·정책 핫픽",
    subtitleTemplate: "자극·공감 TOP {n}",
    tag: "핫댓",
    emoji: "🔥",
    sticker: "💬",
    defaultCount: 10,
    searchQueries: [
      "부동산 정책 댓글 반응",
      "청년 정책 논란",
      "세금 정책 커뮤니티 반응",
    ],
    hashtags: ["#정치", "#정책", "#핫댓", "#quickline_mr"],
    mode: "comment-pick",
    clipStrategy:
      "웹 검색 → 정책·정치 논란 기사 → 자극적·공감형 한 줄 재구성",
  },
];

export function getTopicsByCategory(category: Category): ContentTopic[] {
  return CONTENT_TOPICS.filter((t) => t.category === category);
}

export function getTopicById(id: string): ContentTopic | undefined {
  return CONTENT_TOPICS.find((t) => t.id === id);
}

export const TOPIC_CATEGORIES = [
  ...new Set(CONTENT_TOPICS.map((t) => t.category)),
] as Category[];
