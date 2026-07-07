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

// Danh sách lệnh chạm TP mẫu được dịch sang tiếng Việt
const INITIAL_TRADES = [
  { pair: "XAUUSD", side: "MUA", price: 2382.40, tp: 2388.90, pips: 65, time: "2 phút trước" },
  { pair: "EURUSD", side: "BÁN", price: 1.0895, tp: 1.0868, pips: 27, time: "5 phút trước" },
  { pair: "GBPUSD", side: "MUA", price: 1.2725, tp: 1.2760, pips: 35, time: "9 phút trước" },
  { pair: "XAUUSD", side: "BÁN", price: 2391.20, tp: 2384.80, pips: 64, time: "15 phút trước" }
];

// Định nghĩa thông số tỷ giá cho thanh ticker chạy realtime ở đầu trang
const rates = {
  xau: 2382.40,
  xauDiff: 0.45,
  eur: 1.0895,
  eurDiff: -0.12
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
  glow = "rgba(16,185,129,0.16)"
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
            ctx.strokeStyle = `rgba(16,185,129,${op})`;
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
        ctx.fillStyle = "rgba(16,185,129,0.55)";
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
  // Trạng thái tab hiển thị phần Hợp tác đối tác (Mặc định: synergy)
  const [coopTab, setCoopTab] = useState<"synergy" | "years" | "awards">("synergy");

  // Trạng thái bước hiển thị cách tính tín hiệu của Qi Prime
  const [signalStep, setSignalStep] = useState<1 | 2 | 3 | 4>(1);
  const [toggleSubSignal, setToggleSubSignal] = useState<"sell" | "buy">("sell");

  // Chỉ số slide của agent đang hoạt động cho Section 2 (Mobile Swiper)
  const [activeAgentIdx, setActiveAgentIdx] = useState(0);

  // Trạng thái danh sách lệnh chạm TP realtime
  const [liveTrades, setLiveTrades] = useState(INITIAL_TRADES);

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

  // Kích hoạt hiệu ứng vẽ đường biểu đồ PnL khi cuộn tới (Stroke Dasharray Animation)
  const chart = useInView<HTMLDivElement>();

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

  // 3. Mô phỏng tín hiệu chạm TP mới sau mỗi 18 giây
  useEffect(() => {
    const interval = setInterval(() => {
      const pairs = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY"];
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const side = Math.random() > 0.5 ? "MUA" : "BÁN";
      const isGold = pair === "XAUUSD";
      const entry = isGold ? Number((rand(2380, 2430)).toFixed(2)) : Number((rand(1.08, 1.30)).toFixed(4));
      const pips = isGold ? Math.floor(rand(50, 90)) : Math.floor(rand(20, 45));
      const tp = side === "MUA" 
        ? (isGold ? entry + pips/10 : entry + pips/10000) 
        : (isGold ? entry - pips/10 : entry - pips/10000);
      
      const newTrade = {
        pair,
        side,
        price: Number(entry),
        tp: Number(isGold ? tp.toFixed(2) : tp.toFixed(4)),
        pips,
        time: "Vừa chạm TP"
      };

      setLiveTrades(prev => [newTrade, ...prev.slice(0, 3)]);
      toast.success(`🎯 AI Tín Hiệu: ${pair} ${side} đã chạm TP (+${pips} pips)!`, {
        icon: "🎯",
        duration: 3000
      });
    }, 18000);

    return () => clearInterval(interval);
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

  function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

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

  // Vẽ biểu tượng SVG chính thức của thương hiệu Ultima
  const UltimaLogoSVG = () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="flex-shrink-0 text-emerald-600">
      {/* Cột xiên bên trái (màu xanh neon/emerald) */}
      <path d="M6 10 L15 14 L15 30 L6 26 Z" fill="currentColor" />
      {/* Cột xiên bên phải (màu tối hoặc trắng phụ thuộc nền, ở đây dùng màu đen/slate) */}
      <path d="M17 6 L26 10 L26 26 L17 22 Z" fill="#0f172a" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-0">
      <Toaster theme="light" position="top-center" />

      {/* Real-time Ticker Bar (Màu sáng) */}
      <div className="bg-slate-100 border-b border-slate-200 py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap text-xs md:text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">QiSignals Trực Tiếp:</span>
          </div>
          <div className="flex gap-6 items-center flex-1 justify-end font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">VÀNG (XAU/USD):</span>
              <span className="font-bold text-slate-900">${rates.xau.toLocaleString()}</span>
              <span className={`font-bold ${rates.xauDiff >= 0 ? "text-emerald-650" : "text-rose-600"}`}>
                {rates.xauDiff >= 0 ? "+" : ""}{rates.xauDiff}%
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-300 pl-6">
              <span className="text-slate-500">EUR/USD:</span>
              <span className="font-bold text-slate-900">{rates.eur}</span>
              <span className={`font-bold ${rates.eurDiff >= 0 ? "text-emerald-650" : "text-rose-600"}`}>
                {rates.eurDiff >= 0 ? "+" : ""}{rates.eurDiff}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header/Navbar (Nền sáng) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Qi Prime */}
            <a href="/" className="block">
              <img 
                src="/assets/qiprime-official-logo.png" 
                alt="Qi Prime" 
                className="h-9 sm:h-12 w-auto object-contain" 
              />
            </a>
            <span className="h-5 w-px bg-slate-300"></span>
            
            {/* Logo Thương Hiệu Ultima */}
            <div className="flex items-center gap-1.5">
              <UltimaLogoSVG />
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-widest text-slate-900 leading-none font-display">ULTIMA</span>
                <span className="text-[7.5px] tracking-wider text-emerald-600 leading-none font-bold">MARKETS</span>
              </div>
            </div>
          </div>

          <div>
            <button 
              onClick={() => scrollToRef(section4Ref)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              Nhận Suất Free
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO SECTION – ENTRY FOCUS (Nền sáng, Screen 1) */}
      <section className="relative min-h-[calc(100vh-100px)] flex items-center py-12 md:py-24 border-b border-slate-200/50 overflow-hidden bg-white">
        {/* Nền Canvas hạt sáng + mạng lưới trôi chậm — hiệu ứng cao cấp */}
        <ParticleField />

        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-blue-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          <Reveal delay={0} y={16}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold uppercase tracking-wider mx-auto">
              <AlertCircle className="w-3.5 h-3.5" />
              Tử Huyệt Của 90% Nhà Giao Dịch
            </div>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight font-display tracking-tight text-balance">
              90% Thất Bại Của Trader Đến Từ Một Điểm <span className="text-emerald-650 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Entry Sai Lầm!</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="text-sm sm:text-base md:text-lg text-slate-650 font-medium leading-relaxed max-w-2xl mx-auto text-balance">
              Điểm entry (vùng vào lệnh) quyết định đến 80% xác suất chiến thắng và tỷ lệ rủi ro/lợi nhuận (R:R). Khi bạn vào lệnh bằng cảm xúc, sự phân vân hay nỗi sợ bỏ lỡ (FOMO), bạn đã tự đặt mình vào thế thua.
            </p>
          </Reveal>

          <Reveal delay={270}>
            <div className="pt-6">
              <button 
                onClick={() => scrollToRef(section4Ref)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base px-8 py-4 sm:py-4.5 rounded-2xl transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 max-w-md mx-auto"
              >
                <MousePointerClick className="w-5 h-5 animate-bounce" />
                Trải nghiệm Entry AI Miễn Phí Ngay
              </button>
            </div>
          </Reveal>

          {/* Huy hiệu thông số hệ thống */}
          <Reveal delay={360}>
            <div className="pt-8 flex justify-center items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Phòng Hộ Sụt Giảm Vốn 15%</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-emerald-600" /> Hạ Tầng Sàn Ultima</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2: BREAKTHROUGH SOLUTION – 6 AI AGENTS (Nền sáng, Screen 2) */}
      <section ref={section2Ref} className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 md:mb-16">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">Giải Pháp Đột Phá Từ AI</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display text-balance">
                Loại Bỏ Cảm Xúc Con Người – Đạt Xác Suất Vào Lệnh Thành Công Tới 70%
              </h2>
              <p className="text-slate-650 text-xs sm:text-sm text-balance">
                Qi Prime không dựa vào trực giác. Chúng tôi vận hành hệ thống 6 AI Agents độc lập hoạt động realtime liên tục 24/7 để quét toàn bộ thị trường, bóc tách dữ liệu và chỉ đưa ra tín hiệu khi có sự hội tụ của các yếu tố cốt lõi:
              </p>
            </div>
          </Reveal>

          {/* Hiển thị dạng lưới trên Desktop (Bị ẩn trên Mobile) — thêm Tilt 3D + phát sáng viền */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_AGENTS.map((agent, i) => (
              <Reveal key={agent.id} delay={i * 80}>
                <TiltCard className="h-full">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-emerald-600/5 h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full tracking-wider uppercase font-mono">{agent.tag}</span>
                        <span className="text-xs text-slate-400 font-mono">Đặc vụ #0{agent.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-650 transition-colors">{agent.name}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{agent.description}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-105 mt-6 flex justify-between items-center text-xs">
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
            <div className="p-6 rounded-2xl bg-white border border-emerald-500/20 shadow-md space-y-4 min-h-[190px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {AI_AGENTS[activeAgentIdx].tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Đặc vụ #0{AI_AGENTS[activeAgentIdx].id}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{AI_AGENTS[activeAgentIdx].name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{AI_AGENTS[activeAgentIdx].description}</p>
              </div>
              <div className="pt-3.5 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400">Thông số hiệu suất:</span>
                <span className="font-bold text-emerald-600 font-mono">{AI_AGENTS[activeAgentIdx].metric}</span>
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
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeAgentIdx ? "w-3 bg-emerald-600" : "bg-slate-300"}`}
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
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">Bảo Chứng Uy Tín & Chất Lượng</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display uppercase">
                Hợp Tác Chiến Lược: Qi Prime x Ultima Markets
              </h2>
              <p className="text-slate-650 text-xs sm:text-sm text-balance">
                Khám phá sức mạnh cộng hưởng giữa giải pháp giao dịch trí tuệ nhân tạo hàng đầu và hạ tầng sàn giao dịch đạt nhiều giải thưởng quốc tế.
              </p>
            </div>
          </Reveal>

          {/* Điều hướng Tab phong cách tối giản, nền sáng */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-lg mx-auto gap-2">
            {[
              { id: "synergy", label: "Cộng Hưởng Thế Mạnh" },
              { id: "years", label: "Hành Trình 10 Năm" },
              { id: "awards", label: "Chứng Nhận Giải Thưởng" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCoopTab(tab.id as any)}
                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all active:scale-95 whitespace-nowrap ${
                  coopTab === tab.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Hiển thị nội dung Tab */}
          <div className="pt-4 min-h-[350px]">
            {coopTab === "synergy" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch animate-fade-in">
                {/* Qi Prime Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img src="/assets/qiprime-official-logo.png" alt="Qi Prime" className="h-10 w-auto object-contain" />
                      <span className="text-xs font-bold text-emerald-650 uppercase tracking-widest font-mono">Đơn Vị Công Nghệ</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      <strong>Qi Prime</strong> là tổ chức công nghệ hàng đầu phát triển hệ sinh thái giao dịch tự động. Trục cốt lõi dựa trên 6 AI Agents giám sát dòng tiền lớn và phòng hộ tài khoản theo chuẩn quản trị rủi ro thể chế.
                    </p>
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-800 block">Thế mạnh cốt lõi:</span>
                      <ul className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 6 AI Agents đồng thuận phân tích 70%+</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Quản trị rủi ro tự động (MDD Floor)</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Tín hiệu chuẩn xác và hệ thống Copy Trade 1:1</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ultima Markets Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <UltimaLogoSVG />
                        <span className="text-xs font-black tracking-widest text-slate-900 leading-none font-display">ULTIMA</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-650 uppercase tracking-widest font-mono">Đại Diện Hạ Tầng</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      <strong>Ultima Markets</strong> là nhà môi giới tài chính toàn cầu được cấp phép. Cung cấp nền tảng giao dịch thanh khoản sâu chuẩn thể chế với tốc độ khớp lệnh cực cao và an toàn tài khoản ký quỹ tuyệt đối.
                    </p>
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-800 block">Thế mạnh cốt lõi:</span>
                      <ul className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Khớp lệnh siêu tốc dưới 5ms qua VPS</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Chênh lệch giá mua bán (spread) cực thấp</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Quản lý tài khoản ký quỹ tách biệt an toàn</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {coopTab === "years" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                {/* Ảnh Banner 10 năm bản tiếng Việt */}
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                  <img 
                    src="/assets/ultima-10-years-vn.jpg" 
                    alt="Ultima Markets 10 Năm Kiến Tạo Niềm Tin" 
                    className="w-full h-auto object-cover" 
                  />
                </div>
                {/* Lời tự sự hành trình */}
                <div className="space-y-5">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">Kỷ Niệm Hành Trình 10 Năm</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">10 Năm Kiến Tạo Niềm Tin — Hướng Đến Tương Lai</h3>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    Trải qua một thập kỷ hình thành và phát triển bền vững, Ultima Markets đã khẳng định vị thế vững chắc của mình trên thị trường tài chính thế giới. Sự kiện 10 năm kiến tạo niềm tin minh chứng cho cam kết về tính minh bạch, an toàn và hiệu năng công nghệ mà Ultima dành cho khách hàng.
                  </p>
                  
                  {/* Trustpilot Score Badge */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <img src="/assets/ultima-trustpilot-rating.png" alt="Trustpilot Great Score" className="h-8 w-auto object-contain" />
                      <p className="text-[10px] text-slate-500 font-medium">Đánh giá cực tốt dựa trên 585+ lượt bình luận thực tế.</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-black text-slate-800 font-mono">4.1 / 5</span>
                      <span className="text-[9px] text-slate-400 block font-bold font-mono">TRUST SCORE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {coopTab === "awards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                {/* Danh sách giải thưởng */}
                <div className="space-y-4 text-left">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono block mb-2">Brands Review Magazine Awards 2026</span>
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
                        <span className="p-1 bg-emerald-50 text-emerald-600 rounded-full mt-0.5 flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                        </span>
                        <span className="text-slate-705 font-medium">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Ảnh chứng nhận giải thưởng */}
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-md max-w-sm mx-auto">
                  <img 
                    src="/assets/ultima-awards-2026-poster.jpg" 
                    alt="Brands Review Magazine Awards 2026 Certificate" 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Khối tóm tắt cộng hưởng thế mạnh */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <p className="text-slate-600 text-xs sm:text-sm text-balance sm:text-left text-center">
              💡 <strong>Cộng hưởng hoàn hảo:</strong> Hệ thống tín hiệu thông minh của <strong>Qi Prime</strong> (Bộ Não) chạy trực tiếp trên máy chủ VPS kết nối siêu tốc tới cổng thanh khoản của <strong>Ultima</strong> (Thể Chất), giúp thực thi lệnh chính xác và tránh tối đa trượt giá!
            </p>
            <button 
              onClick={() => scrollToRef(section4Ref)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all whitespace-nowrap active:scale-95 shadow-sm"
            >
              Kích Hoạt Suất Free
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: SOCIAL PROOF – PNL & LIVE TP FEED (Nền sáng, Screen 3) */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">Kết Quả Thực Tế</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display uppercase">
                Dữ Liệu Minh Bạch – Lịch Sử TP & Quản Trị Rủi Ro Kỷ Luật
              </h2>
              <p className="text-slate-605 text-xs sm:text-sm text-balance">
                Hệ thống tự động thực thi kỷ luật tuyệt đối. Tự động siết chặt SL (Stop Loss) theo biến động thị trường để bảo vệ tối đa nguồn vốn của bạn khi có đảo chiều bất ngờ.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Thẻ biểu đồ tăng trưởng PnL SVG */}
            <div ref={chart.ref} className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">BIỂU ĐỒ HIỆU SUẤT</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1">Đường Tăng Trưởng Tài Khoản Master (PnL)</h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-600 bg-emerald-55 px-2 py-0.5 rounded font-mono font-bold">TĂNG TRƯỞNG ỔN ĐỊNH</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-1">+48.2% AUM</div>
                </div>
              </div>

              {/* Vẽ biểu đồ dạng SVG nét sáng màu xanh emerald — có hiệu ứng vẽ đường chạy khi cuộn tới */}
              <div className="w-full h-48 sm:h-56 relative bg-slate-50/50 rounded-xl overflow-hidden border border-slate-200">
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Đường kẻ ô lưới */}
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />
                  
                  {/* Vùng đổ màu phía dưới — mờ dần hiện ra sau khi đường vẽ xong */}
                  <path 
                    d="M 0 170 Q 50 160, 100 135 T 200 110 T 300 65 T 400 35 L 400 200 L 0 200 Z" 
                    fill="url(#pnlGrad)"
                    style={{
                      opacity: chart.inView ? 1 : 0,
                      transition: "opacity 0.8s ease-out 0.9s"
                    }}
                  />
                  
                  {/* Đường biểu diễn chính — Stroke Dasharray Animation (vẽ chạy mượt) */}
                  <path 
                    d="M 0 170 Q 50 160, 100 135 T 200 110 T 300 65 T 400 35" 
                    fill="none" 
                    stroke="#059669" 
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    pathLength={1}
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: chart.inView ? 0 : 1,
                      transition: "stroke-dashoffset 1.6s cubic-bezier(0.65,0,0.35,1)"
                    }}
                  />

                  {/* Các chấm hiển thị mốc — hiện dần theo tiến độ vẽ đường */}
                  {[
                    { cx: 100, cy: 135, d: "0.7s" },
                    { cx: 200, cy: 110, d: "1.0s" },
                    { cx: 300, cy: 65, d: "1.3s" }
                  ].map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.cx}
                      cy={pt.cy}
                      r="4.5"
                      fill="#059669"
                      style={{
                        opacity: chart.inView ? 1 : 0,
                        transition: `opacity 0.4s ease-out ${pt.d}`
                      }}
                    />
                  ))}
                  <circle
                    cx="400" cy="35" r="5" fill="#059669" className="animate-ping"
                    style={{ opacity: chart.inView ? 1 : 0, transition: "opacity 0.4s ease-out 1.55s" }}
                  />
                  <circle
                    cx="400" cy="35" r="5" fill="#059669"
                    style={{ opacity: chart.inView ? 1 : 0, transition: "opacity 0.4s ease-out 1.55s" }}
                  />
                </svg>
                <div className="absolute left-3 bottom-3 text-[10px] text-slate-400 font-mono">T1/2026</div>
                <div className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-mono">Hiện tại</div>
              </div>
            </div>

            {/* Bảng feed lệnh chạm TP theo thời gian thực */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono">TÍN HIỆU THỜI GIAN THỰC</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1">Lịch Sử Lệnh Chạm TP Gần Nhất</h3>
              </div>

              {/* Danh sách các lệnh đang hiển thị */}
              <div className="space-y-3.5 flex-1 justify-center">
                {liveTrades.map((trade, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-205 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in hover:border-slate-300 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{trade.pair}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-black font-mono ${trade.side === "MUA" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {trade.side}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-550 font-medium font-mono">Điểm vào: {trade.price.toLocaleString()}</div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-black text-emerald-700 flex items-center justify-end gap-1 font-mono">
                        <span>Chạm TP ({trade.tp.toLocaleString()})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1.5 font-medium">
                        <span className="text-emerald-600 font-bold font-mono">+{trade.pips} pips</span>
                        <span className="text-zinc-400">•</span>
                        <span>{trade.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cụm nút CTA kép kích thước lớn cho thiết bị di động */}
          <div className="pt-6 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/qisignals"
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-6 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <MousePointerClick className="w-4 h-4 text-emerald-600" />
              Xem Nhóm Tín Hiệu Trên Web
            </Link>
            
            <a
              href="https://t.me/qiprime_signals"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold px-6 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-650/10"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              Nhận Tín Hiệu Tele Báo Tức Thì
            </a>
          </div>

          {/* QI PRIME SIGNALS CALCULATOR PREVIEW (REAL SCREENSHOTS) */}
          <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold text-emerald-650 uppercase tracking-widest font-mono">Minh Chứng Trực Quan</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display uppercase">
                Quy Trình Phân Tích & Phát Tín Hiệu AI Thực Tế
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Nhấp vào từng bước bên dưới để xem ảnh chụp màn hình thực tế từ ứng dụng phân tích Qi Prime và kênh đẩy lệnh Telegram tự động.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Steps (Thumb Zone) */}
              <div className="md:col-span-7 space-y-3">
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
                    className={`w-full p-4 rounded-xl border text-left transition-all active:scale-[0.99] flex gap-3 ${
                      signalStep === item.step
                        ? "border-emerald-500 bg-emerald-50/30 text-slate-900 shadow-sm"
                        : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${
                      signalStep === item.step ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
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
                <div className="relative w-full max-w-[280px] aspect-[9/19] rounded-[36px] border-8 border-slate-900 bg-slate-950 overflow-hidden shadow-xl ring-4 ring-slate-100/50">
                  {/* Notch area */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-20"></div>
                  
                  {/* Dynamic Screenshot */}
                  <div className="w-full h-full relative z-10 select-none">
                    {signalStep === 1 && (
                      <img 
                        src="/assets/signals-app-layer13.jpg" 
                        alt="Trend Gate & Stochastic Indicator Screenshot" 
                        className="w-full h-full object-cover animate-fade-in" 
                      />
                    )}
                    {signalStep === 2 && (
                      <img 
                        src="/assets/signals-app-layer4.jpg" 
                        alt="Order Flow Analysis Screenshot" 
                        className="w-full h-full object-cover animate-fade-in" 
                      />
                    )}
                    {signalStep === 3 && (
                      <div className="w-full h-full relative animate-fade-in">
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
                            className={`px-2 py-0.5 rounded font-bold transition-all ${toggleSubSignal === "buy" ? "bg-emerald-600 text-white" : "text-zinc-400"}`}
                          >
                            MUA (BUY)
                          </button>
                        </div>
                        <img 
                          src={toggleSubSignal === "sell" ? "/assets/signals-app-sell.jpg" : "/assets/signals-app-buy.jpg"} 
                          alt="AI Signal Card Screenshot" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    {signalStep === 4 && (
                      <img 
                        src="/assets/signals-tele-post.jpg" 
                        alt="Telegram Channel Signals Post Screenshot" 
                        className="w-full h-full object-cover animate-fade-in" 
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EXCLUSIVE OFFER & SCARCITY FORM (Nền sáng, Screen 4) */}
      <section ref={section4Ref} className="py-20 md:py-28 bg-white relative overflow-hidden border-b border-slate-200/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto px-4 relative space-y-8">
          <Reveal>
            <div className="text-center space-y-4">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono block">CƠ HỘI ĐỘC QUYỀN</span>
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
            <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[10px] text-slate-550 uppercase tracking-wider font-semibold block">Tình Trạng Suất</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono block">
                Chỉ còn <span className="underline animate-pulse">{slotsLeft}</span> suất
              </span>
            </div>
            
            {/* Thời gian ưu đãi còn lại */}
            <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[10px] text-slate-555 uppercase tracking-wider font-semibold block">Thời Gian Còn Lại</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono block">
                {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Form đăng ký tối giản */}
          <div className="bg-slate-55 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 animate-bounce">
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 outline-none transition-colors"
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 outline-none transition-colors"
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
                  className="w-full py-4 rounded-xl bg-emerald-650 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm uppercase transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-650/10 mt-6"
                >
                  {submitting ? "Đang xử lý..." : "KÍCH HOẠT SUẤT TRẢI NGHIỆM MIỄN PHÍ"}
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </button>

                <p className="text-[10px] text-slate-450 text-center mt-2">
                  🔒 Thông tin được bảo mật tuyệt đối theo tiêu chuẩn mã hóa SSL/TLS.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-205">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/qiprime-official-logo.png" 
                alt="Qi Prime" 
                className="h-9 w-auto object-contain" 
              />
              <span className="h-4 w-px bg-slate-300"></span>
              <div className="flex items-center gap-1.5">
                <UltimaLogoSVG />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-slate-800 font-display">ULTIMA</span>
                  <span className="text-[7px] tracking-wider text-emerald-650 font-bold font-mono">MARKETS</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 text-slate-600 font-semibold">
              <a href="#" className="hover:text-emerald-650 transition-colors">Điều Khoản Dịch Vụ</a>
              <a href="#" className="hover:text-emerald-650 transition-colors">Chính Sách Bảo Mật</a>
              <a href="#" className="hover:text-emerald-650 transition-colors">Miễn Trừ Trách Nhiệm</a>
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
            className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm uppercase active:scale-97 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-white" />
            Đăng ký nhận 1 trong 100 suất miễn phí
          </button>
        </div>
      )}
    </div>
  );
}
