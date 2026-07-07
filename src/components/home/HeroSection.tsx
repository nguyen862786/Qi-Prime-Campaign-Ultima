import { Link } from "@tanstack/react-router";
import { ArrowRight, Star, Plus, Check, TrendingUp, Shield, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useLeadModal } from "@/components/forms/LeadModal";

export function HeroSection() {
  const { open: openLeadModal } = useLeadModal();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    // (1) Vertical padding & bottom margin trimmed ~35% (pt-4→pt-3, pb-8/lg:pb-10→pb-5/lg:pb-7, mb-16→mb-10)
    //     Soft bottom radius retained. overflow-hidden guarantees nothing spills onto sections below.
    <section className="relative overflow-hidden rounded-b-3xl sm:rounded-b-[32px] bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 pt-3 pb-5 lg:pb-7 mb-10">
      {/* Floating pill navbar */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md px-3 py-2">
          <Link to="/" className="flex items-center pl-2" aria-label="Qi Prime">
            <img
              src="/assets/qiprime-official-logo.png"
              alt="Qi Prime — Forex AI Ecosystem"
              className="h-14 w-24 object-contain"
            />
          </Link>
          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-2 py-1.5">
            {[
              { l: "Home", h: "/" },
              { l: "Sự Kiện", h: "/su-kien" },
              { l: "QiSignals", h: "/qisignals" },
              { l: "Sản Phẩm", h: "/san-pham" },
              { l: "Đối Tác", h: "/doi-tac" },
              { l: "Học Viện", h: "/hoc-vien" },
            ].map((n) => (
              <Link key={n.l} to={n.h} className="px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors">
                {n.l}
              </Link>
            ))}
          </div>

          {/* Desktop actions: Đăng Nhập · Đăng Ký · Tham Gia */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/auth" className="px-3 py-2 text-xs font-semibold text-white/90 hover:text-white transition-colors">
              Đăng Nhập
            </Link>
            <button
              type="button"
              onClick={openLeadModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-colors"
            >
              Đăng Ký
            </button>
            <button type="button" onClick={openLeadModal} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-ob-dark hover:bg-white/90 transition-colors">
              Tham Gia Hệ Sinh Thái
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ob-dark text-white">
                <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          </div>

          {/* Mobile: nút hamburger mở Drawer */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Drawer (ngăn kéo gom toàn bộ điều hướng + tài khoản) */}
        {menuOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-white/10 bg-ob-dark/95 backdrop-blur-md p-3 shadow-2xl">
            <div className="grid">
              {[
                { l: "Home", h: "/" },
                { l: "Sự Kiện", h: "/su-kien" },
                { l: "QiSignals", h: "/qisignals" },
                { l: "Sản Phẩm", h: "/san-pham" },
                { l: "Đối Tác", h: "/doi-tac" },
                { l: "Học Viện", h: "/hoc-vien" },
              ].map((n) => (
                <Link key={n.l} to={n.h} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                  {n.l}
                </Link>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 grid gap-2">
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-white text-center transition-colors">
                Đăng Nhập
              </Link>
              <button type="button" onClick={() => { setMenuOpen(false); openLeadModal(); }} className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold px-3 py-2.5 transition-colors">
                Đăng Ký
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); openLeadModal(); }} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ob-dark hover:bg-white/90 transition-colors">
                Tham Gia Hệ Sinh Thái
              </button>
            </div>
          </div>
        )}
      </div>

      {/* (1) inner top margin trimmed mt-10→mt-6, grid gaps tightened */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-6 items-center">
          {/* LEFT */}
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full border border-ob-lime/40 bg-ob-lime/10 px-4 py-1.5 text-xs font-medium text-ob-lime mb-4">
              HỆ THỐNG GIAO DỊCH TỰ ĐỘNG THÔNG MINH
            </div>
            {/* (3) Mobile font dropped to text-2xl, scales up responsively; break-words prevents overflow */}
            <h1 className="font-[Montserrat] font-bold tracking-tight text-white text-2xl sm:text-3xl md:text-4xl lg:text-[52px] leading-[1.12] break-words">
              Tự Động Hóa Kỷ Luật<br />
              Qua Hạ Tầng<br />
              <span className="text-ob-lime">Quản Trị Rủi Ro Thể Chế</span>
            </h1>
            <p className="mt-4 font-[Roboto] text-sm leading-7 text-white/70 max-w-md">
              Loại bỏ hoàn toàn bản ngã con người và biến động tâm lý. Hệ sinh thái Qi Prime kết hợp Trí tuệ Nhân tạo tối tân với quy tắc khóa rủi ro nghiêm ngặt để bảo vệ dòng vốn, đồng thời cung cấp cơ chế chia sẻ hiệu suất công nghệ minh bạch giúp Master IB tối ưu hóa thu nhập tiềm năng và mở rộng quy mô doanh nghiệp FinTech cá nhân.
            </p>

            {/* (3) Buttons stay vertical (flex-col) on mobile, horizontal from sm: up */}
            <div className="mt-6 flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:gap-4 sm:w-auto">
              <button
                type="button"
                onClick={openLeadModal}
                className="group inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full bg-ob-lime pl-6 pr-2 py-2 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 transition-colors"
              >
                Nhận Link Đối Tác
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ob-dark text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
              <Link
                to="/san-pham"
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Khám Phá Sản Phẩm EA
              </Link>
            </div>

            {/* (1) trust row top margin trimmed mt-12→mt-7 */}
            <div className="mt-7 flex flex-wrap items-end gap-8 sm:gap-12">
              <div>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-ob-lime text-ob-lime" />
                  ))}
                  <span className="ml-1 text-xs text-white/70">Niềm Tin Mạng Lưới</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-mono text-3xl font-bold text-ob-lime">15,000+</span>
                  <span className="text-[11px] text-white/70 leading-tight">
                    Lots Được Giám Sát Hàng Tháng<br />Trên Toàn Hệ Thống
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-white/80 mb-2">Mạng Lưới Master IB:</div>
                <div className="flex items-center -space-x-2">
                  {["bg-amber-300", "bg-rose-300", "bg-sky-300"].map((c, i) => (
                    <div key={i} className={`h-9 w-9 rounded-full border-2 border-ob-dark ${c}`} />
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ob-dark bg-ob-lime text-ob-dark">
                    <Plus className="h-4 w-4" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* (2) RIGHT decorative block — DESKTOP ONLY (inline). Hidden on mobile. */}
          <div className="relative w-full min-w-0 hidden md:block">
            <HeroCarousel />
          </div>
        </div>

        {/* (2) MOBILE ONLY — decorative block fully detached as its own block below the hero
                content, so it can never overlap the feature cards in the sections beneath. */}
        <MobileCarouselTab />
      </div>
    </section>
  );
}

function MobileCarouselTab() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden mt-6">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ob-lime">
            Demo Trực Quan
          </div>
          <div className="text-xs text-white/80 mt-0.5">
            Hiệu suất · Biểu đồ AI · Khiên rủi ro
          </div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-ob-lime px-4 py-2 text-xs font-semibold text-ob-dark"
        >
          {open ? "Đóng" : "Xem Demo"}
        </button>
      </div>
      {open && (
        <div className="mt-4">
          <HeroCarousel />
        </div>
      )}
    </div>
  );
}

function HeroCarousel() {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" }, [autoplay.current]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => { embla.off("select", onSelect); };
  }, [embla]);

  const slides = [
    { node: <CommissionSlide /> },
    { node: <ChartSlide /> },
    { node: <RiskSlide /> },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -top-2 left-0 z-10 flex items-center gap-2 text-xs text-white/80">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ob-lime text-ob-dark">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        <span className="leading-tight">
          6 Dedicated AI Agents<br />Hybrid Multi-Grid EA Engine
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl pt-10" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] px-1">
              <div className="h-[340px] sm:h-[360px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 shadow-2xl">
                {s.node}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${selected === i ? "w-8 bg-ob-lime" : "w-2 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

function CommissionSlide() {
  return (
    <div className="relative h-full">
      {/* Light (lime) surface — institutional wording, labels darkened to #111827 */}
      <div className="rounded-2xl bg-ob-lime p-4">
        <div className="flex items-center justify-between text-[10px] text-[#111827] font-semibold">
          <span>Qi Prime — Ví Hiệu Suất Công Nghệ</span>
          <span>•••</span>
        </div>
        <div className="mt-2 flex items-start justify-between">
          <div>
            <div className="text-[10px] text-[#111827] font-medium">Thu Nhập Tiềm Năng / Tháng</div>
            <div className="font-mono text-3xl font-bold text-[#111827]">$10,240.00</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-ob-dark grid place-items-center text-ob-lime font-bold">Qi</div>
        </div>
        <svg viewBox="0 0 200 50" className="mt-2 w-full h-12">
          <polyline fill="none" stroke="#111827" strokeWidth="2.5" points="0,38 25,30 50,34 75,18 100,24 125,12 150,16 175,6 200,10" />
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          { k: "Real-time", v: "Đối soát" },
          { k: "0ms", v: "Độ trễ" },
          { k: "100%", v: "Minh bạch" },
        ].map((m) => (
          <div key={m.k} className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
            <div className="font-mono text-[10px] text-ob-lime">{m.k}</div>
            <div className="text-[9px] text-white/70 mt-0.5">{m.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-ob-lime/10 border border-ob-lime/30 p-3">
        <div className="text-[10px] uppercase tracking-wider text-ob-lime">Chia Sẻ Hiệu Suất Công Nghệ Minh Bạch</div>
        <div className="font-[Montserrat] text-sm font-bold text-white mt-0.5">Tối ưu hóa thu nhập tiềm năng cho Master IB</div>
      </div>
    </div>
  );
}

function ChartSlide() {
  const candles = [
    { o: 30, c: 22, up: true }, { o: 24, c: 32, up: false }, { o: 32, c: 20, up: true },
    { o: 20, c: 28, up: false }, { o: 28, c: 18, up: true }, { o: 18, c: 12, up: true },
    { o: 12, c: 22, up: false }, { o: 22, c: 14, up: true }, { o: 14, c: 8, up: true },
    { o: 8, c: 18, up: false }, { o: 18, c: 10, up: true }, { o: 10, c: 4, up: true },
  ];
  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-white/60">MT5 · XAUUSD · M15</div>
          <div className="font-mono text-2xl font-bold text-white">2,418.<span className="text-ob-lime">62</span></div>
        </div>
        <span className="rounded-full bg-ob-lime/20 px-2.5 py-1 text-[10px] font-semibold text-ob-lime border border-ob-lime/30">
          QiSignals AI · LIVE
        </span>
      </div>
      <div className="relative mt-3 flex-1 rounded-xl bg-ob-dark/60 border border-white/10 p-3">
        <div className="absolute inset-0 grid grid-rows-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="border-b border-white/5" />)}
        </div>
        <div className="relative h-full flex items-end gap-1.5">
          {candles.map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center" style={{ height: "100%" }}>
              <div
                className={`w-full rounded-sm ${c.up ? "bg-ob-lime" : "bg-rose-400/80"}`}
                style={{ marginTop: `${Math.min(c.o, c.c)}%`, height: `${Math.abs(c.o - c.c)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="absolute right-2 top-3 flex flex-col gap-1">
          <span className="rounded bg-ob-lime/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-ob-dark">TP 2,432</span>
          <span className="rounded bg-rose-500/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">SL 2,402</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/70">
        <TrendingUp className="h-3 w-3 text-ob-lime" /> AI khớp lệnh: 0.8ms · Slippage 0.2 pip
      </div>
    </div>
  );
}

function RiskSlide() {
  const metrics = [
    { label: "Drawdown", value: "2.4%", bar: 24 },
    { label: "Win Rate", value: "78.5%", bar: 78 },
    { label: "Sharpe Ratio", value: "2.18", bar: 65 },
    { label: "Recovery Factor", value: "4.92", bar: 88 },
  ];
  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ob-lime/15 text-ob-lime">
            <Shield className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="font-[Montserrat] text-sm font-bold text-white">Institutional Risk</div>
            <div className="text-[9px] text-white/60">Real-time portfolio monitor</div>
          </div>
        </div>
        <span className="rounded-full bg-ob-lime/20 px-2 py-0.5 text-[9px] font-semibold text-ob-lime">ALL CLEAR</span>
      </div>
      <div className="mt-3 space-y-2.5 flex-1">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/70">{m.label}</span>
              <span className="font-mono font-bold text-white">{m.value}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-ob-lime to-[#39FF14]" style={{ width: `${m.bar}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
          <div className="font-mono text-sm font-bold text-ob-lime">15K+</div>
          <div className="text-[8px] text-white/60">Lots / tháng</div>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
          <div className="font-mono text-sm font-bold text-ob-lime">6</div>
          <div className="text-[8px] text-white/60">AI Agents</div>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
          <div className="font-mono text-sm font-bold text-ob-lime">24/7</div>
          <div className="text-[8px] text-white/60">Giám sát</div>
        </div>
      </div>
    </div>
  );
}
