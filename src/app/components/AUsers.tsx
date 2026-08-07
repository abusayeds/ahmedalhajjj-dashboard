import { useState } from "react";
import {
  Search, RefreshCw, Download, Pencil, Trash2, Crown, Shield,
  Calendar, ChevronLeft, ChevronRight, X, Check, User, Mail, CreditCard,
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ASel, ACard, Chip, IconBtn,
  INITIAL_USERS, UserData,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";

export default function AUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [selected, setSelected] = useState<UserData | null>(null);
  const [q, setQ] = useState("");
  const [planF, setPlanF] = useState("All");
  const [editTarget, setEditTarget] = useState<UserData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<UserData | null>(null);
  const [resetTarget, setResetTarget] = useState<UserData | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<UserData | null>(null);
  const [extendTarget, setExtendTarget] = useState<UserData | null>(null);
  const [profileTarget, setProfileTarget] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit form
  const [ef, setEf] = useState({ name: "", email: "", plan: "VIP", status: "Active" });
  const [upgradePlan, setUpgradePlan] = useState("VIP");
  const [extendDays, setExtendDays] = useState("7");

  const pCol: Record<string, string> = { VIP: C.brand, Forex: C.gold, Crypto: "#60A5FA" };
  const sType: Record<string, "ok" | "warn" | "err" | "info"> = { Active: "ok", Trial: "info", Expired: "warn", Suspended: "err" };
  const filtered = users.filter(u => (planF === "All" || u.plan === planF) && (q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())));
  const COLS = "minmax(280px,1.5fr) 140px 140px 100px 140px 140px 120px";
  const HEAD = ["USER", "PLAN", "STATUS", "TRIAL", "JOINED", "RENEWAL", "ACTIONS"];

  const doAction = (cb: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, 1000);
  };

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Users</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{users.length} REGISTERED MEMBERS</div>
      </div>
    </div>

    <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 300 }}>
          <Search size={14} color={C.td} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or email…" style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }} />
        </div>
        <div style={{ width: 1, height: 24, background: AD.cardB }} />
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.02)", padding: 6, borderRadius: 10, border: `1px solid rgba(255,255,255,0.04)` }}>
          {["All", "VIP", "Forex", "Crypto"].map(f => <button key={f} onClick={() => setPlanF(f)} style={{ padding: "6px 16px", borderRadius: 6, background: planF === f ? "rgba(255,255,255,0.1)" : "transparent", color: planF === f ? "#fff" : C.td, border: "none", fontFamily: P, fontSize: 12.5, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", boxShadow: planF === f ? "0 2px 8px rgba(0,0,0,0.2)" : "none" }}>{f}</button>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AGhost icon={<RefreshCw size={14} />}>Refresh</AGhost>
        <AGhost icon={<Download size={14} />}>Export CSV</AGhost>
      </div>
    </ACard>

    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 24, alignItems: "start" }}>
      <ACard style={{ overflow: "hidden" }}>
        <div className="a-tscroll" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 1050 }}>
            <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderRadius: "18px 18px 0 0", borderBottom: `1px solid ${AD.cardB}` }}>
              {HEAD.map(h => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
            </div>
            {filtered.map((u, i) => <div key={u.id} onClick={() => setSelected(selected?.id === u.id ? null : u)} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "20px 28px", borderBottom: i < filtered.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center", cursor: "pointer", background: selected?.id === u.id ? "rgba(128,0,255,0.09)" : "transparent" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${pCol[u.plan] || C.brand}1C`, border: `1px solid ${pCol[u.plan] || C.brand}28`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: P, fontSize: 12, fontWeight: 700, color: pCol[u.plan] || C.brand }}>{u.init}</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <span style={{ fontFamily: P, fontSize: 15, fontWeight: 600, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                  <span style={{ fontFamily: P, fontSize: 12, color: C.td, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>
                </div>
              </div>
              <span style={{ fontFamily: M, fontSize: 13, fontWeight: 700, color: pCol[u.plan] || C.brand }}>{u.plan}</span>
              <div><Chip label={u.status} type={sType[u.status] || "muted"} /></div>
              <span style={{ fontFamily: M, fontSize: 13, color: u.trial ? C.buy : C.td }}>{u.trial ? "Active" : "—"}</span>
              <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{u.joined}</span>
              <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{u.renewal}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <IconBtn icon={<Pencil size={14} color={C.t2} />} title="Edit" onClick={(e) => {
                  e.stopPropagation();
                  setEf({ name: u.name, email: u.email, plan: u.plan, status: u.status });
                  setEditTarget(u);
                }} />
                <IconBtn icon={<Trash2 size={14} color={C.sell} />} title="Delete" onClick={(e) => { e.stopPropagation(); setDeleteTarget(u); }} />
              </div>
            </div>)}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
          <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {filtered.length} of {users.length} records</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.t2, fontFamily: P, fontSize: 13, fontWeight: 600 }}>2</button>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </ACard>

      {/* ─── User Details Panel ─── */}
      {selected && <ACard style={{ padding: "22px 22px", position: "sticky", top: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: P, fontSize: 13, fontWeight: 700, color: C.t1 }}>User Details</div>
          <button onClick={() => setSelected(null)} style={{ width: 26, height: 26, borderRadius: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={12} color={C.tm} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 17, background: `${pCol[selected.plan] || C.brand}1C`, border: `1px solid ${pCol[selected.plan] || C.brand}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: pCol[selected.plan] || C.brand }}>{selected.init}</span>
          </div>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{selected.name}</div>
          <div style={{ fontFamily: P, fontSize: 11, color: C.td, marginBottom: 8 }}>{selected.email}</div>
          <Chip label={`${selected.plan} Plan`} type={selected.plan === "VIP" ? "brand" : selected.plan === "Forex" ? "gold" : "info"} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 14 }}>
          {[{ l: "SIGNALS", v: selected.signals, c: C.brand }, { l: "POSTS", v: selected.posts, c: C.gold }, { l: "LIKES", v: selected.likes, c: "#C084FC" }, { l: "COMMENTS", v: selected.comments, c: C.buy }].map(s => <div key={s.l} style={{ background: AD.inp, borderRadius: 10, padding: "11px 13px" }}>
            <div style={{ fontFamily: M, fontSize: 7.5, color: C.td, letterSpacing: "0.1em", marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontFamily: M, fontSize: 17, fontWeight: 700, color: s.c }}>{s.v}</div>
          </div>)}
        </div>
        <div style={{ background: AD.inp, borderRadius: 11, padding: "12px 14px", marginBottom: 14 }}>
          {[{ l: "Joined", v: selected.joined }, { l: "Renewal", v: selected.renewal }].map(r => <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontFamily: P, fontSize: 11, color: C.tm }}>{r.l}</span>
            <span style={{ fontFamily: M, fontSize: 11, color: C.t2 }}>{r.v}</span>
          </div>)}
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: P, fontSize: 11, color: C.tm }}>Status</span><Chip label={selected.status} type={sType[selected.status] || "muted"} /></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <APrimary size="sm" icon={<Crown size={12} />} onClick={() => { setUpgradePlan(selected.plan); setUpgradeTarget(selected); }}>Upgrade Plan</APrimary>
          <AGhost size="sm" icon={<Calendar size={12} />} onClick={() => { setExtendDays("7"); setExtendTarget(selected); }}>Extend Trial</AGhost>
          <AGhost size="sm" icon={<CreditCard size={12} />} onClick={() => setResetTarget(selected)}>Reset Subscription</AGhost>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            <AGhost size="sm" danger icon={<Shield size={12} />} onClick={() => setSuspendTarget(selected)}>Suspend</AGhost>
            <AGhost size="sm" danger icon={<Trash2 size={12} />} onClick={() => setDeleteTarget(selected)}>Delete</AGhost>
          </div>
        </div>
      </ACard>}
    </div>

    {/* ─── Edit User Modal ─── */}
    {editTarget && <div className="a-modal-overlay" onClick={() => setEditTarget(null)}>
      <div className="a-modal" onClick={e => e.stopPropagation()} style={{ width: 500, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 32px", borderBottom: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1 }}>Edit User</div>
            <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>{editTarget.email}</div>
          </div>
          <button className="a-btn" onClick={() => setEditTarget(null)} style={{ background: "transparent", border: "none", color: C.td, cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 18 }}>
          <AIn label="Full Name" value={ef.name} onChange={v => setEf({ ...ef, name: v })} />
          <AIn label="Email Address" value={ef.email} onChange={v => setEf({ ...ef, email: v })} type="email" />
          <ASel label="Subscription Plan" value={ef.plan} onChange={v => setEf({ ...ef, plan: v })} opts={[{ l: "VIP Plan", v: "VIP" }, { l: "Forex Pro", v: "Forex" }, { l: "Crypto Pro", v: "Crypto" }]} />
          <ASel label="Account Status" value={ef.status} onChange={v => setEf({ ...ef, status: v })} opts={[{ l: "Active", v: "Active" }, { l: "Trial", v: "Trial" }, { l: "Suspended", v: "Suspended" }, { l: "Expired", v: "Expired" }]} />
        </div>
        <div style={{ padding: "24px 32px", borderTop: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "flex-end", gap: 12, background: AD.card, borderRadius: "0 0 20px 20px" }}>
          <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
          <APrimary loading={loading} onClick={() => doAction(() => {
            setUsers(users.map(u => u.id === editTarget.id ? { ...u, name: ef.name, email: ef.email, plan: ef.plan, status: ef.status, init: ef.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) } : u));
            setEditTarget(null);
            if (selected?.id === editTarget.id) setSelected({ ...selected, name: ef.name, email: ef.email, plan: ef.plan, status: ef.status });
            showToast("User updated successfully!");
          })}>Save Changes</APrimary>
        </div>
      </div>
    </div>}

    {/* ─── Upgrade Plan Modal ─── */}
    {upgradeTarget && <div className="a-modal-overlay" onClick={() => setUpgradeTarget(null)}>
      <div className="a-modal" onClick={e => e.stopPropagation()} style={{ width: 440, padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C.gold}18`, border: `1px solid ${C.gold}30`, display: "flex", alignItems: "center", justifyContent: "center" }}><Crown size={24} color={C.gold} /></div>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1 }}>Upgrade Plan</div>
            <div style={{ fontFamily: P, fontSize: 12, color: C.tm }}>{upgradeTarget.name} · Currently: {upgradeTarget.plan}</div>
          </div>
        </div>
        <ASel label="New Plan" value={upgradePlan} onChange={setUpgradePlan} opts={[{ l: "VIP Plan ($79/mo)", v: "VIP" }, { l: "Forex Pro ($49/mo)", v: "Forex" }, { l: "Crypto Pro ($39/mo)", v: "Crypto" }]} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <AGhost onClick={() => setUpgradeTarget(null)}>Cancel</AGhost>
          <APrimary loading={loading} onClick={() => doAction(() => {
            setUsers(users.map(u => u.id === upgradeTarget.id ? { ...u, plan: upgradePlan } : u));
            if (selected?.id === upgradeTarget.id) setSelected({ ...selected, plan: upgradePlan });
            setUpgradeTarget(null); showToast(`Plan upgraded to ${upgradePlan}!`);
          })}>Upgrade</APrimary>
        </div>
      </div>
    </div>}

    {/* ─── Extend Trial Modal ─── */}
    {extendTarget && <div className="a-modal-overlay" onClick={() => setExtendTarget(null)}>
      <div className="a-modal" onClick={e => e.stopPropagation()} style={{ width: 440, padding: "32px" }}>
        <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>Extend Trial</div>
        <div style={{ fontFamily: P, fontSize: 13, color: C.tm, marginBottom: 20 }}>Extend the trial period for <strong style={{ color: C.t1 }}>{extendTarget.name}</strong>.</div>
        <ASel label="Extend By" value={extendDays} onChange={setExtendDays} opts={[{ l: "1 Day", v: "1" }, { l: "3 Days", v: "3" }, { l: "7 Days", v: "7" }, { l: "14 Days", v: "14" }, { l: "30 Days", v: "30" }]} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <AGhost onClick={() => setExtendTarget(null)}>Cancel</AGhost>
          <APrimary loading={loading} onClick={() => doAction(() => {
            setExtendTarget(null); showToast(`Trial extended by ${extendDays} days!`);
          })}>Extend Trial</APrimary>
        </div>
      </div>
    </div>}

    {/* ─── Delete User ─── */}
    {deleteTarget && <ConfirmDeleteModal
      message={`Are you sure you want to delete <strong>${deleteTarget.name}</strong> (${deleteTarget.email})? This will permanently remove their account, subscription history, and all associated data. This action cannot be undone.`}
      loading={loading}
      onCancel={() => setDeleteTarget(null)}
      onConfirm={() => doAction(() => {
        setUsers(users.filter(u => u.id !== deleteTarget.id));
        if (selected?.id === deleteTarget.id) setSelected(null);
        setDeleteTarget(null); showToast("User deleted", "error");
      })}
    />}

    {/* ─── Suspend User ─── */}
    {suspendTarget && <ConfirmActionModal
      title={`Suspend ${suspendTarget.name}?`}
      message={`Suspending this user will immediately revoke their access to all signals, posts, and premium features. They will see a "Suspended" banner when they open the app. You can reactivate their account later.`}
      confirmLabel="Suspend User"
      icon={<Shield size={28} color="#F59E0B" />}
      iconColor="#F59E0B"
      iconBg="rgba(245,158,11,0.1)"
      loading={loading}
      onCancel={() => setSuspendTarget(null)}
      onConfirm={() => doAction(() => {
        setUsers(users.map(u => u.id === suspendTarget.id ? { ...u, status: "Suspended" } : u));
        if (selected?.id === suspendTarget.id) setSelected({ ...selected, status: "Suspended" });
        setSuspendTarget(null); showToast("User suspended", "warning");
      })}
    />}

    {/* ─── Reset Subscription ─── */}
    {resetTarget && <ConfirmActionModal
      title={`Reset Subscription?`}
      message={`This will reset the subscription for <strong>${resetTarget.name}</strong>. Their current billing cycle will end and they will need to re-subscribe. Any active coupon or discount will be removed.`}
      confirmLabel="Reset Subscription"
      icon={<CreditCard size={28} color="#60A5FA" />}
      iconColor="#60A5FA"
      iconBg="rgba(96,165,250,0.1)"
      loading={loading}
      onCancel={() => setResetTarget(null)}
      onConfirm={() => doAction(() => {
        setUsers(users.map(u => u.id === resetTarget.id ? { ...u, status: "Expired", renewal: "—" } : u));
        if (selected?.id === resetTarget.id) setSelected({ ...selected, status: "Expired", renewal: "—" });
        setResetTarget(null); showToast("Subscription reset");
      })}
    />}
  </div>;
}
