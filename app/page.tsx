"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Calendar,
  Copy,
  Download,
  Globe,
  Layers,
  Lightbulb,
  MapPin,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import { CARD_THEMES, SnCard, type CardTheme } from "./components/SnCard";
import {
  CATEGORIES,
  REGIONS,
  type Category,
  type CategoryContent,
  type Region,
} from "./lib/tierData";
import type { SuggestedTopic } from "./lib/topicSuggester";

const BRAND_HANDLE = "@quickline_mr";
const DISPLAY_COUNTS = [10, 12, 15] as const;
type DisplayCount = (typeof DISPLAY_COUNTS)[number];

function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateInput(new Date()),
  );
  const [category, setCategory] = useState<Category>("부동산");
  const [region, setRegion] = useState<Region>("서울");
  const [displayCount, setDisplayCount] = useState<DisplayCount>(12);
  const [suggestedTopics, setSuggestedTopics] = useState<SuggestedTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<SuggestedTopic | null>(
    null,
  );
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [cardContent, setCardContent] = useState<
    Pick<
      CategoryContent,
      "cardTag" | "cardTitle" | "cardSubtitle" | "rankedItems" | "mode"
    >
  >({
    cardTag: "",
    cardTitle: "",
    cardSubtitle: "",
    rankedItems: [],
    mode: "ranking",
  });
  const [referenceArticles, setReferenceArticles] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [titleScale, setTitleScale] = useState(32);
  const [cardTheme, setCardTheme] = useState<CardTheme>("cream");
  const [chatInput, setChatInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [searchMeta, setSearchMeta] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const fetchTopicSuggestions = useCallback(async () => {
    setIsLoadingTopics(true);
    setHasGenerated(false);
    try {
      const params = new URLSearchParams({
        category,
        date: selectedDate,
      });
      if (category === "학군 티어") params.set("region", region);

      const res = await fetch(`/api/suggest-topics?${params}`);
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "주제 제안 실패");
        return;
      }
      setSuggestedTopics(data.topics);
      if (data.topics[0]) {
        setSelectedTopic(data.topics[0]);
        setDisplayCount(data.topics[0].defaultCount);
      }
    } catch {
      showToast("주제 불러오기 오류");
    } finally {
      setIsLoadingTopics(false);
    }
  }, [category, selectedDate, region, showToast]);

  useEffect(() => {
    void fetchTopicSuggestions();
  }, [fetchTopicSuggestions]);

  const handleCategoryChange = (next: Category) => {
    setCategory(next);
    setHasGenerated(false);
  };

  const handleSelectTopic = (topic: SuggestedTopic) => {
    setSelectedTopic(topic);
    setDisplayCount(topic.defaultCount);
    setHasGenerated(false);
  };

  const applyContent = useCallback((data: CategoryContent) => {
    setCardContent({
      cardTag: data.cardTag,
      cardTitle: data.cardTitle,
      cardSubtitle: data.cardSubtitle,
      rankedItems: data.rankedItems,
      mode: data.mode,
    });
    setCaption(data.caption);
    setHashtags(data.hashtags);
    setReferenceArticles(data.headlines);
  }, []);

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          displayCount,
          region: category === "학군 티어" ? region : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "생성 실패");
        return;
      }
      applyContent(data as CategoryContent);
      setHasGenerated(true);
      setSearchMeta(`${data.searchMeta?.resultCount ?? 0}건 수집`);
      showToast("생성 완료");
    } catch {
      showToast("생성 오류");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const a = document.createElement("a");
      a.download = `quickline-${selectedDate}.png`;
      a.href = dataUrl;
      a.click();
      showToast("PNG 저장 완료");
    } catch {
      showToast("다운로드 오류");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} 복사 완료`);
    } catch {
      showToast("복사 실패");
    }
  };

  const theme = CARD_THEMES[cardTheme];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">
              모래네 용돈벌어주는 SNS콘텐츠 만들기
            </h1>
            <p className="text-sm text-stone-500">
              매일 다른 주제 제안 · 웹 트렌드 기반 · 손글씨 SNS 카드
            </p>
          </div>
          <span className="text-xs text-stone-400">{BRAND_HANDLE}</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 p-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-5">
          <Panel>
            <Label icon={<Calendar className="h-4 w-4" />}>날짜</Label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-stone-400">
              {formatDisplayDate(selectedDate)} · 날짜마다 주제가 달라집니다
            </p>
          </Panel>

          <Panel>
            <Label>카테고리</Label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as Category)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Panel>

          {category === "학군 티어" && (
            <Panel>
              <Label icon={<MapPin className="h-4 w-4" />}>지역</Label>
              <div className="flex gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`flex-1 rounded-lg border py-2 text-sm ${
                      region === r
                        ? "border-stone-800 bg-stone-800 text-white"
                        : "border-stone-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Panel>
          )}

          <Panel accent>
            <div className="mb-2 flex items-center justify-between">
              <Label icon={<Lightbulb className="h-4 w-4" />}>
                오늘의 주제 제안
              </Label>
              <button
                type="button"
                onClick={() => void fetchTopicSuggestions()}
                disabled={isLoadingTopics}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isLoadingTopics ? "animate-spin" : ""}`}
                />
                새로고침
              </button>
            </div>
            <p className="mb-3 text-xs text-stone-500">
              인스타·웹 트렌드를 검색해 매일 다른 주제 5개를 제안합니다.
            </p>
            {isLoadingTopics ? (
              <p className="py-4 text-center text-sm text-stone-400">
                트렌드 분석 중…
              </p>
            ) : (
              <div className="space-y-2">
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                      selectedTopic?.id === topic.id
                        ? "border-stone-800 bg-stone-50"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <p className="text-sm font-medium">{topic.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-stone-400">
                      {topic.reason}
                    </p>
                    {topic.mode === "editorial" && (
                      <span className="mt-1 inline-block text-[10px] text-stone-500">
                        논점형 콘텐츠
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel>
            <Label icon={<Layers className="h-4 w-4" />}>표시 개수</Label>
            <div className="flex gap-2">
              {DISPLAY_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDisplayCount(n)}
                  className={`flex-1 rounded-lg border py-2 text-sm ${
                    displayCount === n
                      ? "border-stone-800 bg-stone-800 text-white"
                      : "border-stone-200"
                  }`}
                >
                  TOP {n}
                </button>
              ))}
            </div>
          </Panel>

          {selectedTopic && (
            <Panel>
              <Label icon={<Globe className="h-4 w-4" />}>검색 키워드</Label>
              {selectedTopic.searchQueries.map((q) => (
                <p key={q} className="text-xs text-stone-500">
                  {q}
                </p>
              ))}
              {searchMeta && (
                <p className="mt-2 text-xs text-green-700">{searchMeta}</p>
              )}
            </Panel>
          )}

          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={isGenerating || !selectedTopic}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-800 py-3 text-sm text-white disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "생성 중…" : "콘텐츠 만들기"}
          </button>

          {referenceArticles.length > 0 && (
            <Panel>
              <Label>참고 출처</Label>
              {referenceArticles.map((a) => (
                <p key={a} className="text-xs text-stone-400">
                  {a}
                </p>
              ))}
            </Panel>
          )}
        </section>

        <section className="space-y-4 lg:col-span-7">
          <Panel>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-xs text-stone-500">제목 크기</span>
              <input
                type="range"
                min={24}
                max={40}
                value={titleScale}
                onChange={(e) => setTitleScale(Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex gap-1">
                {(Object.keys(CARD_THEMES) as CardTheme[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCardTheme(k)}
                    className={`rounded border px-2 py-1 text-xs ${
                      cardTheme === k ? "border-stone-800" : "border-stone-200"
                    }`}
                  >
                    {CARD_THEMES[k].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-stone-200 shadow-md">
              <div ref={cardRef}>
                {hasGenerated ? (
                  <SnCard
                    tag={cardContent.cardTag}
                    title={cardContent.cardTitle}
                    subtitle={cardContent.cardSubtitle}
                    items={cardContent.rankedItems}
                    theme={theme}
                    titleScale={titleScale}
                    displayCount={displayCount}
                    mode={cardContent.mode}
                    brandHandle={BRAND_HANDLE}
                  />
                ) : (
                  <div
                    className="flex aspect-square items-center justify-center bg-[#FAF7F2] px-8 text-center text-sm text-stone-400"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #E8E2DA 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  >
                    주제를 선택하고
                    <br />
                    콘텐츠를 만들어 보세요
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={!hasGenerated || isDownloading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-stone-200 py-2.5 text-sm disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              PNG 다운로드
            </button>
          </Panel>

          <Panel>
            <RowCopy
              label="피드 본문"
              onCopy={() => handleCopy(caption, "본문")}
              disabled={!hasGenerated}
            />
            <textarea
              readOnly
              rows={12}
              value={hasGenerated ? caption : ""}
              placeholder="생성 후 표시"
              className="w-full resize-none rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm"
            />
          </Panel>

          <Panel>
            <RowCopy
              label="해시태그"
              onCopy={() => handleCopy(hashtags.join(" "), "해시태그")}
              disabled={!hasGenerated}
            />
            <p className="rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-blue-700">
              {hasGenerated ? hashtags.join(" ") : "—"}
            </p>
          </Panel>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-800 px-5 py-2 text-sm text-white">
          {toast}
        </div>
      )}
    </div>
  );
}

function Panel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${accent ? "border-stone-300 bg-white" : "border-stone-200 bg-white"}`}
    >
      {children}
    </div>
  );
}

function Label({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
      {icon}
      {children}
    </div>
  );
}

function RowCopy({
  label,
  onCopy,
  disabled,
}: {
  label: string;
  onCopy: () => void;
  disabled: boolean;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={onCopy}
        disabled={disabled}
        className="flex items-center gap-1 text-xs text-stone-500 disabled:opacity-40"
      >
        <Copy className="h-3.5 w-3.5" />
        복사
      </button>
    </div>
  );
}
