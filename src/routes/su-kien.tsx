import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CalendarDays, Images } from "lucide-react";

export const Route = createFileRoute("/su-kien")({
  head: () => ({
    meta: [
      { title: "Sự Kiện — Qi Prime Forex AI Ecosystem" },
      { name: "description", content: "Cập nhật các chiến dịch hợp tác đối tác công nghệ, Offline meetup và Zoom đào tạo hàng tuần của hệ sinh thái Qi Prime." },
      { property: "og:title", content: "Sự Kiện — Qi Prime" },
      { property: "og:description", content: "Chiến dịch Đối Tác · Offline · Zoom hàng tuần." },
    ],
  }),
  component: SuKienPage,
});

/** Thumbnail: dùng ảnh đầu tiên; nếu không có thì hiện placeholder thương hiệu Qi Prime. */
function Thumb({ src, title }: { src?: string; title: string }) {
  if (src) return <img src={src} alt={title} className="h-48 w-full object-cover" loading="lazy" />;
  return (
    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2">
      <span className="font-[Montserrat] text-2xl font-bold text-white">Qi Prime<span className="text-ob-lime">.</span></span>
    </div>
  );
}

function SuKienPage() {
  const { data: events } = useQuery({
    queryKey: ["pub_events"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_events").select("*").eq("is_active", true).order("event_date", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-ob-lime/40 bg-ob-lime/10 px-4 py-1.5 text-xs font-medium text-ob-lime mb-6">
            Lịch Trình Cộng Đồng
          </div>
          <h1 className="font-[Montserrat] text-4xl sm:text-5xl font-bold text-white leading-tight">
            Sự Kiện <span className="text-ob-lime">Qi Prime</span>
          </h1>
          <p className="mt-6 font-[Roboto] text-base text-white/70 leading-7">
            Nơi cập nhật toàn bộ chiến dịch hợp tác cùng đối tác công nghệ, các buổi Offline meetup và Zoom đào tạo hàng tuần — sân chơi để cộng đồng Vườn Ươm Kỷ Luật kết nối, học hỏi và cùng triển khai.
          </p>
        </div>
      </section>
      {events && events.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-[Montserrat] text-2xl sm:text-3xl font-bold text-[#111827] mb-8">Sự kiện sắp tới & gần đây</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((ev: any) => {
                const imgs: string[] = Array.isArray(ev.images) ? ev.images : [];
                return (
                  <Link
                    key={ev.id}
                    to="/su-kien/$id"
                    params={{ id: ev.id }}
                    className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <Thumb src={imgs[0]} title={ev.title} />
                    <div className="p-5">
                      {ev.event_date && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ob-lime-2">
                          <CalendarDays className="h-3.5 w-3.5" /> {new Date(ev.event_date).toLocaleDateString("vi-VN")}
                        </div>
                      )}
                      <h3 className="mt-1.5 font-[Montserrat] font-bold text-lg text-[#111827] leading-snug line-clamp-2">{ev.title}</h3>
                      {ev.description && <p className="mt-2 text-sm text-[#374151] leading-6 line-clamp-3">{ev.description}</p>}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Images className="h-3.5 w-3.5" /> {imgs.length} ảnh
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-ob-lime-2 group-hover:gap-2 transition-all">
                          Xem chi tiết <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
