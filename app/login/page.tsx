import LoginForm from "./LoginForm";

// PRD 3-1 로그인 — A 중앙 카드. 맨 위 줄이 없다
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FBF7F2] text-[#2B2018] px-4 flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
