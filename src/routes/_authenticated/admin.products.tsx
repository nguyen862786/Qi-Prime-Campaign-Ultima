import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadCmsFile, uploadCmsFiles } from "@/lib/cmsUpload";
import { Trash2, Plus, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsAdmin,
});

const RISK_LEVELS = ["Thấp", "Trung bình", "Cao", "Phòng thủ"] as const;

type ProductRow = {
  id: string; name: string; slug: string | null; description: string | null;
  risk_level: string; mockup_url: string | null; logo_url: string | null;
  timeframe: string | null; trade_style: string | null; status: string | null;
  win_rate: number | null; max_drawdown: number | null; monthly_profit: number | null;
  images: string[]; video_url: string | null;
  is_active: boolean; sort_order: number;
};

const empty = {
  name: "", slug: "", description: "", risk_level: "Trung bình",
  timeframe: "", trade_style: "", status: "LIVE",
  win_rate: "", max_drawdown: "", monthly_profit: "",
  mockup_url: "", logo_url: "", images: [] as string[], video_url: "",
  is_active: true, sort_order: 0,
};

const toNum = (v: string) => (v.trim() === "" ? null : Number(v));

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_products").select("*").order("sort_order").order("created_at");
      if (error) throw error; return (data ?? []) as unknown as ProductRow[];
    },
  });
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const reset = () => { setForm({ ...empty }); setEditId(null); };
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin_products"] }); qc.invalidateQueries({ queryKey: ["pub_products"] }); };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Cần nhập tên sản phẩm");
    setBusy(true);
    const payload: any = {
      name: form.name,
      slug: form.slug.trim() || null,
      description: form.description,
      risk_level: form.risk_level,
      timeframe: form.timeframe.trim() || null,
      trade_style: form.trade_style.trim() || null,
      status: form.status.trim() || "LIVE",
      win_rate: toNum(form.win_rate),
      max_drawdown: toNum(form.max_drawdown),
      monthly_profit: toNum(form.monthly_profit),
      mockup_url: form.mockup_url || null,
      logo_url: form.logo_url || null,
      images: form.images,
      video_url: form.video_url.trim() || null,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };
    const res = editId
      ? await supabase.from("cms_products").update(payload).eq("id", editId)
      : await supabase.from("cms_products").insert(payload);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editId ? "Đã cập nhật" : "Đã tạo sản phẩm");
    reset(); refresh();
  };

  const remove = async (id: string) => {
    const key = ["admin_products"];
    const prev = qc.getQueryData<ProductRow[]>(key);
    qc.setQueryData<ProductRow[]>(key, (old) => (old ?? []).filter((r) => r.id !== id));
    setConfirmId(null);
    const { error } = await supabase.from("cms_products").delete().eq("id", id);
    if (error) { qc.setQueryData(key, prev); return toast.error(error.message); }
    toast.success("Đã xoá sản phẩm");
    qc.invalidateQueries({ queryKey: ["pub_products"] });
    if (editId === id) reset();
  };

  const startEdit = (r: ProductRow) => {
    setEditId(r.id);
    setForm({
      name: r.name, slug: r.slug ?? "", description: r.description ?? "",
      risk_level: r.risk_level,
      timeframe: r.timeframe ?? "", trade_style: r.trade_style ?? "", status: r.status ?? "LIVE",
      win_rate: r.win_rate != null ? String(r.win_rate) : "",
      max_drawdown: r.max_drawdown != null ? String(r.max_drawdown) : "",
      monthly_profit: r.monthly_profit != null ? String(r.monthly_profit) : "",
      mockup_url: r.mockup_url ?? "", logo_url: r.logo_url ?? "",
      images: Array.isArray(r.images) ? r.images : [],
      video_url: r.video_url ?? "",
      is_active: r.is_active, sort_order: r.sort_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadSingle = async (file: File, folder: string, key: "mockup_url" | "logo_url") => {
    setBusy(true);
    try { const url = await uploadCmsFile(file, folder); setForm((s) => ({ ...s, [key]: url })); toast.success("Đã upload"); }
    catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <header>
        <h1 className="font-[Montserrat] text-3xl font-bold">Quản Lý Danh Mục Bot EA</h1>
        <p className="mt-2 text-white/60 text-sm">Cấu hình Bot EA + chỉ số hiệu suất, album sơ đồ, video hướng dẫn — hiển thị tại /san-pham và trang chi tiết /san-pham/:id.</p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-[Montserrat] text-lg font-bold">{editId ? "Chỉnh sửa Bot EA" : "Tạo Bot EA mới"}</h2>
          {editId && <button onClick={reset} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1"><X className="h-3 w-3" /> Huỷ</button>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tên Bot EA"><input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Slug (tuỳ chọn)"><input className={inp} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="ea-hybrid-grid" /></Field>
        </div>

        {/* Thông số nhanh hiển thị ở Hero */}
        <div className="grid grid-cols-3 gap-3">
          <Field label="Khung thời gian"><input className={inp} value={form.timeframe} onChange={(e) => setForm({ ...form, timeframe: e.target.value })} placeholder="M15 – H1" /></Field>
          <Field label="Phong cách"><input className={inp} value={form.trade_style} onChange={(e) => setForm({ ...form, trade_style: e.target.value })} placeholder="Multi-Grid Hybrid" /></Field>
          <Field label="Trạng thái"><input className={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="LIVE / BETA" /></Field>
        </div>

        {/* Chỉ số hiệu suất */}
        <div className="grid grid-cols-3 gap-3">
          <Field label="Win Rate (%)"><input type="number" step="0.1" className={inp} value={form.win_rate} onChange={(e) => setForm({ ...form, win_rate: e.target.value })} placeholder="78.5" /></Field>
          <Field label="Max Drawdown (%)"><input type="number" step="0.1" className={inp} value={form.max_drawdown} onChange={(e) => setForm({ ...form, max_drawdown: e.target.value })} placeholder="15" /></Field>
          <Field label="Lợi nhuận / tháng (%)"><input type="number" step="0.1" className={inp} value={form.monthly_profit} onChange={(e) => setForm({ ...form, monthly_profit: e.target.value })} placeholder="8" /></Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Khẩu vị rủi ro">
            <select className={inp} value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}>
              {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Thứ tự hiển thị"><input type="number" className={inp} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} /></Field>
        </div>

        <Field label="Mô tả chi tiết (giới thiệu sâu, phân tích chiến thuật — xuống dòng tự do)">
          <textarea className={`${inp} min-h-[180px]`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Viết bài giới thiệu, chiến thuật, cơ chế hoạt động..." />
        </Field>

        <Field label="Video hướng dẫn (YouTube / Vimeo / mp4 link)"><input className={inp} value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://..." /></Field>

        {/* Logo */}
        <Field label="Logo / Icon Bot (PNG/SVG nền trong suốt)">
          <input type="file" accept="image/png,image/svg+xml,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadSingle(f, "products/logo", "logo_url"); }} className="text-sm text-white/70" />
          {form.logo_url && <div className="mt-2 inline-block rounded-xl bg-ob-dark p-3"><img src={form.logo_url} className="h-12 w-12 object-contain" alt="" /></div>}
        </Field>

        {/* Ảnh bìa */}
        <Field label="Ảnh bìa / mockup giao diện (1 ảnh)">
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadSingle(f, "products/mockup", "mockup_url"); }} className="text-sm text-white/70" />
          {form.mockup_url && <img src={form.mockup_url} className="mt-2 h-32 rounded-lg object-cover" alt="" />}
        </Field>

        {/* Album sơ đồ chiến thuật — multi upload */}
        <Field label="Album sơ đồ chiến thuật / minh hoạ thuật toán (chọn nhiều ảnh)">
          <input type="file" accept="image/*" multiple onChange={async (e) => {
            const fs = e.target.files; if (!fs?.length) return;
            setBusy(true);
            try { const urls = await uploadCmsFiles(fs, "products/gallery"); setForm((s) => ({ ...s, images: [...s.images, ...urls] })); toast.success(`Đã thêm ${urls.length} ảnh`); }
            catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
          }} className="text-sm text-white/70" />
        </Field>
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {form.images.map((u, i) => (
              <div key={i} className="relative group">
                <img src={u} className="h-20 w-full rounded-lg object-cover" alt="" />
                <button onClick={() => setForm({ ...form, images: form.images.filter((_, k) => k !== i) })} className="absolute top-1 right-1 rounded-full bg-black/70 p-1 opacity-0 group-hover:opacity-100"><X className="h-3 w-3 text-white" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm text-white/80"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-ob-lime" /> Hiển thị công khai</label>
          <button onClick={save} disabled={busy} className="rounded-full bg-ob-lime px-5 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-50 inline-flex items-center gap-1"><Plus className="h-4 w-4" /> {editId ? "Cập nhật" : "Tạo Bot EA"}</button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-[Montserrat] text-lg font-bold mb-4">Danh sách Bot EA ({data?.length ?? 0})</h2>
        <div className="space-y-2">
          {data?.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              {r.logo_url ? <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ob-dark"><img src={r.logo_url} alt="" className="h-7 w-7 object-contain" /></div> : <div className="h-10 w-10 rounded-lg bg-white/5" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{r.name}</div>
                <div className="text-[11px] text-white/40">
                  Risk: {r.risk_level} · #{r.sort_order}
                  {r.win_rate != null ? ` · Win ${r.win_rate}%` : ""}{r.images?.length ? ` · ${r.images.length} ảnh` : ""}
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.is_active ? "bg-ob-lime text-ob-dark" : "bg-white/10 text-white/50"}`}>{r.is_active ? "Live" : "Ẩn"}</span>
              <button onClick={() => startEdit(r)} className="text-white/60 hover:text-white p-1"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setConfirmId(r.id)} className="text-white/40 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {data && data.length === 0 && <div className="text-sm text-white/40">Chưa có sản phẩm.</div>}
        </div>
      </section>
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(v) => !v && setConfirmId(null)}
        title="Xoá Bot EA?"
        description="Sản phẩm sẽ bị gỡ khỏi trang /san-pham ngay lập tức."
        onConfirm={() => confirmId && remove(confirmId)}
      />
    </div>
  );
}

const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-ob-lime focus:outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-1 text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>{children}</label>;
}
