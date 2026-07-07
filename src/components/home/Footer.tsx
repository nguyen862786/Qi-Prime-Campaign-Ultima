import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PartnerMarquee } from "@/components/global/PartnerMarquee";

const OFFICIAL = {
  hotline: "078 9814946",
  telHref: "tel:0789814946",
  email: "partners@qiprime.ai",
  address: "Quốc gia: Việt Nam",
};

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Sự Kiện", href: "/su-kien" },
  { label: "QiSignals", href: "/qisignals" },
  { label: "Sản Phẩm", href: "/san-pham" },
  { label: "Đối Tác", href: "/doi-tac" },
  { label: "Học Viện", href: "/hoc-vien" },
] as const;

export function Footer() {
  return (
    <footer className="bg-primary border-t border-white/10">
      <PartnerMarquee />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center">
              <img
                src="/assets/qiprime-official-logo.png"
                alt="Qi Prime — Forex AI Ecosystem"
                className="h-28 w-40 object-contain"
              />
            </div>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Trading Era 4.0 — automated discipline through institutional risk engineering. AI-driven copy trade and Master IB infrastructure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-[Montserrat] font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-white/60 hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-[Montserrat] font-semibold text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {["Terms of Service", "Privacy Policy", "Risk Disclosure", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-sm text-white/60 hover:text-accent transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[Montserrat] font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 text-accent" />
                <a href={`mailto:${OFFICIAL.email}`} className="hover:text-accent break-all">{OFFICIAL.email}</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 text-accent" />
                <a href={OFFICIAL.telHref} className="hover:text-accent font-semibold">{OFFICIAL.hotline}</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>{OFFICIAL.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Qi Prime. All rights reserved.
          </p>
        </div>

        {/* Legal risk disclaimer */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <p className="text-[0.75rem] leading-relaxed text-[#64748B]">
            Cảnh báo rủi ro: Giao dịch ngoại hối, CFD và các sản phẩm phái sinh tài chính tiềm ẩn mức độ rủi ro cao và có thể không phù hợp với mọi nhà đầu tư. Hiệu suất trong quá khứ không đảm bảo kết quả trong tương lai. Bạn có thể mất toàn bộ vốn đã đầu tư. Hãy cân nhắc kỹ năng lực tài chính, mục tiêu và kinh nghiệm trước khi giao dịch. Qi Prime cung cấp công nghệ và hạ tầng giáo dục; không tư vấn đầu tư cá nhân hóa.
          </p>
        </div>
      </div>
    </footer>
  );
}
