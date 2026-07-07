import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the challenge work?",
    answer:
      "You pay a one-time fee to access a virtual trading account. Meet the profit target within the time limit while following our risk rules, and you'll receive a funded account. There are no recurring fees — ever.",
  },
  {
    question: "How quickly can I get paid?",
    answer:
      "Once you have a funded account, you can request a payout anytime you've reached the minimum threshold. Most payouts are processed within 24 hours to your bank account or crypto wallet.",
  },
  {
    question: "What markets can I trade?",
    answer:
      "We support Forex pairs, major Indices, Commodities (Gold, Oil), and select Cryptocurrencies. All from a single account with 1:100 leverage.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes. If you don't place any trades within 14 days of purchase, you can request a full refund, no questions asked.",
  },
  {
    question: "Can I scale up my account?",
    answer:
      "Absolutely. Hit a 10% profit target on your funded account and we'll double your capital, up to a maximum of $500,000.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-[Montserrat] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked{" "}
            <span className="text-accent">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-[#1F2937] font-medium">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-[Montserrat] font-semibold text-card-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#1F2937] font-medium transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-[#1F2937] font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
