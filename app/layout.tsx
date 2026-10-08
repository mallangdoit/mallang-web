import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 웹 글씨체 — Noto Sans KR을 실어 보낸다 (PRD 3.0). 한글은 조각이 많아 미리 불러오지 않는다
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  weight: ["400", "500", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "말랑공방",
  description: "손으로 만드는 주말 오후 한 시간 — 말랑공방 운영 화면",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className={`${notoSansKr.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
