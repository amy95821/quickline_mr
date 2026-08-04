/**
 * 국토교통부·공공데이터 API 연동 가이드
 *
 * 엑셀 수동 업로드 대신 API로 끌어올 수 있는지 — 가능하지만 별도 인증·파싱 필요.
 */

export interface PublicDataApiInfo {
  name: string;
  portal: string;
  endpoint: string;
  auth: string;
  format: string;
  notes: string;
}

/** 미분양·실거래 등 주요 공공 API (data.go.kr) */
export const PUBLIC_DATA_APIS: PublicDataApiInfo[] = [
  {
    name: "미분양 주택현황",
    portal: "https://www.data.go.kr",
    endpoint: "국토교통부_미분양주택현황",
    auth: "공공데이터포털 API 키 (Encoding/Decoding 키)",
    format: "JSON / XML (엑셀 다운로드와 동일 원천)",
    notes:
      "월별·지역별 미분양 호수·미분양률. 엑셀 공시 파일과 동일 통계. serviceKey 쿼리 파라미터 필요.",
  },
  {
    name: "아파트 실거래가",
    portal: "https://www.data.go.kr",
    endpoint: "국토교통부_아파트매매 실거래자료",
    auth: "공공데이터포털 API 키",
    format: "JSON / XML",
    notes: "법정동코드·계약월 기준 조회. TOP10·랭킹 카드 데이터 소스로 활용 가능.",
  },
  {
    name: "전월세 실거래",
    portal: "https://www.data.go.kr",
    endpoint: "국토교통부_아파트 전월세 실거래자료",
    auth: "공공데이터포털 API 키",
    format: "JSON / XML",
    notes: "월세 52% 등 임대 통계 검증용.",
  },
];

/**
 * API 직접 호출 예시 (서버 Route Handler에서 사용)
 *
 * ```ts
 * // app/api/unsold/route.ts
 * const key = process.env.DATA_GO_KR_SERVICE_KEY;
 * const url = `http://apis.data.go.kr/1613000/UnsoldHouseStatsService/getUnsoldHouseStats?serviceKey=${key}&pageNo=1&numOfRows=100&lawdCd=41&dealYmd=202607`;
 * const res = await fetch(url);
 * ```
 *
 * 제약:
 * - CORS: 브라우저 직접 호출 불가 → Next.js API Route 또는 Server Action 필요
 * - rate limit: 일 1000건 등 (키별 상이)
 * - 응답 스키마가 엑셀 컬럼과 1:1 아님 → unsoldParser.ts와 유사한 정규화 레이어 필요
 * - API 키는 .env.local에 DATA_GO_KR_SERVICE_KEY 로 보관 (커밋 금지)
 */

export type UnsoldApiStatus = "not_configured" | "ready" | "error";

export function getUnsoldApiStatus(): UnsoldApiStatus {
  if (typeof process !== "undefined" && process.env?.DATA_GO_KR_SERVICE_KEY) {
    return "ready";
  }
  return "not_configured";
}
