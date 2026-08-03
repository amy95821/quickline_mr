"use client";

import type { CardSlide, ChartPoint, WinnerLoser } from "../lib/cardTypes";
import { BRAND_HANDLE } from "../lib/cardTypes";

interface InstaCardPreviewProps {
  slide: CardSlide;
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

function SlideCounter({ index, total }: { index?: number; total?: number }) {
  if (!index || !total || total <= 1) return null;
  return (
    <span className="absolute right-5 top-4 text-[10px] font-semibold opacity-45">
      {index}/{total}
    </span>
  );
}

function SourceLine({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-[8px] leading-relaxed opacity-40">{text}</p>;
}

function HighlightBox({ text, variant = "dark" }: { text: string; variant?: "dark" | "green" }) {
  const bg = variant === "green" ? "#1B3D34" : "#111111";
  return (
    <div className="mt-3 px-3 py-2.5 text-[11px] font-bold leading-snug text-white" style={{ backgroundColor: bg }}>
      {text}
    </div>
  );
}

function WinnerLoserList({ items }: { items?: WinnerLoser[] }) {
  if (!items?.length) return null;
  const colors = { winner: "#1B3D34", loser: "#C45C4A", neutral: "#666" };
  const labels = { winner: "↑", loser: "↓", neutral: "·" };
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((w, i) => (
        <li key={i} className="flex gap-2 text-[10px] leading-snug">
          <span className="font-bold" style={{ color: colors[w.side] }}>
            {labels[w.side]}
          </span>
          <span>
            <strong>{w.label}</strong>
            <span className="opacity-55"> — {w.reason}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── Hook (corp.inside style) ── */
function HookSlide({ data }: { data: CardSlide }) {
  return (
    <div
      className="relative flex aspect-square w-full flex-col justify-end overflow-hidden font-[family-name:var(--font-pretendard)]"
      style={{ backgroundColor: "#111", color: "#fff" }}
    >
      <SlideCounter index={data.slideIndex} total={data.totalSlides} />
      <div className="px-8 pb-16 pt-10">
        <h1 className="text-[26px] font-extrabold leading-[1.2] tracking-tight">{data.headline}</h1>
        {data.subheadline && (
          <p className="mt-3 text-[15px] font-semibold leading-snug opacity-80">{data.subheadline}</p>
        )}
      </div>
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}

/* ── Story text slide ── */
function StorySlide({ data }: { data: CardSlide }) {
  return (
    <div className="relative flex aspect-square w-full flex-col bg-white font-[family-name:var(--font-pretendard)] text-[#111]">
      <SlideCounter index={data.slideIndex} total={data.totalSlides} />
      <div className="flex flex-1 flex-col px-7 pb-14 pt-10">
        <h2 className="text-[20px] font-extrabold leading-tight">{data.headline}</h2>
        <ul className="mt-5 flex-1 space-y-3">
          {data.body?.map((line, i) => (
            <li key={i} className="text-[13px] font-medium leading-[1.55]">
              {line}
            </li>
          ))}
        </ul>
        {data.highlight && <HighlightBox text={data.highlight} variant="dark" />}
      </div>
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}

/* ── Insight conclusion ── */
function InsightSlide({ data }: { data: CardSlide }) {
  const dark = data.accent === "dark";
  return (
    <div
      className="relative flex aspect-square w-full flex-col font-[family-name:var(--font-pretendard)]"
      style={{
        backgroundColor: dark ? "#111" : data.accent === "green" ? "#F5F0E8" : "#fff",
        color: dark ? "#fff" : "#111",
      }}
    >
      <SlideCounter index={data.slideIndex} total={data.totalSlides} />
      <div className="flex flex-1 flex-col px-7 pb-14 pt-9">
        {data.subheadline && (
          <p className={`text-[13px] font-bold ${dark ? "opacity-70" : "opacity-50"}`}>
            {data.subheadline}
          </p>
        )}
        <h2 className="mt-1 text-[22px] font-extrabold leading-tight">{data.headline}</h2>
        {data.body && (
          <ul className="mt-4 space-y-2">
            {data.body.map((line, i) => (
              <li key={i} className="text-[12px] font-medium leading-[1.55] opacity-90">
                {line}
              </li>
            ))}
          </ul>
        )}
        {data.highlight && (
          <HighlightBox text={data.highlight} variant={data.accent === "green" ? "green" : "dark"} />
        )}
        <WinnerLoserList items={data.winnersLosers} />
      </div>
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}

/* ── Calendar (apt_lap style) ── */
const EVENT_COLORS: Record<string, string> = {
  tax: "#111",
  policy: "#1B3D34",
  supply: "#2563EB",
  rate: "#C45C4A",
  general: "#555",
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
    <div className="relative flex aspect-square w-full flex-col bg-white font-[family-name:var(--font-pretendard)] text-[#111]">
      <div className="border-b border-black/10 px-5 pb-3 pt-5">
        <SourceLine text={data.source ?? `* ${year}년 ${month}월 ver.`} />
        <h1 className="mt-1 text-[18px] font-extrabold leading-tight">{data.headline}</h1>
        {data.subheadline && (
          <p className="mt-0.5 text-[10px] font-medium opacity-50">{data.subheadline}</p>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-12 pt-3">
        <div className="grid grid-cols-7 gap-px bg-black/10 text-[8px]">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div
              key={d}
              className={`bg-[#f5f5f5] py-1 text-center font-bold ${i === 0 ? "text-red-600" : i === 6 ? "text-blue-600" : ""}`}
            >
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const ev = day ? eventMap.get(day) : null;
            const dow = i % 7;
            const bg = ev ? EVENT_COLORS[ev.type ?? "general"] : "#fff";
            const fg = ev ? "#fff" : dow === 0 ? "#dc2626" : dow === 6 ? "#2563eb" : "#111";
            return (
              <div
                key={i}
                className="flex min-h-[36px] flex-col border border-black/[0.04] p-0.5"
                style={{ backgroundColor: ev ? bg : "#fff", color: ev ? "#fff" : fg }}
              >
                {day && <span className="text-[9px] font-bold">{day}</span>}
                {ev && day === ev.day && (
                  <span className="mt-auto line-clamp-3 text-[6.5px] font-semibold leading-tight">
                    {ev.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}

/* ── Chart / data compare ── */
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
    <div className="mb-2">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] font-bold">{label}</span>
        <span className="text-[9px] font-bold tabular-nums" style={{ color }}>
          {pts[pts.length - 1]?.v}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
        <polyline points={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={h - 1} fontSize="7" fill="#999" textAnchor="middle">
            {p.l}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ChartSlide({ data }: { data: CardSlide }) {
  return (
    <div className="relative flex aspect-square w-full flex-col bg-white font-[family-name:var(--font-pretendard)] text-[#111]">
      <div className="bg-[#111] px-5 py-4 text-white">
        <SourceLine text={data.source} />
        <h2 className="mt-1 text-[15px] font-extrabold leading-snug">{data.headline}</h2>
        {data.subheadline && <p className="mt-0.5 text-[10px] opacity-60">{data.subheadline}</p>}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-14 pt-4">
        {data.priceSeries && data.priceLabel && (
          <LineChart series={data.priceSeries} color="#C45C4A" label={data.priceLabel} />
        )}
        {data.supplySeries && data.supplyLabel && (
          <LineChart series={data.supplySeries} color="#1B3D34" label={data.supplyLabel} />
        )}
        {data.conclusion && <HighlightBox text={data.conclusion} variant="green" />}
        <WinnerLoserList items={data.winnersLosers} />
      </div>
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}

/* ── Ranking (apt_lap list) ── */
function RankingSlide({ data }: { data: CardSlide }) {
  return (
    <div className="relative flex aspect-square w-full flex-col bg-white font-[family-name:var(--font-pretendard)] text-[#111]">
      <div className="bg-[#111] px-5 py-4 text-white">
        <SourceLine text={data.source} />
        <h2 className="mt-1 text-[16px] font-extrabold">{data.headline}</h2>
        {data.subheadline && <p className="text-[10px] opacity-60">{data.subheadline}</p>}
      </div>
      <ul className="flex-1 overflow-hidden px-0 pb-12">
        {data.rows?.map((row, i) => (
          <li
            key={row.rank}
            className={`flex items-center gap-2 border-b border-black/5 px-4 py-2.5 ${i % 2 ? "bg-[#fafafa]" : ""}`}
          >
            <span className="w-4 text-[11px] font-bold tabular-nums opacity-40">{row.rank}</span>
            <span className="min-w-[44px] bg-[#111] px-2 py-1 text-[10px] font-bold text-white">
              {row.label}
            </span>
            <div className="min-w-0 flex-1">
              {row.sub && <p className="truncate text-[10px] opacity-60">{row.sub}</p>}
            </div>
            <span className={`text-[13px] font-extrabold tabular-nums ${row.highlight ? "text-[#C45C4A]" : ""}`}>
              {row.value}
            </span>
          </li>
        ))}
      </ul>
      {data.highlight && (
        <div className="mx-4 mb-10">
          <HighlightBox text={data.highlight} variant="dark" />
        </div>
      )}
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}

/* ── Policy (apt_lap faces) ── */
function PolicySlide({ data }: { data: CardSlide }) {
  return (
    <div className="relative flex aspect-square w-full flex-col bg-white font-[family-name:var(--font-pretendard)] text-[#111]">
      <div className="border-b-4 border-[#111] px-5 py-3">
        <SourceLine text={data.source} />
        <h2 className="text-[17px] font-extrabold leading-tight">{data.headline}</h2>
        {data.subheadline && <p className="mt-0.5 text-[11px] font-semibold">{data.subheadline}</p>}
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 px-3 pb-14 pt-3">
        {data.people?.map((p) => (
          <div key={p.name} className="flex flex-col border border-black/10">
            <div className="flex h-16 items-center justify-center bg-[#e8e8e8]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ccc] text-[14px] font-bold text-white">
                {p.name.slice(0, 1)}
              </div>
            </div>
            <div className="bg-[#111] px-1 py-1 text-center text-[8px] font-bold text-white">{p.role}</div>
            <div className="flex flex-1 flex-col items-center justify-center p-2 text-center">
              <p className="text-[18px] font-extrabold tabular-nums">{p.stat}</p>
              <p className="text-[8px] opacity-50">{p.statLabel}</p>
            </div>
          </div>
        ))}
      </div>
      {data.body && (
        <ul className="space-y-1 px-5 pb-3">
          {data.body.map((line, i) => (
            <li key={i} className="text-[10px] font-medium leading-snug">
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
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}

/* ── Unsold ── */
function UnsoldSlide({ data }: { data: CardSlide }) {
  return (
    <div className="relative flex aspect-square w-full flex-col bg-white font-[family-name:var(--font-pretendard)] text-[#111]">
      <div className="bg-[#111] px-5 py-4 text-white">
        <SourceLine text={data.source} />
        <h2 className="mt-1 text-[16px] font-extrabold">{data.headline}</h2>
        {data.subheadline && <p className="text-[10px] opacity-60">{data.subheadline}</p>}
      </div>
      <ul className="flex-1 space-y-0 px-4 pb-4 pt-4">
        {data.topRegions?.map((r, i) => (
          <li key={r.name} className="border-b border-black/5 py-3">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold opacity-30">{i + 1}</span>
                <span className="text-[14px] font-extrabold">{r.name}</span>
              </div>
              <span className="text-[15px] font-extrabold tabular-nums text-[#C45C4A]">{r.rate}</span>
            </div>
            <p className="mt-0.5 pl-6 text-[10px] opacity-50">미분양 {r.count.toLocaleString()}호</p>
            <div className="mt-1.5 h-2 w-full bg-black/5">
              <div
                className="h-full bg-[#C45C4A]"
                style={{ width: `${Math.min(parseFloat(r.rate), 100)}%` }}
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
      <span className="absolute bottom-4 right-5 text-[9px] opacity-30">{BRAND_HANDLE}</span>
    </div>
  );
}
