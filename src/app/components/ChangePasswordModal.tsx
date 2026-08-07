/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Lock, AlertCircle, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { C, P, AD, AModal, APrimary, AGhost } from "./shared";
import { useChangePasswordMutation } from "../../store/api/authApi";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      setSuccess(res?.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || "Failed to change password."
      );
    }
  };

  return (
    <AModal
      title="Change Password"
      sub="Update your admin account password"
      onClose={onClose}
      width={460}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div
            style={{
              background: "rgba(255,90,107,0.1)",
              border: `1px solid rgba(255,90,107,0.25)`,
              borderRadius: 10,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertCircle size={15} color={C.sell} />
            <span style={{ fontFamily: P, fontSize: 12, color: C.sell }}>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(0,208,132,0.1)",
              border: `1px solid rgba(0,208,132,0.25)`,
              borderRadius: 10,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={15} color={C.buy} />
            <span style={{ fontFamily: P, fontSize: 12, color: C.buy }}>{success}</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>
            Current Password
          </span>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
            className="a-input"
            style={{
              background: AD.inp,
              border: `1px solid ${AD.inpB}`,
              borderRadius: 9,
              padding: "9px 13px",
              fontFamily: P,
              fontSize: 13,
              color: C.t1,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>
            New Password
          </span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="a-input"
            style={{
              background: AD.inp,
              border: `1px solid ${AD.inpB}`,
              borderRadius: 9,
              padding: "9px 13px",
              fontFamily: P,
              fontSize: 13,
              color: C.t1,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>
            Confirm New Password
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="a-input"
            style={{
              background: AD.inp,
              border: `1px solid ${AD.inpB}`,
              borderRadius: 9,
              padding: "9px 13px",
              fontFamily: P,
              fontSize: 13,
              color: C.t1,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8 }}>
          <AGhost onClick={onClose}>Cancel</AGhost>
          <APrimary
            disabled={isLoading}
            icon={isLoading ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </APrimary>
        </div>
      </form>
    </AModal>
  );
}
