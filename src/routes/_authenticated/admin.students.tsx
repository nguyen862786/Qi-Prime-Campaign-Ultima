import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, GraduationCap, Award, Search, CheckCircle2, Download } from "lucide-react";

// lesson_progress / quiz_attempts chưa có trong types.ts đã generate.
const db = supabase as any;

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: StudentsPage,
});

type Row = {
  id: string;
  name: string;
  email: string;
  membership: string;
  completed: number;
  quizPassed: boolean;
  bestScore: number;
  last: string | null;
};

function StudentsPage() {
  const [q, setQ] = useState("");

  const { data: lessonCount } = useQuery({
    queryKey: ["admin_lesson_count"],
    queryFn: async () => {
      const { count } = await supabase.from("cms_lessons").select("*", { count: "exact", head: true }).eq("is_active", true);
      return count ?? 0;
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin_profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, email, membership_status").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["admin_progress"],
    queryFn: async () => {
      const { data } = await db.from("lesson_progress").select("user_id, lesson_id, completed_at");
      return data ?? [];
    },
  });

  const { data: attempts } = useQuery({
    queryKey: ["admin_attempts"],
    queryFn: async () => {
      const { data } = await db.from("quiz_attempts").select("user_id, score, passed, created_at");
      return data ?? [];
    },
  });

  const total = (lessonCount && lessonCount > 0 ? lessonCount : 50) as number;

  const rows: Row[] = useMemo(() => {
    const map = new Map<string, { completed: number; quizPassed: boolean; bestScore: number; last: string | null }>();
    const get = (uid: string) => {
      if (!map.has(uid)) map.set(uid, { completed: 0, quizPassed: false, bestScore: 0, last: null });
      return map.get(uid)!;
    };
    const bump = (cur: string | null, t: string) => (!cur || t > cur ? t : cur);

    (progress ?? []).forEach((r: any) => { const u = get(r.user_id); u.completed++; u.last = bump(u.last, r.completed_at); });
    (attempts ?? []).forEach((a: any) => { const u = get(a.user_id); if (a.passed) u.quizPassed = true; if ((a.score ?? 0) > u.bestScore) u.bestScore = a.score; u.last = bump(u.last, a.created_at); });

    return (profiles ?? []).map((p: any) => {
      const act = map.get(p.id) ?? { completed: 0, quizPassed: false, bestScore: 0, last: null };
      return {
        id: p.id,
        name: p.full_name || "—",
        email: p.email || p.id.slice(0, 8),
        membership: p.membership_status || "free",
        completed: act.completed,
        quizPassed: act.quizPassed,
        bestScore: act.bestScore,
        last: act.last,
      };
    });
  }, [profiles, progress, attempts]);

  const filtered = rows.filter((r) =>
    !q.trim() || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase())
  );

  const totalStudents = rows.length;
  const completedCourse = rows.filter((r) => r.completed >= total && r.quizPassed).length;
  const passedQuiz = rows.filter((r) => r.quizPassed).length;

  const exportCsv = () => {
    const headers = ["Họ tên", "Email", "Gói", "Đã học", "Tổng bài", "Tiến độ %", "Trắc nghiệm đạt", "Điểm cao nhất", "Trạng thái khóa", "Hoạt động gần nhất"];
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = filtered.map((r) => {
      const pct = total ? Math.round((r.completed / total) * 100) : 0;
      const done = r.completed >= total && r.quizPassed;
      return [
        r.name,
        r.email,
        r.membership,
        r.completed,
        total,
        pct,
        r.quizPassed ? "Đạt" : "Chưa",
        r.bestScore,
        done ? "Hoàn thành" : "Đang học",
        r.last ? new Date(r.last).toLocaleString("vi-VN") : "",
      ].map(esc).join(",");
    });
    const csv = "﻿" + [headers.map(esc).join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qiprime-hocvien-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[Montserrat] text-3xl font-bold">Học viên & Tiến độ</h1>
          <p className="mt-2 text-white/60 text-sm">Theo dõi tiến độ học, kết quả trắc nghiệm và trạng thái hoàn thành khóa của từng tài khoản.</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-ob-lime px-5 py-2.5 text-sm font-semibold text-ob-dark transition-all hover:bg-ob-lime/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Xuất CSV ({filtered.length})
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard icon={Users} label="Tổng học viên" value={String(totalStudents)} />
        <SummaryCard icon={Award} label="Đã đạt trắc nghiệm" value={String(passedQuiz)} accent />
        <SummaryCard icon={GraduationCap} label="Hoàn thành khóa" value={`${completedCourse}/${totalStudents}`} accent />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên hoặc email..."
          className="w-full rounded-lg border border-white/15 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:border-ob-lime focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left text-[11px] uppercase tracking-wider text-white/45">
              <th className="px-4 py-3 font-semibold">Học viên</th>
              <th className="px-4 py-3 font-semibold">Gói</th>
              <th className="px-4 py-3 font-semibold">Tiến độ</th>
              <th className="px-4 py-3 font-semibold">Trắc nghiệm</th>
              <th className="px-4 py-3 font-semibold">Trạng thái khóa</th>
              <th className="px-4 py-3 font-semibold text-right">Hoạt động gần nhất</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const pct = total ? Math.round((r.completed / total) * 100) : 0;
              const done = r.completed >= total && r.quizPassed;
              return (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{r.name}</div>
                    <div className="text-[11px] text-white/45">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase text-white/70">{r.membership}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full bg-ob-lime" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-mono text-xs text-white/80">{r.completed}/{total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {r.quizPassed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ob-lime/20 px-2 py-0.5 text-[11px] font-semibold text-ob-lime">
                        <CheckCircle2 className="h-3 w-3" /> Đạt {r.bestScore}%
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/50">Chưa</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {done ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ob-lime"><Award className="h-3.5 w-3.5" /> Hoàn thành</span>
                    ) : (
                      <span className="text-[11px] text-white/50">Đang học</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-white/50">
                    {r.last ? new Date(r.last).toLocaleDateString("vi-VN") : "—"}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-white/40">Không có học viên phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, accent }: { icon: typeof Users; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-ob-lime/15 text-ob-lime" : "bg-white/5 text-white/70"}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 font-mono text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/50">{label}</div>
    </div>
  );
}
