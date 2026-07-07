import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Crown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/submissions")({
  component: SubsPage,
});

function SubsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin_subs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("ib_audit_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      return data ?? [];
    },
  });

  return (
    <div className="p-8">
      <h1 className="font-[Montserrat] text-3xl font-bold">IB Audit Submissions</h1>
      <p className="mt-2 text-white/60 text-sm">200 hồ sơ gần nhất từ phễu khảo sát Master IB.</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/60">
            <tr>
              <th className="text-left p-3">Tier</th>
              <th className="text-left p-3">Họ tên</th>
              <th className="text-left p-3">Phone / Zalo</th>
              <th className="text-left p-3">Team</th>
              <th className="text-left p-3">Volume</th>
              <th className="text-left p-3">Brokers</th>
              <th className="text-left p-3">Khi nào</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-4 text-white/50" colSpan={7}>Đang tải...</td></tr>}
            {data?.map((r: any) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="p-3">
                  {r.tier === "elite" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ob-lime/20 px-2 py-0.5 text-[10px] font-semibold text-ob-lime">
                      <Crown className="h-3 w-3" /> ELITE
                    </span>
                  ) : <span className="text-white/40 text-xs">standard</span>}
                </td>
                <td className="p-3 text-white">{r.full_name}</td>
                <td className="p-3 text-white/70 font-mono text-xs">{r.phone_zalo}</td>
                <td className="p-3 text-white/70 text-xs">{r.team_size_bucket}</td>
                <td className="p-3 text-white/70 text-xs">{r.monthly_volume_bucket}</td>
                <td className="p-3 text-white/60 text-xs">{(r.brokers || []).join(", ") || "—"}</td>
                <td className="p-3 text-white/40 text-xs">{new Date(r.created_at).toLocaleString("vi-VN")}</td>
              </tr>
            ))}
            {data && data.length === 0 && <tr><td className="p-6 text-center text-white/40" colSpan={7}>Chưa có hồ sơ nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}