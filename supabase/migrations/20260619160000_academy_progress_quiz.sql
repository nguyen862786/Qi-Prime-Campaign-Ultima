-- ============================================================
-- Academy backend: lesson_progress · quiz_attempts · cms_quiz
-- Tái dùng public.has_role() và public.touch_updated_at() đã có.
-- ============================================================

-- 1) TIẾN ĐỘ HỌC (mỗi user / mỗi bài)
CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_progress own" ON public.lesson_progress
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "lesson_progress admin read" ON public.lesson_progress
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- 2) KẾT QUẢ TRẮC NGHIỆM
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_attempts own" ON public.quiz_attempts
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "quiz_attempts admin read" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- 3) NGÂN HÀNG CÂU HỎI (quản lý từ admin)
CREATE TABLE public.cms_quiz (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  answer_index int NOT NULL DEFAULT 0,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_quiz TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_quiz TO authenticated;
GRANT ALL ON public.cms_quiz TO service_role;
ALTER TABLE public.cms_quiz ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz public read active" ON public.cms_quiz FOR SELECT USING (is_active = true);
CREATE POLICY "quiz admin all" ON public.cms_quiz FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cms_quiz_updated BEFORE UPDATE ON public.cms_quiz
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed 4 câu hỏi mẫu (tuỳ chọn — có thể xoá/sửa trong admin)
INSERT INTO public.cms_quiz (question, options, answer_index, display_order) VALUES
('Mục tiêu cốt lõi xuyên suốt Học Viện Qi Prime là gì?', '["Tối đa hóa lợi nhuận nhanh","Kỷ luật & quản trị rủi ro vốn","Giao dịch theo cảm tính","Tăng đòn bẩy tối đa"]', 1, 1),
('Kill-Switch trong hệ thống EA dùng để?', '["Tăng khối lượng lệnh","Tự động ngắt khi chạm ngưỡng sụt giảm vốn","Mở thêm lệnh đối ứng vô hạn","Bỏ qua Stop Loss"]', 1, 2),
('MDD (Max Drawdown) phản ánh điều gì?', '["Tổng lợi nhuận tối đa","Mức sụt giảm vốn tối đa từ đỉnh","Số lệnh mỗi ngày","Spread trung bình"]', 1, 3),
('Module 03 tập trung vào?', '["Tư duy xác suất cơ bản","Cấu hình Bot phòng thủ","Vận hành doanh nghiệp FinTech & Master IB","Phân tích nến Nhật"]', 2, 4);
