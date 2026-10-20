"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

// 메뉴 줄 — 고른 안 C (PRD 3.0): 가로 메뉴 셋 + 오른쪽 「+ 클래스 만들기」 단추, 로그아웃과는 넉넉히 띄운다
const MENUS = [
  { href: "/today", label: "오늘 클래스" },
  { href: "/requests", label: "받은 신청" },
  { href: "/notice", label: "알림판" },
];

export default function OwnerNav() {
  const pathname = usePathname();
  const creating = pathname.startsWith("/classes/new");

  return (
    <header className="bg-white border-b border-[#EDE0D2] text-[#2B2018]">
      <div className="mx-auto max-w-5xl px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-bold">말랑공방</span>

        <nav className="flex flex-wrap gap-1 order-last w-full sm:order-none sm:w-auto">
          {MENUS.map((m) => {
            const on = pathname.startsWith(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={on ? "page" : undefined}
                className={
                  "text-sm px-3 py-1 rounded-lg " +
                  (on
                    ? "bg-[#F1E4D8] text-[#7A4B32] font-semibold"
                    : "text-[#6E5C4C] hover:bg-[#FBF7F2]")
                }
              >
                {m.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-8">
          <Link
            href="/classes/new"
            aria-current={creating ? "page" : undefined}
            className={
              "text-sm font-semibold rounded-lg px-3 py-1.5 text-white " +
              (creating ? "bg-[#5E3926] shadow-inner" : "bg-[#7A4B32]")
            }
          >
            + 클래스 만들기
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
