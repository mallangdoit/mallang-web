import { supabase } from "./supabase";

// 시각은 늘 한국 시간 기준 (PRD 10장) — Vercel 서버는 UTC로 돈다
const TZ = "Asia/Seoul";

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

// 한국 시간으로 오늘 날짜 "2026-10-08"
function seoulToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

function todayRange() {
  const start = new Date(`${seoulToday()}T00:00:00+09:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

const CONFIRMED_STATUSES = ["확정", "출석"];

export async function getTodayData() {
  const { start, end } = todayRange();

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, starts_at, capacity")
    .gte("starts_at", start)
    .lt("starts_at", end)
    .order("starts_at", { ascending: true });

  const { data: reservations } = await supabase
    .from("reservations")
    .select("id, note, status, class_id, students(name, phone)");

  const { count: pendingRequestCount } = await supabase
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("status", "신청");

  const rows = (classes ?? []).map((c) => {
    const classReservations = (reservations ?? []).filter(
      (r: any) => r.class_id === c.id
    );
    const confirmed = classReservations.filter((r: any) =>
      CONFIRMED_STATUSES.includes(r.status)
    );
    const people = confirmed.map((r: any) => ({
      name: r.students?.name ?? "",
      phone: r.students?.phone ?? "",
      status: r.status,
      note: r.note ?? null,
      className: c.name,
      classTime: fmtTime(c.starts_at),
    }));
    return {
      id: c.id,
      time: fmtTime(c.starts_at),
      name: c.name,
      capacity: c.capacity,
      full: confirmed.length >= c.capacity,
      confirmedCount: confirmed.length,
      people,
    };
  });

  const [, month, day] = seoulToday().split("-").map(Number);
  const dateLabel = `${month}월 ${day}일`;

  return {
    dateLabel,
    pendingRequestCount: pendingRequestCount ?? 0,
    classes: rows,
  };
}

export async function getPendingRequests() {
  const { data: reservations } = await supabase
    .from("reservations")
    .select(
      "id, note, created_at, students(name, phone), classes(id, name, starts_at, capacity)"
    )
    .eq("status", "신청")
    .order("created_at", { ascending: false });

  const { data: allReservations } = await supabase
    .from("reservations")
    .select("class_id, status");

  function classIsFull(classId: string, capacity: number) {
    const count = (allReservations ?? []).filter(
      (r: any) => r.class_id === classId && CONFIRMED_STATUSES.includes(r.status)
    ).length;
    return count >= capacity;
  }

  return (reservations ?? []).map((r: any) => ({
    id: r.id,
    name: r.students?.name ?? "",
    phone: r.students?.phone ?? "",
    classTime: fmtTime(r.classes.starts_at),
    className: r.classes.name,
    note: r.note ?? null,
    full: classIsFull(r.classes.id, r.classes.capacity),
  }));
}

// 알림판 (PRD 3-5) — 📌 고정 글을 맨 위에, 나머지는 최신순
export async function getNotices() {
  const { data } = await supabase
    .from("notices")
    .select("id, content, pinned")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}
