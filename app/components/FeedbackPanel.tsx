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
  const [author, setAuthor] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState<{ author: string; text: string; at: string }[]>([]);

  const apply = () => {
    if (!feedback.trim()) {
      onNotify("피드백 내용을 입력해주세요");
      return;
    }
    if (!content) {
      onNotify("먼저 카드를 생성해주세요");
      return;
    }

    const name = author.trim() || "팀원";
    const updatedSlides = content.slides.map((s, i) =>
      i === slideIndex ? applyFeedbackToSlide(s, feedback, name) : s,
    );
    const newCaption = applyFeedbackToCaption(caption, feedback, name);

    onContentChange({ ...content, slides: updatedSlides, caption: newCaption });
    onCaptionChange(newCaption);
    setHistory((h) => [
      { author: name, text: feedback.trim(), at: new Date().toLocaleTimeString("ko-KR") },
      ...h,
    ]);
    setFeedback("");
    onNotify(`${name}님 피드백 반영 완료!`);
  };

  return (
    <section className="mx-auto mt-8 max-w-[420px] rounded-2xl border border-[#2196F3]/20 bg-gradient-to-br from-[#E3F2FD] to-[#E8F8F5] p-5">
      <div className="mb-3 flex items-center gap-2">
        <MessageSquarePlus className="h-4 w-4 text-[#1565C0]" />
        <h3 className="text-sm font-bold text-[#1565C0]">팀 피드백 · 바로 반영</h3>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-[#1565C0]/70">
        다른 담당자도 의견 남기면 카드·본문에 즉시 반영돼요
      </p>
      <input
        type="text"
        placeholder="이름 (예: 김대리)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="mb-2 w-full rounded-lg border-0 bg-white/80 px-3 py-2 text-sm outline-none ring-1 ring-[#2196F3]/20 focus:ring-[#2196F3]/50"
      />
      <textarea
        placeholder="수정 요청 (예: 제목 더 후킹하게, 결론 문장 짧게, 파란색 톤 UP…)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg border-0 bg-white/80 px-3 py-2 text-sm leading-relaxed outline-none ring-1 ring-[#2196F3]/20 focus:ring-[#2196F3]/50"
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
            <li key={i} className="text-[10px] leading-relaxed text-[#1565C0]/80">
              <span className="font-bold">{h.author}</span>
              <span className="opacity-50"> · {h.at}</span>
              <p className="mt-0.5 text-[#0D2137]/70">{h.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
