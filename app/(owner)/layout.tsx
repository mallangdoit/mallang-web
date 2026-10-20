import OwnerNav from "./OwnerNav";

// 주인 화면 맨 위 줄 (PRD 3-1 로그아웃 B · 3.0 메뉴 줄 C)
export default function OwnerLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <OwnerNav />
      {children}
    </>
  );
}
