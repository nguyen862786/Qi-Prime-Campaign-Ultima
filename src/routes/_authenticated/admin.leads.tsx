import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, Headset, Clock, BadgeCheck, Search, Download } from "lucide-react";

const db = supabase as any;

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

const ROLE_LABEL: Record<string, string> = { ea: "Trader EA", copy: "Copy Trade", ib: "Master IB" };
const ROLE_FILTERS = [{ v: "all", l: "Tất cả vai trò" }, { v: "ea", l: "Trader EA" }, { v: "copy", l: "Copy Trade" }, { v: "ib", l: "Master IB" }];
const STATUS = [
  { v: "pending", l: "Chờ duyệt" },
  { v: "contacted", l: "Đã liên hệ" },
  { v: "approved", l: "Đã duyệt" },
  { v: "rejected", l: "Từ chối" },
];
const STATUS_LABEL: Record<string, string> = Object.fromEntries(STATUS.map((s) => [s.v, s.l]));

function LeadsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [brokerFilter, setBrokerFilter] = useState<string>("all");
  const [supportOnly, setSupportOnly] = useState(false);

  const { data: leads } = useQuery({
    queryKey: ["admin_leads"],
    queryFn: async () => {
      const { data } = await db.from("cms_leads").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    await db.from("cms_leads").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_leads"] });
  };

  const rows = (leads ?? []) as any[];
  const brokerOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.broker_name).filter(Boolean))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      if (brokerFilter !== "all" && r.broker_name !== brokerFilter) return false;
      if (supportOnly && !r.needs_support) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        return (r.name || "").toLowerCase().includes(s) || (r.contact || "").toLowerCase().includes(s) || (r.qip || "").toLowerCase().includes(s);
      }
      return true;
    });
  }, [rows, statusFilter, roleFilter, brokerFilter, supportOnly, q]);

  const totalLeads = rows.length;
  const needSupport = rows.filter((r) => r.needs_support).length;
  const pending = rows.filter((r) => r.status === "pending").length;
  const approved = rows.filter((r) => r.status === "approved").length;

  const exportCsv = () => {
    const headers = ["QIP", "Họ tên", "SĐT/Email", "Vai trò", "Sàn", "Nguyện vọng", "Cần hỗ trợ 1-1", "Trạng thái", "Ngày đăng ký"];
    const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = filtered.map((r) =>
      [
        r.qip, r.name, r.contact, ROLE_LABEL[r.role] ?? r.role, r.broker_name || "",
        r.note || "", r.needs_support ? "Có" : "", STATUS_LABEL[r.status] ?? r.status,
        r.created_at ? new Date(r.created_at).toLocaleString("vi-VN") : "",
      ].map(esc).join(",")
    );
    const csv = "﻿" + [headers.map(esc).join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `qiprime-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[Montserrat] text-3xl font-bold">Leads / Chờ duyệt</h1>
          <p className="mt-2 text-white/60 text-sm">Lọc theo vai trò, sàn, trạng thái; xem nguyện vọng khách để tiếp xúc & duyệt quyền tham gia Group Tín hiệu / Kích hoạt Bot.</p>
        </div>
        <button onClick={exportCsv} disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-ob-lime px-5 py-2.5 text-sm font-semibold text-ob-dark transition-all hover:bg-ob-lime/90 disabled:cursor-not-allowed disabled:opacity-40">
          <Download className="h-4 w-4" /> Xuất CSV ({filtered.length})
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <SummaryCard icon={Inbox} label="Tổng leads" value={String(totalLeads)} />
        <SummaryCard icon={Headset} label="Cần hỗ trợ 1-1" value={String(needSupport)} accent />
        <SummaryCard icon={Clock} label="Chờ duyệt" value={String(pending)} />
        <SummaryCard icon={BadgeCheck} label="Đã duyệt" value={String(approved)} accent />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên / SĐT / mã QIP..."
              className="w-full rounded-lg border border-white/15 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:border-ob-lime focus:outline-none" />
          </div>
          <select value={brokerFilter} onChange={(e) => setBrokerFilter(e.target.value)}
            className="rounded-lg border border-white/15 bg-ob-dark px-3 py-2 text-sm text-white focus:border-ob-lime focus:outline-none">
            <option value="all">Tất cả sàn</option>
            {brokerOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <label className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white/70 cursor-pointer">
            <input type="checkbox" checked={supportOnly} onChange={(e) => setSupportOnly(e.target.checked)} className="h-4 w-4 accent-ob-lime" />
            Chỉ "cần hỗ trợ 1-1"
          </label>
        </div>

        {/* Role filter (3 nhánh) */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1 w-fit">
          {ROLE_FILTERS.map((r) => (
            <button key={r.v} onClick={() => setRoleFilter(r.v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${roleFilter === r.v ? "bg-ob-lime text-ob-dark" : "text-white/60 hover:text-white"}`}>
              {r.l}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1 w-fit">
          {[{ v: "all", l: "Mọi trạng thái" }, ...STATUS].map((s) => (
            <button key={s.v} onClick={() => setStatusFilter(s.v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === s.v ? "bg-ob-lime text-ob-dark" : "text-white/60 hover:text-white"}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left text-[11px] uppercase tracking-wider text-white/45">
              <th className="px-4 py-3 font-semibold">Mã QIP</th>
              <th className="px-4 py-3 font-semibold">Khách hàng</th>
              <th className="px-4 py-3 font-semibold">Vai trò</th>
              <th className="px-4 py-3 font-semibold">Sàn</th>
              <th className="px-4 py-3 font-semibold">Nguyện vọng</th>
              <th className="px-4 py-3 font-semibold">Hỗ trợ 1-1</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-right">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] align-top">
                <td className="px-4 py-3 font-mono text-xs font-bold text-ob-lime">{r.qip}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{r.name}</div>
                  <div className="text-[11px] text-white/45">{r.contact}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/70">{ROLE_LABEL[r.role] ?? r.role}</span>
                </td>
                <td className="px-4 py-3 text-white/70 text-xs">{r.broker_name || "—"}</td>
                <td className="px-4 py-3 max-w-[260px]">
                  {r.note ? <span className="block text-xs text-white/75 leading-5 whitespace-pre-line" title={r.note}>{r.note}</span> : <span className="text-[11px] text-white/30">—</span>}
                </td>
                <td className="px-4 py-3">
                  {r.needs_support
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-ob-lime/20 px-2 py-0.5 text-[11px] font-semibold text-ob-lime"><Headset className="h-3 w-3" /> Cần</span>
                    : <span className="text-[11px] text-white/40">—</span>}
                </td>
                <td className="px-4 py-3">
                  <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                    className="rounded-lg border border-white/15 bg-ob-dark px-2 py-1 text-xs text-white focus:border-ob-lime focus:outline-none">
                    {STATUS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[11px] text-white/50">
                  {r.created_at ? new Date(r.created_at).toLocaleDateString("vi-VN") : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-white/40">Không có lead phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, accent }: { icon: typeof Inbox; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-ob-lime/15 text-ob-lime" : "bg-white/5 text-white/70"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="mt-3 font-mono text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/50">{label}</div>
    </div>
  );
}
