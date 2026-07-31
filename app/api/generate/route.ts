import { NextRequest, NextResponse } from "next/server";
import { generateContentFromTopic } from "@/app/lib/contentGenerator";
import { getTopicById } from "@/app/lib/contentTopics";
import { webSearch } from "@/app/lib/webSearch";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      topicId?: string;
      displayCount?: number;
      date?: string;
    };

    const topicId = body.topicId;
    const displayCount = Math.min(
      15,
      Math.max(10, body.displayCount ?? 12),
    );

    if (!topicId) {
      return NextResponse.json(
        { error: "콘텐츠 주제를 선택해 주세요." },
        { status: 400 },
      );
    }

    const topic = getTopicById(topicId);
    if (!topic) {
      return NextResponse.json(
        { error: "유효하지 않은 주제입니다." },
        { status: 400 },
      );
    }

    const searchResults = await webSearch(
      topic.searchQueries,
      displayCount + 8,
    );

    if (searchResults.length < 5) {
      return NextResponse.json(
        {
          error:
            "웹 검색 결과가 부족합니다. 잠시 후 다시 시도해 주세요.",
        },
        { status: 502 },
      );
    }

    const content = generateContentFromTopic(
      topic,
      searchResults,
      displayCount,
    );

    return NextResponse.json({
      ...content,
      searchMeta: {
        topicId: topic.id,
        topicTitle: topic.title,
        queryCount: topic.searchQueries.length,
        resultCount: searchResults.length,
        searchedAt: new Date().toISOString(),
        date: body.date,
        mode: topic.mode,
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
