// 가짜 데이터 — 받은 신청(3-3)용. PRD 5.9 기준.
// 3-2 todayClasses의 정원 상태와 이어져 있다 — c2(가죽 카드지갑 만들기)는 이미 마감이라
// 그 신청은 [대기로 걸기]가 뜨는 경우를 자연스럽게 보여준다.

export interface PendingRequest {
  id: string;
  name: string;
  phone: string;
  classId: string; // sample-data.ts의 ClassSession.id
  classTime: string;
  className: string;
  note: string | null;
  receivedAt: string; // 접수 시각, 보여주기용 문자열
}

export const pendingRequests: PendingRequest[] = [
  {
    id: "r1",
    name: "한서준",
    phone: "010-2233-9981",
    classId: "c1",
    classTime: "10:00",
    className: "도자기 물레 체험",
    note: "처음이라 좀 떨려요! 몇 시까지 가면 될까요?",
    receivedAt: "09:12",
  },
  {
    id: "r2",
    name: "백승아",
    phone: "010-7744-5521",
    classId: "c3",
    classTime: "16:00",
    className: "마크라메 화분걸이",
    note: "친구랑 같이 2명이요~",
    receivedAt: "09:30",
  },
  {
    id: "r3",
    name: "오지훈",
    phone: "010-9081-2234",
    classId: "c2",
    classTime: "14:00",
    className: "가죽 카드지갑 만들기",
    note: null,
    receivedAt: "09:45",
  },
];
