
ALTER TABLE public.cms_events ADD COLUMN IF NOT EXISTS videos jsonb NOT NULL DEFAULT '[]'::jsonb;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_events TO authenticated;
GRANT SELECT ON public.cms_events TO anon;
GRANT ALL ON public.cms_events TO service_role;
