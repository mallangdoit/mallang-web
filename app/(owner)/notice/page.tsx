import { Suspense } from "react";
import { connection } from "next/server";
import { getNotices } from "@/lib/supabase-data";
import NoticeBoard from "./NoticeBoard";

async function NoticeData() {
  await connection();
  const initial = await getNotices();
  return <NoticeBoard initial={initial} />;
}

export default function NoticePage() {
  return (
    <main className="min-h-screen bg-[#FBF7F2] text-[#2B2018] px-4 py-8">
      <Suspense fallback={<p className="text-sm opacity-60">불러오는 중…</p>}>
        <NoticeData />
      </Suspense>
    </main>
  );
}
