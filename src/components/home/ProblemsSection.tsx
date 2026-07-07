import { AlertTriangle, ShieldOff, HeartPulse } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Bản Ngã Cảm Xúc — 90% Trắng Tay",
    desc: "Nhà đầu tư dễ dàng trở thành nạn nhân của hội chứng sợ bỏ lỡ (FOMO) hoặc lao vào nhồi lệnh trả thù thị trường (Revenge Trading) sau các chuỗi thua lỗ.",
  },
  {
    icon: ShieldOff,
    title: "Vô Kỷ Luật Quản Lý Vốn",
    desc: "Lạm dụng đòn bẩy quá mức và gồng lỗ vô hạn, phá vỡ nguyên tắc quản trị rủi ro sống còn 1% cho mỗi vị thế giao dịch độc lập.",
  },
  {
    icon: HeartPulse,
    title: "Bào Mòn Thời Gian & Sức Khỏe",
    desc: "Việc phải dán mắt vào biểu đồ liên tục 24/7 gây kiệt quệ về thể chất lẫn tinh thần nhưng hiệu suất tài khoản vẫn sụt giảm nghiêm trọng.",
  },
];

export function ProblemsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime-2 mb-3">
            Nỗi Đau Thị Trường
          </div>
          <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ob-dark leading-tight">
            Vì sao nhà đầu tư cá nhân thường <span className="text-ob-lime">gục ngã trước khi kịp mở rộng quy mô vốn?</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-ob-lime/10 transition-colors group-hover:bg-ob-lime/20">
                <p.icon className="h-6 w-6 text-ob-lime" />
              </div>
              <h3 className="mt-5 font-[Montserrat] text-xl font-semibold text-ob-dark">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#1F2937] font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}