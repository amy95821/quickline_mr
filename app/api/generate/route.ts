import { NextRequest, NextResponse } from "next/server";
import { generateContentFromTopic } from "@/app/lib/contentGenerator";
import type { SuggestedTopic } from "@/app/lib/topicSuggester";
import type { Region } from "@/app/lib/tierData";
import { webSearch } from "@/app/lib/webSearch";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      topic?: SuggestedTopic;
      displayCount?: number;
      region?: Region;
    };

    const topic = body.topic;
    const displayCount = Math.min(15, Math.max(10, body.displayCount ?? 12));

    if (!topic?.id || !topic.title || !topic.searchQueries?.length) {
      return NextResponse.json(
        { error: "콘텐츠 주제를 선택해 주세요." },
        { status: 400 },
      );
    }

    const searchResults = await webSearch(topic.searchQueries, displayCount + 8);

    if (searchResults.length < 5) {
      return NextResponse.json(
        { error: "웹 검색 결과 부족. 잠시 후 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    const content = generateContentFromTopic(
      topic,
      searchResults,
      displayCount,
      body.region,
    );

    return NextResponse.json({
      ...content,
      searchMeta: {
        topicId: topic.id,
        topicTitle: topic.title,
        resultCount: searchResults.length,
        mode: topic.mode,
      },
    });
  } catch (error) {
    console.error("[generate]", error);
    return NextResponse.json({ error: "생성 오류" }, { status: 500 });
  }
}
