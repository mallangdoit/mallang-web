import LogoutButton from "./LogoutButton";

// 주인 화면 맨 위 얇은 줄 (PRD 3-1 로그아웃 B) — 왼쪽 상호, 오른쪽 [로그아웃]
// 나중에 메뉴 줄(3.0)을 만들면 이 줄 가운데에 [오늘][주간][알림판]을 넣는다
export default function OwnerLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="bg-white border-b border-[#EDE0D2] text-[#2B2018]">
        <div className="mx-auto max-w-xl px-4 py-2.5 flex items-center justify-between">
          <span className="font-bold">말랑공방</span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </>
  );
}
