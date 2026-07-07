import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const submitSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone_zalo: z.string().trim().min(6).max(40),
  media_channel: z.string().trim().max(255).optional().nullable(),
  team_size_bucket: z.enum(["lt50", "50_200", "gt200"]),
  monthly_volume_bucket: z.enum(["lt100", "100_500", "gt500"]),
  brokers: z.array(z.string().max(40)).max(10),
});

export const submitIBAudit = createServerFn({ method: "POST" })
  .inputValidator((d) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const isElite =
      data.monthly_volume_bucket === "gt500" || data.team_size_bucket === "gt200";
    const tier = isElite ? "elite" : "standard";

    const { data: inserted, error } = await supabase
      .from("ib_audit_submissions")
      .insert({
        full_name: data.full_name,
        phone_zalo: data.phone_zalo,
        media_channel: data.media_channel ?? null,
        team_size_bucket: data.team_size_bucket,
        monthly_volume_bucket: data.monthly_volume_bucket,
        brokers: data.brokers,
        tier,
      })
      .select("id")
      .single();

    if (error) {
      return { ok: false as const, error: error.message };
    }

    let notified = false;
    if (isElite) {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (token && chatId) {
        try {
          const text =
            `🔥 *ELITE Master IB Lead*\n` +
            `*Name:* ${data.full_name}\n` +
            `*Zalo/Phone:* ${data.phone_zalo}\n` +
            `*Media:* ${data.media_channel ?? "-"}\n` +
            `*Team:* ${data.team_size_bucket}  |  *Volume:* ${data.monthly_volume_bucket}\n` +
            `*Brokers:* ${data.brokers.join(", ") || "-"}`;
          const res = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
            },
          );
          notified = res.ok;
        } catch (e) {
          console.error("telegram", e);
        }
      }
      if (notified) {
        await supabase
          .from("ib_audit_submissions")
          .update({ notified_admin: true })
          .eq("id", inserted.id);
      }
    }

    return { ok: true as const, id: inserted.id, tier, notified };
  });