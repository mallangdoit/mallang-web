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
