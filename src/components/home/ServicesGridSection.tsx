import { ArrowRight, Brain, Shield, Users } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Hệ Thống AI Copy Trade Kỷ Luật",
    img: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Shield,
    title: "Hạ Tầng Phòng Thủ Quản Trị Rủi Ro",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Users,
    title: "Mạng Lưới Công Nghệ Cho Master IB",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
  },
];

export function ServicesGridSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 items-end">
          <div>
            <div className="inline-flex items-center rounded-full border border-ob-dark/15 bg-white px-4 py-1.5 text-xs font-medium text-ob-dark mb-5">
              Hệ Sinh Thái
            </div>
            <h2 className="font-[Montserrat] text-3xl sm:text-4xl lg:text-[44px] font-bold text-ob-dark leading-[1.15]">
              Giải Pháp Công Nghệ Giúp Bảo Vệ<br />Và Tăng Trưởng Dòng Vốn
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4">
            <p className="text-sm text-[#1F2937] font-medium max-w-md lg:text-right">
              Hạ tầng tự động hóa chuẩn thể chế được xây dựng cho Master IB, nhà đầu tư Copy Trade và các đối tác khối lượng lớn — không bao giờ thoả hiệp với kỷ luật và tốc độ.
            </p>
            <a href="/san-pham" className="inline-flex items-center gap-1.5 rounded-full bg-ob-lime px-5 py-2.5 text-xs font-semibold text-ob-dark hover:bg-ob-lime-2 transition-colors">
              Khám Phá Cấp AI <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="group relative overflow-hidden rounded-2xl bg-ob-dark aspect-[4/5]">
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ob-dark via-ob-dark/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ob-lime/40 bg-ob-lime/15 backdrop-blur-sm">
                  <s.icon className="h-5 w-5 text-ob-lime" />
                </span>
                <h3 className="font-[Montserrat] text-lg font-bold text-white">{s.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}