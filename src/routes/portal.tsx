import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Wallet, PieChart, Settings, LogOut,
  TrendingUp, DollarSign, Layers, Activity, ArrowUpRight,
} from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Partner Dashboard — Qi Prime" },
      { name: "description", content: "Forex Partner Dashboard: network volume, performance wallet, partner network, performance share and live performance stream." },
      { property: "og:title", content: "Partner Dashboard — Qi Prime" },
      { property: "og:description", content: "Live Master IB metrics, performance share and transparent network telemetry." },
    ],
  }),
  component: PortalPage,
});

const navItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Partner Network" },
  { icon: Wallet, label: "Performance Wallet" },
  { icon: PieChart, label: "Performance Share" },
  { icon: Settings, label: "Settings" },
];

const metrics = [
  { icon: Layers, label: "Total Network Volume", value: "84,512 Lots", sub: "+1,240 today", gold: false },
  { icon: DollarSign, label: "Live Performance Wallet", value: "$12,847.50", sub: "Auto-settled", gold: true },
  { icon: Users, label: "Active Partner Network", value: "318 Partners", sub: "Mạng lưới chuyên sâu", gold: false },
  { icon: TrendingUp, label: "Net Performance Share", value: "$34,210.80", sub: "10% hiệu suất", gold: false },
];

const initialStream = [
  "Nhánh đối tác phát sinh 10 lots trên XAUUSD (Hiệu suất ghi nhận: +$30.00)",
  "Nhánh đối tác đóng 4 lots trên EURUSD (Hiệu suất: +$60.00)",
  "Đối tác nâng hạng → mở rộng băng chia sẻ hiệu suất công nghệ",
  "Copy Trade master account profit harvest +$1,240.00 (Chia sẻ hiệu suất: +$124.00)",
  "Nhánh đối tác phát sinh 2 lots trên US30 (Hiệu suất ghi nhận: +$6.00)",
];

function PortalPage() {
  const [stream, setStream] = useState(initialStream);

  useEffect(() => {
    const id = setInterval(() => {
      const events = [
        `Nhánh đối tác phát sinh ${Math.ceil(Math.random() * 12)} lots trên XAUUSD (Hiệu suất ghi nhận: +$${(Math.random() * 40 + 5).toFixed(2)})`,
        `Nhánh đối tác đóng ${Math.ceil(Math.random() * 6)} lots trên EURUSD (Hiệu suất: +$${(Math.random() * 90 + 10).toFixed(2)})`,
        `Copy Trade equity tick +$${(Math.random() * 320 + 40).toFixed(2)} (Chia sẻ hiệu suất active)`,
      ];
      setStream((prev) => [events[Math.floor(Math.random() * events.length)], ...prev].slice(0, 8));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-[Roboto]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-ib-navy text-white min-h-screen sticky top-0">
          <div className="px-6 py-6 border-b border-white/10">
            <Link to="/" className="flex items-center" aria-label="Qi Prime Partner Portal">
              <img
                src="/assets/qiprime-official-logo.png"
                alt="Qi Prime — Partner Portal"
                className="h-16 w-28 object-contain"
              />
            </Link>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map((n) => (
              <button
                key={n.label}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  n.active ? "bg-ib-gold/15 text-ib-gold" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-white/10">
            <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
              <LogOut className="h-4 w-4" /> Log out
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-[1600px]">
          <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-[Montserrat] text-2xl sm:text-3xl font-bold text-ib-navy">Master IB Overview</h1>
              <p className="mt-1 text-sm text-slate-600">Live network telemetry · Chia sẻ hiệu suất công nghệ minh bạch</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-ib-teal/10 border border-ib-teal/30 px-3 py-1.5 text-xs font-semibold text-ib-teal">
              <Activity className="h-3.5 w-3.5" /> Live · 0.0s độ trễ đối soát
            </div>
          </header>

          {/* Metric grid */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-white border border-slate-200 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-ib-gold/40"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ib-navy">
                    <m.icon className="h-4 w-4 text-ib-gold" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ib-teal" />
                </div>
                <div className="mt-4 text-xs uppercase tracking-wider text-slate-600">{m.label}</div>
                <div className={`mt-1 font-mono text-2xl font-bold ${m.gold ? "text-ib-gold" : "text-ib-navy"}`}>
                  {m.value}
                </div>
                <div className="mt-1 text-xs text-slate-600">{m.sub}</div>
              </div>
            ))}
          </section>

          {/* Chart + stream */}
          <section className="mt-8 grid gap-6 lg:grid-cols-5">
            {/* Revenue distribution */}
            <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-[Montserrat] text-lg font-bold text-ib-navy">Revenue Distribution</h2>
                  <p className="text-xs text-slate-600 mt-0.5">Hiệu suất trực tiếp vs Hiệu suất chia sẻ mạng lưới</p>
                </div>
                <div className="font-mono text-sm text-slate-600">Last 30 days</div>
              </div>

              <div className="mt-6 space-y-5">
                <DistributionBar label="Hiệu suất trực tiếp" value="$8,420.00" pct={62} color="bg-ib-gold" />
                <DistributionBar label="Hiệu suất chia sẻ mạng lưới" value="$5,160.00" pct={38} color="bg-ib-teal" />
              </div>

              {/* synthetic equity sparkline */}
              <div className="mt-8">
                <div className="text-xs uppercase tracking-wider text-slate-600 mb-3">Network Volume — 14d</div>
                <svg viewBox="0 0 400 100" className="w-full h-24">
                  <defs>
                    <linearGradient id="vol" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none" stroke="#D4AF37" strokeWidth="2"
                    points="0,72 30,60 60,68 90,48 120,55 150,38 180,44 210,28 240,34 270,22 300,30 330,16 360,22 400,10"
                  />
                  <polygon
                    fill="url(#vol)"
                    points="0,72 30,60 60,68 90,48 120,55 150,38 180,44 210,28 240,34 270,22 300,30 330,16 360,22 400,10 400,100 0,100"
                  />
                </svg>
              </div>
            </div>

            {/* Live stream */}
            <div className="lg:col-span-2 rounded-2xl bg-ib-navy text-white p-6 overflow-hidden">
              <div className="flex items-center justify-between">
                <h2 className="font-[Montserrat] text-lg font-bold">Live Performance Stream</h2>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ib-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-ib-teal animate-pulse" /> Live
                </span>
              </div>
              <ul className="mt-5 space-y-3">
                {stream.map((s, i) => (
                  <li key={`${s}-${i}`} className="font-mono text-[11px] leading-5 text-white/80 border-l-2 border-ib-gold/60 pl-3">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function DistributionBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-mono font-semibold text-ib-navy">{value} · {pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
