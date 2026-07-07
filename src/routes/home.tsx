import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/HeroSection";
import { TopBanner } from "@/components/global/TopBanner";
import { SplashPopup } from "@/components/global/SplashPopup";
import { MidCarousel } from "@/components/global/MidCarousel";
import { IntegratedMetricsBar } from "@/components/home/IntegratedMetricsBar";
import { ProblemsSection } from "@/components/home/ProblemsSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { AboutSplitSection } from "@/components/home/AboutSplitSection";
import { NumberStatsRow } from "@/components/home/NumberStatsRow";
import { ServicesGridSection } from "@/components/home/ServicesGridSection";
import { UseCasesSection } from "@/components/home/UseCasesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Qi Prime — Forex AI Ecosystem & Master IB Network" },
      { name: "description", content: "Trading Era 4.0: automated discipline through institutional risk engineering. 6 AI agents, hybrid multi-grid EA, and transparent technology performance-sharing for the Master IB network." },
      { property: "og:title", content: "Qi Prime — Forex AI Ecosystem" },
      { property: "og:description", content: "Eliminate emotional trading. Frictionless passive yield + institutional Master IB network leverage." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <main>
        <HeroSection />
        <IntegratedMetricsBar />
        <ProblemsSection />
        <PillarsSection />
        <MidCarousel />
        <UseCasesSection />
        <AboutSplitSection />
        <NumberStatsRow />
        <ServicesGridSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <SplashPopup />
    </div>
  );
}
