import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Cộng Đồng Qi Legacy Community",
    role: "Vườn Ươm Kỷ Luật",
    avatar: "#39FF14",
    content:
      "Cộng đồng của chúng tôi không tôn vinh các khoản lợi nhuận may rủi chớp nhoáng. Chúng tôi tôn vinh sự sống sót bền vững, tư duy xác suất toán học và nguyên tắc quản trị sụt giảm drawdown nghiêm ngặt. Kiểm soát Drawdown chính là thước đo vàng của một nhà giao dịch chuyên nghiệp.",
  },
  {
    name: "Mạng Lưới Master IB",
    role: "Đối Tác Cấp Tier-1",
    avatar: "#39FF14",
    content:
      "Hạ tầng thu nhập kép đã thay đổi mọi thứ. Hoa hồng lot về tức thì và cơ chế chia sẻ lợi nhuận giữ chúng tôi đồng hành sòng phẳng với mọi nhà đầu tư trong mạng lưới.",
  },
  {
    name: "Nhà Đầu Tư Copy Trade",
    role: "Thành Viên Dòng Tiền Thụ Động",
    avatar: "#111e2e",
    content:
      "Cơ chế ngắt mạch MDD 15–20% là điều bắt buộc với tôi. Tôi ngủ ngon mỗi đêm khi biết toán học lạnh lùng — chứ không phải hy vọng mù quáng — đang bảo vệ dòng vốn của mình.",
  },
  {
    name: "Học Viên Trading 4.0",
    role: "Cựu Học Viên Masterclass",
    avatar: "#39FF14",
    content:
      "6 Đặc vụ AI đã thay thế hàng năm trời ra quyết định cảm tính. Entry, SL, TP và sizing rủi ro đều được xử lý — tôi chỉ cần giám sát đường cong vốn.",
  },
];

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const total = testimonials.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);
  const t = testimonials[idx];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime-2 mb-3">
            Đánh Giá Cộng Đồng
          </div>
          <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ob-dark leading-tight">
            Cộng Đồng Kỷ Luật <span className="text-ob-lime">Qi Legacy</span>
          </h2>
        </div>

        <div className="mt-12 relative rounded-3xl bg-white border border-slate-200 p-8 md:p-12 shadow-sm">
          <Quote className="h-10 w-10 text-ob-lime/30" />
          <p className="mt-6 text-xl md:text-2xl leading-relaxed text-ob-dark font-[Montserrat] font-medium">
            &ldquo;{t.content}&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-ob-lime text-ob-lime" />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-full border-2 border-ob-lime/40 shrink-0"
                style={{ background: t.avatar }}
              />
              <div>
                <div className="font-semibold text-ob-dark">{t.name}</div>
                <div className="text-sm text-[#374151] font-medium">{t.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ob-dark transition-all duration-300 hover:-translate-y-1 hover:border-ob-lime hover:text-ob-lime active:scale-[0.98]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ob-dark text-white transition-all duration-300 hover:-translate-y-1 hover:bg-ob-lime hover:text-ob-dark active:scale-[0.98]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-8 bg-ob-lime" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
