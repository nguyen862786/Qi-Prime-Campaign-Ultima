import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data: stats } = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [subs, users, elite] = await Promise.all([
        supabase.from("ib_audit_submissions").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("ib_audit_submissions").select("id", { count: "exact", head: true }).eq("tier", "elite"),
      ]);
      return {
        submissions: subs.count ?? 0,
        users: users.count ?? 0,
        elite: elite.count ?? 0,
      };
    },
  });

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-[Montserrat] text-3xl font-bold">Tổng Quan Hệ Thống</h1>
      <p className="mt-2 text-white/60">Theo dõi hiệu suất phễu Master IB và cộng đồng Qi Prime.</p>
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat label="Tổng IB submissions" value={stats?.submissions} />
        <Stat label="Elite leads" value={stats?.elite} accent />
        <Stat label="Người dùng đã đăng ký" value={stats?.users} />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value?: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 ${accent ? "border-ob-lime/40 bg-ob-lime/5" : "border-white/10 bg-white/[0.03]"}`}>
      <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
      <div className={`mt-2 font-mono text-3xl font-bold ${accent ? "text-ob-lime" : "text-white"}`}>{value ?? "—"}</div>
    </div>
  );
}