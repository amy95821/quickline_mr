import { NextRequest, NextResponse } from "next/server";
import { suggestDailyTopics } from "@/app/lib/topicSuggester";
import type { Category } from "@/app/lib/cardTypes";
import { CATEGORIES } from "@/app/lib/cardTypes";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as Category | null;
    const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "카테고리 오류" }, { status: 400 });
    }

    const topics = await suggestDailyTopics(category, date);
    return NextResponse.json({ date, category, topics });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "주제 제안 실패" }, { status: 500 });
  }
}
