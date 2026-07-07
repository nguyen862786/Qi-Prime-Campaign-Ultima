import { Brain, Bot, Copy, Users, Check } from "lucide-react";

const pillars = [
  {
    icon: Brain,
    title: "Bộ Não AI & Hệ Thống Tín Hiệu",
    items: [
      "Tích hợp 6 Đặc vụ AI chuyên biệt",
      "Quét dòng tiền real-time đa thị trường",
      "Sinh tín hiệu hội tụ chính xác",
    ],
  },
  {
    icon: Bot,
    title: "Cỗ Máy Thuật Toán Hybrid EA",
    items: [
      "Bot giao dịch tự động thông minh",
      "Cơ chế Smart Merge & Offset lệnh",
      "Tấm khiên khóa phòng thủ tài khoản",
    ],
  },
  {
    icon: Copy,
    title: "AI Copy Trade Kỷ Luật",
    items: [
      "Sao chép chiến lược tự động",
      "Tuyến phòng thủ rủi ro MDD 15-20%",
      "Đóng vị thế trong ngày, không giữ qua đêm",
    ],
  },
  {
    icon: Users,
    title: "Đòn Bẩy Thu Nhập Master IB",
    items: [
      "Hạ tầng công nghệ chuẩn thể chế",
      "Cơ chế Thu nhập kép bền vững",
      "Phễu giáo dục chuyển đổi tự động",
    ],
  },
];

export function PillarsSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime-2 mb-3">
            Giải Pháp Cốt Lõi
          </div>
          <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ob-dark leading-tight">
            Bốn trụ cột cốt lõi trong <span className="text-ob-lime">hệ sinh thái Qi Prime</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-ob-lime/40"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ob-dark">
                <p.icon className="h-5 w-5 text-ob-lime" />
              </div>
              <h3 className="mt-5 font-[Montserrat] text-lg font-semibold text-ob-dark">
                {p.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {p.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1F2937] font-medium">
                    <Check className="h-4 w-4 text-ob-lime-2 shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}