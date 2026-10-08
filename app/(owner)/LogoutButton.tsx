"use client";

import { createLoginClient } from "@/lib/supabase-browser";

// 묻지 않고 로그인 화면으로 (PRD 3-1). 뒤로 가기로 못 들어오게 기록을 바꿔치기한다
export default function LogoutButton() {
  async function handleLogout() {
    await createLoginClient().auth.signOut();
    window.location.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-[#7A4B32] border border-[#7A4B32] rounded-lg px-3 py-1"
    >
      로그아웃
    </button>
  );
}
