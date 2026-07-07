ALTER TABLE public.ib_audit_submissions
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS note text;