"use client";

import { useEffect, useState } from "react";
import { createClass } from "@/lib/actions";

// 오늘 날짜(한국 시간) "2026-10-20" — 지난 날은 고를 수 없게
function seoulToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

const inputClass =
  "border border-[#EDE0D2] rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-[#7A4B32] w-full";

export default function ClassForm() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("8");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  // 지금 시각은 화면이 열린 뒤에 잰다 — 미리 만드는 화면에 시각이 박히지 않게
  const [today, setToday] = useState<string | undefined>(undefined);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setToday(seoulToday());
    setNow(Date.now());
  }, [name, date, time, capacity]);

  // 규칙에 막히면 [만들기]를 흐리게 + 이유 한 줄 (PRD 3-12)
  const cap = Number(capacity);
  let blocked: string | null = null;
  if (!name.trim() || !date || !time || !capacity) blocked = "칸을 모두 채워 주세요";
  else if (!Number.isInteger(cap) || cap < 6 || cap > 10) blocked = "정원은 6~10명입니다";
  else if (now !== null && new Date(`${date}T${time}:00+09:00`).getTime() <= now)
    blocked = "이미 지난 시각입니다";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (blocked || busy) return;
    setBusy(true);
    setFailed(null);
    setDone(null);
    const result = await createClass({ name, date, time, capacity: cap });
    setBusy(false);
    if (!result.ok) {
      setFailed(result.reason);
      return;
    }
    setDone(`「${result.name}」 클래스를 열었습니다`);
    setName("");
    setDate("");
    setTime("");
    setCapacity("8");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl flex flex-col gap-4">
      <h1 className="text-xl font-bold">클래스 만들기</h1>

      {failed && (
        <div className="bg-white border border-[#EDE0D2] rounded-xl px-4 py-2.5 text-sm text-[#6E5C4C]">
          {failed}.{" "}
          <button type="submit" className="text-[#7A4B32] underline">
            다시 시도
          </button>
        </div>
      )}
      {done && (
        <div className="bg-white border border-[#1F8A5E] rounded-xl px-4 py-2.5 text-sm text-[#1F8A5E] font-semibold">
          {done}
        </div>
      )}

      <div className="bg-white border border-[#EDE0D2] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="class-name" className="text-sm text-[#6E5C4C]">
            이름
          </label>
          <input
            id="class-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 도자기 물레 체험"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="class-date" className="text-sm text-[#6E5C4C]">
              날짜
            </label>
            <input
              id="class-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="class-time" className="text-sm text-[#6E5C4C]">
              시간
            </label>
            <input
              id="class-time"
              type="time"
              step={600}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="class-capacity" className="text-sm text-[#6E5C4C]">
            정원 (6~10명)
          </label>
          <input
            id="class-capacity"
            type="number"
            min={6}
            max={10}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className={inputClass + " max-w-32"}
          />
        </div>

        <button
          type="submit"
          disabled={!!blocked || busy}
          className={
            "rounded-xl py-2.5 text-sm font-semibold " +
            (blocked || busy
              ? "bg-[#EDE0D2] text-[#9C8975] cursor-not-allowed"
              : "bg-[#7A4B32] text-white")
          }
        >
          {busy ? "만드는 중…" : "만들기"}
        </button>
        {blocked && <div className="text-sm text-[#B8590F] -mt-2">{blocked}</div>}
      </div>
    </form>
  );
}
