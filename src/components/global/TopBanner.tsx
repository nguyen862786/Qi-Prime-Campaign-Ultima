import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CmsInspectBadge } from "@/components/dev/DevReviewBar";

export function TopBanner() {
  const [closed, setClosed] = useState(false);
  const { data } = useQuery({
    queryKey: ["banner", "top_bar"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cms_banners")
        .select("message, link_url, background, is_active")
        .eq("placement", "top_bar")
        .eq("is_active", true)
        .maybeSingle();
      return data;
    },
    staleTime: 60_000,
  });

  const visible = !closed && data?.is_active && data.message;
  return (
    <div
      className="relative overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
      style={{ maxHeight: visible ? 48 : 0, opacity: visible ? 1 : 0 }}
    >
      <CmsInspectBadge
        zone="top_bar"
        isActive={!!data?.is_active}
        targetUrl={data?.link_url}
        extra={{ message: data?.message ?? "—" }}
      />
      {visible && (
        <div
          className="flex items-center justify-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-medium text-ob-dark"
          style={{ background: data?.background || "#39FF14" }}
        >
          {data?.link_url ? (
            <a href={data.link_url} className="hover:underline">{data.message}</a>
          ) : (
            <span>{data?.message}</span>
          )}
          <button
            aria-label="Close announcement"
            onClick={() => setClosed(true)}
            className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-ob-dark/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
