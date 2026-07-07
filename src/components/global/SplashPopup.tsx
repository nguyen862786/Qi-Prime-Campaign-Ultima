import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CmsInspectBadge } from "@/components/dev/DevReviewBar";

const COOKIE_KEY = "qp_splash_dismissed_at";

export function SplashPopup() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["splash_popup"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cms_popup")
        .select("desktop_image_url, mobile_image_url, link_url, is_active, cooldown_hours")
        .eq("id", 1)
        .maybeSingle();
      return data;
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!data?.is_active) return;
    if (!data.desktop_image_url && !data.mobile_image_url) return;
    const last = typeof window !== "undefined" ? localStorage.getItem(COOKIE_KEY) : null;
    const cooldownMs = (data.cooldown_hours ?? 24) * 60 * 60 * 1000;
    if (last && Date.now() - Number(last) < cooldownMs) return;
    setOpen(true);
  }, [data]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(COOKIE_KEY, String(Date.now())); } catch {}
  };

  if (!open || !data) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={close}
    >
      <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <CmsInspectBadge
          zone="splash_popup"
          isActive={!!data.is_active}
          targetUrl={data.link_url}
          extra={{ cooldown_hours: data.cooldown_hours ?? 24 }}
        />
        <button
          aria-label="Close popup"
          onClick={close}
          className="absolute -top-3 -right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-ob-dark shadow-lg hover:bg-white/90"
        >
          <X className="h-4 w-4" />
        </button>
        <a
          href={data.link_url || "#"}
          onClick={(e) => { if (!data.link_url) e.preventDefault(); }}
          className="block overflow-hidden rounded-2xl shadow-2xl"
        >
          {data.desktop_image_url && (
            <img
              src={data.desktop_image_url}
              alt="Promotion"
              className="hidden sm:block w-full h-auto"
            />
          )}
          {(data.mobile_image_url || data.desktop_image_url) && (
            <img
              src={data.mobile_image_url || data.desktop_image_url!}
              alt="Promotion"
              className="sm:hidden w-full h-auto"
            />
          )}
        </a>
      </div>
    </div>
  );
}