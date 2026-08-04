"use client";

import { useState, type ReactNode } from "react";
import type { CardSlide, ChartPoint, WinnerLoser } from "../lib/cardTypes";
import { BRAND_HANDLE } from "../lib/cardTypes";
import { pickPhotoForTopic, FALLBACK_GRADIENT } from "../lib/cardImages";
import {
  C,
  CARD_SAFE,
  DIM_GRADIENT,
  DIM_GRADIENT_HEAVY,
  INSET_X,
  LAYOUT,
  cardPad,
  pickKeyPointLabel,
  clampText,
} from "../lib/designTokens";

interface InstaCardPreviewProps {
  slide: CardSlide;
}

/* ────────────────────────────────────────────────────────────
   공통 셸 — 로고는 항상 별도 footer row (본문과 절대 겹치지 않음)
   ──────────────────────────────────────────────────────────── */

function CardShell({
  bg,
  children,
  footerTone = "light",
  className = "",
}: {
  bg?: ReactNode;
  children: ReactNode;
  footerTone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={"relative flex aspect-square w-full flex-col overflow-hidden font-body " + className}>
      {bg}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      <div className="relative z-10 flex shrink-0 items-center justify-end px-10 py-3">
        <span
          className={
            "text-[10px] font-semibold tracking-wider " +
            (footerTone === "dark" ? "text-black/35" : "text-white/50")
          }
        >
          {BRAND_HANDLE}
        </span>
      </div>
    </div>
  );
}

/** 이미지 로딩 실패 시 그라디언트로 대체 — 깨진 아이콘 방지 */
function SafeImage({
  src,
  className,
  fallback,
}: {
  src?: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={className} style={{ background: FALLBACK_GRADIENT }} />
    );
  }
  return (
    <img
      src={src}
      alt=""
      crossOrigin="anonymous"
      className={className}
      onError={() => setBroken(true)}
    />
  );
}

/** 실사 + 디자인된 딤(그라디언트) + 코너 라인 악센트 — 기본 배경 템플릿 */
function DimPhotoBg({ src, heavy }: { src: string; heavy?: boolean }) {
  return (
    <div className="absolute inset-0">
      <SafeImage src={src} className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: heavy ? DIM_GRADIENT_HEAVY : DIM_GRADIENT }}
      />
      {/* 미니멀 라인 악센트 — 텅 빈 느낌 방지 */}
      <div className="absolute left-9 top-9 h-8 w-8 border-l-2 border-t-2 border-[#CCFF00]/70" />
      <div className="absolute bottom-14 right-9 h-8 w-8 border-b-2 border-r-2 border-[#CCFF00]/40" />
    </div>
  );
}

/** 형광 pill 대신 — 인플루언서 톤 라벨 + 유리(Glass) 패널 */
function KeyPointPanel({ text, seed }: { text: string; seed: string }) {
  const label = pickKeyPointLabel(seed);
  return (
    <div className="mt-6 shrink-0 rounded-xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
      <p className="mb-1.5 text-[11px] font-bold tracking-wide text-[#CCFF00]">{label}</p>
      <p className="font-body text-[15px] font-semibold leading-relaxed text-white">
        {clampText(text, 150)}
      </p>
    </div>
  );
}

function HeadlineBlock({ headline, accentClass = "text-[#CCFF00]" }: { headline: string; accentClass?: string }) {
  const lines = headline.split("\n");
  return (
    <h1 className="font-title shrink-0 text-4xl font-black tracking-tighter text-white sm:text-5xl">
      {lines[0]}
      {lines[1] && (
        <>
          <br />
          <span className={accentClass}>{lines[1]}</span>
        </>
      )}
    </h1>
  );
}

type RankRow = {
  rank: number;
  label: string;
  note?: string;
  sub?: string;
  value?: string;
  highlight?: boolean;
  logoUrl?: string;
};

/* ────────────────────────────────────────────────────────────
   기본 템플릿 — 실사 + 딤 + 글래스 패널 (모든 photo-hook 본문형)
   ──────────────────────────────────────────────────────────── */

function PhotoDimEditorialSlide({ data }: { data: CardSlide }) {
  const img = data.coverImage ?? pickPhotoForTopic(data.headline, "tax", undefined, data.slideIndex ?? 0);
  const bodyLines = (data.body ?? []).slice(0, 2);

  return (
    <CardShell bg={<DimPhotoBg src={img} heavy />}>
      <div className="flex min-h-0 flex-1 flex-col" style={{ ...cardPad(), gap: LAYOUT.gapLg }}>
        <HeadlineBlock headline={data.headline} />
        <div className="min-h-0 flex-1 space-y-4 overflow-hidden">
          {bodyLines.map((line, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-data mt-0.5 shrink-0 text-lg font-extrabold tabular-nums text-[#CCFF00]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-body line-clamp-4 min-w-0 flex-1 text-lg font-semibold leading-relaxed text-white/95">
                {clampText(line, 150)}
              </p>
            </div>
          ))}
        </div>
        {data.highlight && <KeyPointPanel text={data.highlight} seed={data.headline} />}
      </div>
    </CardShell>
  );
}

/** 실사 풀 + 딤 — 후킹 전용 (본문 없음) */
function PhotoFullSlide({ data }: { data: CardSlide }) {
  const img = data.coverImage ?? pickPhotoForTopic(data.headline, "story", undefined, 0);
  return (
    <CardShell bg={<DimPhotoBg src={img} />}>
      <div className="flex flex-1 flex-col justify-end" style={cardPad()}>
        <HeadlineBlock headline={data.headline} />
        {data.subheadline && (
          <p className="font-body mt-6 line-clamp-2 text-lg font-semibold leading-relaxed text-white/85">
            {clampText(data.subheadline, 150)}
          </p>
        )}
      </div>
    </CardShell>
  );
}

/* ────────────────────────────────────────────────────────────
   TOP10 — 실사 없음 · 카드 그리드 (겹침 방지 그리드 고정)
   ──────────────────────────────────────────────────────────── */

function Top10CardGrid({
  headline,
  rows,
  highlightRank,
}: {
  headline: string;
  rows: RankRow[];
  highlightRank?: number;
}) {
  const lines = headline.split("\n");

  return (
    <CardShell footerTone="dark" className="bg-[#0A0A0A]">
      <div
        className="grid h-full min-h-0"
        style={{ gridTemplateRows: "auto 1fr", padding: LAYOUT.pad, gap: LAYOUT.gapSm }}
      >
        <div className="relative shrink-0 overflow-hidden rounded-lg border-l-4 border-[#CCFF00] bg-[#141414] px-5 py-4">
          <div className="absolute right-4 top-3 h-5 w-5 rounded-full border border-[#CCFF00]/40" />
          <h1 className="font-title whitespace-pre-line text-3xl font-black tracking-tighter text-white">
            {lines[0]}
            {lines[1] && (
              <>
                <br />
                <span className="text-[#CCFF00]">{lines[1]}</span>
              </>
            )}
          </h1>
        </div>
        <ul className="grid min-h-0" style={{ gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))`, gap: 4 }}>
          {rows.map((row) => {
            const isHl = row.highlight || row.rank === highlightRank;
            const note = row.note ?? row.sub ?? "";
            return (
              <li
                key={row.rank}
                className={
                  "grid min-h-0 items-center overflow-hidden rounded-lg px-2.5 " +
                  (isHl ? "bg-[#CCFF00]/12 ring-1 ring-[#CCFF00]/50" : "bg-[#1A1A1A]")
                }
                style={{ gridTemplateColumns: "20px 22px minmax(0,auto) 1fr minmax(56px,max-content)", columnGap: 8 }}
              >
                <span className="font-data text-center text-xs font-bold tabular-nums text-[#777]">{row.rank}</span>
                <SafeImage
                  src={row.logoUrl}
                  className="h-[20px] w-[20px] shrink-0 object-contain"
                  fallback={<span className="h-[20px] w-[20px] shrink-0 rounded-full bg-[#333]" />}
                />
                <span className="max-w-[76px] truncate bg-black px-2 py-0.5 text-[11px] font-bold text-white">
                  {row.label}
                </span>
                <span className="min-w-0 truncate text-[11px] font-medium text-[#AAA]">{note}</span>
                {row.value && (
                  <span className="font-data truncate text-right text-xs font-bold tabular-nums text-white">
                    {row.value}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </CardShell>
  );
}

/* ────────────────────────────────────────────────────────────
   apt_lap 순위 · scan.real.data 순위
   ──────────────────────────────────────────────────────────── */

function DataRankList({
  headline,
  rows,
  footer,
  coverImage,
}: {
  headline: string;
  rows: RankRow[];
  footer?: string;
  coverImage?: string;
}) {
  const lines = headline.split("\n");
  return (
    <CardShell footerTone="dark" className="bg-white">
      {coverImage && (
        <div className="relative h-[92px] shrink-0 overflow-hidden">
          <SafeImage src={coverImage} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div style={cardPad()}>
        <h1 className="font-title whitespace-pre-line text-3xl font-black tracking-tighter text-black">
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              <span className="text-[#FF4757]">{lines[1]}</span>
            </>
          )}
        </h1>
      </div>
      <ul className={INSET_X + " mt-4 min-h-0 flex-1 overflow-hidden"}>
        {rows.map((row, i) => {
          const note = row.note ?? row.sub;
          return (
            <li
              key={row.rank}
              className={
                "flex items-center gap-3 border-b border-[#EEE] py-3 " +
                (i % 2 ? "bg-[#FAFAFA]" : "") +
                (row.highlight ? " bg-[#FFFDE7]" : "")
              }
            >
              <span className="font-data w-7 text-lg font-extrabold tabular-nums text-[#CCC]">{row.rank}</span>
              <span className="shrink-0 bg-black px-3 py-1.5 text-sm font-bold text-white">{row.label}</span>
              {note && <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#666]">{note}</span>}
              {row.value && (
                <span className="font-data ml-auto shrink-0 text-2xl font-extrabold tabular-nums text-black">
                  {row.value}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {footer && (
        <div className={INSET_X + " shrink-0 border-t border-[#EEE] py-4"}>
          <p className="font-body line-clamp-2 text-base font-semibold leading-relaxed text-[#222]">
            {clampText(footer, 150)}
          </p>
        </div>
      )}
    </CardShell>
  );
}

function ScanRankList({
  headline,
  rows,
  highlightRank,
  footer,
}: {
  headline: string;
  rows: RankRow[];
  highlightRank?: number;
  footer?: string;
}) {
  const lines = headline.split("\n");
  return (
    <CardShell footerTone="dark" className="bg-[#F5F0E6]">
      <div className={INSET_X + " pt-6"}>
        <div className="bg-[#1A1A1A] px-5 py-4">
          <h1 className="font-title whitespace-pre-line text-3xl font-black tracking-tighter text-white">
            {lines[0]}
            {lines[1] && (
              <>
                <br />
                <span className="text-[#CCFF00]">{lines[1]}</span>
              </>
            )}
          </h1>
        </div>
      </div>
      <ul className={INSET_X + " mt-3 min-h-0 flex-1 overflow-hidden"}>
        {rows.map((row, i) => {
          const isHl = row.highlight || row.rank === highlightRank;
          const note = row.note ?? row.sub;
          return (
            <li
              key={row.rank}
              className={
                "flex items-center gap-2 border-b border-[#DDD] py-2.5 " +
                (i % 2 ? "bg-[#EDE8DF]/80" : "") +
                (isHl ? " ring-2 ring-inset ring-[#CCFF00]" : "")
              }
            >
              <span className="font-data w-6 text-sm font-bold tabular-nums text-[#999]">{row.rank}</span>
              <span className="bg-black px-2 py-1 text-xs font-bold text-white">{row.label}</span>
              {note && <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#666]">{note}</span>}
              {row.value && (
                <span className="font-data ml-auto shrink-0 text-xl font-extrabold tabular-nums">{row.value}</span>
              )}
            </li>
          );
        })}
      </ul>
      {footer && (
        <div className={INSET_X + " shrink-0 border-t border-[#CCC] py-3"}>
          <p className="font-body line-clamp-2 text-base font-semibold">{clampText(footer, 150)}</p>
        </div>
      )}
    </CardShell>
  );
}

/* ────────────────────────────────────────────────────────────
   훅 · 스토리 · 인사이트
   ──────────────────────────────────────────────────────────── */

function HookSlide({ data }: { data: CardSlide }) {
  const dark = data.accent === "dark";
  const lines = data.headline.split("\n");
  if (data.coverImage && dark) {
    return (
      <CardShell bg={<DimPhotoBg src={data.coverImage} />}>
        <div className="flex flex-1 flex-col justify-center" style={cardPad()}>
          <HeadlineBlock headline={data.headline} />
          {data.subheadline && (
            <p className="font-body mt-6 line-clamp-2 text-lg font-semibold leading-relaxed text-white/85">
              {clampText(data.subheadline, 150)}
            </p>
          )}
        </div>
      </CardShell>
    );
  }
  return (
    <CardShell footerTone={dark ? "light" : "dark"} className={dark ? "bg-[#1A2744]" : "bg-[#F5F0E6]"}>
      <div className="flex flex-1 flex-col justify-center" style={cardPad()}>
        <h1
          className={
            "font-title whitespace-pre-line text-4xl font-black tracking-tighter sm:text-5xl " +
            (dark ? "text-white" : "text-black")
          }
        >
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              <span className="text-[#CCFF00]">{lines[1]}</span>
            </>
          )}
        </h1>
        {data.subheadline && (
          <p className={"font-body mt-6 line-clamp-2 text-lg font-semibold " + (dark ? "text-white/80" : "text-[#FF4757]")}>
            {clampText(data.subheadline, 150)}
          </p>
        )}
      </div>
    </CardShell>
  );
}

function StorySlide({ data }: { data: CardSlide }) {
  const dark = (data.slideIndex ?? 1) % 2 === 0;
  if (data.coverImage) {
    return (
      <CardShell bg={<DimPhotoBg src={data.coverImage} heavy />}>
        <div className="flex min-h-0 flex-1 flex-col" style={{ ...cardPad(), gap: LAYOUT.gapLg }}>
          <h2 className="font-title text-3xl font-black tracking-tighter text-white">{data.headline}</h2>
          <div className="min-h-0 flex-1 space-y-4 overflow-hidden">
            {data.body?.map((line, i) => (
              <p key={i} className="font-body line-clamp-3 text-lg font-semibold leading-relaxed text-white/92">
                {clampText(line, 150)}
              </p>
            ))}
          </div>
          {data.highlight && <KeyPointPanel text={data.highlight} seed={data.headline} />}
        </div>
      </CardShell>
    );
  }
  return (
    <CardShell footerTone={dark ? "light" : "dark"} className={dark ? "bg-[#1A2744]" : "bg-white"}>
      <div className="flex min-h-0 flex-1 flex-col" style={{ ...cardPad(), gap: LAYOUT.gapLg }}>
        <h2 className={"font-title text-3xl font-black tracking-tighter " + (dark ? "text-white" : "text-black")}>
          {data.headline}
        </h2>
        <div className="min-h-0 flex-1 space-y-4 overflow-hidden">
          {data.body?.map((line, i) => (
            <p
              key={i}
              className={
                "font-body line-clamp-3 text-lg font-semibold leading-relaxed " + (dark ? "text-white/92" : "text-[#222]")
              }
            >
              {clampText(line, 150)}
            </p>
          ))}
        </div>
        {data.highlight && (
          <div className={"mt-auto shrink-0 rounded-xl border px-5 py-4 " + (dark ? "border-white/15 bg-white/5" : "border-black/10 bg-black/[0.03]")}>
            <p className="mb-1.5 text-[11px] font-bold tracking-wide text-[#CCFF00]">
              {pickKeyPointLabel(data.headline)}
            </p>
            <p className={"font-body line-clamp-2 text-[15px] font-semibold leading-relaxed " + (dark ? "text-white" : "text-black")}>
              {clampText(data.highlight, 150)}
            </p>
          </div>
        )}
      </div>
    </CardShell>
  );
}

function InsightSlide({ data }: { data: CardSlide }) {
  if (data.bestComment) {
    return (
      <CardShell footerTone="dark" className="bg-[#F0EDE8]">
        <div className="flex h-full flex-col justify-center" style={cardPad()}>
          <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Community</p>
          <div className="mt-4 rounded-2xl border border-[#DDD] bg-white px-6 py-5 shadow-sm">
            <p className="font-body line-clamp-4 text-lg font-semibold leading-relaxed text-[#111]">
              &ldquo;{clampText(data.bestComment, 150)}&rdquo;
            </p>
          </div>
        </div>
      </CardShell>
    );
  }
  const lines = data.headline.split("\n");
  return (
    <CardShell footerTone="dark" className="bg-white">
      <div className="flex min-h-0 flex-1 flex-col" style={cardPad()}>
        <h2 className="font-title whitespace-pre-line text-3xl font-black tracking-tighter">
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              <span className="text-[#FF4757]">{lines[1]}</span>
            </>
          )}
        </h2>
        <div className="mt-7 min-h-0 flex-1 space-y-4 overflow-hidden">
          {data.body?.map((line, i) => (
            <p key={i} className="font-body line-clamp-3 border-l-4 border-black pl-4 text-lg font-semibold leading-relaxed">
              {clampText(line, 150)}
            </p>
          ))}
        </div>
        {data.highlight && (
          <div className="mt-6 shrink-0 border-t border-[#EEE] pt-4">
            <p className="font-body line-clamp-2 text-base font-semibold leading-relaxed text-[#FF4757]">
              {clampText(data.highlight, 150)}
            </p>
          </div>
        )}
      </div>
    </CardShell>
  );
}

function CalendarSlide({ data }: { data: CardSlide }) {
  const month = data.month ?? 1;
  const year = data.year ?? 2026;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const eventMap = new Map<number, NonNullable<CardSlide["events"]>[number]>();
  for (const ev of data.events ?? []) {
    const end = ev.endDay ?? ev.day;
    for (let d = ev.day; d <= end; d++) if (!eventMap.has(d)) eventMap.set(d, ev);
  }
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <CardShell footerTone="dark" className="bg-[#F5F0E6]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={cardPad()}>
        <h1 className="font-title shrink-0 text-2xl font-black tracking-tighter text-black">{data.headline}</h1>
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-7 gap-px bg-[#CCC] text-[8px]">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className={"bg-white py-1.5 text-center font-bold " + (i === 0 ? "text-red-600" : "")}>
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const ev = day ? eventMap.get(day) : null;
            return (
              <div key={i} className="flex min-h-[36px] flex-col bg-white p-1">
                {day && <span className="font-bold">{day}</span>}
                {ev && day === ev.day && (
                  <span className="mt-auto line-clamp-2 text-[6px] leading-tight">{ev.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CardShell>
  );
}

/** 그래프 카드 — 헤더 30%, 그래프 영역 보호 (텍스트 침범 방지) */
function LineChart({ series, color, label }: { series: ChartPoint[]; color: string; label: string }) {
  const max = Math.max(...series.map((p) => p.value));
  const min = Math.min(...series.map((p) => p.value));
  const range = max - min || 1;
  const w = 300;
  const h = 60;
  const padX = 6;
  const pts = series.map((p, i) => {
    const x = padX + (i / Math.max(series.length - 1, 1)) * (w - padX * 2);
    const y = h - ((p.value - min) / range) * (h - 12) - 6;
    return { x, y, v: p.value };
  });
  return (
    <div className="border-t border-[#DDD] pt-3">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-bold text-[#888]">{label}</span>
        <span className="font-data text-lg font-extrabold tabular-nums" style={{ color }}>
          {pts[pts.length - 1]?.v}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={color} strokeWidth="3" />
      </svg>
    </div>
  );
}

function ChartSlide({ data }: { data: CardSlide }) {
  return (
    <CardShell footerTone="dark" className="bg-white">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={cardPad()}>
        {/* 헤더 영역 — 상단 30% 이내로 제한 */}
        <div className="shrink-0" style={{ maxHeight: "30%" }}>
          <h1 className="font-title line-clamp-2 whitespace-pre-line text-3xl font-black tracking-tighter">
            {data.headline}
          </h1>
          {data.conclusion && (
            <p className="font-body mt-3 line-clamp-2 border-l-4 border-[#CCFF00] pl-4 text-base font-semibold leading-relaxed">
              {clampText(data.conclusion, 150)}
            </p>
          )}
        </div>
        {/* 그래프 영역 — 별도 flex 컬럼, gap으로 텍스트와 분리 */}
        <div className="mt-5 flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-hidden">
          {data.priceSeries && data.priceLabel && (
            <LineChart series={data.priceSeries} color={C.black} label={data.priceLabel} />
          )}
          {data.supplySeries && data.supplyLabel && (
            <LineChart series={data.supplySeries} color={C.coral} label={data.supplyLabel} />
          )}
          <WinnerList items={data.winnersLosers} />
        </div>
      </div>
    </CardShell>
  );
}

function WinnerList({ items }: { items?: WinnerLoser[] }) {
  if (!items?.length) return null;
  return (
    <ul className="shrink-0 space-y-2 overflow-hidden">
      {items.slice(0, 3).map((w, i) => (
        <li key={i} className="font-body line-clamp-1 text-sm font-semibold">
          {w.side === "winner" ? "↑" : w.side === "loser" ? "↓" : "·"} {w.label} — {w.reason}
        </li>
      ))}
    </ul>
  );
}

function PolicySlide({ data }: { data: CardSlide }) {
  return (
    <CardShell footerTone="dark" className="bg-white">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={cardPad()}>
        <h1 className="font-title shrink-0 whitespace-pre-line text-3xl font-black tracking-tighter">
          {data.headline}
        </h1>
        <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-hidden">
          {data.people?.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 border-b border-[#EEE] py-3">
              <span className="font-data text-xl font-extrabold text-[#CCC]">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{p.name}</p>
                <p className="truncate text-xs text-[#888]">{p.role}</p>
              </div>
              <span className="font-data shrink-0 text-xl font-extrabold text-[#FF4757]">{p.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

/* ────────────────────────────────────────────────────────────
   라우터
   ──────────────────────────────────────────────────────────── */

export function InstaCardPreview({ slide }: InstaCardPreviewProps) {
  switch (slide.layout) {
    case "photo-hook":
      return (slide.body?.length ?? 0) > 0 ? (
        <PhotoDimEditorialSlide data={slide} />
      ) : (
        <PhotoFullSlide data={slide} />
      );
    case "top10":
      return <Top10CardGrid headline={slide.headline} rows={slide.top10Items ?? []} highlightRank={slide.highlightRank} />;
    case "ranking":
      return (
        <DataRankList
          headline={slide.headline}
          rows={slide.rows ?? []}
          footer={slide.highlight}
          coverImage={slide.coverImage}
        />
      );
    case "unsold":
      return (
        <ScanRankList
          headline={slide.headline}
          rows={
            slide.topRegions?.map((r, i) => ({
              rank: i + 1,
              label: r.name,
              note: `미분양 ${r.count.toLocaleString()}호`,
              value: r.rate,
              highlight: i === 0,
            })) ?? []
          }
          footer={slide.conclusion ?? slide.highlight}
        />
      );
    case "hook":
      return <HookSlide data={slide} />;
    case "story":
      return <StorySlide data={slide} />;
    case "insight":
      return <InsightSlide data={slide} />;
    case "calendar":
      return <CalendarSlide data={slide} />;
    case "chart":
      return <ChartSlide data={slide} />;
    case "policy":
      return (slide.body?.length ?? 0) > 0 ? (
        <PhotoDimEditorialSlide data={slide} />
      ) : (
        <PolicySlide data={slide} />
      );
    default:
      return null;
  }
}
