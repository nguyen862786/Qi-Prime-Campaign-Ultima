import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CmsInspectBadge } from "@/components/dev/DevReviewBar";

export function MidCarousel() {
  const { data } = useQuery({
    queryKey: ["mid_carousel"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cms_assets")
        .select("id, image_url, link_url, caption")
        .eq("zone", "mid_carousel")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      return data ?? [];
    },
    staleTime: 60_000,
  });
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const slides = data ?? [];

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;

  const go = (d: number) => setIdx((i) => (i + d + slides.length) % slides.length);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="relative overflow-hidden rounded-3xl shadow-xl">
          <CmsInspectBadge
            zone="mid_carousel"
            isActive={slides.length > 0}
            targetUrl={slides[idx]?.link_url}
            extra={{ slides: slides.length, current_index: idx, current_id: slides[idx]?.id ?? "—" }}
          />
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {slides.map((s: any) => (
              <a key={s.id} href={s.link_url || "#"} onClick={(e) => { if (!s.link_url) e.preventDefault(); }} className="block w-full shrink-0">
                <img src={s.image_url} alt={s.caption || ""} className="w-full h-[260px] sm:h-[380px] object-cover" />
              </a>
            ))}
          </div>
          {slides.length > 1 && (
            <>
              <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ob-dark shadow hover:bg-white"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ob-dark shadow hover:bg-white"><ChevronRight className="h-5 w-5" /></button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((_: any, i: number) => (
                  <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}