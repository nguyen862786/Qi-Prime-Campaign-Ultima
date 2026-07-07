import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useLeadModal } from "@/components/forms/LeadModal";
import { Layers, Gauge, Bot, Network, Check } from "lucide-react";

export const Route = createFileRoute("/doi-tac")({
  head: () => ({
    meta: [
      { title: "Đối Tác Qi Prime — Hạ Tầng Master IB Vượt Trội" },
      { name: "description", content: "Cơ chế chia sẻ hiệu suất công nghệ minh bạch, CRM funnel tự động, hạ tầng zero-latency — mở rộng quy mô doanh nghiệp FinTech cá nhân." },
    ],
  }),
  component: PartnerPage,
});

const PILLARS = [
  { icon: Layers, t: "Chia Sẻ Hiệu Suất Công Nghệ", d: "Cơ chế chia sẻ hiệu suất công nghệ minh bạch — đối soát thu nhập real-time, không độ trễ, không thao tác thủ công." },
  { icon: Gauge, t: "Real-Time Settlement Engine", d: "Thu nhập được khớp và ghi sổ ngay khi hiệu suất phát sinh — minh bạch trên dashboard cá nhân." },
  { icon: Bot, t: "CRM & Funnel Tự Động", d: "Phễu marketing kín 3 tầng: Lead Magnet → Masterclass $97 → Master IB. Tự động nurturing, scoring và phân tuyến." },
  { icon: Network, t: "Hạ Tầng Zero-Latency", d: "Server giao dịch và bridge tín hiệu đặt cạnh LD4/NY4/TY3 — slippage trung bình < 0.3 pip, đảm bảo lệnh khớp đồng bộ toàn mạng." },
];

function PartnerPage() {
  const { open: openLeadModal } = useLeadModal();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-ob-lime/40 bg-ob-lime/10 px-4 py-1.5 text-xs font-medium text-ob-lime mb-6">
            Master IB Infrastructure · Trading Era 4.0
          </div>
          <h1 className="font-[Montserrat] text-3xl sm:text-5xl font-bold text-white leading-tight">
            Hạ Tầng <span className="text-ob-lime">Master IB</span> Chuẩn Thể Chế
          </h1>
          <p className="mt-5 font-[Roboto] text-base text-white/85 max-w-2xl mx-auto font-medium">
            Qi Prime cung cấp toàn bộ stack công nghệ cho Master IB: từ phễu marketing, CRM, cơ chế chia sẻ hiệu suất công nghệ minh bạch đến hạ tầng zero-latency — bạn tập trung mở rộng quy mô doanh nghiệp FinTech cá nhân.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={openLeadModal} className="inline-flex items-center justify-center rounded-full bg-ob-lime px-7 py-3 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 transition-colors">
              Đăng Ký Master IB
            </button>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Yêu Cầu Tư Vấn 1:1
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.t} className="rounded-3xl border border-slate-200 bg-white p-7 hover:-translate-y-1 hover:shadow-2xl hover:border-ob-lime/40 transition-all duration-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ob-dark">
                  <p.icon className="h-5 w-5 text-ob-lime" />
                </div>
                <h3 className="mt-5 font-[Montserrat] text-xl font-bold text-[#111827]">{p.t}</h3>
                <p className="mt-3 text-sm leading-7 text-[#1F2937] font-medium">{p.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-ob-dark border border-ob-lime/20 p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime mb-3">Năng Lực Hạ Tầng</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { l: "Real-time", v: "0ms", d: "Đối soát thu nhập" },
                { l: "Minh bạch", v: "100%", d: "Hiệu suất công nghệ" },
                { l: "Zero-latency", v: "< 0.3 pip", d: "Slippage trung bình" },
              ].map((t) => (
                <div key={t.l} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                  <div className="font-mono text-xs text-ob-lime font-semibold">{t.l}</div>
                  <div className="mt-1 font-[Montserrat] text-2xl font-bold text-white">{t.v}</div>
                  <div className="text-[10px] text-white/60 mt-1">{t.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/80 font-medium">
              <Check className="h-4 w-4 text-ob-lime" /> Đối soát real-time · Minh bạch toàn hệ · Tối ưu hóa thu nhập tiềm năng
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
