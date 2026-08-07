import { useLocation, useNavigate } from "react-router-dom";
import { User, Shield, FileText, Info, HelpCircle } from "lucide-react";
import { C, P, M, AD } from "./shared";
import AdminProfileView from "./AdminProfileView";
import ManagementEditor from "./ManagementEditor";

export default function ASettings() {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (pathname: string): "profile" | "privacy" | "terms" | "about" => {
    if (pathname.includes("/privacy")) return "privacy";
    if (pathname.includes("/terms")) return "terms";
    if (pathname.includes("/about")) return "about";
    return "profile";
  };

  const activeTab = getTabFromPath(location.pathname);

  const tabs: { id: "profile" | "privacy" | "terms" | "about"; label: string; icon: React.ElementType; path: string }[] = [
    { id: "profile", label: "Admin Profile", icon: User, path: "/settings/profile" },
    { id: "privacy", label: "Privacy Policy", icon: Shield, path: "/settings/privacy" },
    { id: "terms", label: "Terms & Conditions", icon: FileText, path: "/settings/terms" },
    { id: "about", label: "About Us", icon: Info, path: "/settings/about" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Sub Header Navigation Bar */}
      <div style={{ background: "rgba(255,255,255,0.015)", borderBottom: `1px solid ${AD.cardB}`, padding: "0 32px", display: "flex", alignItems: "center", gap: 12 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 16px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${isActive ? C.brand : "transparent"}`,
                color: isActive ? C.t1 : C.tm,
                fontFamily: P,
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Icon size={16} color={isActive ? C.brand : C.td} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1 }}>
        {activeTab === "profile" && <AdminProfileView />}
        {activeTab === "privacy" && (
          <ManagementEditor
            type="privacy"
            title="Privacy Policy"
            subtitle="Manage, format, and save Privacy Policy content directly to the backend database."
          />
        )}
        {activeTab === "terms" && (
          <ManagementEditor
            type="terms"
            title="Terms & Conditions"
            subtitle="Manage, format, and save Terms & Conditions content directly to the backend database."
          />
        )}
        {activeTab === "about" && (
          <ManagementEditor
            type="about"
            title="About Us"
            subtitle="Manage, format, and save About Us content directly to the backend database."
          />
        )}
      </div>
    </div>
  );
}
