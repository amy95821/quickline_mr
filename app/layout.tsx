import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
});

export const metadata: Metadata = {
  title: "모래네 용돈벌어주는 SNS콘텐츠 만들기",
  description: "30대 타겟 인스타 경제·재테크 카드뉴스 자동 생성기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jua)]">
        {children}
      </body>
    </html>
  );
}
