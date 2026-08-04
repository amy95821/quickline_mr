"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CardSlide, ChartPoint, WinnerLoser } from "../lib/cardTypes";
import { BRAND_HANDLE } from "../lib/cardTypes";
import {
  C,
  CARD_SAFE,
  FONT_BODY,
  FONT_DATA,
  FONT_HEAD,
  FONT_PUNCH,
  INSET_X,
} from "../lib/designTokens";

interface InstaCardPreviewProps {
  slide: CardSlide;
}

const pad = (): CSSProperties => ({
  paddingTop: CARD_SAFE.top,
  paddingBottom: CARD_SAFE.bottom,
  paddingLeft: CARD_SAFE.x,
  paddingRight: CARD_SAFE.x,
});

function CardRoot({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={"relative flex aspect-square w-full flex-col overflow-hidden " + className}
      style={{ fontFamily: FONT_BODY, color: C.ink, ...style }}
    >
      {children}
    </div>
  );
}

function BrandMark({ dark }: { dark?: boolean }) {
  return (
    <span
      className={"absolute z-20 text-[8px] font-bold tracking-wider " + (dark ? "text-black/30" : "text-white/45")}
      style={{ right: CARD_SAFE.x, bottom: 14, fontFamily: FONT_HEAD }}
    >
      {BRAND_HANDLE}
    </span>
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

/** apt_lap — 흰 배경, 검은 pill, 큰 숫자 (SUIT) */
function DataRankList({
  headline,
  source,
  rows,
  footer,
}: {
  headline: string;
  source?: string;
  rows: RankRow[];
  footer?: string;
}) {
  const lines = headline.split("\n");
  return (
    <CardRoot className="bg-white">
      <div style={pad()}>
        {source && <p className="mb-2 text-[10px] font-bold text-[#888]" style={{ fontFamily: FONT_BODY }}>{source}</p>}
        <h1 className="whitespace-pre-line text-[28px] leading-[1.08] text-black" style={{ fontFamily: FONT_DATA }}>
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              <span className="text-[#FF4757]">{lines[1]}</span>
            </>
          )}
        </h1>
      </div>
      <ul className={INSET_X + " flex-1"}>
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
              <span className="w-7 text-[18px] font-extrabold tabular-nums text-[#CCC]" style={{ fontFamily: FONT_DATA }}>
                {row.rank}
              </span>
              <span className="shrink-0 bg-black px-3 py-1.5 text-[13px] font-bold text-white" style={{ fontFamily: FONT_HEAD }}>
                {row.label}
              </span>
              {note && <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-[#666]">{note}</span>}
              {row.value && (
                <span className="ml-auto shrink-0 text-[24px] font-extrabold tabular-nums text-black" style={{ fontFamily: FONT_DATA }}>
                  {row.value}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {footer && (
        <div className={INSET_X + " pb-10 pt-3"}>
          <p className="text-[13px] font-bold leading-snug" style={{ fontFamily: FONT_BODY }}>{footer}</p>
        </div>
      )}
      <BrandMark dark />
    </CardRoot>
  );
}

/** scan.real.data — 크림 + 네이비 헤더 + 라임 */
function ScanRankList({
  headline,
  source,
  rows,
  highlightRank,
  footer,
  coverImage,
}: {
  headline: string;
  source?: string;
  rows: RankRow[];
  highlightRank?: number;
  footer?: string;
  coverImage?: string;
}) {
  const lines = headline.split("\n");
  const hl = highlightRank;
  return (
    <CardRoot className="bg-[#F5F0E6]">
      {coverImage && (
        <div className="h-[90px] shrink-0 overflow-hidden">
          <img src={coverImage} alt="" crossOrigin="anonymous" className="h-full w-full object-cover" />
        </div>
      )}
      <div className={INSET_X + " pt-4"}>
        {source && <p className="mb-2 text-[9px] font-bold text-[#888]">{source}</p>}
        <div className="bg-[#1A1A1A] px-5 py-4">
          <h1 className="whitespace-pre-line text-[26px] leading-[1.1] text-white" style={{ fontFamily: FONT_PUNCH }}>
            {lines[0]}
            {lines[1] && (
              <>
                <br />
                <span className="text-[#CDFF00]">{lines[1]}</span>
              </>
            )}
          </h1>
        </div>
      </div>
      <ul className={INSET_X + " mt-3 flex-1"}>
        {rows.map((row, i) => {
          const isHl = row.highlight || row.rank === hl;
          const note = row.note ?? row.sub;
          return (
            <li
              key={row.rank}
              className={
                "flex items-center gap-2 border-b border-[#DDD] py-2.5 " +
                (i % 2 ? "bg-[#EDE8DF]/80" : "") +
                (isHl ? " ring-2 ring-inset ring-[#CDFF00]" : "")
              }
            >
              <span className="w-6 text-[14px] font-bold tabular-nums text-[#999]" style={{ fontFamily: FONT_DATA }}>{row.rank}</span>
              <span className="bg-black px-2 py-1 text-[12px] font-bold text-white" style={{ fontFamily: FONT_HEAD }}>{row.label}</span>
              {note && <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-[#666]">{note}</span>}
              {row.value && (
                <span className="ml-auto text-[20px] font-extrabold tabular-nums" style={{ fontFamily: FONT_DATA }}>{row.value}</span>
              )}
            </li>
          );
        })}
      </ul>
      {footer && <div className={INSET_X + " pb-10 pt-2 text-[12px] font-bold"}>{footer}</div>}
      <BrandMark dark />
    </CardRoot>
  );
}

/** 실사 풀블리드 — Jalnan */
function PhotoFullSlide({ data }: { data: CardSlide }) {
  const img = data.coverImage ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80";
  const lines = data.headline.split("\n");
  return (
    <CardRoot>
      <img src={img} alt="" crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      <div className="relative z-10 flex flex-1 flex-col justify-end" style={pad()}>
        <h1 className="text-[36px] leading-[1.05] text-white drop-shadow-lg" style={{ fontFamily: FONT_PUNCH }}>
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              <span className="text-[#CDFF00]">{lines[1]}</span>
            </>
          )}
        </h1>
        {data.subheadline && (
          <p className="mt-4 text-[15px] font-bold text-[#CDFF00]" style={{ fontFamily: FONT_BODY }}>{data.subheadline}</p>
        )}
      </div>
      <BrandMark />
    </CardRoot>
  );
}

/** 실사 + 본문 패널 — 클리핑형 */
function PhotoSplitSlide({ data }: { data: CardSlide }) {
  const img = data.coverImage ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80";
  const lines = data.headline.split("\n");
  return (
    <CardRoot className="bg-[#1A2744]">
      <div className="relative h-[44%] shrink-0 overflow-hidden">
        <img src={img} alt="" crossOrigin="anonymous" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2744] via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-0 right-0" style={{ paddingLeft: CARD_SAFE.x, paddingRight: CARD_SAFE.x }}>
          <h1 className="text-[30px] leading-[1.08] text-white" style={{ fontFamily: FONT_PUNCH }}>
            {lines[0]}
            {lines[1] && (
              <>
                <br />
                <span className="text-[#CDFF00]">{lines[1]}</span>
              </>
            )}
          </h1>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between" style={pad()}>
        <div className="space-y-3">
          {data.body?.map((line, i) => (
            <div key={i} className="flex gap-3">
              <span className="shrink-0 text-[14px] font-bold text-[#CDFF00]" style={{ fontFamily: FONT_DATA }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[15px] font-bold leading-[1.5] text-white/95">{line}</p>
            </div>
          ))}
        </div>
        {data.highlight && (
          <div className="mt-4 rounded-md bg-[#CDFF00] px-4 py-3">
            <p className="text-[14px] font-bold leading-snug text-[#1A2744]">{data.highlight}</p>
          </div>
        )}
      </div>
      <BrandMark />
    </CardRoot>
  );
}

export function InstaCardPreview({ slide }: InstaCardPreviewProps) {
  switch (slide.layout) {
    case "photo-hook":
      return (slide.body?.length ?? 0) > 0 ? <PhotoSplitSlide data={slide} /> : <PhotoFullSlide data={slide} />;
    case "top10":
      return slide.accent === "light" ? (
        <DataRankList headline={slide.headline} source={slide.source} rows={slide.top10Items ?? []} />
      ) : (
        <ScanRankList
          headline={slide.headline}
          source={slide.source}
          rows={slide.top10Items ?? []}
          highlightRank={slide.highlightRank}
          coverImage={slide.coverImage}
        />
      );
    case "ranking":
      return (
        <DataRankList
          headline={slide.headline}
          source={slide.source}
          rows={slide.rows ?? []}
          footer={slide.highlight}
        />
      );
    case "unsold":
      return (
        <ScanRankList
          headline={slide.headline}
          source={slide.source}
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
      return <PolicySlide data={slide} />;
    default:
      return null;
  }
}

function HookSlide({ data }: { data: CardSlide }) {
  const dark = data.accent === "dark";
  const lines = data.headline.split("\n");
  return (
    <CardRoot className={dark ? "bg-[#1A2744]" : "bg-[#F5F0E6]"}>
      <div className="flex flex-1 flex-col justify-center" style={pad()}>
        <h1
          className={"whitespace-pre-line text-[34px] leading-[1.08] " + (dark ? "text-white" : "text-black")}
          style={{ fontFamily: FONT_PUNCH }}
        >
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              <span className="text-[#CDFF00]">{lines[1]}</span>
            </>
          )}
        </h1>
        {data.subheadline && (
          <p className={"mt-4 text-[15px] font-bold " + (dark ? "text-[#CDFF00]" : "text-[#FF4757]")}>{data.subheadline}</p>
        )}
      </div>
      <BrandMark dark={!dark} />
    </CardRoot>
  );
}

function StorySlide({ data }: { data: CardSlide }) {
  const dark = (data.slideIndex ?? 1) % 2 === 0;
  return (
    <CardRoot className={dark ? "bg-[#1A2744]" : "bg-white"}>
      <div className="flex min-h-0 flex-1 flex-col justify-between" style={pad()}>
        <h2
          className={"text-[28px] leading-[1.12] " + (dark ? "text-white" : "text-black")}
          style={{ fontFamily: FONT_HEAD }}
        >
          {data.headline}
        </h2>
        <div className="my-5 space-y-4">
          {data.body?.map((line, i) => (
            <p key={i} className={"text-[16px] font-bold leading-[1.55] " + (dark ? "text-white/92" : "text-[#222]")}>
              {line}
            </p>
          ))}
        </div>
        {data.highlight && (
          <div className={"rounded-md px-4 py-3 " + (dark ? "bg-[#CDFF00]" : "bg-black")}>
            <p className={"text-[14px] font-bold " + (dark ? "text-[#1A2744]" : "text-[#CDFF00]")}>{data.highlight}</p>
          </div>
        )}
      </div>
      <BrandMark dark={!dark} />
    </CardRoot>
  );
}

function InsightSlide({ data }: { data: CardSlide }) {
  const lines = data.headline.split("\n");
  return (
    <CardRoot className="bg-white">
      <div style={pad()}>
        <h2 className="whitespace-pre-line text-[28px] leading-[1.1]" style={{ fontFamily: FONT_HEAD }}>
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              <span className="text-[#FF4757]">{lines[1]}</span>
            </>
          )}
        </h2>
        <div className="mt-5 space-y-3">
          {data.body?.map((line, i) => (
            <p key={i} className="border-l-4 border-black pl-4 text-[15px] font-bold leading-[1.5]">
              {line}
            </p>
          ))}
        </div>
        {data.highlight && (
          <p className="mt-5 text-[15px] font-bold text-[#FF4757]">{data.highlight}</p>
        )}
      </div>
      <BrandMark dark />
    </CardRoot>
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
    <CardRoot className="bg-[#F5F0E6]">
      <div style={pad()}>
        <h1 className="text-[24px] font-bold text-black" style={{ fontFamily: FONT_HEAD }}>{data.headline}</h1>
        <div className="mt-4 grid grid-cols-7 gap-px bg-[#CCC] text-[8px]">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className={"bg-white py-1.5 text-center font-bold " + (i === 0 ? "text-red-600" : "")}>{d}</div>
          ))}
          {cells.map((day, i) => {
            const ev = day ? eventMap.get(day) : null;
            return (
              <div key={i} className="flex min-h-[38px] flex-col bg-white p-1">
                {day && <span className="font-bold">{day}</span>}
                {ev && day === ev.day && <span className="mt-auto line-clamp-2 text-[6px] leading-tight">{ev.label}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <BrandMark dark />
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
    const y = h - ((p.value - min) / range) * (h - 8) - 4;
    return { x, y, v: p.value };
  });
  return (
    <div className="mb-3 border-t border-[#DDD] pt-3">
      <div className="mb-1 flex justify-between">
        <span className="text-[11px] font-bold text-[#888]">{label}</span>
        <span className="text-[18px] font-extrabold tabular-nums" style={{ color, fontFamily: FONT_DATA }}>
          {pts[pts.length - 1]?.v}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={color} strokeWidth="3" />
      </svg>
    </div>
  );
}

function ChartSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-white">
      <div style={pad()}>
        <h1 className="whitespace-pre-line text-[26px] leading-[1.1]" style={{ fontFamily: FONT_HEAD }}>{data.headline}</h1>
        {data.source && <p className="mt-1 text-[10px] text-[#888]">{data.source}</p>}
        {data.priceSeries && data.priceLabel && <LineChart series={data.priceSeries} color={C.black} label={data.priceLabel} />}
        {data.supplySeries && data.supplyLabel && <LineChart series={data.supplySeries} color={C.coral} label={data.supplyLabel} />}
        {data.conclusion && (
          <p className="mt-4 border-l-4 border-[#CDFF00] pl-4 text-[16px] font-bold leading-[1.45]">{data.conclusion}</p>
        )}
        <WinnerList items={data.winnersLosers} />
      </div>
      <BrandMark dark />
    </CardRoot>
  );
}

function WinnerList({ items }: { items?: WinnerLoser[] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((w, i) => (
        <li key={i} className="text-[12px] font-bold">
          {w.side === "winner" ? "↑" : w.side === "loser" ? "↓" : "·"} {w.label} — {w.reason}
        </li>
      ))}
    </ul>
  );
}

function PolicySlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-white">
      <div style={pad()}>
        <h1 className="whitespace-pre-line text-[26px]" style={{ fontFamily: FONT_HEAD }}>{data.headline}</h1>
        <div className="mt-4 space-y-3">
          {data.people?.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 border-b border-[#EEE] py-3">
              <span className="text-[22px] font-extrabold text-[#CCC]" style={{ fontFamily: FONT_DATA }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-bold">{p.name}</p>
                <p className="text-[11px] text-[#888]">{p.role}</p>
              </div>
              <span className="text-[22px] font-extrabold text-[#FF4757]" style={{ fontFamily: FONT_DATA }}>{p.stat}</span>
            </div>
          ))}
        </div>
        {data.body?.map((line, i) => (
          <p key={i} className="mt-2 text-[14px] font-bold">· {line}</p>
        ))}
        {data.highlight && <p className="mt-4 text-[14px] font-bold text-[#FF4757]">{data.highlight}</p>}
      </div>
      <BrandMark dark />
    </CardRoot>
  );
}
