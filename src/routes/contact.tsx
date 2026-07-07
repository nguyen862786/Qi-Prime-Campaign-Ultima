import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useAppSettings, telHref } from "@/hooks/useAppSettings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Qi Prime Master IB & Copy Trade Desk" },
      { name: "description", content: "Talk to the Qi Prime partner desk about Master IB access, copy-trade onboarding or AI tier trials. We reply within one business day." },
      { property: "og:title", content: "Contact Qi Prime" },
      { property: "og:description", content: "Master IB desk, copy-trade onboarding and AI tier trials." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const s = useAppSettings();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-ib-navy to-[#15294a] py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-ib-gold/15 border border-ib-gold/30 px-4 py-1.5 text-xs font-medium text-ib-gold mb-6 uppercase tracking-wider">
              Contact
            </div>
            <h1 className="font-[Montserrat] text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.05]">
              Access the <span className="text-ib-gold">Qi Prime</span> partner desk
            </h1>
            <p className="mt-6 text-base text-white/70 max-w-2xl mx-auto">
              Tell us about your network or capital and we'll respond within one business day with a tailored Master IB or copy-trade walkthrough.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <ContactCard icon={Mail} label="Email" value={s.system_email} href={`mailto:${s.system_email}`} />
              <ContactCard icon={Phone} label="Hotline" value={s.hotline} href={telHref(s.hotline)} />
              <ContactCard icon={MapPin} label="Văn phòng" value={s.office_address} clamp />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="lg:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" placeholder="Your name" />
              <Field label="Work email" name="email" type="email" placeholder="you@network.com" />
              </div>
              <Field label="Network / company" name="company" placeholder="Master IB pod, fund, brokerage…" />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-ib-navy">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Master IB volume, copy-trade AUM, or which AI tier you'd like to trial…"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ib-navy outline-none transition-colors focus:border-ib-gold focus:ring-2 focus:ring-ib-gold/20"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ib-gold px-8 py-3.5 text-sm font-semibold text-ib-navy shadow-lg shadow-ib-gold/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
              >
                {sent ? "Message sent" : "Send message"}
                <Send className="h-4 w-4" />
              </button>
              {sent && (
                <p className="text-sm text-ib-teal">Thanks — our team will respond within one business day.</p>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-ib-navy">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ib-navy outline-none transition-colors focus:border-ib-gold focus:ring-2 focus:ring-ib-gold/20"
      />
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href, clamp }: { icon: any; label: string; value: string; href?: string; clamp?: boolean }) {
  const Inner = (
    <div className="flex items-start gap-4 rounded-2xl bg-white border border-slate-200 p-5">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ib-navy shrink-0">
        <Icon className="h-5 w-5 text-ib-gold" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-[#374151] font-medium">{label}</div>
        <div className={`mt-1 font-semibold text-ib-navy break-words ${clamp ? "line-clamp-2" : ""}`}>{value}</div>
      </div>
    </div>
  );
  if (href) return <a href={href} className="block hover:opacity-90 transition">{Inner}</a>;
  return Inner;
}