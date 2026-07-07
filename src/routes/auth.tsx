import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — Qi Prime" },
      { name: "description", content: "Đăng nhập vào hệ sinh thái Qi Prime." },
    ],
  }),
  component: AuthPage,
});

type Mode = "sign_in" | "sign_up" | "reset";

// Việt hóa các thông báo lỗi phổ biến từ Supabase Auth.
function viError(msg?: string): string {
  const m = (msg || "").toLowerCase();
  if (m.includes("invalid login")) return "Email hoặc mật khẩu không đúng.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Email này đã được đăng ký. Vui lòng đăng nhập.";
  if (m.includes("email not confirmed")) return "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.";
  if (m.includes("at least")) return "Mật khẩu quá ngắn (tối thiểu 8 ký tự).";
  if (m.includes("unable to validate email") || m.includes("invalid email")) return "Định dạng email không hợp lệ.";
  if (m.includes("rate limit") || m.includes("too many")) return "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.";
  if (m.includes("network") || m.includes("failed to fetch")) return "Lỗi kết nối mạng. Vui lòng thử lại.";
  return msg ? msg : "Đã có lỗi xảy ra. Vui lòng thử lại.";
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const switchMode = (m: Mode) => { setMode(m); setErr(null); setNotice(null); };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setNotice(null); setBusy(true);
    try {
      if (mode === "sign_up") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e: any) {
      setErr(viError(e?.message));
    } finally { setBusy(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setNotice(null); setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth",
      });
      if (error) throw error;
      setNotice("Đã gửi link khôi phục mật khẩu vào Email của bạn thành công. Vui lòng kiểm tra hộp thư (kể cả mục Spam/Quảng cáo).");
    } catch (e: any) {
      setErr(viError(e?.message));
    } finally { setBusy(false); }
  };

  const handleGoogle = async () => {
    setErr(null); setNotice(null); setBusy(true);
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (r.error) {
        const m = ((r.error as any)?.message || "").toLowerCase();
        if (m.includes("provider") || m.includes("not enabled") || m.includes("oauth") || m.includes("config") || m.includes("redirect")) {
          setErr("Đăng nhập Google chưa được cấu hình hoàn tất trên hệ thống. Vui lòng dùng Email/Mật khẩu, hoặc liên hệ quản trị viên để kích hoạt.");
        } else {
          setErr(viError((r.error as any)?.message));
        }
        setBusy(false);
      }
    } catch {
      setErr("Không thể kết nối đăng nhập Google lúc này. Vui lòng thử lại hoặc dùng Email/Mật khẩu.");
      setBusy(false);
    }
  };

  const heading =
    mode === "sign_in" ? "Đăng nhập Qi Prime"
    : mode === "sign_up" ? "Tạo tài khoản Qi Prime"
    : "Khôi phục mật khẩu";

  return (
    <div className="min-h-screen bg-ob-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md">
        <Link to="/" className="inline-block mb-6 text-xs text-white/60 hover:text-white">← Về trang chủ</Link>
        <h1 className="font-[Montserrat] text-2xl font-bold text-white">{heading}</h1>
        <p className="mt-2 text-sm text-white/60">
          {mode === "reset"
            ? "Nhập email tài khoản, hệ thống sẽ gửi link đặt lại mật khẩu cho bạn."
            : "Quản trị nội dung & hệ thống đối tác."}
        </p>

        {/* Google + divider: ẩn ở chế độ khôi phục cho gọn */}
        {mode !== "reset" && (
          <>
            <button onClick={handleGoogle} disabled={busy} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ob-dark hover:bg-white/90 disabled:opacity-60">
              Tiếp tục với Google
            </button>
            <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-white/40">
              <div className="h-px flex-1 bg-white/10" /> hoặc <div className="h-px flex-1 bg-white/10" />
            </div>
          </>
        )}

        {/* FORM KHÔI PHỤC MẬT KHẨU */}
        {mode === "reset" ? (
          <form onSubmit={handleReset} className="mt-6 space-y-3">
            <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300">{err}</div>}
            {notice && <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-300">{notice}</div>}
            <button disabled={busy} className="w-full rounded-full bg-ob-lime px-5 py-2.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-60">
              {busy ? "Đang gửi..." : "Gửi mã khôi phục"}
            </button>
            <button type="button" onClick={() => switchMode("sign_in")} className="w-full text-xs text-white/60 hover:text-white">
              ← Quay lại đăng nhập
            </button>
          </form>
        ) : (
          <>
            {/* FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
            <form onSubmit={handleEmail} className="space-y-3">
              {mode === "sign_up" && (
                <input className={inputCls} placeholder="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              )}
              <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input className={inputCls} type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />

              {/* Link Quên mật khẩu — chỉ hiện khi đăng nhập, căn lề phải */}
              {mode === "sign_in" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => switchMode("reset")} className="text-zinc-400 hover:text-emerald-400 text-xs transition-colors">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300">{err}</div>}
              <button disabled={busy} className="w-full rounded-full bg-ob-lime px-5 py-2.5 text-sm font-semibold text-ob-dark hover:bg-ob-lime/90 disabled:opacity-60">
                {busy ? "Đang xử lý..." : mode === "sign_in" ? "Đăng nhập" : "Tạo tài khoản"}
              </button>
            </form>

            <button onClick={() => switchMode(mode === "sign_in" ? "sign_up" : "sign_in")} className="mt-4 w-full text-xs text-white/60 hover:text-white">
              {mode === "sign_in" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-ob-lime focus:outline-none";
