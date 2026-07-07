const cases = [
  {
    tag: "Đặc Vụ 1 — Chuyên Viên Tín Hiệu",
    title: "Chuyên Viên Tín Hiệu",
    metric: "Real-time",
    desc: "Phân tích cấu trúc thị trường real-time, lọc nhiễu hệ thống để xuất các vùng Entry/SL/TP đạt độ chính xác cao.",
  },
  {
    tag: "Đặc Vụ 2 — Kiểm Toán Rủi Ro",
    title: "Kiểm Toán Rủi Ro",
    metric: "1–2% / lệnh",
    desc: "Tự động kiểm soát khối lượng (Lot size) nghiêm ngặt và quản lý đồ thị sụt giảm vốn (Equity curve) của từng tài khoản.",
  },
  {
    tag: "Đặc Vụ 3 — Kỹ Sư Tự Động Hóa",
    title: "Kỹ Sư Tự Động Hóa",
    metric: "Triển khai 8s",
    desc: "Chuyển đổi ý tưởng chiến lược thành mã lập trình Pine Script hoặc hệ thống mã nguồn EA MT5 trong vòng 8 giây.",
  },
  {
    tag: "Đặc Vụ 4 — Cố Vấn Mentor Coach",
    title: "Cố Vấn Mentor Coach",
    metric: "SMC / Wyckoff",
    desc: "Định hình và tối ưu hóa lộ trình giao dịch cá nhân hóa dựa trên các trường phái kinh điển (SMC, Wyckoff).",
  },
];

export function UseCasesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime-2 mb-3">
              6 Đặc Vụ AI Chuyên Biệt
            </div>
            <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold text-ob-dark leading-tight">
              Hạ Tầng Giao Dịch <span className="text-ob-lime">AI Chuẩn Thể Chế</span>, Vận Hành Tự Động 24/5
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <article
              key={c.title}
              className="group relative rounded-2xl border border-slate-200 border-l-4 border-l-ob-lime bg-white p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-ob-lime-2">
                  {c.tag}
                </span>
                <span className="font-mono text-sm font-bold text-ob-lime">{c.metric}</span>
              </div>
              <h3 className="mt-4 font-[Montserrat] text-xl font-semibold text-ob-dark leading-snug">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#1F2937] font-medium">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}