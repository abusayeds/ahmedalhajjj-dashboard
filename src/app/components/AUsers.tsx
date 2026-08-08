/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import {
  Search, RefreshCw, Download, Pencil, Trash2, Crown, Shield,
  Calendar, ChevronLeft, ChevronRight, X, Check, User, Mail, CreditCard,
  Loader2
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ASel, ACard, Chip, IconBtn, AModal,
  UserData,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";
import {
  useGetAllUsersQuery,
  useBlockUserMutation,
  useDeleteUserMutation,
  useAdminUpdateUserMutation,
  useUpgradeUserSubscriptionMutation,
  useExtendUserSubscriptionMutation,
} from "../../store/api/userApi";

const mapApiUser = (u: any, idx: number): UserData => {
  const nameStr =
    u.name ||
    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
    u.email?.split("@")[0] ||
    "User";
  const initials = nameStr
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const plan = u.subscriptionType || "—";
  let status = "Active";
  if (u.status === "blocked") status = "Suspended";
  else if (u.subscriptionStatus === "expired") status = "Expired";
  else if (u.subscriptionStatus === "trial") status = "Trial";
  else if (u.subscriptionStatus === "cancelled") status = "Expired";
  else if (u.subscriptionStatus === "none") status = "Expired";

  const joinedDate = u.createdAt
    ? new Date(u.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

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
    plan,
    status,
    trial: u.subscriptionStatus === "trial",
    signals: 0,
    posts: 0,
    likes: 0,
    comments: 0,
    joined: joinedDate,
    renewal: renewalDate,
  };
};

export default function AUsers() {
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [planF, setPlanF] = useState("All");

  const { data: apiResponse, isLoading: isApiLoading, isFetching, refetch } = useGetAllUsersQuery({
    page,
    limit: 10,
    searchTerm,
    subscriptionType: planF,
  });

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [adminUpdateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();
  const [upgradeUserSubscription, { isLoading: isUpgrading }] = useUpgradeUserSubscriptionMutation();
  const [extendUserSubscription, { isLoading: isExtending }] = useExtendUserSubscriptionMutation();

  const [selected, setSelected] = useState<UserData | null>(null);
  const [editTarget, setEditTarget] = useState<UserData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<UserData | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<UserData | null>(null);
  const [extendTarget, setExtendTarget] = useState<UserData | null>(null);
  const [profileTarget, setProfileTarget] = useState<UserData | null>(null);

  const [ef, setEf] = useState({ name: "", email: "", plan: "VIP", status: "Active" });
  const [upgradePlan, setUpgradePlan] = useState<"VIP" | "Forex" | "Crypto">("VIP");
  const [extendDays, setExtendDays] = useState("7");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(q);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [planF]);

  const users: UserData[] = useMemo(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      return apiResponse.data.map(mapApiUser);
    }
    return [];
  }, [apiResponse]);

  const pagination = apiResponse?.pagination;
  const totalUsers = pagination?.totalData ?? users.length;

  const pCol: Record<string, string> = { VIP: C.brand, Forex: C.gold, Crypto: "#60A5FA" };
  const sType: Record<string, "ok" | "warn" | "err" | "info"> = {
    Active: "ok",
    Trial: "info",
    Expired: "warn",
    Suspended: "err",
  };
  const COLS = "minmax(280px,1.5fr) 140px 140px 100px 140px 140px 120px";
  const HEAD = ["USER", "PLAN", "STATUS", "TRIAL", "JOINED", "RENEWAL", "ACTIONS"];

  const getUserId = (u: UserData) => String(u.id);

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser({ userId: getUserId(deleteTarget) }).unwrap();
      showToast("User deleted successfully", "success");
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) setSelected(null);
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete user", "error");
    }
  };

  const handleSuspendUser = async () => {
    if (!suspendTarget) return;
    try {
      await blockUser({ userId: getUserId(suspendTarget) }).unwrap();
      showToast("User status updated", "success");
      setSuspendTarget(null);
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update user status", "error");
    }
  };

  const handleEditUser = async () => {
    if (!editTarget) return;
    try {
      await adminUpdateUser({
        userId: getUserId(editTarget),
        name: ef.name,
        email: ef.email,
        subscriptionType: ef.plan === "—" ? undefined : ef.plan,
        subscriptionStatus:
          ef.status === "Trial"
            ? "trial"
            : ef.status === "Expired"
              ? "expired"
              : ef.status === "Suspended"
                ? undefined
                : "active",
        status: ef.status === "Suspended" ? "blocked" : "active",
      }).unwrap();
      showToast("User updated successfully", "success");
      setEditTarget(null);
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update user", "error");
    }
  };

  const handleUpgradeUser = async () => {
    if (!upgradeTarget) return;
    try {
      await upgradeUserSubscription({
        userId: getUserId(upgradeTarget),
        subscriptionType: upgradePlan,
      }).unwrap();
      showToast("User plan upgraded successfully", "success");
      setUpgradeTarget(null);
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to upgrade user plan", "error");
    }
  };

  const handleExtendUser = async () => {
    if (!extendTarget) return;
    try {
      await extendUserSubscription({
        userId: getUserId(extendTarget),
        days: Number(extendDays),
      }).unwrap();
      showToast(`Subscription extended by ${extendDays} days`, "success");
      setExtendTarget(null);
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to extend subscription", "error");
    }
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Users</h2>
          <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>
            {isApiLoading ? "LOADING MEMBERS..." : `${totalUsers} REGISTERED MEMBERS`}
          </div>
        </div>
      </div>

      <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 300 }}>
            <Search size={14} color={C.td} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email…"
              style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }}
            />
          </div>
          <div style={{ width: 1, height: 24, background: AD.cardB }} />
          <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.02)", padding: 6, borderRadius: 10, border: `1px solid rgba(255,255,255,0.04)` }}>
            {["All", "VIP", "Forex", "Crypto"].map((f) => (
              <button
                key={f}
                onClick={() => setPlanF(f)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 6,
                  background: planF === f ? "rgba(255,255,255,0.1)" : "transparent",
                  color: planF === f ? "#fff" : C.td,
                  border: "none",
                  fontFamily: P,
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: planF === f ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <AGhost icon={isFetching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} onClick={() => refetch()}>
            Refresh
          </AGhost>
          <AGhost icon={<Download size={14} />}>Export CSV</AGhost>
        </div>
      </ACard>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 24, alignItems: "start" }}>
        <ACard style={{ overflow: "hidden" }}>
          {isApiLoading ? (
            <div style={{ padding: 80, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
              <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
              Loading users from server...
            </div>
          ) : (
            <>
              <div className="a-tscroll" style={{ overflowX: "auto" }}>
                <div style={{ minWidth: 1050 }}>
                  <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderRadius: "18px 18px 0 0", borderBottom: `1px solid ${AD.cardB}` }}>
                    {HEAD.map((h) => (
                      <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>
                    ))}
                  </div>
                  {users.length === 0 ? (
                    <div style={{ padding: "60px 28px", textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
                      No users found in database.
                    </div>
                  ) : (
                    users.map((u, i) => (
                      <div
                        key={u.id}
                        onClick={() => setSelected(selected?.id === u.id ? null : u)}
                        className="a-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: COLS,
                          padding: "20px 28px",
                          borderBottom: i < users.length - 1 ? `1px solid ${AD.cardB}` : "none",
                          alignItems: "center",
                          cursor: "pointer",
                          background: selected?.id === u.id ? "rgba(128,0,255,0.09)" : "transparent",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${pCol[u.plan] || C.brand}1C`, border: `1px solid ${pCol[u.plan] || C.brand}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: P, fontSize: 12, fontWeight: 700, color: pCol[u.plan] || C.brand }}>{u.init}</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                            <span style={{ fontFamily: P, fontSize: 15, fontWeight: 600, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                            <span style={{ fontFamily: P, fontSize: 12, color: C.td, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>
                          </div>
                        </div>
                        <span style={{ fontFamily: M, fontSize: 13, fontWeight: 700, color: pCol[u.plan] || C.t2 }}>{u.plan}</span>
                        <div><Chip label={u.status} type={sType[u.status] || "muted"} /></div>
                        <span style={{ fontFamily: M, fontSize: 13, color: u.trial ? C.buy : C.td }}>{u.trial ? "Active" : "—"}</span>
                        <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{u.joined}</span>
                        <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{u.renewal}</span>
                        <div style={{ display: "flex", gap: 8 }}>
                          <IconBtn
                            icon={<Pencil size={14} color={C.t2} />}
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEf({ name: u.name, email: u.email, plan: u.plan === "—" ? "VIP" : u.plan, status: u.status });
                              setEditTarget(u);
                            }}
                          />
                          <IconBtn icon={<Trash2 size={14} color={C.sell} />} title="Delete" onClick={(e) => { e.stopPropagation(); setDeleteTarget(u); }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
                <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>
                  Showing {users.length} of {totalUsers} users
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <AGhost
                    size="sm"
                    icon={<ChevronLeft size={14} />}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </AGhost>
                  <AGhost
                    size="sm"
                    onClick={() => {
                      if (pagination && page < pagination.totalPage) setPage((p) => p + 1);
                    }}
                  >
                    Next <ChevronRight size={14} style={{ marginLeft: 4 }} />
                  </AGhost>
                </div>
              </div>
            </>
          )}
        </ACard>

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
              <AGhost icon={<Crown size={14} color={C.gold} />} onClick={() => { setUpgradePlan((selected.plan as "VIP" | "Forex" | "Crypto") || "VIP"); setUpgradeTarget(selected); }}>Upgrade Plan</AGhost>
              <AGhost icon={<Calendar size={14} />} onClick={() => setExtendTarget(selected)}>Extend Subscription</AGhost>
              <AGhost danger icon={<Shield size={14} />} onClick={() => setSuspendTarget(selected)}>Suspend User</AGhost>
            </div>
          </ACard>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          title={`Delete User: ${deleteTarget.name}?`}
          message="This will permanently delete this user and all associated data."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteUser}
          loading={isDeleting}
        />
      )}

      {suspendTarget && (
        <ConfirmActionModal
          title={`Suspend User: ${suspendTarget.name}?`}
          message="This will restrict the user's access to all signals and dashboard features."
          confirmLabel="Suspend User"
          onCancel={() => setSuspendTarget(null)}
          onConfirm={handleSuspendUser}
          loading={isBlocking}
        />
      )}

      {editTarget && (
        <AModal title="Edit User" sub={`Update details for ${editTarget.name}`} onClose={() => setEditTarget(null)} width={460}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <AIn label="Full Name" value={ef.name} onChange={(v) => setEf({ ...ef, name: v })} />
            <AIn label="Email" value={ef.email} onChange={(v) => setEf({ ...ef, email: v })} type="email" />
            <ASel label="Plan" value={ef.plan} onChange={(v) => setEf({ ...ef, plan: v })} opts={[
              { l: "VIP", v: "VIP" },
              { l: "Forex", v: "Forex" },
              { l: "Crypto", v: "Crypto" },
            ]} />
            <ASel label="Status" value={ef.status} onChange={(v) => setEf({ ...ef, status: v })} opts={[
              { l: "Active", v: "Active" },
              { l: "Trial", v: "Trial" },
              { l: "Expired", v: "Expired" },
              { l: "Suspended", v: "Suspended" },
            ]} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
              <APrimary disabled={isUpdating} onClick={handleEditUser} icon={isUpdating ? <Loader2 size={13} className="animate-spin" /> : null}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </APrimary>
            </div>
          </div>
        </AModal>
      )}

      {upgradeTarget && (
        <AModal title="Upgrade Plan" sub={`Upgrade subscription for ${upgradeTarget.name}`} onClose={() => setUpgradeTarget(null)} width={420}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ASel label="New Plan" value={upgradePlan} onChange={(v) => setUpgradePlan(v as "VIP" | "Forex" | "Crypto")} opts={[
              { l: "VIP", v: "VIP" },
              { l: "Forex", v: "Forex" },
              { l: "Crypto", v: "Crypto" },
            ]} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <AGhost onClick={() => setUpgradeTarget(null)}>Cancel</AGhost>
              <APrimary disabled={isUpgrading} onClick={handleUpgradeUser} icon={isUpgrading ? <Loader2 size={13} className="animate-spin" /> : <Crown size={13} />}>
                {isUpgrading ? "Upgrading..." : "Upgrade Plan"}
              </APrimary>
            </div>
          </div>
        </AModal>
      )}

      {extendTarget && (
        <AModal title="Extend Subscription" sub={`Extend access for ${extendTarget.name}`} onClose={() => setExtendTarget(null)} width={420}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ASel label="Extension Period" value={extendDays} onChange={setExtendDays} opts={[
              { l: "7 Days", v: "7" },
              { l: "14 Days", v: "14" },
              { l: "30 Days", v: "30" },
              { l: "90 Days", v: "90" },
            ]} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <AGhost onClick={() => setExtendTarget(null)}>Cancel</AGhost>
              <APrimary disabled={isExtending} onClick={handleExtendUser} icon={isExtending ? <Loader2 size={13} className="animate-spin" /> : <Calendar size={13} />}>
                {isExtending ? "Extending..." : "Extend Subscription"}
              </APrimary>
            </div>
          </div>
        </AModal>
      )}

      {profileTarget && (
        <AModal title="User Profile" sub={profileTarget.email} onClose={() => setProfileTarget(null)} width={480}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: AD.inp, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.1em" }}>NAME</div>
                <div style={{ fontFamily: P, fontSize: 14, color: C.t1, marginTop: 4 }}>{profileTarget.name}</div>
              </div>
              <div style={{ background: AD.inp, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.1em" }}>EMAIL</div>
                <div style={{ fontFamily: P, fontSize: 14, color: C.t1, marginTop: 4 }}>{profileTarget.email}</div>
              </div>
              <div style={{ background: AD.inp, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.1em" }}>PLAN</div>
                <div style={{ fontFamily: P, fontSize: 14, color: pCol[profileTarget.plan] || C.t1, marginTop: 4 }}>{profileTarget.plan}</div>
              </div>
              <div style={{ background: AD.inp, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.1em" }}>STATUS</div>
                <div style={{ marginTop: 4 }}><Chip label={profileTarget.status} type={sType[profileTarget.status] || "muted"} /></div>
              </div>
              <div style={{ background: AD.inp, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.1em" }}>JOINED</div>
                <div style={{ fontFamily: P, fontSize: 14, color: C.t1, marginTop: 4 }}>{profileTarget.joined}</div>
              </div>
              <div style={{ background: AD.inp, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.1em" }}>RENEWAL</div>
                <div style={{ fontFamily: P, fontSize: 14, color: C.t1, marginTop: 4 }}>{profileTarget.renewal}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <AGhost onClick={() => setProfileTarget(null)}>Close</AGhost>
            </div>
          </div>
        </AModal>
      )}
    </div>
  );
}
