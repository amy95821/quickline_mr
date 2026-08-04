"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CardSlide, ChartPoint, WinnerLoser } from "../lib/cardTypes";
import { BRAND_HANDLE } from "../lib/cardTypes";
import { C, FONT_BODY, FONT_DISPLAY } from "../lib/designTokens";

interface InstaCardPreviewProps {
  slide: CardSlide;
}

function seed(data: CardSlide): number {
  let h = data.slideIndex ?? 1;
  for (const c of data.headline) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

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
      style={{ fontFamily: FONT_BODY, color: C.ink, ...style }}
    >
      {children}
    </div>
  );
}

function Display({
  children,
  as: Tag = "h2",
  className = "",
  style,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className={className}
      style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.02em", ...style }}
    >
      {children}
    </Tag>
  );
}

function Body({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={"leading-[1.65] " + className} style={{ fontFamily: FONT_BODY, ...style }}>
      {children}
    </p>
  );
}

function Rule({ w = "w-16", className = "" }: { w?: string; className?: string }) {
  return <div className={"h-[2px] bg-[#1A1A1A] " + w + " " + className} />;
}

export function InstaCardPreview({ slide }: InstaCardPreviewProps) {
  switch (slide.layout) {
    case "hook":
      return <HookSlide data={slide} />;
    case "photo-hook":
      return <PhotoHookSlide data={slide} />;
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
    case "top10":
      return <Top10Slide data={slide} />;
    default:
      return null;
  }
}

function BrandMark() {
  return (
    <span
      className="absolute bottom-5 right-6 z-10 text-[8px] tracking-[0.2em] text-white/50"
      style={{ fontFamily: FONT_BODY }}
    >
      {BRAND_HANDLE}
    </span>
  );
}

function BrandMarkDark() {
  return (
    <span
      className="absolute bottom-5 right-6 text-[8px] tracking-[0.2em] text-black/30"
      style={{ fontFamily: FONT_BODY }}
    >
      {BRAND_HANDLE}
    </span>
  );
}

/** 기사 베스트댓글·무한도전식 리액션 */
function CommentBubble({ comment, reaction }: { comment?: string; reaction?: string }) {
  if (!comment && !reaction) return null;
  return (
    <div className="relative z-10 mt-3 max-w-[92%]">
      {reaction && (
        <p
          className="mb-1 text-[10px] tracking-wide text-[#D4A017]"
          style={{ fontFamily: FONT_BODY }}
        >
          {reaction}
        </p>
      )}
      {comment && (
        <div
          className="rounded-sm bg-white px-3 py-2 text-[11px] leading-[1.45] text-[#1A1A1A] shadow-md"
          style={{ fontFamily: FONT_BODY }}
        >
          <span className="text-black/35">💬 </span>
          {comment}
        </div>
      )}
    </div>
  );
}

function LogoStrip({ urls }: { urls?: string[] }) {
  if (!urls?.length) return null;
  return (
    <div className="absolute right-4 top-4 z-10 flex gap-2">
      {urls.slice(0, 3).map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          crossOrigin="anonymous"
          className="h-7 w-auto max-w-[48px] object-contain bg-white/90 p-1"
        />
      ))}
    </div>
  );
}

/** 실사·로고 커버 — 1장 후킹 */
function PhotoHookSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-[#111] text-white">
      {data.coverImage && (
        <img
          src={data.coverImage}
          alt=""
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/55" />
      <LogoStrip urls={data.logoImages} />
      <div className="relative z-[1] flex flex-1 flex-col justify-end px-7 pb-14 pt-10">
        {data.subheadline && (
          <Body className="mb-2 text-[11px] text-white/65">{data.subheadline}</Body>
        )}
        <Display as="h1" className="whitespace-pre-line text-[32px] leading-[1.06] text-white">
          {data.headline}
        </Display>
        <CommentBubble comment={data.bestComment} reaction={data.reactionLine} />
      </div>
      <BrandMark />
    </CardRoot>
  );
}

/** TOP10 — 비대칭 순위 */
function Top10Slide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-[#FAF8F4]">
      <div className="px-6 pb-3 pt-8">
        <Display className="text-[22px] leading-tight">{data.headline}</Display>
        {data.subheadline && (
          <Body className="mt-1 text-[11px] text-[#C0392B]">{data.subheadline}</Body>
        )}
      </div>
      <ul className="flex-1 overflow-hidden px-4 pb-12">
        {data.top10Items?.map((item, i) => (
          <li
            key={item.rank}
            className="flex items-baseline gap-2 border-b border-black/8 py-2"
            style={{ paddingLeft: (i % 3) * 6 }}
          >
            <Display as="span" className="w-7 shrink-0 text-[22px] tabular-nums text-black/18">
              {item.rank}
            </Display>
            <div className="min-w-0 flex-1">
              <Body className="text-[13px] font-bold">{item.label}</Body>
              <Body className="text-[10px] text-black/45">{item.note}</Body>
            </div>
          </li>
        ))}
      </ul>
      {data.bestComment && (
        <div className="absolute bottom-12 left-5 right-5">
          <CommentBubble comment={data.bestComment} />
        </div>
      )}
      <BrandMarkDark />
    </CardRoot>
  );
}

function WinnerLoserList({ items }: { items?: WinnerLoser[]; invert?: boolean }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-4 space-y-2">
      {items.map((w, i) => (
        <li key={i} className="text-[12px] leading-[1.55]">
          <span className="mr-1.5 text-[10px] text-black/35">
            {w.side === "winner" ? "↑" : w.side === "loser" ? "↓" : "·"}
          </span>
          {w.label}
          <span className="text-black/45"> — {w.reason}</span>
        </li>
      ))}
    </ul>
  );
}

/** 표지 — 종이 질감, 제목 좌하단 치우침 */
function HookSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-[#F4F0E8]">
      <div
        className="absolute right-6 top-8 max-w-[42%] text-right text-[11px] leading-[1.5] text-black/50"
        style={{ fontFamily: FONT_BODY }}
      >
        {data.subheadline}
      </div>
      <div className="absolute left-0 top-[38%] h-px w-[72%] bg-black/80" />
      <div className="flex flex-1 flex-col justify-end pb-16 pl-8 pr-10 pt-6">
        <Display as="h1" className="whitespace-pre-line text-[34px] leading-[1.05]">
          {data.headline}
        </Display>
        <Rule w="w-10" className="mt-5" />
        <CommentBubble comment={data.bestComment} reaction={data.reactionLine} />
      </div>
      <BrandMarkDark />
    </CardRoot>
  );
}

/** 본문 — 3가지 비대칭 레이아웃, 번호·박스 템플릿 없음 */
function StorySlide({ data }: { data: CardSlide }) {
  const s = seed(data) % 3;

  if (s === 0) {
    return (
      <CardRoot className="bg-white">
        <div className="flex flex-1 pb-16 pl-6 pr-8 pt-12">
          <div className="mr-4 w-8 shrink-0 pt-1">
            <Display as="span" className="text-[42px] leading-none text-black/15">
              {data.slideIndex ?? ""}
            </Display>
          </div>
          <div className="min-w-0 flex-1">
            <Display className="text-[26px] leading-[1.15]">{data.headline}</Display>
            <div className="mt-6 space-y-4">
              {data.body?.map((line, i) => (
                <Body key={i} className="text-[14px]">
                  {line}
                </Body>
              ))}
            </div>
            {data.highlight && (
              <Body className="mt-6 border-t border-black/15 pt-4 text-[13px] italic text-black/70">
                {data.highlight}
              </Body>
            )}
          </div>
        </div>
        <BrandMarkDark />
      </CardRoot>
    );
  }

  if (s === 1) {
    return (
      <CardRoot className="bg-[#1A1A1A] text-[#F4F0E8]">
        <div className="px-9 pb-16 pt-14">
          <Body className="text-[10px] tracking-[0.25em] text-white/40">NOTE</Body>
          <Display as="h2" className="mt-3 text-[28px] leading-[1.12] text-white">
            {data.headline}
          </Display>
          <Rule w="w-full" className="mt-5 bg-white/30" />
          <div className="mt-7 space-y-5">
            {data.body?.map((line, i) => (
              <Body key={i} className="text-[14px] text-white/88" style={{ paddingLeft: i % 2 ? 16 : 0 }}>
                {line}
              </Body>
            ))}
          </div>
          {data.highlight && (
            <Body className="mt-8 text-[13px] text-[#D4A017]">{data.highlight}</Body>
          )}
        </div>
        <BrandMark />
      </CardRoot>
    );
  }

  return (
    <CardRoot className="bg-[#FAF8F4]">
      <Display
        as="h2"
        className="absolute right-6 top-10 max-w-[55%] text-right text-[22px] leading-[1.2]"
      >
        {data.headline}
      </Display>
      <div className="mt-32 flex flex-1 flex-col px-8 pb-16">
        <div className="space-y-3 border-l-2 border-black pl-5">
          {data.body?.map((line, i) => (
            <Body key={i} className="text-[14px]">
              {line}
            </Body>
          ))}
        </div>
        {data.highlight && (
          <Display as="p" className="mt-auto pt-8 text-[18px] leading-snug text-[#3D6B4F]">
            &ldquo;{data.highlight}&rdquo;
          </Display>
        )}
      </div>
      <BrandMarkDark />
    </CardRoot>
  );
}

function InsightSlide({ data }: { data: CardSlide }) {
  if (data.accent === "dark") {
    return (
      <CardRoot className="bg-[#1E3A5F] text-[#F4F0E8]">
        <div className="flex flex-1 flex-col px-8 pb-16 pt-12">
          {data.subheadline && (
            <Body className="text-[11px] text-white/45">{data.subheadline}</Body>
          )}
          <Display as="h2" className="mt-2 whitespace-pre-line text-[30px] leading-[1.08] text-white">
            {data.headline}
          </Display>
          {data.body && (
            <div className="mt-6 space-y-3">
              {data.body.map((line, i) => (
                <Body key={i} className="text-[14px] text-white/82">
                  {line}
                </Body>
              ))}
            </div>
          )}
          {data.highlight && (
            <Display as="p" className="mt-auto pt-6 text-[20px] leading-[1.35] text-[#D4A017]">
              {data.highlight}
            </Display>
          )}
          <WinnerLoserList items={data.winnersLosers} />
        </div>
        <BrandMark />
      </CardRoot>
    );
  }

  if (data.accent === "green") {
    return (
      <CardRoot className="bg-white">
        <div className="flex flex-1 flex-col px-7 pb-14 pt-10">
          <Display className="whitespace-pre-line text-[28px] leading-[1.1]">{data.headline}</Display>
          {data.body && (
            <div className="mt-5 space-y-2.5">
              {data.body.map((line, i) => (
                <Body key={i} className="text-[14px] text-black/75">
                  {line}
                </Body>
              ))}
            </div>
          )}
          {data.highlight && (
            <div className="mt-auto bg-[#3D6B4F] px-5 py-5">
              <Display as="p" className="text-[17px] leading-[1.4] text-[#F4F0E8]">
                {data.highlight}
              </Display>
            </div>
          )}
        </div>
        <BrandMarkDark />
      </CardRoot>
    );
  }

  return (
    <CardRoot className="bg-[#F4F0E8]">
      <div className="flex flex-1 flex-col px-8 pb-16 pt-11">
        {data.subheadline && (
          <Body className="text-[11px] text-black/45">{data.subheadline}</Body>
        )}
        <Display className="mt-1 whitespace-pre-line text-[26px] leading-[1.12]">
          {data.headline}
        </Display>
        {data.body && (
          <div className="mt-5 space-y-3">
            {data.body.map((line, i) => (
              <Body key={i} className="text-[13px]">
                — {line}
              </Body>
            ))}
          </div>
        )}
        {data.highlight && (
          <Body className="mt-6 text-[14px] font-bold">{data.highlight}</Body>
        )}
        <WinnerLoserList items={data.winnersLosers} />
      </div>
      <BrandMarkDark />
    </CardRoot>
  );
}

const EVENT_COLORS: Record<string, string> = {
  tax: C.blueDeep,
  policy: C.green,
  supply: C.blue,
  rate: C.coral,
  general: C.gray,
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
    <CardRoot className="bg-white">
      <div className="px-6 pb-3 pt-8">
        <Body className="text-[9px] text-black/35">{data.source ?? `${year}.${month}`}</Body>
        <Display as="h1" className="mt-1 whitespace-pre-line text-[24px] leading-[1.1]">
          {data.headline}
        </Display>
        {data.subheadline && (
          <Body className="mt-2 text-[12px] text-[#2B5F8C]">{data.subheadline}</Body>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-12 pt-2">
        <div className="grid grid-cols-7 gap-px bg-black/8 text-[7.5px]">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div
              key={d}
              className={"bg-[#FAF8F4] py-1 text-center " + (i === 0 ? "text-red-600" : "")}
              style={{ fontFamily: FONT_BODY }}
            >
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const ev = day ? eventMap.get(day) : null;
            const dow = i % 7;
            const bg = ev ? EVENT_COLORS[ev.type ?? "general"] : "#fff";
            const fg = ev ? "#fff" : dow === 0 ? "#c0392b" : C.ink;
            return (
              <div
                key={i}
                className="flex min-h-[34px] flex-col p-0.5"
                style={{ backgroundColor: ev ? bg : "#fff", color: fg, fontFamily: FONT_BODY }}
              >
                {day && <span className="text-[8px]">{day}</span>}
                {ev && day === ev.day && (
                  <span className="mt-auto line-clamp-3 text-[6px] leading-tight">{ev.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <BrandMarkDark />
    </CardRoot>
  );
}

function LineChart({ series, color, label }: { series: ChartPoint[]; color: string; label: string }) {
  const max = Math.max(...series.map((p) => p.value));
  const min = Math.min(...series.map((p) => p.value));
  const range = max - min || 1;
  const w = 280;
  const h = 52;
  const pts = series.map((p, i) => {
    const x = (i / Math.max(series.length - 1, 1)) * w;
    const y = h - ((p.value - min) / range) * (h - 8) - 4;
    return { x, y, v: p.value };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="mb-3 border-t border-black/20 pt-2">
      <div className="mb-1 flex items-baseline justify-between">
        <Body className="text-[10px] text-black/50">{label}</Body>
        <span className="text-[11px] tabular-nums" style={{ color, fontFamily: FONT_BODY }}>
          {pts[pts.length - 1]?.v}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
        <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function ChartSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-[#FAF8F4]">
      <div className="px-7 pb-4 pt-9">
        {data.source && <Body className="text-[8px] text-black/35">{data.source}</Body>}
        <Display className="mt-1 whitespace-pre-line text-[22px] leading-[1.12]">
          {data.headline}
        </Display>
        {data.subheadline && (
          <Body className="mt-2 text-[12px] text-[#2B5F8C]">{data.subheadline}</Body>
        )}
      </div>
      <div className="flex flex-1 flex-col px-7 pb-14">
        {data.priceSeries && data.priceLabel && (
          <LineChart series={data.priceSeries} color={C.blue} label={data.priceLabel} />
        )}
        {data.supplySeries && data.supplyLabel && (
          <LineChart series={data.supplySeries} color={C.green} label={data.supplyLabel} />
        )}
        {data.conclusion && (
          <Display as="p" className="mt-3 text-[15px] leading-[1.45]">
            {data.conclusion}
          </Display>
        )}
        <WinnerLoserList items={data.winnersLosers} />
      </div>
      <BrandMarkDark />
    </CardRoot>
  );
}

function RankingSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-white">
      <div className="px-7 pb-4 pt-9">
        {data.source && <Body className="text-[8px] text-black/35">{data.source}</Body>}
        <Display className="whitespace-pre-line text-[26px] leading-[1.08]">{data.headline}</Display>
        {data.subheadline && (
          <Body className="mt-2 text-[13px] text-[#C0392B]">{data.subheadline}</Body>
        )}
      </div>
      <ul className="flex-1 px-5 pb-4">
        {data.rows?.map((row, i) => (
          <li
            key={row.rank}
            className="border-b border-black/10 py-3"
            style={{ paddingLeft: i % 2 === 0 ? 0 : 12 }}
          >
            <div className="flex items-baseline gap-3">
              <Display as="span" className="w-8 text-[28px] leading-none tabular-nums text-black/20">
                {row.rank}
              </Display>
              <div className="min-w-0 flex-1">
                <Body className="text-[14px] font-bold">{row.label}</Body>
                {row.sub && <Body className="text-[10px] text-black/40">{row.sub}</Body>}
              </div>
              <Body
                className={
                  "text-[15px] tabular-nums " + (row.highlight ? "text-[#C0392B]" : "")
                }
              >
                {row.value}
              </Body>
            </div>
          </li>
        ))}
      </ul>
      {data.highlight && (
        <Body className="mx-7 mb-12 border-t border-black pt-3 text-[12px] italic">
          {data.highlight}
        </Body>
      )}
      <BrandMarkDark />
    </CardRoot>
  );
}

function PolicySlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-[#F4F0E8]">
      <div className="border-b border-black px-7 py-5">
        {data.source && <Body className="text-[8px] text-black/35">{data.source}</Body>}
        <Display className="whitespace-pre-line text-[24px] leading-[1.1]">{data.headline}</Display>
        {data.subheadline && (
          <Body className="mt-2 text-[13px]">{data.subheadline}</Body>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 py-4">
        {data.people?.map((p, i) => (
          <div
            key={p.name}
            className="flex items-center gap-4 border-b border-black/10 pb-3"
            style={{ marginLeft: i * 8 }}
          >
            <Display as="span" className="text-[32px] leading-none text-black/15">
              {String(i + 1).padStart(2, "0")}
            </Display>
            <div className="flex-1">
              <Body className="text-[13px] font-bold">{p.name}</Body>
              <Body className="text-[10px] text-black/45">{p.role}</Body>
            </div>
            <div className="text-right">
              <Display as="span" className="text-[22px] tabular-nums text-[#C0392B]">
                {p.stat}
              </Display>
              <Body className="text-[8px] text-black/40">{p.statLabel}</Body>
            </div>
          </div>
        ))}
      </div>
      {data.body && (
        <ul className="space-y-1 px-7 pb-2">
          {data.body.map((line, i) => (
            <Body key={i} className="text-[11px]">
              {line}
            </Body>
          ))}
        </ul>
      )}
      {data.highlight && (
        <Body className="mx-7 mb-12 text-[12px] italic leading-[1.5]">{data.highlight}</Body>
      )}
      <BrandMarkDark />
    </CardRoot>
  );
}

function UnsoldSlide({ data }: { data: CardSlide }) {
  return (
    <CardRoot className="bg-white">
      <div className="px-7 pb-5 pt-9">
        {data.source && <Body className="text-[8px] text-black/35">{data.source}</Body>}
        <Display className="whitespace-pre-line text-[26px] leading-[1.08]">{data.headline}</Display>
        {data.subheadline && <Body className="mt-2 text-[12px]">{data.subheadline}</Body>}
      </div>
      <ul className="flex-1 px-7 pb-4">
        {data.topRegions?.map((r, i) => (
          <li key={r.name} className="border-t border-black/15 py-4">
            <div className="flex items-end justify-between gap-2">
              <div>
                <Display as="span" className="text-[36px] leading-none text-black/12">
                  {i + 1}
                </Display>
                <Body className="mt-1 text-[15px] font-bold">{r.name}</Body>
                <Body className="text-[10px] text-black/40">
                  미분양 {r.count.toLocaleString()}호
                </Body>
              </div>
              <Display as="span" className="text-[24px] tabular-nums text-[#C0392B]">
                {r.rate}
              </Display>
            </div>
            <div className="mt-2 h-px w-full bg-black/10">
              <div
                className="h-px bg-[#C0392B]"
                style={{ width: `${Math.min(parseFloat(r.rate), 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {data.conclusion && (
        <Body className="mx-7 mb-12 text-[12px] leading-[1.55]">{data.conclusion}</Body>
      )}
      <BrandMarkDark />
    </CardRoot>
  );
}
