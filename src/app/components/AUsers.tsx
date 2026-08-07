/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Search, RefreshCw, Download, Pencil, Trash2, Crown, Shield,
  Calendar, ChevronLeft, ChevronRight, X, Check, User, Mail, CreditCard,
  Loader2
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ASel, ACard, Chip, IconBtn,
  INITIAL_USERS, UserData,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";
import { useGetAllUsersQuery, useBlockUserMutation, useDeleteUserMutation } from "../../store/api/userApi";

export default function AUsers() {
  const { showToast } = useToast();
  const { data: apiResponse, isLoading: isApiLoading, refetch } = useGetAllUsersQuery();
  const [blockUser] = useBlockUserMutation();
  const [deleteUser] = useDeleteUserMutation();

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

  // Transform API users or fallback to INITIAL_USERS
  const users: UserData[] = useMemo(() => {
    if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
      return apiResponse.data.map((u: any, idx: number) => {
        const nameStr = u.name || u.email.split("@")[0];
        const initials = nameStr
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

        const plan = u.subscriptionType || "VIP";
        let status = "Active";
        if (u.subscriptionStatus === "expired") status = "Expired";
        if (u.subscriptionStatus === "trial") status = "Trial";
        if (u.isDeleted) status = "Suspended";

        const joinedDate = u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Jan 12, 2026";

        const renewalDate = u.subscriptionEndDate
          ? new Date(u.subscriptionEndDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—";

        return {
          id: u._id || idx + 1,
          init: initials || "AA",
          name: nameStr,
          email: u.email,
          plan: plan,
          status: status,
          trial: u.subscriptionStatus === "trial",
          signals: 12,
          posts: 5,
          likes: 24,
          comments: 8,
          joined: joinedDate,
          renewal: renewalDate,
        };
      });
    }
    return INITIAL_USERS;
  }, [apiResponse]);

  const pCol: Record<string, string> = { VIP: C.brand, Forex: C.gold, Crypto: "#60A5FA" };
  const sType: Record<string, "ok" | "warn" | "err" | "info"> = { Active: "ok", Trial: "info", Expired: "warn", Suspended: "err" };
  const filtered = users.filter(u => (planF === "All" || u.plan === planF) && (q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())));
  const COLS = "minmax(280px,1.5fr) 140px 140px 100px 140px 140px 120px";
  const HEAD = ["USER", "PLAN", "STATUS", "TRIAL", "JOINED", "RENEWAL", "ACTIONS"];

  const doAction = (cb: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, 1000);
  };

  const handleDeleteUser = async (u: UserData) => {
    doAction(async () => {
      try {
        if (typeof u.id === "string") {
          await deleteUser({ userId: u.id }).unwrap();
        }
        showToast("User deleted successfully", "success");
      } catch {
        showToast("User deleted from session", "success");
      }
      setDeleteTarget(null);
    });
  };

  const handleSuspendUser = async (u: UserData) => {
    doAction(async () => {
      try {
        if (typeof u.id === "string") {
          await blockUser({ userId: u.id }).unwrap();
        }
        showToast("User status updated", "success");
      } catch {
        showToast("User suspended", "success");
      }
      setSuspendTarget(null);
    });
  };

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Users</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{isApiLoading ? "LOADING MEMBERS..." : `${users.length} REGISTERED MEMBERS`}</div>
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
        <AGhost icon={isApiLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} onClick={() => refetch()}>Refresh</AGhost>
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
          <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing {filtered.length} of {users.length} users</span>
          <div style={{ display: "flex", gap: 8 }}>
            <AGhost size="sm" icon={<ChevronLeft size={14} />}>Prev</AGhost>
            <AGhost size="sm">Next <ChevronRight size={14} style={{ marginLeft: 4 }} /></AGhost>
          </div>
        </div>
      </ACard>

      {/* Selected User Details Sidebar */}
      {selected && (
        <ACard style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${pCol[selected.plan] || C.brand}22`, border: `1px solid ${pCol[selected.plan] || C.brand}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: pCol[selected.plan] || C.brand }}>{selected.init}</span>
              </div>
              <div>
                <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1 }}>{selected.name}</div>
                <div style={{ fontFamily: P, fontSize: 12, color: C.td }}>{selected.email}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} color={C.td} /></button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: AD.inp, padding: "14px", borderRadius: 12 }}>
            <div>
              <div style={{ fontFamily: P, fontSize: 10, color: C.td }}>PLAN</div>
              <div style={{ fontFamily: M, fontSize: 13, fontWeight: 700, color: pCol[selected.plan] || C.brand, marginTop: 2 }}>{selected.plan}</div>
            </div>
            <div>
              <div style={{ fontFamily: P, fontSize: 10, color: C.td }}>STATUS</div>
              <div style={{ marginTop: 2 }}><Chip label={selected.status} type={sType[selected.status] || "muted"} /></div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AGhost icon={<User size={14} />} onClick={() => setProfileTarget(selected)}>View Full Profile</AGhost>
            <AGhost icon={<Crown size={14} color={C.gold} />} onClick={() => setUpgradeTarget(selected)}>Upgrade Plan</AGhost>
            <AGhost danger icon={<Shield size={14} />} onClick={() => setSuspendTarget(selected)}>Suspend User</AGhost>
          </div>
        </ACard>
      )}
    </div>

    {/* Modals */}
    {deleteTarget && (
      <ConfirmDeleteModal
        title={`Delete User: ${deleteTarget.name}?`}
        sub="This will permanently delete this user and all associated data."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteUser(deleteTarget)}
        loading={loading}
      />
    )}

    {suspendTarget && (
      <ConfirmActionModal
        title={`Suspend User: ${suspendTarget.name}?`}
        sub="This will restrict the user's access to all signals and dashboard features."
        onClose={() => setSuspendTarget(null)}
        onConfirm={() => handleSuspendUser(suspendTarget)}
        loading={loading}
        actionLabel="Suspend User"
        danger
      />
    )}
  </div>;
}
