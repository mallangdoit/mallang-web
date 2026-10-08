import { createBrowserClient } from "@supabase/ssr";

// 로그인 · 로그아웃용 — 로그인 상태를 쿠키에 담아 proxy가 읽을 수 있게 한다
export function createLoginClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
