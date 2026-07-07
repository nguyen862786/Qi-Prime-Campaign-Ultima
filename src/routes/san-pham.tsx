import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useLeadModal } from "@/components/forms/LeadModal";
import { Bot, TrendingUp, Zap, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/san-pham")({
  head: () => ({
    meta: [
      { title: "Sản Phẩm Qi Prime — 4 Cấu Hình EA Chuyên Biệt" },
      { name: "description", content: "Hybrid Multi-Grid, Trend Follower, Scalper Pro và Smart Shield Defender — 4 EA chuyên biệt được tối ưu cho từng phong cách giao dịch và cấu hình rủi ro." },
    ],
  }),
  component: SanPhamPage,
});

const EAS = [
  {
    icon: Bot,
    name: "EA Hybrid Multi-Grid",
    tagline: "Cỗ máy trung hòa lệnh kẹt tự động",
    desc: "Tối ưu dòng tiền phiên Á–Âu, tự động gộp & offset các vùng lệnh kẹt vô hại để giải phóng tài khoản mà không cần can thiệp thủ công.",
    indicators: [
      { k: "Phong cách", v: "Multi-Grid Hybrid" },
      { k: "Khung thời gian", v: "M15 – H1" },
      { k: "Rủi ro", v: "MDD cấu hình 10–30%" },
      { k: "Trạng thái", v: "LIVE" },
    ],
  },
  {
    icon: TrendingUp,
    name: "EA Trend Follower",
    tagline: "Bám trend khối lượng lớn",
    desc: "Thuật toán nhận diện xu hướng dựa trên cấu trúc SMC và volume, tự động dời SL bảo toàn lợi nhuận theo từng nhịp swing.",
    indicators: [
      { k: "Phong cách", v: "Trend / Swing" },
      { k: "Khung thời gian", v: "H1 – H4" },
      { k: "Rủi ro", v: "Trailing SL Dynamic" },
      { k: "Trạng thái", v: "LIVE" },
    ],
  },
  {
    icon: Zap,
    name: "EA Scalper Pro",
    tagline: "Quét thanh khoản mili-giây",
    desc: "Vào ra lệnh siêu tốc dựa trên Volume Profile và dấu chân dòng tiền lớn — phù hợp tài khoản có spread thấp và VPS tốc độ cao.",
    indicators: [
      { k: "Phong cách", v: "Scalping HFT-lite" },
      { k: "Khung thời gian", v: "M1 – M5" },
      { k: "Rủi ro", v: "Cap 1% / lệnh" },
      { k: "Trạng thái", v: "BETA" },
    ],
  },
  {
    icon: ShieldCheck,
    name: "EA Smart Shield Defender",
    tagline: "Hệ thống phòng thủ tối cao",
    desc: "Tự động khóa đối ứng (hedge lock) khi drawdown chạm ngưỡng 15%, bảo toàn vốn và đợi nhịp thị trường hồi phục để giải tỏa lệnh.",
    indicators: [
      { k: "Phong cách", v: "Defensive Hedge" },
      { k: "Khung thời gian", v: "All" },
      { k: "Rủi ro", v: "Kill-Switch 15%" },
      { k: "Trạng thái", v: "LIVE" },
    ],
  },
];

function SanPhamPage() {
  const { open: openLeadModal } = useLeadModal();
  const { data: cmsProducts } = useQuery({
    queryKey: ["pub_products"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_products").select("*").eq("is_active", true).order("sort_order");
      return data ?? [];
    },
  });
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-ob-lime/40 bg-ob-lime/10 px-4 py-1.5 text-xs font-medium text-ob-lime mb-6">
            4 Cấu Hình EA · Tối Ưu Theo Phong Cách
          </div>
          <h1 className="font-[Montserrat] text-3xl sm:text-5xl font-bold text-white leading-tight">
            Bốn EA Chuyên Biệt — <span className="text-ob-lime">Một Hệ Sinh Thái Kỷ Luật</span>
          </h1>
          <p className="mt-5 font-[Roboto] text-base text-white/80 max-w-2xl mx-auto font-medium">
            Mỗi cấu hình EA được tinh chỉnh cho một phong cách giao dịch riêng — từ trung hòa lệnh kẹt, bám trend, scalping cho tới phòng thủ chủ động khi thị trường nghịch hướng.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={openLeadModal} className="inline-flex items-center justify-center rounded-full bg-ob-lime px-7 py-3 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 transition-colors">
              Nhận 7 Ngày Dùng Thử Miễn Phí
            </button>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Tư Vấn Cấu Hình Riêng
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {EAS.map((ea) => (
              <div key={ea.name} className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-ob-lime/40">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ob-dark">
                    <ea.icon className="h-5 w-5 text-ob-lime" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-[Montserrat] text-xl font-bold text-[#111827]">{ea.name}</h3>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ob-lime-2 mt-1">{ea.tagline}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#1F2937] font-medium">{ea.desc}</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {ea.indicators.map((ind) => (
                    <div key={ind.k} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wider text-[#374151] font-semibold">{ind.k}</div>
                      <div className="mt-0.5 font-mono text-sm font-bold text-[#111827]">{ind.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-[#1F2937] font-medium">
                  <Check className="h-4 w-4 text-ob-lime" /> Tích hợp Kill-Switch · Cấu hình MDD cá nhân hóa
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {cmsProducts && cmsProducts.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-[Montserrat] text-2xl sm:text-3xl font-bold text-[#111827] mb-8">Cấu hình EA đang triển khai</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {cmsProducts.map((p: any) => (
                <Link key={p.id} to="/san-pham/$id" params={{ id: p.id }} className="group block rounded-3xl border border-slate-200 bg-white p-7 hover:shadow-xl hover:-translate-y-1 hover:border-ob-lime/40 transition-all">
                  <div className="flex items-start gap-4">
                    {p.logo_url ? (
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ob-dark p-2">
                        <img src={p.logo_url} alt={p.name} className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ob-dark"><Bot className="h-5 w-5 text-ob-lime" /></div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-[Montserrat] text-xl font-bold text-[#111827]">{p.name}</h3>
                        {p.status && <span className="rounded-full border border-ob-lime/40 bg-ob-lime/10 px-2 py-0.5 text-[10px] font-bold text-ob-lime-2">{p.status}</span>}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-ob-lime-2 mt-1">Risk: {p.risk_level}{p.timeframe ? ` · ${p.timeframe}` : ""}</div>
                    </div>
                  </div>
                  {p.mockup_url && <img src={p.mockup_url} alt="" className="mt-5 rounded-2xl border border-slate-200 w-full object-cover" />}
                  {p.description && <p className="mt-4 text-sm leading-7 text-[#1F2937] font-medium line-clamp-3">{p.description}</p>}
                  {(p.win_rate != null || p.max_drawdown != null || p.monthly_profit != null) && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[#374151] font-semibold">Win</div>
                        <div className="font-mono text-sm font-bold text-emerald-600">{p.win_rate != null ? `${p.win_rate}%` : "—"}</div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[#374151] font-semibold">MDD</div>
                        <div className="font-mono text-sm font-bold text-rose-500">{p.max_drawdown != null ? `${p.max_drawdown}%` : "—"}</div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[#374151] font-semibold">LN/th</div>
                        <div className="font-mono text-sm font-bold text-[#111827]">{p.monthly_profit != null ? `${p.monthly_profit}%` : "—"}</div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ob-lime-2 group-hover:gap-2 transition-all">Xem chi tiết <ArrowRight className="h-4 w-4" /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
