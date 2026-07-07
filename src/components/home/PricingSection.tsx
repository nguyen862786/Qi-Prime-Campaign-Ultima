import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

const plans = [
  {
    name: "Starter",
    price: "$99",
    accountSize: "$10,000",
    description: "Perfect for beginners testing the waters.",
    features: [
      "$10K virtual account",
      "1:100 leverage",
      "80/20 profit split",
      "Daily payouts",
      "Basic analytics",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$299",
    accountSize: "$50,000",
    description: "Most popular choice for active traders.",
    features: [
      "$50K virtual account",
      "1:100 leverage",
      "80/20 profit split",
      "Same-day payouts",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Elite",
    price: "$599",
    accountSize: "$100,000",
    description: "For seasoned traders ready to scale.",
    features: [
      "$100K virtual account",
      "1:100 leverage",
      "85/15 profit split",
      "Instant payouts",
      "Premium analytics",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-[Montserrat] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Transparent{" "}
            <span className="text-accent">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-[#1F2937] font-medium">
            No hidden fees. One-time challenge fee, lifetime access.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-accent bg-primary text-primary-foreground"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold text-primary">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3
                  className={`font-[Montserrat] text-lg font-semibold ${
                    plan.popular ? "text-white" : "text-card-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span
                    className={`font-[Montserrat] text-4xl font-bold ${
                      plan.popular ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.popular ? "text-white/70" : "text-[#1F2937] font-medium"
                    }`}
                  >
                    /one-time
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${
                    plan.popular ? "text-accent" : "text-secondary"
                  }`}
                >
                  {plan.accountSize} Account
                </p>
                <p
                  className={`mt-2 text-sm ${
                    plan.popular ? "text-white/70" : "text-[#1F2937] font-medium"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 shrink-0 ${
                        plan.popular ? "text-accent" : "text-secondary"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-white/90" : "text-[#1F2937] font-medium"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to="/"
                  className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                    plan.popular
                      ? "bg-accent text-primary hover:bg-accent/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
