import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Check, ShieldCheck, Sparkles, Activity, Lock } from "lucide-react";
import { toast, Toaster } from "sonner";

import { submitSurveyLead } from "@/lib/survey.functions";
import { PREMIUM_PORTFOLIO, resolveTier } from "@/lib/survey.constants";
import { cn } from "@/lib/utils";
import heroTrader from "@/assets/hero-trader.jpg";

export const Route = createFileRoute("/survey-audit")({
  head: () => ({
    meta: [
      { title: "Khảo Sát Kỷ Luật & Kiểm Toán Tài Khoản — Qi Prime" },
      {
        name: "description",
        content:
          "Hoàn thành bài trắc nghiệm 60 giây để chẩn đoán tài khoản và nhận vé mời tham gia Cộng đồng VIP Qi Prime hoàn toàn miễn phí.",
      },
      { property: "og:title", content: "Khảo Sát Kỷ Luật & Kiểm Toán Tài Khoản — Qi Prime" },
      {
        property: "og:description",
        content:
          "Kỷ Nguyên Giao Dịch 4.0: Tăng xác suất thành công trên 70% bằng 6 AI Agent của hệ sinh thái Qi Prime.",
      },
    ],
  }),
  component: SurveyAuditPage,
});

const EXPERIENCE = [
  "Dưới 1 năm (Mới tham gia thị trường / Đang tìm hiểu)",
  "Từ 1 - 3 năm (Đã có kinh nghiệm thực chiến cá nhân)",
  "Trên 3 năm (Giao dịch lâu năm / Muốn tiến lên chuyên nghiệp)",
] as const;

const BROKERS = ["Exness", "IC Markets", "XM / FXCM", "Sàn Khác"] as const;

const PORTFOLIOS = [
  "Dưới $1,000 USD (Phân khúc Retail Trader)",
  "Từ $1,000 - $10,000 USD (Tài khoản giao dịch chủ lực)",
  "Trên $10,000 USD [Very VIP]",
] as const;


const METHODS = [
  "Giao dịch theo Chỉ báo kỹ thuật cơ bản (RSI, MACD, MA, Bollinger Bands...)",
  "Giao dịch theo Price Action (Mô hình nến, Hỗ trợ & Kháng cự thủ công)",
  "Giao dịch theo Phương pháp Thể chế (SMC, ICT, Wyckoff, Dòng tiền Volume Profile)",
  "Chưa có phương pháp cố định (Đánh theo cảm tính, tâm linh hoặc theo tin tức đám đông)",
] as const;

const TRAININGS = [
  "Đã từng học các khóa học chuyên sâu có thu phí",
  "Tự học hoàn toàn qua YouTube, Tiktok và các hội nhóm mạng xã hội",
  "Chưa từng qua đào tạo, vừa đánh vừa tự rút kinh nghiệm",
] as const;

const DRAWDOWNS = [
  "Mức độ 1: Tâm lý lo sợ, hay chốt non lệnh xanh do hoảng loạn, hiệu suất không đều.",
  "Mức độ 2: Thường xuyên gồng lỗ vô hạn, đổi Stop Loss thủ công, nhồi lệnh trả thù thị trường (Revenge Trading) dẫn đến sụt giảm vốn nặng.",
  "Mức độ 3: Không có bất kỳ kỷ luật quản lý vốn nào, gồng cháy tài khoản, mệt mỏi vì phải dán mắt vào màn hình 24/7.",
] as const;

const NEEDS = [
  "Hệ thống thông tin, kiến thức chuẩn và các khóa học đào tạo kỹ thuật thực chiến bài bản.",
  "Các buổi Offline giao lưu và các buổi Zoom chiến lược hàng tuần cùng đội ngũ chuyên gia.",
  "Tổng hợp thông tin thị trường chuyên sâu 3 lần/ngày ngay trước thềm mở các phiên Á, Âu, Mỹ.",
  "Hệ thống chỉ báo tự động phát hiện điểm Entry, TP, SL tối ưu được rà quét liên tục bởi 6 Trợ lý AI Agents (Nâng xác suất thắng >70%).",
  "Hệ thống Robot (Bot EA) giao dịch tự động hoặc bán tự động theo phong cách cá nhân, bắt buộc kiểm soát tỷ lệ rủi ro (Stop Loss) cố định từ 10% - 30% thiết lập trước theo khẩu vị an toàn.",
] as const;

type FormState = {
  experience: string;
  broker: string;
  portfolio_size: string;
  method: string;
  training: string;
  drawdown_level: string;
  needs: string[];
  full_name: string;
  contact: string;
  email: string;
  agreed: boolean;
};

const INITIAL_FORM: FormState = {
  experience: "",
  broker: "",
  portfolio_size: "",
  method: "",
  training: "",
  drawdown_level: "",
  needs: [],
  full_name: "",
  contact: "",
  email: "",
  agreed: false,
};

function SurveyAuditPage() {
  const submit = useServerFn(submitSurveyLead);
  const [step, setStep] = useState<1 | 2 | 3 | "thanks">(1);
  const [tier, setTier] = useState<"premium" | "introductory">("introductory");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const step1Valid =
    form.experience !== "" &&
    form.broker !== "" &&
    form.portfolio_size !== "" &&
    form.method !== "" &&
    form.training !== "" &&
    form.drawdown_level !== "";
  const step2Valid = form.needs.length > 0;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const step3Valid =
    form.full_name.trim().length > 0 &&
    form.contact.trim().length >= 6 &&
    emailOk &&
    form.agreed;

  const toggleNeed = (value: string) => {
    setForm((f) => ({
      ...f,
      needs: f.needs.includes(value)
        ? f.needs.filter((v) => v !== value)
        : [...f.needs, value],
    }));
  };

  const scrollToForm = () => {
    document.getElementById("audit-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async () => {
    if (!step3Valid || submitting) return;
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
          experience: form.experience,
          broker: form.broker,
          portfolio_size: form.portfolio_size,
          method: form.method,
          training: form.training,
          drawdown_level: form.drawdown_level,
          needs: form.needs,
          full_name: form.full_name,
          contact: form.contact,
          email: form.email,
          agreed: true as const,
        },
      });
      const resolvedTier = result?.tier ?? resolveTier(form.portfolio_size);
      setTier(resolvedTier);
      toast.success("Đã ghi nhận khảo sát. Đang mở cổng đặc quyền của bạn...");
      setStep("thanks");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Gửi khảo sát thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-[var(--slate-deep)] text-foreground">
      <Toaster theme="dark" position="top-center" />
      <NavBar />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:pt-16">
        {step !== "thanks" ? (
          <>
            <Hero onStart={scrollToForm} />

            <section id="audit-form" className="mt-16 scroll-mt-24 sm:mt-24">
              <GlassCard>
                <ProgressDots step={step} />

                {step === 1 && (
                  <StepShell
                    eyebrow="BƯỚC 01 / CHẨN ĐOÁN HIỆN TRẠNG"
                    title="Kiểm Toán Sức Khỏe Tài Khoản & Tâm Lý Giao Dịch"
                    description="Hãy trung thực nhìn nhận lại hạ tầng giao dịch hiện tại của bạn để tìm ra lỗ hổng gây sụt giảm tài khoản."
                  >
                    <Question label="1. Thâm niên giao dịch thực chiến của bạn trên thị trường Forex/XAUUSD là bao lâu?">
                      <div className="flex flex-col gap-2">
                        {EXPERIENCE.map((v) => (
                          <CheckCard
                            key={v}
                            label={v}
                            checked={form.experience === v}
                            radio
                            onClick={() => setForm({ ...form, experience: v })}
                          />
                        ))}
                      </div>
                    </Question>

                    <Question label="2. Tài khoản giao dịch của bạn hiện đang chạy trên sàn nào và số vốn là bao nhiêu?">
                      <div className="space-y-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/55">
                          Chọn sàn giao dịch
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                          {BROKERS.map((b) => (
                            <PillRadio
                              key={b}
                              label={b}
                              selected={form.broker === b}
                              onClick={() => setForm({ ...form, broker: b })}
                            />
                          ))}
                        </div>
                        <div className="pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/55">
                          Cột mốc vốn thực tế
                        </div>
                        <div className="flex flex-col gap-2">
                          {PORTFOLIOS.map((p) => (
                            <CheckCard
                              key={p}
                              label={p}
                              checked={form.portfolio_size === p}
                              radio
                              accent={p === PREMIUM_PORTFOLIO}
                              onClick={() => setForm({ ...form, portfolio_size: p })}
                            />
                          ))}
                        </div>
                      </div>
                    </Question>

                    <Question label="3. Phương pháp phân tích kỹ thuật chính bạn đang dùng để tìm điểm Entry là gì?">
                      <div className="flex flex-col gap-2">
                        {METHODS.map((v) => (
                          <CheckCard
                            key={v}
                            label={v}
                            checked={form.method === v}
                            radio
                            onClick={() => setForm({ ...form, method: v })}
                          />
                        ))}
                      </div>
                    </Question>

                    <Question label="4. Bạn đã từng tham gia một khóa học đào tạo bài bản, chính quy nào về kỹ thuật giao dịch chưa?">
                      <div className="flex flex-col gap-2">
                        {TRAININGS.map((v) => (
                          <CheckCard
                            key={v}
                            label={v}
                            checked={form.training === v}
                            radio
                            onClick={() => setForm({ ...form, training: v })}
                          />
                        ))}
                      </div>
                    </Question>

                    <Question label="5. Mức độ tổn thất và sụt giảm tài khoản (Drawdown) nặng nhất bạn từng trải qua do yếu tố con người?">
                      <div className="flex flex-col gap-2">
                        {DRAWDOWNS.map((v) => (
                          <CheckCard
                            key={v}
                            label={v}
                            checked={form.drawdown_level === v}
                            radio
                            onClick={() => setForm({ ...form, drawdown_level: v })}
                          />
                        ))}
                      </div>
                    </Question>

                    <StepNav
                      onNext={() => setStep(2)}
                      nextDisabled={!step1Valid}
                      nextLabel="Tiếp tục đến Checklist hạ tầng"
                    />
                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell
                    eyebrow="BƯỚC 02 / NHU CẦU ĐỔI MỚI"
                    title="Bộ Checklist Hạ Tầng Bạn Cần Để Thay Đổi Cục Diện"
                    description="Hãy tích chọn những giải pháp và công cụ bạn đang thiếu để Qi Prime hỗ trợ thiết lập."
                  >
                    <Question label="6. Để xây dựng một hành trình giao dịch an toàn và bền vững, bạn cần những gì từ hệ sinh thái Qi Prime? (Được tích chọn nhiều ô)">
                      <div className="flex flex-col gap-2">
                        {NEEDS.map((n) => (
                          <CheckCard
                            key={n}
                            label={n}
                            checked={form.needs.includes(n)}
                            onClick={() => toggleNeed(n)}
                          />
                        ))}
                      </div>
                    </Question>

                    <StepNav
                      onBack={() => setStep(1)}
                      onNext={() => setStep(3)}
                      nextDisabled={!step2Valid}
                      nextLabel="Kích hoạt đặc quyền"
                    />
                  </StepShell>
                )}

                {step === 3 && (
                  <StepShell
                    eyebrow="BƯỚC 03 / ĐĂNG KÝ ĐẶC QUYỀN MIỄN PHÍ"
                    title="Xác Thực Thông Tin Để Nhận Vé Mời Vào Nền Tảng"
                    description="Cung cấp thông tin chính xác để hệ thống lưu trữ tệp dữ liệu hỗ trợ kỹ thuật."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Họ và Tên" required>
                        <input
                          className={inputClass}
                          value={form.full_name}
                          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          maxLength={120}
                        />
                      </Field>
                      <Field label="Số điện thoại / Zalo ID" required>
                        <input
                          className={inputClass}
                          value={form.contact}
                          onChange={(e) => setForm({ ...form, contact: e.target.value })}
                          placeholder="+84 ..."
                          maxLength={80}
                        />
                      </Field>
                      <Field label="Địa chỉ Email" required hint="Nhận báo cáo thị trường">
                        <input
                          type="email"
                          className={inputClass}
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="ban@email.com"
                          maxLength={160}
                        />
                      </Field>
                    </div>

                    <div className="rounded-2xl border border-lime/25 bg-lime/[0.04] p-4 text-sm leading-relaxed text-foreground/85">
                      <div className="mb-2 flex items-center gap-2 text-lime">
                        <Lock className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Cam Kết Bảo Mật
                        </span>
                      </div>
                      Thông tin của bạn được mã hoá nội bộ và chỉ dùng để cấp quyền truy cập Cộng
                      đồng VIP Qi Prime, kích hoạt vé mời Bot EA và bản tin chiến lược 3 phiên/ngày.
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-lime/40">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                          form.agreed
                            ? "border-lime bg-lime text-lime-foreground"
                            : "border-white/30 bg-transparent"
                        )}
                      >
                        {form.agreed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={form.agreed}
                        onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                      />
                      <span className="text-sm leading-relaxed text-foreground/85">
                        Tôi muốn loại bỏ cảm xúc con người, tiếp cận hệ thống công nghệ AI Agent
                        của Qi Prime để nâng cấp hiệu suất giao dịch.
                      </span>
                    </label>

                    <StepNav
                      onBack={() => setStep(2)}
                      onNext={handleSubmit}
                      nextDisabled={!step3Valid || submitting}
                      nextLabel={
                        submitting
                          ? "Đang gửi…"
                          : "GỬI KHẢO SÁT & NHẬN QUYỀN TRUY CẬP MIỄN PHÍ"
                      }
                    />
                  </StepShell>
                )}
              </GlassCard>

              <TrustStrip />
            </section>
          </>
        ) : (
          <ThankYou tier={tier} name={form.full_name} />
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ---------------- UI primitives ---------------- */

const inputClass =
  "w-full rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-foreground placeholder:text-foreground/35 outline-none transition focus:border-lime/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-lime/30";

function NavBar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-lime text-lime-foreground">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-base font-extrabold tracking-tight">Qi Prime</span>
        </div>
      </div>
    </header>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-lime/15 blur-[120px]" />
        <div className="absolute right-0 top-32 h-[380px] w-[380px] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <LimeBadge>HỆ THỐNG KIỂM TOÁN TÀI KHOẢN MIỄN PHÍ</LimeBadge>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Kỷ Nguyên Giao Dịch 4.0: Tăng Xác Suất Thành Công{" "}
            <span className="text-lime">Trên 70% Bằng AI Agent</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-foreground/75 sm:text-lg">
            90% nhà đầu tư thua lỗ do bản ngã con người, FOMO và sụp đổ kỷ luật tâm lý. Hãy chuyển
            giao gánh nặng sang máy móc. Hệ sinh thái Qi Prime tích hợp{" "}
            <span className="text-foreground">6 trợ lý AI Agent chuyên biệt</span> giúp quét nhiễu
            thị trường, loại bỏ cảm xúc và nâng xác suất thắng lên hơn 70%. Hoàn thành bài trắc
            nghiệm 60 giây để chẩn đoán tài khoản và nhận vé mời tham gia{" "}
            <span className="text-lime">Cộng đồng VIP hoàn toàn MIỄN PHÍ</span>.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <PrimaryPill onClick={onStart}>Bắt Đầu Khảo Sát Kỷ Luật</PrimaryPill>
            <div className="font-mono-data text-xs uppercase tracking-[0.2em] text-foreground/55">
              ~ 60s · 3 bước
            </div>
          </div>
        </div>

        <HeroVisual />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="AI AGENTS" value="06" />
        <MetricCard label="WIN RATE" value=">70%" />
        <MetricCard label="UPTIME" value="24/5" />
        <MetricCard label="VIP ROOM" value="LIVE" />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-lime/20 via-transparent to-cyan-400/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-lime/80" />
          </div>
          <div className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            XAUUSD · LIVE TERMINAL
          </div>
          <div className="flex items-center gap-1.5 font-mono-data text-[10px] text-lime">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime shadow-[0_0_8px_var(--lime)]" />
            ON
          </div>
        </div>
        <div className="relative aspect-[4/3]">
          <img
            src={heroTrader}
            alt="Nhà giao dịch chuyên nghiệp Qi Prime đang giám sát biểu đồ XAUUSD trên hệ thống đa màn hình AI Agent"
            width={1280}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-lime/40 bg-background/70 px-2.5 py-1 font-mono-data text-[10px] font-semibold uppercase tracking-[0.22em] text-lime backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
            AI AGENT · ACTIVE
          </div>
          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
            <MiniStat label="XAU/USD" value="4,340.50" tone="lime" />
            <MiniStat label="WIN RATE" value="72.4%" tone="lime" />
            <MiniStat label="DRAWDOWN" value="-2.1%" tone="muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "lime" | "muted";
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/70 px-2.5 py-1.5 backdrop-blur-md">
      <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </div>
      <div
        className={cn(
          "font-mono-data text-sm font-semibold",
          tone === "lime" ? "text-lime" : "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </div>
      <div className="mt-1 font-mono-data text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function LimeBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-lime/35 bg-lime/15 px-3 py-1.5 font-mono-data text-[11px] font-semibold uppercase tracking-[0.22em] text-lime">
      <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_var(--lime)]" />
      {children}
    </span>
  );
}

function PrimaryPill({
  children,
  onClick,
  disabled,
  asLink,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  asLink?: boolean;
  href?: string;
}) {
  const cls =
    "group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-bold text-lime-foreground shadow-[0_8px_30px_-8px_var(--lime)] transition hover:bg-lime/90 disabled:cursor-not-allowed disabled:opacity-50";
  if (asLink && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2.5} />
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2.5} />
    </button>
  );
}

function GhostPill({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-foreground/80 transition hover:border-white/30 hover:bg-white/5 hover:text-foreground"
    >
      {icon}
      {children}
    </button>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] sm:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/10 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

function ProgressDots({ step }: { step: 1 | 2 | 3 | "thanks" }) {
  const active = step === "thanks" ? 4 : step;
  return (
    <div className="mb-8 flex items-center gap-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex flex-1 items-center gap-3">
          <span
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full font-mono-data text-xs font-bold transition",
              n <= active
                ? "bg-lime text-lime-foreground"
                : "border border-white/15 text-foreground/40"
            )}
          >
            {n < active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : n}
          </span>
          {n < 3 && (
            <span
              className={cn(
                "h-px flex-1 transition",
                n < active ? "bg-lime/60" : "bg-white/10"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono-data text-[11px] font-semibold uppercase tracking-[0.22em] text-lime">
          {eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-foreground/65 sm:text-base">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-foreground/90 sm:text-base">{label}</div>
      {children}
    </div>
  );
}

function PillRadio({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
        selected
          ? "border-lime bg-lime text-lime-foreground shadow-[0_6px_24px_-10px_var(--lime)]"
          : "border-white/15 bg-white/[0.03] text-foreground/80 hover:border-white/30 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function CheckCard({
  label,
  checked,
  onClick,
  radio,
  accent,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  radio?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm leading-relaxed transition",
        checked
          ? "border-lime/60 bg-lime/[0.08] text-foreground"
          : accent
            ? "border-lime/25 bg-lime/[0.03] text-foreground/85 hover:border-lime/50"
            : "border-white/10 bg-white/[0.02] text-foreground/80 hover:border-white/25"
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition",
          radio ? "rounded-full" : "rounded-md",
          checked ? "border-lime bg-lime text-lime-foreground" : "border-white/30"
        )}
      >
        {checked &&
          (radio ? (
            <span className="h-2 w-2 rounded-full bg-lime-foreground" />
          ) : (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ))}
      </span>
      <span>{label}</span>
    </button>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
        <span>
          {label}
          {required && <span className="ml-1 text-lime">*</span>}
        </span>
        {hint && <span className="font-mono-data normal-case tracking-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      {onBack ? (
        <GhostPill onClick={onBack} icon={<ArrowLeft className="h-4 w-4" />}>
          Quay lại
        </GhostPill>
      ) : (
        <span />
      )}
      <PrimaryPill onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </PrimaryPill>
    </div>
  );
}

function TrustStrip() {
  const items = useMemo(
    () => [
      { icon: ShieldCheck, label: "Bộ Lọc Rủi Ro Thể Chế" },
      { icon: Activity, label: "Giám Sát 24/5" },
      { icon: Sparkles, label: "6 AI Agent Hybrid" },
      { icon: Lock, label: "Master IB Xác Thực" },
    ],
    []
  );
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-foreground/75 backdrop-blur"
        >
          <it.icon className="h-4 w-4 text-lime" />
          {it.label}
        </div>
      ))}
    </div>
  );
}

function ThankYou({ tier, name }: { tier: "premium" | "introductory"; name: string }) {
  const first = name.trim().split(/\s+/).pop() ?? "Trader";
  return (
    <section className="pt-10 sm:pt-16">
      <LimeBadge>
        {tier === "premium" ? "CỔNG ƯU TIÊN VIP" : "ĐẶC QUYỀN ĐÃ KÍCH HOẠT"}
      </LimeBadge>

      <div className="mt-6">
        <GlassCard>
          {tier === "premium" ? (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                ĐÃ KÍCH HOẠT CỔNG ƯU TIÊN{" "}
                <span className="text-lime">KHÁCH HÀNG VIP</span>
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                {first}, hệ thống nhận diện quy mô vốn của bạn thuộc tệp Khách hàng Ưu tiên cao cấp
                cần cơ chế quản trị rủi ro thể chế đặc biệt. Để bảo mật thông tin và thiết lập lộ
                trình dòng tiền an toàn nhất, bạn được{" "}
                <span className="text-foreground">MIỄN TRỪ tham gia các group đại chúng</span>. Hệ
                thống đã cấp quyền cho bạn tham gia vào{" "}
                <span className="text-lime">Kênh Tín Hiệu Đặc Quyền Telegram</span> của Qi Prime.
              </p>
              <div className="rounded-2xl border border-lime/30 bg-lime/[0.05] p-5 text-sm leading-relaxed text-foreground/85 sm:text-base">
                <div className="mb-2 font-mono-data text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
                  Đặc Quyền Đặc Cách
                </div>
                Thiết lập tài khoản{" "}
                <span className="text-foreground">Master Copy Trade phòng thủ riêng biệt</span> (vốn
                tối thiểu $500, tỷ lệ 70/30, kiểm soát chặt chẽ rủi ro sụt giảm vốn an toàn) + May
                đo thông số cài đặt Bot Hybrid EA trực tiếp theo yêu cầu cá nhân.
              </div>
              <ChannelTimeline tier="premium" />
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryPill asLink href="https://t.me/qiprimevip">
                  THAM GIA GROUP TELEGRAM CỘNG ĐỒNG VIP →
                </PrimaryPill>
                <div className="font-mono-data text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Phản hồi · &lt; 30 phút
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                Kiểm Toán Thành Công! Cổng Truy Cập Hệ Sinh Thái{" "}
                <span className="text-lime">Đã Kích Hoạt.</span>
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                Chúc mừng {first}, bạn đã đủ điều kiện gia nhập Cộng đồng kỷ luật Qi Prime. Bạn được
                cấp quyền truy cập <span className="text-lime">hoàn toàn MIỄN PHÍ</span> các đặc
                quyền sau:
              </p>
              <ul className="space-y-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {[
                  "Quyền tham gia Nhóm Tín Hiệu Free (Quét xu hướng bởi 6 AI Agent, xác suất thắng >70%).",
                  "Bản tin tổng hợp thông tin thị trường chuyên sâu 3 lần/ngày đầu các phiên Á, Âu, Mỹ.",
                  "Suất trải nghiệm Bot EA tự động/bán tự động với rào chắn SL cố định 10–30% cá nhân hoá.",
                  "Kết nối Copy Trade với số vốn tối thiểu chỉ từ $500 USD (tỷ lệ chia sẻ lợi nhuận 70/30).",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime/20 text-lime">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="max-w-3xl text-sm leading-relaxed text-foreground/70 sm:text-base">
                Tất cả công cụ được thiết lập sẵn trên hệ thống sàn chuẩn đối tác để đảm bảo tốc độ
                khớp lệnh mượt mà nhất.
              </p>
              <ChannelTimeline tier="introductory" />
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryPill asLink href="https://zalo.me/">
                  Tham Gia Nhóm & Nhận Kích Hoạt Miễn Phí
                </PrimaryPill>
                <div className="font-mono-data text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Tự động xác minh · live
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}

function ChannelTimeline({ tier }: { tier: "premium" | "introductory" }) {
  const steps =
    tier === "premium"
      ? [
          { k: "01", t: "Tham gia Kênh Telegram", d: "Nhận tín hiệu và cập nhật phân tích thị trường thực thời." },
          { k: "02", t: "Thiết lập Master Copy", d: "Tài khoản phòng thủ riêng biệt, SL kiểm soát." },
          { k: "03", t: "May đo Hybrid EA", d: "Cấu hình Bot theo khẩu vị rủi ro cá nhân." },
        ]
      : [
          { k: "01", t: "Vào Nhóm Onboarding", d: "Nhận link duyệt vào cộng đồng kỹ thuật." },
          { k: "02", t: "Liên kết Tài khoản", d: "Hướng dẫn 3 phút theo Master IB link." },
          { k: "03", t: "Kích hoạt Đặc quyền", d: "Mở khoá EA + Phòng Tín hiệu VIP tức thì." },
        ];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {steps.map((s) => (
        <div
          key={s.k}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur"
        >
          <div className="font-mono-data text-xs font-semibold tracking-[0.2em] text-lime">
            {s.k}
          </div>
          <div className="mt-2 font-display text-base font-bold">{s.t}</div>
          <div className="mt-1 text-sm text-foreground/65">{s.d}</div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-xs text-foreground/55 sm:flex-row sm:items-center">
        <div className="font-mono-data tracking-[0.18em]">QI PRIME · BÀN KIỂM TOÁN</div>
        <div>Hệ thống bảo vệ vốn cho trader 24/5.</div>
      </div>
    </footer>
  );
}
