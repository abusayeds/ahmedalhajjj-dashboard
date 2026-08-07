import { useState } from "react";
import {
  Zap, Plus, Pencil, Trash2, Search, RefreshCw, Download,
  FileText, Check, ChevronLeft, ChevronRight, Copy, Archive, Send,
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ATa, ASel, AModal, ACard, Chip, IconBtn,
  INITIAL_SIGNALS, SignalData,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";

export default function ASignals() {
  const { showToast } = useToast();
  const [signals, setSignals] = useState<SignalData[]>(INITIAL_SIGNALS);
  const [filter, setFilter] = useState("All");
  const [pubModal, setPubModal] = useState(false);
  const [editTarget, setEditTarget] = useState<SignalData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SignalData | null>(null);
  const [closeTarget, setCloseTarget] = useState<SignalData | null>(null);
  const [dupTarget, setDupTarget] = useState<SignalData | null>(null);
  const [publishTarget, setPublishTarget] = useState<SignalData | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<SignalData | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ asset: "", cat: "Forex", type: "Swing", dir: "BUY", entry: "", sl: "", tp1: "", tp2: "", tp3: "", notes: "", status: "Active", schedule: "" });
  const [closeRes, setCloseRes] = useState("Win");
  const [closePnl, setClosePnl] = useState("");

  const tabs = ["All", "Active", "Draft", "Scheduled", "Closed"];
  const filtered = signals.filter(s => filter === "All" || s.status === filter);
  const dCol = (d: string) => d === "BUY" ? C.buy : C.sell;
  const sChip = (s: string) => {
    const m: Record<string, "ok" | "brand" | "info" | "muted" | "err" | "draft"> = { Active: "ok", Draft: "draft", Scheduled: "info", Closed: "err" };
    return <Chip label={s} type={m[s] || "muted"} />;
  };

  const resetForm = () => setForm({ asset: "", cat: "Forex", type: "Swing", dir: "BUY", entry: "", sl: "", tp1: "", tp2: "", tp3: "", notes: "", status: "Active", schedule: "" });

  const openEdit = (s: SignalData) => {
    setForm({ asset: s.asset, cat: s.cat, type: s.type, dir: s.dir, entry: s.entry, sl: s.sl, tp1: s.tp1, tp2: s.tp2, tp3: s.tp3, notes: "", status: s.status, schedule: "" });
    setEditTarget(s);
  };

  const openDuplicate = (s: SignalData) => {
    setForm({ asset: s.asset, cat: s.cat, type: s.type, dir: s.dir, entry: s.entry, sl: s.sl, tp1: s.tp1, tp2: s.tp2, tp3: s.tp3, notes: "", status: "Draft", schedule: "" });
    setDupTarget(s);
  };

  const doAction = (cb: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, 1000);
  };

  const COLS = "minmax(180px,1.5fr) 100px 90px 110px 110px 110px 110px 110px 140px 130px 160px";
  const HEAD = ["ASSET", "TYPE", "DIR", "ENTRY", "SL", "TP1", "TP2", "TP3", "STATUS", "PUBLISHED", "ACTIONS"];

  const SignalFormFields = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
        <AIn label="Asset / Pair" placeholder="e.g. BTC/USDT" value={form.asset} onChange={v => setForm({ ...form, asset: v })} />
        <ASel label="Category" value={form.cat} onChange={v => setForm({ ...form, cat: v })} opts={[{ l: "Forex", v: "Forex" }, { l: "Cryptocurrency", v: "Crypto" }, { l: "Commodity", v: "Commodity" }, { l: "Index", v: "Index" }]} />
        <ASel label="Signal Type" value={form.type} onChange={v => setForm({ ...form, type: v })} opts={[{ l: "Swing Trade", v: "Swing" }, { l: "Intraday", v: "Intraday" }, { l: "Scalp", v: "Scalp" }, { l: "Position", v: "Position" }]} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
        <ASel label="Direction" value={form.dir} onChange={v => setForm({ ...form, dir: v })} opts={[{ l: "BUY (Long) ↑", v: "BUY" }, { l: "SELL (Short) ↓", v: "SELL" }]} />
        <AIn label="Entry Price" placeholder="e.g. 67,420.00" value={form.entry} onChange={v => setForm({ ...form, entry: v })} />
        <AIn label="Stop Loss" placeholder="e.g. 65,800.00" value={form.sl} onChange={v => setForm({ ...form, sl: v })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
        <AIn label="Take Profit 1" placeholder="e.g. 69,000.00" value={form.tp1} onChange={v => setForm({ ...form, tp1: v })} />
        <AIn label="Take Profit 2 (optional)" placeholder="e.g. 71,500.00" value={form.tp2} onChange={v => setForm({ ...form, tp2: v })} />
        <AIn label="Take Profit 3 (optional)" placeholder="e.g. 74,000.00" value={form.tp3} onChange={v => setForm({ ...form, tp3: v })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        <ASel label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} opts={[{ l: "Active (Publish Now)", v: "Active" }, { l: "Draft", v: "Draft" }, { l: "Scheduled", v: "Scheduled" }]} />
        <AIn label="Schedule Time" placeholder="e.g. Jul 24, 09:00" value={form.schedule} onChange={v => setForm({ ...form, schedule: v })} />
      </div>
      <ATa label="Analysis Notes (optional)" placeholder="Briefly describe the setup, key levels, and confluence…" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
    </div>
  );

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Signals</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{signals.length} TOTAL · {signals.filter(s => s.status === "Active").length} ACTIVE</div>
      </div>
    </div>

    <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 260 }}>
          <Search size={14} color={C.td} />
          <input placeholder="Search signals..." style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }} />
        </div>
        <div style={{ width: 1, height: 24, background: AD.cardB }} />
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.02)", padding: 6, borderRadius: 10, border: `1px solid rgba(255,255,255,0.04)` }}>
          {tabs.map(t => <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 16px", borderRadius: 6, background: filter === t ? "rgba(255,255,255,0.1)" : "transparent", color: filter === t ? "#fff" : C.td, border: "none", fontFamily: P, fontSize: 12.5, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", boxShadow: filter === t ? "0 2px 8px rgba(0,0,0,0.2)" : "none" }}>{t}</button>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AGhost icon={<RefreshCw size={14} />}>Refresh</AGhost>
        <AGhost icon={<Download size={14} />}>Export</AGhost>
        <APrimary onClick={() => { resetForm(); setPubModal(true); }} icon={<Plus size={14} />}>Publish Signal</APrimary>
      </div>
    </ACard>

    <ACard>
      <div className="a-tscroll" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1200 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderBottom: `1px solid ${AD.cardB}`, borderRadius: "18px 18px 0 0" }}>
            {HEAD.map(h => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
          </div>
          {filtered.map((s, i) => <div key={s.id} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "24px 28px", borderBottom: i < filtered.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: C.t1 }}>{s.asset}</span>
              <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>{s.cat}</span>
            </div>
            <span style={{ fontFamily: P, fontSize: 13, color: C.t2 }}>{s.type}</span>
            <span style={{ fontFamily: M, fontSize: 13, fontWeight: 700, color: dCol(s.dir) }}>{s.dir}</span>
            <span style={{ fontFamily: M, fontSize: 14, color: C.t1 }}>{s.entry}</span>
            <span style={{ fontFamily: M, fontSize: 14, color: C.sell }}>{s.sl}</span>
            <span style={{ fontFamily: M, fontSize: 14, color: C.buy }}>{s.tp1}</span>
            <span style={{ fontFamily: M, fontSize: 14, color: s.tp2 === "—" ? C.td : C.buy }}>{s.tp2}</span>
            <span style={{ fontFamily: M, fontSize: 14, color: s.tp3 === "—" ? C.td : C.buy }}>{s.tp3}</span>
            <div>{sChip(s.status)}</div>
            <span style={{ fontFamily: M, fontSize: 11, color: C.td }}>{s.pub}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <IconBtn icon={<Pencil size={14} color={C.t2} />} title="Edit" onClick={() => openEdit(s)} />
              <IconBtn icon={<Copy size={14} color={C.t2} />} title="Duplicate" onClick={() => openDuplicate(s)} />
              {s.status === "Active" && <IconBtn icon={<span style={{ fontSize: 14 }}>🔒</span>} title="Close" onClick={() => setCloseTarget(s)} bg="rgba(191,160,109,0.08)" />}
              {(s.status === "Draft" || s.status === "Scheduled") && <IconBtn icon={<Send size={14} color={C.buy} />} title="Publish" onClick={() => setPublishTarget(s)} bg="rgba(0,208,132,0.08)" />}
              {s.status === "Closed" && <IconBtn icon={<Archive size={14} color={C.tm} />} title="Archive" onClick={() => setArchiveTarget(s)} />}
              <IconBtn icon={<Trash2 size={14} color={C.sell} />} title="Delete" onClick={() => setDeleteTarget(s)} />
            </div>
          </div>)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
        <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {filtered.length} of {signals.length} records</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.t2, fontFamily: P, fontSize: 13, fontWeight: 600 }}>2</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </ACard>

    {/* ─── Create Signal Modal ─── */}
    {pubModal && <AModal title="Publish New Signal" sub="Fill in the details below and publish or save as draft" onClose={() => setPubModal(false)} width={700}>
      <SignalFormFields />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setPubModal(false)}>Cancel</AGhost>
        <AGhost icon={<FileText size={13} />} onClick={() => { setPubModal(false); showToast("Signal saved as draft"); }}>Save Draft</AGhost>
        <APrimary icon={<Zap size={13} />} loading={loading} onClick={() => doAction(() => {
          const newId = Math.max(...signals.map(s => s.id)) + 1;
          setSignals([{ id: newId, asset: form.asset || "NEW/PAIR", cat: form.cat, type: form.type, dir: form.dir as "BUY"|"SELL", entry: form.entry || "0.00", sl: form.sl || "0.00", tp1: form.tp1 || "0.00", tp2: form.tp2 || "—", tp3: form.tp3 || "—", status: form.status, pub: form.status === "Active" ? "Jul 24 · 09:00" : "—" }, ...signals]);
          setPubModal(false); resetForm(); showToast("Signal published successfully!");
        })}>Publish Signal</APrimary>
      </div>
    </AModal>}

    {/* ─── Edit Signal Modal ─── */}
    {editTarget && <AModal title={`Edit Signal — ${editTarget.asset}`} sub="Update signal parameters" onClose={() => setEditTarget(null)} width={700}>
      <SignalFormFields />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
        <APrimary icon={<Check size={13} />} loading={loading} onClick={() => doAction(() => {
          setSignals(signals.map(s => s.id === editTarget.id ? { ...s, asset: form.asset, cat: form.cat, type: form.type, dir: form.dir as "BUY"|"SELL", entry: form.entry, sl: form.sl, tp1: form.tp1, tp2: form.tp2 || "—", tp3: form.tp3 || "—", status: form.status } : s));
          setEditTarget(null); showToast("Signal updated successfully!");
        })}>Save Changes</APrimary>
      </div>
    </AModal>}

    {/* ─── Duplicate Signal Modal ─── */}
    {dupTarget && <AModal title={`Duplicate Signal — ${dupTarget.asset}`} sub="Create a copy of this signal with modifications" onClose={() => setDupTarget(null)} width={700}>
      <SignalFormFields />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setDupTarget(null)}>Cancel</AGhost>
        <APrimary icon={<Copy size={13} />} loading={loading} onClick={() => doAction(() => {
          const newId = Math.max(...signals.map(s => s.id)) + 1;
          setSignals([{ id: newId, asset: form.asset, cat: form.cat, type: form.type, dir: form.dir as "BUY"|"SELL", entry: form.entry, sl: form.sl, tp1: form.tp1, tp2: form.tp2 || "—", tp3: form.tp3 || "—", status: "Draft", pub: "—" }, ...signals]);
          setDupTarget(null); resetForm(); showToast("Signal duplicated as draft!");
        })}>Duplicate Signal</APrimary>
      </div>
    </AModal>}

    {/* ─── Close Signal Modal ─── */}
    {closeTarget && <AModal title={`Close Signal — ${closeTarget.asset}`} sub="Set the outcome before closing this signal" onClose={() => setCloseTarget(null)} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: `${C.brand}0A`, border: `1px solid ${C.brand}20`, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontFamily: M, fontSize: 13, fontWeight: 700, color: C.t1 }}>{closeTarget.asset}</div>
          <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>Entry: {closeTarget.entry} · SL: {closeTarget.sl}</div>
        </div>
        <ASel label="Final Result" value={closeRes} onChange={setCloseRes} opts={[{ l: "✓ Win", v: "Win" }, { l: "✗ Loss", v: "Loss" }, { l: "— Breakeven", v: "Breakeven" }]} />
        <AIn label="Profit / Loss %" placeholder="e.g. +3.25 or -1.80" value={closePnl} onChange={setClosePnl} />
        <div style={{ background: "rgba(0,208,132,0.06)", border: "1px solid rgba(0,208,132,0.18)", borderRadius: 11, padding: "11px 14px" }}>
          <div style={{ fontFamily: P, fontSize: 11, color: C.t2, lineHeight: 1.55 }}>Closing this signal will push it to the mobile app History tab with the final result and P&L displayed to subscribers.</div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setCloseTarget(null)}>Cancel</AGhost>
          <APrimary icon={<Check size={13} />} loading={loading} onClick={() => doAction(() => {
            setSignals(signals.map(s => s.id === closeTarget.id ? { ...s, status: "Closed" } : s));
            setCloseTarget(null); showToast(`Signal closed — ${closeRes}`);
          })}>Confirm & Close</APrimary>
        </div>
      </div>
    </AModal>}

    {/* ─── Delete Confirmation ─── */}
    {deleteTarget && <ConfirmDeleteModal
      message={`Are you sure you want to delete the <strong>${deleteTarget.asset}</strong> signal? This action cannot be undone and will remove this signal from all subscriber feeds.`}
      loading={loading}
      onCancel={() => setDeleteTarget(null)}
      onConfirm={() => doAction(() => {
        setSignals(signals.filter(s => s.id !== deleteTarget.id));
        setDeleteTarget(null); showToast("Signal deleted", "error");
      })}
    />}

    {/* ─── Publish Confirmation ─── */}
    {publishTarget && <ConfirmActionModal
      title={`Publish ${publishTarget.asset}?`}
      message={`This will immediately publish the <strong>${publishTarget.asset} ${publishTarget.dir}</strong> signal and notify all ${publishTarget.cat} subscribers via push notification.`}
      confirmLabel="Publish Now"
      icon={<Send size={28} color={C.buy} />}
      iconColor={C.buy}
      iconBg="rgba(0,208,132,0.1)"
      loading={loading}
      onCancel={() => setPublishTarget(null)}
      onConfirm={() => doAction(() => {
        setSignals(signals.map(s => s.id === publishTarget.id ? { ...s, status: "Active", pub: "Jul 24 · Now" } : s));
        setPublishTarget(null); showToast("Signal published!");
      })}
    />}

    {/* ─── Archive Confirmation ─── */}
    {archiveTarget && <ConfirmActionModal
      title={`Archive ${archiveTarget.asset}?`}
      message={`This will move the <strong>${archiveTarget.asset}</strong> signal to the archive. It will no longer appear in the main signal list but can be retrieved later.`}
      confirmLabel="Archive"
      icon={<Archive size={28} color={C.tm} />}
      iconColor={C.tm}
      iconBg="rgba(142,138,158,0.1)"
      loading={loading}
      onCancel={() => setArchiveTarget(null)}
      onConfirm={() => doAction(() => {
        setSignals(signals.filter(s => s.id !== archiveTarget.id));
        setArchiveTarget(null); showToast("Signal archived");
      })}
    />}
  </div>;
}
