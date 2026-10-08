"use client";

import { useState } from "react";
import { postNotice } from "@/lib/actions";

interface Notice {
  id: string;
  content: string;
  pinned: boolean;
}

// PRD 3-5 알림판 — A 목록형
export default function NoticeBoard({ initial }: { initial: Notice[] }) {
  const [notices, setNotices] = useState(initial);
  const [writing, setWriting] = useState(false);
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [posting, setPosting] = useState(false);
  const [failed, setFailed] = useState(false);

  const canPost = content.trim().length > 0 && !posting;

  function close() {
    setWriting(false);
    setContent("");
    setPinned(false);
    setFailed(false);
  }

  async function handlePost() {
    if (!canPost) return;
    setPosting(true);
    setFailed(false);
    const result = await postNotice(content, pinned);
    setPosting(false);
    if (!result.ok) {
      setFailed(true);
      return;
    }
    // 고정 글은 맨 위, 나머지는 최신순 — 새 글은 같은 묶음의 맨 앞
    setNotices((ns) =>
      result.notice.pinned
        ? [result.notice, ...ns]
        : [
            ...ns.filter((n) => n.pinned),
            result.notice,
            ...ns.filter((n) => !n.pinned),
          ]
    );
    close();
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold mb-4">알림판</h1>

      {writing ? (
        <div className="bg-white border border-[#EDE0D2] rounded-2xl p-4 mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용을 적어 주세요"
            rows={3}
            className="w-full border border-[#EDE0D2] rounded-xl p-3 text-sm outline-none focus:border-[#7A4B32]"
          />
          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="accent-[#7A4B32]"
            />
            상단에 고정
          </label>
          {failed && (
            <div className="text-sm text-[#6E5C4C] mt-2">
              올리지 못했어요.{" "}
              <button
                type="button"
                onClick={handlePost}
                className="text-[#7A4B32] underline"
              >
                다시 시도
              </button>
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handlePost}
              disabled={!canPost}
              className={
                "rounded-lg px-4 py-1.5 text-sm font-semibold " +
                (canPost
                  ? "bg-[#7A4B32] text-white"
                  : "bg-[#EDE0D2] text-[#9C8975] cursor-not-allowed")
              }
            >
              {posting ? "올리는 중…" : "올리기"}
            </button>
            <button
              type="button"
              onClick={close}
              className="border border-[#EDE0D2] rounded-lg px-4 py-1.5 text-sm"
            >
              취소
            </button>
          </div>
          {!content.trim() && (
            <div className="text-xs text-[#9C8975] mt-2">
              내용을 적어야 올릴 수 있어요
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setWriting(true)}
          className="w-full bg-white border border-[#EDE0D2] rounded-2xl py-3 mb-4 text-sm font-semibold text-[#7A4B32]"
        >
          + 새 공지 쓰기
        </button>
      )}

      {notices.length === 0 ? (
        <div className="bg-white border border-[#EDE0D2] rounded-2xl p-6 text-center text-[#6E5C4C]">
          아직 올린 공지가 없습니다
        </div>
      ) : (
        <div className="bg-white border border-[#EDE0D2] rounded-2xl divide-y divide-[#EDE0D2]">
          {notices.map((n) => (
            <div
              key={n.id}
              className={"px-4 py-3 text-sm " + (n.pinned ? "font-semibold" : "")}
            >
              {n.pinned ? "📌 " : ""}
              {n.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
