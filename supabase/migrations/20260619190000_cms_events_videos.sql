-- Bổ sung cột lưu NHIỀU video cho 1 sự kiện (images jsonb đã có sẵn cho album ảnh).
ALTER TABLE public.cms_events ADD COLUMN IF NOT EXISTS videos jsonb NOT NULL DEFAULT '[]'::jsonb;
NOTIFY pgrst, 'reload schema';
