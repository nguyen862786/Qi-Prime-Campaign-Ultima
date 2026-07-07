import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollText, Filter, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditPage,
});

const EVENT_LABELS: Record<string, { label: string; tone: string }> = {
  dev_mode_on:    { label: "Dev Mode · ON",      tone: "bg-ob-lime/20 text-ob-lime" },
  dev_mode_off:   { label: "Dev Mode · OFF",     tone: "bg-white/10 text-white/70" },
  role_sim:       { label: "Simulate Role",       tone: "bg-sky-400/15 text-sky-300" },
  viewport_sim:   { label: "Viewport Sandbox",    tone: "bg-violet-400/15 text-violet-300" },
  inspect_toggle: { label: "CMS Inspect Toggle",  tone: "bg-amber-300/15 text-amber-300" },
  fresh_session:  { label: "Fresh Session",       tone: "bg-rose-400/15 text-rose-300" },
  cms_inspect:    { label: "CMS Inspect",         tone: "bg-emerald-400/15 text-emerald-300" },
};

function AuditPage() {
  const [filter, setFilter] = useState<string>("all");
  const [limit, setLimit] = useState(100);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["dev_audit_log", filter, limit],
    queryFn: async () => {
      let q = supabase
        .from("dev_audit_log")
        .select("id, event_type, payload, route, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (filter !== "all") q = q.eq("event_type", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    (data ?? []).forEach((r: any) => { c[r.event_type] = (c[r.event_type] ?? 0) + 1; });
    return c;
  }, [data]);

  return (
    <div className="p-8 max-w-6xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[Montserrat] text-3xl font-bold flex items-center gap-2">
            <ScrollText className="h-7 w-7 text-ob-lime" /> Dev Audit Log
          </h1>
          <p className="mt-2 text-white/60 text-sm">
            Mọi thay đổi mô phỏng Dev Review Mode và lượt kiểm tra badge CMS được ghi lại tại đây với timestamp đầy đủ.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-full bg-ob-lime px-4 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-60"
          disabled={isFetching}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} /> Làm mới
        </button>
      </header>

      {/* Filter chips */}
      <div className="mt-6 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs text-white/50 mr-1"><Filter className="h-3 w-3" /> Lọc:</span>
        <Chip active={filter === "all"} onClick={() => setFilter("all")} label={`Tất cả (${data?.length ?? 0})`} tone="bg-white/10 text-white" />
        {Object.entries(EVENT_LABELS).map(([k, v]) => (
          <Chip key={k} active={filter === k} onClick={() => setFilter(k)} label={`${v.label}${counts[k] ? ` · ${counts[k]}` : ""}`} tone={v.tone} />
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="grid grid-cols-[170px_180px_1fr_120px] gap-4 px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold border-b border-white/10 bg-white/[0.03]">
          <span>Thời gian</span>
          <span>Sự kiện</span>
          <span>Payload</span>
          <span>Route</span>
        </div>
        {isLoading ? (
          <div className="px-5 py-10 text-center text-white/40 text-sm">Đang tải...</div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="px-5 py-10 text-center text-white/40 text-sm">Chưa có log nào.</div>
        ) : (
          <ul>
            {data!.map((row: any) => {
              const meta = EVENT_LABELS[row.event_type] ?? { label: row.event_type, tone: "bg-white/10 text-white" };
              return (
                <li key={row.id} className="grid grid-cols-[170px_180px_1fr_120px] gap-4 px-5 py-3 border-b border-white/5 last:border-0 items-start text-xs hover:bg-white/[0.02]">
                  <span className="font-mono text-white/70">{formatTs(row.created_at)}</span>
                  <span><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.tone}`}>{meta.label}</span></span>
                  <span className="font-mono text-[11px] text-white/60 break-all">{summarize(row.payload)}</span>
                  <span className="font-mono text-[11px] text-white/40 truncate">{row.route || "—"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-white/40">Hiển thị {data?.length ?? 0} dòng (giới hạn {limit}).</span>
        <div className="flex items-center gap-2">
          {[100, 250, 500].map((n) => (
            <button
              key={n}
              onClick={() => setLimit(n)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${limit === n ? "bg-ob-lime text-ob-dark" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, label, tone }: { active: boolean; onClick: () => void; label: string; tone: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${active ? "ring-2 ring-ob-lime " + tone : tone + " opacity-70 hover:opacity-100"}`}
    >
      {label}
    </button>
  );
}

function formatTs(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function summarize(payload: any) {
  if (!payload || typeof payload !== "object") return String(payload ?? "—");
  if (Object.keys(payload).length === 0) return "—";
  return Object.entries(payload)
    .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
    .join(" · ");
}