import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  AlertCircle, 
  Globe, 
  CheckCircle,
  MessageSquare,
  Clock,
  ChevronLeft,
  Award,
  Sparkles,
  MousePointerClick
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";

// Sử dụng helper để tránh lỗi kiểm tra kiểu dữ liệu nghiêm ngặt của TypeScript nếu có
const db = supabase as any;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qi Prime x Ultima — Giải Pháp Entry Tự Động 6 AI Agents | Điểm Vào Lệnh Kỷ Luật" },
      { 
        name: "description", 
        content: "Trải nghiệm hệ thống tín hiệu tự động quét dòng tiền 24/7 từ 6 AI Agents, mang lại điểm entry kỷ luật chính xác tới 70%. Bắt đầu trải nghiệm miễn phí cùng sàn Ultima." 
      },
      { property: "og:title", content: "Qi Prime x Ultima — Phễu Entry AI Đột Phá" },
      { 
        property: "og:description", 
        content: "Loại bỏ cảm xúc giao dịch. Xác suất vào lệnh thành công 70%+ với hạ tầng VPS khớp lệnh tốc độ từ Ultima Markets." 
      },
      { property: "og:image", content: "/assets/ultima-partner-banner.jpg" },
    ],
  }),
  component: UltimaPartnershipPage,
});

// Danh sách 6 AI Agents dịch toàn bộ sang tiếng Việt cho Section 2
const AI_AGENTS = [
  {
    id: 1,
    name: "AI Agent 1 – AI Tín Hiệu",
    description: "Chuyên trách phân tích kỹ thuật chuyên sâu và đưa ra dự báo tín hiệu thị trường chính xác.",
    metric: "Tỷ Lệ Thắng 72%+",
    tag: "Kỹ Thuật Cốt Lõi"
  },
  {
    id: 2,
    name: "AI Agent 2 – Khối Quét Tin Vĩ Mô",
    description: "Theo dõi, bộ lọc và tổng hợp tin tức kinh tế toàn cầu theo thời gian thực để đón đầu biến động.",
    metric: "Tin tức < 1s",
    tag: "Vĩ Mô Toàn Cầu"
  },
  {
    id: 3,
    name: "AI Agent 3 – Khối Quản Trị Rủi Ro",
    description: "Tự động tính toán khối lượng lệnh, kiểm soát rủi ro nghiêm ngặt và quản lý vốn an toàn cho danh mục.",
    metric: "Sụt Giảm Vốn Tối Đa 15%",
    tag: "Lá Chắn Rủi Ro"
  },
  {
    id: 4,
    name: "AI Agent 4 – Khối Tối Ưu Bot",
    description: "Thiết lập, tối ưu hóa thuật toán và vận hành hệ thống Bot EA tự động khớp lệnh không độ trễ.",
    metric: "Khớp Lệnh < 5ms",
    tag: "Động Cơ EA Bot"
  },
  {
    id: 5,
    name: "AI Agent 5 – Khối Tín Hiệu Dòng Tiền",
    description: "Theo dõi chặt chẽ dấu vết dịch chuyển của dòng tiền lớn (Cá Voi/Cá Mập) trên thị trường.",
    metric: "Quét Sổ Lệnh Realtime",
    tag: "Dòng Tiền Cá Mập"
  },
  {
    id: 6,
    name: "AI Agent 6 – Khối Hỗ Trợ Khách Hàng 1-1",
    description: "Trợ lý thông minh hỗ trợ, tư vấn và chăm sóc khách hàng liên tục 24/7.",
    metric: "Hoạt Động 100%",
    tag: "Hỗ Trợ VIP"
  }
];

// Giá mặc định ban đầu cho thanh ticker (hiển thị ngay trước khi API trả về, tránh nháy 0)
const DEFAULT_RATES = {
  xau: 4150,
  xauDiff: 0,
  eur: 1.0895,
  eurDiff: 0
};

function generateQip() {
  return "QIP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

/* =====================================================================================
 * KHỐI HIỆU ỨNG CHUYỂN ĐỘNG (MOTION LAYER) — Thêm mới, không ảnh hưởng logic gốc
 * ===================================================================================== */

/**
 * Hook phát hiện phần tử lọt vào khung nhìn (IntersectionObserver).
 * Dùng cho Scroll Reveal & kích hoạt vẽ biểu đồ. Chỉ chạy 1 lần rồi tự ngắt để tối ưu.
 */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Tôn trọng người dùng tắt hiệu ứng chuyển động
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px", ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/**
 * Bọc phần tử để tạo hiệu ứng Fade-in + Slide-up khi cuộn tới.
 * Dùng transform + opacity (GPU-friendly) nên không làm giảm tốc độ tải trang.
 */
function Reveal({
  children,
  delay = 0,
  y = 24,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

/**
 * Thẻ có hiệu ứng nghiêng 3D nhẹ theo con trỏ + phát sáng viền/nền theo vị trí chuột.
 * Ghi trực tiếp vào style qua ref (không setState) để giữ 60fps, tránh re-render.
 */
function TiltCard({
  children,
  className = "",
  glow = "rgba(198,255,0,0.16)"
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 7; // độ nghiêng theo trục X
    const ry = (px - 0.5) * 7; // độ nghiêng theo trục Y
    el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-op", "1");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    el.style.setProperty("--glow-op", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`relative transition-transform duration-200 ease-out will-change-transform motion-reduce:transform-none ${className}`}
      style={{ transformStyle: "preserve-3d" } as React.CSSProperties}
    >
      {/* Lớp phát sáng viền theo con trỏ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: "var(--glow-op, 0)" as any,
          background: `radial-gradient(220px circle at var(--mx,50%) var(--my,50%), ${glow}, transparent 65%)`
        }}
      />
      <div className="relative" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Nền Canvas: các hạt sáng trôi chậm + nối mạng lưới (network mesh) cho Hero.
 * Tự dọn dẹp animation frame, tạm dừng khi tab ẩn, và tắt khi prefers-reduced-motion.
 */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    const build = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Mật độ hạt tỉ lệ theo diện tích, giới hạn tối đa để nhẹ máy
      const count = Math.min(70, Math.round((width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Vẽ đường nối mạng lưới giữa các hạt ở gần nhau
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const op = (1 - dist / 120) * 0.22;
            ctx.strokeStyle = `rgba(198,255,0,${op})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Vẽ các hạt sáng
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(198,255,0,0.55)";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const stop = () => cancelAnimationFrame(raf);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      build();
    };

    build();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
    />
  );
}

function UltimaPartnershipPage() {
  // Trạng thái bước hiển thị cách tính tín hiệu của Qi Prime
  const [signalStep, setSignalStep] = useState<1 | 2 | 3 | 4>(1);
  const [toggleSubSignal, setToggleSubSignal] = useState<"sell" | "buy">("sell");

  // Chỉ số slide của agent đang hoạt động cho Section 2 (Mobile Swiper)
  const [activeAgentIdx, setActiveAgentIdx] = useState(0);

  // Thông số tỷ giá cho thanh ticker — khởi tạo bằng giá mặc định, sau đó nạp realtime từ Binance
  const [rates, setRates] = useState(DEFAULT_RATES);

  // Trạng thái khan hiếm (số suất và bộ đếm ngược)
  const [slotsLeft, setSlotsLeft] = useState(31);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút đếm ngược

  // Trạng thái hiển thị nút Sticky CTA khi cuộn trang
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Trạng thái form đăng ký
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const section2Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);

  // Hàm hỗ trợ cuộn mượt đến phần mong muốn
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 1. Tự động giảm số suất đăng ký còn lại (tối thiểu là 7 để giữ tính khan hiếm thực tế)
  useEffect(() => {
    const storedSlots = localStorage.getItem("ultima_slots_left");
    if (storedSlots) {
      setSlotsLeft(Number(storedSlots));
    }

    const interval = setInterval(() => {
      setSlotsLeft((prev) => {
        if (prev <= 7) return prev;
        const nextVal = prev - (Math.random() > 0.6 ? 1 : 0);
        localStorage.setItem("ultima_slots_left", String(nextVal));
        return nextVal;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // 2. Bộ đếm ngược thời gian ưu đãi
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Nạp tỷ giá realtime cho thanh ticker từ Binance (nguồn dữ liệu mở, public, không cần API key)
  //    XAU dùng PAXGUSDT (token vàng quy đổi 1:1 theo ounce, giá bám sát vàng giao ngay) làm giá tham chiếu.
  useEffect(() => {
    let cancelled = false;

    const fetchRates = async () => {
      try {
        const [xauRes, eurRes] = await Promise.all([
          fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT"),
          fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=EURUSDT"),
        ]);
        if (!xauRes.ok || !eurRes.ok) return;
        const [xauData, eurData] = await Promise.all([xauRes.json(), eurRes.json()]);
        if (cancelled) return;

        setRates({
          xau: Number(Number(xauData.lastPrice).toFixed(2)),
          xauDiff: Number(Number(xauData.priceChangePercent).toFixed(2)),
          eur: Number(Number(eurData.lastPrice).toFixed(4)),
          eurDiff: Number(Number(eurData.priceChangePercent).toFixed(2)),
        });
      } catch {
        // Mạng lỗi hoặc API bị chặn: giữ nguyên giá trị hiện tại, không làm vỡ giao diện
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // 4. Lắng nghe cuộn trang để hiển thị nút Sticky CTA (khi bắt đầu cuộn qua Section 1)
  useEffect(() => {
    const handleScroll = () => {
      if (section2Ref.current) {
        const rect = section2Ref.current.getBoundingClientRect();
        setShowStickyCta(rect.top <= 120);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý gửi form đăng ký
  const TELEGRAM_BOT_TOKEN = "8736867683:AAFLb9Q4vKBn2Mtsj5PNuZjnQpIxkO1kYFU";
  const TELEGRAM_CHAT_ID = "-4184693630";

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const qipCode = generateQip();
    const noteContent = `[Chiến dịch: Phễu Entry AI Qi x Ultima] | [Đăng ký suất Mobile-First]`;

    try {
      // 1. Lưu thông tin vào Supabase
      const { error } = await db.from("cms_leads").insert([
        {
          qip: qipCode,
          name,
          contact: phone,
          role: "copy",
          note: noteContent,
          status: "pending",
          needs_support: true
        }
      ]);
      if (error) throw error;

      // 2. Gửi thông báo đến Telegram admin
      const teleMsg = `
🚀 <b>SUẤT TRẢI NGHIỆM QI x ULTIMA MỚI!</b>
----------------------------------
👤 <b>Họ tên:</b> ${name}
📞 <b>Số điện thoại / Tele:</b> ${phone}
🆔 <b>Mã QIP:</b> ${qipCode}
🌍 <b>Nguồn:</b> Landing Page Entry Funnel (Mobile-First)
----------------------------------
🤖 <i>Hệ thống tự động Qi Prime</i>
      `;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: teleMsg,
          parse_mode: "HTML"
        })
      });

      setSuccess(true);
      toast.success("Kích hoạt suất trải nghiệm thành công!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Không thể xử lý yêu cầu, vui lòng kiểm tra kết nối mạng.");
      toast.error("Đăng ký không thành công, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Vẽ biểu tượng SVG chính thức của thương hiệu Ultima (2 cột song song màu xanh Lime)
  const UltimaLogoSVG = () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="flex-shrink-0 text-[#C6FF00]">
      {/* Cột xiên bên trái (Màu Xanh Chanh) */}
      <path d="M6 10 L15 14 L15 30 L6 26 Z" fill="currentColor" />
      {/* Cột xiên bên phải (Màu Xanh Chanh) */}
      <path d="M17 6 L26 10 L26 26 L17 22 Z" fill="currentColor" />
    </svg>
  );

  // Logo Qi Prime chính thức — dùng đúng file ảnh nhận diện thương hiệu thay vì SVG vẽ tay
  const QiPrimeLogoSVG = () => (
    <div className="flex items-center gap-2">
      <img
        src="/assets/qiprime-icon.png"
        alt="Qi Prime"
        width={32}
        height={32}
        className="h-8 w-8 object-contain flex-shrink-0"
      />
      <span
        className="font-black tracking-widest text-lg font-display uppercase text-[#F5F5F5]"
        style={{ 
          textShadow: "0 0 10px rgba(245, 245, 245, 0.7), 0 0 20px rgba(245, 245, 245, 0.3)" 
        }}
      >
        QI PRIME
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-[#C6FF00]/30 selection:text-slate-900 pb-20 md:pb-0">
      <Toaster
        theme="light"
        position="top-center"
        offset={{ top: 96 }}
        mobileOffset={{ top: 76 }}
      />

      {/* Real-time Ticker Bar (Màu sáng) */}
      <div className="bg-slate-100 border-b border-slate-200 py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap text-xs md:text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF00] animate-pulse"></span>
            <span className="font-semibold text-slate-700">QiSignals Trực Tiếp:</span>
          </div>
          <div className="flex gap-6 items-center flex-1 justify-end font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">VÀNG (XAU/USD):</span>
              <span className="font-bold text-slate-900">${rates.xau.toLocaleString()}</span>
              <span className={`font-bold ${rates.xauDiff >= 0 ? "text-[#C6FF00]" : "text-rose-600"}`}>
                {rates.xauDiff >= 0 ? "+" : ""}{rates.xauDiff}%
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-300 pl-6">
              <span className="text-slate-500">EUR/USD:</span>
              <span className="font-bold text-slate-900">{rates.eur}</span>
              <span className={`font-bold ${rates.eurDiff >= 0 ? "text-[#C6FF00]" : "text-rose-600"}`}>
                {rates.eurDiff >= 0 ? "+" : ""}{rates.eurDiff}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header/Navbar (Nền tối để làm nổi bật logo phát sáng) */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-zinc-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Qi Prime */}
            <a href="/" className="block">
              <QiPrimeLogoSVG />
            </a>
            <span className="h-5 w-px bg-zinc-800"></span>
            
            {/* Logo Thương Hiệu Ultima */}
            <div className="flex items-center gap-1.5">
              <UltimaLogoSVG />
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-widest text-white leading-none font-display">ULTIMA</span>
                <span className="text-[7.5px] tracking-wider text-[#C6FF00] leading-none font-bold">MARKETS</span>
              </div>
            </div>
          </div>

          <div>
            <button 
              onClick={() => scrollToRef(section4Ref)}
              className="bg-[#C6FF00] hover:bg-[#C6FF00]/90 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              Nhận Suất Free
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO SECTION – ENTRY FOCUS (Nền sáng, Screen 1) */}
      <section className="relative min-h-0 sm:min-h-[calc(100vh-100px)] flex items-center py-10 sm:py-12 md:py-24 border-b border-slate-200/50 overflow-hidden bg-white">
        {/* Nền Canvas hạt sáng + mạng lưới trôi chậm — hiệu ứng cao cấp */}
        <ParticleField />

        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[#C6FF00]/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-blue-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột trái: Nội dung Hero */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 flex flex-col justify-center">
            <Reveal delay={0} y={16} className="lg:mx-0 mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                Tử Huyệt Của 90% Nhà Giao Dịch
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight font-display tracking-tight uppercase">
                90% thất bại của trader bắt nguồn từ một <span className="text-[#C6FF00] bg-gradient-to-r from-[#C6FF00] to-[#C6FF00]/70 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(198,255,0,0.35)]">Entry sai lầm.</span>
              </h1>
            </Reveal>

            <Reveal delay={180} className="px-3 sm:px-0">
              <p className="text-sm sm:text-base md:text-lg text-slate-700 font-medium leading-7 sm:leading-8 text-balance">
                Toàn bộ tinh hoa của phân tích kỹ thuật suy cho cùng đều tập trung vào việc tìm kiếm một vùng vào lệnh hoàn hảo. Một Entry đẹp chính là chìa khóa vạn năng giúp bạn siết chặt rủi ro và đẩy xác suất thắng của Setup lên tới 80%. Vào lệnh có bài bản, dứt khoát loại bỏ FOMO!
              </p>
            </Reveal>

            <Reveal delay={270} className="lg:mx-0 mx-auto w-full max-w-md">
              <div className="pt-6">
                <button 
                  onClick={() => scrollToRef(section4Ref)}
                  className="w-full bg-[#C6FF00] hover:bg-[#C6FF00]/95 text-slate-950 font-black text-sm sm:text-base px-8 py-4 sm:py-4.5 rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_5px_0_0_rgba(15,60,30,0.35),0_10px_24px_-6px_rgba(198,255,0,0.55)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_rgba(15,60,30,0.35),0_14px_28px_-6px_rgba(198,255,0,0.6)] active:translate-y-1 active:shadow-[0_1px_0_0_rgba(15,60,30,0.35),0_4px_10px_-4px_rgba(198,255,0,0.5)]"
                >
                  <MousePointerClick className="w-5 h-5 animate-bounce" />
                  Trải nghiệm Entry AI Miễn Phí Ngay
                </button>
              </div>
            </Reveal>

            {/* Huy hiệu thông số hệ thống */}
            <Reveal delay={360}>
              <div className="pt-8 flex justify-center lg:justify-start items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#C6FF00]" /> Phòng Hộ Sụt Giảm Vốn 15%</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4 text-[#C6FF00]" /> Hạ Tầng Sàn Ultima</span>
              </div>
            </Reveal>
          </div>

          {/* Cột phải: Màn hình biểu đồ kỹ thuật (nến) — không khí trading chuyên nghiệp */}
          <div className="lg:col-span-5 flex justify-center px-6 sm:px-0">
            <Reveal delay={200} y={40} className="w-full flex justify-center">
              <TiltCard glow="rgba(198,255,0,0.25)">
                <img
                  src="/assets/nen.jpg"
                  alt="Biểu đồ nến kỹ thuật Qi Prime"
                  className="w-full max-w-[280px] sm:max-w-[380px] h-auto object-cover rounded-2xl shadow-[0_0_50px_rgba(198,255,0,0.15)] border border-white/10 mx-auto"
                />
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 2: BREAKTHROUGH SOLUTION – 6 AI AGENTS (Nền sáng, Screen 2) */}
      <section ref={section2Ref} className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 md:mb-16">
            <Reveal className="lg:col-span-8">
              <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 space-y-3">
                <span className="text-xs font-bold text-[#C6FF00] uppercase tracking-widest font-mono">Giải Pháp Đột Phá Từ AI</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display text-balance uppercase">
                  Xóa Bỏ Định Kiến Cảm Tính – Thiết Lập Tiêu Chuẩn Vào Lệnh Xác Suất 70%
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm text-balance leading-relaxed">
                  Qi Prime thay thế toàn bộ yếu tố tâm lý con người bằng một hạ tầng phân tích nghiêm ngặt. Hệ thống 6 AI Agents độc lập hoạt động realtime 24/7, quét sâu và xử lý dữ liệu toàn diện trên mọi khung thời gian. Chúng tôi không dự đoán thị trường, chúng tôi bắt thị trường phải đưa ra những xác nhận cốt lõi và rõ ràng nhất trước khi giải ngân.
                </p>
              </div>
            </Reveal>
            {/* Mascot Qi Bot — chuyển từ Hero xuống làm hình ảnh bổ trợ trực quan cho khối 6 AI Agents */}
            <Reveal delay={150} y={30} className="lg:col-span-4 flex justify-center px-10 sm:px-16 lg:px-0">
              <TiltCard glow="rgba(198,255,0,0.22)">
                <img
                  src="/assets/Mascot.png"
                  alt="Qi Bot Mascot — 6 AI Agents"
                  className="w-full max-w-[180px] sm:max-w-[220px] h-auto object-contain rounded-2xl shadow-[0_0_40px_rgba(198,255,0,0.15)] border border-white/10 mx-auto"
                />
              </TiltCard>
            </Reveal>
          </div>

          {/* Hiển thị dạng lưới trên Desktop (Bị ẩn trên Mobile) — thêm Tilt 3D + phát sáng viền */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_AGENTS.map((agent, i) => (
              <Reveal key={agent.id} delay={i * 80}>
                <TiltCard className="h-full">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#C6FF00]/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-[#C6FF00]/5 h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#C6FF00] bg-[#C6FF00]/15 px-2 py-0.5 rounded-full tracking-wider uppercase font-mono">{agent.tag}</span>
                        <span className="text-xs text-slate-400 font-mono">Đặc vụ #0{agent.id}</span>
                      </div>
                      <h3 className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#C6FF00] transition-colors">{agent.name}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{agent.description}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 mt-6 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Thông số kỹ thuật:</span>
                      <span className="font-bold text-slate-800 font-mono">{agent.metric}</span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* Hiển thị dạng Slide/Carousel vuốt ngang (Chỉ hiển thị trên Mobile) */}
          <div className="md:hidden space-y-6">
            {/* Thẻ trượt hiển thị chi tiết */}
            <div className="p-6 rounded-2xl bg-white border border-[#C6FF00]/20 shadow-md space-y-4 min-h-[190px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-[#C6FF00] bg-[#C6FF00]/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {AI_AGENTS[activeAgentIdx].tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Đặc vụ #0{AI_AGENTS[activeAgentIdx].id}</span>
                </div>
                <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{AI_AGENTS[activeAgentIdx].name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{AI_AGENTS[activeAgentIdx].description}</p>
              </div>
              <div className="pt-3.5 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400">Thông số hiệu suất:</span>
                <span className="font-bold text-[#C6FF00] font-mono">{AI_AGENTS[activeAgentIdx].metric}</span>
              </div>
            </div>

            {/* Các nút bấm điều khiển kích thước lớn (Vùng quét ngón cái) */}
            <div className="flex justify-between items-center gap-4 px-2">
              <button 
                onClick={() => setActiveAgentIdx(prev => (prev > 0 ? prev - 1 : AI_AGENTS.length - 1))}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 active:bg-slate-100 flex-1 flex justify-center items-center shadow-sm"
                aria-label="Slide trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Các dấu chấm vị trí Slide */}
              <div className="flex gap-1.5 justify-center items-center px-2">
                {AI_AGENTS.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeAgentIdx ? "w-3 bg-[#C6FF00]" : "bg-slate-300"}`}
                  ></span>
                ))}
              </div>

              <button 
                onClick={() => setActiveAgentIdx(prev => (prev < AI_AGENTS.length - 1 ? prev + 1 : 0))}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 active:bg-slate-100 flex-1 flex justify-center items-center shadow-sm"
                aria-label="Slide sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: QI PRIME & ULTIMA COOPERATION INTRODUCTION (Nền sáng) */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/50 relative">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-[#C6FF00] uppercase tracking-widest font-mono">Bảo Chứng Uy Tín & Chất Lượng</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display uppercase">
                Hợp Tác Chiến Lược: Qi Prime x Ultima Markets
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm text-balance">
                Khám phá sức mạnh cộng hưởng giữa giải pháp giao dịch trí tuệ nhân tạo hàng đầu và hạ tầng sàn giao dịch đạt nhiều giải thưởng quốc tế.
              </p>
            </div>
          </Reveal>

          {/* Nội dung dàn phẳng, cuộn dọc liên tục — đã bỏ hệ thống Tab điều hướng */}
          <div className="space-y-16 pt-2">
            {/* KHỐI 1: Cặp đôi song hành Qi Prime x Ultima Markets */}
            <Reveal delay={100} y={20}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Qi Prime Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-[#C6FF00]/30 transition-all shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-950 px-3.5 py-2 rounded-xl inline-flex items-center shadow-md border border-zinc-800">
                        <QiPrimeLogoSVG />
                      </div>
                      <span className="text-xs font-bold text-[#C6FF00] bg-[#C6FF00]/15 px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">Đơn Vị Công Nghệ</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      <strong>Qi Prime</strong> là tổ chức công nghệ hàng đầu phát triển hệ sinh thái giao dịch tự động. Trục cốt lõi dựa trên 6 AI Agents giám sát dòng tiền lớn và phòng hộ tài khoản theo chuẩn quản trị rủi ro thể chế.
                    </p>
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-800 block">Thế mạnh cốt lõi:</span>
                      <ul className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> 6 AI Agents đồng thuận phân tích 70%+</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Quản trị rủi ro tự động (MDD Floor)</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Tín hiệu chuẩn xác và hệ thống Copy Trade 1:1</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ultima Markets Card — khung bọc logo đối xứng tuyệt đối với Qi Prime */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-[#C6FF00]/30 transition-all shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-950 px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-md border border-zinc-800">
                        <UltimaLogoSVG />
                        <span className="text-xs font-black tracking-widest text-white leading-none font-display">ULTIMA</span>
                      </div>
                      <span className="text-xs font-bold text-[#C6FF00] bg-[#C6FF00]/15 px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">Đại Diện Hạ Tầng</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      <strong>Ultima Markets</strong> là nhà môi giới tài chính toàn cầu được cấp phép. Cung cấp nền tảng giao dịch thanh khoản sâu chuẩn thể chế với tốc độ khớp lệnh cực cao và an toàn tài khoản ký quỹ tuyệt đối.
                    </p>
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-800 block">Thế mạnh cốt lõi:</span>
                      <ul className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Khớp lệnh siêu tốc dưới 5ms qua VPS</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Chênh lệch giá mua bán (spread) cực thấp</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Quản lý tài khoản ký quỹ tách biệt an toàn</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* KHỐI 2: Hành trình phát triển — 10 Năm Kiến Tạo Niềm Tin */}
            <Reveal delay={200} y={30}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Ảnh Banner 10 năm bản tiếng Việt */}
                <TiltCard glow="rgba(198,255,0,0.2)" className="w-full">
                  <img
                    src="/assets/ultima-10-years-vn.jpg"
                    alt="Ultima Markets 10 Năm Kiến Tạo Niềm Tin"
                    className="w-full h-auto object-cover rounded-2xl shadow-[0_0_50px_rgba(198,255,0,0.15)] border border-white/10"
                  />
                </TiltCard>
                {/* Lời tự sự hành trình */}
                <div className="space-y-5">
                  <span className="text-xs font-bold text-[#C6FF00] uppercase tracking-widest font-mono">Kỷ Niệm Hành Trình 10 Năm</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">10 Năm Kiến Tạo Niềm Tin — Hướng Đến Tương Lai</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Trải qua một thập kỷ hình thành và phát triển bền vững, Ultima Markets đã khẳng định vị thế vững chắc của mình trên thị trường tài chính thế giới. Sự kiện 10 năm kiến tạo niềm tin minh chứng cho cam kết về tính minh bạch, an toàn và hiệu năng công nghệ mà Ultima dành cho khách hàng.
                  </p>

                  {/* Trustpilot Score Badge */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <img src="/assets/ultima-trustpilot.png" alt="Trustpilot Great Score" className="h-8 w-auto object-contain rounded-lg" />
                      <p className="text-[10px] text-slate-500 font-medium">Đánh giá cực tốt dựa trên 585+ lượt bình luận thực tế.</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-black text-slate-800 font-mono">4.1 / 5</span>
                      <span className="text-[9px] text-slate-400 block font-bold font-mono">TRUST SCORE</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* KHỐI 3: Vinh danh & Chứng nhận Giải thưởng */}
            <Reveal delay={300} y={30}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Danh sách giải thưởng */}
                <div className="space-y-4 text-left">
                  <span className="text-xs font-bold text-[#C6FF00] uppercase tracking-widest font-mono block mb-2">Brands Review Magazine Awards 2026</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Các Hạng Mục Vinh Danh Danh Giá</h3>

                  <div className="space-y-3">
                    {[
                      "Nhà môi giới Forex tốt nhất Châu Á 2026",
                      "Giải thưởng Nhà cung cấp công nghệ giao dịch sáng tạo nhất Châu Á 2026",
                      "Nhà môi giới minh bạch và đáng tin cậy nhất Châu Á 2026",
                      "Nhà môi giới hỗ trợ phát triển đối tác tốt nhất Châu Á 2026",
                      "Nhà môi giới có nền tảng đào tạo giao dịch tốt nhất toàn cầu 2026"
                    ].map((award, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm">
                        <span className="p-1 bg-[#C6FF00]/15 text-[#C6FF00] rounded-full mt-0.5 flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                        </span>
                        <span className="text-slate-700 font-medium">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Ảnh chứng nhận giải thưởng */}
                <TiltCard glow="rgba(198,255,0,0.2)" className="w-full max-w-sm mx-auto">
                  <img
                    src="/assets/ultima-awards-2026-poster.jpg"
                    alt="Brands Review Magazine Awards 2026 Certificate"
                    className="w-full h-auto object-cover rounded-2xl shadow-[0_0_50px_rgba(198,255,0,0.15)] border border-white/10"
                  />
                </TiltCard>
              </div>
            </Reveal>
          </div>

          {/* Khối tóm tắt cộng hưởng thế mạnh */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <p className="text-slate-600 text-xs sm:text-sm text-balance sm:text-left text-center">
              💡 <strong>Cộng hưởng hoàn hảo:</strong> Hệ thống tín hiệu thông minh của <strong>Qi Prime</strong> (Bộ Não) chạy trực tiếp trên máy chủ VPS kết nối siêu tốc tới cổng thanh khoản của <strong>Ultima</strong> (Thể Chất), giúp thực thi lệnh chính xác và tránh tối đa trượt giá!
            </p>
            <button 
              onClick={() => scrollToRef(section4Ref)}
              className="bg-[#C6FF00] hover:bg-[#C6FF00]/90 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all whitespace-nowrap active:scale-95 shadow-sm"
            >
              Kích Hoạt Suất Free
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: MINH CHỨNG TRỰC QUAN – QUY TRÌNH AI THỰC TẾ (gọn, real screenshots) */}
      <section className="py-14 md:py-16 bg-slate-50 relative overflow-hidden border-b border-slate-200/20">
        <div className="max-w-6xl mx-auto px-4 relative">
          <Reveal>
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold text-[#C6FF00] uppercase tracking-widest font-mono">Minh Chứng Trực Quan</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display uppercase">
                Quy Trình Phân Tích & Phát Tín Hiệu AI Thực Tế
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Nhấp vào từng bước để xem ảnh chụp màn hình thực tế từ ứng dụng phân tích Qi Prime và kênh đẩy lệnh Telegram tự động.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                {/* Left Column: Interactive Steps (Thumb Zone) */}
                <div className="md:col-span-7 space-y-2.5">
                  {[
                    {
                      step: 1,
                      title: "Bước 1: Quét Lọc Xu Hướng & Động Lượng",
                      desc: "Lớp lọc Layer 1 (Trend Gate) xác định xu hướng tăng/giảm qua EMA21/50/200 và Layer 3 (Stochastic Trigger) đo lường vùng quá mua/quá bán."
                    },
                    {
                      step: 2,
                      title: "Bước 2: Bóc Tách Khối Lượng Dòng Tiền",
                      desc: "Layer 4 (Order Flow) quét số lệnh, tính toán Delta mua bán, đo lường lực tấn công của phe bán (Seller Attack) hoặc mua để xác nhận điểm đảo chiều."
                    },
                    {
                      step: 3,
                      title: "Bước 3: AI Tự Động Phân Tích & Xuất Tín Hiệu",
                      desc: "Động cơ Intelligent Flow Engine v2.0 tổng hợp điểm số AI Score và xuất ra nút lệnh hành động (MUA/BÁN) đi kèm điểm cắt lỗ, chốt lời cụ thể."
                    },
                    {
                      step: 4,
                      title: "Bước 4: Đẩy Tín Hiệu Qua Telegram Tức Thì",
                      desc: "Hệ thống aibot tự động chuyển đổi thông số kỹ thuật thành tin nhắn thông báo gửi thẳng đến kênh Telegram của thành viên chỉ trong 1 giây."
                    }
                  ].map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setSignalStep(item.step as any)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all active:scale-[0.99] flex gap-3 ${
                        signalStep === item.step
                          ? "border-[#C6FF00] bg-[#C6FF00]/10 text-slate-900 shadow-sm"
                          : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${
                        signalStep === item.step ? "bg-[#C6FF00] text-slate-950" : "bg-slate-200 text-slate-600"
                      }`}>
                        {item.step}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Column: Phone Mockup Container */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-[260px] aspect-[9/19] rounded-[32px] border-8 border-slate-900 bg-slate-950 overflow-hidden shadow-xl ring-4 ring-slate-100/50">
                    {/* Notch area */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-20"></div>

                    {/* Dynamic Screenshot with smooth fade transition */}
                    <div className="w-full h-full relative z-10 select-none bg-black">
                      <img
                        src="/assets/signals-app-layer13.jpg"
                        alt="Trend Gate & Stochastic Indicator"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${signalStep === 1 ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                      />
                      <img
                        src="/assets/signals-app-layer4.jpg"
                        alt="Order Flow Analysis"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${signalStep === 2 ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                      />

                      {/* Step 3 has Buy/Sell toggle subsignal */}
                      <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${signalStep === 3 ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                        {/* Sell/Buy sub-toggle button */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/80 backdrop-blur px-2.5 py-1.5 rounded-lg flex gap-1.5 border border-slate-800 text-[10px]">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setToggleSubSignal("sell"); }}
                            className={`px-2 py-0.5 rounded font-bold transition-all ${toggleSubSignal === "sell" ? "bg-red-500 text-white" : "text-zinc-400"}`}
                          >
                            BÁN (SELL)
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setToggleSubSignal("buy"); }}
                            className={`px-2 py-0.5 rounded font-bold transition-all ${toggleSubSignal === "buy" ? "bg-[#C6FF00] text-slate-950" : "text-zinc-400"}`}
                          >
                            MUA (BUY)
                          </button>
                        </div>
                        <img
                          src="/assets/signals-app-sell.jpg"
                          alt="AI Signal Sell"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${toggleSubSignal === "sell" ? "opacity-100" : "opacity-0"}`}
                        />
                        <img
                          src="/assets/signals-app-buy.jpg"
                          alt="AI Signal Buy"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${toggleSubSignal === "buy" ? "opacity-100" : "opacity-0"}`}
                        />
                      </div>

                      <img
                        src="/assets/signals-tele-post.jpg"
                        alt="Telegram Channel Signals Post"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${signalStep === 4 ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4: EXCLUSIVE OFFER & SCARCITY FORM (Nền sáng, Screen 4) */}
      <section ref={section4Ref} className="py-20 md:py-28 bg-white relative overflow-hidden border-b border-slate-200/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#C6FF00]/5 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto px-4 relative space-y-8">
          <Reveal>
            <div className="text-center space-y-4">
              <span className="text-xs font-bold text-[#C6FF00] uppercase tracking-widest font-mono block">CƠ HỘI ĐỘC QUYỀN</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display uppercase leading-tight text-balance">
                Cơ Hội Trải Nghiệm Hệ Sinh Thế Qi Prime Khép Kín Cùng Hạ Tầng Ultima
              </h2>
              <div className="inline-block bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl">
                <span className="text-xs sm:text-sm font-black text-rose-600 uppercase tracking-widest animate-pulse font-mono block">
                  🚨 CHỈ DÀNH CHO 100 SUẤT ĐĂNG KÝ ĐẦU TIÊN
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto text-balance">
                Cơ hội trải nghiệm trọn vẹn sức mạnh phân tích của 6 AI Agents Qi Prime kết hợp hoàn hảo cùng hạ tầng giao dịch thanh khoản cao của Ultima Markets hoàn toàn miễn phí.
              </p>
            </div>
          </Reveal>

          {/* Các đồng hồ đếm ngược và thanh đo số suất còn lại */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {/* Số suất giảm dần */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Tình Trạng Suất</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono block">
                Chỉ còn <span className="underline animate-pulse">{slotsLeft}</span> suất
              </span>
            </div>
            
            {/* Thời gian ưu đãi còn lại */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Thời Gian Còn Lại</span>
              <span className="text-xl sm:text-2xl font-black text-[#C6FF00] font-mono block">
                {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Form đăng ký tối giản */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex p-3 rounded-full bg-[#C6FF00]/20 text-[#C6FF00] border border-[#C6FF00]/30 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Yêu Cầu Đã Được Ghi Nhận!</h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                  Chúng tôi đã giữ lại 1 suất trải nghiệm miễn phí cho bạn. Đội ngũ chuyên viên hỗ trợ sẽ liên hệ trực tiếp qua số <strong>{phone}</strong> trong vài phút tới để hướng dẫn kích hoạt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Nhập Tên */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">HỌ VÀ TÊN *</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#C6FF00] outline-none transition-colors"
                    />
                  </div>

                  {/* Nhập SĐT / Telegram */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">SỐ ĐIỆN THOẠI / TELEGRAM *</label>
                    <input 
                      type="text" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ví dụ: 0912345678 hoặc @username"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#C6FF00] outline-none transition-colors"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 text-xs rounded-xl bg-red-50/50 border border-red-200 text-red-650 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Nút gửi form trong vùng quét ngón cái */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#C6FF00] hover:bg-[#C6FF00]/95 active:scale-[0.98] text-slate-950 font-bold text-sm uppercase transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_0_0_rgba(15,60,30,0.35),0_8px_20px_-6px_rgba(198,255,0,0.5)] active:shadow-[0_1px_0_0_rgba(15,60,30,0.35)] mt-6"
                >
                  {submitting ? "Đang xử lý..." : "KÍCH HOẠT SUẤT TRẢI NGHIỆM MIỄN PHÍ"}
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </button>

                <p className="text-[10px] text-slate-400 text-center mt-2">
                  🔒 Thông tin được bảo mật tuyệt đối theo tiêu chuẩn mã hóa SSL/TLS.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer (Nền tối đồng bộ với Header) */}
      <footer className="bg-slate-950 border-t border-zinc-900 py-12 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <QiPrimeLogoSVG />
              <span className="h-4 w-px bg-zinc-800"></span>
              <div className="flex items-center gap-1.5">
                <UltimaLogoSVG />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-white font-display">ULTIMA</span>
                  <span className="text-[7px] tracking-wider text-[#C6FF00] font-bold font-mono">MARKETS</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 text-zinc-300 font-semibold">
              <a href="#" className="hover:text-[#C6FF00] transition-colors">Điều Khoản Dịch Vụ</a>
              <a href="#" className="hover:text-[#C6FF00] transition-colors">Chính Sách Bảo Mật</a>
              <a href="#" className="hover:text-[#C6FF00] transition-colors">Miễn Trừ Trách Nhiệm</a>
            </div>
          </div>

          <div className="space-y-3 max-w-4xl leading-relaxed text-slate-500">
            <p>
              <strong>Cảnh báo rủi ro:</strong> Giao dịch hợp đồng chênh lệch (CFD), ngoại hối (Forex) và vàng (XAUUSD) trên tài khoản có đòn bẩy ký quỹ mang lại mức độ rủi ro cao đối với nguồn vốn và có thể không phù hợp với tất cả các nhà đầu tư. Lịch sử hiệu suất trong quá khứ không phải là thước đo đáng tin cậy cho kết quả trong tương lai. Qi Prime cung cấp hạ tầng công nghệ và tín hiệu hỗ trợ giao dịch, không thực hiện hành vi ủy thác đầu tư hoặc cam kết bao lỗ tuyệt đối ngoài thiết lập rủi ro tự động mà khách hàng chọn lựa.
            </p>
            <p className="text-[11px] text-slate-400">
              © 2026 Hợp tác chiến lược Qi Prime x Ultima Markets. Bản quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA BUTTON (Cố định ở đáy màn hình trên di động khi cuộn xuống) */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 md:hidden animate-slide-up">
          <button
            onClick={() => scrollToRef(section4Ref)}
            className="w-full py-3.5 rounded-xl bg-[#C6FF00] text-slate-950 font-black text-sm uppercase active:scale-[0.97] shadow-md shadow-[#C6FF00]/20 flex items-center justify-center gap-1.5 transition-transform"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-slate-950" />
            Đăng ký nhận 1 trong 100 suất miễn phí
          </button>
        </div>
      )}
    </div>
  );
}
