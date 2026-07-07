import React, { useState } from "react";
import { X, Users, Radio, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// cms_leads chưa có trong types.ts đã generate — nới lỏng type cho bảng này.
const db = supabase as any;

// Map vai trò UI -> giá trị chuẩn của hệ thống (admin Leads lọc theo ea/copy/ib).
const ROLE_DB: Record<string, string> = { trader: "ea", investor: "copy", partner: "ib" };

// Dữ liệu nến giả lập cho biểu đồ SVG (xanh = tăng, đỏ = giảm).
const CANDLES = [
  { x: 12, o: 44, c: 30, up: true },
  { x: 37, o: 30, c: 40, up: false },
  { x: 62, o: 40, c: 26, up: true },
  { x: 87, o: 26, c: 33, up: false },
  { x: 112, o: 33, c: 19, up: true },
  { x: 137, o: 19, c: 27, up: false },
  { x: 162, o: 27, c: 13, up: true },
  { x: 187, o: 13, c: 21, up: false },
  { x: 212, o: 21, c: 7, up: true },
];

function genQip() {
  return "QIP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

interface LeadCaptureFormProps {
  onClose: () => void;
}

export default function LeadCaptureForm({ onClose }: LeadCaptureFormProps) {
  const [role, setRole] = useState<"trader" | "investor" | "partner">("trader");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [capital, setCapital] = useState("Dưới 1,000 USD");
  const [goal, setGoal] = useState("Trải nghiệm thử Bot EA (7 ngày miễn phí)");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ⚠️ CẢNH BÁO BẢO MẬT: token đặt ở client sẽ lộ công khai trong bundle trình duyệt.
  // Nên chuyển sang Supabase Edge Function. Dùng env cho tiện thay; nhớ đổi token đã lộ.
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "8736867683:AAFLb9Q4vKBn2Mtsj5PNuZjnQpIxkO1kYFU";
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || "CHUA_CAU_HINH_CHAT_ID";

  const sendTelegramNotification = async (leadData: { name: string; phone: string; role: string; capital: string; goal: string }) => {
    if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID.includes("CHUA_CAU_HINH")) return;
    const message = `
🔥 <b>CÓ KHÁCH HÀNG MỚI ĐĂNG KÝ PHỄU!</b> 🔥
----------------------------------
👤 <b>Họ tên:</b> ${leadData.name}
📞 <b>Số điện thoại (Zalo):</b> ${leadData.phone}
🎯 <b>Vai trò định danh:</b> ${leadData.role.toUpperCase()}
💰 <b>Vốn dự kiến:</b> ${leadData.capital}
🚀 <b>Mục tiêu chính:</b> ${leadData.goal}
----------------------------------
🤖 <i>Hệ thống quản trị Qi Wealth Assistant</i>
    `;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });
    } catch (err) {
      console.error("Lỗi gửi thông báo Telegram:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    // Gộp dữ liệu trắc nghiệm thành chuỗi text gọn gàng lưu vào cột note trên Supabase
    const combinedNotes = `[Vai trò: ${role.toUpperCase()}] | [Vốn dự kiến: ${capital}] | [Mục tiêu: ${goal}]`;
    try {
      // 1. Lưu thông tin vào bảng cms_leads (đúng schema: qip/name/contact/role/note)
      const { error } = await db.from("cms_leads").insert([
        {
          qip: genQip(),
          name,
          contact: phone,
          role: ROLE_DB[role] ?? role,
          note: combinedNotes,
          status: "pending",
          needs_support: false,
        },
      ]);
      if (error) throw error;
      // 2. Bắn notification về Telegram (nếu đã cấu hình CHAT_ID)
      await sendTelegramNotification({ name, phone, role, capital, goal });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Có lỗi xảy ra khi gửi thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">

        {/* Nút đóng Popup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CỘT TRÁI: TÍN HIỆU, PHÂN TÍCH & CỘNG ĐỒNG — NỀN ĐEN SÂU, TƯƠNG PHẢN CAO */}
        <div className="md:col-span-5 bg-black p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Tín Hiệu Hệ Thống QiSignals
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Trung Tâm Phân Tích</h3>
            <p className="text-zinc-400 text-xs mb-6">Dữ liệu đồng thuận thời gian thực từ 6 Trợ lý AI độc quyền.</p>

            {/* Khối Tín hiệu & Phân tích nhanh */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Xu hướng XAU/USD</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">ĐỒNG THUẬN MUA 90%</span>
                </div>

                {/* Biểu đồ nến giả lập (SVG) — thay cho ảnh, không vỡ layout */}
                <svg viewBox="0 0 224 56" className="mb-2 h-16 w-full" preserveAspectRatio="none">
                  <line x1="0" y1="52" x2="224" y2="52" stroke="#27272a" strokeWidth="1" />
                  {CANDLES.map((k, i) => {
                    const top = Math.min(k.o, k.c);
                    const h = Math.max(Math.abs(k.o - k.c), 2);
                    const color = k.up ? "#10b981" : "#f43f5e";
                    return (
                      <g key={i}>
                        <line x1={k.x} y1={top - 6} x2={k.x} y2={top + h + 6} stroke={color} strokeWidth="1.5" />
                        <rect x={k.x - 4} y={top} width="8" height={h} rx="1" fill={color} />
                      </g>
                    );
                  })}
                </svg>

                <p className="text-sm text-zinc-200 font-medium">Nhận định sáng: Lực mua chủ đạo bứt phá vùng cản $2,415. Khuyến nghị canh nhịp giá thấp để mua lên, quản trị rủi ro chặt chẽ trước phiên Mỹ.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1 uppercase tracking-wider">
                  <Radio className="w-4 h-4 animate-pulse" /> Tiêu Điểm Tin Tức & Báo Cáo Thị Trường
                </div>
                <p className="text-xs text-zinc-300">Cung cấp thông tin chuyên sâu và phân tích tin tức tiêu điểm định kỳ 3 lần/ngày. Dự báo sớm các vùng biến động mạnh, hỗ trợ hệ thống Bot EA kích hoạt cơ chế ngắt mạch bảo toàn vốn (Kill-Switch) kịp thời trước các tin tức vĩ mô quan trọng.</p>
              </div>
            </div>
          </div>

          {/* Khối tham gia Cộng đồng */}
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Mạng Lưới Cộng Đồng Qi Prime</h4>
                <p className="text-xs text-zinc-400 mb-2">Không gian thảo luận chiến lược, chia sẻ kinh nghiệm và nhận tín hiệu lệnh cùng hàng ngàn nhà giao dịch chuyên nghiệp trong hệ sinh thái.</p>
                <a
                  href="https://t.me/congdongqiprime"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold hover:underline"
                >
                  Tham gia nhóm Telegram ngay <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM TRẮC NGHIỆM CHỌN NHANH */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center">
          {success ? (
            <div className="text-center py-8 animate-scale-in">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Đăng Ký Thành Công!</h3>
              <p className="text-zinc-400 max-w-sm mx-auto text-sm">Hệ thống đã ghi nhận lộ trình của bạn. Đội ngũ chuyên viên Qi Prime sẽ liên hệ hỗ trợ bạn kích hoạt tài khoản qua Zalo/Điện thoại trong ít phút.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Mở Khóa Lộ Trình Riêng</h3>
                <p className="text-zinc-400 text-xs">Vui lòng chọn nhanh các thông tin bên dưới để hệ thống cấu hình tài khoản phù hợp nhất.</p>
              </div>

              {/* 1. CHỌN VAI TRÒ CHÍNH (3 Nhánh Phễu) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">1. Lựa chọn vai trò định danh</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "trader", title: "Nhà giao dịch", desc: "Dùng thử EA 7 ngày miễn phí" },
                    { id: "investor", title: "Nhà đầu tư", desc: "Đăng ký Copy Trade" },
                    { id: "partner", title: "Đối tác", desc: "Mạng lưới Master IB" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setRole(item.id as any);
                        if (item.id === "trader") setGoal("Trải nghiệm thử Bot EA (7 ngày miễn phí)");
                        if (item.id === "investor") setGoal("Kết nối Copy Trade tự động");
                        if (item.id === "partner") setGoal("Hợp tác phát triển hệ sinh thái (Làm IB/Đối tác)");
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                        role === item.id
                          ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.15)]"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                      }`}
                    >
                      <div className={`text-sm font-bold ${role === item.id ? "text-emerald-300" : "text-white"}`}>{item.title}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
                      {role === item.id && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CHỌN MỨC VỐN DỰ KIẾN */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">2. Vốn đầu tư dự kiến</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {["Dưới 1,000 USD", "1,000 - 10,000 USD", "Trên 10,000 USD"].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setCapital(cap)}
                      className={`py-3 px-3 rounded-xl border-2 text-xs font-semibold text-center transition-all ${
                        capital === cap
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)]"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. CHỌN MỤC TIÊU CHÍNH */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">3. Mục tiêu chính của bạn</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500 transition-colors"
                >
                  <option>Trải nghiệm thử Bot EA (7 ngày miễn phí)</option>
                  <option>Kết nối Copy Trade tự động</option>
                  <option>Hợp tác phát triển hệ sinh thái (Làm IB/Đối tác)</option>
                </select>
              </div>

              {/* THÔNG TIN LIÊN HỆ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-900">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Số điện thoại (Zalo)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Xác Nhận & Nhận Lộ Trình Ngay"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
