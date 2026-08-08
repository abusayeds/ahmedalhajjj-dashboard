/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, MoreHorizontal, Pencil, Trash2, Users, EyeOff, Eye,
  Plus, Sparkles, Tag, RefreshCw, Loader2
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, ACard, Chip, ATog
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";
import {
  useGetAllSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetTrialConfigQuery,
  useUpdateTrialConfigMutation,
} from "../../store/api/subscriptionApi";

type PlanData = {
  id: string;
  rawId?: string;
  name: string;
  emoji: string;
  monthly: string;
  yearly: string;
  color: string;
  subs: number;
  status: string;
  features: string[];
  updated: string;
  created: string;
};


export default function ASubscriptions({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // RTK Query API Hooks (Pass true to fetch all plans including disabled for Admin view)
  const { data: apiResponse, isLoading: isApiLoading, isFetching, refetch } = useGetAllSubscriptionsQuery(true);
  const { data: trialConfigRes } = useGetTrialConfigQuery();

  const [updateSubscription, { isLoading: isUpdatingApi }] = useUpdateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeletingApi }] = useDeleteSubscriptionMutation();
  const [updateTrialConfig] = useUpdateTrialConfigMutation();

  // Dynamic Trial & Promo Configuration states
  const [trialOn, setTrialOn] = useState(true);
  const [trialDuration, setTrialDuration] = useState("2 Days");

  const [promoOn, setPromoOn] = useState(true);
  const [promoLimit, setPromoLimit] = useState(100);
  const [promoDuration, setPromoDuration] = useState("1 Month (30 Days)");

  const [deleting, setDeleting] = useState<PlanData | null>(null);
  const [toggleTarget, setToggleTarget] = useState<PlanData | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  // Sync state from backend TrialConfig DB
  useEffect(() => {
    if (trialConfigRes?.data) {
      const cfg = trialConfigRes.data;
      setPromoOn(cfg.promoOn !== false);
      setPromoLimit(cfg.promoLimit || 100);
      setPromoDuration(cfg.promoDuration || "1 Month (30 Days)");
      setTrialOn(cfg.trialOn !== false);
      setTrialDuration(cfg.trialDuration || "2 Days");
    }
  }, [trialConfigRes]);

  const saveTrialConfigToBackend = async (updates: Partial<{
    promoOn: boolean;
    promoLimit: number;
    promoDuration: string;
    trialOn: boolean;
    trialDuration: string;
  }>) => {
    try {
      await updateTrialConfig({
        promoOn: updates.promoOn ?? promoOn,
        promoLimit: updates.promoLimit ?? promoLimit,
        promoDuration: updates.promoDuration ?? promoDuration,
        trialOn: updates.trialOn ?? trialOn,
        trialDuration: updates.trialDuration ?? trialDuration,
      }).unwrap();
    } catch {
      // Silent error or fallback toast
    }
  };

  // Calculate REAL subscriber counts per plan from database
  const realSubscriberStats = useMemo(() => {
    const stats = trialConfigRes?.data?.subscriptionStats;
    if (stats) {
      return {
        total: stats.total,
        vip: stats.vip,
        forex: stats.forex,
        crypto: stats.crypto,
      };
    }
    return { total: 0, vip: 0, forex: 0, crypto: 0 };
  }, [trialConfigRes]);

  // Map API response to Plans with REAL subscriber counts
  const plans = useMemo(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
      return apiResponse.data.map((p) => {
        const nameLower = p.name.toLowerCase();
        let emoji = p.emoji || "⭐";
        let color = p.color || C.brand;
        let realSubs = 0;

        if (nameLower.includes("vip")) {
          emoji = "👑";
          color = C.brand;
          realSubs = realSubscriberStats.vip;
        } else if (nameLower.includes("forex")) {
          emoji = "💱";
          color = C.gold;
          realSubs = realSubscriberStats.forex;
        } else if (nameLower.includes("crypto")) {
          emoji = "₿";
          color = "#60A5FA";
          realSubs = realSubscriberStats.crypto;
        }

        return {
          id: p._id || p.id || `plan-${p.name}`,
          rawId: p._id,
          name: p.name,
          emoji,
          monthly: p.monthly ? String(p.monthly) : String(p.price || "0"),
          yearly: p.yearly ? String(p.yearly) : String((p.price ? Number(p.price) * 10 : 0)),
          color,
          subs: realSubs,
          status: p.isActive !== false ? "Active" : "Hidden",
          features: p.features && p.features.length > 0 ? p.features : [],
          updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—",
          created: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—",
        };
      });
    }

    return [];
  }, [apiResponse, realSubscriberStats]);

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    const newStatus = toggleTarget.status !== "Active";
    if (!toggleTarget.rawId) {
      showToast(newStatus ? "Plan enabled" : "Plan disabled");
      setToggleTarget(null);
      return;
    }
    try {
      await updateSubscription({
        id: toggleTarget.rawId,
        data: { isActive: newStatus },
      }).unwrap();
      showToast(newStatus ? "Plan enabled successfully!" : "Plan disabled successfully!");
      setToggleTarget(null);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update plan status", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    if (!deleting.rawId) {
      showToast("Plan deleted", "error");
      setDeleting(null);
      return;
    }
    try {
      await deleteSubscription(deleting.rawId).unwrap();
      showToast("Subscription plan deleted successfully!", "success");
      setDeleting(null);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete plan", "error");
    }
  };

  const claimedCount = trialConfigRes?.data?.claimedCount ?? 0;
  const promoProgressPercent = Math.min(100, Math.round((claimedCount / promoLimit) * 100));

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            Subscription Plans
          </h2>
          <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>
            MANAGE PLANS, PRICING & BACKEND TRIAL CONFIGURATION
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
              background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9,
              fontFamily: P, fontSize: 12, color: C.t2, cursor: "pointer"
            }}
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} color={C.tm} /> Refresh
          </button>
          <AGhost icon={<Tag size={14} />} onClick={() => onNavigate?.("coupons")}>
            Manage Coupons
          </AGhost>
          <APrimary onClick={() => navigate("/subscriptions/create")} icon={<Plus size={14} />}>
            Create Plan
          </APrimary>
        </div>
      </div>

      {/* Monthly / Yearly Switcher */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", background: AD.inp, borderRadius: 10, padding: 4, gap: 4 }}>
          <button onClick={() => setBilling("monthly")} style={{ padding: "8px 24px", borderRadius: 6, background: billing === "monthly" ? "rgba(255,255,255,0.1)" : "transparent", color: billing === "monthly" ? "#fff" : C.td, fontFamily: P, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}>Monthly Billing</button>
          <button onClick={() => setBilling("yearly")} style={{ padding: "8px 24px", borderRadius: 6, background: billing === "yearly" ? "rgba(255,255,255,0.1)" : "transparent", color: billing === "yearly" ? "#fff" : C.td, fontFamily: P, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}>Yearly Billing</button>
        </div>
      </div>

      {/* Plan Cards */}
      {isApiLoading ? (
        <div style={{ padding: 80, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
          Loading subscription plans from server API...
        </div>
      ) : plans.length === 0 ? (
        <div style={{ padding: 80, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
          No subscription plans found. Click <strong>Create Plan</strong> to add your first plan.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 40 }}>
          {plans.map(plan => (
            <div key={plan.id} className="a-plan-card" style={{ background: AD.nav, border: `1px solid ${plan.color}22`, borderRadius: 20, overflow: "hidden", position: "relative" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${AD.cardB}`, position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${plan.color},transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${plan.color}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${plan.color}33` }}>{plan.emoji}</div>
                    <div>
                      <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{plan.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Chip label={plan.status} type={plan.status === "Active" ? "ok" : "muted"} />
                        <span style={{ fontFamily: P, fontSize: 11, color: C.tm }}>
                          <strong>{plan.subs}</strong> active members
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <button className="a-btn" onClick={() => setActionMenu(actionMenu === plan.id ? null : plan.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: "none", color: C.td, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><MoreHorizontal size={18} /></button>
                    {actionMenu === plan.id && <div style={{ position: "absolute", right: 0, top: 36, background: "#151228", border: `1px solid ${AD.inpB}`, borderRadius: 12, padding: 6, width: 190, zIndex: 20, boxShadow: "0 12px 32px rgba(0,0,0,0.6)" }}>
                      <button className="a-dd-item" onClick={() => { setActionMenu(null); navigate(`/subscriptions/edit/${plan.rawId || plan.id}`); }}><Pencil size={14} /> Edit Plan</button>
                      <button className="a-dd-item" onClick={() => { setToggleTarget(plan); setActionMenu(null); }}>
                        {plan.status === "Active" ? <><EyeOff size={14} /> Disable</> : <><Eye size={14} /> Enable</>}
                      </button>
                      <button className="a-dd-item" onClick={() => { setActionMenu(null); onNavigate?.("users"); }}><Users size={14} /> View Subscribers</button>
                      <div style={{ height: 1, background: AD.cardB, margin: "4px 0" }} />
                      <button className="a-dd-item" onClick={() => { setDeleting(plan); setActionMenu(null); }} style={{ color: C.sell }}><Trash2 size={14} /> Delete Plan</button>
                    </div>}
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, color: plan.color }}>
                    <span style={{ fontFamily: M, fontSize: 28, fontWeight: 700 }}>${billing === "monthly" ? plan.monthly : plan.yearly}</span>
                    <span style={{ fontFamily: P, fontSize: 13, opacity: 0.8 }}>/ {billing === "monthly" ? "month" : "year"}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: "24px 28px", background: AD.card }}>
                <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 16 }}>FEATURES INCLUDED ({plan.features.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 240 }}>
                  {plan.features.map(f => <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><CheckCircle size={14} color={plan.color} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ fontFamily: P, fontSize: 13, color: C.tm }}>{f}</span></div>)}
                </div>
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: P, fontSize: 11, color: C.td }}>Updated {plan.updated}</span>
                  <span style={{ fontFamily: M, fontSize: 10, color: C.brand, background: "rgba(128,0,255,0.1)", padding: "2px 8px", borderRadius: 100 }}>Synced</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Free Trial & Dynamic Promo Settings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Dynamic Standard Free Trial Management */}
        <ACard style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>
                Standard Free Trial Configuration
              </div>
              <div style={{ fontFamily: P, fontSize: 12, color: C.tm }}>
                Set free trial period for all new signups after the first promo users limit.
              </div>
            </div>
            <ATog
              on={trialOn}
              onChange={v => {
                setTrialOn(v);
                saveTrialConfigToBackend({ trialOn: v });
                showToast(v ? "Standard Free Trial enabled" : "Standard Free Trial disabled");
              }}
            />
          </div>

          <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 14, padding: "20px" }}>
            <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 12 }}>
              DYNAMIC TRIAL DURATION (DEFAULT: 2 DAYS)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {["1 Day", "2 Days", "3 Days", "7 Days"].map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setTrialDuration(d);
                    saveTrialConfigToBackend({ trialDuration: d });
                    showToast(`Standard Free Trial set to ${d}`);
                  }}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 8,
                    background: trialDuration === d ? C.brand : "transparent",
                    color: trialDuration === d ? "#fff" : C.td,
                    fontFamily: P,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 12 }}>
              Requires account creation before accessing app features. Non-subscribers get access to previous day signals only.
            </div>
          </div>
        </ACard>

        {/* Dynamic First N Users Free Access Promo Control */}
        <div style={{ background: `linear-gradient(135deg, ${C.brand}16, transparent)`, border: `1px solid ${C.brand}33`, borderRadius: 20, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, background: `radial-gradient(circle, ${C.brand}44 0%, transparent 70%)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} color={C.gold} /> First N Users Free Access Offer
              </div>
              <div style={{ fontFamily: P, fontSize: 12, color: C.tm }}>
                Configure number of initial users and free access duration dynamically.
              </div>
            </div>
            <ATog
              on={promoOn}
              onChange={v => {
                setPromoOn(v);
                saveTrialConfigToBackend({ promoOn: v });
                showToast(v ? "First N Users offer enabled" : "Offer disabled");
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${AD.cardB}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 8 }}>FREE USERS LIMIT</div>
              <input
                type="number"
                min="1"
                value={promoLimit}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value) || 1);
                  setPromoLimit(val);
                  saveTrialConfigToBackend({ promoLimit: val });
                }}
                style={{
                  width: "100%",
                  background: "#151228",
                  border: `1px solid ${AD.inpB}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontFamily: M,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${AD.cardB}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 8 }}>FREE DURATION</div>
              <select
                value={promoDuration}
                onChange={(e) => {
                  const val = e.target.value;
                  setPromoDuration(val);
                  saveTrialConfigToBackend({ promoDuration: val });
                }}
                style={{
                  width: "100%",
                  background: "#151228",
                  border: `1px solid ${AD.inpB}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontFamily: P,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box"
                }}
              >
                <option value="1 Month (30 Days)" style={{ background: "#151228", color: "#FFFFFF" }}>1 Month (30 Days)</option>
                <option value="2 Months (60 Days)" style={{ background: "#151228", color: "#FFFFFF" }}>2 Months (60 Days)</option>
                <option value="15 Days" style={{ background: "#151228", color: "#FFFFFF" }}>15 Days</option>
                <option value="2 Weeks" style={{ background: "#151228", color: "#FFFFFF" }}>2 Weeks</option>
              </select>
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: P, fontSize: 12, color: C.tm }}>
                Real Registered Claimed: <strong>{claimedCount}</strong> / {promoLimit} Users
              </span>
              <span style={{ fontFamily: M, fontSize: 12, color: C.gold, fontWeight: 700 }}>
                {promoProgressPercent}%
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 100, background: "rgba(0,0,0,0.3)" }}>
              <div style={{ width: `${promoProgressPercent}%`, height: "100%", borderRadius: 100, background: `linear-gradient(90deg,${C.brand},${C.gold})` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleting && (
        <ConfirmDeleteModal
          title={`Delete ${deleting.name}?`}
          message={`This plan currently has <strong>${deleting.subs} active subscribers</strong>. Deleting this plan will not cancel their active subscriptions, but no new users will be able to subscribe to it. This action cannot be undone.`}
          loading={isDeletingApi}
          onCancel={() => setDeleting(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Enable/Disable Confirmation */}
      {toggleTarget && (
        <ConfirmActionModal
          title={`${toggleTarget.status === "Active" ? "Disable" : "Enable"} ${toggleTarget.name}?`}
          message={toggleTarget.status === "Active"
            ? `Disabling this plan will hide it from new subscribers. <strong>${toggleTarget.subs} existing members</strong> will not be affected.`
            : `Enabling this plan will make it visible to new subscribers on the pricing page.`}
          confirmLabel={toggleTarget.status === "Active" ? "Disable Plan" : "Enable Plan"}
          icon={toggleTarget.status === "Active" ? <EyeOff size={28} color="#F59E0B" /> : <Eye size={28} color={C.buy} />}
          iconColor={toggleTarget.status === "Active" ? "#F59E0B" : C.buy}
          iconBg={toggleTarget.status === "Active" ? "rgba(245,158,11,0.1)" : "rgba(0,208,132,0.1)"}
          loading={isUpdatingApi}
          onCancel={() => setToggleTarget(null)}
          onConfirm={handleConfirmToggle}
        />
      )}
    </div>
  );
}
