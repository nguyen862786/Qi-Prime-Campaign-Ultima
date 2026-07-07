
-- EVENTS
CREATE TABLE public.cms_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date timestamptz,
  description text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_events TO authenticated;
GRANT ALL ON public.cms_events TO service_role;
ALTER TABLE public.cms_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read active" ON public.cms_events FOR SELECT USING (is_active = true);
CREATE POLICY "events admin all" ON public.cms_events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cms_events_updated BEFORE UPDATE ON public.cms_events FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- LESSONS
CREATE TABLE public.cms_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  summary text,
  thumbnail_url text,
  video_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_lessons TO authenticated;
GRANT ALL ON public.cms_lessons TO service_role;
ALTER TABLE public.cms_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons public read active" ON public.cms_lessons FOR SELECT USING (is_active = true);
CREATE POLICY "lessons admin all" ON public.cms_lessons FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cms_lessons_updated BEFORE UPDATE ON public.cms_lessons FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- PRODUCTS
CREATE TABLE public.cms_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  risk_level text NOT NULL DEFAULT 'Trung bình',
  mockup_url text,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_products TO authenticated;
GRANT ALL ON public.cms_products TO service_role;
ALTER TABLE public.cms_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read active" ON public.cms_products FOR SELECT USING (is_active = true);
CREATE POLICY "products admin all" ON public.cms_products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cms_products_updated BEFORE UPDATE ON public.cms_products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
