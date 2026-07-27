"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Calendar,
  Copy,
  Download,
  Globe,
  Layers,
  MapPin,
  MessageSquare,
  Newspaper,
  Send,
  Sparkles,
} from "lucide-react";
import {
  CATEGORIES,
  REGIONS,
  TIER_COLORS,
  TIER_EMOJI,
  type Category,
  type CategoryContent,
  type RankedItem,
  type Region,
  type TierGrade,
} from "./lib/tierData";
import {
  getSearchProfile,
  getSearchQueries,
} from "./lib/searchConfig";

const BRAND_HANDLE = "@quickline_mr";

type CardTheme = "dark" | "navy" | "warm";

const CARD_THEMES: Record<
  CardTheme,
  { label: string; bg: string; card: string; accent: string }
> = {
  dark: { label: "다크", bg: "#1c1c1e", card: "#2c2c2e", accent: "#f97316" },
  navy: { label: "네이비", bg: "#0f172a", card: "#1e293b", accent: "#fb923c" },
  warm: { label: "웜톤", bg: "#292524", card: "#44403c", accent: "#fbbf24" },
};

const DISPLAY_COUNTS = [10, 12, 15] as const;
type DisplayCount = (typeof DISPLAY_COUNTS)[number];

function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function getRankBadgeStyle(rank: number): string {
  if (rank <= 3) return "bg-orange-500 text-white";
  if (rank <= 7) return "bg-cyan-500/20 text-cyan-300";
  return "bg-zinc-600/40 text-zinc-300";
}

function TierRankedCard({
  tag,
  title,
  subtitle,
  items,
  theme,
  titleScale,
  displayCount,
}: {
  tag: string;
  title: string;
  subtitle: string;
  items: RankedItem[];
  theme: (typeof CARD_THEMES)[CardTheme];
  titleScale: number;
  displayCount: DisplayCount;
}) {
  const visible = items.slice(0, displayCount);
  const compact = displayCount >= 12;

  return (
    <div
      className="flex aspect-square w-full flex-col overflow-hidden px-4 py-4"
      style={{ backgroundColor: theme.bg, fontFamily: "system-ui, sans-serif" }}
    >
      <div className="shrink-0 text-center">
        <span
          className="font-black tracking-tight"
          style={{ color: theme.accent, fontSize: compact ? "18px" : "22px" }}
        >
          ({tag})
        </span>
        <h2
          className="font-bold leading-tight text-white"
          style={{ fontSize: `${titleScale * (compact ? 0.42 : 0.5)}px` }}
        >
          {title}
        </h2>
        <p
          className="font-semibold text-zinc-400"
          style={{ fontSize: compact ? "11px" : "13px" }}
        >
          {subtitle}
        </p>
      </div>

      <div
        className={`mt-2 flex flex-1 flex-col justify-center ${compact ? "gap-[3px]" : "gap-1.5"}`}
      >
        {visible.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-2 rounded-lg px-2 py-1"
            style={{
              backgroundColor: theme.card,
              minHeight: compact ? "28px" : "34px",
            }}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${getRankBadgeStyle(item.rank)}`}
            >
              {item.rank}
            </span>
            <p
              className="min-w-0 flex-1 truncate font-semibold text-white"
              style={{ fontSize: compact ? "10.5px" : "12px" }}
            >
              {item.label}
            </p>
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black"
              style={{
                color: TIER_COLORS[item.tier as TierGrade],
                backgroundColor: `${TIER_COLORS[item.tier as TierGrade]}18`,
              }}
            >
              {TIER_EMOJI[item.tier as TierGrade]} {item.tier}
            </span>
            <p
              className="shrink-0 truncate text-right font-bold"
              style={{
                color: TIER_COLORS[item.tier as TierGrade],
                fontSize: compact ? "8.5px" : "10px",
                maxWidth: compact ? "64px" : "72px",
              }}
            >
              {item.hook}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2 shrink-0 text-center text-[10px] font-medium text-zinc-500">
        {BRAND_HANDLE}
      </p>
    </div>
  );
}

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateInput(new Date()),
  );
  const [category, setCategory] = useState<Category>("부동산");
  const [region, setRegion] = useState<Region>("서울");
  const [displayCount, setDisplayCount] = useState<DisplayCount>(12);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [selectedHeadline, setSelectedHeadline] = useState<string | null>(null);
  const [cardContent, setCardContent] = useState<
    Pick<
      CategoryContent,
      "cardTag" | "cardTitle" | "cardSubtitle" | "rankedItems"
    >
  >({ cardTag: "", cardTitle: "", cardSubtitle: "", rankedItems: [] });
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [clipInfo, setClipInfo] = useState<{
    sources: CategoryContent["clipSources"];
    strategy: string;
  }>({ sources: [], strategy: "" });
  const [titleScale, setTitleScale] = useState(32);
  const [cardTheme, setCardTheme] = useState<CardTheme>("dark");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [searchMeta, setSearchMeta] = useState<string>("");

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const applyContent = useCallback(
    (data: CategoryContent, headline?: string) => {
      setCardContent({
        cardTag: data.cardTag,
        cardTitle: data.cardTitle,
        cardSubtitle: data.cardSubtitle.replace(/TOP \d+/, `TOP ${displayCount}`),
        rankedItems: data.rankedItems,
      });
      setCaption(data.caption);
      setHashtags(data.hashtags);
      setClipInfo({ sources: data.clipSources, strategy: data.clipStrategy });
      setSelectedHeadline(headline ?? data.headlines[0]);
    },
    [displayCount],
  );

  const fetchFromWeb = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          region: category === "학군 티어" ? region : undefined,
          displayCount,
          date: selectedDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? "웹 검색 실패");
        return;
      }

      applyContent(data as CategoryContent);
      setHeadlines(data.headlines);
      setHasGenerated(true);
      setSearchMeta(
        `${data.searchMeta?.source ?? "웹 검색"} · ${data.searchMeta?.resultCount ?? 0}건 수집`,
      );
      showToast(`${category} TOP ${displayCount} 웹 검색 완료!`);
    } catch {
      showToast("웹 검색 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }, [
    category,
    region,
    displayCount,
    selectedDate,
    applyContent,
    showToast,
  ]);

  const handleFetchIssues = () => {
    void fetchFromWeb();
  };

  const handleSelectHeadline = (headline: string) => {
    setSelectedHeadline(headline);
    showToast("출처 기사를 선택했습니다.");
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    setChatMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    const lower = trimmed.toLowerCase();
    const themes: CardTheme[] = ["dark", "navy", "warm"];

    if (lower.includes("줄여") || lower.includes("짧게")) {
      setCardContent((prev) => ({
        ...prev,
        cardTitle: prev.cardTitle.slice(0, 10) + "…",
      }));
      setChatMessages((m) => [
        ...m,
        { role: "assistant", text: "제목을 짧게 수정했습니다." },
      ]);
    } else if (lower.includes("배경") || lower.includes("테마")) {
      const next = themes[(themes.indexOf(cardTheme) + 1) % themes.length];
      setCardTheme(next);
      setChatMessages((m) => [
        ...m,
        { role: "assistant", text: `테마 → ${CARD_THEMES[next].label}` },
      ]);
    } else if (lower.includes("15") || lower.includes("늘려")) {
      setDisplayCount(15);
      setChatMessages((m) => [
        ...m,
        { role: "assistant", text: "표시 개수 → TOP 15" },
      ]);
    } else if (lower.includes("10")) {
      setDisplayCount(10);
      setChatMessages((m) => [
        ...m,
        { role: "assistant", text: "표시 개수 → TOP 10" },
      ]);
    } else {
      setChatMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Mock 반영. 'TOP 15로', '배경색 바꿔줘' 등 시도해 보세요.",
        },
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
      link.download = `quickline-${category}-top${displayCount}.png`;
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

  const theme = CARD_THEMES[cardTheme];
  const searchProfile = getSearchProfile(
    category,
    category === "학군 티어" ? region : undefined,
    displayCount,
  );
  const searchQueries = getSearchQueries(
    category,
    category === "학군 티어" ? region : undefined,
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              모래네 용돈벌어주는 SNS콘텐츠 만들기
            </h1>
            <p className="text-sm text-zinc-500">
              웹 검색 기반 · 티어 TOP 10~15 랭킹 카드뉴스
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {BRAND_HANDLE}
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-12">
        <section className="space-y-5 lg:col-span-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Calendar className="h-4 w-4" />
              날짜 선택
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            <p className="mt-2 text-xs text-zinc-500">
              {formatDisplayDate(selectedDate)} · 데이터 기준일
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              티어 카테고리
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {category === "학군 티어" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <MapPin className="h-4 w-4" />
                지역 선택
              </label>
              <div className="flex gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                      region === r
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Layers className="h-4 w-4" />
              표시 개수
            </label>
            <div className="flex gap-2">
              {DISPLAY_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDisplayCount(n)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                    displayCount === n
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  TOP {n}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
              <Globe className="h-4 w-4" />
              웹 검색 클리핑
            </h2>
            <p className="mb-3 text-xs leading-relaxed text-blue-800/80">
              {searchProfile.clipStrategy}
            </p>
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                검색 키워드
              </p>
              {searchQueries.map((q) => (
                <div
                  key={q}
                  className="rounded-lg bg-white/80 px-3 py-2 text-xs font-medium text-zinc-700"
                >
                  🔍 {q}
                </div>
              ))}
            </div>
            {searchMeta && (
              <p className="mt-3 text-[10px] font-medium text-green-700">
                ✓ 최근 검색: {searchMeta}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Newspaper className="h-4 w-4" />
              티어 카드 생성
            </h2>
            <button
              type="button"
              onClick={handleFetchIssues}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating
                ? "웹 검색 중..."
                : `${category} TOP ${displayCount} 웹 검색`}
            </button>

            {headlines.length > 0 && (
              <ul className="mt-4 space-y-2">
                {headlines.map((headline, i) => (
                  <li key={headline}>
                    <button
                      type="button"
                      onClick={() => handleSelectHeadline(headline)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                        selectedHeadline === headline
                          ? "border-zinc-900 bg-zinc-50 font-medium"
                          : "border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {headline}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <MessageSquare className="h-4 w-4" />
              AI 피드백 수정
            </h2>
            <div className="mb-3 max-h-32 space-y-2 overflow-y-auto rounded-lg bg-zinc-50 p-3">
              {chatMessages.length === 0 ? (
                <p className="text-xs text-zinc-400">
                  &quot;TOP 15로&quot;, &quot;배경색 바꿔줘&quot; 등
                </p>
              ) : (
                chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-xs ${msg.role === "user" ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`inline-block rounded-lg px-2 py-1 ${msg.role === "user" ? "bg-zinc-200" : "border border-zinc-200 bg-white"}`}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="수정 요청..."
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-3 py-2 text-white"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>

        <section className="space-y-5 lg:col-span-7">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-4">
              <div className="flex flex-1 items-center gap-3">
                <label className="text-xs text-zinc-500">제목 크기</label>
                <input
                  type="range"
                  min={24}
                  max={40}
                  value={titleScale}
                  onChange={(e) => setTitleScale(Number(e.target.value))}
                  className="flex-1 accent-zinc-900"
                />
              </div>
              <div className="flex gap-2">
                {(Object.keys(CARD_THEMES) as CardTheme[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCardTheme(key)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                      cardTheme === key
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 text-zinc-600"
                    }`}
                  >
                    {CARD_THEMES[key].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-md overflow-hidden rounded-2xl shadow-lg">
              <div ref={cardRef}>
                {hasGenerated ? (
                  <TierRankedCard
                    tag={cardContent.cardTag}
                    title={cardContent.cardTitle}
                    subtitle={cardContent.cardSubtitle}
                    items={cardContent.rankedItems}
                    theme={theme}
                    titleScale={titleScale}
                    displayCount={displayCount}
                  />
                ) : (
                  <div
                    className="flex aspect-square flex-col items-center justify-center px-8"
                    style={{ backgroundColor: "#1c1c1e" }}
                  >
                    <p className="text-center text-sm text-zinc-500">
                      카테고리 선택 후
                      <br />
                      <span className="text-orange-400">웹 검색</span>으로 TOP
                      10~15 생성
                    </p>
                    <div className="mt-4 flex gap-2 text-[10px] text-zinc-600">
                      <span>👑 S</span>
                      <span>🥇 A</span>
                      <span>🥈 B</span>
                      <span>🥉 C</span>
                    </div>
                    <p className="mt-3 text-xs text-zinc-600">
                      {BRAND_HANDLE}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasGenerated || isDownloading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "다운로드 중..." : "인스타 이미지 다운로드 (PNG)"}
            </button>
          </div>

          {hasGenerated && clipInfo.sources.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-zinc-700">
                웹 검색 출처
              </h2>
              <div className="flex flex-wrap gap-2">
                {clipInfo.sources.map((src) => (
                  <span
                    key={src.name + src.query}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                  >
                    {src.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">피드 본문</h2>
              <button
                type="button"
                onClick={() => handleCopy(caption, "본문")}
                disabled={!hasGenerated}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50"
              >
                <Copy className="h-3.5 w-3.5" />
                복사
              </button>
            </div>
            <textarea
              readOnly
              value={hasGenerated ? caption : "티어 카드 생성 후 표시됩니다."}
              rows={12}
              className="w-full resize-none rounded-lg border bg-zinc-50 px-3 py-2 text-sm leading-relaxed focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">해시태그</h2>
              <button
                type="button"
                onClick={() => handleCopy(hashtags.join(" "), "해시태그")}
                disabled={!hasGenerated}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50"
              >
                <Copy className="h-3.5 w-3.5" />
                복사
              </button>
            </div>
            <div className="rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-blue-600">
              {hasGenerated
                ? hashtags.join(" ")
                : "생성 후 표시됩니다."}
            </div>
          </div>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
