import { useState } from "react";
import {
  CheckCircle, MoreHorizontal, Pencil, Trash2, Users, EyeOff, Eye,
  Plus, Sparkles, X, Tag,
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ATa, ASel, ACard, Chip, ATog,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";

type PlanData = {
  id: string; name: string; emoji: string; monthly: string; yearly: string;
  color: string; subs: number; status: string;
  features: string[]; updated: string; created: string;
};

const INITIAL_PLANS: PlanData[] = [
  { id: "vip", name: "VIP Plan", emoji: "👑", monthly: "79", yearly: "699", color: C.brand, subs: 384, status: "Active", features: ["All Forex Signals", "All Crypto Signals", "Gold & Commodities", "Index Signals", "Priority Push Alerts", "VIP Community", "Q&A Sessions", "Weekly Reports"], updated: "2 days ago", created: "Jan 12, 2026" },
  { id: "forex", name: "Forex Pro", emoji: "💱", monthly: "49", yearly: "469", color: C.gold, subs: 521, status: "Active", features: ["All Forex Signals", "Gold & Commodities", "Push Alerts", "Community Access", "Weekly Recap"], updated: "1 week ago", created: "Jan 15, 2026" },
  { id: "crypto", name: "Crypto Pro", emoji: "₿", monthly: "39", yearly: "369", color: "#60A5FA", subs: 289, status: "Hidden", features: ["All Crypto Signals", "Altcoin Alerts", "Push Alerts", "Community Access", "Weekly Recap"], updated: "3 weeks ago", created: "Feb 02, 2026" },
];

export default function ASubscriptions({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<PlanData[]>(INITIAL_PLANS);
  const [trialOn, setTrialOn] = useState(true);
  const [earlyOn, setEarlyOn] = useState(true);
  const [editing, setEditing] = useState<PlanData | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<PlanData | null>(null);
  const [toggleTarget, setToggleTarget] = useState<PlanData | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  // Form state
  const [pf, setPf] = useState({ name: "", monthly: "", yearly: "", emoji: "", color: "#8000FF", features: "", visibility: "Active" });

  const resetForm = () => setPf({ name: "", monthly: "", yearly: "", emoji: "", color: "#8000FF", features: "", visibility: "Active" });

  const openEdit = (plan: PlanData) => {
    setPf({ name: plan.name, monthly: plan.monthly, yearly: plan.yearly, emoji: plan.emoji, color: plan.color, features: plan.features.join("\n"), visibility: plan.status });
    setEditing(plan);
  };

  const doAction = (cb: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, 1000);
  };

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Subscription Plans</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>MANAGE PLANS, PRICING & TRIALS</div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AGhost icon={<Tag size={14} />} onClick={() => onNavigate?.("coupons")}>Manage Coupons</AGhost>
        <APrimary onClick={() => { resetForm(); setCreating(true); }} icon={<Plus size={14} />}>Create Plan</APrimary>
      </div>
    </div>

    <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
      <div style={{ display: "flex", background: AD.inp, borderRadius: 10, padding: 4, gap: 4 }}>
        <button onClick={() => setBilling("monthly")} style={{ padding: "8px 24px", borderRadius: 6, background: billing === "monthly" ? "rgba(255,255,255,0.1)" : "transparent", color: billing === "monthly" ? "#fff" : C.td, fontFamily: P, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}>Monthly Billing</button>
        <button onClick={() => setBilling("yearly")} style={{ padding: "8px 24px", borderRadius: 6, background: billing === "yearly" ? "rgba(255,255,255,0.1)" : "transparent", color: billing === "yearly" ? "#fff" : C.td, fontFamily: P, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}>Yearly Billing</button>
      </div>
    </div>

    {/* Plan Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 40 }}>
      {plans.map(plan => <div key={plan.id} className="a-plan-card" style={{ background: AD.nav, border: `1px solid ${plan.color}22`, borderRadius: 20, overflow: "hidden", position: "relative" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${AD.cardB}`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${plan.color},transparent)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${plan.color}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${plan.color}33` }}>{plan.emoji}</div>
              <div>
                <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Chip label={plan.status} type={plan.status === "Active" ? "ok" : "muted"} />
                  <span style={{ fontFamily: P, fontSize: 11, color: C.tm }}>{plan.subs} members</span>
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <button className="a-btn" onClick={() => setActionMenu(actionMenu === plan.id ? null : plan.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: "none", color: C.td, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><MoreHorizontal size={18} /></button>
              {actionMenu === plan.id && <div style={{ position: "absolute", right: 0, top: 36, background: "#151228", border: `1px solid ${AD.inpB}`, borderRadius: 12, padding: 6, width: 190, zIndex: 20, boxShadow: "0 12px 32px rgba(0,0,0,0.6)" }}>
                <button className="a-dd-item" onClick={() => { openEdit(plan); setActionMenu(null); }}><Pencil size={14} /> Edit Plan</button>
                <button className="a-dd-item" onClick={() => { setToggleTarget(plan); setActionMenu(null); }}>
                  {plan.status === "Active" ? <><EyeOff size={14} /> Disable</> : <><Eye size={14} /> Enable</>}
                </button>
                <button className="a-dd-item" onClick={() => { setActionMenu(null); }}><Users size={14} /> View Subscribers</button>
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
          <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 16 }}>FEATURES INCLUDED</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 220 }}>
            {plan.features.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}><CheckCircle size={14} color={plan.color} /><span style={{ fontFamily: P, fontSize: 13, color: C.tm }}>{f}</span></div>)}
          </div>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: P, fontSize: 11, color: C.td }}>Updated {plan.updated}</span>
            <span style={{ fontFamily: P, fontSize: 11, color: C.td }}>Created {plan.created}</span>
          </div>
        </div>
      </div>)}
    </div>

    {/* Free Trial Settings & Promo */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <ACard style={{ padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Free Trial Management</div>
            <div style={{ fontFamily: P, fontSize: 12, color: C.tm }}>Configure default trial periods for new signups.</div>
          </div>
          <ATog on={trialOn} onChange={v => { setTrialOn(v); showToast(v ? "Free trial enabled" : "Free trial disabled"); }} />
        </div>
        <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 14, padding: "20px" }}>
          <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 14 }}>DEFAULT DURATION</div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 4 }}>
            {["None", "1 Day", "3 Days", "7 Days"].map(d => <button key={d} onClick={() => showToast(`Trial duration set to ${d}`)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: d === "3 Days" ? C.brand : "transparent", color: d === "3 Days" ? "#fff" : C.td, fontFamily: P, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}>{d}</button>)}
          </div>
          <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 12 }}>Trial requires a valid payment method upfront.</div>
        </div>
      </ACard>

      <div style={{ background: `linear-gradient(135deg, ${C.brand}16, transparent)`, border: `1px solid ${C.brand}33`, borderRadius: 20, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, background: `radial-gradient(circle, ${C.brand}44 0%, transparent 70%)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} color={C.gold} /> First 100 Users Promo</div>
            <div style={{ fontFamily: P, fontSize: 12, color: C.tm }}>Founding member special offer active.</div>
          </div>
          <ATog on={earlyOn} onChange={v => { setEarlyOn(v); showToast(v ? "Promo enabled" : "Promo disabled"); }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 6 }}>TOTAL SLOTS</div>
            <div style={{ fontFamily: M, fontSize: 22, fontWeight: 700, color: C.t1 }}>100</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 6 }}>CLAIMED</div>
            <div style={{ fontFamily: M, fontSize: 22, fontWeight: 700, color: C.buy }}>58</div>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontFamily: P, fontSize: 12, color: C.tm }}>Campaign Progress</span><span style={{ fontFamily: M, fontSize: 12, color: C.gold }}>58%</span></div>
          <div style={{ height: 6, borderRadius: 100, background: "rgba(0,0,0,0.3)" }}><div style={{ width: "58%", height: "100%", borderRadius: 100, background: `linear-gradient(90deg,${C.brand},${C.gold})` }} /></div>
        </div>
      </div>
    </div>

    {/* Create / Edit Plan Modal */}
    {(creating || editing) && <div className="a-modal-overlay" onClick={() => { setCreating(false); setEditing(null); }}>
      <div className="a-modal" onClick={e => e.stopPropagation()} style={{ width: 600, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 32px", borderBottom: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1 }}>{creating ? "Create Subscription Plan" : "Edit Subscription Plan"}</div>
          <button className="a-btn" onClick={() => { setCreating(false); setEditing(null); }} style={{ background: "transparent", border: "none", color: C.td, cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div className="a-tscroll" style={{ padding: "32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
          <AIn label="Plan Name" placeholder="e.g. Diamond VIP" value={pf.name} onChange={v => setPf({ ...pf, name: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <AIn label="Monthly Price ($)" placeholder="0.00" value={pf.monthly} onChange={v => setPf({ ...pf, monthly: v })} />
            <AIn label="Yearly Price ($)" placeholder="0.00" value={pf.yearly} onChange={v => setPf({ ...pf, yearly: v })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <AIn label="Plan Icon (Emoji)" placeholder="e.g. 💎" value={pf.emoji} onChange={v => setPf({ ...pf, emoji: v })} />
            <AIn label="Theme Color (Hex)" placeholder="#FFFFFF" value={pf.color} onChange={v => setPf({ ...pf, color: v })} />
          </div>
          <ATa label="Features (one per line)" placeholder={"Feature 1\nFeature 2"} value={pf.features} onChange={v => setPf({ ...pf, features: v })} rows={5} />
          <ASel label="Visibility" opts={[{ l: "Active (Public)", v: "Active" }, { l: "Hidden (Private link)", v: "Hidden" }]} value={pf.visibility} onChange={v => setPf({ ...pf, visibility: v })} />
        </div>
        <div style={{ padding: "24px 32px", borderTop: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "flex-end", gap: 12, background: AD.card, borderRadius: "0 0 20px 20px" }}>
          <AGhost onClick={() => { setCreating(false); setEditing(null); }}>Cancel</AGhost>
          <APrimary loading={loading} onClick={() => doAction(() => {
            if (creating) {
              const newPlan: PlanData = {
                id: `plan-${Date.now()}`, name: pf.name || "New Plan", emoji: pf.emoji || "⭐",
                monthly: pf.monthly || "29", yearly: pf.yearly || "249", color: pf.color || C.brand,
                subs: 0, status: pf.visibility, features: pf.features.split("\n").filter(Boolean),
                updated: "Just now", created: "Jul 24, 2026"
              };
              setPlans([...plans, newPlan]);
              setCreating(false); showToast("Plan created successfully!");
            } else if (editing) {
              setPlans(plans.map(p => p.id === editing.id ? { ...p, name: pf.name, monthly: pf.monthly, yearly: pf.yearly, emoji: pf.emoji, color: pf.color, features: pf.features.split("\n").filter(Boolean), status: pf.visibility, updated: "Just now" } : p));
              setEditing(null); showToast("Plan updated successfully!");
            }
            resetForm();
          })}>{creating ? "Create Plan" : "Save Changes"}</APrimary>
        </div>
      </div>
    </div>}

    {/* Delete Confirmation */}
    {deleting && <ConfirmDeleteModal
      title={`Delete ${deleting.name}?`}
      message={`This plan currently has <strong>${deleting.subs} active subscribers</strong>. Deleting this plan will not cancel their active subscriptions, but no new users will be able to subscribe to it. This action cannot be undone.`}
      loading={loading}
      onCancel={() => setDeleting(null)}
      onConfirm={() => doAction(() => {
        setPlans(plans.filter(p => p.id !== deleting.id));
        setDeleting(null); showToast("Plan deleted", "error");
      })}
    />}

    {/* Enable/Disable Confirmation */}
    {toggleTarget && <ConfirmActionModal
      title={`${toggleTarget.status === "Active" ? "Disable" : "Enable"} ${toggleTarget.name}?`}
      message={toggleTarget.status === "Active"
        ? `Disabling this plan will hide it from new subscribers. <strong>${toggleTarget.subs} existing members</strong> will not be affected.`
        : `Enabling this plan will make it visible to new subscribers on the pricing page.`}
      confirmLabel={toggleTarget.status === "Active" ? "Disable Plan" : "Enable Plan"}
      icon={toggleTarget.status === "Active" ? <EyeOff size={28} color="#F59E0B" /> : <Eye size={28} color={C.buy} />}
      iconColor={toggleTarget.status === "Active" ? "#F59E0B" : C.buy}
      iconBg={toggleTarget.status === "Active" ? "rgba(245,158,11,0.1)" : "rgba(0,208,132,0.1)"}
      loading={loading}
      onCancel={() => setToggleTarget(null)}
      onConfirm={() => doAction(() => {
        setPlans(plans.map(p => p.id === toggleTarget.id ? { ...p, status: p.status === "Active" ? "Hidden" : "Active" } : p));
        setToggleTarget(null);
        showToast(toggleTarget.status === "Active" ? "Plan disabled" : "Plan enabled");
      })}
    />}
  </div>;
}
