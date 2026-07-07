const stats = [
  { value: "Minh", suffix: " Bạch", label: "Hệ thống đối soát thu nhập và ghi nhận hiệu suất real-time với độ trễ bằng không." },
  { value: "250K", suffix: "+", label: "Khối lượng Lots giao dịch phát sinh ổn định hàng tháng trong toàn mạng lưới." },
  { value: "$2.5M", suffix: "+", label: "Tổng giá trị chia sẻ hiệu suất công nghệ đã được chi trả chuẩn xác cho các đối tác." },
  { value: "0.0", suffix: " giây", label: "Tốc độ xử lý dữ liệu dòng tiền và cập nhật trạng thái thu nhập tức thì." },
];

export function NumberStatsRow() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200">
          {stats.map((s) => (
            <div key={s.label} className="lg:px-8 first:lg:pl-0">
              <div className="h-0.5 w-12 bg-ob-lime mb-3" />
              <div className="font-mono text-5xl font-bold text-ob-dark flex items-start">
                {s.value}
                <span className="text-ob-lime text-3xl ml-1">{s.suffix}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-[#374151] font-medium max-w-[180px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}