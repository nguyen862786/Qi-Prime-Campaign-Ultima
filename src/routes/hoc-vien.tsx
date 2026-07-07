import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import {
  BookOpen, ShieldCheck, Building2, Lock, CheckCircle2, Circle,
  GraduationCap, Award, BarChart3, Sparkles, ArrowRight, X, PlayCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isBypassActive } from "@/lib/devBypass";

// cms_quiz / lesson_progress / quiz_attempts chưa có trong types.ts đã generate.
const db = supabase as any;

export const Route = createFileRoute("/hoc-vien")({
  head: () => ({
    meta: [
      { title: "Học Viện Qi Prime — 50 Bài Học Tư Duy & Quản Trị Rủi Ro" },
      { name: "description", content: "Khung đào tạo 50 bài học chia thành 3 module: Tư duy xác suất & cấu trúc dòng tiền, Quản trị Drawdown & EA, và Vận hành doanh nghiệp Master IB." },
    ],
  }),
  component: AcademyPage,
});

const MODULES = [
  { icon: BookOpen, code: "Module 01", title: "Nền Tảng Tư Duy Xác Suất & Cấu Trúc Dòng Tiền", desc: "Đặt nền móng tư duy xác suất, đọc hiểu hành vi thanh khoản và cấu trúc dòng tiền thị trường Forex/XAUUSD.", count: 15 },
  { icon: ShieldCheck, code: "Module 02", title: "Quản Trị Drawdown & Làm Chủ Hệ Thống Khóa Rủi Ro Bot EA", desc: "Cấu hình MDD cá nhân hóa, Kill-Switch, Smart Merge & Offset — làm chủ toàn bộ tầng phòng thủ của hệ thống EA.", count: 20 },
  { icon: Building2, code: "Module 03", title: "Xây Dựng Doanh Nghiệp FinTech Tự Động Hóa Cho Master IB", desc: "Vận hành phễu marketing, CRM tự động, cơ chế chia sẻ hiệu suất công nghệ minh bạch và mở rộng quy mô doanh nghiệp FinTech cá nhân.", count: 15 },
];

const VALUE_PROPS = [
  { icon: BarChart3, title: "Lộ trình 50 bài có cấu trúc", desc: "3 module tuần tự từ tư duy nền tảng → quản trị rủi ro → vận hành doanh nghiệp FinTech." },
  { icon: ShieldCheck, title: "Tập trung quản trị vốn", desc: "Không hô hào lợi nhuận — dạy kỷ luật, MDD, Kill-Switch và bảo toàn dòng vốn." },
  { icon: GraduationCap, title: "Trắc nghiệm cấp hoàn thành", desc: "Mỗi học viên phải vượt bài trắc nghiệm tổng để xác nhận hoàn thành khóa học online." },
  { icon: BarChart3, title: "Theo dõi tiến độ cá nhân", desc: "Hệ thống ghi nhận số bài đã học và trạng thái trắc nghiệm riêng cho từng tài khoản." },
];

type QuizQ = { q: string; options: string[]; answer: number };
const FALLBACK_QUIZ: QuizQ[] = [
  { q: "Mục tiêu cốt lõi xuyên suốt Học Viện Qi Prime là gì?", options: ["Tối đa hóa lợi nhuận nhanh", "Kỷ luật & quản trị rủi ro vốn", "Giao dịch theo cảm tính", "Tăng đòn bẩy tối đa"], answer: 1 },
  { q: "Kill-Switch trong hệ thống EA dùng để?", options: ["Tăng khối lượng lệnh", "Tự động ngắt khi chạm ngưỡng sụt giảm vốn", "Mở thêm lệnh đối ứng vô hạn", "Bỏ qua Stop Loss"], answer: 1 },
  { q: "MDD (Max Drawdown) phản ánh điều gì?", options: ["Tổng lợi nhuận tối đa", "Mức sụt giảm vốn tối đa từ đỉnh", "Số lệnh mỗi ngày", "Spread trung bình"], answer: 1 },
  { q: "Module 03 tập trung vào?", options: ["Tư duy xác suất cơ bản", "Cấu hình Bot phòng thủ", "Vận hành doanh nghiệp FinTech & Master IB", "Phân tích nến Nhật"], answer: 2 },
];
const PASS_RATIO = 0.75;

type Lesson = { id: string; title: string; category: string; order: number };
type Progress = { completed: string[]; quizPassed: boolean; quizScore: number };
const EMPTY: Progress = { completed: [], quizPassed: false, quizScore: 0 };

function AcademyPage() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const set = (u: { id: string; name: string } | null) => { if (mounted) { setUser(u); setAuthReady(true); } };
    if (isBypassActive()) { set({ id: "dev-bypass", name: "Dev Preview" }); return; }
    supabase.auth.getUser().then(({ data }) => {
      set(data.user ? { id: data.user.id, name: (data.user.user_metadata?.full_name as string) || data.user.email || "Học viên" } : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      set(session?.user ? { id: session.user.id, name: (session.user.user_metadata?.full_name as string) || session.user.email || "Học viên" } : null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const { data: dbLessons } = useQuery({
    queryKey: ["pub_lessons"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_lessons").select("*").eq("is_active", true).order("category").order("display_order");
      return data ?? [];
    },
  });

  const lessonList: Lesson[] = useMemo(() => {
    if (dbLessons && dbLessons.length) {
      return dbLessons.map((l: any) => ({ id: l.id, title: l.title, category: l.category, order: l.display_order }));
    }
    const out: Lesson[] = [];
    let n = 0;
    MODULES.forEach((m) => {
      for (let i = 1; i <= m.count; i++) { n++; out.push({ id: `mock-${n}`, title: `${m.title.split(" ").slice(0, 3).join(" ")} — Bài ${i}`, category: m.code, order: n }); }
    });
    return out;
  }, [dbLessons]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {!authReady ? (
        <div className="bg-ob-dark py-32 text-center text-white/50 text-sm">Đang tải Học Viện…</div>
      ) : user ? (
        <MemberDashboard user={user} lessons={lessonList} />
      ) : (
        <GuestLanding lessons={lessonList} />
      )}
      <Footer />
    </div>
  );
}

/* ============ GUEST (chưa đăng nhập) — Landing giới thiệu ============ */

function GuestLanding({ lessons }: { lessons: Lesson[] }) {
  return (
    <>
      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-ob-lime/40 bg-ob-lime/10 px-4 py-1.5 text-xs font-medium text-ob-lime mb-6">
            Học Viện Qi Prime · 50 Bài Học · 3 Module · Online
          </div>
          <h1 className="font-[Montserrat] text-3xl sm:text-5xl font-bold text-white leading-tight">
            Nền Tảng Học Online <span className="text-ob-lime">Kỷ Luật Thể Chế</span>
          </h1>
          <p className="mt-5 font-[Roboto] text-base text-white/85 max-w-2xl mx-auto font-medium">
            Lộ trình đào tạo bài bản cho nhà đầu tư nghiêm túc và Master IB — từ nền tảng tư duy xác suất, quản trị Drawdown, đến vận hành doanh nghiệp FinTech tự động hóa. Đăng ký tài khoản để học theo tiến độ cá nhân và nhận xác nhận hoàn thành khóa.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth" className="group inline-flex items-center justify-center gap-2 rounded-full bg-ob-lime px-7 py-3.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 transition-colors">
              Đăng Ký Học Miễn Phí
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/auth" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Đã có tài khoản · Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime-2 mb-3">Giá Trị Cho Học Viên</div>
          <h2 className="font-[Montserrat] text-3xl sm:text-4xl font-bold text-[#111827] leading-tight max-w-2xl">
            Học Viên Nhận Được Gì <span className="text-ob-lime">Khi Tham Gia</span>
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 border-t-4 border-t-ob-lime bg-white p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ob-dark">
                  <v.icon className="h-5 w-5 text-ob-lime" />
                </div>
                <h3 className="mt-4 font-[Montserrat] text-base font-bold text-[#111827]">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1F2937] font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-[Montserrat] text-2xl sm:text-3xl font-bold text-[#111827] mb-8">Cấu trúc 3 Module · 50 bài học</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {MODULES.map((m) => (
              <div key={m.code} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ob-dark">
                  <m.icon className="h-5 w-5 text-ob-lime" />
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime-2">{m.code} · {m.count} bài</div>
                <h3 className="mt-2 font-[Montserrat] text-lg font-bold text-[#111827] leading-snug">{m.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#1F2937] font-medium">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-[Montserrat] text-2xl sm:text-3xl font-bold text-[#111827]">Xem trước thư viện bài học</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ob-lime-2"><Lock className="h-3.5 w-3.5" /> Đăng nhập để mở khóa toàn bộ</span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.slice(0, 6).map((l) => (
              <div key={l.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ob-lime-2">{l.category} · Bài #{l.order}</div>
                <h3 className="mt-1 font-[Montserrat] font-bold text-[#111827] leading-snug line-clamp-2">{l.title}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Lock className="h-3.5 w-3.5" /> Nội dung dành cho thành viên
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-3xl bg-ob-dark p-8 text-center">
            <h3 className="font-[Montserrat] text-2xl font-bold text-white">Sẵn sàng bắt đầu lộ trình?</h3>
            <p className="mt-2 text-sm text-white/70">Tạo tài khoản miễn phí để học theo tiến độ riêng và nhận xác nhận hoàn thành khóa online.</p>
            <Link to="/auth" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ob-lime px-7 py-3.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 transition-colors">
              Đăng Ký Ngay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============ MEMBER (đã đăng nhập) — Dashboard tiến độ ============ */

function MemberDashboard({ user, lessons }: { user: { id: string; name: string }; lessons: Lesson[] }) {
  const isLocal = user.id === "dev-bypass";
  const storageKey = `qp_academy_${user.id}`;
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    let active = true;
    if (isLocal) {
      try { const raw = localStorage.getItem(storageKey); setProgress(raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY); } catch { setProgress(EMPTY); }
      return;
    }
    (async () => {
      const [{ data: prog }, { data: attempts }] = await Promise.all([
        db.from("lesson_progress").select("lesson_id").eq("user_id", user.id),
        db.from("quiz_attempts").select("score,passed").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
      ]);
      if (!active) return;
      const best = attempts?.[0];
      setProgress({
        completed: (prog ?? []).map((r: any) => r.lesson_id),
        quizPassed: !!best?.passed,
        quizScore: best?.score ?? 0,
      });
    })();
    return () => { active = false; };
  }, [user.id, isLocal, storageKey]);

  const { data: quizRows } = useQuery({
    queryKey: ["pub_quiz"],
    queryFn: async () => {
      const { data } = await db.from("cms_quiz").select("*").eq("is_active", true).order("display_order", { ascending: true });
      return data ?? [];
    },
  });
  const quiz: QuizQ[] = useMemo(() => {
    if (quizRows && quizRows.length) {
      return quizRows.map((r: any) => ({ q: r.question, options: Array.isArray(r.options) ? r.options : [], answer: r.answer_index ?? 0 }));
    }
    return FALLBACK_QUIZ;
  }, [quizRows]);

  const saveLocal = (next: Progress) => { try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ } };

  const toggleLesson = async (id: string) => {
    const has = progress.completed.includes(id);
    const next = { ...progress, completed: has ? progress.completed.filter((x) => x !== id) : [...progress.completed, id] };
    setProgress(next);
    if (isLocal) { saveLocal(next); return; }
    if (has) await db.from("lesson_progress").delete().eq("user_id", user.id).eq("lesson_id", id);
    else await db.from("lesson_progress").upsert({ user_id: user.id, lesson_id: id }, { onConflict: "user_id,lesson_id" });
  };

  const handleComplete = async (score: number, passed: boolean) => {
    const next = passed ? { ...progress, quizPassed: true, quizScore: score } : progress;
    if (passed) setProgress(next);
    if (isLocal) { if (passed) saveLocal(next); return; }
    await db.from("quiz_attempts").insert({ user_id: user.id, score, passed });
  };

  const total = lessons.length;
  const completedCount = progress.completed.filter((id) => lessons.some((l) => l.id === id)).length;
  const pct = total ? Math.round((completedCount / total) * 100) : 0;
  const quizUnlocked = total > 0 && completedCount >= Math.ceil(total * 0.8);
  const courseCompleted = completedCount >= total && progress.quizPassed && total > 0;

  const byModule = MODULES.map((m) => {
    const items = lessons.filter((l) => l.category === m.code);
    const done = items.filter((l) => progress.completed.includes(l.id)).length;
    return { ...m, items, done, totalItems: items.length || m.count };
  });

  return (
    <>
      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-ob-lime/40 bg-ob-lime/10 px-4 py-1.5 text-xs font-medium text-ob-lime mb-5">
                <Sparkles className="h-3.5 w-3.5" /> Khu vực học viên
              </div>
              <h1 className="font-[Montserrat] text-3xl sm:text-4xl font-bold text-white leading-tight">
                Chào <span className="text-ob-lime">{user.name}</span> 👋
              </h1>
              <p className="mt-3 text-sm text-white/70 leading-7 max-w-lg">
                Tiếp tục lộ trình của bạn. Hoàn thành tất cả bài học và vượt bài trắc nghiệm tổng để được xác nhận hoàn thành khóa học online.
              </p>
              {courseCompleted && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-ob-lime/40 bg-ob-lime/10 px-4 py-2.5 text-sm font-semibold text-ob-lime">
                  <Award className="h-5 w-5" /> Đã hoàn thành khóa học online · Đạt {progress.quizScore}%
                </div>
              )}
            </div>
            <ProgressRing pct={pct} completed={completedCount} total={total} />
          </div>
        </div>
      </section>

      <section className="bg-white py-10 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div className="flex items-start gap-4">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${progress.quizPassed ? "bg-ob-lime" : "bg-ob-dark"}`}>
                <GraduationCap className={`h-6 w-6 ${progress.quizPassed ? "text-ob-dark" : "text-ob-lime"}`} />
              </div>
              <div>
                <h3 className="font-[Montserrat] text-lg font-bold text-[#111827]">Trắc nghiệm hoàn thành khóa</h3>
                <p className="mt-1 text-sm text-[#374151] font-medium">
                  {progress.quizPassed
                    ? `Đã đạt ${progress.quizScore}% — bài trắc nghiệm tổng đã hoàn thành.`
                    : quizUnlocked
                      ? "Bạn đã đủ điều kiện làm bài trắc nghiệm tổng kết khóa học."
                      : `Hoàn thành tối thiểu 80% bài học để mở khóa (hiện ${pct}%).`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setQuizOpen(true)}
              disabled={!quizUnlocked || quiz.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ob-lime px-6 py-3 text-sm font-semibold text-ob-dark transition-all hover:bg-ob-lime/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {progress.quizPassed ? <CheckCircle2 className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              {progress.quizPassed ? "Làm lại trắc nghiệm" : quizUnlocked ? "Bắt đầu trắc nghiệm" : "Chưa mở khóa"}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          {byModule.map((m) => (
            <div key={m.code} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ob-dark"><m.icon className="h-5 w-5 text-ob-lime" /></div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ob-lime-2">{m.code}</div>
                    <h3 className="font-[Montserrat] text-lg font-bold text-[#111827] leading-snug">{m.title}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-[#111827]">{m.done}/{m.totalItems}</div>
                  <div className="text-[11px] text-[#374151]">bài hoàn thành</div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-ob-lime transition-all duration-500" style={{ width: `${m.totalItems ? (m.done / m.totalItems) * 100 : 0}%` }} />
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {m.items.map((l) => {
                  const done = progress.completed.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggleLesson(l.id)}
                      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        done ? "border-ob-lime/50 bg-ob-lime/10" : "border-slate-200 bg-slate-50 hover:border-ob-lime/40 hover:bg-white"
                      }`}
                    >
                      {done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ob-lime" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />}
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] font-semibold text-ob-lime-2">Bài {String(l.order).padStart(2, "0")}</span>
                        <span className={`block text-xs font-semibold leading-snug line-clamp-2 ${done ? "text-[#111827]" : "text-[#1F2937]"}`}>{l.title}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {quizOpen && (
        <QuizModal quiz={quiz} onClose={() => setQuizOpen(false)} onComplete={handleComplete} />
      )}
    </>
  );
}

function ProgressRing({ pct, completed, total }: { pct: number; completed: number; total: number }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = (circ * pct) / 100;
  return (
    <div className="flex items-center justify-center gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90">
          <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
          <circle cx="75" cy="75" r={r} fill="none" stroke="#b0e83a" strokeWidth="11" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} style={{ transition: "stroke-dasharray 0.7s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-ob-lime">{pct}%</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Tiến độ</span>
        </div>
      </div>
      <div>
        <div className="font-mono text-2xl font-bold text-white">{completed}<span className="text-white/40">/{total}</span></div>
        <div className="text-xs text-white/60">bài học hoàn thành</div>
      </div>
    </div>
  );
}

function QuizModal({ quiz, onClose, onComplete }: { quiz: QuizQ[]; onClose: () => void; onComplete: (score: number, passed: boolean) => void }) {
  const [answers, setAnswers] = useState<number[]>(Array(quiz.length).fill(-1));
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const submit = () => {
    const correct = quiz.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    const score = Math.round((correct / quiz.length) * 100);
    const passed = score >= PASS_RATIO * 100;
    setResult({ score, passed });
    onComplete(score, passed);
  };

  const allAnswered = answers.every((a) => a >= 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-ob-dark-2 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-[Montserrat] text-lg font-bold text-white">Trắc nghiệm tổng kết khóa</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {result ? (
          <div className="mt-6 text-center">
            <div className={`mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full ${result.passed ? "bg-ob-lime text-ob-dark" : "bg-rose-500/20 text-rose-300"}`}>
              {result.passed ? <Award className="h-8 w-8" /> : <X className="h-8 w-8" />}
            </div>
            <h4 className="mt-4 font-[Montserrat] text-xl font-bold text-white">{result.passed ? "Chúc mừng — Đạt!" : "Chưa đạt"}</h4>
            <p className="mt-1 text-sm text-white/60">Điểm số: {result.score}% (cần ≥ {PASS_RATIO * 100}%)</p>
            <div className="mt-6 flex gap-3 justify-center">
              {!result.passed && (
                <button onClick={() => { setAnswers(Array(quiz.length).fill(-1)); setResult(null); }} className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Làm lại</button>
              )}
              <button onClick={onClose} className="rounded-full bg-ob-lime px-5 py-2.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90">{result.passed ? "Hoàn tất" : "Đóng"}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-5 space-y-5">
              {quiz.map((q, qi) => (
                <div key={qi}>
                  <div className="text-sm font-semibold text-white">{qi + 1}. {q.q}</div>
                  <div className="mt-2 space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const active = answers[qi] === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                          className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-all ${
                            active ? "border-ob-lime bg-ob-lime/10 text-white" : "border-white/10 bg-white/[0.02] text-white/75 hover:border-white/25"
                          }`}
                        >
                          <span className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? "border-ob-lime bg-ob-lime" : "border-white/30"}`}>
                            {active && <span className="h-1.5 w-1.5 rounded-full bg-ob-dark" />}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submit}
              disabled={!allAnswered}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ob-lime px-6 py-3 text-sm font-semibold text-ob-dark transition-all hover:bg-ob-lime/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Nộp bài ({answers.filter((a) => a >= 0).length}/{quiz.length})
            </button>
          </>
        )}
      </div>
    </div>
  );
}
