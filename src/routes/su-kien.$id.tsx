import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CalendarDays } from "lucide-react";

// cms_events.videos (jsonb) chưa có trong types.ts — nới lỏng type.
const db = supabase as any;

export const Route = createFileRoute("/su-kien/$id")({
  component: EventDetailPage,
});

/** Chuyển link video sang dạng nhúng (YouTube/Vimeo → iframe; còn lại → thẻ <video>). */
function toEmbed(url: string): { type: "iframe" | "video"; src: string } {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  return { type: "video", src: u };
}

function EventDetailPage() {
  const { id } = Route.useParams();
  const { data: ev, isLoading } = useQuery({
    queryKey: ["pub_event", id],
    queryFn: async () => {
      const { data } = await db.from("cms_events").select("*").eq("id", id).eq("is_active", true).maybeSingle();
      return data;
    },
  });

  const imgs: string[] = Array.isArray(ev?.images) ? ev.images : [];
  const videos: string[] = [
    ...(Array.isArray(ev?.videos) ? ev.videos : []),
    ...(ev?.video_url ? [ev.video_url] : []),
  ].filter((v: string, i: number, arr: string[]) => v && arr.indexOf(v) === i);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link to="/su-kien" className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Về danh sách sự kiện
          </Link>
          {isLoading ? (
            <div className="text-white/50 text-sm">Đang tải sự kiện…</div>
          ) : !ev ? (
            <div className="text-white/60 text-sm">Không tìm thấy sự kiện này hoặc đã bị ẩn.</div>
          ) : (
            <>
              {ev.event_date && (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ob-lime mb-3">
                  <CalendarDays className="h-4 w-4" /> {new Date(ev.event_date).toLocaleString("vi-VN")}
                </div>
              )}
              <h1 className="font-[Montserrat] text-3xl sm:text-4xl font-bold text-white leading-tight">{ev.title}</h1>
            </>
          )}
        </div>
      </section>

      {ev && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Ảnh đại diện lớn */}
            {imgs[0] && (
              <img src={imgs[0]} alt={ev.title} className="w-full rounded-2xl border border-slate-200 object-cover mb-8" />
            )}

            {/* Nội dung mô tả */}
            {ev.description && (
              <article className="prose-sm max-w-none text-[#1F2937] leading-8 whitespace-pre-line text-[15px]">
                {ev.description}
              </article>
            )}

            {/* Video đính kèm */}
            {videos.length > 0 && (
              <div className="mt-10">
                <h2 className="font-[Montserrat] text-xl font-bold text-[#111827] mb-4">Video sự kiện</h2>
                <div className="space-y-5">
                  {videos.map((v, i) => {
                    const em = toEmbed(v);
                    return (
                      <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-black aspect-video">
                        {em.type === "iframe" ? (
                          <iframe src={em.src} title={`video-${i}`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        ) : (
                          <video src={em.src} controls className="h-full w-full" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Album ảnh */}
            {imgs.length > 1 && (
              <div className="mt-10">
                <h2 className="font-[Montserrat] text-xl font-bold text-[#111827] mb-4">Hình ảnh sự kiện</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imgs.map((u, i) => (
                    <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-slate-200">
                      <img src={u} alt={`Ảnh ${i + 1}`} loading="lazy" className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 border-t border-slate-200 pt-6">
              <Link to="/su-kien" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ob-lime-2 hover:underline">
                <ArrowLeft className="h-4 w-4" /> Về danh sách sự kiện
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
