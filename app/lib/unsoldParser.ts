export interface UnsoldRow {
  region: string;
  district: string;
  unsoldUnits: number;
  totalUnits: number;
  unsoldRate: number;
}

export const MOCK_UNSOLD_ROWS: UnsoldRow[] = [
  { region: "경기", district: "화성시", unsoldUnits: 2841, totalUnits: 9200, unsoldRate: 30.9 },
  { region: "경기", district: "수원시", unsoldUnits: 892, totalUnits: 4100, unsoldRate: 21.8 },
  { region: "경기", district: "평택시", unsoldUnits: 756, totalUnits: 3800, unsoldRate: 19.9 },
  { region: "서울", district: "강서구", unsoldUnits: 124, totalUnits: 890, unsoldRate: 13.9 },
  { region: "서울", district: "송파구", unsoldUnits: 98, totalUnits: 720, unsoldRate: 13.6 },
  { region: "인천", district: "연수구", unsoldUnits: 412, totalUnits: 2100, unsoldRate: 19.6 },
  { region: "부산", district: "해운대구", unsoldUnits: 534, totalUnits: 2600, unsoldRate: 20.5 },
  { region: "대구", district: "수성구", unsoldUnits: 287, totalUnits: 1500, unsoldRate: 19.1 },
  { region: "경기", district: "김포시", unsoldUnits: 623, totalUnits: 3400, unsoldRate: 18.3 },
  { region: "서울", district: "노원구", unsoldUnits: 76, totalUnits: 580, unsoldRate: 13.1 },
];

export function analyzeUnsold(
  rows: UnsoldRow[],
  filterRegion?: string,
): { top: UnsoldRow[]; insight: string } {
  const filtered = filterRegion
    ? rows.filter(
        (r) =>
          r.region.includes(filterRegion) ||
          r.district.includes(filterRegion) ||
          filterRegion.includes(r.region),
      )
    : rows;

  const sorted = [...filtered].sort((a, b) => b.unsoldRate - a.unsoldRate);
  const top = sorted.slice(0, 3);

  const insight =
    top.length > 0
      ? `${top[0].district} 미분양률 ${top[0].unsoldRate.toFixed(1)}%로 가장 높습니다.`
      : "해당 지역 데이터가 없습니다.";

  return { top, insight };
}

export async function parseUnsoldExcel(file: File): Promise<UnsoldRow[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  const rows: UnsoldRow[] = [];

  for (const row of json) {
    const region = String(row["시도"] ?? row["지역"] ?? row["region"] ?? "").trim();
    const district = String(row["시군구"] ?? row["district"] ?? row["지구"] ?? "").trim();
    const unsold = Number(row["미분양"] ?? row["미분양호수"] ?? row["unsold"] ?? 0);
    const total = Number(row["전체"] ?? row["총분양"] ?? row["total"] ?? unsold * 3);
    if (!region && !district) continue;
    const rate = total > 0 ? (unsold / total) * 100 : Number(row["미분양률"] ?? 0);

    rows.push({
      region: region || "미상",
      district: district || region,
      unsoldUnits: unsold,
      totalUnits: total || unsold,
      unsoldRate: rate,
    });
  }

  return rows.length > 0 ? rows : MOCK_UNSOLD_ROWS;
}
