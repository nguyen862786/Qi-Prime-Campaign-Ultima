import { UserPlus, Award, Banknote } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Choose Your Account",
    description:
      "Select from our range of account sizes from $10K to $500K. Pick the challenge that fits your trading style.",
  },
  {
    icon: Award,
    step: "02",
    title: "Pass the Challenge",
    description:
      "Meet the profit target while following our simple risk rules. No hidden conditions or complex requirements.",
  },
  {
    icon: Banknote,
    step: "03",
    title: "Start Earning",
    description:
      "Get funded instantly and keep up to 80% of your profits. Withdrawals processed within 24 hours.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-[Montserrat] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="mt-4 text-lg text-[#1F2937] font-medium">
            Three simple steps to becoming a funded trader.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              <div className="rounded-xl border border-border bg-background p-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center justify-center rounded-lg bg-accent/10 p-3">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-[Montserrat] text-5xl font-bold text-muted/50">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-6 font-[Montserrat] text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-[#1F2937] font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-border z-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
