"use client";

import { Nanum_Pen_Script } from "next/font/google";
import {
  TIER_COLORS,
  TIER_LABELS,
  type ContentMode,
  type RankedItem,
  type TierGrade,
} from "../lib/tierData";

const pen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export type CardTheme = "cream" | "paper" | "sage" | "blush";

export const CARD_THEMES: Record<
  CardTheme,
  {
    label: string;
    bg: string;
    card: string;
    accent: string;
    text: string;
    subtext: string;
    dot: string;
  }
> = {
  cream: {
    label: "크림",
    bg: "#FAF7F2",
    card: "#FFFFFF",
    accent: "#C45C4A",
    text: "#2C2825",
    subtext: "#6B6560",
    dot: "#E8E2DA",
  },
  paper: {
    label: "페이퍼",
    bg: "#FFFEF9",
    card: "#FFFFFF",
    accent: "#3D5A45",
    text: "#1E2A22",
    subtext: "#5A6B5E",
    dot: "#E5E8E3",
  },
  sage: {
    label: "세이지",
    bg: "#F2F5F0",
    card: "#FFFFFF",
    accent: "#5A7D6A",
    text: "#243028",
    subtext: "#5C6E62",
    dot: "#DDE4D8",
  },
  blush: {
    label: "블러쉬",
    bg: "#FDF8F6",
    card: "#FFFFFF",
    accent: "#B85C5C",
    text: "#3A2A2A",
    subtext: "#7A6565",
    dot: "#EDE4E2",
  },
};

interface SnCardProps {
  tag: string;
  title: string;
  subtitle: string;
  items: RankedItem[];
  theme: (typeof CARD_THEMES)[CardTheme];
  titleScale: number;
  displayCount: number;
  mode: ContentMode;
  brandHandle: string;
}

export function SnCard({
  tag,
  title,
  subtitle,
  items,
  theme,
  titleScale,
  displayCount,
  mode,
  brandHandle,
}: SnCardProps) {
  const visible = items.slice(0, displayCount);
  const compact = displayCount >= 12;

  return (
    <div
      className={`relative flex aspect-square w-full flex-col overflow-hidden px-4 py-5 ${pen.className}`}
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(circle, ${theme.dot} 1px, transparent 1px)`,
        backgroundSize: "14px 14px",
      }}
    >
      {/* 상단 라인 장식 */}
      <div
        className="absolute left-4 right-4 top-3 h-px"
        style={{ backgroundColor: theme.accent, opacity: 0.25 }}
      />

      <div className="relative z-10 shrink-0 pt-3 text-center">
        <span
          className="inline-block border px-2.5 py-0.5 text-xs tracking-widest"
          style={{
            borderColor: theme.accent,
            color: theme.accent,
          }}
        >
          {tag}
        </span>
        <h2
          className="mt-2 leading-snug"
          style={{
            color: theme.text,
            fontSize: `${titleScale * (compact ? 0.46 : 0.54)}px`,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: theme.subtext,
            fontSize: compact ? "12px" : "14px",
          }}
        >
          {subtitle}
        </p>
      </div>

      <div
        className={`relative z-10 mt-3 flex flex-1 flex-col justify-center ${compact ? "gap-[3px]" : "gap-1.5"}`}
      >
        {visible.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-2 border px-2 py-1"
            style={{
              backgroundColor: theme.card,
              borderColor: `${theme.accent}33`,
              minHeight: compact ? "28px" : "32px",
            }}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center text-[11px]"
              style={{
                color: item.rank <= 3 ? theme.accent : theme.subtext,
                fontWeight: item.rank <= 3 ? 700 : 400,
              }}
            >
              {item.rank}
            </span>
            <p
              className="min-w-0 flex-1 leading-tight"
              style={{
                color: theme.text,
                fontSize: compact ? "11px" : "13px",
              }}
            >
              {item.label}
            </p>
            {mode === "ranking" && (
              <span
                className="shrink-0 text-[9px] font-bold"
                style={{ color: TIER_COLORS[item.tier as TierGrade] }}
              >
                {TIER_LABELS[item.tier as TierGrade]}
              </span>
            )}
            <p
              className="shrink-0 truncate text-right"
              style={{
                color: theme.subtext,
                fontSize: compact ? "9px" : "10px",
                maxWidth: compact ? "52px" : "60px",
              }}
            >
              {item.hook}
            </p>
          </div>
        ))}
      </div>

      <div
        className="absolute bottom-3 left-4 right-4 h-px"
        style={{ backgroundColor: theme.accent, opacity: 0.15 }}
      />
      <p
        className="relative z-10 mt-2 shrink-0 text-center text-[11px]"
        style={{ color: theme.subtext }}
      >
        {brandHandle}
      </p>
    </div>
  );
}

export { pen };
