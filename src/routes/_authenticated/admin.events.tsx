import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadCmsFiles } from "@/lib/cmsUpload";
import { Trash2, Plus, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: EventsAdmin,
});

type EventRow = {
  id: string; title: string; event_date: string | null; description: string | null;
  images: string[]; videos: string[]; video_url: string | null; is_active: boolean; sort_order: number;
};

const empty = { title: "", event_date: "", description: "", images: [] as string[], videos: [] as string[], is_active: true, sort_order: 0 };

function EventsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_events").select("*").order("event_date", { ascending: false });
      if (error) throw error; return (data ?? []) as unknown as EventRow[];
    },
  });
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [pendingVideos, setPendingVideos] = useState<File[]>([]);

  const reset = () => { setForm({ ...empty }); setEditId(null); setPendingImages([]); setPendingVideos([]); };
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin_events"] }); qc.invalidateQueries({ queryKey: ["pub_events"] }); };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Cần nhập tiêu đề");
    setBusy(true);
    let images = [...form.images];
    let videos = form.videos.map((v) => v.trim()).filter(Boolean);
    try {
      if (pendingImages.length) {
        toast.info(`Đang upload ${pendingImages.length} ảnh…`);
        const urls = await uploadCmsFiles(pendingImages, "events/gallery");
        images = [...images, ...urls];
      }
      if (pendingVideos.length) {
        toast.info(`Đang upload ${pendingVideos.length} video…`);
        const urls = await uploadCmsFiles(pendingVideos, "events/video");
        videos = [...videos, ...urls];
      }
    } catch (err: any) {
      setBusy(false);
      return toast.error(`Upload thất bại: ${err?.message ?? err}`);
    }
    const payload: any = {
      title: form.title,
      event_date: form.event_date || null,
      description: form.description,
      images,
      videos,
      video_url: videos[0] || null,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };
    const res = editId
      ? await supabase.from("cms_events").update(payload).eq("id", editId)
      : await supabase.from("cms_events").insert(payload);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(`${editId ? "Đã cập nhật" : "Đã tạo"} sự kiện · ${images.length} ảnh · ${videos.length} video`);
    reset(); refresh();
  };

  const remove = async (id: string) => {
    const key = ["admin_events"];
    const prev = qc.getQueryData<EventRow[]>(key);
    qc.setQueryData<EventRow[]>(key, (old) => (old ?? []).filter((r) => r.id !== id));
    setConfirmId(null);
    const { error } = await supabase.from("cms_events").delete().eq("id", id);
    if (error) { qc.setQueryData(key, prev); return toast.error(error.message); }
    toast.success("Đã xoá sự kiện");
    qc.invalidateQueries({ queryKey: ["pub_events"] });
    if (editId === id) reset();
  };

  const startEdit = (r: EventRow) => {
    setEditId(r.id);
    const vids = Array.isArray(r.videos) && r.videos.length ? r.videos : (r.video_url ? [r.video_url] : []);
    setForm({
      title: r.title,
      event_date: r.event_date ? r.event_date.slice(0, 16) : "",
      description: r.description ?? "",
      images: Array.isArray(r.images) ? r.images : [],
      videos: vids,
      is_active: r.is_active,
      sort_order: r.sort_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <header>
        <h1 className="font-[Montserrat] text-3xl font-bold">Quản Lý Sự Kiện</h1>
        <p className="mt-2 text-white/60 text-sm">Tạo & cập nhật sự kiện/tin tức hiển thị tại /su-kien (hỗ trợ nhiều video & album nhiều ảnh).</p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-[Montserrat] text-lg font-bold">{editId ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</h2>
          {editId && <button onClick={reset} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1"><X className="h-3 w-3" /> Huỷ</button>}
        </div>
        <Field label="Tiêu đề sự kiện"><input className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Ngày diễn ra"><input type="datetime-local" className={inp} value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></Field>
        <Field label="Mô tả chi tiết"><textarea className={`${inp} min-h-[140px]`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

        {/* VIDEO — nhiều link + upload nhiều mp4 */}
        <Field label="Video (YouTube / Vimeo / mp4) — có thể thêm nhiều">
          <div className="space-y-2">
            {form.videos.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inp}
                  value={v}
                  placeholder="https://youtube.com/... hoặc link mp4"
                  onChange={(e) => setForm((s) => ({ ...s, videos: s.videos.map((x, k) => (k === i ? e.target.value : x)) }))}
                />
                <button type="button" onClick={() => setForm((s) => ({ ...s, videos: s.videos.filter((_, k) => k !== i) }))} className="shrink-0 px-2 text-white/40 hover:text-red-400"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setForm((s) => ({ ...s, videos: [...s.videos, ""] }))} className="inline-flex items-center gap-1 text-xs font-semibold text-ob-lime hover:text-ob-lime/80">
              <Plus className="h-3.5 w-3.5" /> Thêm video
            </button>
          </div>
        </Field>
        <Field label="Hoặc Upload video mp4 (chọn nhiều)">
          <input type="file" accept="video/mp4" multiple onChange={(e) => {
            const fs = e.target.files; if (!fs?.length) return;
            setPendingVideos((p) => [...p, ...Array.from(fs)]);
            toast.success(`Đã chọn ${fs.length} video — sẽ upload khi bấm Lưu`);
            e.target.value = "";
          }} className="text-sm text-white/70" />
          {pendingVideos.length > 0 && (
            <div className="mt-2 text-xs text-white/60">Chờ upload: {pendingVideos.length} video</div>
          )}
        </Field>

        {/* ALBUM ẢNH — multi upload */}
        <Field label="Album ảnh sự kiện (chọn nhiều ảnh cùng lúc)">
          <input type="file" accept="image/*" multiple onChange={(e) => {
            const fs = e.target.files; if (!fs?.length) return;
            setPendingImages((p) => [...p, ...Array.from(fs)]);
            toast.success(`Đã chọn ${fs.length} ảnh — sẽ upload khi bấm Lưu`);
            e.target.value = "";
          }} className="text-sm text-white/70" />
        </Field>
        {(form.images.length > 0 || pendingImages.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {form.images.map((u, i) => (
              <div key={`u-${i}`} className="relative group">
                <img src={u} className="h-20 w-full rounded-lg object-cover" alt="" />
                {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-ob-lime px-1.5 py-0.5 text-[9px] font-bold text-ob-dark">Đại diện</span>}
                <button onClick={() => setForm({ ...form, images: form.images.filter((_, k) => k !== i) })} className="absolute top-1 right-1 rounded-full bg-black/70 p-1 opacity-0 group-hover:opacity-100"><X className="h-3 w-3 text-white" /></button>
              </div>
            ))}
            {pendingImages.map((f, i) => (
              <div key={`p-${i}`} className="relative group">
                <img src={URL.createObjectURL(f)} className="h-20 w-full rounded-lg object-cover opacity-70" alt="" />
                <span className="absolute bottom-1 left-1 rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold text-black">Chờ upload</span>
                <button onClick={() => setPendingImages((p) => p.filter((_, k) => k !== i))} className="absolute top-1 right-1 rounded-full bg-black/70 p-1 opacity-0 group-hover:opacity-100"><X className="h-3 w-3 text-white" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm text-white/80"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-ob-lime" /> Hiển thị công khai</label>
          <button onClick={save} disabled={busy} className="rounded-full bg-ob-lime px-5 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-50 inline-flex items-center gap-1"><Plus className="h-4 w-4" /> {editId ? "Cập nhật" : "Tạo sự kiện"}</button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-[Montserrat] text-lg font-bold mb-4">Danh sách sự kiện ({data?.length ?? 0})</h2>
        <div className="space-y-2">
          {data?.map((r) => {
            const vidCount = (Array.isArray(r.videos) && r.videos.length) ? r.videos.length : (r.video_url ? 1 : 0);
            return (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                {r.images?.[0] ? <img src={r.images[0]} alt="" className="h-12 w-20 rounded object-cover" /> : <div className="h-12 w-20 rounded bg-white/5" />}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{r.title}</div>
                  <div className="text-[11px] text-white/40">{r.event_date ? new Date(r.event_date).toLocaleString("vi-VN") : "—"} · {r.images?.length ?? 0} ảnh{vidCount ? ` · ${vidCount} video` : ""}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.is_active ? "bg-ob-lime text-ob-dark" : "bg-white/10 text-white/50"}`}>{r.is_active ? "Live" : "Ẩn"}</span>
                <button onClick={() => startEdit(r)} className="text-white/60 hover:text-white p-1"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setConfirmId(r.id)} className="text-white/40 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
          {data && data.length === 0 && <div className="text-sm text-white/40">Chưa có sự kiện.</div>}
        </div>
      </section>
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(v) => !v && setConfirmId(null)}
        title="Xoá sự kiện?"
        description="Sự kiện sẽ bị gỡ khỏi trang /su-kien ngay lập tức."
        onConfirm={() => confirmId && remove(confirmId)}
      />
    </div>
  );
}

const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-ob-lime focus:outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-1 text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>{children}</label>;
}
