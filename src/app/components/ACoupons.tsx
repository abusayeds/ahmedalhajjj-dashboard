/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Search, RefreshCw, Plus, Pencil, Trash2, Tag, ChevronLeft, ChevronRight,
  Copy, Check, ToggleLeft, ToggleRight, Loader2
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, AModal, ACard, Chip, IconBtn,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../store/api/couponApi";
import { getTodayDateInput, toDateInputValue } from "../utils/signalDate";

export default function ACoupons() {
  const { showToast } = useToast();

  // RTK Query Hooks (100% Dynamic MongoDB Data)
  const { data: apiResponse, isLoading: isApiLoading, isFetching, refetch } = useGetAllCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const [createModal, setCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [toggleTarget, setToggleTarget] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const [form, setForm] = useState({ code: "", discount: "", expiry: getTodayDateInput(), limit: "" });

  const resetForm = () => setForm({ code: "", discount: "", expiry: getTodayDateInput(), limit: "" });

  // Map 100% dynamic API coupons directly from database
  const coupons = useMemo(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      return apiResponse.data.map((c: any) => {
        const discStr = typeof c.discount === "number" ? `${c.discount}%` : String(c.discount || "10%");
        return {
          id: c._id || c.id,
          rawId: c._id,
          code: c.code,
          discount: discStr,
          rawDiscount: c.discount,
          expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString() : undefined,
          expiryInput: c.expiryDate ? toDateInputValue(c.expiryDate) : getTodayDateInput(),
          expiry: c.expiry || (c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "No Expiry"),
          limit: c.limit || 100,
          used: c.used || c.usedCount || 0,
          status: c.status || "Active",
        };
      });
    }
    return [];
  }, [apiResponse]);

  // Filter coupons by search query
  const filteredCoupons = useMemo(() => {
    if (!q.trim()) return coupons;
    return coupons.filter((c) => c.code.toLowerCase().includes(q.toLowerCase().trim()));
  }, [coupons, q]);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard!`, "info");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async () => {
    if (!form.code.trim()) {
      showToast("Coupon code is required!", "warning");
      return;
    }
    const discNum = Number(form.discount.replace("%", "")) || 10;
    try {
      await createCoupon({
        code: form.code.toUpperCase().trim(),
        discount: discNum,
        discountType: "percentage",
        limit: Number(form.limit) || 100,
        expiry: form.expiry,
        expiryDate: form.expiry ? new Date(form.expiry) : undefined,
        status: "Active",
      }).unwrap();
      showToast("Coupon created successfully in database!", "success");
      setCreateModal(false);
      resetForm();
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create coupon", "error");
    }
  };

  const handleUpdateCoupon = async () => {
    if (!editTarget) return;
    const targetId = editTarget.rawId || editTarget.id;
    const discNum = Number(form.discount.replace("%", "")) || Number(editTarget.rawDiscount) || 10;

    if (!targetId) {
      showToast("Invalid coupon ID", "error");
      return;
    }

    try {
      await updateCoupon({
        id: targetId,
        data: {
          code: form.code.toUpperCase().trim(),
          discount: discNum,
          limit: Number(form.limit) || editTarget.limit,
          expiry: form.expiry,
          expiryDate: form.expiry ? new Date(form.expiry) : undefined,
        },
      }).unwrap();
      showToast("Coupon updated successfully in database!", "success");
      setEditTarget(null);
      resetForm();
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update coupon", "error");
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    const newStatus = toggleTarget.status === "Active" ? "Inactive" : "Active";
    const targetId = toggleTarget.rawId || toggleTarget.id;

    if (!targetId) {
      setToggleTarget(null);
      return;
    }

    try {
      await updateCoupon({
        id: targetId,
        data: { status: newStatus },
      }).unwrap();
      showToast(`Coupon ${newStatus === "Active" ? "activated" : "deactivated"} successfully!`);
      setToggleTarget(null);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update coupon status", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.rawId || deleteTarget.id;

    if (!targetId) {
      setDeleteTarget(null);
      return;
    }

    try {
      await deleteCoupon(targetId).unwrap();
      showToast("Coupon deleted successfully from database!", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete coupon", "error");
    }
  };

  const COLS = "minmax(180px,1fr) 140px 160px 120px 180px 140px 160px";
  const HEAD = ["CODE", "DISCOUNT", "EXPIRY", "LIMIT", "USAGE", "STATUS", "ACTIONS"];

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            Coupons Management
          </h2>
          <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>
            {filteredCoupons.length} CODES · {filteredCoupons.filter((c) => c.status === "Active").length} ACTIVE (100% DYNAMIC MONGO DB)
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 300 }}>
            <Search size={14} color={C.td} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search coupon codes..."
              style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }}
            />
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
          <APrimary onClick={() => { resetForm(); setCreateModal(true); }} icon={<Plus size={14} />}>
            Create Coupon
          </APrimary>
        </div>
      </ACard>

      {/* Coupon Table */}
      <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.14em", marginBottom: 16 }}>
        DATABASE COUPON CODES
      </div>

      {isApiLoading ? (
        <div style={{ padding: 80, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
          Loading coupon codes from MongoDB database...
        </div>
      ) : (
        <ACard style={{ marginBottom: 32 }}>
          <div className="a-tscroll" style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 1000 }}>
              <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderRadius: "18px 18px 0 0", borderBottom: `1px solid ${AD.cardB}` }}>
                {HEAD.map((h) => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
              </div>

              {filteredCoupons.length === 0 ? (
                <div style={{ padding: "60px 20px", textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
                  No coupon codes found in database. Click <strong>"Create Coupon"</strong> to add your first discount code.
                </div>
              ) : (
                filteredCoupons.map((cp, i) => (
                  <div key={cp.id || cp.code} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "24px 28px", borderBottom: i < filteredCoupons.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
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
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontFamily: M, fontSize: 12, color: C.t2 }}>{cp.used} / {cp.limit}</span>
                        <span style={{ fontFamily: M, fontSize: 11, color: C.td }}>{Math.round((cp.used / cp.limit) * 100)}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 100, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ width: `${Math.min(100, (cp.used / cp.limit) * 100)}%`, height: "100%", borderRadius: 100, background: C.brand }} />
                      </div>
                    </div>
                    <div>
                      <Chip label={cp.status} type={cp.status === "Active" ? "ok" : cp.status === "Exhausted" ? "warn" : "muted"} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <IconBtn
                        icon={<Pencil size={14} color={C.t2} />}
                        title="Edit"
                        onClick={() => {
                          setForm({
                            code: cp.code,
                            discount: String(cp.discount).replace("%", ""),
                            expiry: cp.expiryInput || getTodayDateInput(),
                            limit: String(cp.limit),
                          });
                          setEditTarget(cp);
                        }}
                      />
                      <IconBtn
                        icon={cp.status === "Active" ? <ToggleRight size={14} color={C.buy} /> : <ToggleLeft size={14} color={C.td} />}
                        title={cp.status === "Active" ? "Deactivate" : "Activate"}
                        onClick={() => setToggleTarget(cp)}
                        bg={cp.status === "Active" ? "rgba(0,208,132,0.08)" : undefined}
                      />
                      <IconBtn icon={<Trash2 size={14} color={C.sell} />} title="Delete" onClick={() => setDeleteTarget(cp)} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
            <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {filteredCoupons.length} of {filteredCoupons.length} records</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
              <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
              <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
            </div>
          </div>
        </ACard>
      )}

      {/* Create Coupon Modal */}
      {createModal && (
        <AModal title="Create Coupon Code" sub="Define the discount code, percentage amount, and usage limit" onClose={() => setCreateModal(false)} width={460}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <AIn label="Coupon Code" placeholder="e.g. SUMMER50" value={form.code} onChange={(v) => setForm({ ...form, code: v.toUpperCase() })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <AIn label="Discount %" placeholder="e.g. 30" value={form.discount} onChange={(v) => setForm({ ...form, discount: v })} type="number" />
              <AIn label="Usage Limit" placeholder="e.g. 100" value={form.limit} onChange={(v) => setForm({ ...form, limit: v })} type="number" />
            </div>
            <AIn label="Expiry Date" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} type="date" />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <AGhost onClick={() => setCreateModal(false)}>Cancel</AGhost>
              <APrimary icon={isCreating ? <Loader2 size={13} className="animate-spin" /> : <Tag size={13} />} disabled={isCreating} onClick={handleCreateCoupon}>
                {isCreating ? "Creating..." : "Create Coupon"}
              </APrimary>
            </div>
          </div>
        </AModal>
      )}

      {/* Edit Coupon Modal */}
      {editTarget && (
        <AModal title="Edit Coupon Code" sub={`Editing coupon: ${editTarget.code}`} onClose={() => setEditTarget(null)} width={460}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <AIn label="Coupon Code" placeholder="e.g. SUMMER50" value={form.code} onChange={(v) => setForm({ ...form, code: v.toUpperCase() })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <AIn label="Discount %" placeholder="e.g. 30" value={form.discount} onChange={(v) => setForm({ ...form, discount: v })} type="number" />
              <AIn label="Usage Limit" placeholder="e.g. 100" value={form.limit} onChange={(v) => setForm({ ...form, limit: v })} type="number" />
            </div>
            <AIn label="Expiry Date" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} type="date" />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
              <APrimary disabled={isUpdating} onClick={handleUpdateCoupon} icon={isUpdating ? <Loader2 size={13} className="animate-spin" /> : null}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </APrimary>
            </div>
          </div>
        </AModal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDeleteModal
          message={`Are you sure you want to delete coupon <strong>${deleteTarget.code}</strong>? This code has been used <strong>${deleteTarget.used} times</strong>. Deleting it will prevent any further redemptions. This action cannot be undone.`}
          loading={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Activate / Deactivate Confirmation */}
      {toggleTarget && (
        <ConfirmActionModal
          title={`${toggleTarget.status === "Active" ? "Deactivate" : "Activate"} ${toggleTarget.code}?`}
          message={toggleTarget.status === "Active"
            ? `Deactivating this coupon will prevent new users from redeeming it. Existing redemptions are not affected.`
            : `Activating this coupon will allow users to redeem it again.`}
          confirmLabel={toggleTarget.status === "Active" ? "Deactivate" : "Activate"}
          icon={toggleTarget.status === "Active" ? <ToggleLeft size={28} color="#F59E0B" /> : <ToggleRight size={28} color={C.buy} />}
          iconColor={toggleTarget.status === "Active" ? "#F59E0B" : C.buy}
          iconBg={toggleTarget.status === "Active" ? "rgba(245,158,11,0.1)" : "rgba(0,208,132,0.1)"}
          loading={isUpdating}
          onCancel={() => setToggleTarget(null)}
          onConfirm={handleConfirmToggle}
        />
      )}
    </div>
  );
}
