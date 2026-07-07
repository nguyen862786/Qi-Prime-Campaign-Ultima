import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Beaker, RefreshCw, Eye, EyeOff, Monitor, Tablet, Smartphone, X, ChevronDown } from "lucide-react";
import { setDevState, useDevState, type SimRole, type SimViewport } from "./devModeStore";
import { logDevAudit } from "@/lib/devAudit";
import { isBypassActive } from "@/lib/devBypass";

const ROLES: { id: SimRole; label: string; tone: string }[] = [
  { id: "guest",     label: "Guest / Retail Lead",  tone: "bg-white/10 text-white" },
  { id: "free",      label: "Customer · FREE",      tone: "bg-sky-400/15 text-sky-300" },
  { id: "vip",       label: "Customer · VIP",       tone: "bg-amber-300/15 text-amber-300" },
  { id: "master_ib", label: "Master IB",            tone: "bg-ob-lime/20 text-ob-lime" },
];

const VIEWPORTS: { id: SimViewport; label: string; w: number | null; icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop", w: null, icon: Monitor },
  { id: "tablet",  label: "Tablet",  w: 820,  icon: Tablet },
  { id: "mobile",  label: "Mobile",  w: 390,  icon: Smartphone },
];

export function DevReviewBar() {
  // Admin-only mount
  const { data: isAdmin } = useQuery({
    queryKey: ["dev_bar_admin_check"],
    queryFn: async () => {
      if (isBypassActive()) return true;
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const fetchRoles = async (): Promise<string[]> => {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.user!.id);
        if (error) return [];
        return (data ?? []).map((r: any) => r.role);
      };
      let roles = await fetchRoles();
      if (roles.length === 0) {
        await new Promise((r) => setTimeout(r, 800));
        roles = await fetchRoles();
      }
      return roles.includes("admin");
    },
    staleTime: 5 * 60_000,
  });

  const dev = useDevState();
  const [expanded, setExpanded] = useState(true);

  // Audit dev state transitions (skip first hydration tick)
  const lastRef = useState<{ on: boolean; role: SimRole; inspect: boolean; viewport: SimViewport } | null>(() => null);
  useEffect(() => {
    if (!isAdmin) return;
    const prev = lastRef[0];
    if (prev) {
      if (prev.on !== dev.on) logDevAudit(dev.on ? "dev_mode_on" : "dev_mode_off", {});
      if (prev.role !== dev.role) logDevAudit("role_sim", { from: prev.role, to: dev.role });
      if (prev.viewport !== dev.viewport) logDevAudit("viewport_sim", { from: prev.viewport, to: dev.viewport });
      if (prev.inspect !== dev.inspect) logDevAudit("inspect_toggle", { value: dev.inspect });
    }
    lastRef[1]({ on: dev.on, role: dev.role, inspect: dev.inspect, viewport: dev.viewport });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev.on, dev.role, dev.inspect, dev.viewport, isAdmin]);

  // Apply viewport sandbox via injected <style>
  useEffect(() => {
    const id = "qp-dev-viewport-style";
    let el = document.getElementById(id) as HTMLStyleElement | null;
    const vp = VIEWPORTS.find((v) => v.id === dev.viewport);
    if (!dev.on || !vp?.w) {
      el?.remove();
      return;
    }
    if (!el) { el = document.createElement("style"); el.id = id; document.head.appendChild(el); }
    el.textContent = `
      body { background: #050b14 !important; }
      body > * { max-width: ${vp.w}px !important; margin-left: auto !important; margin-right: auto !important; box-shadow: 0 0 0 1px rgba(180,223,81,0.25), 0 30px 80px -20px rgba(0,0,0,0.6); }
    `;
    return () => { /* keep until next change */ };
  }, [dev.on, dev.viewport]);

  const freshSession = () => {
    logDevAudit("fresh_session", {});
    // Wipe any client cooldowns / cached splash cookies
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("qp_") && k !== "qp_dev_state_v1")
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch {}
    // Hard reload to re-trigger splash + carousel
    window.location.reload();
  };

  if (!isAdmin) return null;

  // OFF state: tiny floating launcher
  if (!dev.on) {
    return (
      <button
        onClick={() => setDevState({ on: true })}
        className="fixed bottom-5 right-5 z-[200] inline-flex items-center gap-2 rounded-full bg-ob-lime px-4 py-2.5 text-xs font-bold text-ob-dark shadow-2xl ring-2 ring-ob-lime/30 hover:scale-105 transition-transform"
        title="Open Dev Review Mode"
      >
        <Beaker className="h-4 w-4" /> DEV MODE
      </button>
    );
  }

  const activeRole = ROLES.find((r) => r.id === dev.role)!;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] pointer-events-none">
      <div className="pointer-events-auto bg-ob-dark/95 backdrop-blur-md border-b-2 border-ob-lime/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-5 py-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 mr-1">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-ob-lime text-ob-dark">
                <Beaker className="h-3.5 w-3.5" />
              </span>
              <div className="leading-tight">
                <div className="font-[Montserrat] text-[11px] font-bold text-ob-lime tracking-wider">DEV REVIEW MODE</div>
                <div className="text-[9px] text-white/50 font-mono">admin · qiholding86</div>
              </div>
            </div>

            {expanded && (
              <>
                {/* Role simulator */}
                <Group label="Simulate Role">
                  <div className="flex flex-wrap gap-1">
                    {ROLES.map((r) => {
                      const active = dev.role === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setDevState({ role: r.id })}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all border ${active ? "bg-ob-lime text-ob-dark border-ob-lime" : "border-white/15 text-white/70 hover:text-white hover:border-white/40"}`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </Group>

                {/* Viewport sandbox */}
                <Group label="Viewport">
                  <div className="flex gap-1">
                    {VIEWPORTS.map((v) => {
                      const Icon = v.icon;
                      const active = dev.viewport === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setDevState({ viewport: v.id })}
                          title={v.label + (v.w ? ` (${v.w}px)` : "")}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium ${active ? "bg-ob-lime text-ob-dark" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                        >
                          <Icon className="h-3 w-3" /> {v.label}
                        </button>
                      );
                    })}
                  </div>
                </Group>

                {/* Inspect toggle */}
                <Group label="CMS Inspect">
                  <button
                    onClick={() => setDevState({ inspect: !dev.inspect })}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold ${dev.inspect ? "bg-amber-300 text-ob-dark" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                  >
                    {dev.inspect ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {dev.inspect ? "ON" : "OFF"}
                  </button>
                </Group>

                {/* Fresh session */}
                <Group label="Cooldowns">
                  <button
                    onClick={freshSession}
                    className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/90 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-rose-500"
                  >
                    <RefreshCw className="h-3 w-3" /> Simulate Fresh Session
                  </button>
                </Group>
              </>
            )}

            <div className="ml-auto flex items-center gap-1">
              <span className={`hidden md:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold ${activeRole.tone}`}>
                Rendering as · {activeRole.label}
              </span>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10"
                title={expanded ? "Collapse" : "Expand"}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`} />
              </button>
              <button
                onClick={() => setDevState({ on: false })}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10"
                title="Close Dev Mode"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* spacer so the bar doesn't cover content */}
      <div aria-hidden className="h-[52px]" />
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1">
      <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold whitespace-nowrap">{label}</span>
      {children}
    </div>
  );
}

/** Drop-in badge for CMS layers. Shows only when inspect mode is on. */
export function CmsInspectBadge({
  zone,
  isActive,
  targetUrl,
  extra,
}: {
  zone: string;
  isActive: boolean | null | undefined;
  targetUrl?: string | null;
  extra?: Record<string, string | number | null | undefined>;
}) {
  const dev = useDevState();
  const [hover, setHover] = useState(false);
  if (!dev.on || !dev.inspect) return null;

  const audit = () => {
    logDevAudit("cms_inspect", { zone, is_active: !!isActive, target_url: targetUrl ?? null, extra: extra ?? null }, { dedupeMs: 30_000 });
  };

  return (
    <div
      className="absolute top-2 left-2 z-[150]"
      onMouseEnter={() => { setHover(true); audit(); }}
      onMouseLeave={() => setHover(false)}
      onClick={() => { setHover((v) => !v); audit(); }}
    >
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold font-mono cursor-pointer shadow-lg backdrop-blur ${isActive ? "bg-ob-lime/95 text-ob-dark" : "bg-rose-500/90 text-white"}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        CMS · {zone}
      </span>
      {hover && (
        <div className="mt-1.5 w-72 rounded-xl border border-ob-lime/40 bg-ob-dark/98 p-3 text-[11px] text-white shadow-2xl backdrop-blur">
          <Row k="Placement Zone" v={zone} mono />
          <Row k="is_active" v={isActive ? "true" : "false"} tone={isActive ? "lime" : "rose"} mono />
          <Row k="Target URL" v={targetUrl || "—"} mono small />
          {extra && Object.entries(extra).map(([k, v]) => (
            <Row key={k} k={k} v={v == null ? "—" : String(v)} mono />
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ k, v, mono, small, tone }: { k: string; v: string; mono?: boolean; small?: boolean; tone?: "lime" | "rose" }) {
  const toneCls = tone === "lime" ? "text-ob-lime" : tone === "rose" ? "text-rose-300" : "text-white";
  return (
    <div className="flex items-start justify-between gap-3 py-1 border-b border-white/5 last:border-0">
      <span className="text-white/50 uppercase tracking-wider text-[9px]">{k}</span>
      <span className={`${mono ? "font-mono" : ""} ${toneCls} ${small ? "text-[10px] break-all text-right max-w-[60%]" : ""}`}>{v}</span>
    </div>
  );
}