import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadCmsFiles } from "@/lib/cmsUpload";

// cms_quiz chưa có trong types.ts đã generate — nới lỏng type cho riêng bảng này.
const db = supabase as any;

export const Route = createFileRoute("/_authenticated/admin/cms")({
  component: CmsPage,
});

function CmsPage() {
  return (
    <div className="p-8 max-w-5xl space-y-10">
      <header>
        <h1 className="font-[Montserrat] text-3xl font-bold">CMS Media</h1>
        <p className="mt-2 text-white/60 text-sm">Quản lý banner top, splash popup, carousel giữa trang và ngân hàng câu hỏi trắc nghiệm. Dán URL ảnh trực tiếp (upload lên chat để lấy URL CDN).</p>
      </header>
      <TopBannerEditor />
      <PopupEditor />
      <CarouselEditor />
      <QuizEditor />
    </div>
  );
}

/* ---------- Top Banner ---------- */
function TopBannerEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_top_banner"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_banners").select("*").eq("placement", "top_bar").maybeSingle();
      return data;
    },
  });
  const [form, setForm] = useState({ message: "", link_url: "", background: "#39FF14", is_active: false });
  useEffect(() => {
    if (data) setForm({ message: data.message || "", link_url: data.link_url || "", background: data.background || "#39FF14", is_active: !!data.is_active });
  }, [data]);

  const save = async () => {
    if (data) {
      await supabase.from("cms_banners").update(form).eq("id", data.id);
    } else {
      await supabase.from("cms_banners").insert({ placement: "top_bar", ...form });
    }
    qc.invalidateQueries({ queryKey: ["admin_top_banner"] });
    qc.invalidateQueries({ queryKey: ["banner", "top_bar"] });
  };

  return (
    <Card title="Top Banner (thông báo trên cùng)">
      <Field label="Nội dung"><input className={inp} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>
      <Field label="Link (tuỳ chọn)"><input className={inp} value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></Field>
      <Field label="Màu nền"><input type="color" className="h-10 w-20 rounded bg-transparent" value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })} /></Field>
      <ToggleSave active={form.is_active} onToggle={(v) => setForm({ ...form, is_active: v })} onSave={save} />
    </Card>
  );
}

/* ---------- Splash Popup ---------- */
function PopupEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_popup"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_popup").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });
  const [form, setForm] = useState({ desktop_image_url: "", mobile_image_url: "", link_url: "", is_active: false, cooldown_hours: 24 });
  useEffect(() => {
    if (data) setForm({
      desktop_image_url: data.desktop_image_url || "",
      mobile_image_url: data.mobile_image_url || "",
      link_url: data.link_url || "",
      is_active: !!data.is_active,
      cooldown_hours: data.cooldown_hours ?? 24,
    });
  }, [data]);
  const save = async () => {
    await supabase.from("cms_popup").update(form).eq("id", 1);
    qc.invalidateQueries({ queryKey: ["admin_popup"] });
    qc.invalidateQueries({ queryKey: ["splash_popup"] });
  };
  return (
    <Card title="Splash Popup (xuất hiện khi mở trang)">
      <Field label="Ảnh Desktop (URL)"><input className={inp} value={form.desktop_image_url} onChange={(e) => setForm({ ...form, desktop_image_url: e.target.value })} placeholder="https://..." /></Field>
      <Field label="Ảnh Mobile (URL — tuỳ chọn)"><input className={inp} value={form.mobile_image_url} onChange={(e) => setForm({ ...form, mobile_image_url: e.target.value })} placeholder="https://..." /></Field>
      <Field label="Link khi click"><input className={inp} value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></Field>
      <Field label="Cooldown (giờ)"><input type="number" min={1} className={inp} value={form.cooldown_hours} onChange={(e) => setForm({ ...form, cooldown_hours: Number(e.target.value) || 24 })} /></Field>
      <ToggleSave active={form.is_active} onToggle={(v) => setForm({ ...form, is_active: v })} onSave={save} />
    </Card>
  );
}

/* ---------- Mid carousel ---------- */
function CarouselEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_carousel"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_assets")
        .select("*").eq("zone", "mid_carousel")
        .order("sort_order", { ascending: true });
      if (error) { console.error(error); toast.error("Không tải được danh sách: " + error.message); }
      return data ?? [];
    },
  });
  const [newUrl, setNewUrl] = useState("");
  const [newLink, setNewLink] = useState("");
  const [pending, setPending] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!newUrl && pending.length === 0) { toast.error("Nhập URL ảnh hoặc chọn file trước."); return; }
    setBusy(true);
    try {
      let urls: string[] = [];
      if (pending.length) {
        toast.info(`Đang upload ${pending.length} ảnh...`);
        urls = await uploadCmsFiles(pending, "carousel");
      }
      if (newUrl.trim()) urls.push(newUrl.trim());
      const base = data?.length ?? 0;
      const rows = urls.map((u, i) => ({
        zone: "mid_carousel",
        image_url: u,
        link_url: newLink.trim() || null,
        sort_order: base + i + 1,
        is_active: true,
      }));
      const { error } = await supabase.from("cms_assets").insert(rows);
      if (error) throw error;
      toast.success(`Đã thêm ${rows.length} ảnh vào carousel`);
      setNewUrl(""); setNewLink(""); setPending([]);
      qc.invalidateQueries({ queryKey: ["admin_carousel"] });
      qc.invalidateQueries({ queryKey: ["mid_carousel"] });
    } catch (e: any) {
      console.error(e);
      toast.error("Lỗi khi thêm ảnh: " + (e?.message || String(e)));
    } finally {
      setBusy(false);
    }
  };
  const toggle = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("cms_assets").update({ is_active: !is_active }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin_carousel"] });
    qc.invalidateQueries({ queryKey: ["mid_carousel"] });
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("cms_assets").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Đã xoá");
    qc.invalidateQueries({ queryKey: ["admin_carousel"] });
    qc.invalidateQueries({ queryKey: ["mid_carousel"] });
  };

  return (
    <Card title="Mid-Page Carousel (giữa trang chủ)">
      <div className="space-y-2">
        {data?.map((a: any) => (
          <div key={a.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2">
            <img src={a.image_url} alt="" className="h-12 w-20 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <div className="truncate text-xs text-white/70">{a.image_url}</div>
              {a.link_url && <div className="truncate text-[10px] text-white/40">→ {a.link_url}</div>}
            </div>
            <button onClick={() => toggle(a.id, a.is_active)} className={`rounded-full px-3 py-1 text-xs font-semibold ${a.is_active ? "bg-ob-lime text-ob-dark" : "bg-white/10 text-white/60"}`}>
              {a.is_active ? "Hiện" : "Ẩn"}
            </button>
            <button onClick={() => remove(a.id)} className="text-white/40 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {data && data.length === 0 && <div className="text-sm text-white/40">Chưa có ảnh.</div>}
      </div>
      <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <Field label="Upload ảnh (chọn nhiều file)">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => { const fs = Array.from(e.target.files ?? []); if (fs.length) { setPending((p) => [...p, ...fs]); toast.info(`Đã chọn ${fs.length} ảnh — bấm "Thêm" để upload`); } e.target.value = ""; }}
            className="block w-full text-sm text-white/80 file:mr-3 file:rounded-full file:border-0 file:bg-ob-lime file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ob-dark hover:file:bg-ob-lime/90"
          />
          {pending.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {pending.map((f, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                  {f.name}
                  <button onClick={() => setPending((p) => p.filter((_, idx) => idx !== i))} className="text-white/50 hover:text-red-400">×</button>
                </div>
              ))}
            </div>
          )}
        </Field>
        <Field label="Hoặc dán URL ảnh"><input className={inp} placeholder="https://..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} /></Field>
        <Field label="Link khi click (tuỳ chọn — áp dụng cho tất cả ảnh thêm lần này)"><input className={inp} placeholder="https://..." value={newLink} onChange={(e) => setNewLink(e.target.value)} /></Field>
        <div className="flex justify-end">
          <button disabled={busy} onClick={add} className="inline-flex items-center gap-1 rounded-full bg-ob-lime px-4 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-50">
            <Plus className="h-4 w-4" /> {busy ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Quiz bank ---------- */
function QuizEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_quiz"],
    queryFn: async () => {
      const { data } = await db.from("cms_quiz").select("*").order("display_order", { ascending: true });
      return data ?? [];
    },
  });
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [ans, setAns] = useState(0);

  const reset = () => { setQ(""); setOpts(["", "", "", ""]); setAns(0); };
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin_quiz"] });
    qc.invalidateQueries({ queryKey: ["pub_quiz"] });
  };

  const add = async () => {
    if (!q.trim() || opts.some((o) => !o.trim())) return;
    const sort = (data?.length ?? 0) + 1;
    await db.from("cms_quiz").insert({
      question: q.trim(),
      options: opts.map((o) => o.trim()),
      answer_index: ans,
      display_order: sort,
      is_active: true,
    });
    reset(); refresh();
  };
  const toggle = async (id: string, is_active: boolean) => {
    await db.from("cms_quiz").update({ is_active: !is_active }).eq("id", id);
    refresh();
  };
  const remove = async (id: string) => {
    await db.from("cms_quiz").delete().eq("id", id);
    refresh();
  };

  return (
    <Card title="Ngân Hàng Câu Hỏi Trắc Nghiệm (Học Viện)">
      <div className="space-y-2">
        {data?.map((row: any) => (
          <div key={row.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">{row.question}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {(Array.isArray(row.options) ? row.options : []).map((o: string, i: number) => (
                    <span key={i} className={`rounded px-2 py-0.5 text-[11px] ${i === row.answer_index ? "bg-ob-lime text-ob-dark font-semibold" : "bg-white/10 text-white/60"}`}>
                      {o}{i === row.answer_index ? " ✓" : ""}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => toggle(row.id, row.is_active)} className={`rounded-full px-3 py-1 text-xs font-semibold ${row.is_active ? "bg-ob-lime text-ob-dark" : "bg-white/10 text-white/60"}`}>
                  {row.is_active ? "Hiện" : "Ẩn"}
                </button>
                <button onClick={() => remove(row.id)} className="text-white/40 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {data && data.length === 0 && <div className="text-sm text-white/40">Chưa có câu hỏi.</div>}
      </div>

      <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <Field label="Câu hỏi"><input className={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập nội dung câu hỏi..." /></Field>
        <div className="grid sm:grid-cols-2 gap-2">
          {opts.map((o, i) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="quiz-answer"
                checked={ans === i}
                onChange={() => setAns(i)}
                className="h-4 w-4 accent-ob-lime"
                title="Đáp án đúng"
              />
              <input
                className={inp}
                value={o}
                onChange={(e) => setOpts((prev) => prev.map((x, xi) => (xi === i ? e.target.value : x)))}
                placeholder={`Đáp án ${i + 1}`}
              />
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-white/40">Chọn radio bên trái đáp án đúng.</span>
          <button onClick={add} className="inline-flex items-center gap-1 rounded-full bg-ob-lime px-4 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90"><Plus className="h-4 w-4" /> Thêm câu hỏi</button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Shared ---------- */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-[Montserrat] text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-ob-lime focus:outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>
      {children}
    </label>
  );
}
function ToggleSave({ active, onToggle, onSave }: { active: boolean; onToggle: (v: boolean) => void; onSave: () => void }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={active} onChange={(e) => onToggle(e.target.checked)} className="h-4 w-4 accent-ob-lime" />
        Đang kích hoạt
      </label>
      <button onClick={onSave} className="rounded-full bg-ob-lime px-5 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90">Lưu</button>
    </div>
  );
}
