"use client";

import { useState } from "react";
import {
  confirmReservation,
  rejectReservation,
  waitlistReservation,
} from "@/lib/actions";

interface RequestView {
  id: string;
  name: string;
  phone: string;
  classTime: string;
  className: string;
  note: string | null;
  full: boolean;
}

export default function RequestsList({
  initial,
}: {
  initial: RequestView[];
}) {
  const [requests, setRequests] = useState(initial);
  const [confirming, setConfirming] = useState<{
    id: string;
    action: "reject" | "waitlist";
  } | null>(null);

  function remove(id: string) {
    setRequests((rs) => rs.filter((r) => r.id !== id));
    setConfirming(null);
  }

  async function handleConfirm(id: string) {
    remove(id);
    await confirmReservation(id);
  }

  async function handleReject(id: string) {
    remove(id);
    await rejectReservation(id);
  }

  async function handleWaitlist(id: string) {
    remove(id);
    await waitlistReservation(id);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">받은 신청 {requests.length}건</h1>
        <span className="text-sm text-[#6E5C4C]">최신순</span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-[#EDE0D2] rounded-2xl p-6 text-center text-[#6E5C4C]">
          새로 들어온 신청이 없습니다
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((r) => {
            const isConfirming = confirming?.id === r.id;
            return (
              <div
                key={r.id}
                className={
                  "bg-white rounded-2xl p-4 border " +
                  (r.full ? "border-[#B8590F]" : "border-[#EDE0D2]")
                }
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-semibold">
                    {r.name}{" "}
                    <span className="font-normal text-[#6E5C4C] text-sm">
                      · {r.phone}
                    </span>
                  </div>
                  <div
                    className={
                      "text-sm " +
                      (r.full ? "text-[#B8590F] font-semibold" : "text-[#6E5C4C]")
                    }
                  >
                    {r.classTime} {r.className}
                    {r.full ? " · 마감" : ""}
                  </div>
                </div>

                <div className="text-sm text-[#6E5C4C] mt-2">
                  {r.full
                    ? "자리가 없어 대기로 안내드릴 자리입니다."
                    : r.note ?? ""}
                </div>

                {isConfirming ? (
                  <div className="mt-3 bg-[#FBF7F2] border border-[#EDE0D2] rounded-xl p-3 text-sm">
                    <div className="mb-2">
                      {r.name}님을{" "}
                      {confirming?.action === "reject" ? "거절" : "대기로"}{" "}
                      {confirming?.action === "reject" ? "할까요?" : "걸까요?"}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          confirming?.action === "reject"
                            ? handleReject(r.id)
                            : handleWaitlist(r.id)
                        }
                        className="bg-[#7A4B32] text-white rounded-lg px-3 py-1 text-sm font-semibold"
                      >
                        {confirming?.action === "reject" ? "거절하기" : "확인"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirming(null)}
                        className="border border-[#EDE0D2] rounded-lg px-3 py-1 text-sm"
                      >
                        그대로
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    {r.full ? (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirming({ id: r.id, action: "waitlist" })
                        }
                        className="bg-[#B8590F] text-white rounded-lg px-4 py-1.5 text-sm font-semibold"
                      >
                        대기로 걸기
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConfirm(r.id)}
                        className="bg-[#7A4B32] text-white rounded-lg px-4 py-1.5 text-sm font-semibold"
                      >
                        확정
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setConfirming({ id: r.id, action: "reject" })
                      }
                      className="border border-[#EDE0D2] rounded-lg px-4 py-1.5 text-sm"
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
