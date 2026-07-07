import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Bot, Clock, Activity, ShieldAlert, TrendingUp, Target } from "lucide-react";

// Các cột mới của cms_products chưa có trong types.ts — nới lỏng type.
const db = supabase as any;

export const Route = createFileRoute("/san-pham/$id")({
  component: EaDetailPage,
});

function toEmbed(url: string): { type: "iframe" | "video"; src: string } {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  return { type: "video", src: u };
}

function num(v: any): number | null {
  return v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v);
}

function WinRing({ value }: { value: number }) {
  const r = 46, circ = 2 * Math.PI * r, dash = (circ * Math.min(100, Math.max(0, value))) / 100;
  const color = value >= 70 ? "#10b981" : value >= 50 ? "#f5b942" : "#f43f5e";
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold" style={{ color }}>{value}%</span>
        <span className="text-[9px] uppercase tracking-wider text-white/50">Win rate</span>
      </div>
    </div>
  );
}

function EaDetailPage() {
  const { id } = Route.useParams();
  const { data: ea, isLoading } = useQuery({
    queryKey: ["pub_product", id],
    queryFn: async () => {
      const { data } = await db.from("cms_products").select("*").eq("id", id).eq("is_active", true).maybeSingle();
      return data;
    },
  });

  const imgs: string[] = Array.isArray(ea?.images) ? ea.images : [];
  const win = num(ea?.win_rate);
  const mdd = num(ea?.max_drawdown);
  const profit = num(ea?.monthly_profit);
  const specs = [
    { icon: Clock, k: "Khung thời gian", v: ea?.timeframe },
    { icon: Activity, k: "Phong cách", v: ea?.trade_style },
    { icon: ShieldAlert, k: "Khẩu vị rủi ro", v: ea?.risk_level },
  ].filter((s) => s.v);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link to="/san-pham" className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Về danh sách sản phẩm
          </Link>
          {isLoading ? (
            <div className="text-white/50 text-sm">Đang tải sản phẩm…</div>
          ) : !ea ? (
            <div className="text-white/60 text-sm">Không tìm thấy Bot EA này hoặc đã bị ẩn.</div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 p-2">
                {ea.logo_url ? <img src={ea.logo_url} alt={ea.name} className="h-full w-full object-contain" /> : <Bot className="h-7 w-7 text-ob-lime" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-[Montserrat] text-3xl sm:text-4xl font-bold text-white leading-tight">{ea.name}</h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-ob-lime/40 bg-ob-lime/10 px-3 py-1 text-xs font-bold text-ob-lime">
                    <span className="h-1.5 w-1.5 rounded-full bg-ob-lime animate-pulse" /> {ea.status || "LIVE"}
                  </span>
                </div>
                {specs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {specs.map((s) => (
                      <span key={s.k} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                        <s.icon className="h-3.5 w-3.5 text-ob-lime" /> <span className="text-white/50">{s.k}:</span> <span className="font-semibold text-white">{s.v}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {ea && (
        <>
          {/* ANALYTICS */}
          {(win !== null || mdd !== null || profit !== null) && (
            <section className="bg-ob-dark border-t border-white/10 py-10">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-4 sm:grid-cols-3 items-center">
                  <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    {win !== null ? <WinRing value={win} /> : <span className="text-white/40 text-sm">Win rate: chưa cập nhật</span>}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50"><ShieldAlert className="h-4 w-4 text-rose-300" /> Max Drawdown</div>
                    <div className="mt-2 font-mono text-3xl font-bold text-rose-300">{mdd !== null ? `${mdd}%` : "—"}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-rose-400" style={{ width: `${mdd !== null ? Math.min(100, mdd) : 0}%` }} />
                    </div>
                    <div className="mt-1 text-[11px] text-white/40">Mức sụt giảm vốn tối đa</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50"><TrendingUp className="h-4 w-4 text-ob-lime" /> Lợi nhuận mục tiêu</div>
                    <div className="mt-2 font-mono text-3xl font-bold text-ob-lime">{profit !== null ? `${profit}%` : "—"}</div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/40"><Target className="h-3 w-3" /> trung bình / tháng</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CONTENT */}
          <section className="bg-white py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {ea.mockup_url && <img src={ea.mockup_url} alt={ea.name} className="w-full rounded-2xl border border-slate-200 object-cover mb-8" />}

              {ea.description && (
                <article className="max-w-none text-[#1F2937] leading-8 whitespace-pre-line text-[15px]">
                  {ea.description}
                </article>
              )}

              {ea.video_url && (
                <div className="mt-10">
                  <h2 className="font-[Montserrat] text-xl font-bold text-[#111827] mb-4">Video hướng dẫn</h2>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black aspect-video">
                    {toEmbed(ea.video_url).type === "iframe"
                      ? <iframe src={toEmbed(ea.video_url).src} title="huong-dan" className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      : <video src={toEmbed(ea.video_url).src} controls className="h-full w-full" />}
                  </div>
                </div>
              )}

              {imgs.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-[Montserrat] text-xl font-bold text-[#111827] mb-4">Sơ đồ chiến thuật & minh hoạ thuật toán</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imgs.map((u, i) => (
                      <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-slate-200">
                        <img src={u} alt={`Sơ đồ ${i + 1}`} loading="lazy" className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 border-t border-slate-200 pt-6">
                <Link to="/san-pham" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ob-lime-2 hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Về danh sách sản phẩm
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
