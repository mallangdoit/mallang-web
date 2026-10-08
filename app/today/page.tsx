import { Suspense } from "react";
import { connection } from "next/server";
import { getTodayData } from "@/lib/supabase-data";
import TodayList from "./TodayList";

async function TodayData() {
  await connection();
  const { dateLabel, pendingRequestCount, classes } = await getTodayData();
  return (
    <TodayList
      dateLabel={dateLabel}
      pendingRequestCount={pendingRequestCount}
      classes={classes}
    />
  );
}

export default function TodayPage() {
  return (
    <main className="min-h-screen bg-[#FBF7F2] text-[#2B2018] px-4 py-8">
      <Suspense fallback={<p className="text-sm opacity-60">불러오는 중…</p>}>
        <TodayData />
      </Suspense>
    </main>
  );
}
