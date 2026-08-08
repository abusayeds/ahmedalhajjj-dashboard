import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";
import { C, P, M, AD, AGhost, APrimary } from "./shared";

function useLockBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
}

function ModalPortal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useLockBodyScroll();

  return createPortal(
    <div className="a-modal-overlay" style={{ overflowY: "auto" }} onClick={onClose}>
      {children}
    </div>,
    document.body,
  );
}

export function ConfirmDeleteModal({ title, message, onConfirm, onCancel, loading = false }: {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <ModalPortal onClose={onCancel}>
      <div className="a-modal a-confirm-delete" onClick={e => e.stopPropagation()} style={{ width: 460, padding: "32px", margin: "auto" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,90,107,0.1)", border: "1px solid rgba(255,90,107,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <AlertCircle size={28} color={C.sell} />
        </div>
        <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>{title || "Confirm Delete"}</div>
        <div style={{ fontFamily: P, fontSize: 14, color: C.tm, lineHeight: 1.6, marginBottom: 24 }} dangerouslySetInnerHTML={{ __html: message }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <AGhost onClick={onCancel}>Cancel</AGhost>
          <APrimary danger loading={loading} onClick={onConfirm}>Delete</APrimary>
        </div>
      </div>
    </ModalPortal>
  );
}

export function ConfirmActionModal({ title, message, onConfirm, onCancel, loading = false, confirmLabel = "Confirm", icon, iconColor, iconBg }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <ModalPortal onClose={onCancel}>
      <div className="a-modal a-confirm-delete" onClick={e => e.stopPropagation()} style={{ width: 460, padding: "32px", margin: "auto" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: iconBg || "rgba(128,0,255,0.1)", border: `1px solid ${iconColor || C.brand}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          {icon || <AlertCircle size={28} color={iconColor || C.brand} />}
        </div>
        <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>{title}</div>
        <div style={{ fontFamily: P, fontSize: 14, color: C.tm, lineHeight: 1.6, marginBottom: 24 }} dangerouslySetInnerHTML={{ __html: message }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <AGhost onClick={onCancel}>Cancel</AGhost>
          <APrimary loading={loading} onClick={onConfirm}>{confirmLabel}</APrimary>
        </div>
      </div>
    </ModalPortal>
  );
}
