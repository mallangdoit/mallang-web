"use server";

import { supabase } from "./supabase";

const CONFIRMED_STATUSES = ["확정", "출석"];

export async function confirmReservation(id: string) {
  const { data: reservation } = await supabase
    .from("reservations")
    .select("class_id")
    .eq("id", id)
    .single();
  if (!reservation) return { ok: false };

  const { data: cls } = await supabase
    .from("classes")
    .select("capacity")
    .eq("id", reservation.class_id)
    .single();

  const { data: existing } = await supabase
    .from("reservations")
    .select("status")
    .eq("class_id", reservation.class_id);

  const confirmedCount = (existing ?? []).filter((r) =>
    CONFIRMED_STATUSES.includes(r.status)
  ).length;

  // 그 사이 다른 신청이 먼저 확정돼 자리가 다 찼으면, 확정 대신 대기로 돌린다 (정원 초과 방지).
  const nextStatus = cls && confirmedCount >= cls.capacity ? "대기" : "확정";

  await supabase.from("reservations").update({ status: nextStatus }).eq("id", id);
  return { ok: true, status: nextStatus };
}

export async function rejectReservation(id: string) {
  await supabase.from("reservations").update({ status: "거절" }).eq("id", id);
}

export async function waitlistReservation(id: string) {
  await supabase.from("reservations").update({ status: "대기" }).eq("id", id);
}

export async function postNotice(content: string, pinned: boolean) {
  const text = content.trim();
  if (!text) return { ok: false as const };
  const { data, error } = await supabase
    .from("notices")
    .insert({ content: text, pinned })
    .select("id, content, pinned")
    .single();
  if (error || !data) return { ok: false as const };
  return { ok: true as const, notice: data };
}

// 클래스 만들기 (PRD 3-12) — 정원 6~10 · 지난 시각 막기 · 시각은 한국 시간
export async function createClass(input: {
  name: string;
  date: string;
  time: string;
  capacity: number;
}) {
  const name = input.name.trim();
  if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !/^\d{2}:\d{2}$/.test(input.time)) {
    return { ok: false as const, reason: "칸을 모두 채워 주세요" };
  }
  if (!Number.isInteger(input.capacity) || input.capacity < 6 || input.capacity > 10) {
    return { ok: false as const, reason: "정원은 6~10명입니다" };
  }
  const startsAt = new Date(`${input.date}T${input.time}:00+09:00`);
  if (startsAt.getTime() <= Date.now()) {
    return { ok: false as const, reason: "이미 지난 시각입니다" };
  }
  const { error } = await supabase.from("classes").insert({
    id: `c-${Date.now().toString(36)}`,
    name,
    starts_at: startsAt.toISOString(),
    capacity: input.capacity,
  });
  if (error) return { ok: false as const, reason: "만들지 못했어요" };
  return { ok: true as const, name };
}
