import { Layers, BarChart3, DollarSign, Zap } from "lucide-react";

const stats = [
  { icon: Layers, value: "100%", label: "Cơ Chế Chia Sẻ Hiệu Suất Minh Bạch" },
  { icon: BarChart3, value: "250K+", label: "Tổng Lots Giám Sát Hàng Tháng" },
  { icon: DollarSign, value: "$2.5M+", label: "Giá Trị Tối Ưu Cho Đối Tác" },
  { icon: Zap, value: "0.0s", label: "Độ Trễ Đối Soát Hiệu Suất" },
];

export function StatsBar() {
  return (
    <section className="bg-ob-dark border-y border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-ob-lime/10 hover:border-ob-lime/40"
              style={{ height: 120 }}
            >
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ob-lime/15">
                <s.icon className="h-5 w-5 text-ob-lime" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-2xl lg:text-3xl font-bold text-ob-lime leading-tight">
                  {s.value}
                </div>
                <div className="text-xs text-white/70 mt-1 truncate">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
