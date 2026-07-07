import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppSettings = {
  system_email: string;
  hotline: string;
  office_address: string;
};

const DEFAULTS: AppSettings = {
  system_email: "partners@qiprime.ai",
  hotline: "078 9814946",
  office_address: "Qi Prime Headquarters — Tầng 18, Tòa Capital Place, 29 Liễu Giai, Ba Đình, Hà Nội",
};

export function useAppSettings() {
  const q = useQuery({
    queryKey: ["app_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("system_email, hotline, office_address")
        .eq("id", 1)
        .maybeSingle();
      if (error) return DEFAULTS;
      return (data as AppSettings | null) ?? DEFAULTS;
    },
    staleTime: 60_000,
  });
  return q.data ?? DEFAULTS;
}

export function telHref(num: string) {
  return "tel:" + num.replace(/[^+0-9]/g, "");
}