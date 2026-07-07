import { useLeadModal } from "@/components/forms/LeadModal";

export function CTASection() {
  const { open: openLeadModal } = useLeadModal();
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-ob-dark via-[#1a3354] to-ob-dark flex items-center"
      style={{ minHeight: 300 }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_#D4AF37_0%,_transparent_70%)]" />
      </div>
      <div id="survey" className="relative mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-16 text-center scroll-mt-20">
        <h2 className="font-[Montserrat] text-3xl sm:text-[40px] font-bold tracking-tight text-white leading-tight">
          Tham Gia Hệ Sinh Thái Qi Prime.<br />
          Để <span className="text-ob-lime">Thuật Toán</span> Bảo Vệ Dòng Vốn Của Bạn.
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={openLeadModal}
            className="inline-flex items-center justify-center rounded-full bg-ob-lime px-8 py-3.5 text-sm font-semibold text-ob-dark shadow-lg shadow-ob-lime/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-ob-lime/40 active:scale-[0.98]"
          >
            Nhận 7 Ngày Dùng Thử Miễn Phí
          </button>
          <button
            type="button"
            onClick={openLeadModal}
            className="inline-flex items-center justify-center rounded-full border border-ob-lime-2 bg-ob-lime-2/10 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-ob-lime-2/20 active:scale-[0.98]"
          >
            Mở Tài Khoản Copy Demo
          </button>
        </div>
      </div>
    </section>
  );
}
