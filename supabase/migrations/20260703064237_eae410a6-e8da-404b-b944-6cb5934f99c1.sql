CREATE TABLE public.cms_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qip TEXT,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  role TEXT,
  note TEXT,
  broker_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  needs_support BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.cms_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_leads TO authenticated;
GRANT ALL ON public.cms_leads TO service_role;

ALTER TABLE public.cms_leads ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors submitting the landing form) can insert a lead
CREATE POLICY "Anyone can submit a lead"
  ON public.cms_leads FOR INSERT
  WITH CHECK (true);

-- Only admins can view / update / delete leads
CREATE POLICY "Admins can view leads"
  ON public.cms_leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads"
  ON public.cms_leads FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads"
  ON public.cms_leads FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_cms_leads_updated_at
  BEFORE UPDATE ON public.cms_leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_cms_leads_created_at ON public.cms_leads (created_at DESC);
CREATE INDEX idx_cms_leads_status ON public.cms_leads (status);