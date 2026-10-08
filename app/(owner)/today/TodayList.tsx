"use client";

import { useState } from "react";
import Link from "next/link";

interface PersonView {
  name: string;
  phone: string;
  status: string;
  note: string | null;
  className: string;
  classTime: string;
}

interface ClassView {
  id: string;
  time: string;
  name: string;
  capacity: number;
  full: boolean;
  confirmedCount: number;
  people: PersonView[];
}

export default function TodayList({
  dateLabel,
  pendingRequestCount,
  classes,
}: {
  dateLabel: string;
  pendingRequestCount: number;
  classes: ClassView[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PersonView | null>(null);
  const trimmed = query.trim();

  const visible = classes
    .map((c) => ({
      ...c,
      matchedPeople: trimmed
        ? c.people.filter((p) => p.name.includes(trimmed))
        : c.people,
    }))
    .filter((c) => (trimmed ? c.matchedPeople.length > 0 : true));

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{dateLabel} · 오늘 클래스</h1>
        {pendingRequestCount > 0 && (
          <Link
            href="/requests"
            className="text-sm font-semibold bg-[#7A4B32] text-white rounded-full px-3 py-1"
          >
            받은 신청 {pendingRequestCount}
          </Link>
        )}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 이름 검색"
        className="w-full mb-4 px-4 py-2 rounded-xl border border-[#EDE0D2] bg-white text-[#2B2018] placeholder:text-[#9C8975] outline-none focus:border-[#7A4B32]"
      />

      {classes.length === 0 ? (
        <div className="bg-white border border-[#EDE0D2] rounded-2xl p-6 text-center text-[#6E5C4C]">
          오늘은 클래스가 없습니다
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-[#EDE0D2] rounded-2xl p-6 text-center text-[#6E5C4C]">
          찾는 분이 없습니다
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-[#EDE0D2] rounded-2xl p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">
                  {session.time} {session.name}
                </span>
                <span
                  className={
                    session.full
                      ? "text-[#B8590F] font-semibold"
                      : "text-[#7A4B32] font-semibold"
                  }
                >
                  {session.full
                    ? "마감"
                    : `${session.confirmedCount}/${session.capacity}`}
                </span>
              </div>
              <div className="text-sm text-[#6E5C4C] mt-2 flex flex-wrap gap-x-1">
                {session.matchedPeople.map((p, i) => (
                  <span key={p.name}>
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      className="underline decoration-dotted hover:text-[#7A4B32]"
                    >
                      {p.name}
                    </button>
                    {i < session.matchedPeople.length - 1 ? " ·" : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">신청자 정보</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="닫기"
                className="text-[#9C8975] hover:text-[#2B2018] text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold">{selected.name}</div>
              <div className="text-[#6E5C4C]">{selected.phone}</div>
              <div className="border-t border-[#EDE0D2] my-2" />
              <div>
                {selected.classTime} {selected.className}
              </div>
              <div className="text-[#6E5C4C]">상태: {selected.status}</div>
              <div className="text-[#6E5C4C]">
                남긴 말: {selected.note ?? "(없음)"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
