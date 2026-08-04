"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import type { GeneratedContent } from "../lib/cardTypes";
import { applyFeedbackToCaption, applyFeedbackToSlide } from "../lib/captionTone";

interface FeedbackPanelProps {
  content: GeneratedContent | null;
  slideIndex: number;
  caption: string;
  onCaptionChange: (caption: string) => void;
  onContentChange: (content: GeneratedContent) => void;
  onNotify: (msg: string) => void;
}

export function FeedbackPanel({
  content,
  slideIndex,
  caption,
  onCaptionChange,
  onContentChange,
  onNotify,
}: FeedbackPanelProps) {
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState<{ text: string; at: string }[]>([]);

  const apply = () => {
    if (!feedback.trim()) {
      onNotify("피드백 내용을 입력해주세요");
      return;
    }
    if (!content) {
      onNotify("먼저 카드를 생성해주세요");
      return;
    }

    const updatedSlides = content.slides.map((s, i) =>
      i === slideIndex ? applyFeedbackToSlide(s, feedback) : s,
    );
    const newCaption = applyFeedbackToCaption(caption, feedback);

    onContentChange({ ...content, slides: updatedSlides, caption: newCaption });
    onCaptionChange(newCaption);
    setHistory((h) => [{ text: feedback.trim(), at: new Date().toLocaleTimeString("ko-KR") }, ...h]);
    setFeedback("");
    onNotify("피드백 반영했어요");
  };

  return (
    <section className="mx-auto mt-8 max-w-[420px] rounded-2xl border border-[#2196F3]/20 bg-gradient-to-br from-[#E3F2FD] to-[#E8F8F5] p-5">
      <div className="mb-3 flex items-center gap-2">
        <MessageSquarePlus className="h-4 w-4 text-[#1565C0]" />
        <h3 className="text-sm font-bold text-[#1565C0]">피드백 · 바로 반영</h3>
      </div>
      <textarea
        placeholder="수정 요청 (예: 제목 더 후킹하게, 결론 문장 짧게, 여백 더 넓게…)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border-0 bg-white/80 px-3 py-2.5 text-sm leading-relaxed outline-none ring-1 ring-[#2196F3]/20 focus:ring-[#2196F3]/50"
      />
      <button
        type="button"
        onClick={apply}
        disabled={!content}
        className="mt-3 w-full rounded-lg bg-gradient-to-r from-[#2196F3] to-[#00C853] py-2.5 text-sm font-bold text-white disabled:opacity-40"
      >
        피드백 반영하기
      </button>
      {history.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-[#2196F3]/10 pt-3">
          {history.slice(0, 5).map((h, i) => (
            <li key={i} className="text-[11px] leading-relaxed text-[#0D2137]/75">
              <span className="opacity-50">{h.at}</span>
              <p className="mt-0.5">{h.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
