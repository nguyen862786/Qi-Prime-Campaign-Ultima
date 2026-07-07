import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, LayoutDashboard, Inbox, Image as ImageIcon, Settings, ScrollText, CalendarDays, GraduationCap, Package, Users, ClipboardList } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { isBypassActive } from "@/lib/devBypass";

const NAV = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/admin/leads", label: "Leads / Chờ duyệt", icon: ClipboardList },
  { to: "/admin/submissions", label: "IB Submissions", icon: Inbox },
  { to: "/admin/cms", label: "CMS Media", icon: ImageIcon },
  { to: "/admin/events", label: "Sự kiện", icon: CalendarDays },
  { to: "/admin/lessons", label: "Bài học", icon: GraduationCap },
  { to: "/admin/students", label: "Học viên", icon: Users },
  { to: "/admin/products", label: "Sản phẩm EA", icon: Package },
  { to: "/admin/audit", label: "Dev Audit Log", icon: ScrollText },
  { to: "/admin/settings", label: "Cài đặt", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRoles = async (userId: string): Promise<string[]> => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (error) throw error;
      return (data ?? []).map((r: any) => r.role);
    };
    const check = async () => {
      try {
        if (isBypassActive()) { if (!cancelled) { setAuthError(null); setIsAdmin(true); } return; }
        const { data: u } = await supabase.auth.getUser();
        if (!u.user) { if (!cancelled) { setAuthError(null); setIsAdmin(false); } return; }
        let roles = await fetchRoles(u.user.id);
        if (roles.length === 0) {
          await new Promise((r) => setTimeout(r, 800));
          if (cancelled) return;
          roles = await fetchRoles(u.user.id);
        }
        if (!cancelled) { setAuthError(null); setIsAdmin(roles.includes("admin")); }
      } catch (error) {
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;
        try {
          const { data: retryUser } = await supabase.auth.getUser();
          if (!retryUser.user) { if (!cancelled) { setAuthError(null); setIsAdmin(false); } return; }
          const retryRoles = await fetchRoles(retryUser.user.id);
          if (!cancelled) { setAuthError(null); setIsAdmin(retryRoles.includes("admin")); }
        } catch (retryError: any) {
          if (!cancelled) {
            setAuthError(retryError?.message || (error as any)?.message || "Không thể đọc quyền tài khoản.");
            setIsAdmin(false);
          }
        }
      }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        setTimeout(() => { if (!cancelled) check(); }, 100);
      }
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [path]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === null) {
    return <div className="min-h-screen bg-ob-dark flex items-center justify-center text-white/60">Đang kiểm tra quyền...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ob-dark flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Không có quyền truy cập</h1>
          <p className="mt-2 text-white/60 text-sm">
            {authError ? `Không thể đọc quyền Admin: ${authError}` : "Tài khoản này chưa được cấp quyền Admin."}
          </p>
          <button onClick={signOut} className="mt-6 rounded-full bg-ob-lime px-5 py-2 text-sm font-semibold text-ob-dark">Đăng xuất</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ob-dark text-white flex">
      <aside className="w-60 shrink-0 border-r border-white/10 bg-white/[0.02] p-4 flex flex-col">
        <Link to="/" className="font-[Montserrat] font-bold text-lg mb-6">Qi Prime<span className="text-ob-lime">.</span></Link>
        <nav className="space-y-1 flex-1">
          {NAV.map((n) => {
            const active = path === n.to;
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? "bg-ob-lime text-ob-dark font-semibold" : "text-white/70 hover:bg-white/5"}`}>
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={signOut} className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
