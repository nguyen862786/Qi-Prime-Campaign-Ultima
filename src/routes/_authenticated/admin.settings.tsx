import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck } from "lucide-react";

// admin_permissions chưa có trong types.ts đã generate — nới lỏng type.
const db = supabase as any;

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="p-8 max-w-3xl space-y-10">
      <SystemInfo />
      <PermissionsManager />
    </div>
  );
}

/* ===================== Thông tin hệ thống (app_settings) ===================== */
function SystemInfo() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["app_settings_admin"],
    queryFn: async () => {
      const { data } = await supabase.from("app_settings").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });

  const [form, setForm] = useState({ system_email: "", hotline: "", office_address: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm({ system_email: data.system_email, hotline: data.hotline, office_address: data.office_address });
  }, [data]);

  const save = async () => {
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("app_settings").update(form).eq("id", 1);
    setSaving(false);
    if (error) { setMsg("Lỗi: " + error.message); return; }
    setMsg("Đã lưu thành công.");
    qc.invalidateQueries({ queryKey: ["app_settings"] });
  };

  return (
    <div>
      <h1 className="font-[Montserrat] text-3xl font-bold">Thông Tin Hệ Thống</h1>
      <p className="mt-2 text-white/60 text-sm">Cập nhật email, hotline và địa chỉ — tự động đồng bộ trên Header, Footer và trang Liên Hệ.</p>
      <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <Field label="Email hệ thống">
          <input className={inp} value={form.system_email} onChange={(e) => setForm({ ...form, system_email: e.target.value })} />
        </Field>
        <Field label="Hotline">
          <input className={inp} value={form.hotline} onChange={(e) => setForm({ ...form, hotline: e.target.value })} />
        </Field>
        <Field label="Địa chỉ văn phòng">
          <textarea rows={2} className={inp} value={form.office_address} onChange={(e) => setForm({ ...form, office_address: e.target.value })} />
        </Field>
        <div className="flex items-center gap-3">
          <button disabled={saving} onClick={save} className="rounded-full bg-ob-lime px-6 py-2.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          {msg && <span className="text-sm text-white/70">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

/* ===================== Phân quyền theo vai trò (admin_permissions) ===================== */
type Row = Record<string, any>;

// Cột định danh vai trò (ưu tiên các tên phổ biến).
function detectRoleKey(sample: Row): string {
  return ["role", "role_name", "name", "slug", "key"].find((k) => k in sample) || Object.keys(sample)[0] || "role";
}
// Các cột quyền = mọi cột có giá trị boolean.
function detectBoolCols(sample: Row): string[] {
  return Object.keys(sample).filter((k) => typeof sample[k] === "boolean");
}
// Nhãn đẹp: bỏ tiền tố can_/is_, thay _ bằng khoảng trắng, viết hoa đầu.
function prettyLabel(col: string): string {
  const s = col.replace(/^(can_|is_|allow_)/, "").replace(/_/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function PermissionsManager() {
  const qc = useQueryClient();
  const { data: rows, isLoading } = useQuery({
    queryKey: ["admin_permissions"],
    queryFn: async () => {
      const { data, error } = await db.from("admin_permissions").select("*");
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const [draft, setDraft] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (rows) setDraft(rows.map((r) => ({ ...r })));
  }, [rows]);

  const sample = draft[0] || {};
  const roleKey = detectRoleKey(sample);
  const boolCols = detectBoolCols(sample);

  const toggle = (i: number, col: string) =>
    setDraft((d) => d.map((r, k) => (k === i ? { ...r, [col]: !r[col] } : r)));

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      for (const r of draft) {
        const patch: Row = {};
        boolCols.forEach((c) => { patch[c] = r[c]; });
        if (r.id !== undefined && r.id !== null) {
          const { error } = await db.from("admin_permissions").update(patch).eq("id", r.id);
          if (error) throw error;
        } else {
          const { error } = await db.from("admin_permissions").update(patch).eq(roleKey, r[roleKey]);
          if (error) throw error;
        }
      }
      setMsg("Đã lưu phân quyền thành công.");
      qc.invalidateQueries({ queryKey: ["admin_permissions"] });
    } catch (e: any) {
      setMsg("Lỗi: " + (e?.message || String(e)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-[Montserrat] text-2xl font-bold flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-ob-lime" /> Phân Quyền Theo Vai Trò
      </h2>
      <p className="mt-2 text-white/60 text-sm">Bật/tắt quyền cho từng vai trò. Dữ liệu đọc & ghi trực tiếp từ bảng <code className="text-ob-lime">admin_permissions</code>.</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        {isLoading ? (
          <div className="text-sm text-white/50">Đang tải phân quyền…</div>
        ) : draft.length === 0 ? (
          <div className="text-sm text-white/50">Bảng <code>admin_permissions</code> chưa có dòng nào. Hãy thêm vai trò trong Supabase trước.</div>
        ) : boolCols.length === 0 ? (
          <div className="text-sm text-white/50">Không phát hiện cột quyền (boolean) nào trong bảng.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/45">
                    <th className="px-3 py-2 font-semibold sticky left-0 bg-ob-dark/50">Vai trò</th>
                    {boolCols.map((c) => (
                      <th key={c} className="px-3 py-2 font-semibold text-center whitespace-nowrap">{prettyLabel(c)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {draft.map((r, i) => (
                    <tr key={r.id ?? r[roleKey] ?? i} className="border-b border-white/5">
                      <td className="px-3 py-2.5 font-semibold text-white whitespace-nowrap sticky left-0 bg-ob-dark/50">{String(r[roleKey])}</td>
                      {boolCols.map((c) => (
                        <td key={c} className="px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!r[c]}
                            onChange={() => toggle(i, c)}
                            className="h-4 w-4 accent-ob-lime cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button disabled={saving} onClick={save} className="rounded-full bg-ob-lime px-6 py-2.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-60">
                {saving ? "Đang lưu..." : "Lưu phân quyền"}
              </button>
              {msg && <span className="text-sm text-white/70">{msg}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-ob-lime focus:outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>
      {children}
    </label>
  );
}
