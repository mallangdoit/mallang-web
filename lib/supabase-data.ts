import { supabase } from "./supabase";

function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
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

  const now = new Date();
  const dateLabel = `${now.getMonth() + 1}월 ${now.getDate()}일`;

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
