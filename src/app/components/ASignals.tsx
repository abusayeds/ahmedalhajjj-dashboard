import { useMemo, useState } from "react";
import {
  Zap, Plus, Pencil, Trash2, Search, RefreshCw, Download,
  FileText, Check, ChevronLeft, ChevronRight, Copy, Archive, Send, Calendar, Settings2, Lock,
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ATa, ASel, AModal, ACard, Chip, IconBtn,
  SignalData, SIGNAL_TYPE_OPTIONS, matchSignalTypeOption,
  normalizeSignalCategory, getSignalCategoryLabel, signalCategorySelectOptions,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";
import {
  mapApiSignal,
  useArchiveSignalMutation,
  useCloseSignalMutation,
  useCreateSignalMutation,
  useDeleteSignalMutation,
  useGetSignalsQuery,
  usePublishSignalMutation,
  useUpdateSignalMutation,
} from "../../store/api/signalApi";
import {
  mapSignalTypeOptions,
  useCreateSignalTypeMutation,
  useDeleteSignalTypeMutation,
  useGetSignalTypesQuery,
} from "../../store/api/signalTypeApi";
import {
  dateInputToIso,
  getTodayDateInput,
  getTodayDateTimeLocal,
  toDateInputValue,
  toDateTimeLocalValue,
} from "../utils/signalDate";

type SignalForm = {
  asset: string;
  cat: string;
  type: string;
  dir: string;
  entry: string;
  sl: string;
  tp1: string;
  tp2: string;
  tp3: string;
  notes: string;
  status: string;
  signalDate: string;
  schedule: string;
};

const emptyForm = (): SignalForm => ({
  asset: "",
  cat: "Forex",
  type: "Swing",
  dir: "BUY",
  entry: "",
  sl: "",
  tp1: "",
  tp2: "",
  tp3: "",
  notes: "",
  status: "Draft",
  signalDate: getTodayDateInput(),
  schedule: getTodayDateTimeLocal(),
});

const PLACEHOLDERS: Record<string, {
  asset: string;
  type: string;
  entry: string;
  sl: string;
  tp1: string;
  tp2: string;
  tp3: string;
  notes: string;
}> = {
  Forex: {
    asset: "EUR/USD",
    type: "Swing",
    entry: "1.08420",
    sl: "1.08800",
    tp1: "1.08100",
    tp2: "1.07750",
    tp3: "1.07400",
    notes: "Bearish rejection at 1.0850 resistance. Targeting previous support zone.",
  },
  Crypto: {
    asset: "BTC/USDT",
    type: "Scalp",
    entry: "67420.50",
    sl: "65800.00",
    tp1: "69000.00",
    tp2: "71500.00",
    tp3: "74000.00",
    notes: "Breakout above 67K with strong volume. Risk 2% per trade.",
  },
  Commodity: {
    asset: "XAU/USD",
    type: "Intraday",
    entry: "2847.50",
    sl: "2820.00",
    tp1: "2875.00",
    tp2: "2900.00",
    tp3: "2930.00",
    notes: "Gold holding above daily support. Watch US session volatility.",
  },
  Index: {
    asset: "NAS100",
    type: "Position",
    entry: "19840.00",
    sl: "19600.00",
    tp1: "20100.00",
    tp2: "20400.00",
    tp3: "20850.00",
    notes: "Index momentum bullish on tech earnings. Move SL to breakeven at TP1.",
  },
};

const normalizeSignalType = (
  value: string,
  options: ReadonlyArray<{ l: string; v: string }> = SIGNAL_TYPE_OPTIONS,
) => matchSignalTypeOption(value, options);

const validateForm = (form: SignalForm, requireSchedule = false) => {
  if (!form.asset.trim()) return "Asset / Pair is required.";
  if (!form.type.trim()) return "Signal Type is required.";
  if (!form.entry.trim()) return "Entry Price is required.";
  if (!form.sl.trim()) return "Stop Loss is required.";
  if (!form.tp1.trim()) return "Take Profit 1 is required.";
  if (requireSchedule && !form.schedule) return "Schedule time is required for scheduled signals.";
  return null;
};

const toPayload = (
  form: SignalForm,
  statusOverride?: string,
  typeOptions: ReadonlyArray<{ l: string; v: string }> = SIGNAL_TYPE_OPTIONS,
  options?: { setSignalDate?: boolean },
) => {
  const status = statusOverride || form.status;
  const payload = {
  asset: form.asset.trim(),
  category: form.cat,
  type: normalizeSignalType(form.type, typeOptions),
  direction: form.dir as "BUY" | "SELL",
  entry: form.entry.trim(),
  sl: form.sl.trim(),
  tp1: form.tp1.trim(),
  tp2: form.tp2.trim() || undefined,
  tp3: form.tp3.trim() || undefined,
  notes: form.notes.trim() || undefined,
  status,
  scheduledAt: form.schedule ? new Date(form.schedule).toISOString() : undefined,
  } as Record<string, unknown>;

  if (options?.setSignalDate !== false && status === "Active") {
    payload.signalDate = dateInputToIso(form.signalDate);
  }

  return payload;
};

function SignalFormFields({
  form,
  setForm,
  mode = "create",
  signalTypeOptions = [...SIGNAL_TYPE_OPTIONS],
}: {
  form: SignalForm;
  setForm: React.Dispatch<React.SetStateAction<SignalForm>>;
  mode?: "create" | "edit";
  signalTypeOptions?: { l: string; v: string }[];
}) {
  const ph = PLACEHOLDERS[form.cat] || PLACEHOLDERS.Forex;
  const isScheduled = form.status === "Scheduled";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
        <AIn label="Asset / Pair" placeholder={ph.asset} value={form.asset} onChange={(v) => setForm({ ...form, asset: v })} />
        <ASel label="Category" value={form.cat} onChange={(v) => setForm({ ...form, cat: v })} opts={signalCategorySelectOptions()} />
        <ASel label="Signal Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} opts={signalTypeOptions} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
        <ASel label="Direction" value={form.dir} onChange={(v) => setForm({ ...form, dir: v })} opts={[{ l: "BUY (Long) ↑", v: "BUY" }, { l: "SELL (Short) ↓", v: "SELL" }]} />
        <AIn label="Entry Price" placeholder={ph.entry} value={form.entry} onChange={(v) => setForm({ ...form, entry: v })} />
        <AIn label="Stop Loss" placeholder={ph.sl} value={form.sl} onChange={(v) => setForm({ ...form, sl: v })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
        <AIn label="Take Profit 1" placeholder={ph.tp1} value={form.tp1} onChange={(v) => setForm({ ...form, tp1: v })} />
        <AIn label="Take Profit 2 (optional)" placeholder={ph.tp2} value={form.tp2} onChange={(v) => setForm({ ...form, tp2: v })} />
        <AIn label="Take Profit 3 (optional)" placeholder={ph.tp3} value={form.tp3} onChange={(v) => setForm({ ...form, tp3: v })} />
      </div>
      <AIn
        label="Signal Date"
        value={form.signalDate}
        onChange={(v) => setForm({ ...form, signalDate: v })}
        type="date"
      />
      <div style={{ display: "grid", gridTemplateColumns: isScheduled ? "1fr 1fr" : "1fr", gap: 13 }}>
        <ASel
          label="Save As"
          value={form.status}
          onChange={(v) => setForm({
            ...form,
            status: v,
            schedule: v === "Scheduled" ? (form.schedule || getTodayDateTimeLocal()) : form.schedule,
          })}
          opts={
            mode === "edit"
              ? [
                { l: "Active (Live)", v: "Active" },
                { l: "Draft", v: "Draft" },
                { l: "Scheduled", v: "Scheduled" },
                { l: "Closed", v: "Closed" },
              ]
              : [
                { l: "Draft (save only)", v: "Draft" },
                { l: "Scheduled (publish later)", v: "Scheduled" },
              ]
          }
        />
        {isScheduled && (
          <AIn
            label="Schedule Date & Time"
            placeholder="Select date and time"
            value={form.schedule}
            onChange={(v) => setForm({ ...form, schedule: v })}
            type="datetime-local"
          />
        )}
      </div>
      {mode === "create" && (
        <div style={{ background: "rgba(128,0,255,0.06)", border: "1px solid rgba(128,0,255,0.14)", borderRadius: 11, padding: "10px 14px" }}>
          <span style={{ fontFamily: P, fontSize: 11, color: C.t2, lineHeight: 1.5 }}>
            Use <strong>Publish Signal</strong> to go live immediately. Choose Scheduled to publish later, or Save Draft to keep it private.
          </span>
        </div>
      )}
      <ATa label="Analysis Notes (optional)" placeholder={ph.notes} value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
    </div>
  );
}

export default function ASignals() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [pubModal, setPubModal] = useState(false);
  const [typesModal, setTypesModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [deleteTypeTarget, setDeleteTypeTarget] = useState<{ id: string; name: string } | null>(null);
  const [editTarget, setEditTarget] = useState<SignalData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SignalData | null>(null);
  const [closeTarget, setCloseTarget] = useState<SignalData | null>(null);
  const [dupTarget, setDupTarget] = useState<SignalData | null>(null);
  const [publishTarget, setPublishTarget] = useState<SignalData | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<SignalData | null>(null);

  const [form, setForm] = useState<SignalForm>(emptyForm());
  const [closeRes, setCloseRes] = useState("Win");
  const [closePnl, setClosePnl] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetSignalsQuery({
    status: filter,
    searchTerm: searchTerm || undefined,
  });
  const { data: signalTypesData, isLoading: typesLoading } = useGetSignalTypesQuery();
  const [createSignalType, { isLoading: creatingType }] = useCreateSignalTypeMutation();
  const [deleteSignalType, { isLoading: deletingType }] = useDeleteSignalTypeMutation();
  const signalTypeOptions = useMemo(
    () => mapSignalTypeOptions(signalTypesData?.data || []),
    [signalTypesData?.data],
  );
  const typeOptionsForForm = signalTypeOptions.length ? signalTypeOptions : [...SIGNAL_TYPE_OPTIONS];
  const [createSignal, { isLoading: creating }] = useCreateSignalMutation();
  const [updateSignal, { isLoading: updating }] = useUpdateSignalMutation();
  const [deleteSignal, { isLoading: deleting }] = useDeleteSignalMutation();
  const [publishSignal, { isLoading: publishing }] = usePublishSignalMutation();
  const [closeSignal, { isLoading: closing }] = useCloseSignalMutation();
  const [archiveSignal, { isLoading: archiving }] = useArchiveSignalMutation();

  const loading = creating || updating || deleting || publishing || closing || archiving;

  const signals = useMemo(
    () => (data?.data || []).map(mapApiSignal),
    [data?.data],
  );

  const tabs = ["All", "Active", "Draft", "Scheduled", "Closed"];
  const filtered = signals.filter((s) => filter === "All" || s.status === filter);
  const dCol = (d: string) => (d === "BUY" ? C.buy : C.sell);
  const sChip = (s: string) => {
    const m: Record<string, "ok" | "brand" | "info" | "muted" | "err" | "draft"> = {
      Active: "ok",
      Draft: "draft",
      Scheduled: "info",
      Closed: "err",
    };
    return <Chip label={s} type={m[s] || "muted"} />;
  };

  const openCloseModal = (signal: SignalData) => {
    setCloseRes("Win");
    setClosePnl("");
    setCloseTarget(signal);
  };

  const resetForm = () => setForm(emptyForm());

  const openEdit = (s: SignalData) => {
    setForm({
      asset: s.asset,
      cat: normalizeSignalCategory(s.cat),
      type: matchSignalTypeOption(s.type, typeOptionsForForm),
      dir: s.dir,
      entry: s.entry,
      sl: s.sl,
      tp1: s.tp1,
      tp2: s.tp2,
      tp3: s.tp3,
      notes: "",
      status: s.status,
      signalDate: toDateInputValue(s.signalDate),
      schedule: s.scheduledAt ? toDateTimeLocalValue(s.scheduledAt) : getTodayDateTimeLocal(),
    });
    setEditTarget(s);
  };

  const openDuplicate = (s: SignalData) => {
    setForm({
      asset: s.asset,
      cat: normalizeSignalCategory(s.cat),
      type: matchSignalTypeOption(s.type, typeOptionsForForm),
      dir: s.dir,
      entry: s.entry,
      sl: s.sl,
      tp1: s.tp1,
      tp2: s.tp2,
      tp3: s.tp3,
      notes: "",
      status: "Draft",
      signalDate: getTodayDateInput(),
      schedule: getTodayDateTimeLocal(),
    });
    setDupTarget(s);
  };

  const handleCreate = async (action: "draft" | "publish" | "schedule") => {
    const requireSchedule = action === "schedule" || form.status === "Scheduled";
    const error = validateForm(form, requireSchedule);
    if (error) {
      showToast(error, "error");
      return;
    }

    const status =
      action === "draft"
        ? "Draft"
        : action === "schedule" || form.status === "Scheduled"
          ? "Scheduled"
          : "Active";

    try {
      await createSignal(toPayload(form, status, typeOptionsForForm)).unwrap();
      setPubModal(false);
      resetForm();
      showToast(
        status === "Draft"
          ? "Signal saved as draft"
          : status === "Scheduled"
            ? "Signal scheduled successfully!"
            : "Signal published successfully!",
      );
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to create signal", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    const error = validateForm(form, form.status === "Scheduled");
    if (error) {
      showToast(error, "error");
      return;
    }
    try {
      const setSignalDate = form.status === "Active";
      await updateSignal({
        id: editTarget.id,
        data: toPayload(form, undefined, typeOptionsForForm, { setSignalDate }),
      }).unwrap();
      setEditTarget(null);
      showToast("Signal updated successfully!");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to update signal", "error");
    }
  };

  const handleDuplicate = async () => {
    const error = validateForm(form);
    if (error) {
      showToast(error, "error");
      return;
    }
    try {
      await createSignal(toPayload(form, "Draft", typeOptionsForForm)).unwrap();
      setDupTarget(null);
      resetForm();
      showToast("Signal duplicated as draft!");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to duplicate signal", "error");
    }
  };

  const COLS = "minmax(180px,1.5fr) 100px 90px 110px 110px 110px 110px 110px 140px 130px 160px";
  const HEAD = ["ASSET", "TYPE", "DIR", "ENTRY", "SL", "TP1", "TP2", "TP3", "STATUS", "PUBLISHED", "ACTIONS"];

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Signals</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>
          {signals.length} TOTAL · {signals.filter((s) => s.status === "Active").length} ACTIVE
          {(isLoading || isFetching) ? " · SYNCING..." : ""}
        </div>
      </div>
    </div>

    <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 260 }}>
          <Search size={14} color={C.td} />
          <input
            placeholder="Search signals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }}
          />
        </div>
        <div style={{ width: 1, height: 24, background: AD.cardB }} />
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.02)", padding: 6, borderRadius: 10, border: `1px solid rgba(255,255,255,0.04)` }}>
          {tabs.map((t) => <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 16px", borderRadius: 6, background: filter === t ? "rgba(255,255,255,0.1)" : "transparent", color: filter === t ? "#fff" : C.td, border: "none", fontFamily: P, fontSize: 12.5, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", boxShadow: filter === t ? "0 2px 8px rgba(0,0,0,0.2)" : "none" }}>{t}</button>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AGhost icon={<Settings2 size={14} />} onClick={() => setTypesModal(true)}>Manage Types</AGhost>
        <AGhost icon={<RefreshCw size={14} />} onClick={() => refetch()}>Refresh</AGhost>
        <AGhost icon={<Download size={14} />}>Export</AGhost>
        <APrimary onClick={() => { resetForm(); setPubModal(true); }} icon={<Plus size={14} />}>Publish Signal</APrimary>
      </div>
    </ACard>

    <ACard>
      <div className="a-tscroll" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1200 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderBottom: `1px solid ${AD.cardB}`, borderRadius: "18px 18px 0 0" }}>
            {HEAD.map((h) => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div style={{ padding: "48px 28px", textAlign: "center", fontFamily: P, fontSize: 14, color: C.td }}>
              No signals found for this filter.
            </div>
          )}
          {filtered.map((s, i) => <div key={s.id} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "24px 28px", borderBottom: i < filtered.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: C.t1 }}>{s.asset}</span>
              <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>{getSignalCategoryLabel(s.cat)}</span>
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
              {s.status === "Active" && <IconBtn icon={<Lock size={14} color={C.gold} />} title="Close" onClick={() => openCloseModal(s)} bg="rgba(191,160,109,0.08)" />}
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
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </ACard>

    {pubModal && <AModal title="Publish New Signal" sub="Fill in the details below and publish or save as draft" onClose={() => setPubModal(false)} width={700}>
      <SignalFormFields form={form} setForm={setForm} mode="create" signalTypeOptions={typeOptionsForForm} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setPubModal(false)}>Cancel</AGhost>
        <AGhost icon={<FileText size={13} />} loading={loading} onClick={() => handleCreate("draft")}>Save Draft</AGhost>
        {form.status === "Scheduled" ? (
          <APrimary icon={<Calendar size={13} />} loading={loading} onClick={() => handleCreate("schedule")}>Schedule Signal</APrimary>
        ) : (
          <APrimary icon={<Zap size={13} />} loading={loading} onClick={() => handleCreate("publish")}>Publish Signal</APrimary>
        )}
      </div>
    </AModal>}

    {editTarget && <AModal title={`Edit Signal — ${editTarget.asset}`} sub="Update signal parameters" onClose={() => setEditTarget(null)} width={700}>
      <SignalFormFields form={form} setForm={setForm} mode="edit" signalTypeOptions={typeOptionsForForm} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
        <APrimary icon={<Check size={13} />} loading={loading} onClick={handleUpdate}>Save Changes</APrimary>
      </div>
    </AModal>}

    {dupTarget && <AModal title={`Duplicate Signal — ${dupTarget.asset}`} sub="Create a copy of this signal with modifications" onClose={() => setDupTarget(null)} width={700}>
      <SignalFormFields form={form} setForm={setForm} mode="create" signalTypeOptions={typeOptionsForForm} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setDupTarget(null)}>Cancel</AGhost>
        <APrimary icon={<Copy size={13} />} loading={loading} onClick={handleDuplicate}>Duplicate Signal</APrimary>
      </div>
    </AModal>}

    {typesModal && <AModal title="Manage Signal Types" sub="Add or remove signal types used in subscriptions and signal forms" onClose={() => setTypesModal(false)} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <AIn
            label="New Signal Type"
            placeholder="e.g. Scalp, Swing, Long-term"
            value={newTypeName}
            onChange={setNewTypeName}
          />
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <APrimary
              icon={<Plus size={13} />}
              loading={creatingType}
              onClick={async () => {
                if (!newTypeName.trim()) {
                  showToast("Signal type name is required", "warning");
                  return;
                }
                try {
                  await createSignalType({ name: newTypeName.trim() }).unwrap();
                  setNewTypeName("");
                  showToast("Signal type added");
                } catch (error: any) {
                  showToast(error?.data?.message || "Failed to add signal type", "error");
                }
              }}
            >
              Add
            </APrimary>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
          {typesLoading && (
            <div style={{ fontFamily: P, fontSize: 13, color: C.td, textAlign: "center", padding: "20px 0" }}>
              Loading signal types...
            </div>
          )}
          {!typesLoading && (signalTypesData?.data || []).length === 0 && (
            <div style={{ fontFamily: P, fontSize: 13, color: C.td, textAlign: "center", padding: "20px 0" }}>
              No signal types yet. Add your first type above.
            </div>
          )}
          {(signalTypesData?.data || []).map((type) => (
            <div
              key={type._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${AD.cardB}`,
                borderRadius: 10,
              }}
            >
              <span style={{ fontFamily: P, fontSize: 13, color: C.t1 }}>{type.name}</span>
              <IconBtn
                icon={<Trash2 size={14} color={C.sell} />}
                title="Delete type"
                onClick={() => setDeleteTypeTarget({ id: type._id, name: type.name })}
              />
            </div>
          ))}
        </div>
      </div>
    </AModal>}

    {deleteTypeTarget && <ConfirmDeleteModal
      message={`Delete signal type <strong>${deleteTypeTarget.name}</strong>? Existing signals using this type will remain unchanged.`}
      loading={deletingType}
      onCancel={() => setDeleteTypeTarget(null)}
      onConfirm={async () => {
        try {
          await deleteSignalType(deleteTypeTarget.id).unwrap();
          setDeleteTypeTarget(null);
          showToast("Signal type deleted", "error");
        } catch (error: any) {
          showToast(error?.data?.message || "Failed to delete signal type", "error");
        }
      }}
    />}

    {closeTarget && <AModal title={`Close Signal — ${closeTarget.asset}`} sub="Set the outcome before closing this signal" onClose={() => setCloseTarget(null)} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: `${C.brand}0A`, border: `1px solid ${C.brand}20`, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontFamily: M, fontSize: 13, fontWeight: 700, color: C.t1 }}>{closeTarget.asset}</div>
          <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>Entry: {closeTarget.entry} · SL: {closeTarget.sl}</div>
        </div>
        <ASel label="Final Result" value={closeRes} onChange={setCloseRes} opts={[{ l: "✓ Win", v: "Win" }, { l: "✗ Loss", v: "Loss" }, { l: "— Breakeven", v: "Breakeven" }]} />
        <AIn label="Profit / Loss %" placeholder="e.g. +3.25 or -1.80" value={closePnl} onChange={setClosePnl} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setCloseTarget(null)}>Cancel</AGhost>
          <APrimary icon={<Check size={13} />} loading={loading} onClick={async () => {
            try {
              await closeSignal({ id: closeTarget.id, closeResult: closeRes, closePnl }).unwrap();
              setCloseTarget(null);
              showToast(`Signal closed — ${closeRes}`);
            } catch (error: any) {
              showToast(error?.data?.message || "Failed to close signal", "error");
            }
          }}>Confirm & Close</APrimary>
        </div>
      </div>
    </AModal>}

    {deleteTarget && <ConfirmDeleteModal
      message={`Are you sure you want to delete the <strong>${deleteTarget.asset}</strong> signal? This action cannot be undone and will remove this signal from all subscriber feeds.`}
      loading={loading}
      onCancel={() => setDeleteTarget(null)}
      onConfirm={async () => {
        try {
          await deleteSignal(deleteTarget.id).unwrap();
          setDeleteTarget(null);
          showToast("Signal deleted", "error");
        } catch (error: any) {
          showToast(error?.data?.message || "Failed to delete signal", "error");
        }
      }}
    />}

    {publishTarget && <ConfirmActionModal
      title={`Publish ${publishTarget.asset}?`}
      message={`This will immediately publish the <strong>${publishTarget.asset} ${publishTarget.dir}</strong> signal and notify all ${publishTarget.cat} subscribers via push notification.`}
      confirmLabel="Publish Now"
      icon={<Send size={28} color={C.buy} />}
      iconColor={C.buy}
      iconBg="rgba(0,208,132,0.1)"
      loading={loading}
      onCancel={() => setPublishTarget(null)}
      onConfirm={async () => {
        try {
          await publishSignal(publishTarget.id).unwrap();
          setPublishTarget(null);
          showToast("Signal published!");
        } catch (error: any) {
          showToast(error?.data?.message || "Failed to publish signal", "error");
        }
      }}
    />}

    {archiveTarget && <ConfirmActionModal
      title={`Archive ${archiveTarget.asset}?`}
      message={`This will move the <strong>${archiveTarget.asset}</strong> signal to the archive. It will no longer appear in the main signal list but can be retrieved later.`}
      confirmLabel="Archive"
      icon={<Archive size={28} color={C.tm} />}
      iconColor={C.tm}
      iconBg="rgba(142,138,158,0.1)"
      loading={loading}
      onCancel={() => setArchiveTarget(null)}
      onConfirm={async () => {
        try {
          await archiveSignal(archiveTarget.id).unwrap();
          setArchiveTarget(null);
          showToast("Signal archived");
        } catch (error: any) {
          showToast(error?.data?.message || "Failed to archive signal", "error");
        }
      }}
    />}
  </div>;
}
