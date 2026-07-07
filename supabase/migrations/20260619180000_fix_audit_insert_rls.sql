-- ============================================================
-- FIX: Cho phép khách vãng lai (anon) INSERT vào ib_audit_submissions.
--
-- Nguyên nhân lỗi "new row violates row-level security policy":
-- Policy "audit_anyone_insert" cũ có subquery rate-limit TỰ THAM CHIẾU bảng
-- (select ... from ib_audit_submissions). Vì anon KHÔNG có quyền SELECT bảng này,
-- WITH CHECK đánh giá thất bại → mọi INSERT của khách vãng lai bị chặn.
--
-- Giải pháp: thay bằng policy INSERT đơn giản, không tự tham chiếu.
-- RLS vẫn bật; SELECT/UPDATE/DELETE vẫn chỉ dành cho admin/authenticated.
-- ============================================================

-- Đảm bảo quyền INSERT ở cấp bảng (thường đã có sẵn — idempotent).
GRANT INSERT ON public.ib_audit_submissions TO anon, authenticated;

-- Thay policy INSERT cũ bằng bản thông suốt.
DROP POLICY IF EXISTS "audit_anyone_insert" ON public.ib_audit_submissions;
CREATE POLICY "audit_anyone_insert"
  ON public.ib_audit_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
