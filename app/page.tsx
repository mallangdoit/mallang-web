import { redirect } from "next/navigation";

// 첫 주소(/)로 들어오면 「오늘 클래스」로 넘긴다 (PRD 3.0 「첫 주소」)
export default function Home() {
  redirect("/today");
}
