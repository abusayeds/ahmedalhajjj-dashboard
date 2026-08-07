import { useState } from "react";
import { User, Mail, Shield, Lock, LogOut, Check, Key } from "lucide-react";
import { C, P, M, AD, APrimary, AGhost, AIn, ACard } from "./shared";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/slices/authSlice";
import ChangePasswordModal from "./ChangePasswordModal";
import { useToast } from "./SuccessToast";

export default function AdminProfileView() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  const adminName = user?.name || "Ahmed Alhajji";
  const adminEmail = user?.email || "admin@elitetrading.io";
  const initials = adminName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "AA";

  const [name, setName] = useState(adminName);
  const [email, setEmail] = useState(adminEmail);
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    showToast("Profile details updated successfully!", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
          Admin Profile & Security
        </h2>
        <div style={{ fontFamily: P, fontSize: 13, color: C.tm }}>
          Manage your account credentials, security settings, and administrative access.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Profile Details Form */}
        <ACard style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${AD.cardB}` }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${C.gold}40,${C.goldL}20)`, border: `1px solid ${C.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
              <span style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.gold }}>{initials}</span>
            </div>
            <div>
              <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1 }}>{adminName}</div>
              <div style={{ fontFamily: P, fontSize: 12, color: C.tm, marginTop: 2 }}>{adminEmail}</div>
              <span style={{ display: "inline-block", marginTop: 6, background: "rgba(128,0,255,0.15)", color: C.brandH, border: `1px solid ${C.brand}30`, borderRadius: 100, padding: "2px 10px", fontFamily: M, fontSize: 10, fontWeight: 600 }}>
                Super Administrator
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <AIn label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
            <AIn label="Admin Email" value={email} onChange={setEmail} type="email" placeholder="Enter admin email" />

            {saved && (
              <div style={{ background: "rgba(0,208,132,0.08)", border: "1px solid rgba(0,208,132,0.2)", borderRadius: 9, padding: "10px 14px", fontFamily: P, fontSize: 12, color: C.buy }}>
                ✓ Profile details updated
              </div>
            )}

            <div style={{ marginTop: 8 }}>
              <APrimary icon={<Check size={14} />}>Update Profile</APrimary>
            </div>
          </form>
        </ACard>

        {/* Security & Actions Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Change Password Card */}
          <ACard style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Lock size={18} color={C.brand} />
              <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1 }}>Account Security</div>
            </div>
            <div style={{ fontFamily: P, fontSize: 12, color: C.tm, marginBottom: 18, lineHeight: 1.5 }}>
              Update your account password regularly to keep your administrative dashboard safe and secure.
            </div>

            <APrimary onClick={() => setShowPasswordModal(true)} icon={<Key size={14} />}>
              Change Password
            </APrimary>
          </ACard>

          {/* Logout Action Card */}
          <ACard style={{ padding: "24px 28px", border: "1px solid rgba(255,90,107,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <LogOut size={18} color={C.sell} />
              <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.sell }}>Session Control</div>
            </div>
            <div style={{ fontFamily: P, fontSize: 12, color: C.tm, marginBottom: 18, lineHeight: 1.5 }}>
              Terminate your active admin session and log out of the dashboard.
            </div>

            <AGhost danger onClick={() => dispatch(logout())} icon={<LogOut size={14} />}>
              Logout from Dashboard
            </AGhost>
          </ACard>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
