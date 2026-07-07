
CREATE TABLE public.dev_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  route TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.dev_audit_log TO authenticated;
GRANT ALL ON public.dev_audit_log TO service_role;

ALTER TABLE public.dev_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin-only access (both read + write)
CREATE POLICY "dev_audit_admin_select"
  ON public.dev_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "dev_audit_admin_insert"
  ON public.dev_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid());

CREATE INDEX dev_audit_log_user_created_idx ON public.dev_audit_log (user_id, created_at DESC);
CREATE INDEX dev_audit_log_event_idx ON public.dev_audit_log (event_type, created_at DESC);
