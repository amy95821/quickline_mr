import { NextRequest, NextResponse } from "next/server";
import { suggestDailyTopics } from "@/app/lib/topicSuggester";
import type { Category, Region } from "@/app/lib/tierData";
import { CATEGORIES, REGIONS } from "@/app/lib/tierData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as Category | null;
    const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
    const region = searchParams.get("region") as Region | null;

    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "카테고리 오류" }, { status: 400 });
    }

    if (region && !REGIONS.includes(region)) {
      return NextResponse.json({ error: "지역 오류" }, { status: 400 });
    }

    const topics = await suggestDailyTopics(
      category,
      date,
      category === "학군 티어" ? (region ?? "서울") : undefined,
      5,
    );

    return NextResponse.json({
      date,
      category,
      region: region ?? null,
      topics,
      meta: {
        source: process.env.SERPER_API_KEY
          ? "Serper + Google News RSS"
          : "Google News RSS",
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[suggest-topics]", error);
    return NextResponse.json({ error: "주제 제안 실패" }, { status: 500 });
  }
}
