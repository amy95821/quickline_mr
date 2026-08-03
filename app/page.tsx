"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Copy, Download, RefreshCw, Upload } from "lucide-react";
import { InstaCardPreview } from "./components/InstaCardPreview";
import {
  BRAND_HANDLE,
  CATEGORIES,
  TEMPLATE_LABELS,
  UNSOLD_REGIONS,
  type Category,
  type GeneratedContent,
} from "./lib/cardTypes";
import {
  analyzeUnsold,
  MOCK_UNSOLD_ROWS,
  parseUnsoldExcel,
  type UnsoldRow,
} from "./lib/unsoldParser";
import { generateUnsoldContent } from "./lib/contentGenerator";
import type { SuggestedTopic } from "./lib/topicSuggester";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<Category>("부동산");
  const [topics, setTopics] = useState<SuggestedTopic[]>([]);
  const [selected, setSelected] = useState<SuggestedTopic | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [unsoldRegion, setUnsoldRegion] = useState<string>("경기");
  const [unsoldRows, setUnsoldRows] = useState<UnsoldRow[]>(MOCK_UNSOLD_ROWS);
  const [excelName, setExcelName] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  };

  const loadTopics = useCallback(async () => {
    setLoadingTopics(true);
    try {
      const res = await fetch(
        `/api/suggest-topics?category=${encodeURIComponent(category)}&date=${date}`,
      );
      const data = await res.json();
      if (res.ok) {
        setTopics(data.topics);
        setSelected(data.topics[0] ?? null);
        setContent(null);
      }
    } finally {
      setLoadingTopics(false);
    }
  }, [category, date]);

  useEffect(() => {
    void loadTopics();
  }, [loadTopics]);

  const handleGenerate = async () => {
    if (!selected) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selected, date }),
      });
      const data = await res.json();
      if (res.ok) setContent(data as GeneratedContent);
      else notify(data.error ?? "생성 실패");
    } finally {
      setGenerating(false);
    }
  };

  const handleUnsold = () => {
    const { top, insight } = analyzeUnsold(unsoldRows, unsoldRegion);
    setContent(generateUnsoldContent(unsoldRegion, top, insight));
    notify("미분양 카드 생성");
  };

  const handleExcel = async (file: File) => {
    const rows = await parseUnsoldExcel(file);
    setUnsoldRows(rows);
    setExcelName(file.name);
    notify(`${rows.length}건 파싱 완료`);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = `easyecon-${date}.png`;
    a.click();
    notify("PNG 저장");
  };

  const payload = content?.payload ?? null;

  return (
    <div className="min-h-screen bg-[#f7f6f4]">
      <header className="border-b border-black/[0.06] bg-[#f7f6f4] px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-end justify-between">
          <div>
            <p className="text-[11px] tracking-[0.25em] text-black/40 uppercase">
              EasyEcon PostMaker
            </p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight">
              2040 · 부동산·경제 카드뉴스
            </h1>
          </div>
          <span className="text-[11px] text-black/35">{BRAND_HANDLE}</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-8 py-10 lg:grid-cols-12">
        {/* ── Left ── */}
        <aside className="space-y-8 lg:col-span-5">
          <section>
            <Field label="기준일" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-0 border-b border-black/10 bg-transparent py-2 text-sm outline-none focus:border-black/30"
            />
          </section>

          <section>
            <Field label="카테고리" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full border-0 border-b border-black/10 bg-transparent py-2 text-sm outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <Field label="오늘의 주제" />
              <button
                type="button"
                onClick={() => void loadTopics()}
                className="text-black/40 hover:text-black/70"
                aria-label="새로고침"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingTopics ? "animate-spin" : ""}`} />
              </button>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-black/45">
              웹 트렌드 기반 5개 제안 · Tier 1~2개 · 부동산 주 1~2회 데이터(Type D)
            </p>
            <ul className="space-y-1">
              {topics.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(t);
                      setContent(null);
                    }}
                    className={`w-full py-3 text-left transition ${
                      selected?.id === t.id ? "opacity-100" : "opacity-55 hover:opacity-80"
                    }`}
                  >
                    <span className="text-[10px] tracking-wide text-black/40">
                      {TEMPLATE_LABELS[t.template]}
                    </span>
                    <p className="mt-0.5 text-[13px] font-medium leading-snug">{t.title}</p>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={!selected || generating}
              onClick={() => void handleGenerate()}
              className="mt-6 w-full py-3 text-sm font-medium text-black/80 underline-offset-4 hover:underline disabled:opacity-30"
            >
              {generating ? "생성 중…" : "선택 주제로 카드 만들기"}
            </button>
          </section>

          <section className="border-t border-black/[0.06] pt-8">
            <Field label="미분양 분석" />
            <select
              value={unsoldRegion}
              onChange={(e) => setUnsoldRegion(e.target.value)}
              className="mt-2 w-full border-0 border-b border-black/10 bg-transparent py-2 text-sm"
            >
              {UNSOLD_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <label className="mt-4 flex cursor-pointer flex-col items-center border border-dashed border-black/15 py-6 text-center">
              <Upload className="mb-2 h-4 w-4 text-black/30" />
              <span className="text-xs text-black/45">
                정부 미분양 엑셀 (.xlsx) 업로드
              </span>
              {excelName && (
                <span className="mt-1 text-[10px] text-black/35">{excelName}</span>
              )}
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleExcel(f);
                }}
              />
            </label>
            <p className="mt-2 text-[10px] leading-relaxed text-black/35">
              업로드 없이 Mock 데이터로 테스트 가능 · 컬럼: 시도, 시군구, 미분양
            </p>
            <button
              type="button"
              onClick={handleUnsold}
              className="mt-3 text-xs text-black/50 underline-offset-2 hover:underline"
            >
              미분양 Top 3 카드 생성
            </button>
          </section>
        </aside>

        {/* ── Right ── */}
        <div className="lg:col-span-7">
          <div className="sticky top-8">
            <div
              ref={cardRef}
              className="mx-auto max-w-[420px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
            >
              {payload ? (
                <InstaCardPreview payload={payload} />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-[#F5F0E8] text-sm text-black/30">
                  주제를 선택해 카드를 생성하세요
                </div>
              )}
            </div>

            <div className="mx-auto mt-6 flex max-w-[420px] gap-6">
              <button
                type="button"
                disabled={!payload}
                onClick={() => void handleDownload()}
                className="flex items-center gap-2 text-sm text-black/60 disabled:opacity-30"
              >
                <Download className="h-4 w-4" />
                PNG
              </button>
              <button
                type="button"
                disabled={!content?.caption}
                onClick={() => {
                  void navigator.clipboard.writeText(content!.caption);
                  notify("본문 복사");
                }}
                className="flex items-center gap-2 text-sm text-black/60 disabled:opacity-30"
              >
                <Copy className="h-4 w-4" />
                캡션
              </button>
            </div>

            {content?.caption && (
              <textarea
                readOnly
                value={content.caption}
                className="mx-auto mt-6 block w-full max-w-[420px] resize-none border-0 bg-transparent text-xs leading-relaxed text-black/50 outline-none"
                rows={6}
              />
            )}
          </div>
        </div>
      </main>

      {toast && (
        <p className="fixed bottom-8 left-1/2 -translate-x-1/2 text-xs text-black/60">
          {toast}
        </p>
      )}
    </div>
  );
}

function Field({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.15em] text-black/40 uppercase">
      {label}
    </p>
  );
}
