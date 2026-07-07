const PARTNERS = [
  "ICMarkets",
  "Exness",
  "Pepperstone",
  "FBS",
  "XM Global",
  "Tickmill",
  "Vantage",
  "FP Markets",
  "OctaFX",
  "Admirals",
  "HFM",
  "RoboForex",
];

export function PartnerMarquee() {
  const loop = [...PARTNERS, ...PARTNERS];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-white/[0.02] py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-primary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-primary to-transparent" />
      <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
        Verified Institutional Brokers · Trusted Liquidity Partners
      </div>
      <div className="flex w-max marquee-track gap-8 sm:gap-14 whitespace-nowrap">
        {loop.map((name, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold tracking-wide text-white/80"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-ob-lime" />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}