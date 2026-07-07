// Tiny global store for Dev Review Mode. SSR-safe; client-only state.
import { useEffect, useState } from "react";

export type SimRole = "guest" | "free" | "vip" | "master_ib";
export type SimViewport = "desktop" | "tablet" | "mobile";

export interface DevState {
  on: boolean;
  role: SimRole;
  inspect: boolean;
  viewport: SimViewport;
}

const KEY = "qp_dev_state_v1";
const EVT = "qp:dev-change";

const DEFAULT: DevState = { on: false, role: "guest", inspect: false, viewport: "desktop" };

function read(): DevState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch { return DEFAULT; }
}

export function setDevState(patch: Partial<DevState>) {
  const next = { ...read(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  window.dispatchEvent(new CustomEvent(EVT, { detail: next }));
}

export function useDevState(): DevState {
  const [s, setS] = useState<DevState>(DEFAULT);
  useEffect(() => {
    setS(read());
    const onChange = (e: Event) => setS((e as CustomEvent<DevState>).detail ?? read());
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setS(read()); };
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return s;
}

/** Use everywhere a component branches on role. Returns sim role when Dev Mode is on. */
export function useEffectiveRole(realRole: SimRole | null | undefined): SimRole {
  const dev = useDevState();
  if (dev.on) return dev.role;
  return (realRole ?? "guest") as SimRole;
}