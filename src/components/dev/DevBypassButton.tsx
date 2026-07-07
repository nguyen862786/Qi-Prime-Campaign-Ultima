import { useEffect, useState } from "react";
import { Unlock, Lock } from "lucide-react";
import { isDevPreviewEnv, isBypassActive, setBypassActive } from "@/lib/devBypass";

/**
 * Floating "🔓 Dev Preview: Open All Pages" badge.
 * Auto-unmounts on production builds served from the live domain.
 */
export function DevBypassButton() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isBypassActive());
  }, []);

  if (!mounted) return null;
  if (!isDevPreviewEnv()) return null;

  const toggle = () => {
    const next = !enabled;
    setBypassActive(next);
    setEnabled(next);
    // Reload so route guards and admin checks re-evaluate cleanly.
    setTimeout(() => window.location.reload(), 50);
  };

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[10000] pointer-events-none"
      style={{ top: 8 }}
    >
      <button
        onClick={toggle}
        className={`pointer-events-auto flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-lg backdrop-blur transition-all ${
          enabled
            ? "bg-ob-lime text-ob-dark ring-2 ring-ob-lime/40"
            : "bg-black/70 text-white ring-1 ring-white/20 hover:bg-black/85"
        }`}
        title="Temporary preview-only bypass. Disabled on the live domain."
      >
        {enabled ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
        {enabled ? "🔓 Dev Preview: All Pages Unlocked" : "🔓 Dev Preview: Open All Pages"}
      </button>
    </div>
  );
}