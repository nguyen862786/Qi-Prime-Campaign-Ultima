-- ============================================================
-- cms_leads: bảng lưu lead từ form đăng ký popup (3 nhánh EA/Copy/IB)
-- Tên cột KHỚP với code form: qip, name, contact, role, note, status...
-- Anon (khách vãng lai) được INSERT; admin đọc/sửa toàn bộ.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cms_leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qip           text NOT NULL UNIQUE,
  name          text NOT NULL,          -- Họ tên (form gửi field "name")
  contact       text NOT NULL,          -- SĐT/Zalo (form gửi field "contact")
  role          text NOT NULL,          -- 'ea' | 'copy' | 'ib'
  broker_id     text,
  broker_name   text,
  note          text,                   -- Vai trò + Vốn + Mục tiêu (gộp text)
  needs_support boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'pending',  -- pending | contacted | approved | rejected
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Quyền cấp bảng
GRANT INSERT ON public.cms_leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.cms_leads TO authenticated;

-- Bật RLS
ALTER TABLE public.cms_leads ENABLE ROW LEVEL SECURITY;

-- Khách vãng lai (anon) chỉ được TẠO lead
DROP POLICY IF EXISTS "leads insert any" ON public.cms_leads;
CREATE POLICY "leads insert any" ON public.cms_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin toàn quyền (đọc danh sách, đổi trạng thái duyệt)
DROP POLICY IF EXISTS "leads admin all" ON public.cms_leads;
CREATE POLICY "leads admin all" ON public.cms_leads
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Tự cập nhật updated_at
DROP TRIGGER IF EXISTS trg_cms_leads_updated ON public.cms_leads;
CREATE TRIGGER trg_cms_leads_updated BEFORE UPDATE ON public.cms_leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Buộc PostgREST nạp lại schema cache (khắc phục lỗi "schema cache")
NOTIFY pgrst, 'reload schema';
