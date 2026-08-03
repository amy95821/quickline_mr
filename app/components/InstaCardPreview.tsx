"use client";

import type {
  CalendarPayload,
  CardPayload,
  DataComparePayload,
  MemePayload,
  SwipePayload,
  TierPayload,
  UnsoldPayload,
} from "../lib/cardTypes";
import { BRAND_HANDLE } from "../lib/cardTypes";

interface InstaCardPreviewProps {
  payload: CardPayload;
}

export function InstaCardPreview({ payload }: InstaCardPreviewProps) {
  switch (payload.template) {
    case "meme":
      return <MemeCard data={payload.data} />;
    case "swipe":
      return <SwipeCard data={payload.data} />;
    case "calendar":
      return <CalendarCard data={payload.data} />;
    case "data-compare":
      return <DataCompareCard data={payload.data} />;
    case "tier":
      return <TierCard data={payload.data} />;
    case "unsold":
      return <UnsoldCard data={payload.data} />;
    default:
      return null;
  }
}

function CardShell({
  children,
  bg,
  text = "#1a1a1a",
}: {
  children: React.ReactNode;
  bg: string;
  text?: string;
}) {
  return (
    <div
      className="relative flex aspect-square w-full flex-col font-[family-name:var(--font-pretendard)]"
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
      <footer className="absolute bottom-5 left-0 right-0 text-center text-[10px] tracking-wide opacity-40">
        {BRAND_HANDLE}
      </footer>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] tracking-[0.2em] uppercase opacity-50">
      {children}
    </span>
  );
}

/* ── Type A: Meme ── */
function MemeIllustration({ kind }: { kind: MemePayload["memeKey"] }) {
  if (kind === "frog")
    return (
      <svg viewBox="0 0 120 100" className="mx-auto h-28 w-28" aria-hidden>
        <ellipse cx="60" cy="65" rx="38" ry="28" fill="#7CB87A" />
        <circle cx="42" cy="42" r="14" fill="#7CB87A" />
        <circle cx="78" cy="42" r="14" fill="#7CB87A" />
        <circle cx="42" cy="42" r="6" fill="#fff" />
        <circle cx="78" cy="42" r="6" fill="#fff" />
        <path d="M48 72 Q60 78 72 72" stroke="#4a7a48" fill="none" strokeWidth="2" />
        <path d="M55 58 Q58 52 62 58" stroke="#6EC6E6" fill="none" strokeWidth="2" opacity="0.8" />
      </svg>
    );
  if (kind === "cat")
    return (
      <svg viewBox="0 0 120 100" className="mx-auto h-28 w-28" aria-hidden>
        <ellipse cx="60" cy="62" rx="32" ry="26" fill="#C4A882" />
        <polygon points="35,35 42,18 50,35" fill="#C4A882" />
        <polygon points="70,35 78,18 85,35" fill="#C4A882" />
        <ellipse cx="48" cy="58" rx="5" ry="7" fill="#1a1a1a" />
        <ellipse cx="72" cy="58" rx="5" ry="7" fill="#1a1a1a" />
        <ellipse cx="60" cy="68" rx="4" ry="3" fill="#e8a090" />
      </svg>
    );
  return (
    <svg viewBox="0 0 120 100" className="mx-auto h-28 w-28" aria-hidden>
      <rect x="25" y="30" width="70" height="50" rx="4" fill="#E8E4DE" stroke="#ccc" />
      <rect x="35" y="40" width="50" height="6" rx="2" fill="#bbb" />
      <rect x="35" y="52" width="35" height="4" rx="2" fill="#ddd" />
      <circle cx="60" cy="22" r="10" fill="#E8E4DE" stroke="#ccc" />
    </svg>
  );
}

function MemeCard({ data }: { data: MemePayload }) {
  return (
    <CardShell bg="#FAF8F5">
      <div className="flex flex-1 flex-col px-8 pt-10 pb-14">
        <Tag>{data.categoryTag}</Tag>
        <div className="my-6 flex flex-1 items-center justify-center">
          <MemeIllustration kind={data.memeKey} />
        </div>
        <p className="text-center text-[17px] font-bold leading-snug tracking-tight">
          {data.punchline}
        </p>
      </div>
    </CardShell>
  );
}

/* ── Type B: Swipe ── */
const SWIPE_BG = {
  cream: { bg: "#F5F0E8", fg: "#1a1a1a" },
  green: { bg: "#1B3D34", fg: "#F5F0E8" },
  charcoal: { bg: "#2A2A2A", fg: "#F5F0E8" },
};

function SwipeCard({ data }: { data: SwipePayload }) {
  const palette = SWIPE_BG[data.accent];
  return (
    <CardShell bg={palette.bg} text={palette.fg}>
      <div className="flex flex-1 flex-col items-center justify-center px-10 pb-14 pt-10">
        <div className="mb-10 opacity-20">
          <svg viewBox="0 0 80 120" className="h-24 w-16" aria-hidden>
            <ellipse cx="40" cy="28" rx="18" ry="22" fill="currentColor" />
            <path d="M18 120 Q40 70 62 120" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-center text-[22px] font-extrabold leading-[1.35] tracking-tight">
          {data.question}
        </h2>
      </div>
    </CardShell>
  );
}

/* ── Type C: Calendar ── */
function CalendarCard({ data }: { data: CalendarPayload }) {
  const daysInMonth = new Date(data.year, data.month, 0).getDate();
  const firstDay = new Date(data.year, data.month - 1, 1).getDay();
  const eventMap = new Map(data.events.map((e) => [e.day, e]));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <CardShell bg="#FFFEFC">
      <div className="flex flex-1 flex-col px-6 pt-8 pb-14">
        <Tag>
          {data.year}.{String(data.month).padStart(2, "0")}
        </Tag>
        <h2 className="mt-2 text-[15px] font-bold leading-snug">{data.title}</h2>
        <div className="mt-4 grid flex-1 grid-cols-7 gap-1 text-[9px]">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="text-center opacity-40">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const ev = day ? eventMap.get(day) : null;
            return (
              <div
                key={i}
                className={`flex min-h-[28px] flex-col items-center justify-start rounded-sm p-0.5 ${
                  ev ? "bg-[#1B3D34] text-white" : "bg-[#F5F3F0]"
                }`}
              >
                {day && <span className="font-semibold">{day}</span>}
                {ev && (
                  <span className="mt-0.5 line-clamp-2 text-[7px] leading-tight">
                    {ev.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CardShell>
  );
}

/* ── Type D: Data Compare ── */
function MiniChart({
  series,
  color,
  label,
}: {
  series: DataComparePayload["priceSeries"];
  color: string;
  label: string;
}) {
  const max = Math.max(...series.map((p) => p.value));
  const min = Math.min(...series.map((p) => p.value));
  const range = max - min || 1;
  const w = 200;
  const h = 48;
  const pts = series.map((p, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = h - ((p.value - min) / range) * (h - 8) - 4;
    return { x, y };
  });

  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M0,${h} ${pts.map((p) => `L${p.x},${p.y}`).join(" ")} L${w},${h} Z`;

  return (
    <div>
      <p className="mb-1 text-[9px] font-semibold opacity-50">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
        <path d={area} fill={color} opacity="0.08" />
        <polyline points={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function DataCompareCard({ data }: { data: DataComparePayload }) {
  return (
    <CardShell bg="#FFFEFC">
      <div className="flex flex-1 flex-col px-7 pt-8 pb-14">
        <Tag>{data.regionTag}</Tag>
        <h2 className="mt-3 text-[16px] font-extrabold leading-snug">
          {data.headline}
        </h2>
        <div className="my-4 space-y-3">
          <MiniChart
            series={data.priceSeries}
            color="#C45C4A"
            label={data.priceLabel ?? "매매지수"}
          />
          <MiniChart
            series={data.supplySeries}
            color="#1B3D34"
            label={data.supplyLabel ?? "입주물량(지수)"}
          />
        </div>
        <p className="mt-auto text-[11px] leading-relaxed opacity-60">
          {data.insight}
        </p>
        <svg className="absolute right-6 top-16 h-8 w-12 opacity-15" aria-hidden>
          <path d="M0,20 Q20,5 40,18 T80,12" stroke="#C45C4A" fill="none" strokeWidth="2" />
          <text x="4" y="8" fontSize="8" fill="#C45C4A">
            ↑
          </text>
        </svg>
      </div>
    </CardShell>
  );
}

/* ── Tier (minimal, 20~40% only) ── */
function TierCard({ data }: { data: TierPayload }) {
  return (
    <CardShell bg="#F5F0E8">
      <div className="flex flex-1 flex-col px-7 pt-9 pb-14">
        <Tag>{data.tag}</Tag>
        <h2 className="mt-2 text-[15px] font-extrabold">{data.title}</h2>
        <p className="mt-1 text-[11px] opacity-50">{data.subtitle}</p>
        <ul className="mt-5 flex-1 space-y-2">
          {data.items.slice(0, 10).map((item) => (
            <li
              key={item.rank}
              className="flex items-baseline gap-3 border-b border-black/5 pb-2"
            >
              <span className="w-4 text-[12px] font-bold tabular-nums opacity-40">
                {item.rank}
              </span>
              <span className="flex-1 text-[12px] font-semibold">{item.label}</span>
              {item.tier && (
                <span className="text-[10px] font-bold opacity-30">{item.tier}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  );
}

/* ── Unsold ── */
function UnsoldCard({ data }: { data: UnsoldPayload }) {
  return (
    <CardShell bg="#FFFEFC">
      <div className="flex flex-1 flex-col px-7 pt-9 pb-14">
        <Tag>{data.region}</Tag>
        <h2 className="mt-2 text-[15px] font-extrabold leading-snug">{data.title}</h2>
        <ul className="mt-6 flex-1 space-y-4">
          {data.topRegions.map((r, i) => (
            <li key={r.name} className="flex items-end gap-3">
              <span className="w-4 text-[13px] font-bold opacity-30">{i + 1}</span>
              <div className="flex-1">
                <p className="text-[13px] font-bold">{r.name}</p>
                <div className="mt-1 h-1.5 w-full bg-black/5">
                  <div
                    className="h-full bg-[#C45C4A]"
                    style={{ width: `${Math.min(parseFloat(r.rate), 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-[12px] font-bold tabular-nums">{r.rate}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10px] leading-relaxed opacity-50">{data.insight}</p>
      </div>
    </CardShell>
  );
}
