import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  Zap, Bell, BookOpen, BarChart2, Settings, Shield, LogOut,
  CreditCard, ChevronDown, ChevronRight, Tag, Users, FileText, Info, User
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/slices/authSlice";
import { useGetProfileQuery } from "../store/api/authApi";

import AdminAuth from "./components/AdminAuth";
import ChangePasswordModal from "./components/ChangePasswordModal";
import ADashboard from "./components/ADashboard";
import ASignals from "./components/ASignals";
import APosts from "./components/APosts";
import ANotifications from "./components/ANotifications";
import ASubscriptions from "./components/ASubscriptions";
import EditSubscriptionPlan from "./components/EditSubscriptionPlan";
import AUsers from "./components/AUsers";
import ACoupons from "./components/ACoupons";
import ASettings from "./components/ASettings";
import { C, P, M, AD } from "./components/shared";

type AdminSection = "dashboard" | "signals" | "posts" | "notifications" | "subscriptions" | "users" | "coupons" | "settings";

function getSectionFromPath(pathname: string): AdminSection {
  if (pathname.startsWith("/signals")) return "signals";
  if (pathname.startsWith("/posts")) return "posts";
  if (pathname.startsWith("/notifications")) return "notifications";
  if (pathname.startsWith("/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/users")) return "users";
  if (pathname.startsWith("/coupons")) return "coupons";
  if (pathname.startsWith("/settings")) return "settings";
  return "dashboard";
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

function AdminNav({ user }: { user?: any; onChangePassword?: () => void; onLogout?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSection = getSectionFromPath(location.pathname);

  const isSettingsRoute = location.pathname.startsWith("/settings");
  const [settingsOpen, setSettingsOpen] = useState(isSettingsRoute);

  const navGroups = [
    {
      group: "OVERVIEW",
      items: [
        { id: "dashboard", icon: BarChart2, label: "Dashboard", path: "/" },
      ],
    },
    {
      group: "MANAGE",
      items: [
        { id: "signals", icon: Zap, label: "Signals", path: "/signals" },
        { id: "posts", icon: BookOpen, label: "Posts", path: "/posts" },
        { id: "notifications", icon: Bell, label: "Notifications", path: "/notifications" },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { id: "subscriptions", icon: CreditCard, label: "Subscriptions", path: "/subscriptions" },
        { id: "users", icon: Users, label: "Users", path: "/users" },
        { id: "coupons", icon: Tag, label: "Coupons", path: "/coupons" },
      ],
    },
  ];

  const settingsSubItems = [
    { label: "Admin Profile", path: "/settings/profile", icon: User },
    { label: "Privacy Policy", path: "/settings/privacy", icon: Shield },
    { label: "Terms & Conditions", path: "/settings/terms", icon: FileText },
    { label: "About Us", path: "/settings/about", icon: Info },
  ];

  return (
    <nav
      style={{
        width: 280,
        height: "100vh",
        background: AD.nav,
        borderRight: `1px solid ${AD.cardB}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px 20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          borderBottom: `1px solid ${AD.cardB}`,
        }}
      >
        <img
          src="/logo.jpg"
          alt="Elite Trading Logo"
          style={{ width: 80, margin: "auto", height: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Nav groups */}
      <div
        style={{
          flex: 1,
          padding: "24px 16px",
          overflowY: "auto",
          scrollbarWidth: "none",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {navGroups.map(({ group, items }) => (
          <div key={group} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontFamily: M,
                fontSize: 10,
                fontWeight: 600,
                color: C.td,
                letterSpacing: "0.1em",
                padding: "0 12px",
                marginBottom: 4,
              }}
            >
              {group}
            </div>
            {items.map(({ id, icon: Icon, label, path }) => {
              const on = currentSection === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  className="a-nav-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: on ? "rgba(128,0,255,0.08)" : "transparent",
                    color: on ? C.t1 : C.t2,
                    border: `1px solid ${on ? "rgba(128,0,255,0.15)" : "transparent"}`,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: P,
                    fontSize: 14,
                    fontWeight: on ? 600 : 500,
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  {on && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        background: C.brand,
                        borderRadius: "0 4px 4px 0",
                        boxShadow: `0 0 10px ${C.brand}`,
                      }}
                    />
                  )}
                  <Icon size={18} color={on ? C.brand : C.td} style={{ transition: "color 0.2s" }} />
                  {label}
                  {on && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.brand,
                        boxShadow: `0 0 8px ${C.brand}`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Settings Accordion Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={() => {
              const willOpen = !settingsOpen;
              setSettingsOpen(willOpen);
              if (willOpen && !isSettingsRoute) {
                navigate("/settings/profile");
              }
            }}
            className="a-nav-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              background: isSettingsRoute ? "rgba(128,0,255,0.08)" : "transparent",
              color: isSettingsRoute ? C.t1 : C.t2,
              border: `1px solid ${isSettingsRoute ? "rgba(128,0,255,0.15)" : "transparent"}`,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: P,
              fontSize: 14,
              fontWeight: isSettingsRoute ? 600 : 500,
              transition: "all 0.2s",
              position: "relative",
            }}
          >
            {isSettingsRoute && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 8,
                  bottom: 8,
                  width: 3,
                  background: C.brand,
                  borderRadius: "0 4px 4px 0",
                  boxShadow: `0 0 10px ${C.brand}`,
                }}
              />
            )}
            <Settings size={18} color={isSettingsRoute ? C.brand : C.td} />
            Settings
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              {settingsOpen ? (
                <ChevronDown size={16} color={C.td} />
              ) : (
                <ChevronRight size={16} color={C.td} />
              )}
            </div>
          </button>

          {/* Sub Dropdown Items */}
          {settingsOpen && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                paddingLeft: 28,
                marginTop: 2,
              }}
            >
              {settingsSubItems.map((subItem) => {
                const isSubActive = location.pathname === subItem.path || (subItem.path === "/settings/profile" && location.pathname === "/settings");
                const SubIcon = subItem.icon;
                return (
                  <button
                    key={subItem.path}
                    onClick={() => navigate(subItem.path)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: isSubActive ? "rgba(128,0,255,0.12)" : "transparent",
                      color: isSubActive ? C.t1 : C.tm,
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: P,
                      fontSize: 12.5,
                      fontWeight: isSubActive ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    <SubIcon size={14} color={isSubActive ? C.brand : C.td} />
                    {subItem.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function AdminTopBar({
  user,
  onChangePassword,
  onLogout,
}: {
  user?: any;
  onChangePassword: () => void;
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSection = getSectionFromPath(location.pathname);

  const titles: Record<AdminSection, [string, string]> = {
    dashboard: ["Overview", "Monitor key metrics and system performance"],
    signals: ["Signals", "Manage and publish trading signals"],
    posts: ["Posts", "Content and announcement management"],
    notifications: ["Notifications", "Push notification center"],
    subscriptions: ["Subscriptions", "Plans and billing management"],
    users: ["Users", "Member management and CRM"],
    coupons: ["Coupons", "Promotions and discounts"],
    settings: ["Settings", "System configuration, profile, and policy management"],
  };
  const [title, subtitle] = titles[currentSection] || titles.dashboard;
  const [showDropdown, setShowDropdown] = useState(false);
  const now = new Date();
  const tStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const adminName = user?.name || "Ahmed Alhajji";
  const initials =
    adminName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AA";

  return (
    <div
      style={{
        height: 80,
        background: "rgba(7,5,26,0.85)",
        backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${AD.cardB}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: P, fontSize: 24, fontWeight: 700, color: C.t1, letterSpacing: "-0.5px" }}>
          {title}
        </div>
        <div style={{ fontFamily: P, fontSize: 13, color: C.tm }}>{subtitle}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: M, fontSize: 12, color: C.td, letterSpacing: "0.05em", textAlign: "right" }}>
            <div>{tStr}</div>
            <div style={{ fontSize: 10, marginTop: 2 }}>Jul 23, 2026</div>
          </div>

          <div
            onClick={() => navigate("/notifications")}
            title="Notifications"
            style={{
              position: "relative",
              cursor: "pointer",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid rgba(255,255,255,0.06)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            className="a-icon-btn-hov"
          >
            <Bell size={20} color={C.t2} />
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.sell,
                border: `2px solid ${AD.nav}`,
                boxShadow: `0 0 8px ${C.sell}`,
              }}
            />
          </div>

          {/* Profile Dropdown Menu */}
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                background: AD.inp,
                border: `1px solid ${AD.inpB}`,
                borderRadius: 12,
                padding: "6px 12px 6px 6px",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `linear-gradient(135deg,${C.gold}40,${C.goldL}20)`,
                  border: `1px solid ${C.gold}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: P, fontSize: 11, fontWeight: 700, color: C.gold }}>{initials}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: P, fontSize: 12, fontWeight: 600, color: C.t1, lineHeight: 1.1 }}>
                  {adminName}
                </span>
                <span style={{ fontFamily: P, fontSize: 10, color: C.td, lineHeight: 1.1 }}>Administrator</span>
              </div>
              <ChevronDown size={14} color={C.td} />
            </div>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: "#0F0C20",
                  border: `1px solid ${AD.cardB}`,
                  borderRadius: 14,
                  width: 210,
                  padding: 6,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                  zIndex: 2000,
                }}
              >
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onChangePassword();
                  }}
                  className="a-btn"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: C.t1,
                    fontFamily: P,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Shield size={14} color={C.brand} /> Change Password
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onLogout();
                  }}
                  className="a-btn"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: C.sell,
                    fontFamily: P,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    marginTop: 4,
                  }}
                >
                  <LogOut size={14} color={C.sell} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App Root ─────────────────────────────────────────────────────────────

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Validate admin session with RTK Query getProfile
  const { isError, error } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (isError && (error as any)?.status === 401) {
      dispatch(logout());
    }
  }, [isError, error, dispatch]);

  if (!isAuthenticated) {
    return <AdminAuth />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: AD.bg, color: C.t1, fontFamily: P, overflow: "hidden" }}>
      <style>{`
        .a-nav-item:hover{background:rgba(255,255,255,0.04)!important;color:rgba(255,255,255,0.85)!important;}
        .a-row:hover{background:rgba(128,0,255,0.07)!important;}
        .a-btn{transition:all 0.15s ease!important;}
        .a-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}
        .a-btn:active{transform:translateY(0)!important;}
        .a-input:focus{border-color:rgba(128,0,255,0.55)!important;box-shadow:0 0 0 3px rgba(128,0,255,0.1)!important;}
        .a-card-hov:hover{border-color:rgba(128,0,255,0.2)!important;}
        .a-tscroll::-webkit-scrollbar{height:4px;}
        .a-tscroll::-webkit-scrollbar-thumb{background:rgba(128,0,255,0.3);border-radius:10px;}
        .a-main::-webkit-scrollbar{width:4px;}
        .a-main::-webkit-scrollbar-thumb{background:rgba(128,0,255,0.25);border-radius:10px;}
        @keyframes aSlide{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .a-section{animation:aSlide 0.22s ease forwards;}
      `}</style>
      <AdminNav user={user} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AdminTopBar
          user={user}
          onChangePassword={() => setShowChangePassword(true)}
          onLogout={() => dispatch(logout())}
        />
        <div className="a-main a-section" style={{ flex: 1, overflowY: "auto" }} key={location.pathname}>
          <Routes>
            <Route path="/" element={<ADashboard />} />
            <Route path="/dashboard" element={<ADashboard />} />
            <Route path="/signals" element={<ASignals />} />
            <Route path="/posts" element={<APosts />} />
            <Route path="/notifications" element={<ANotifications />} />
            <Route path="/subscriptions" element={<ASubscriptions onNavigate={(sec) => navigate("/" + sec)} />} />
            <Route path="/subscriptions/create" element={<EditSubscriptionPlan />} />
            <Route path="/subscriptions/edit/:id" element={<EditSubscriptionPlan />} />
            <Route path="/users" element={<AUsers />} />
            <Route path="/coupons" element={<ACoupons />} />
            <Route path="/settings" element={<ASettings />} />
            <Route path="/settings/profile" element={<ASettings />} />
            <Route path="/settings/privacy" element={<ASettings />} />
            <Route path="/settings/terms" element={<ASettings />} />
            <Route path="/settings/about" element={<ASettings />} />
            <Route path="/settings/*" element={<ASettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
