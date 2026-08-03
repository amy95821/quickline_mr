import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasyEcon PostMaker",
  description: "2040 세대 타겟 부동산·경제 인스타 카드뉴스 생성기",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSans.css"
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
