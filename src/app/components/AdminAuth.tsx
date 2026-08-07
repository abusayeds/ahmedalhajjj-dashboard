/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Lock,
  Mail,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { C, P, M, AD } from "./shared";
import {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
} from "../../store/api/authApi";
import { useAppDispatch } from "../../store";
import { setCredentials } from "../../store/slices/authSlice";

type AuthMode = "login" | "forgot" | "otp" | "reset" | "success";

export default function AdminAuth() {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // RTK Query Mutations
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [verifyForgotOtp, { isLoading: isOtpLoading }] =
    useVerifyForgotOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password flow states
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step1Token, setStep1Token] = useState("");
  const [step2Token, setStep2Token] = useState("");

  // Handle Login using RTK Query
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      const user = res.data?.user;
      const token = res.data?.token;

      // Strict Admin Access Control
      if (!user || user.role !== "admin") {
        setError(
          "Access Denied: Only valid Administrators can access this dashboard."
        );
        return;
      }

      dispatch(setCredentials({ token, user }));
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || "Login failed. Please check credentials."
      );
    }
  };

  // Handle Forgot Password - Step 1: Send OTP via RTK Query
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Please enter your admin email.");
      return;
    }

    try {
      const res = await forgotPassword({ email }).unwrap();
      if (res.data?.token) {
        setStep1Token(res.data.token);
      }
      setMessage("OTP code sent to your email!");
      setMode("otp");
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || "Failed to send reset OTP."
      );
    }
  };

  // Handle Forgot Password - Step 2: Verify OTP via RTK Query
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!otp) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    try {
      const res = await verifyForgotOtp({
        otp,
        token: step1Token,
      }).unwrap();

      if (res.data?.token) {
        setStep2Token(res.data.token);
      }
      setMessage("OTP verified successfully!");
      setMode("reset");
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "Invalid or expired OTP.");
    }
  };

  // Handle Forgot Password - Step 3: Reset Password via RTK Query
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      await resetPassword({
        newPassword,
        confirmPassword,
        token: step2Token,
      }).unwrap();

      setMessage("Password successfully reset! You can now log in.");
      setMode("success");
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "Failed to reset password.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.brand}1A, #050408 65%)`,
        fontFamily: P,
        color: C.t1,
        position: "relative",
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: "fixed",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.brand}12, transparent 70%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(15,12,32,0.75)",
          backdropFilter: "blur(24px)",
          border: `1px solid ${AD.cardB}`,
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: `0 30px 90px rgba(0,0,0,0.8), 0 0 0 1px ${C.brand}22`,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${C.brand}30, ${C.gold}20)`,
              border: `1px solid ${C.brand}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: `0 8px 24px ${C.brand}25`,
            }}
          >
            {mode === "login" && <ShieldCheck size={28} color={C.gold} />}
            {mode === "forgot" && <Mail size={28} color={C.brand} />}
            {mode === "otp" && <KeyRound size={28} color={C.gold} />}
            {mode === "reset" && <Lock size={28} color={C.brand} />}
            {mode === "success" && <CheckCircle2 size={28} color={C.buy} />}
          </div>

          <h1
            style={{
              fontFamily: P,
              fontSize: 22,
              fontWeight: 700,
              color: C.t1,
              margin: "0 0 6px",
              letterSpacing: "-0.4px",
            }}
          >
            {mode === "login" && "Admin Access Control"}
            {mode === "forgot" && "Reset Admin Password"}
            {mode === "otp" && "Verify OTP Code"}
            {mode === "reset" && "Set New Password"}
            {mode === "success" && "Password Reset Complete"}
          </h1>
          <p style={{ fontFamily: P, fontSize: 12.5, color: C.tm, margin: 0 }}>
            {mode === "login" && "Ahmed Al-Hajji Admin Portal"}
            {mode === "forgot" && "Enter your registered admin email for OTP"}
            {mode === "otp" && `OTP sent to ${email}`}
            {mode === "reset" && "Enter your new password below"}
            {mode === "success" && "Your password has been updated"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: "rgba(255,90,107,0.1)",
              border: `1px solid rgba(255,90,107,0.25)`,
              borderRadius: 12,
              padding: "11px 14px",
              marginBottom: 20,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <AlertCircle
              size={16}
              color={C.sell}
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: P,
                fontSize: 12,
                color: C.sell,
                lineHeight: 1.4,
              }}
            >
              {error}
            </span>
          </div>
        )}

        {/* Info Message Alert */}
        {message && (
          <div
            style={{
              background: "rgba(0,208,132,0.1)",
              border: `1px solid rgba(0,208,132,0.25)`,
              borderRadius: 12,
              padding: "11px 14px",
              marginBottom: 20,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <CheckCircle2
              size={16}
              color={C.buy}
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: P,
                fontSize: 12,
                color: C.buy,
                lineHeight: 1.4,
              }}
            >
              {message}
            </span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === "login" && (
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontFamily: P,
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: C.t2,
                }}
              >
                Admin Email
              </span>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  color={C.tm}
                  style={{ position: "absolute", left: 14, top: 13 }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="a-input"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: AD.inp,
                    border: `1px solid ${AD.inpB}`,
                    borderRadius: 11,
                    padding: "11px 14px 11px 40px",
                    fontFamily: P,
                    fontSize: 13,
                    color: C.t1,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: P,
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: C.t2,
                  }}
                >
                  Password
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMessage(null);
                    setMode("forgot");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: P,
                    fontSize: 11,
                    color: C.brandH,
                    cursor: "pointer",
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  color={C.tm}
                  style={{ position: "absolute", left: 14, top: 13 }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="a-input"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: AD.inp,
                    border: `1px solid ${AD.inpB}`,
                    borderRadius: 11,
                    padding: "11px 14px 11px 40px",
                    fontFamily: P,
                    fontSize: 13,
                    color: C.t1,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="a-btn"
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px",
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandH})`,
                border: "none",
                borderRadius: 12,
                fontFamily: P,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: isLoginLoading ? "not-allowed" : "pointer",
                boxShadow: `0 6px 20px ${C.brand}40`,
                opacity: isLoginLoading ? 0.7 : 1,
              }}
            >
              {isLoginLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {isLoginLoading ? "Authenticating..." : "Sign In to Admin Portal"}
            </button>
          </form>
        )}

        {/* MODE: FORGOT PASSWORD */}
        {mode === "forgot" && (
          <form
            onSubmit={handleForgotPassword}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontFamily: P,
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: C.t2,
                }}
              >
                Admin Email Address
              </span>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  color={C.tm}
                  style={{ position: "absolute", left: 14, top: 13 }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="a-input"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: AD.inp,
                    border: `1px solid ${AD.inpB}`,
                    borderRadius: 11,
                    padding: "11px 14px 11px 40px",
                    fontFamily: P,
                    fontSize: 13,
                    color: C.t1,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isForgotLoading}
              className="a-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px",
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandH})`,
                border: "none",
                borderRadius: 12,
                fontFamily: P,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: isForgotLoading ? "not-allowed" : "pointer",
              }}
            >
              {isForgotLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {isForgotLoading ? "Sending OTP..." : "Send Reset OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMessage(null);
                setMode("login");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "none",
                border: "none",
                fontFamily: P,
                fontSize: 12,
                color: C.tm,
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          </form>
        )}

        {/* MODE: OTP VERIFICATION */}
        {mode === "otp" && (
          <form
            onSubmit={handleVerifyOtp}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontFamily: P,
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: C.t2,
                }}
              >
                6-Digit OTP Code
              </span>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: AD.inp,
                  border: `1px solid ${AD.inpB}`,
                  borderRadius: 11,
                  padding: "12px",
                  fontFamily: M,
                  fontSize: 20,
                  letterSpacing: "6px",
                  textAlign: "center",
                  color: C.gold,
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isOtpLoading}
              className="a-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px",
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandH})`,
                border: "none",
                borderRadius: 12,
                fontFamily: P,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: isOtpLoading ? "not-allowed" : "pointer",
              }}
            >
              {isOtpLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {isOtpLoading ? "Verifying..." : "Verify OTP Code"}
            </button>
          </form>
        )}

        {/* MODE: RESET PASSWORD */}
        {mode === "reset" && (
          <form
            onSubmit={handleResetPassword}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontFamily: P,
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: C.t2,
                }}
              >
                New Password
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="a-input"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: AD.inp,
                  border: `1px solid ${AD.inpB}`,
                  borderRadius: 11,
                  padding: "11px 14px",
                  fontFamily: P,
                  fontSize: 13,
                  color: C.t1,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontFamily: P,
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: C.t2,
                }}
              >
                Confirm New Password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="a-input"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: AD.inp,
                  border: `1px solid ${AD.inpB}`,
                  borderRadius: 11,
                  padding: "11px 14px",
                  fontFamily: P,
                  fontSize: 13,
                  color: C.t1,
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isResetLoading}
              className="a-btn"
              style={{
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px",
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandH})`,
                border: "none",
                borderRadius: 12,
                fontFamily: P,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: isResetLoading ? "not-allowed" : "pointer",
              }}
            >
              {isResetLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {isResetLoading ? "Resetting Password..." : "Update Password"}
            </button>
          </form>
        )}

        {/* MODE: SUCCESS */}
        {mode === "success" && (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMessage(null);
                setMode("login");
              }}
              className="a-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandH})`,
                border: "none",
                borderRadius: 12,
                fontFamily: P,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Sign In with New Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
