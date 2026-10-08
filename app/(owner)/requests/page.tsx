import { Suspense } from "react";
import { connection } from "next/server";
import { getPendingRequests } from "@/lib/supabase-data";
import RequestsList from "./RequestsList";

async function RequestsData() {
  await connection();
  const initial = await getPendingRequests();
  return <RequestsList initial={initial} />;
}

export default function RequestsPage() {
  return (
    <main className="min-h-screen bg-[#FBF7F2] text-[#2B2018] px-4 py-8">
      <Suspense fallback={<p className="text-sm opacity-60">불러오는 중…</p>}>
        <RequestsData />
      </Suspense>
    </main>
  );
}
