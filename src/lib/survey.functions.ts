import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

import { resolveTier } from "./survey.constants";

const inputSchema = z.object({
  experience: z.string().trim().min(1).max(200),
  broker: z.string().trim().min(1).max(80),
  portfolio_size: z.string().trim().min(1).max(80),
  method: z.string().trim().min(1).max(240),
  training: z.string().trim().min(1).max(240),
  drawdown_level: z.string().trim().min(1).max(400),
  needs: z.array(z.string().trim().min(1).max(400)).min(1).max(10),
  full_name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(160),
  agreed: z.literal(true),
});

export const submitSurveyLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const tier = resolveTier(data.portfolio_size);

    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    // Bảng đã hợp nhất: mọi khảo sát /survey-audit đều đi vào
    // ib_audit_submissions. Các cột chuyên biệt của IB funnel được ánh xạ
    // từ dữ liệu khảo sát; phần chi tiết (phương pháp, đào tạo, drawdown,
    // nhu cầu) được đóng gói vào cột `note` để admin đọc nguyên văn.
    const note =
      `[Experience: ${data.experience}]\n` +
      `[Method: ${data.method}]\n` +
      `[Training: ${data.training}]\n` +
      `[Drawdown: ${data.drawdown_level}]\n` +
      `[Needs: ${data.needs.join(" · ")}]`;

    const { error } = await supabase.from("ib_audit_submissions").insert({
      full_name: data.full_name,
      phone_zalo: data.contact,
      email: data.email,
      team_size_bucket: data.experience,
      monthly_volume_bucket: data.portfolio_size,
      brokers: [data.broker],
      tier: tier === "premium" ? "elite" : "standard",
      note,
    });

    if (error) {
      console.error("[survey submit] insert failed", error);
      throw new Error("Không thể lưu khảo sát. Vui lòng thử lại.");
    }

    return { ok: true as const, tier };
  });