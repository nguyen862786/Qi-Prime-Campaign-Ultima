/**
 * Temporary Dev Preview bypass.
 *
 * Active ONLY in non-production builds OR on the Lovable preview host
 * (`id-preview--*.lovable.app`). The published custom domain and the
 * live `masterib.lovable.app` URL keep full auth protection.
 *
 * Toggled by the floating "🔓 Dev Preview: Open All Pages" badge.
 */

const STORAGE_KEY = "qp_dev_bypass";

export function isDevPreviewEnv(): boolean {
  // Production build on the official live domain → bypass fully disabled.
  if (import.meta.env.PROD) {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    // Preview builds are still hosted under id-preview--*.lovable.app.
    return host.startsWith("id-preview--") || host.includes(".sandbox.lovable.dev");
  }
  return true;
}

export function isBypassActive(): boolean {
  if (!isDevPreviewEnv()) return false;
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setBypassActive(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (on) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const MOCK_BYPASS_USER = {
  id: "dev-bypass-user",
  email: "dev-preview@qiprime.local",
  role: "admin" as const,
  membership_status: "vip" as const,
  full_name: "Dev Preview Reviewer",
};