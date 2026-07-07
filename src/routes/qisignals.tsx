import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import {
  Activity, RefreshCw, Copy, Check, ChevronDown, Pause, Play,
  TrendingDown, TrendingUp, Gauge, Layers, Waves, BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/qisignals")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "QiSignals — Intelligent Flow Engine v2.0" },
      { name: "description", content: "Bảng điều khiển tín hiệu thông minh QiSignals: Trend Gate, Stochastic Trigger, Order Flow & RSI — đồng thuận 6 AI Agents theo thời gian thực." },
    ],
  }),
  component: QiSignalsPage,
});

/* ---------------- Mock data engine ---------------- */

type TF = "M15" | "H1" | "H4";
type Side = "BUY" | "SELL";

const ASSETS: { s: string; label: string; digits: number; min: number; max: number; risk: number }[] = [
  { s: "XAUUSD", label: "Gold Spot", digits: 2, min: 2380, max: 2450, risk: 6.2 },
  { s: "EURUSD", label: "Euro / USD", digits: 4, min: 1.05, max: 1.12, risk: 0.0042 },
  { s: "GBPUSD", label: "Pound / USD", digits: 4, min: 1.24, max: 1.31, risk: 0.0051 },
  { s: "USDJPY", label: "USD / Yen", digits: 3, min: 150, max: 158, risk: 0.28 },
  { s: "BTCUSD", label: "Bitcoin", digits: 0, min: 66000, max: 72000, risk: 380 },
  { s: "US30", label: "Dow Jones", digits: 0, min: 38900, max: 40200, risk: 62 },
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type Snapshot = {
  asset: string;
  digits: number;
  side: Side;
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  aiScore: number;
  rsi: number;
  rsiLabel: string;
  ema21: number;
  ema50: number;
  ema200: number;
  gate: string;
  stochK: number;
  stochD: number;
  stochLabel: string;
  flowLabel: string;
  deltaLabel: string;
  powerLabel: string;
  buyPressure: number;
  sellPressure: number;
  updatedAt: number;
};

function genSnapshot(assetSymbol: string): Snapshot {
  const cfg = ASSETS.find((a) => a.s === assetSymbol) ?? ASSETS[0];
  const side: Side = Math.random() > 0.5 ? "BUY" : "SELL";
  const entry = +rand(cfg.min, cfg.max).toFixed(cfg.digits);
  const r = cfg.risk;
  const isSell = side === "SELL";

  const sl = +(isSell ? entry + r : entry - r).toFixed(cfg.digits);
  const tp1 = +(isSell ? entry - r : entry + r).toFixed(cfg.digits);
  const tp2 = +(isSell ? entry - r * 2 : entry + r * 2).toFixed(cfg.digits);

  const o = r * 0.9;
  const ema21 = +(isSell ? entry + o : entry - o).toFixed(cfg.digits);
  const ema50 = +(isSell ? entry + o * 2.2 : entry - o * 2.2).toFixed(cfg.digits);
  const ema200 = +(isSell ? entry + o * 4.5 : entry - o * 4.5).toFixed(cfg.digits);
  const gate = isSell ? "BELOW · GATE: DOWN — SELL ONLY" : "ABOVE · GATE: UP — BUY ONLY";

  const rsi = +(isSell ? rand(30, 45) : rand(56, 70)).toFixed(1);
  const rsiLabel = isSell ? "Bearish momentum" : "Bullish momentum";

  const stochK = +(isSell ? rand(8, 22) : rand(78, 94)).toFixed(1);
  const stochD = +(stochK + rand(-5, 5)).toFixed(1);
  const stochLabel = isSell ? "OVERSOLD · BULLISH CROSS" : "OVERBOUGHT · BEARISH CROSS";

  const buyPressure = +rand(38, 62).toFixed(1);
  const sellPressure = +(100 - buyPressure).toFixed(1);
  const flowLabel = buyPressure >= sellPressure ? "Buyer dominant" : "Seller dominant";
  const deltaLabel = isSell ? "Seller attack" : "Buyer absorption";
  const powerLabel = isSell ? "Bearish power" : "Bullish power";

  const aiScore = +rand(22, 94).toFixed(1);

  return {
    asset: cfg.s, digits: cfg.digits, side, entry, sl, tp1, tp2, aiScore,
    rsi, rsiLabel, ema21, ema50, ema200, gate, stochK, stochD, stochLabel,
    flowLabel, deltaLabel, powerLabel, buyPressure, sellPressure,
    updatedAt: Date.now(),
  };
}

function fmt(n: number, digits: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/* ---------------- Page ---------------- */

function QiSignalsPage() {
  const [asset, setAsset] = useState("XAUUSD");
  const [tf, setTf] = useState<TF>("H4");
  const [snap, setSnap] = useState<Snapshot>(() => genSnapshot("XAUUSD"));
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refresh = useCallback((a: string = asset) => {
    setSnap(genSnapshot(a));
  }, [asset]);

  // live seconds counter
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // auto-refresh feed — only runs while autoRefresh is ON
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => setSnap(genSnapshot(asset)), 12000);
    return () => clearInterval(id);
  }, [asset, autoRefresh]);

  const secondsAgo = Math.max(0, Math.floor((now - snap.updatedAt) / 1000));
  const timeStr = new Date(snap.updatedAt).toLocaleTimeString("en-US");

  const copySignal = async () => {
    const text =
      `QiSignals · ${snap.asset} ${tf}\n${snap.side} NOW\n` +
      `ENTRY ${fmt(snap.entry, snap.digits)}\nSL ${fmt(snap.sl, snap.digits)}\n` +
      `TP1 ${fmt(snap.tp1, snap.digits)}\nTP2 ${fmt(snap.tp2, snap.digits)}\nAI Score ${snap.aiScore}/100`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const isSell = snap.side === "SELL";

  return (
    <div className="min-h-screen bg-ob-dark">
      <Navbar />

      <section className="bg-gradient-to-br from-ob-dark via-ob-dark to-ob-dark-2 pb-20 pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* ============ 1 · SIGNAL HEADER CONTROL ============ */}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Asset dropdown */}
            <div className="relative">
              <button
                onClick={() => setAssetOpen((v) => !v)}
                className="inline-flex w-full sm:w-auto items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-left transition-colors hover:border-ob-lime/40"
              >
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-ob-lime/15 text-ob-lime">
                    <BarChart3 className="h-4 w-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-[Montserrat] text-sm font-bold text-white">{snap.asset}</span>
                    <span className="block text-[10px] text-white/50">
                      {ASSETS.find((a) => a.s === asset)?.label}
                    </span>
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${assetOpen ? "rotate-180" : ""}`} />
              </button>
              {assetOpen && (
                <div className="absolute z-30 mt-2 w-full sm:w-64 overflow-hidden rounded-xl border border-white/10 bg-ob-dark-2 shadow-2xl">
                  {ASSETS.map((a) => (
                    <button
                      key={a.s}
                      onClick={() => { setAsset(a.s); setAssetOpen(false); refresh(a.s); }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 ${
                        a.s === asset ? "text-ob-lime" : "text-white/80"
                      }`}
                    >
                      <span className="font-semibold">{a.s}</span>
                      <span className="text-[11px] text-white/40">{a.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timeframe tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
              {(["M15", "H1", "H4"] as TF[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTf(t)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                    tf === t ? "bg-ob-lime text-ob-dark shadow" : "text-white/60 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Auto-refresh toggle + status badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setAutoRefresh((v) => !v)}
                aria-pressed={autoRefresh}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  autoRefresh
                    ? "border-ob-lime/40 bg-ob-lime/10 text-ob-lime"
                    : "border-white/15 bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {autoRefresh ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                Auto
                <span className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${autoRefresh ? "bg-ob-lime" : "bg-white/20"}`}>
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-ob-dark transition-transform ${autoRefresh ? "translate-x-3.5" : "translate-x-0.5"}`} />
                </span>
              </button>

              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                autoRefresh ? "border-ob-lime/40 bg-ob-lime/10" : "border-amber-400/30 bg-amber-400/10"
              }`}>
                <span className="relative inline-flex h-2 w-2">
                  {autoRefresh && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ob-lime opacity-75" />}
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${autoRefresh ? "bg-ob-lime" : "bg-amber-400"}`} />
                </span>
                <span className={`font-mono text-xs font-bold tracking-wider ${autoRefresh ? "text-ob-lime" : "text-amber-300"}`}>
                  {autoRefresh ? "LIVE" : "PAUSED"}
                </span>
              </div>
            </div>
          </div>

          {/* ============ 2 · CURRENT SIGNAL HERO PANEL ============ */}
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            {/* Signal status */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                <Activity className="h-3.5 w-3.5 text-ob-lime" />
                Current Signal · {snap.asset} · {tf}
              </div>

              <div
                className={`mt-4 font-[Montserrat] text-5xl sm:text-6xl font-black tracking-tight animate-pulse ${
                  isSell ? "text-[#E0115F]" : "text-ob-lime"
                }`}
                style={{ textShadow: isSell ? "0 0 30px rgba(224,17,95,0.45)" : "0 0 30px rgba(176,232,58,0.4)" }}
              >
                {isSell ? "SELL NOW" : "BUY NOW"}
              </div>

              <div className="mt-2 font-mono text-sm text-white/55">
                QiPrime Intelligent Flow Engine v2.0
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => refresh()}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-ob-lime px-6 py-3 text-sm font-semibold text-ob-dark transition-all hover:bg-ob-lime/90 active:scale-[0.98]"
                >
                  <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  Refresh Data
                </button>
                <button
                  onClick={copySignal}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
                >
                  {copied ? <Check className="h-4 w-4 text-ob-lime" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Signal"}
                </button>
              </div>
            </div>

            {/* AI Score ring */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                <Gauge className="h-3.5 w-3.5 text-ob-lime" /> AI Score Breakdown
              </div>
              <ScoreRing score={snap.aiScore} />
              <div className="mt-2 text-center text-xs text-white/55">
                Đồng thuận 6 AI Agents · Ngưỡng kích hoạt ≥ 70
              </div>
            </div>
          </div>

          {/* ============ 3 · EXECUTION PARAMETERS GRID ============ */}
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-5">
            <ParamCell label="ENTRY" value={fmt(snap.entry, snap.digits)} valueClass="text-white" />
            <ParamCell label="STOP LOSS" value={fmt(snap.sl, snap.digits)} valueClass="text-rose-300" />
            <ParamCell label="TP 1 (1:1)" value={fmt(snap.tp1, snap.digits)} valueClass="text-ob-lime" />
            <ParamCell label="TP 2 (1:2)" value={fmt(snap.tp2, snap.digits)} valueClass="text-emerald-500" />
            <ParamCell
              label="LAST UPDATE"
              value={`${timeStr}`}
              sub={`${secondsAgo}s ago`}
              valueClass="text-white/90 text-base sm:text-lg"
            />
          </div>

          {/* ============ 4 · MULTI-LAYER MARKET ANALYTICS ============ */}
          <div className="mt-8 mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ob-lime-2">
            <Layers className="h-4 w-4" /> Multi-Layer Market Analytics · {tf}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* LAYER 1 — TREND GATE */}
            <AnalyticsCard
              tag="LAYER 1"
              title="Trend Gate (H4 EMA)"
              icon={<TrendingDown className="h-4 w-4" />}
            >
              <EmaRow label="EMA 21" value={fmt(snap.ema21, snap.digits)} />
              <EmaRow label="EMA 50" value={fmt(snap.ema50, snap.digits)} />
              <EmaRow label="EMA 200" value={fmt(snap.ema200, snap.digits)} />
              <div className={`mt-3 rounded-lg border px-3 py-2 text-[11px] font-bold tracking-wide ${
                isSell ? "border-rose-500/30 bg-rose-500/10 text-rose-300" : "border-ob-lime/30 bg-ob-lime/10 text-ob-lime"
              }`}>
                {snap.gate}
              </div>
            </AnalyticsCard>

            {/* LAYER 3 — STOCHASTIC TRIGGER */}
            <AnalyticsCard
              tag="LAYER 3"
              title="Stochastic Trigger (H4)"
              icon={<Waves className="h-4 w-4" />}
            >
              <div className="grid grid-cols-2 gap-3">
                <Stat label="STOCH %K" value={snap.stochK.toFixed(1)} />
                <Stat label="STOCH %D" value={snap.stochD.toFixed(1)} />
              </div>
              <div className="mt-3 rounded-lg border border-ob-lime/30 bg-ob-lime/10 px-3 py-2 text-[11px] font-bold tracking-wide text-ob-lime">
                {snap.stochLabel}
              </div>
            </AnalyticsCard>

            {/* LAYER 4 — ORDER FLOW */}
            <AnalyticsCard
              tag="LAYER 4"
              title="Order Flow"
              icon={<Activity className="h-4 w-4" />}
            >
              <div className="space-y-1.5 text-[11px]">
                <FlowRow k="FLOW" v={snap.flowLabel} />
                <FlowRow k="DELTA" v={snap.deltaLabel} />
                <FlowRow k="POWER" v={snap.powerLabel} />
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span className="text-ob-lime">BUY {snap.buyPressure.toFixed(1)}</span>
                  <span className="text-rose-300">SELL {snap.sellPressure.toFixed(1)}</span>
                </div>
                <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-ob-lime transition-all duration-700" style={{ width: `${snap.buyPressure}%` }} />
                  <div className="h-full bg-rose-400 transition-all duration-700" style={{ width: `${snap.sellPressure}%` }} />
                </div>
              </div>
            </AnalyticsCard>

            {/* RSI BLOCK */}
            <AnalyticsCard
              tag="MOMENTUM"
              title="RSI (H4)"
              icon={<TrendingUp className="h-4 w-4" />}
            >
              <div className="flex items-end gap-2">
                <span className={`font-mono text-4xl font-bold ${snap.rsi < 50 ? "text-rose-300" : "text-ob-lime"}`}>
                  {snap.rsi.toFixed(1)}
                </span>
                <span className="mb-1 text-[11px] text-white/60">{snap.rsiLabel}</span>
              </div>
              <div className="relative mt-4 h-2 rounded-full bg-gradient-to-r from-emerald-500/40 via-white/10 to-rose-500/40">
                <div className="absolute inset-y-0 left-[30%] w-px bg-white/30" />
                <div className="absolute inset-y-0 left-[70%] w-px bg-white/30" />
                <div
                  className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ob-dark bg-white shadow"
                  style={{ left: `${snap.rsi}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider text-white/40">
                <span>Oversold 30</span>
                <span>Overbought 70</span>
              </div>
            </AnalyticsCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

function ScoreRing({ score }: { score: number }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const dash = circ * pct;
  const color = score >= 70 ? "#b0e83a" : score >= 45 ? "#f5b942" : "#E0115F";
  return (
    <div className="relative mt-4 h-44 w-44">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">AI Score</span>
        <span className="text-[10px] text-white/35">/ 100</span>
      </div>
    </div>
  );
}

function ParamCell({ label, value, sub, valueClass = "text-white" }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div className="bg-ob-dark p-4 sm:p-5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-white/45">{label}</div>
      <div className={`mt-1.5 font-mono text-xl sm:text-2xl font-bold ${valueClass}`}>{value}</div>
      {sub && <div className="mt-0.5 font-mono text-[11px] text-ob-lime">{sub}</div>}
    </div>
  );
}

function AnalyticsCard({ tag, title, icon, children }: { tag: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-ob-lime/30 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ob-lime-2">{tag}</span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ob-lime/15 text-ob-lime">{icon}</span>
      </div>
      <h3 className="mt-2 font-[Montserrat] text-sm font-bold text-white">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function EmaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-1.5 text-xs">
      <span className="text-white/55">{label}</span>
      <span className="font-mono font-semibold text-white/90">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-center">
      <div className="font-mono text-[9px] uppercase tracking-wider text-white/45">{label}</div>
      <div className="mt-1 font-mono text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function FlowRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-white/45">{k}</span>
      <span className="font-semibold text-white/90">{v}</span>
    </div>
  );
}
