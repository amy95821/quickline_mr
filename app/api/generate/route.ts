import { NextRequest, NextResponse } from "next/server";
import { generateContentFromSearch } from "@/app/lib/contentGenerator";
import { getSearchQueries } from "@/app/lib/searchConfig";
import type { Category, Region } from "@/app/lib/tierData";
import { CATEGORIES, REGIONS } from "@/app/lib/tierData";
import { webSearch } from "@/app/lib/webSearch";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      category?: Category;
      region?: Region;
      displayCount?: number;
      date?: string;
    };

    const category = body.category;
    const region = body.region;
    const displayCount = Math.min(
      15,
      Math.max(10, body.displayCount ?? 12),
    );

    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "유효하지 않은 카테고리입니다." },
        { status: 400 },
      );
    }

    if (category === "학군 티어" && region && !REGIONS.includes(region)) {
      return NextResponse.json(
        { error: "유효하지 않은 지역입니다." },
        { status: 400 },
      );
    }

    const queries = getSearchQueries(
      category,
      category === "학군 티어" ? region : undefined,
    );

    const searchResults = await webSearch(queries, displayCount + 5);

    if (searchResults.length < 5) {
      return NextResponse.json(
        {
          error:
            "웹 검색 결과가 부족합니다. 잠시 후 다시 시도하거나 SERPER_API_KEY를 설정해 주세요.",
        },
        { status: 502 },
      );
    }

    const content = generateContentFromSearch(
      category,
      searchResults,
      displayCount,
      category === "학군 티어" ? region : undefined,
    );

    return NextResponse.json({
      ...content,
      searchMeta: {
        queryCount: queries.length,
        resultCount: searchResults.length,
        searchedAt: new Date().toISOString(),
        date: body.date,
        source: process.env.SERPER_API_KEY
          ? "Serper + Google News RSS"
          : "Google News RSS",
      },
    });
  } catch (error) {
    console.error("[generate]", error);
    return NextResponse.json(
      { error: "콘텐츠 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
