"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Calendar,
  Copy,
  Download,
  Flame,
  Globe,
  Layers,
  Lightbulb,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";
import {
  BRIGHT_THEMES,
  PlayfulCard,
  type BrightTheme,
} from "./components/PlayfulCard";
import {
  CONTENT_TOPICS,
  getTopicsByCategory,
  type ContentTopic,
} from "./lib/contentTopics";
import {
  CATEGORIES,
  type Category,
  type CategoryContent,
} from "./lib/tierData";

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
  const [topicId, setTopicId] = useState<string>("apt-under-1b");
  const [displayCount, setDisplayCount] = useState<DisplayCount>(12);
  const [cardContent, setCardContent] = useState<
    Pick<
      CategoryContent,
      | "cardTag"
      | "cardTitle"
      | "cardSubtitle"
      | "rankedItems"
      | "mode"
    >
  >({
    cardTag: "",
    cardTitle: "",
    cardSubtitle: "",
    rankedItems: [],
    mode: "ranking",
  });
  const [topicSticker, setTopicSticker] = useState("✨");
  const [referenceArticles, setReferenceArticles] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [clipInfo, setClipInfo] = useState<{
    sources: CategoryContent["clipSources"];
    strategy: string;
  }>({ sources: [], strategy: "" });
  const [titleScale, setTitleScale] = useState(32);
  const [cardTheme, setCardTheme] = useState<BrightTheme>("peach");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [searchMeta, setSearchMeta] = useState("");

  const topicsForCategory = useMemo(
    () => getTopicsByCategory(category),
    [category],
  );

  const selectedTopic = useMemo(
    () => CONTENT_TOPICS.find((t) => t.id === topicId),
    [topicId],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const handleCategoryChange = (next: Category) => {
    setCategory(next);
    const topics = getTopicsByCategory(next);
    if (topics[0]) {
      setTopicId(topics[0].id);
      setDisplayCount(topics[0].defaultCount);
      setTopicSticker(topics[0].sticker);
    }
    setHasGenerated(false);
  };

  const handleTopicChange = (id: string) => {
    setTopicId(id);
    const topic = CONTENT_TOPICS.find((t) => t.id === id);
    if (topic) {
      setDisplayCount(topic.defaultCount);
      setTopicSticker(topic.sticker);
    }
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
    setClipInfo({ sources: data.clipSources, strategy: data.clipStrategy });
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, displayCount, date: selectedDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "생성 실패");
        return;
      }
      applyContent(data as CategoryContent);
      setHasGenerated(true);
      setSearchMeta(
        `${data.searchMeta?.source ?? "웹 검색"} · ${data.searchMeta?.resultCount ?? 0}건`,
      );
      showToast(`「${data.topicTitle}」 생성 완료!`);
    } catch {
      showToast("웹 검색 중 오류");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatMessages((p) => [...p, { role: "user", text: trimmed }]);
    const lower = trimmed.toLowerCase();
    const themes: BrightTheme[] = ["peach", "mint", "lemon", "sky"];

    if (lower.includes("배경") || lower.includes("색")) {
      const next = themes[(themes.indexOf(cardTheme) + 1) % themes.length];
      setCardTheme(next);
      setChatMessages((m) => [
        ...m,
        { role: "assistant", text: `배경 → ${BRIGHT_THEMES[next].label}` },
      ]);
    } else if (lower.includes("15")) setDisplayCount(15);
    else if (lower.includes("10")) setDisplayCount(10);
    else {
      setChatMessages((m) => [
        ...m,
        { role: "assistant", text: "반영했어요! '배경색 바꿔줘'도 해보세요" },
      ]);
    }
    setChatInput("");
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `quickline-${topicId}-top${displayCount}.png`;
      link.href = dataUrl;
      link.click();
      showToast("PNG 다운로드 완료!");
    } catch {
      showToast("다운로드 오류");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} 복사 완료!`);
    } catch {
      showToast("복사 실패");
    }
  };

  const theme = BRIGHT_THEMES[cardTheme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-sky-50 text-zinc-800">
      <header className="border-b border-orange-100 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl tracking-tight">
              모래네 용돈벌어주는 SNS콘텐츠 만들기 🎨
            </h1>
            <p className="text-sm text-zinc-500">
              주제 기반 TOP 10~15 · 웹 검색 · 장난스러운 SNS 카드
            </p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-normal text-orange-700">
            {BRAND_HANDLE}
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-5">
          <Panel>
            <Label icon={<Calendar className="h-4 w-4" />}>날짜</Label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border-2 border-orange-100 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
            />
            <p className="mt-1 text-xs text-zinc-400">
              {formatDisplayDate(selectedDate)}
            </p>
          </Panel>

          <Panel>
            <Label>카테고리</Label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as Category)}
              className="w-full rounded-xl border-2 border-orange-100 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Panel>

          <Panel highlight>
            <Label icon={<Lightbulb className="h-4 w-4" />}>
              콘텐츠 주제 ⭐
            </Label>
            <p className="mb-2 text-xs text-orange-700/70">
              기사 순위가 아니라, 이 주제에 맞는 항목을 웹 검색으로
              뽑아요!
            </p>
            <div className="space-y-2">
              {topicsForCategory.map((topic: ContentTopic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleTopicChange(topic.id)}
                  className={`w-full rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${
                    topicId === topic.id
                      ? "border-orange-400 bg-orange-50"
                      : "border-orange-100 hover:bg-orange-50/50"
                  }`}
                >
                  <span className="mr-2">{topic.emoji}</span>
                  {topic.title}
                  {topic.mode === "comment-pick" && (
                    <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-red-600">
                      🔥 핫댓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Panel>

          <Panel>
            <Label icon={<Layers className="h-4 w-4" />}>표시 개수</Label>
            <div className="flex gap-2">
              {DISPLAY_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDisplayCount(n)}
                  className={`flex-1 rounded-xl border-2 py-2 text-sm transition ${
                    displayCount === n
                      ? "border-orange-400 bg-orange-400 text-white"
                      : "border-orange-100 text-zinc-600"
                  }`}
                >
                  TOP {n}
                </button>
              ))}
            </div>
          </Panel>

          {selectedTopic && (
            <Panel blue>
              <Label icon={<Globe className="h-4 w-4" />}>웹 검색</Label>
              <p className="mb-2 text-xs leading-relaxed text-blue-800/80">
                {selectedTopic.clipStrategy}
              </p>
              {selectedTopic.searchQueries.map((q) => (
                <div
                  key={q}
                  className="mb-1 rounded-lg bg-white/80 px-3 py-1.5 text-xs"
                >
                  🔍 {q}
                </div>
              ))}
              {searchMeta && (
                <p className="mt-2 text-[10px] text-green-700">✓ {searchMeta}</p>
              )}
            </Panel>
          )}

          <Panel>
            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-white shadow-md transition hover:bg-orange-600 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating
                ? "웹 검색 & 생성 중..."
                : `「${selectedTopic?.title ?? ""}」 만들기`}
            </button>
          </Panel>

          {referenceArticles.length > 0 && (
            <Panel>
              <Label>참고 기사 (출처)</Label>
              <ul className="space-y-1.5">
                {referenceArticles.map((a) => (
                  <li
                    key={a}
                    className="rounded-lg bg-orange-50/50 px-2 py-1.5 text-xs text-zinc-600"
                  >
                    📰 {a}
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel>
            <Label icon={<MessageSquare className="h-4 w-4" />}>
              AI 피드백
            </Label>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="배경색 바꿔줘..."
                className="flex-1 rounded-xl border-2 border-orange-100 px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-zinc-800 px-3 py-2 text-white"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </Panel>
        </section>

        <section className="space-y-4 lg:col-span-7">
          <Panel>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <label className="text-xs text-zinc-500">제목 크기</label>
              <input
                type="range"
                min={24}
                max={40}
                value={titleScale}
                onChange={(e) => setTitleScale(Number(e.target.value))}
                className="flex-1 accent-orange-500"
              />
              <div className="flex gap-1.5">
                {(Object.keys(BRIGHT_THEMES) as BrightTheme[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCardTheme(key)}
                    className={`rounded-lg border-2 px-2.5 py-1 text-xs ${
                      cardTheme === key
                        ? "border-orange-400 bg-orange-50"
                        : "border-orange-100"
                    }`}
                  >
                    {BRIGHT_THEMES[key].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-md overflow-hidden rounded-3xl shadow-xl ring-4 ring-orange-100">
              <div ref={cardRef}>
                {hasGenerated ? (
                  <PlayfulCard
                    tag={cardContent.cardTag}
                    title={cardContent.cardTitle}
                    subtitle={cardContent.cardSubtitle}
                    items={cardContent.rankedItems}
                    theme={theme}
                    titleScale={titleScale}
                    displayCount={displayCount}
                    mode={cardContent.mode}
                    brandHandle={BRAND_HANDLE}
                    topicSticker={topicSticker}
                  />
                ) : (
                  <div
                    className="flex aspect-square flex-col items-center justify-center px-8"
                    style={{
                      background:
                        "linear-gradient(145deg, #FFF0EB, #FFD6CC, #FFE8B8)",
                    }}
                  >
                    <p className="text-center text-lg">🎨</p>
                    <p className="mt-2 text-center text-sm text-orange-800/70">
                      주제를 고르고
                      <br />
                      <span className="text-orange-600">웹 검색</span>으로
                      만들어 보세요!
                    </p>
                    {category === "댓글 핫픽" && (
                      <p className="mt-3 flex items-center gap-1 text-xs text-red-500">
                        <Flame className="h-3 w-3" />
                        자극·공감 댓글 스타일
                      </p>
                    )}
                    <p className="mt-4 text-xs text-orange-400">
                      {BRAND_HANDLE}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={!hasGenerated || isDownloading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-orange-200 bg-white py-2.5 text-sm transition hover:bg-orange-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "다운로드 중..." : "인스타 PNG 다운로드"}
            </button>
          </Panel>

          <Panel>
            <CopyHeader
              label="피드 본문"
              onCopy={() => handleCopy(caption, "본문")}
              disabled={!hasGenerated}
            />
            <textarea
              readOnly
              value={hasGenerated ? caption : "주제 선택 후 생성해 주세요."}
              rows={12}
              className="w-full resize-none rounded-xl border-2 border-orange-100 bg-orange-50/30 px-3 py-2 text-sm leading-relaxed focus:outline-none"
            />
          </Panel>

          <Panel>
            <CopyHeader
              label="해시태그"
              onCopy={() => handleCopy(hashtags.join(" "), "해시태그")}
              disabled={!hasGenerated}
            />
            <div className="rounded-xl border-2 border-orange-100 bg-orange-50/30 px-3 py-2 text-sm text-blue-600">
              {hasGenerated ? hashtags.join(" ") : "—"}
            </div>
          </Panel>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-orange-500 px-5 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function Panel({
  children,
  highlight,
  blue,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  blue?: boolean;
}) {
  const cls = blue
    ? "border-blue-100 bg-blue-50/50"
    : highlight
      ? "border-orange-200 bg-orange-50/30"
      : "border-orange-100 bg-white/80";
  return (
    <div className={`rounded-2xl border-2 ${cls} p-4 shadow-sm backdrop-blur`}>
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
    <div className="mb-2 flex items-center gap-2 text-sm text-zinc-700">
      {icon}
      {children}
    </div>
  );
}

function CopyHeader({
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
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={onCopy}
        disabled={disabled}
        className="flex items-center gap-1 rounded-lg border-2 border-orange-100 px-3 py-1 text-xs disabled:opacity-50"
      >
        <Copy className="h-3.5 w-3.5" />
        복사
      </button>
    </div>
  );
}
