-- Mở rộng cms_products thành hồ sơ Bot EA chuyên nghiệp:
-- chỉ số hiệu suất, thông số nhanh, album sơ đồ chiến thuật, video hướng dẫn.
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS win_rate        numeric;       -- %
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS max_drawdown    numeric;       -- %
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS monthly_profit  numeric;       -- %/tháng
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS timeframe       text;          -- VD: M15 – H1
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS trade_style     text;          -- VD: Multi-Grid Hybrid
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS status          text NOT NULL DEFAULT 'LIVE';
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS images          jsonb NOT NULL DEFAULT '[]'::jsonb; -- album sơ đồ
ALTER TABLE public.cms_products ADD COLUMN IF NOT EXISTS video_url       text;          -- video hướng dẫn
NOTIFY pgrst, 'reload schema';
