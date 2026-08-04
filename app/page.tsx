"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ChevronLeft, ChevronRight, Copy, Download, DownloadCloud, RefreshCw, Upload } from "lucide-react";
import { InstaCardPreview } from "./components/InstaCardPreview";
import { FeedbackPanel } from "./components/FeedbackPanel";
import {
  BRAND_HANDLE,
  CATEGORIES,
  FORMAT_LABELS,
  UNSOLD_REGIONS,
  type Category,
  type GeneratedContent,
} from "./lib/cardTypes";
import { generateFromTopic, generateUnsoldFromUpload } from "./lib/contentGenerator";
import {
  MOCK_UNSOLD_ROWS,
  parseUnsoldExcel,
  type UnsoldRow,
} from "./lib/unsoldParser";
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
  const [slideIndex, setSlideIndex] = useState(0);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [unsoldRegion, setUnsoldRegion] = useState<string>("경기");
  const [unsoldRows, setUnsoldRows] = useState<UnsoldRow[]>(MOCK_UNSOLD_ROWS);
  const [excelName, setExcelName] = useState<string | null>(null);
  const [editableCaption, setEditableCaption] = useState("");

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
        setEditableCaption("");
        setSlideIndex(0);
      }
    } finally {
      setLoadingTopics(false);
    }
  }, [category, date]);

  useEffect(() => {
    void loadTopics();
  }, [loadTopics]);

  const handleGenerate = () => {
    if (!selected) return;
    setGenerating(true);
    try {
      const data = generateFromTopic(selected, date);
      if (!data.slides.length) {
        notify("카드 슬라이드가 비어 있습니다.");
        return;
      }
      setContent(data);
      setEditableCaption(data.caption);
      setSlideIndex(0);
    } catch (e) {
      notify(e instanceof Error ? e.message : "생성 실패");
    } finally {
      setGenerating(false);
    }
  };

  const handleUnsold = () => {
    const data = generateUnsoldFromUpload(unsoldRegion, unsoldRows);
    setContent(data);
    setEditableCaption(data.caption);
    setSlideIndex(0);
    notify("미분양 카드 생성");
  };

  const handleExcel = async (file: File) => {
    const rows = await parseUnsoldExcel(file);
    setUnsoldRows(rows);
    setExcelName(file.name);
    notify(`${rows.length}건 파싱 완료`);
  };

  const currentSlide = content?.slides[slideIndex] ?? null;
  const totalSlides = content?.slides.length ?? 0;

  const handleDownloadCurrent = async () => {
    if (!cardRef.current || !content) return;
    const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = `easyecon-${date}-${slideIndex + 1}.png`;
    a.click();
    notify(`${slideIndex + 1}장 저장`);
  };

  const handleDownloadAll = async () => {
    if (!content || !cardRef.current) return;
    for (let i = 0; i < content.slides.length; i++) {
      setSlideIndex(i);
      await new Promise((r) => setTimeout(r, 120));
      const el = cardRef.current;
      if (!el) continue;
      const url = await toPng(el, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `easyecon-${date}-${i + 1}.png`;
      a.click();
      await new Promise((r) => setTimeout(r, 300));
    }
    notify(`전체 ${content.slides.length}장 저장`);
  };

  const copyCaption = () => {
    if (!editableCaption) return;
    void navigator.clipboard.writeText(editableCaption);
    notify("본문+해시태그 복사");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#f7f6f4] to-[#E8F8F5]">
      <header className="border-b border-[#2196F3]/10 bg-white/60 px-8 py-6 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-end justify-between">
          <div>
            <p className="text-[11px] tracking-[0.25em] text-black/40 uppercase">
              EasyEcon PostMaker
            </p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight">
              부동산·경제 카드뉴스
            </h1>
          </div>
          <span className="text-[11px] text-black/35">{BRAND_HANDLE}</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-8 py-10 lg:grid-cols-12">
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
            <Field label={`오늘의 주제 · ${topics.length}개`} />
              <button
                type="button"
                onClick={() => void loadTopics()}
                className="text-black/40 hover:text-black/70"
                aria-label="새로고침"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingTopics ? "animate-spin" : ""}`} />
              </button>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-black/45">
              매일 <strong className="text-black/70">4종류 섞임</strong> — 실사 후킹 · 스토리 · 데이터 · 클리핑 + 5번 TOP10
            </p>
            <ul className="space-y-3">
              {topics
                .filter((t) => !t.isTop10)
                .map((t, i) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(t);
                        setContent(null);
                        setSlideIndex(0);
                      }}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                        selected?.id === t.id
                          ? "border-black/25 bg-white opacity-100 shadow-sm"
                          : "border-transparent opacity-60 hover:opacity-85"
                      }`}
                    >
                      <span className="flex flex-wrap items-center gap-1.5 text-[10px] tracking-wide text-black/40">
                        <span className="font-bold text-black/55">{i + 1}.</span>
                        {t.slotLabel && (
                          <span className="rounded bg-black/8 px-1.5 py-0.5 font-bold text-black/55">{t.slotLabel}</span>
                        )}
                        <span>{FORMAT_LABELS[t.format]}</span>
                        {t.timelinessTag && (
                          <span className="font-bold text-[#C0392B]">{t.timelinessTag}</span>
                        )}
                      </span>
                      <p className="mt-1 text-[12px] font-medium leading-relaxed text-black/80">
                        {t.summary}
                      </p>
                    </button>
                  </li>
                ))}
            </ul>

            {topics.some((t) => t.isTop10) && (
              <div className="mt-5 border-t-2 border-[#C0392B] pt-4">
                <p className="mb-2 text-[10px] font-bold tracking-widest text-[#C0392B]">
                  ⭐ 5번 · 오늘의 TOP10
                </p>
                {topics
                  .filter((t) => t.isTop10)
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelected(t);
                        setContent(null);
                        setSlideIndex(0);
                      }}
                      className={`w-full rounded-lg border-2 px-3 py-3 text-left transition ${
                        selected?.id === t.id
                          ? "border-[#C0392B] bg-[#FFF5F5] opacity-100"
                          : "border-[#C0392B]/30 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <span className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="bg-black px-2 py-0.5 font-bold text-[#CDFF00]">TOP10</span>
                      </span>
                      <p className="mt-2 text-[12px] font-bold leading-relaxed text-black/85">
                        {t.summary}
                      </p>
                    </button>
                  ))}
              </div>
            )}

            <button
              type="button"
              disabled={!selected || generating}
              onClick={handleGenerate}
              className="mt-6 w-full py-3 text-sm font-medium text-black/80 underline-offset-4 hover:underline disabled:opacity-30"
            >
              {generating ? "생성 중…" : "선택 주제로 카드 만들기"}
            </button>
          </section>

          <section className="border-t border-black/[0.06] pt-8">
            <Field label="미분양 분석 (부동산 데이터)" />
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
              <span className="text-xs text-black/45">정부 미분양 엑셀 (.xlsx) 업로드</span>
              <span className="mt-1 text-[10px] text-black/30">API 연동 가능 — 공공데이터포털 키 설정 시 자동 조회 (미구현)</span>
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
            <button
              type="button"
              onClick={handleUnsold}
              className="mt-3 text-xs text-black/50 underline-offset-2 hover:underline"
            >
              미분양 Top 3 카드 생성
            </button>
          </section>
        </aside>

        <div className="lg:col-span-7">
          <div className="sticky top-8">
            <div
              ref={cardRef}
              className="mx-auto max-w-[420px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
            >
              {currentSlide ? (
                <InstaCardPreview slide={currentSlide} />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-[#F5F5F5] px-8 text-center text-sm leading-relaxed text-black/30">
                  주제를 선택해 카드를 생성하세요
                </div>
              )}
            </div>

            {totalSlides > 1 && (
              <div className="mx-auto mt-4 flex max-w-[420px] items-center justify-between">
                <button
                  type="button"
                  disabled={slideIndex <= 0}
                  onClick={() => setSlideIndex((i) => i - 1)}
                  className="flex items-center gap-1 text-sm text-black/50 disabled:opacity-25"
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </button>
                <div className="flex gap-1.5">
                  {content!.slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === slideIndex ? "w-5 bg-black/70" : "w-1.5 bg-black/20"
                      }`}
                      aria-label={`${i + 1}장`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  disabled={slideIndex >= totalSlides - 1}
                  onClick={() => setSlideIndex((i) => i + 1)}
                  className="flex items-center gap-1 text-sm text-black/50 disabled:opacity-25"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mx-auto mt-5 flex max-w-[420px] flex-wrap gap-5">
              <button
                type="button"
                disabled={!currentSlide}
                onClick={() => void handleDownloadCurrent()}
                className="flex items-center gap-2 text-sm text-black/60 disabled:opacity-30"
              >
                <Download className="h-4 w-4" />
                {totalSlides > 1 ? "PNG 저장" : "PNG 저장"}
              </button>
              {totalSlides > 1 && (
                <button
                  type="button"
                  disabled={!content}
                  onClick={() => void handleDownloadAll()}
                  className="flex items-center gap-2 text-sm text-black/60 disabled:opacity-30"
                >
                  <DownloadCloud className="h-4 w-4" />
                  전체 {totalSlides}장
                </button>
              )}
              <button
                type="button"
                disabled={!editableCaption}
                onClick={copyCaption}
                className="flex items-center gap-2 text-sm text-black/60 disabled:opacity-30"
              >
                <Copy className="h-4 w-4" />
                본문
              </button>
            </div>

            {(editableCaption || content) && (
              <div className="mx-auto mt-6 max-w-[420px]">
                <p className="mb-2 text-[11px] font-bold text-[#1565C0]">인스타 본문 (직접 수정 가능)</p>
                <textarea
                  value={editableCaption}
                  onChange={(e) => setEditableCaption(e.target.value)}
                  className="block w-full resize-y rounded-xl border-0 bg-white/90 px-4 py-3 text-sm leading-relaxed text-[#0D2137] shadow-sm outline-none ring-1 ring-[#2196F3]/15 focus:ring-[#2196F3]/40"
                  rows={10}
                />
              </div>
            )}

            <FeedbackPanel
              content={content}
              slideIndex={slideIndex}
              caption={editableCaption}
              onCaptionChange={setEditableCaption}
              onContentChange={(c) => {
                setContent(c);
                setEditableCaption(c.caption);
              }}
              onNotify={notify}
            />
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
