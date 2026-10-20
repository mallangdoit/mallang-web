import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { OWNER_EMAIL } from "./lib/owner";

// 문 앞의 직원 (PRD 3-1) — 주인 메일로 로그인한 사람만 주인 화면에 들인다
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.email === OWNER_EMAIL;
  const onLogin = request.nextUrl.pathname === "/login";

  if (!isOwner && !onLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isOwner && onLogin) {
    return NextResponse.redirect(new URL("/today", request.url));
  }
  return response;
}

export const config = {
  // /app 은 수강생 앱 (PRD 3-14) — 주인 로그인을 거치지 않는다
  matcher: ["/((?!_next/static|_next/image|favicon.ico|app(?:/|$)|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
