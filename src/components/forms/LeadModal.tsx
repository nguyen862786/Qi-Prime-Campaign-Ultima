import { createContext, useContext, useState, type ReactNode } from "react";
import LeadCaptureForm from "./LeadCaptureForm";

type LeadModalCtx = { isOpen: boolean; open: () => void; close: () => void };

const Ctx = createContext<LeadModalCtx | null>(null);

/** Hook mở/đóng popup đăng ký từ bất kỳ nút nào trong app. */
export function useLeadModal(): LeadModalCtx {
  const c = useContext(Ctx);
  if (!c) return { isOpen: false, open: () => {}, close: () => {} };
  return c;
}

/** Provider gắn 1 lần ở __root — render popup form đăng ký toàn cục. */
export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <Ctx.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && <LeadCaptureForm onClose={close} />}
    </Ctx.Provider>
  );
}
