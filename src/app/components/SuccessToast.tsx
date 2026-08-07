import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { C, P } from "./shared";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={18} color={C.buy} />,
    error: <XCircle size={18} color={C.sell} />,
    warning: <AlertCircle size={18} color="#F59E0B" />,
    info: <Info size={18} color="#60A5FA" />,
  };

  const bgMap: Record<ToastType, string> = {
    success: "rgba(0,208,132,0.08)",
    error: "rgba(255,90,107,0.08)",
    warning: "rgba(245,158,11,0.08)",
    info: "rgba(59,130,246,0.08)",
  };

  const borderMap: Record<ToastType, string> = {
    success: "rgba(0,208,132,0.2)",
    error: "rgba(255,90,107,0.2)",
    warning: "rgba(245,158,11,0.2)",
    info: "rgba(59,130,246,0.2)",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="a-toast"
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: bgMap[toast.type],
              backdropFilter: "blur(20px)",
              border: `1px solid ${borderMap[toast.type]}`,
              borderRadius: 12, padding: "14px 20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
              pointerEvents: "auto",
              minWidth: 280,
              maxWidth: 420,
            }}
          >
            {iconMap[toast.type]}
            <span style={{ fontFamily: P, fontSize: 13, fontWeight: 500, color: "#fff", flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
