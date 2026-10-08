"use client";

import { useState } from "react";
import { createLoginClient } from "@/lib/supabase-browser";
import { OWNER_EMAIL } from "@/lib/owner";

const WRONG = "아이디 또는 비밀번호가 맞지 않습니다";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("아이디와 비밀번호를 적어 주세요");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createLoginClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    // 주인 메일이 아니면 비밀번호가 맞아도 들이지 않는다 (PRD 3-1)
    if (signInError || data.user?.email !== OWNER_EMAIL) {
      if (!signInError) await supabase.auth.signOut();
      setBusy(false);
      setError(WRONG);
      return;
    }
    window.location.replace("/today");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white border border-[#EDE0D2] rounded-2xl p-6 flex flex-col gap-3"
    >
      <div className="text-center mb-2">
        <div className="text-xl font-bold">말랑공방</div>
        <div className="text-sm text-[#6E5C4C]">공방 예약 관리</div>
      </div>
      <label htmlFor="login-email" className="sr-only">
        아이디
      </label>
      <input
        id="login-email"
        type="email"
        autoComplete="username"
        placeholder="아이디 (이메일)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-[#EDE0D2] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#7A4B32]"
      />
      <label htmlFor="login-password" className="sr-only">
        비밀번호
      </label>
      <input
        id="login-password"
        type="password"
        autoComplete="current-password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-[#EDE0D2] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#7A4B32]"
      />
      <button
        type="submit"
        disabled={busy}
        className="mt-1 bg-[#7A4B32] text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {busy ? "들어가는 중…" : "로그인"}
      </button>
      {error && <div className="text-sm text-[#B8590F] text-center">{error}</div>}
    </form>
  );
}
