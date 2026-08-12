import { useMemo, useState } from "react";
import {
  Zap, Bell, BookOpen, TrendingUp, Crown, Users,
  ChevronRight, Download, FileText, Calendar, Image, Send,
  Activity,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ATa, ASel, AModal, ACard, CTooltip, SCard, SIGNAL_TYPE_OPTIONS, signalCategorySelectOptions,
} from "./shared";
import { useToast } from "./SuccessToast";
import { useCreateSignalMutation } from "../../store/api/signalApi";
import { mapSignalTypeOptions, useGetSignalTypesQuery } from "../../store/api/signalTypeApi";
import { useCreatePostMutation } from "../../store/api/postApi";
import PostCoverUpload from "./PostCoverUpload";
import {
  useGetAudienceStatsQuery,
  useScheduleNotificationMutation,
  useSendNotificationMutation,
} from "../../store/api/notificationApi";
import { useGetDashboardStatsQuery } from "../../store/api/dashboardApi";
import {
  dateInputToIso,
  getTodayDateInput,
  getTodayDateTimeLocal,
} from "../utils/signalDate";

const emptySignalForm = () => ({
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
  status: "Active",
  signalDate: getTodayDateInput(),
  schedule: getTodayDateTimeLocal(),
});

const emptyPostForm = () => ({
  title: "",
  body: "",
  cat: "Market Update",
  schedule: getTodayDateTimeLocal(),
  mode: "publish" as "publish" | "schedule",
  coverImage: "",
});

const emptyNotifForm = () => ({
  title: "",
  msg: "",
  audience: "All Users",
  schedule: getTodayDateTimeLocal(),
});

export default function ADashboard() {
  const { showToast } = useToast();
  const [range, setRange] = useState<"7D" | "30D" | "6M">("6M");
  const { data: dashboardRes, isLoading, isFetching } = useGetDashboardStatsQuery(range);
  const { data: audienceData } = useGetAudienceStatsQuery();
  const [createSignal, { isLoading: signalLoading }] = useCreateSignalMutation();
  const { data: signalTypesData } = useGetSignalTypesQuery();
  const signalTypeOptions = useMemo(
    () => {
      const options = mapSignalTypeOptions(signalTypesData?.data || []);
      return options.length ? options : [...SIGNAL_TYPE_OPTIONS];
    },
    [signalTypesData?.data],
  );
  const [createPost, { isLoading: postLoading }] = useCreatePostMutation();
  const [sendNotification, { isLoading: notifLoading }] = useSendNotificationMutation();
  const [scheduleNotification, { isLoading: schedulingNotif }] = useScheduleNotificationMutation();

  const [signalModal, setSignalModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);

  const [sf, setSf] = useState(emptySignalForm());
  const [pf, setPf] = useState(emptyPostForm());
  const [nf, setNf] = useState(emptyNotifForm());

  const dashboard = dashboardRes?.data;
  const audience = audienceData?.data;
  const loading = signalLoading || postLoading || notifLoading || schedulingNotif;

  const formatCount = (value?: number) => (value ?? 0).toLocaleString();
  const formatMoney = (value?: number) => `$${(value ?? 0).toLocaleString()}`;

  const r1: Parameters<typeof SCard>[0][] = [
    {
      label: "Total Users",
      value: formatCount(dashboard?.kpis.total.value),
      change: dashboard?.kpis.total.change,
      icon: Users,
      color: C.brand,
      sparkline: dashboard?.kpis.total.sparkline,
    },
    {
      label: "Active VIP Members",
      value: formatCount(dashboard?.kpis.vip.value),
      change: dashboard?.kpis.vip.change,
      icon: Crown,
      color: C.gold,
      sparkline: dashboard?.kpis.vip.sparkline,
    },
    {
      label: "Forex Subscribers",
      value: formatCount(dashboard?.kpis.forex.value),
      change: dashboard?.kpis.forex.change,
      icon: TrendingUp,
      color: C.buy,
      sparkline: dashboard?.kpis.forex.sparkline,
    },
    {
      label: "Crypto Subscribers",
      value: formatCount(dashboard?.kpis.crypto.value),
      change: dashboard?.kpis.crypto.change,
      icon: Zap,
      color: "#60A5FA",
      sparkline: dashboard?.kpis.crypto.sparkline,
    },
  ];

  const growthData = dashboard?.growthData || [];
  const revenueData = dashboard?.revenueData || [];
  const perfData = dashboard?.signalPerformance?.perfData || [];
  const activityFeed = dashboard?.activityFeed || [];
  const marketTickers = dashboard?.marketTickers || [];

  const saveSignalDraft = async () => {
    try {
      await createSignal({
        asset: sf.asset,
        category: sf.cat,
        type: sf.type,
        direction: sf.dir as "BUY" | "SELL",
        entry: sf.entry,
        sl: sf.sl,
        tp1: sf.tp1,
        tp2: sf.tp2,
        tp3: sf.tp3,
        notes: sf.notes,
        status: "Draft",
      }).unwrap();
      setSignalModal(false);
      setSf(emptySignalForm());
      showToast("Signal saved as draft");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to save signal", "error");
    }
  };

  const publishSignal = async () => {
    try {
      await createSignal({
        asset: sf.asset,
        category: sf.cat,
        type: sf.type,
        direction: sf.dir as "BUY" | "SELL",
        entry: sf.entry,
        sl: sf.sl,
        tp1: sf.tp1,
        tp2: sf.tp2,
        tp3: sf.tp3,
        notes: sf.notes,
        status: sf.status,
        scheduledAt: sf.schedule ? new Date(sf.schedule).toISOString() : undefined,
        signalDate: sf.status === "Active" ? dateInputToIso(sf.signalDate) : undefined,
      }).unwrap();
      setSignalModal(false);
      setSf(emptySignalForm());
      showToast("Signal published successfully!");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to publish signal", "error");
    }
  };

  const savePostDraft = async () => {
    try {
      await createPost({ title: pf.title, body: pf.body, category: pf.cat, coverImage: pf.coverImage || undefined, status: "Draft" }).unwrap();
      setPostModal(false);
      setPf(emptyPostForm());
      showToast("Post saved as draft");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to save post", "error");
    }
  };

  const publishPost = async () => {
    try {
      await createPost({
        title: pf.title,
        body: pf.body,
        category: pf.cat,
        coverImage: pf.coverImage || undefined,
        status: pf.mode === "schedule" ? "Scheduled" : "Published",
        scheduledAt: pf.schedule ? new Date(pf.schedule).toISOString() : undefined,
      }).unwrap();
      setPostModal(false);
      setPf(emptyPostForm());
      showToast(pf.mode === "schedule" ? "Post scheduled successfully!" : "Post published successfully!");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to save post", "error");
    }
  };

  const sendNotif = async () => {
    try {
      await sendNotification({ title: nf.title, message: nf.msg, audience: nf.audience }).unwrap();
      setNotifModal(false);
      showToast(`Notification sent to ${nf.audience}!`);
      setNf(emptyNotifForm());
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to send notification", "error");
    }
  };

  const scheduleNotif = async () => {
    if (!nf.schedule) {
      showToast("Please select a schedule time", "error");
      return;
    }
    try {
      await scheduleNotification({
        title: nf.title,
        message: nf.msg,
        audience: nf.audience,
        scheduledAt: new Date(nf.schedule).toISOString(),
      }).unwrap();
      setNotifModal(false);
      showToast("Notification scheduled");
      setNf(emptyNotifForm());
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to schedule notification", "error");
    }
  };

  const rangeLabel = range === "7D" ? "7-DAY TREND" : range === "30D" ? "30-DAY TREND" : "6-MONTH TREND";

  return <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32 }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <APrimary icon={<Zap size={16} />} onClick={() => setSignalModal(true)}>Publish Signal</APrimary>
        <AGhost icon={<BookOpen size={16} />} onClick={() => setPostModal(true)}>Create Post</AGhost>
        <AGhost icon={<Bell size={16} />} onClick={() => setNotifModal(true)}>Send Notification</AGhost>
      </div>
      <div style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.02)", padding: "8px 16px", borderRadius: 12, border: `1px solid ${AD.cardB}` }}>
        {marketTickers.length === 0 ? (
          <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>No live market signals yet</span>
        ) : marketTickers.map((m) => (
          <div key={m.s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: P, fontSize: 12, color: C.td, fontWeight: 600 }}>{m.s}</span>
            <span style={{ fontFamily: M, fontSize: 13, color: C.t1 }}>{m.p}</span>
            <span style={{ fontFamily: M, fontSize: 11, color: m.up ? C.buy : C.sell }}>{m.c}</span>
            <div style={{ width: 1, height: 16, background: AD.cardB, margin: "0 4px" }} />
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.buy, boxShadow: `0 0 8px ${C.buy}` }} />
          <span style={{ fontFamily: P, fontSize: 11, color: C.t2 }}>
            {dashboard?.systemStatus === "operational" ? "System Operational" : "System Status Unknown"}
            {(isLoading || isFetching) ? " · Syncing" : ""}
          </span>
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
      {r1.map((s) => <SCard key={s.label} {...s} />)}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
      <ACard style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Subscription Growth</div>
            <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>{rangeLabel} · ALL PLANS</div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {[{ l: "VIP", c: C.brand }, { l: "Forex", c: C.gold }, { l: "Crypto", c: "#60A5FA" }].map(({ l, c }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}80` }} /><span style={{ fontFamily: P, fontSize: 12, color: C.t2, fontWeight: 500 }}>{l}</span></div>
            ))}
            <div style={{ width: 1, height: 24, background: AD.cardB, margin: "0 8px" }} />
            <ASel value={range} onChange={(v) => setRange(v as "7D" | "30D" | "6M")} opts={[{ l: "7 Days", v: "7D" }, { l: "30 Days", v: "30D" }, { l: "6 Months", v: "6M" }]} />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 280 }}>
          {growthData.length === 0 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: P, fontSize: 13, color: C.td }}>
              No subscription growth data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.brand} stopOpacity={0.4} /><stop offset="95%" stopColor={C.brand} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3} /><stop offset="95%" stopColor={C.gold} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#60A5FA" stopOpacity={0.25} /><stop offset="95%" stopColor="#60A5FA" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="v" name="VIP" stroke={C.brand} fill="url(#gV)" strokeWidth={3} activeDot={{ r: 6, fill: C.brand, stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="f" name="Forex" stroke={C.gold} fill="url(#gF)" strokeWidth={3} activeDot={{ r: 6, fill: C.gold, stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="c" name="Crypto" stroke="#60A5FA" fill="url(#gC)" strokeWidth={3} activeDot={{ r: 6, fill: "#60A5FA", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ACard>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ACard style={{ padding: "32px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Signal Performance</div>
              <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>
                ALL TIME · {formatCount(dashboard?.signalPerformance?.totalClosed)} SIGNALS
              </div>
            </div>
            <div style={{ fontFamily: M, fontSize: 32, fontWeight: 700, color: C.t1, letterSpacing: "-1px" }}>
              {dashboard?.signalPerformance?.winRate ?? 0}<span style={{ fontSize: 16, color: C.tm }}>%</span>
            </div>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {perfData.length === 0 || (dashboard?.signalPerformance?.totalClosed ?? 0) === 0 ? (
              <div style={{ fontFamily: P, fontSize: 13, color: C.td }}>No closed signals yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={perfData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="v" stroke="none" cornerRadius={6}>
                    {perfData.map((e, i) => <Cell key={i} fill={e.color} style={{ filter: `drop-shadow(0 4px 12px ${e.color}40)` }} />)}
                  </Pie>
                  <Tooltip content={<CTooltip />} cursor={false} />
                </PieChart>
              </ResponsiveContainer>
            )}
            {(dashboard?.signalPerformance?.totalClosed ?? 0) > 0 && (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                <Activity size={24} color={C.tm} style={{ opacity: 0.5 }} />
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid rgba(255,255,255,0.04)` }}>
            {perfData.map((e) => <div key={e.n} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, boxShadow: `0 0 8px ${e.color}80` }} /><span style={{ fontFamily: P, fontSize: 12, color: C.tm, fontWeight: 500 }}>{e.n}</span></div>
              <span style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.t1 }}>{e.v}%</span>
            </div>)}
          </div>
        </ACard>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <ACard style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Revenue Analytics</div>
            <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>MONTHLY USD · SUBSCRIPTIONS</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: M, fontSize: 24, fontWeight: 700, color: C.t1 }}>
                {formatMoney(dashboard?.revenueSummary.total)}
              </div>
              <div style={{ fontFamily: M, fontSize: 11, color: C.buy }}>
                {dashboard?.revenueSummary.changePercent || "0%"} this month
              </div>
            </div>
            <AGhost icon={<Download size={14} />}>Export</AGhost>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 220 }}>
          {revenueData.length === 0 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: P, fontSize: 13, color: C.td }}>
              No revenue data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 0, bottom: 0, left: -10 }} barSize={42}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="r" name="Revenue" radius={[6, 6, 0, 0]}>
                  {revenueData.map((_, i) => <Cell key={i} fill={i === revenueData.length - 1 ? C.gold : C.brand} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ACard>

      <ACard style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Activity Feed</div>
            <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>LIVE · RECENT EVENTS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {activityFeed.length === 0 ? (
            <div style={{ fontFamily: P, fontSize: 13, color: C.td, textAlign: "center", padding: "24px 0" }}>
              No recent activity yet.
            </div>
          ) : activityFeed.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.015)", border: `1px solid rgba(255,255,255,0.03)`, transition: "background 0.2s" }} className="a-activity-hov">
              <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${a.col}20, ${a.col}05)`, border: `1px solid ${a.col}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 12px ${a.col}10` }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: P, fontSize: 13, color: C.t1, fontWeight: 500, marginBottom: 4 }}>{a.text}</div>
                <div style={{ fontFamily: M, fontSize: 11, color: C.td }}>{a.time}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", cursor: "pointer" }}><ChevronRight size={14} color={C.td} /></div>
            </div>
          ))}
        </div>
      </ACard>
    </div>

    {signalModal && <AModal title="Publish New Signal" sub="Fill in the details below and publish or save as draft" onClose={() => setSignalModal(false)} width={700}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
          <AIn label="Asset / Pair" placeholder="e.g. BTC/USDT" value={sf.asset} onChange={(v) => setSf({ ...sf, asset: v })} />
          <ASel label="Category" value={sf.cat} onChange={(v) => setSf({ ...sf, cat: v })} opts={signalCategorySelectOptions()} />
          <ASel label="Signal Type" value={sf.type} onChange={(v) => setSf({ ...sf, type: v })} opts={signalTypeOptions} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
          <ASel label="Direction" value={sf.dir} onChange={(v) => setSf({ ...sf, dir: v })} opts={[{ l: "BUY (Long) ↑", v: "BUY" }, { l: "SELL (Short) ↓", v: "SELL" }]} />
          <AIn label="Entry Price" placeholder="e.g. 67,420.00" value={sf.entry} onChange={(v) => setSf({ ...sf, entry: v })} />
          <AIn label="Stop Loss" placeholder="e.g. 65,800.00" value={sf.sl} onChange={(v) => setSf({ ...sf, sl: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
          <AIn label="Take Profit 1" placeholder="e.g. 69,000.00" value={sf.tp1} onChange={(v) => setSf({ ...sf, tp1: v })} />
          <AIn label="Take Profit 2 (optional)" placeholder="e.g. 71,500.00" value={sf.tp2} onChange={(v) => setSf({ ...sf, tp2: v })} />
          <AIn label="Take Profit 3 (optional)" placeholder="e.g. 74,000.00" value={sf.tp3} onChange={(v) => setSf({ ...sf, tp3: v })} />
        </div>
        <AIn
          label="Signal Date"
          value={sf.signalDate}
          onChange={(v) => setSf({ ...sf, signalDate: v })}
          type="date"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          <ASel label="Status" value={sf.status} onChange={(v) => setSf({ ...sf, status: v })} opts={[{ l: "Active (Publish Now)", v: "Active" }, { l: "Draft", v: "Draft" }, { l: "Scheduled", v: "Scheduled" }]} />
          <AIn label="Schedule Time" placeholder="Select date and time" value={sf.schedule} onChange={(v) => setSf({ ...sf, schedule: v })} type="datetime-local" />
        </div>
        <ATa label="Analysis Notes (optional)" placeholder="Briefly describe the setup, key levels, and confluence…" value={sf.notes} onChange={(v) => setSf({ ...sf, notes: v })} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 2 }}>
          <AGhost onClick={() => setSignalModal(false)}>Cancel</AGhost>
          <AGhost icon={<FileText size={13} />} loading={loading} onClick={saveSignalDraft}>Save Draft</AGhost>
          <APrimary icon={<Zap size={13} />} loading={loading} onClick={publishSignal}>Publish Signal</APrimary>
        </div>
      </div>
    </AModal>}

    {postModal && <AModal title="Create Post" sub="Publish to the mobile app Posts feed" onClose={() => setPostModal(false)} width={680}>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <PostCoverUpload value={pf.coverImage} onChange={(coverImage) => setPf({ ...pf, coverImage })} />
        <AIn label="Post Title" placeholder="Write a compelling headline…" value={pf.title} onChange={(v) => setPf({ ...pf, title: v })} />
        <ATa label="Content" placeholder="Write the post body…" value={pf.body} onChange={(v) => setPf({ ...pf, body: v })} rows={4} />
        <ASel label="Category" value={pf.cat} onChange={(v) => setPf({ ...pf, cat: v })} opts={[{ l: "Market Update", v: "Market Update" }, { l: "Education", v: "Education" }, { l: "News", v: "News" }, { l: "Announcement", v: "Announcement" }]} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          <ASel label="Publish Mode" value={pf.mode} onChange={(v) => setPf({ ...pf, mode: v as "publish" | "schedule", schedule: v === "schedule" ? (pf.schedule || getTodayDateTimeLocal()) : pf.schedule })} opts={[{ l: "Publish Now", v: "publish" }, { l: "Schedule for Later", v: "schedule" }]} />
          {pf.mode === "schedule" && <AIn label="Schedule Time" placeholder="Select date and time" value={pf.schedule} onChange={(v) => setPf({ ...pf, schedule: v })} type="datetime-local" />}
        </div>
        <div style={{ background: "rgba(128,0,255,0.06)", border: "1px solid rgba(128,0,255,0.14)", borderRadius: 11, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
          <Bell size={13} color="#C084FC" />
          <span style={{ fontFamily: P, fontSize: 11, color: C.t2 }}>Publishing will automatically send a push notification to all subscribers.</span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setPostModal(false)}>Cancel</AGhost>
          <AGhost icon={<FileText size={13} />} loading={loading} onClick={savePostDraft}>Save Draft</AGhost>
          <APrimary icon={<BookOpen size={13} />} loading={loading} onClick={publishPost}>
            {pf.mode === "schedule" ? "Schedule Post" : "Publish Post"}
          </APrimary>
        </div>
      </div>
    </AModal>}

    {notifModal && <AModal title="Send Notification" sub="Deliver an instant message to your subscribers" onClose={() => setNotifModal(false)} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AIn label="Title" placeholder="e.g. New Signal — BTC/USDT" value={nf.title} onChange={(v) => setNf({ ...nf, title: v })} />
        <ATa label="Message" placeholder="Write the message body…" value={nf.msg} onChange={(v) => setNf({ ...nf, msg: v })} rows={3} />
        <ASel label="Audience" value={nf.audience} onChange={(v) => setNf({ ...nf, audience: v })} opts={[
          { l: `All Users (${audience?.all ?? 0})`, v: "All Users" },
          { l: `VIP Members (${audience?.vip ?? 0})`, v: "VIP Users" },
          { l: `Forex Members (${audience?.forex ?? 0})`, v: "Forex Users" },
          { l: `Crypto Members (${audience?.crypto ?? 0})`, v: "Crypto Users" },
        ]} />
        <AIn label="Schedule Time (optional)" placeholder="Leave empty to send now" value={nf.schedule} onChange={(v) => setNf({ ...nf, schedule: v })} type="datetime-local" />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setNotifModal(false)}>Cancel</AGhost>
          <AGhost icon={<Calendar size={14} />} loading={loading} onClick={scheduleNotif}>Schedule</AGhost>
          <APrimary icon={<Send size={14} />} loading={loading} onClick={sendNotif}>Send Now</APrimary>
        </div>
      </div>
    </AModal>}
  </div>;
}
