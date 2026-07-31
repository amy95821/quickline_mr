"use client";

import { Jua } from "next/font/google";
import {
  RANK_STICKERS,
  TIER_COLORS,
  TIER_EMOJI,
  type RankedItem,
  type TierGrade,
} from "../lib/tierData";

const jua = Jua({ weight: "400", subsets: ["latin"], display: "swap" });

export type BrightTheme = "peach" | "mint" | "lemon" | "sky";

export const BRIGHT_THEMES: Record<
  BrightTheme,
  {
    label: string;
    bg: string;
    card: string;
    accent: string;
    text: string;
    subtext: string;
    sticker: string;
  }
> = {
  peach: {
    label: "복숭아",
    bg: "linear-gradient(145deg, #FFF0EB 0%, #FFD6CC 50%, #FFE8B8 100%)",
    card: "#FFFFFF",
    accent: "#FF6B6B",
    text: "#3D2C2C",
    subtext: "#8B5E5E",
    sticker: "🏠",
  },
  mint: {
    label: "민트",
    bg: "linear-gradient(145deg, #E8FFF5 0%, #B8F0D8 50%, #D4F1FF 100%)",
    card: "#FFFFFF",
    accent: "#2ECC87",
    text: "#1A3D2E",
    subtext: "#4A7A65",
    sticker: "✨",
  },
  lemon: {
    label: "레몬",
    bg: "linear-gradient(145deg, #FFFDE8 0%, #FFF3A3 50%, #FFE082 100%)",
    card: "#FFFFFF",
    accent: "#F5A623",
    text: "#4A3D00",
    subtext: "#8B7355",
    sticker: "⚡",
  },
  sky: {
    label: "하늘",
    bg: "linear-gradient(145deg, #EBF5FF 0%, #C8E6FF 50%, #E8D4FF 100%)",
    card: "#FFFFFF",
    accent: "#5B8DEF",
    text: "#1A2A4A",
    subtext: "#5A6A8A",
    sticker: "💫",
  },
};

function rankSticker(rank: number): string {
  if (rank <= 5) return RANK_STICKERS[rank - 1] ?? `${rank}`;
  return `${rank}`;
}

interface PlayfulCardProps {
  tag: string;
  title: string;
  subtitle: string;
  items: RankedItem[];
  theme: (typeof BRIGHT_THEMES)[BrightTheme];
  titleScale: number;
  displayCount: number;
  mode: "ranking" | "comment-pick";
  brandHandle: string;
  topicSticker?: string;
}

export function PlayfulCard({
  tag,
  title,
  subtitle,
  items,
  theme,
  titleScale,
  displayCount,
  mode,
  brandHandle,
  topicSticker = "✨",
}: PlayfulCardProps) {
  const visible = items.slice(0, displayCount);
  const compact = displayCount >= 12;

  return (
    <div
      className={`relative flex aspect-square w-full flex-col overflow-hidden px-4 py-4 ${jua.className}`}
      style={{ background: theme.bg }}
    >
      {/* 장식 스티커 */}
      <span className="absolute left-3 top-3 text-2xl opacity-80">
        {topicSticker}
      </span>
      <span className="absolute right-3 top-3 text-xl opacity-60">
        {theme.sticker}
      </span>
      <span className="absolute bottom-12 left-2 text-lg opacity-40">⭐</span>
      <span className="absolute bottom-16 right-3 text-lg opacity-40">💥</span>

      {/* 헤더 */}
      <div className="relative z-10 shrink-0 pt-2 text-center">
        <span
          className="inline-block rounded-full px-3 py-0.5 text-sm font-normal"
          style={{
            backgroundColor: theme.accent,
            color: "#fff",
          }}
        >
          {tag}
        </span>
        <h2
          className="mt-1.5 leading-tight"
          style={{
            color: theme.text,
            fontSize: `${titleScale * (compact ? 0.44 : 0.52)}px`,
          }}
        >
          {title}
        </h2>
        <p
          className="mt-0.5"
          style={{
            color: theme.subtext,
            fontSize: compact ? "11px" : "13px",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 리스트 */}
      <div
        className={`relative z-10 mt-2 flex flex-1 flex-col justify-center ${compact ? "gap-[3px]" : "gap-1.5"}`}
      >
        {visible.map((item) =>
          mode === "comment-pick" ? (
            <div
              key={item.rank}
              className="flex items-start gap-2 rounded-2xl px-2.5 py-1.5 shadow-sm"
              style={{
                backgroundColor: theme.card,
                border: `2px solid ${theme.accent}22`,
                minHeight: compact ? "30px" : "36px",
              }}
            >
              <span className="shrink-0 text-sm">{rankSticker(item.rank)}</span>
              <div className="min-w-0 flex-1">
                <p
                  className="leading-snug"
                  style={{
                    color: theme.text,
                    fontSize: compact ? "9.5px" : "11px",
                  }}
                >
                  &ldquo;{item.label}&rdquo;
                </p>
                <p
                  className="mt-0.5 text-right"
                  style={{
                    color: theme.accent,
                    fontSize: compact ? "8px" : "9px",
                  }}
                >
                  {item.hook}
                </p>
              </div>
            </div>
          ) : (
            <div
              key={item.rank}
              className="flex items-center gap-2 rounded-2xl px-2 py-1 shadow-sm"
              style={{
                backgroundColor: theme.card,
                minHeight: compact ? "28px" : "34px",
              }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] text-white"
                style={{
                  backgroundColor:
                    item.rank <= 3 ? theme.accent : `${theme.accent}99`,
                }}
              >
                {item.rank}
              </span>
              <p
                className="min-w-0 flex-1 truncate"
                style={{
                  color: theme.text,
                  fontSize: compact ? "10.5px" : "12px",
                }}
              >
                {item.label}
              </p>
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px]"
                style={{
                  color: TIER_COLORS[item.tier as TierGrade],
                  backgroundColor: `${TIER_COLORS[item.tier as TierGrade]}22`,
                }}
              >
                {TIER_EMOJI[item.tier as TierGrade]}
              </span>
              <p
                className="shrink-0 truncate text-right"
                style={{
                  color: theme.accent,
                  fontSize: compact ? "8.5px" : "10px",
                  maxWidth: compact ? "58px" : "68px",
                }}
              >
                {item.hook}
              </p>
            </div>
          ),
        )}
      </div>

      <p
        className="relative z-10 mt-2 shrink-0 text-center text-[10px]"
        style={{ color: theme.subtext }}
      >
        {brandHandle}
      </p>
    </div>
  );
}

export { jua };
