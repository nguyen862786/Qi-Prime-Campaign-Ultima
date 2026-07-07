import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, Coins, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { CTASection } from "@/components/home/CTASection";
import { IBFunnelWizard } from "@/components/partner/IBFunnelWizard";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Master IB Partner Program — Qi Prime" },
      { name: "description", content: "Own a financial network business generating $10,000+/month. Dual-income system: $15/lot commission + 10% performance share, with a 3-tier marketing funnel." },
      { property: "og:title", content: "Master IB Partner Program — Qi Prime" },
      { property: "og:description", content: "Dual-income: $15/lot + 10% profit share. Automated multi-tier payouts." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Tier 1 — Leads",
    price: "Free",
    period: "",
    desc: "Top of the funnel: introduce prospects to Trading Era 4.0 with zero friction.",
    features: [
      "Free educational webinars",
      "Market awareness content",
      "AI utility demonstrations",
      "Cold-audience nurturing",
    ],
    cta: "Get Lead Funnel Kit",
    popular: false,
  },
  {
    name: "Tier 2 — Conversion",
    price: "$97",
    period: "/seat",
    desc: "Low-cost Trading 4.0 Masterclass that converts warm leads into active partners.",
    features: [
      "'Trading 4.0 Masterclass'",
      "Hybrid bot mechanics deep-dive",
      "Live AI walkthroughs",
      "Sub-IB conversion playbook",
      "Tier-2 upgrade path",
    ],
    cta: "Launch Masterclass",
    popular: true,
  },
  {
    name: "Tier 3 — Scale",
    price: "Custom",
    period: "",
    desc: "Private group coaching for premium Master IBs and high-net-worth investors.",
    features: [
      "Private group coaching",
      "Premium Master IB pod",
      "HNW investor allocation",
      "Dedicated success manager",
      "Custom override ladders",
    ],
    cta: "Apply for Scale Tier",
    popular: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-ib-navy to-[#15294a] py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-ib-gold/15 border border-ib-gold/30 px-4 py-1.5 text-xs font-medium text-ib-gold mb-6 uppercase tracking-wider">
              Master IB Program
            </div>
            <h1 className="font-[Montserrat] text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.05]">
              Own a Financial Network<br />Generating <span className="text-ib-gold">$10,000+/month</span>
            </h1>
            <p className="mt-6 text-base text-white/70 max-w-2xl mx-auto">
              Focus on partner acquisition while our automated infrastructure calculates multi-tier payouts with zero latency.
            </p>
          </div>
        </section>

        {/* Dual-income system */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ib-teal mb-3">
                The Dual-Income System
              </div>
              <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ib-navy leading-tight">
                Two pillars, <span className="text-ib-gold">one compounding engine</span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 border-l-4 border-l-ib-gold bg-white p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ib-teal">Trụ Cột 1</span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ib-navy">
                    <Coins className="h-5 w-5 text-ib-gold" />
                  </span>
                </div>
                <h3 className="mt-4 font-[Montserrat] text-2xl font-bold text-ib-navy">Lot Commission</h3>
                <div className="mt-2 font-mono text-3xl font-bold text-ib-gold">$15 / Lot</div>
                <p className="mt-4 text-sm leading-7 text-[#1F2937] font-medium">
                  Solid foundational revenue paid out instantly on every single position closed across your entire network, independent of trade outcomes.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 border-l-4 border-l-ib-gold bg-white p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ib-teal">Trụ Cột 2</span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ib-navy">
                    <TrendingUp className="h-5 w-5 text-ib-gold" />
                  </span>
                </div>
                <h3 className="mt-4 font-[Montserrat] text-2xl font-bold text-ib-navy">Profit Share</h3>
                <div className="mt-2 font-mono text-3xl font-bold text-ib-gold">10% Performance</div>
                <p className="mt-4 text-sm leading-7 text-[#1F2937] font-medium">
                  Absolute alignment of interest. Earn a 10% performance fee split from the net profits generated by the Master Account.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ib-teal mb-3">
                3-Tier Marketing Funnel
              </div>
              <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ib-navy leading-tight">
                The infrastructure that <span className="text-ib-gold">prints partners</span>
              </h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={`relative rounded-3xl bg-white p-8 border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ${
                    t.popular ? "border-ib-gold shadow-lg shadow-ib-gold/10" : "border-slate-200"
                  }`}
                >
                  {t.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-ib-gold px-4 py-1 text-xs font-semibold text-ib-navy">
                      <Sparkles className="h-3.5 w-3.5" /> Most Popular
                    </div>
                  )}
                  <h3 className="font-[Montserrat] text-xl font-bold text-ib-navy">{t.name}</h3>
                  <p className="mt-2 text-sm text-[#1F2937] font-medium leading-6">{t.desc}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-mono text-5xl font-bold text-ib-navy">{t.price}</span>
                    {t.period && <span className="text-sm text-[#374151] font-medium">{t.period}</span>}
                  </div>
                  <ul className="mt-8 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className="h-4 w-4 text-ib-teal shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98] ${
                      t.popular
                        ? "bg-ib-gold text-ib-navy shadow-lg shadow-ib-gold/30 hover:shadow-xl"
                        : "bg-ib-navy text-white hover:bg-ib-navy/90"
                    }`}
                  >
                    {t.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IB AUDIT FUNNEL */}
        <section id="ib-audit" className="relative bg-gradient-to-br from-ob-dark via-ob-dark to-[#15294a] py-20 scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center rounded-full border border-ob-lime/40 bg-ob-lime/10 px-4 py-1.5 text-xs font-medium text-ob-lime mb-4">
                ĐĂNG KÝ KHẢO SÁT MASTER IB CHIẾN LƯỢC
              </div>
              <h2 className="font-[Montserrat] text-3xl sm:text-4xl font-bold text-white">
                Phễu Khảo Sát <span className="text-ob-lime">3 Bước</span>
              </h2>
              <p className="mt-3 text-white/60 max-w-xl mx-auto text-sm">
                Hồ sơ Elite (volume &gt; 500 Lots hoặc team &gt; 200 thành viên) được Sáng lập trực tiếp kết nối trong 30 phút.
              </p>
            </div>
            <IBFunnelWizard />
          </div>
        </section>

        {/* Đối tác chiến lược — Tiêu chuẩn lựa chọn sàn */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ib-teal mb-3">Đối Tác Chiến Lược</div>
              <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ib-navy leading-tight">
                Tiêu Chuẩn Khắt Khe Khi <span className="text-ib-gold">Chọn Sàn Đối Tác</span>
              </h2>
              <p className="mt-4 text-sm text-[#1F2937] font-medium leading-7">
                Để bảo vệ tài sản nhà đầu tư và đảm bảo công nghệ AI vận hành mượt mà, Qi Prime chỉ hợp tác với các sàn đạt đủ ba lớp tiêu chuẩn thể chế dưới đây.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { t: "Giấy Phép Thể Chế", d: "Có đầy đủ giấy phép chứng nhận từ các tổ chức tài chính uy tín thế giới — FCA, ASIC, hoặc tương đương." },
                { t: "Tốc Độ & Spread", d: "Khớp lệnh mili-giây, trượt giá (Slippage) tối thiểu và spread siêu thấp — tối ưu hiệu suất cho Bot EA." },
                { t: "Hỗ Trợ Nội Địa 24/7", d: "Đội ngũ hỗ trợ kỹ thuật và nạp rút nội địa 24/7 nhanh chóng, không rào cản ngôn ngữ." },
              ].map((s) => (
                <div key={s.t} className="rounded-2xl border border-slate-200 border-l-4 border-l-ib-gold p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <h3 className="font-[Montserrat] text-lg font-bold text-ib-navy">{s.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#1F2937] font-medium">{s.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-ib-navy p-8 text-white">
              <div className="text-xs uppercase tracking-[0.2em] text-ib-gold font-semibold">Đồng Hành Chiến Lược</div>
              <p className="mt-3 text-sm leading-7 text-white/80 max-w-3xl">
                Hệ thống công nghệ Qi Prime đang phối hợp toàn diện cùng đối tác chiến lược để tài trợ: tặng bản quyền Bot EA Free, bảo hiểm sụt giảm vốn, quỹ thưởng cho Master IB và các buổi Offline chia sẻ tri thức trên toàn quốc.
              </p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}