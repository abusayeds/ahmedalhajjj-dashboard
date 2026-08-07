import { useState } from "react";
import {
  Search, RefreshCw, Plus, Pencil, Trash2, Tag, ChevronLeft, ChevronRight,
  Copy, Check, ToggleLeft, ToggleRight,
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, AModal, ACard, Chip, IconBtn,
  INITIAL_COUPONS, CouponData,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";

export default function ACoupons() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponData[]>(INITIAL_COUPONS);
  const [createModal, setCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<CouponData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CouponData | null>(null);
  const [toggleTarget, setToggleTarget] = useState<CouponData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [form, setForm] = useState({ code: "", discount: "", expiry: "", limit: "" });

  const resetForm = () => setForm({ code: "", discount: "", expiry: "", limit: "" });

  const doAction = (cb: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, 1000);
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const COLS = "minmax(180px,1fr) 140px 160px 120px 180px 140px 160px";
  const HEAD = ["CODE", "DISCOUNT", "EXPIRY", "LIMIT", "USAGE", "STATUS", "ACTIONS"];

  const campaigns = [
    { name: "Seasonal Campaign", desc: "Summer 2026", emoji: "☀️", disc: "30% OFF", active: true },
    { name: "VIP Loyalty", desc: "Reward for VIPs", emoji: "👑", disc: "25% OFF", active: false },
    { name: "Referral Program", desc: "Refer & earn", emoji: "🔗", disc: "15% OFF", active: true },
    { name: "Flash Sale", desc: "48-hour offer", emoji: "⚡", disc: "50% OFF", active: false },
  ];

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Coupons & Promotions</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{coupons.length} CODES · {coupons.filter(c => c.status === "Active").length} ACTIVE</div>
      </div>
    </div>

    <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 300 }}>
          <Search size={14} color={C.td} />
          <input placeholder="Search coupons..." style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AGhost icon={<RefreshCw size={14} />}>Refresh</AGhost>
        <APrimary onClick={() => { resetForm(); setCreateModal(true); }} icon={<Plus size={14} />}>Create Coupon</APrimary>
      </div>
    </ACard>

    <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.14em", marginBottom: 16 }}>COUPON CODES</div>
    <ACard style={{ marginBottom: 32 }}>
      <div className="a-tscroll" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1000 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderRadius: "18px 18px 0 0", borderBottom: `1px solid ${AD.cardB}` }}>
            {HEAD.map(h => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
          </div>
          {coupons.map((cp, i) => <div key={cp.code} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "24px 28px", borderBottom: i < coupons.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.brand, letterSpacing: "0.05em" }}>{cp.code}</span>
              <button className="a-btn" onClick={() => copyCode(cp.code)} title="Copy Code" style={{ width: 28, height: 28, borderRadius: 7, background: copiedCode === cp.code ? "rgba(0,208,132,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${copiedCode === cp.code ? "rgba(0,208,132,0.3)" : "rgba(255,255,255,0.06)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
                {copiedCode === cp.code ? <Check size={12} color={C.buy} /> : <Copy size={12} color={C.td} />}
              </button>
            </div>
            <span style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.gold }}>{cp.discount}</span>
            <span style={{ fontFamily: M, fontSize: 13, color: C.td }}>{cp.expiry}</span>
            <span style={{ fontFamily: M, fontSize: 14, color: C.t2 }}>{cp.limit}</span>
            <div style={{ paddingRight: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontFamily: M, fontSize: 12, color: C.t2 }}>{cp.used} / {cp.limit}</span><span style={{ fontFamily: M, fontSize: 11, color: C.td }}>{Math.round((cp.used / cp.limit) * 100)}%</span></div>
              <div style={{ height: 4, borderRadius: 100, background: "rgba(255,255,255,0.06)" }}><div style={{ width: `${(cp.used / cp.limit) * 100}%`, height: "100%", borderRadius: 100, background: C.brand }} /></div>
            </div>
            <div><Chip label={cp.status} type={cp.status === "Active" ? "ok" : cp.status === "Exhausted" ? "warn" : "muted"} /></div>
            <div style={{ display: "flex", gap: 6 }}>
              <IconBtn icon={<Pencil size={14} color={C.t2} />} title="Edit" onClick={() => {
                setForm({ code: cp.code, discount: cp.discount.replace("%", ""), expiry: cp.expiry, limit: String(cp.limit) });
                setEditTarget(cp);
              }} />
              <IconBtn
                icon={cp.status === "Active" ? <ToggleRight size={14} color={C.buy} /> : <ToggleLeft size={14} color={C.td} />}
                title={cp.status === "Active" ? "Deactivate" : "Activate"}
                onClick={() => setToggleTarget(cp)}
                bg={cp.status === "Active" ? "rgba(0,208,132,0.08)" : undefined}
              />
              <IconBtn icon={<Trash2 size={14} color={C.sell} />} title="Delete" onClick={() => setDeleteTarget(cp)} />
            </div>
          </div>)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
        <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {coupons.length} of {coupons.length} records</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </ACard>

    {/* Promotions */}
    <div style={{ fontFamily: M, fontSize: 8.5, color: C.td, letterSpacing: "0.14em", marginBottom: 13 }}>PROMOTIONS</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13 }}>
      {campaigns.map(camp => <ACard key={camp.name} style={{ padding: "18px 20px", border: camp.active ? `1px solid rgba(128,0,255,0.2)` : `1px solid ${AD.cardB}` }} hover>
        <div style={{ fontSize: 26, marginBottom: 9 }}>{camp.emoji}</div>
        <div style={{ fontFamily: P, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{camp.name}</div>
        <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginBottom: 10 }}>{camp.desc}</div>
        <div style={{ fontFamily: M, fontSize: 17, fontWeight: 700, color: camp.active ? C.brand : C.td, marginBottom: 12 }}>{camp.disc}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Chip label={camp.active ? "Active" : "Inactive"} type={camp.active ? "ok" : "muted"} />
          <button onClick={() => showToast("Campaign editor coming soon!", "info")} style={{ fontFamily: P, fontSize: 10, color: C.brand, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}>Edit →</button>
        </div>
      </ACard>)}
    </div>

    {/* Create Coupon Modal */}
    {createModal && <AModal title="Create Coupon" sub="Define the discount code, amount, and expiry" onClose={() => setCreateModal(false)} width={460}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <AIn label="Coupon Code" placeholder="e.g. SUMMER50" value={form.code} onChange={v => setForm({ ...form, code: v.toUpperCase() })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <AIn label="Discount %" placeholder="e.g. 30" value={form.discount} onChange={v => setForm({ ...form, discount: v })} type="number" />
          <AIn label="Usage Limit" placeholder="e.g. 100" value={form.limit} onChange={v => setForm({ ...form, limit: v })} type="number" />
        </div>
        <AIn label="Expiry Date" value={form.expiry} onChange={v => setForm({ ...form, expiry: v })} type="date" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
          <AGhost onClick={() => setCreateModal(false)}>Cancel</AGhost>
          <APrimary icon={<Tag size={13} />} loading={loading} onClick={() => doAction(() => {
            setCoupons([{ code: form.code || "NEW", discount: `${form.discount || "10"}%`, expiry: form.expiry || "Aug 30, 2026", limit: parseInt(form.limit) || 50, used: 0, status: "Active" }, ...coupons]);
            setCreateModal(false); resetForm(); showToast("Coupon created successfully!");
          })}>Create Coupon</APrimary>
        </div>
      </div>
    </AModal>}

    {/* Edit Coupon Modal */}
    {editTarget && <AModal title="Edit Coupon" sub={`Editing: ${editTarget.code}`} onClose={() => setEditTarget(null)} width={460}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <AIn label="Coupon Code" placeholder="e.g. SUMMER50" value={form.code} onChange={v => setForm({ ...form, code: v.toUpperCase() })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <AIn label="Discount %" placeholder="e.g. 30" value={form.discount} onChange={v => setForm({ ...form, discount: v })} type="number" />
          <AIn label="Usage Limit" placeholder="e.g. 100" value={form.limit} onChange={v => setForm({ ...form, limit: v })} type="number" />
        </div>
        <AIn label="Expiry Date" value={form.expiry} onChange={v => setForm({ ...form, expiry: v })} type="date" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
          <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
          <APrimary loading={loading} onClick={() => doAction(() => {
            setCoupons(coupons.map(c => c.code === editTarget.code ? { ...c, code: form.code, discount: `${form.discount}%`, limit: parseInt(form.limit) || c.limit, expiry: form.expiry || c.expiry } : c));
            setEditTarget(null); showToast("Coupon updated successfully!");
          })}>Save Changes</APrimary>
        </div>
      </div>
    </AModal>}

    {/* Delete Confirmation */}
    {deleteTarget && <ConfirmDeleteModal
      message={`Are you sure you want to delete coupon <strong>${deleteTarget.code}</strong>? This code has been used <strong>${deleteTarget.used} times</strong>. Deleting it will prevent any further redemptions. This action cannot be undone.`}
      loading={loading}
      onCancel={() => setDeleteTarget(null)}
      onConfirm={() => doAction(() => {
        setCoupons(coupons.filter(c => c.code !== deleteTarget.code));
        setDeleteTarget(null); showToast("Coupon deleted", "error");
      })}
    />}

    {/* Activate / Deactivate Confirmation */}
    {toggleTarget && <ConfirmActionModal
      title={`${toggleTarget.status === "Active" ? "Deactivate" : "Activate"} ${toggleTarget.code}?`}
      message={toggleTarget.status === "Active"
        ? `Deactivating this coupon will prevent new users from redeeming it. Existing redemptions are not affected.`
        : `Activating this coupon will allow users to redeem it again.`}
      confirmLabel={toggleTarget.status === "Active" ? "Deactivate" : "Activate"}
      icon={toggleTarget.status === "Active" ? <ToggleLeft size={28} color="#F59E0B" /> : <ToggleRight size={28} color={C.buy} />}
      iconColor={toggleTarget.status === "Active" ? "#F59E0B" : C.buy}
      iconBg={toggleTarget.status === "Active" ? "rgba(245,158,11,0.1)" : "rgba(0,208,132,0.1)"}
      loading={loading}
      onCancel={() => setToggleTarget(null)}
      onConfirm={() => doAction(() => {
        setCoupons(coupons.map(c => c.code === toggleTarget.code ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c));
        setToggleTarget(null);
        showToast(toggleTarget.status === "Active" ? "Coupon deactivated" : "Coupon activated");
      })}
    />}
  </div>;
}
