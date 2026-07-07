import { Wallet, Target, Zap, LineChart, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Instant Funding",
    description:
      "Get funded up to $500K in minutes. No evaluation delays, start trading immediately.",
  },
  {
    icon: Target,
    title: "Clear Targets",
    description:
      "Transparent profit targets with achievable milestones and instant upgrades.",
  },
  {
    icon: Zap,
    title: "Fast Execution",
    description:
      "Low-latency infrastructure with direct market access for optimal fills.",
  },
  {
    icon: LineChart,
    title: "Advanced Analytics",
    description:
      "Real-time performance dashboards, trade journaling, and detailed analytics.",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description:
      "Bank-grade encryption and segregated accounts for maximum fund security.",
  },
  {
    icon: Globe,
    title: "Global Markets",
    description:
      "Trade Forex, Indices, Commodities, and Crypto from a single account.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-[Montserrat] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built For <span className="text-accent">Serious Traders</span>
          </h2>
          <p className="mt-4 text-lg text-[#1F2937] font-medium">
            Everything you need to succeed — from instant funding to advanced
            analytics.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-[Montserrat] text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-[#1F2937] font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
