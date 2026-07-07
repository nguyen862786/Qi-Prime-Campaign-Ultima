import { createFileRoute } from "@tanstack/react-router";
import { Target, Shield, Globe, Heart } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { CTASection } from "@/components/home/CTASection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Giới Thiệu Qi Prime — Hạ Tầng Công Nghệ Giao Dịch Thể Chế" },
      { name: "description", content: "Qi Prime là hạ tầng công nghệ giao dịch toàn diện kết hợp AI Agents và kỷ luật toán học thể chế — tái cấu trúc cách tiếp cận thị trường tài chính cho nhà đầu tư cá nhân." },
      { property: "og:title", content: "Giới Thiệu Qi Prime — Vườn Ươm Kỷ Luật" },
      { property: "og:description", content: "Trí tuệ nhân tạo · Kỷ luật vô cảm · Minh bạch tuyệt đối · Bền vững an toàn." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Shield, title: "Kỷ Luật Vô Cảm", desc: "Loại bỏ 100% lòng tham, nỗi sợ, sự hoảng loạn và hành vi nhồi lệnh trả thù thị trường — máy móc thực thi nguyên tắc toán học vô điều kiện." },
  { icon: Target, title: "Minh Bạch Tuyệt Đối", desc: "Mọi thông số rủi ro và tỷ lệ sụt giảm vốn (Drawdown) đều được kiểm toán theo thời gian thực, không vùng tối, không che giấu." },
  { icon: Heart, title: "Bền Vững An Toàn", desc: "Lợi nhuận đều đặn đến từ tư duy xác suất lớn hơn rủi ro — không bao giờ đánh đổi bằng sự mạo hiểm tài sản của nhà đầu tư." },
  { icon: Globe, title: "Hạ Tầng Thể Chế", desc: "Mang hạ tầng quản trị rủi ro vốn chỉ dành cho quỹ phòng hộ (Hedge Funds) cao cấp về tay từng trader nhỏ lẻ." },
];

const milestones = [
  { year: "2022", label: "Hình thành cộng đồng Qi Legacy — Vườn Ươm Kỷ Luật đầu tiên" },
  { year: "2023", label: "Phát hành QiSignals và bộ 6 AI Agents cho nhóm Master IB tiên phong" },
  { year: "2024", label: "Triển khai Bot Hybrid Multi-Grid trên tài khoản Master Copy Trade" },
  { year: "2026", label: "250K+ Lots giám sát/ngày · Top 1 hệ sinh thái giao dịch tự động Việt Nam" },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-ib-navy to-[#15294a] py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-ib-gold/15 border border-ib-gold/30 px-4 py-1.5 text-xs font-medium text-ib-gold mb-6 uppercase tracking-wider">
              Giới Thiệu Qi Prime
            </div>
            <h1 className="font-[Montserrat] text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.05]">
              Hạ Tầng <span className="text-ib-gold">Giao Dịch Thể Chế</span><br />Cho Nhà Đầu Tư Cá Nhân
            </h1>
            <p className="mt-6 text-base text-white/70 max-w-2xl leading-7">
              Qi Prime là hạ tầng công nghệ giao dịch toàn diện, vận hành dựa trên sự kết hợp giữa Trí tuệ Nhân tạo (AI Agents) và kỷ luật toán học thể chế. Chúng tôi chuyển giao toàn bộ gánh nặng từ tâm lý con người sang sự chính xác tuyệt đối của máy móc.
            </p>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ib-teal mb-3">Giá Trị Cốt Lõi</div>
              <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ib-navy leading-tight">
                Bốn Nguyên Tắc Đứng Sau <span className="text-ib-gold">Mỗi Quyết Định</span>
              </h2>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-slate-200 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-ib-gold/40">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ib-navy">
                    <v.icon className="h-5 w-5 text-ib-gold" />
                  </div>
                  <h3 className="mt-5 font-[Montserrat] text-lg font-semibold text-ib-navy">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#1F2937] font-medium">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ib-teal mb-3">Hành Trình Phát Triển</div>
            <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ib-navy leading-tight">
              Sứ Mệnh <span className="text-ib-gold">Giải Cứu Nhà Đầu Tư Cá Nhân</span>
            </h2>
            <p className="mt-4 text-sm text-[#1F2937] font-medium leading-7 max-w-3xl">
              Giải cứu nhà đầu tư cá nhân khỏi cái bẫy tâm lý khiến 90% số đông trắng tay. Mục tiêu: trở thành hệ sinh thái hỗ trợ giao dịch tự động có quy mô và hiệu suất Top 1 Việt Nam, đồng hành cùng mạng lưới Master IB đến hết năm 2026 và xa hơn nữa.
            </p>
            <ol className="mt-12 relative border-l-2 border-ib-gold/30 space-y-8 pl-8">
              {milestones.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[42px] flex h-5 w-5 items-center justify-center rounded-full bg-ib-gold ring-4 ring-white" />
                  <div className="font-mono text-sm font-bold text-ib-gold">{m.year}</div>
                  <div className="mt-1 font-[Montserrat] text-lg font-semibold text-ib-navy">{m.label}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}