import { createFileRoute } from "@tanstack/react-router";
import { PowerOff, Ruler, GitMerge, Shield, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { CTASection } from "@/components/home/CTASection";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Hệ Sinh Thái Toàn Diện Qi Prime — All-in-One Trading Infrastructure" },
      { name: "description", content: "Cỗ máy khép kín: Hạ tầng công nghệ QiSignals & Bot EA, Hạ tầng đầu tư AI Copy Trade, Hạ tầng tri thức Học Viện & Group Tổng Hợp." },
      { property: "og:title", content: "Hệ Sinh Thái Toàn Diện Qi Prime" },
      { property: "og:description", content: "Công nghệ · Đầu tư · Tri thức — ba lớp hạ tầng vận hành đồng bộ 24/5." },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  { icon: TrendingUp, title: "Hạ Tầng Công Nghệ — QiSignals & Bot EA", desc: "Hệ thống rà quét thanh khoản 24/5 từ 6 AI Agents phối hợp cùng các thuật toán Bot Hybrid xử lý lệnh kẹt tự động, vận hành kỷ luật vô cảm trên mọi tài khoản." },
  { icon: Shield, title: "Hạ Tầng Đầu Tư — AI Copy Trade", desc: "Nền tảng kết nối tài khoản Master dành cho nhà đầu tư bận rộn, được bảo vệ bằng bộ khóa an toàn Kill-Switch MDD 15–20% và chia sẻ lợi nhuận minh bạch 70/30." },
  { icon: GitMerge, title: "Hạ Tầng Tri Thức — Học Viện & Group Tổng Hợp", desc: "Cập nhật tin tức vĩ mô 3 lần/ngày đầu các phiên Á–Âu–Mỹ, kết hợp chuỗi đào tạo bài bản từ Skool đến các buổi Zoom/Offline thực chiến hàng tuần." },
  { icon: PowerOff, title: "Kill-Switch MDD 15–20%", desc: "Ngắt mạch thể chế: khi sụt giảm vốn chạm ngưỡng cài đặt, hệ thống tự động đóng băng toàn bộ lệnh và ngắt kết nối khỏi Master Account ngay lập tức." },
  { icon: Ruler, title: "1% Rule Sizer", desc: "Bộ định cỡ rủi ro giới hạn mỗi lệnh tối đa 1–2% vốn — không ngoại lệ, không bị ghi đè bởi cảm xúc người dùng." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-ib-navy to-[#15294a] py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-ib-gold/15 border border-ib-gold/30 px-4 py-1.5 text-xs font-medium text-ib-gold mb-6 uppercase tracking-wider">
              Hệ Sinh Thái Toàn Diện
            </div>
            <h1 className="font-[Montserrat] text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.05]">
              Cỗ Máy Khép Kín<br /><span className="text-ib-gold">Từ Con Số 0 Đến Dòng Tiền Bền Vững</span>
            </h1>
            <p className="mt-6 text-base text-white/70 max-w-2xl leading-7">
              Hệ sinh thái Qi Prime gồm ba lớp hạ tầng đồng bộ: Công Nghệ (QiSignals & Bot EA) — Đầu Tư (AI Copy Trade) — Tri Thức (Học Viện & Group Tổng Hợp), được thiết kế để hỗ trợ nhà đầu tư trên toàn bộ hành trình.
            </p>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-slate-200 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-ib-gold/40">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ib-navy">
                    <f.icon className="h-5 w-5 text-ib-gold" />
                  </div>
                  <h3 className="mt-5 font-[Montserrat] text-lg font-semibold text-ib-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#1F2937] font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}