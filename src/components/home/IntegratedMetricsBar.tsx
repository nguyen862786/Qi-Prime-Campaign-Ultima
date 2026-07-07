import { Brain, Bot, Copy, ArrowRight } from "lucide-react";

const cards = [
  { icon: Brain, title: "Bộ Não AI & QiSignals", desc: "6 Đặc vụ AI chuyên biệt đọc dữ liệu thanh khoản đa thị trường, quét nhiễu và cung cấp các vùng hội tụ tín hiệu Entry/SL/TP với xác suất thành công vượt trội trên 70%." },
  { icon: Bot, title: "Thực Thi Bot Hybrid Multi-Grid EA", desc: "Hệ thống thuật toán thông minh thực thi vào lệnh vô cảm, tự động xử lý lệnh kẹt (Smart Offset) và kích hoạt khiên phòng thủ khóa đối ứng khi thị trường bão tố." },
  { icon: Copy, title: "Copy Trade Kỷ Luật", desc: "Giải pháp đầu tư nhàn rỗi được bảo vệ tuyệt đối bằng cơ chế ngắt mạch tự động (Kill-Switch) ngay khi chạm ngưỡng sụt giảm vốn cố định." },
];

export function IntegratedMetricsBar() {
  return (
    <section className="bg-white pt-12 pb-6 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Image card */}
          <div className="relative overflow-hidden rounded-2xl bg-ob-dark min-h-[220px]">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
              alt="Team strategy session"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ob-dark/90 via-ob-dark/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="font-[Montserrat] text-xl font-bold text-white">Hệ Sinh Thái Qi Prime Vận Hành Như Thế Nào</div>
              <a href="#how" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ob-lime">
                Khám phá cấu trúc hạ tầng <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* 3 dark cards merged */}
          <div className="lg:col-span-3 grid gap-px sm:grid-cols-3 rounded-2xl bg-white/5 overflow-hidden">
            {cards.map((c) => (
              <div key={c.title} className="bg-ob-dark p-7">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ob-lime/40 bg-ob-lime/10">
                  <c.icon className="h-5 w-5 text-ob-lime" />
                </div>
                <h3 className="mt-5 font-[Montserrat] text-lg font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-xs leading-6 text-white/70">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
