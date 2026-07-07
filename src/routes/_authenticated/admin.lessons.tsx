import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadCmsFile } from "@/lib/cmsUpload";
import { Trash2, Plus, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const Route = createFileRoute("/_authenticated/admin/lessons")({
  component: LessonsAdmin,
});

const CATEGORIES = ["Nền tảng tư duy", "Quản trị rủi ro Bot EA", "Doanh nghiệp Master IB"] as const;

type LessonRow = {
  id: string; title: string; category: string; display_order: number;
  summary: string | null; thumbnail_url: string | null; video_url: string | null; is_active: boolean;
};

const empty = { title: "", category: CATEGORIES[0] as string, display_order: 1, summary: "", thumbnail_url: "", video_url: "", is_active: true };

function LessonsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_lessons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_lessons").select("*").order("category").order("display_order");
      if (error) throw error; return (data ?? []) as unknown as LessonRow[];
    },
  });
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const reset = () => { setForm({ ...empty }); setEditId(null); };
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin_lessons"] }); qc.invalidateQueries({ queryKey: ["pub_lessons"] }); };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Cần nhập tên bài học");
    setBusy(true);
    const res = editId
      ? await supabase.from("cms_lessons").update(form).eq("id", editId)
      : await supabase.from("cms_lessons").insert(form);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editId ? "Đã cập nhật" : "Đã tạo bài học");
    reset(); refresh();
  };

  const remove = async (id: string) => {
    const key = ["admin_lessons"];
    const prev = qc.getQueryData<LessonRow[]>(key);
    qc.setQueryData<LessonRow[]>(key, (old) => (old ?? []).filter((r) => r.id !== id));
    setConfirmId(null);
    const { error } = await supabase.from("cms_lessons").delete().eq("id", id);
    if (error) {
      qc.setQueryData(key, prev);
      return toast.error(error.message);
    }
    toast.success("Đã xoá bài học");
    qc.invalidateQueries({ queryKey: ["pub_lessons"] });
    if (editId === id) reset();
  };

  const startEdit = (r: LessonRow) => {
    setEditId(r.id);
    setForm({
      title: r.title, category: r.category, display_order: r.display_order,
      summary: r.summary ?? "", thumbnail_url: r.thumbnail_url ?? "", video_url: r.video_url ?? "", is_active: r.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <header>
        <h1 className="font-[Montserrat] text-3xl font-bold">Quản Lý Bài Học Học Viện</h1>
        <p className="mt-2 text-white/60 text-sm">Quản lý tới 50 bài học hiển thị tại /hoc-vien.</p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-[Montserrat] text-lg font-bold">{editId ? "Chỉnh sửa bài học" : "Tạo bài học mới"}</h2>
          {editId && <button onClick={reset} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1"><X className="h-3 w-3" /> Huỷ</button>}
        </div>
        <Field label="Tên bài học"><input className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phân mục">
            <select className={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Thứ tự hiển thị">
            <input type="number" min={1} className={inp} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) || 1 })} />
          </Field>
        </div>
        <Field label="Tóm tắt bài học"><textarea className={`${inp} min-h-[100px]`} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
        <Field label="Link Video bài giảng (Skool / YouTube / private)"><input className={inp} value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://..." /></Field>
        <Field label="Hình minh hoạ (thumbnail)">
          <input type="file" accept="image/*" onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setBusy(true); try { const url = await uploadCmsFile(f, "lessons/thumb"); setForm((s) => ({ ...s, thumbnail_url: url })); toast.success("Đã upload thumbnail"); } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
          }} className="text-sm text-white/70" />
          {form.thumbnail_url && <img src={form.thumbnail_url} className="mt-2 h-24 rounded-lg object-cover" alt="" />}
        </Field>
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm text-white/80"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-ob-lime" /> Hiển thị công khai</label>
          <button onClick={save} disabled={busy} className="rounded-full bg-ob-lime px-5 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-50 inline-flex items-center gap-1"><Plus className="h-4 w-4" /> {editId ? "Cập nhật" : "Tạo bài học"}</button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-[Montserrat] text-lg font-bold mb-4">Danh sách bài học ({data?.length ?? 0})</h2>
        <div className="space-y-2">
          {data?.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              {r.thumbnail_url && <img src={r.thumbnail_url} alt="" className="h-10 w-16 rounded object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">#{r.display_order} · {r.title}</div>
                <div className="text-[11px] text-white/40">{r.category}{r.video_url ? " · video" : ""}</div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.is_active ? "bg-ob-lime text-ob-dark" : "bg-white/10 text-white/50"}`}>{r.is_active ? "Live" : "Ẩn"}</span>
              <button onClick={() => startEdit(r)} className="text-white/60 hover:text-white p-1"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setConfirmId(r.id)} className="text-white/40 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {data && data.length === 0 && <div className="text-sm text-white/40">Chưa có bài học.</div>}
        </div>
      </section>
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(v) => !v && setConfirmId(null)}
        title="Xoá bài học?"
        description="Bài học sẽ bị gỡ khỏi Học Viện ngay lập tức."
        onConfirm={() => confirmId && remove(confirmId)}
      />
    </div>
  );
}

const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-ob-lime focus:outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-1 text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>{children}</label>;
}