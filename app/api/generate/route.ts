import { NextRequest, NextResponse } from "next/server";
import { generateFromTopic } from "@/app/lib/contentGenerator";
import type { SuggestedTopic } from "@/app/lib/topicSuggester";
import { webSearch } from "@/app/lib/webSearch";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      topic?: SuggestedTopic;
      date?: string;
    };

    const topic = body.topic;
    const date = body.date ?? new Date().toISOString().split("T")[0];

    if (!topic?.id || !topic.template) {
      return NextResponse.json({ error: "주제를 선택하세요." }, { status: 400 });
    }

    const results = await webSearch(topic.searchQueries, 12);
    const content = generateFromTopic(topic, results, date);

    return NextResponse.json(content);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "생성 오류" }, { status: 500 });
  }
}
