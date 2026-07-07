import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Crown, Sparkles } from "lucide-react";
import { submitIBAudit } from "@/lib/ib.functions";

type Step = 1 | 2 | 3;

const TEAM_OPTIONS = [
  { v: "lt50", label: "< 50 thành viên" },
  { v: "50_200", label: "50 — 200 thành viên" },
  { v: "gt200", label: "> 200 thành viên" },
] as const;
const VOLUME_OPTIONS = [
  { v: "lt100", label: "< 100 Lots / tháng" },
  { v: "100_500", label: "100 — 500 Lots / tháng" },
  { v: "gt500", label: "> 500 Lots / tháng" },
] as const;
const BROKER_OPTIONS = ["Exness", "IC Markets", "XM", "Other / Multi-broker"] as const;

export function IBFunnelWizard() {
  const submit = useServerFn(submitIBAudit);
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tier: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    phone_zalo: "",
    media_channel: "",
    team_size_bucket: "" as "" | "lt50" | "50_200" | "gt200",
    monthly_volume_bucket: "" as "" | "lt100" | "100_500" | "gt500",
    brokers: [] as string[],
  });

  const toggleBroker = (b: string) => {
    setForm((f) => ({
      ...f,
      brokers: f.brokers.includes(b) ? f.brokers.filter((x) => x !== b) : [...f.brokers, b],
    }));
  };

  const canStep1 = form.full_name.trim().length >= 2 && form.phone_zalo.trim().length >= 6;
  const canStep2 = form.team_size_bucket && form.monthly_volume_bucket;

  const handleSubmit = async () => {
    setErr(null); setLoading(true);
    try {
      const r = await submit({ data: { ...form, media_channel: form.media_channel || null } });
      if (!r.ok) { setErr(r.error || "Submission failed"); return; }
      setResult({ tier: r.tier });
    } catch (e: any) {
      setErr(e?.message || "Submission failed");
    } finally { setLoading(false); }
  };

  if (result?.tier === "elite") {
    return (
      <div className="rounded-3xl border-2 border-ob-lime bg-gradient-to-br from-ob-dark to-[#15294a] p-8 sm:p-10 text-center shadow-2xl shadow-ob-lime/20">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ob-lime mb-4">
          <Crown className="h-7 w-7 text-ob-dark" />
        </div>
        <h3 className="font-[Montserrat] text-2xl sm:text-3xl font-bold text-white">
          Hồ Sơ Cấp Cao Đã Được Phê Duyệt
        </h3>
        <p className="mt-4 text-white/80 max-w-xl mx-auto">
          Sáng lập <span className="text-ob-lime font-semibold">Nguyen Duy Quang</span> sẽ trực tiếp kết nối 1:1 với anh/chị trong <strong>30 phút</strong>. Vui lòng giữ điện thoại sẵn sàng.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 sm:p-10 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ob-lime/20 mb-4">
          <Check className="h-7 w-7 text-ob-lime" />
        </div>
        <h3 className="font-[Montserrat] text-2xl font-bold text-white">Đã ghi nhận hồ sơ</h3>
        <p className="mt-3 text-white/70 max-w-md mx-auto">
          Bộ tài liệu Partner Marketing Kit đã được kích hoạt. Đội ngũ Qi Prime sẽ liên hệ trong 24 giờ làm việc.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${n <= step ? "bg-ob-lime" : "bg-white/10"}`} />
            <div className="mt-1.5 text-[10px] font-medium text-white/60">BƯỚC {n} / 3</div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-[Montserrat] text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-ob-lime" /> Xác Minh Cơ Bản
          </h3>
          <Field label="Họ và Tên *">
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputCls} placeholder="Nguyễn Văn A" maxLength={120} />
          </Field>
          <Field label="Số Điện Thoại / Zalo ID *">
            <input value={form.phone_zalo} onChange={(e) => setForm({ ...form, phone_zalo: e.target.value })} className={inputCls} placeholder="+84 xxx xxx xxx" maxLength={40} />
          </Field>
          <Field label="Kênh Media Chính (tuỳ chọn)">
            <input value={form.media_channel} onChange={(e) => setForm({ ...form, media_channel: e.target.value })} className={inputCls} placeholder="https://facebook.com/..." maxLength={255} />
          </Field>
          <NavRow next={() => setStep(2)} canNext={!!canStep1} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-[Montserrat] text-xl font-bold text-white">Quy Mô Hệ Thống</h3>
          <Field label="Quy mô đội ngũ hiện tại *">
            <RadioGrid options={TEAM_OPTIONS} value={form.team_size_bucket} onChange={(v) => setForm({ ...form, team_size_bucket: v as any })} />
          </Field>
          <Field label="Ước tính khối lượng tháng *">
            <RadioGrid options={VOLUME_OPTIONS} value={form.monthly_volume_bucket} onChange={(v) => setForm({ ...form, monthly_volume_bucket: v as any })} />
          </Field>
          <NavRow back={() => setStep(1)} next={() => setStep(3)} canNext={!!canStep2} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h3 className="font-[Montserrat] text-xl font-bold text-white">Sàn Đang Theo Dõi</h3>
          <p className="text-sm text-white/60">Chọn các sàn anh/chị đang sử dụng (có thể chọn nhiều):</p>
          <div className="grid grid-cols-2 gap-2">
            {BROKER_OPTIONS.map((b) => {
              const active = form.brokers.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBroker(b)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${active ? "border-ob-lime bg-ob-lime/10 text-white" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  <span>{b}</span>
                  {active && <Check className="h-4 w-4 text-ob-lime" />}
                </button>
              );
            })}
          </div>
          {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-300">{err}</div>}
          <NavRow back={() => setStep(2)} submit={handleSubmit} loading={loading} />
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-ob-lime focus:outline-none focus:ring-1 focus:ring-ob-lime/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>
      {children}
    </label>
  );
}

function RadioGrid({ options, value, onChange }: { options: readonly { v: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${value === o.v ? "border-ob-lime bg-ob-lime/10 text-white" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NavRow({ back, next, submit, canNext, loading }: { back?: () => void; next?: () => void; submit?: () => void; canNext?: boolean; loading?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {back ? (
        <button type="button" onClick={back} className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10">Quay lại</button>
      ) : <span />}
      {submit ? (
        <button type="button" disabled={loading} onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-ob-lime px-6 py-2.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-50">
          {loading ? "Đang gửi..." : "Hoàn Tất Hồ Sơ"} <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <button type="button" disabled={!canNext} onClick={next} className="inline-flex items-center gap-2 rounded-full bg-ob-lime px-6 py-2.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-40 disabled:cursor-not-allowed">
          Tiếp tục <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}