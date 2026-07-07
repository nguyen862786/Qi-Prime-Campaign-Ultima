import { Eye, Target, ArrowRight } from "lucide-react";
import { useLeadModal } from "@/components/forms/LeadModal";

export function AboutSplitSection() {
  const { open: openLeadModal } = useLeadModal();
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
              alt="Finance consulting team"
              className="w-full h-[420px] object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <div className="inline-flex items-center rounded-full border border-ob-dark/15 bg-white px-4 py-1.5 text-xs font-medium text-ob-dark">
              Qi Legacy
            </div>
            <h2 className="mt-4 font-[Montserrat] text-3xl sm:text-4xl lg:text-[44px] font-bold text-ob-dark leading-[1.15]">
              Vườn Ươm Kỷ Luật<br />Đằng Sau Sự Tăng Trưởng Của Qi Prime
            </h2>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ob-lime/40 bg-ob-lime/10">
                  <Target className="h-5 w-5 text-ob-dark" />
                </div>
                <h3 className="mt-4 font-[Montserrat] text-base font-bold text-ob-dark">Sứ Mệnh Của Chúng Tôi</h3>
                <p className="mt-2 text-xs leading-6 text-[#1F2937] font-medium">
                  Thay thế hoàn toàn giao dịch cảm tính bằng kỷ luật toán học — bảo vệ dòng vốn an toàn cho mọi tài khoản trong mạng lưới liên kết.
                </p>
              </div>
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ob-lime/40 bg-ob-lime/10">
                  <Eye className="h-5 w-5 text-ob-dark" />
                </div>
                <h3 className="mt-4 font-[Montserrat] text-base font-bold text-ob-dark">Tầm Nhìn Chiến Lược</h3>
                <p className="mt-2 text-xs leading-6 text-[#1F2937] font-medium">
                  Xây dựng hệ sinh thái Master IB toàn cầu, nơi tư duy xác suất và năng lực phòng thủ tài sản được đặt lên hàng đầu.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 rounded-full bg-ob-dark px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ob-lime">
                  <Target className="h-3 w-3 text-ob-dark" />
                </span>
                <p className="text-xs text-white/80">
                  Cộng Đồng Qi Legacy — Nơi tôn vinh tư duy xác suất, kỷ luật toán học và văn hóa quản trị rủi ro tuyệt đối.
                </p>
              </div>
              <button type="button" onClick={openLeadModal} className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-ob-lime px-4 py-2 text-xs font-semibold text-ob-dark hover:bg-ob-lime-2 transition-colors">
                Gia Nhập Qi Legacy <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
