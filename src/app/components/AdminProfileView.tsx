import { useState, useEffect } from "react";
import { Lock, LogOut, Check, Key, Loader2 } from "lucide-react";
import { C, P, M, AD, APrimary, AGhost, AIn, ACard } from "./shared";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout, updateUser } from "../../store/slices/authSlice";
import ChangePasswordModal from "./ChangePasswordModal";
import { useToast } from "./SuccessToast";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../store/api/authApi";

export default function AdminProfileView() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();
  const { data: profileResponse, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profile = profileResponse?.data || user;
  const adminName =
    profile?.name ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Admin";
  const adminEmail = profile?.email || "";
  const initials =
    adminName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AA";

  const [name, setName] = useState(adminName);
  const [email, setEmail] = useState(adminEmail);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(
        profile.name ||
          [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
          ""
      );
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast("Name and email are required.", "warning");
      return;
    }

    try {
      const res = await updateProfile({ name: name.trim(), email: email.trim() }).unwrap();
      const updatedUser = res?.data || { ...profile, name: name.trim(), email: email.trim() };
      dispatch(updateUser(updatedUser));
      showToast(res?.message || "Profile details updated successfully!", "success");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update profile.", "error");
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
          Admin Profile & Security
        </h2>
        <div style={{ fontFamily: P, fontSize: 13, color: C.tm }}>
          Manage your account credentials, security settings, and administrative access.
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: 60, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
          Loading profile from server...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
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

              <div style={{ marginTop: 8 }}>
                <APrimary
                  icon={isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </APrimary>
              </div>
            </form>
          </ACard>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
