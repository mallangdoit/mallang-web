// 가짜 데이터 — PRD 5.9 "넣어둘 데이터" 기준으로 만든 샘플.
// 3주차(또는 Supabase 연결)에 이 파일만 걷어내면 진짜 데이터로 바뀌게 한다.

export type ReservationStatus =
  | "신청"
  | "대기"
  | "확정"
  | "출석"
  | "안옴"
  | "거절"
  | "취소";

export interface Reservation {
  name: string;
  phone: string;
  status: ReservationStatus;
  note?: string;
}

export interface ClassSession {
  id: string;
  name: string;
  time: string; // "HH:mm"
  capacity: number;
  reservations: Reservation[];
}

// 정원 숫자(현재/정원)와 이름 줄은 확정·출석 상태만 센다 (PRD 3-2).
const COUNTS_TOWARD_CAPACITY: ReservationStatus[] = ["확정", "출석"];

export function confirmedReservations(session: ClassSession): Reservation[] {
  return session.reservations.filter((r) =>
    COUNTS_TOWARD_CAPACITY.includes(r.status)
  );
}

export function isFull(session: ClassSession): boolean {
  return confirmedReservations(session).length >= session.capacity;
}

export const todayClasses: ClassSession[] = [
  {
    id: "c1",
    name: "도자기 물레 체험",
    time: "10:00",
    capacity: 8,
    reservations: [
      { name: "김하나", phone: "010-1234-5678", status: "확정" },
      { name: "이두리", phone: "010-2345-6789", status: "확정", note: "처음이라 좀 떨려요" },
      { name: "박세라", phone: "010-3456-7890", status: "확정" },
      { name: "최도윤", phone: "010-4567-8901", status: "확정" },
      { name: "정하늘", phone: "010-5678-9012", status: "확정" },
      { name: "윤소이", phone: "010-6789-0123", status: "확정" },
    ],
  },
  {
    id: "c2",
    name: "가죽 카드지갑 만들기",
    time: "14:00",
    capacity: 6,
    reservations: [
      { name: "강민준", phone: "010-7890-1234", status: "확정" },
      { name: "서지우", phone: "010-8901-2345", status: "확정" },
      { name: "한소율", phone: "010-9012-3456", status: "확정" },
      { name: "오지안", phone: "010-0123-4567", status: "확정" },
      { name: "배유나", phone: "010-1111-2222", status: "확정" },
      { name: "임도현", phone: "010-2222-3333", status: "확정" },
    ],
  },
  {
    id: "c3",
    name: "마크라메 화분걸이",
    time: "16:00",
    capacity: 10,
    reservations: [
      { name: "신유준", phone: "010-3333-4444", status: "확정" },
      { name: "조은서", phone: "010-4444-5555", status: "확정" },
      { name: "백승민", phone: "010-5555-6666", status: "확정" },
      { name: "문채원", phone: "010-6666-7777", status: "출석" },
    ],
  },
];

// 받은 신청 배지용 — 「받은 신청」 화면은 다음 상자(13단계)에서 만든다.
export const pendingRequestCount = 3;
