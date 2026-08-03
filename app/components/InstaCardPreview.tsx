"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CardSlide, ChartPoint, WinnerLoser } from "../lib/cardTypes";
import { BRAND_HANDLE } from "../lib/cardTypes";
import { C, GRAD, CARD_FONT_FAMILY } from "../lib/designTokens";

interface InstaCardPreviewProps {
  slide: CardSlide;
}

/** 인스타 카드(정사각) 전용 루트 — 폰트·비율 고정 */
function CardRoot({
  children,
  style,
  className = "",
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={"relative flex aspect-square w-full flex-col overflow-hidden " + className}
      style={{ fontFamily: CARD_FONT_FAMILY, fontWeight: 700, ...style }}
    >
      {children}
    </div>
  );
}

export function InstaCardPreview({ slide }: InstaCardPreviewProps) {
  switch (slide.layout) {
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
    case "ranking":
      return <RankingSlide data={slide} />;
    case "policy":
      return <PolicySlide data={slide} />;
    case "unsold":
      return <UnsoldSlide data={slide} />;
    default:
      return null;
  }
}

function BrandMark() {
  return (
    <span className="absolute bottom-4 right-5 text-[9px] font-bold tracking-wide text-[#1565C0]/40">
      {BRAND_HANDLE}
    </span>
  );
}

function SourceLine({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-[8px] font-medium leading-relaxed text-white/70">{text}</p>;
}

function SourceLineDark({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-[8px] font-medium leading-relaxed text-[#1565C0]/50">{text}</p>;
}

function HighlightBox({
  text,
  variant = "blue",
}: {
  text: string;
  variant?: "blue" | "green";
}) {
  const bg = variant === "green" ? GRAD.highlightGreen : GRAD.highlightBlue;
  return (
    <div
      className="mt-3 rounded-xl px-3 py-2.5 text-[13px] leading-snug text-white shadow-lg"
      style={{ background: bg }}
    >
      {text}
    </div>
  );
}

function WinnerLoserList({ items }: { items?: WinnerLoser[] }) {
  if (!items?.length) return null;
  const colors = { winner: C.greenDeep, loser: C.coral, neutral: C.blueDeep };
  const labels = { winner: "WIN", loser: "LOSE", neutral: "·" };
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((w, i) => (
        <li key={i} className="flex gap-2 text-[12px] leading-snug">
          <span
            className="shrink-0 rounded px-1 text-[9px] font-bold text-white"
            style={{ backgroundColor: colors[w.side] }}
          >
            {labels[w.side]}
          </span>
          <span className="text-[#0D2137]">
            <strong>{w.label}</strong>
            <span className="text-[#1565C0]/70"> — {w.reason}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function HookSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="justify-end text-white" style={{ background: GRAD.hook }}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-[#69F0AE]/40" />
      <div className="relative px-8 pb-16 pt-10">
        <h1 className="text-[30px] leading-[1.12] tracking-tight drop-shadow-md">{data.headline}</h1>
        {data.subheadline && (
          <p className="mt-3 text-[17px] leading-snug text-white/95">{data.subheadline}</p>
        )}
      </div>
      <BrandMark />
    </CardRoot>
  );
}

function StorySlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="text-[#0D2137]" style={{ background: GRAD.cardBg }}>
      <div className="h-2 w-full" style={{ background: GRAD.header }} />
      <div className="flex flex-1 flex-col px-7 pb-14 pt-8">
        <h2 className="text-[24px] leading-tight text-[#1565C0]">{data.headline}</h2>
        <ul className="mt-5 flex-1 space-y-3">
          {data.body?.map((line, i) => (
            <li
              key={i}
              className="rounded-xl border border-[#42A5F5]/20 bg-white/85 px-3 py-2.5 text-[14px] leading-[1.5] shadow-sm"
            >
              {line}
            </li>
          ))}
        </ul>
        {data.highlight && <HighlightBox text={data.highlight} variant="green" />}
      </div>
      <BrandMark />
    </CardRoot>
  );
}

function InsightSlide({ data }: { data: CardSlide }) {
  const vivid = data.accent === "dark" || data.accent === "green";
  return (
    <CardRoot
      className={vivid ? "text-white" : "text-[#0D2137]"}
      style={{ background: vivid ? GRAD.hook : GRAD.cardBg }}
    >
      {!vivid && <div className="h-2 w-full" style={{ background: GRAD.header }} />}
      <div className="flex flex-1 flex-col px-7 pb-14 pt-8">
        {data.subheadline && (
          <p className={`text-[13px] ${vivid ? "text-white/80" : "text-[#2196F3]"}`}>
            {data.subheadline}
          </p>
        )}
        <h2 className="mt-1 text-[26px] leading-tight">{data.headline}</h2>
        {data.body && (
          <ul className="mt-4 space-y-2">
            {data.body.map((line, i) => (
              <li
                key={i}
                className={`text-[14px] leading-[1.55] ${vivid ? "text-white/95" : ""}`}
              >
                {line}
              </li>
            ))}
          </ul>
        )}
        {data.highlight && (
          <HighlightBox text={data.highlight} variant={vivid ? "green" : "blue"} />
        )}
        {!vivid && <WinnerLoserList items={data.winnersLosers} />}
      </div>
      <BrandMark />
    </CardRoot>
  );
}

const EVENT_COLORS: Record<string, string> = {
  tax: C.blueDeep,
  policy: C.greenDeep,
  supply: C.blue,
  rate: C.coral,
  general: "#78909C",
};

function CalendarSlide({ data }: { data: CardSlide }) {
  const month = data.month ?? 1;
  const year = data.year ?? 2026;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const eventMap = new Map<number, NonNullable<CardSlide["events"]>[number]>();
  for (const ev of data.events ?? []) {
    const end = ev.endDay ?? ev.day;
    for (let d = ev.day; d <= end; d++) {
      if (!eventMap.has(d)) eventMap.set(d, ev);
    }
  }
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <CardRoot className="bg-white text-[#0D2137]">
      <div className="px-5 py-4 text-white" style={{ background: GRAD.header }}>
        <SourceLine text={data.source ?? `* ${year}년 ${month}월 ver.`} />
        <h1 className="mt-1 text-[20px] leading-tight">{data.headline}</h1>
        {data.subheadline && (
          <p className="mt-0.5 text-[11px] font-medium text-white/80">{data.subheadline}</p>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-12 pt-3">
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-[#2196F3]/20 text-[8px]">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div
              key={d}
              className={`bg-[#E3F2FD] py-1.5 text-center font-bold ${i === 0 ? "text-red-500" : i === 6 ? "text-[#2196F3]" : "text-[#1565C0]"}`}
            >
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const ev = day ? eventMap.get(day) : null;
            const dow = i % 7;
            const bg = ev ? EVENT_COLORS[ev.type ?? "general"] : "#fff";
            const fg = ev ? "#fff" : dow === 0 ? "#ef4444" : dow === 6 ? C.blue : C.ink;
            return (
              <div
                key={i}
                className="flex min-h-[36px] flex-col p-0.5"
                style={{ backgroundColor: ev ? bg : "#fff", color: fg }}
              >
                {day && <span className="text-[9px] font-bold">{day}</span>}
                {ev && day === ev.day && (
                  <span className="mt-auto line-clamp-3 text-[6.5px] font-bold leading-tight">
                    {ev.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <BrandMark />
    </CardRoot>
  );
}

function LineChart({ series, color, label }: { series: ChartPoint[]; color: string; label: string }) {
  const max = Math.max(...series.map((p) => p.value));
  const min = Math.min(...series.map((p) => p.value));
  const range = max - min || 1;
  const w = 280;
  const h = 56;
  const pts = series.map((p, i) => {
    const x = (i / Math.max(series.length - 1, 1)) * w;
    const y = h - ((p.value - min) / range) * (h - 10) - 5;
    return { x, y, v: p.value, l: p.label };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="mb-2 rounded-xl bg-white/80 p-2 shadow-sm">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[11px] font-bold text-[#1565C0]">{label}</span>
        <span className="text-[10px] font-bold tabular-nums" style={{ color }}>
          {pts[pts.length - 1]?.v}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
        <polyline points={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function ChartSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="text-[#0D2137]" style={{ background: GRAD.cardBg }}>
      <div className="px-5 py-4 text-white" style={{ background: GRAD.header }}>
        <SourceLine text={data.source} />
        <h2 className="mt-1 text-[17px] font-bold leading-snug">{data.headline}</h2>
        {data.subheadline && (
          <p className="mt-0.5 text-[11px] font-medium text-white/80">{data.subheadline}</p>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-14 pt-3">
        {data.priceSeries && data.priceLabel && (
          <LineChart series={data.priceSeries} color={C.blue} label={data.priceLabel} />
        )}
        {data.supplySeries && data.supplyLabel && (
          <LineChart series={data.supplySeries} color={C.green} label={data.supplyLabel} />
        )}
        {data.conclusion && <HighlightBox text={data.conclusion} variant="green" />}
        <WinnerLoserList items={data.winnersLosers} />
      </div>
      <BrandMark />
    </CardRoot>
  );
}

function RankingSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-white text-[#0D2137]">
      <div className="px-5 py-4 text-white" style={{ background: GRAD.header }}>
        <SourceLine text={data.source} />
        <h2 className="mt-1 text-[18px] font-bold">{data.headline}</h2>
        {data.subheadline && <p className="text-[11px] font-medium text-white/80">{data.subheadline}</p>}
      </div>
      <ul className="flex-1 overflow-hidden">
        {data.rows?.map((row, i) => (
          <li
            key={row.rank}
            className={`flex items-center gap-2 border-b border-[#2196F3]/10 px-4 py-2.5 ${i % 2 ? "bg-[#E3F2FD]/50" : ""}`}
          >
            <span className="w-5 text-[12px] font-bold tabular-nums text-[#2196F3]">{row.rank}</span>
            <span
              className="min-w-[44px] rounded-md px-2 py-1 text-[10px] font-bold text-white"
              style={{ background: GRAD.highlightBlue }}
            >
              {row.label}
            </span>
            <div className="min-w-0 flex-1">
              {row.sub && <p className="truncate text-[10px] font-medium text-[#1565C0]/60">{row.sub}</p>}
            </div>
            <span
              className={`text-[14px] font-bold tabular-nums ${row.highlight ? "text-[#00C853]" : "text-[#1565C0]"}`}
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>
      {data.highlight && (
        <div className="mx-4 mb-10">
          <HighlightBox text={data.highlight} variant="blue" />
        </div>
      )}
      <BrandMark />
    </CardRoot>
  );
}

function PolicySlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="text-[#0D2137]" style={{ background: GRAD.cardBg }}>
      <div className="border-b-4 border-[#00C853] px-5 py-3">
        <SourceLineDark text={data.source} />
        <h2 className="text-[18px] font-bold leading-tight text-[#1565C0]">{data.headline}</h2>
        {data.subheadline && (
          <p className="mt-0.5 text-[12px] font-bold text-[#00C853]">{data.subheadline}</p>
        )}
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 px-3 pb-4 pt-3">
        {data.people?.map((p) => (
          <div key={p.name} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex h-14 items-center justify-center bg-gradient-to-br from-[#E3F2FD] to-[#E8F8F5]">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold text-white"
                style={{ background: GRAD.highlightBlue }}
              >
                {p.name.slice(0, 1)}
              </div>
            </div>
            <div className="bg-[#1565C0] px-1 py-1 text-center text-[8px] font-bold text-white">
              {p.role}
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-2 text-center">
              <p className="text-[18px] font-bold tabular-nums text-[#00C853]">{p.stat}</p>
              <p className="text-[8px] font-medium text-[#1565C0]/60">{p.statLabel}</p>
            </div>
          </div>
        ))}
      </div>
      {data.body && (
        <ul className="space-y-1 px-5 pb-2">
          {data.body.map((line, i) => (
            <li key={i} className="text-[11px] font-medium leading-snug">
              · {line}
            </li>
          ))}
        </ul>
      )}
      {data.highlight && (
        <div className="mx-4 mb-10">
          <HighlightBox text={data.highlight} variant="green" />
        </div>
      )}
      <BrandMark />
    </CardRoot>
  );
}

function UnsoldSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-white text-[#0D2137]">
      <div className="px-5 py-4 text-white" style={{ background: GRAD.header }}>
        <SourceLine text={data.source} />
        <h2 className="mt-1 text-[18px] font-bold">{data.headline}</h2>
        {data.subheadline && <p className="text-[11px] font-medium text-white/80">{data.subheadline}</p>}
      </div>
      <ul className="flex-1 space-y-0 px-4 pb-4 pt-4">
        {data.topRegions?.map((r, i) => (
          <li key={r.name} className="border-b border-[#2196F3]/10 py-3">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold text-[#2196F3]">{i + 1}</span>
                <span className="text-[15px] font-bold">{r.name}</span>
              </div>
              <span className="text-[16px] font-bold tabular-nums text-[#FF6B6B]">{r.rate}</span>
            </div>
            <p className="mt-0.5 pl-6 text-[10px] font-medium text-[#1565C0]/50">
              미분양 {r.count.toLocaleString()}호
            </p>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#E3F2FD]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(parseFloat(r.rate), 100)}%`,
                  background: GRAD.highlightGreen,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      {data.conclusion && (
        <div className="mx-4 mb-10">
          <HighlightBox text={data.conclusion} variant="green" />
        </div>
      )}
      <BrandMark />
    </CardRoot>
  );
}
