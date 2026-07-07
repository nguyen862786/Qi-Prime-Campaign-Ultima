import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useLeadModal } from "@/components/forms/LeadModal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sự Kiện", href: "/su-kien" },
  { label: "QiSignals", href: "/qisignals" },
  { label: "Sản Phẩm", href: "/san-pham" },
  { label: "Đối Tác", href: "/doi-tac" },
  { label: "Học Viện", href: "/hoc-vien" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openLeadModal } = useLeadModal();

  return (
    <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Qi Prime">
            <img
              src="/assets/qiprime-official-logo.png"
              alt="Qi Prime — Forex AI Ecosystem"
              className="h-16 w-28 object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/auth"
              className="px-3 py-2 text-sm font-semibold text-white/90 hover:text-white transition-colors"
            >
              Đăng Nhập
            </Link>
            <button
              type="button"
              onClick={openLeadModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-colors"
            >
              Đăng Ký
            </button>
            <button
              type="button"
              onClick={openLeadModal}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-primary hover:bg-accent/90 transition-colors"
            >
              Tham Gia Hệ Sinh Thái
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-sm font-medium text-white/70 hover:text-white py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-white text-center transition-colors"
              >
                Đăng Nhập
              </Link>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); openLeadModal(); }}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold px-4 py-2.5 text-center shadow-lg shadow-emerald-500/25 transition-colors"
              >
                Đăng Ký
              </button>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); openLeadModal(); }}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-accent/90 text-center"
              >
                Tham Gia Hệ Sinh Thái
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
