// Single source of truth for the premium-tier portfolio label.
// Used by both the client UI (src/routes/survey-audit.tsx) and the
// server fn (src/lib/survey.functions.ts) so the tier split can never
// desync from the label shown in the form.
export const PREMIUM_PORTFOLIO = "Trên $10,000 USD [Very VIP]";

export type SurveyTier = "premium" | "introductory";

export function resolveTier(portfolio_size: string): SurveyTier {
  return portfolio_size === PREMIUM_PORTFOLIO ? "premium" : "introductory";
}