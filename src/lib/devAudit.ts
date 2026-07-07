import { supabase } from "@/integrations/supabase/client";

export type DevAuditEvent =
  | "dev_mode_on"
  | "dev_mode_off"
  | "role_sim"
  | "viewport_sim"
  | "inspect_toggle"
  | "fresh_session"
  | "cms_inspect";

// Lightweight in-memory dedupe so rapid hover spam doesn't flood the table.
const lastSent = new Map<string, number>();

export async function logDevAudit(
  event: DevAuditEvent,
  payload: Record<string, unknown> = {},
  opts: { dedupeMs?: number } = {},
) {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const dedupeMs = opts.dedupeMs ?? 0;
    if (dedupeMs > 0) {
      const key = `${event}:${JSON.stringify(payload)}`;
      const now = Date.now();
      const prev = lastSent.get(key) ?? 0;
      if (now - prev < dedupeMs) return;
      lastSent.set(key, now);
    }

    const route = typeof window !== "undefined" ? window.location.pathname : null;
    await supabase.from("dev_audit_log").insert({
      user_id: u.user.id,
      event_type: event,
      payload: payload as never,
      route,
    });
  } catch {
    // best-effort; never throw to the UI
  }
}