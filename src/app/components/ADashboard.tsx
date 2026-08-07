import { useState } from "react";
import {
  Zap, Bell, BookOpen, TrendingUp, Crown, Users,
  ChevronRight, Download, FileText, Calendar, Image, Check,
  Activity, Send,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ATa, ASel, AModal, ACard, CTooltip, SCard,
  GROWTH_DATA, REVENUE_DATA, PERF_DATA, AACTIVITY,
} from "./shared";
import { useToast } from "./SuccessToast";

export default function ADashboard() {
  const { showToast } = useToast();
  const [signalModal, setSignalModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [signalLoading, setSignalLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  // Signal form
  const [sf, setSf] = useState({ asset: "", cat: "Forex", type: "Swing", dir: "BUY", entry: "", sl: "", tp1: "", tp2: "", tp3: "", notes: "", status: "Active", schedule: "" });
  // Post form
  const [pf, setPf] = useState({ title: "", body: "", cat: "Market Update", schedule: "", mode: "publish" as "publish" | "schedule" });
  // Notif form
  const [nf, setNf] = useState({ title: "", msg: "", audience: "All Users", schedule: "" });

  const SPARK1 = [{ v: 10 }, { v: 15 }, { v: 13 }, { v: 20 }, { v: 18 }, { v: 25 }];
  const SPARK3 = [{ v: 5 }, { v: 10 }, { v: 8 }, { v: 15 }, { v: 12 }, { v: 20 }];

  const r1: Parameters<typeof SCard>[0][] = [
    { label: "Total Subscribers", value: "1,247", change: "+12.4%", icon: Users, color: C.brand, sparkline: SPARK1 },
    { label: "Active VIP Members", value: "384", change: "+8.2%", icon: Crown, color: C.gold, sparkline: SPARK1 },
    { label: "Forex Subscribers", value: "521", change: "+15.1%", icon: TrendingUp, color: C.buy, sparkline: SPARK3 },
    { label: "Crypto Subscribers", value: "289", change: "+6.7%", icon: Zap, color: "#60A5FA", sparkline: SPARK1 },
  ];

  const publishSignal = () => {
    setSignalLoading(true);
    setTimeout(() => {
      setSignalLoading(false);
      setSignalModal(false);
      setSf({ asset: "", cat: "Forex", type: "Swing", dir: "BUY", entry: "", sl: "", tp1: "", tp2: "", tp3: "", notes: "", status: "Active", schedule: "" });
      showToast("Signal published successfully!");
    }, 1200);
  };

  const publishPost = () => {
    setPostLoading(true);
    setTimeout(() => {
      setPostLoading(false);
      setPostModal(false);
      setPf({ title: "", body: "", cat: "Market Update", schedule: "", mode: "publish" });
      showToast(pf.mode === "schedule" ? "Post scheduled successfully!" : "Post published successfully!");
    }, 1200);
  };

  const sendNotif = () => {
    setNotifLoading(true);
    setTimeout(() => {
      setNotifLoading(false);
      setNotifModal(false);
      showToast(`Notification sent to ${nf.audience}!`);
      setNf({ title: "", msg: "", audience: "All Users", schedule: "" });
    }, 1200);
  };

  return <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32 }}>
    {/* Top Actions & Market Overview Row */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <APrimary icon={<Zap size={16} />} onClick={() => setSignalModal(true)}>Publish Signal</APrimary>
        <AGhost icon={<BookOpen size={16} />} onClick={() => setPostModal(true)}>Create Post</AGhost>
        <AGhost icon={<Bell size={16} />} onClick={() => setNotifModal(true)}>Send Notification</AGhost>
      </div>
      <div style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.02)", padding: "8px 16px", borderRadius: 12, border: `1px solid ${AD.cardB}` }}>
        {[{ s: "BTC", p: "67,420", c: "+2.4%", up: true }, { s: "GOLD", p: "2,450", c: "+1.2%", up: true }, { s: "NAS100", p: "19,840", c: "-0.5%", up: false }].map(m => (
          <div key={m.s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: P, fontSize: 12, color: C.td, fontWeight: 600 }}>{m.s}</span>
            <span style={{ fontFamily: M, fontSize: 13, color: C.t1 }}>{m.p}</span>
            <span style={{ fontFamily: M, fontSize: 11, color: m.up ? C.buy : C.sell }}>{m.c}</span>
            <div style={{ width: 1, height: 16, background: AD.cardB, margin: "0 4px" }} />
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.buy, boxShadow: `0 0 8px ${C.buy}` }} />
          <span style={{ fontFamily: P, fontSize: 11, color: C.t2 }}>System Operational</span>
        </div>
      </div>
    </div>

    {/* Primary KPIs */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
      {r1.map(s => <SCard key={s.label} {...s} />)}
    </div>

    {/* Charts Row 1 */}
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
      <ACard style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Subscription Growth</div>
            <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>6-MONTH TREND · ALL PLANS</div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {[{ l: "VIP", c: C.brand }, { l: "Forex", c: C.gold }, { l: "Crypto", c: "#60A5FA" }].map(({ l, c }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}80` }} /><span style={{ fontFamily: P, fontSize: 12, color: C.t2, fontWeight: 500 }}>{l}</span></div>
            ))}
            <div style={{ width: 1, height: 24, background: AD.cardB, margin: "0 8px" }} />
            <ASel value="6M" onChange={() => { }} opts={[{ l: "7 Days", v: "7D" }, { l: "30 Days", v: "30D" }, { l: "6 Months", v: "6M" }]} />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_DATA} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.brand} stopOpacity={0.4} /><stop offset="95%" stopColor={C.brand} stopOpacity={0} /></linearGradient>
                <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3} /><stop offset="95%" stopColor={C.gold} stopOpacity={0} /></linearGradient>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#60A5FA" stopOpacity={0.25} /><stop offset="95%" stopColor="#60A5FA" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="m" tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="v" name="VIP" stroke={C.brand} fill="url(#gV)" strokeWidth={3} activeDot={{ r: 6, fill: C.brand, stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="f" name="Forex" stroke={C.gold} fill="url(#gF)" strokeWidth={3} activeDot={{ r: 6, fill: C.gold, stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="c" name="Crypto" stroke="#60A5FA" fill="url(#gC)" strokeWidth={3} activeDot={{ r: 6, fill: "#60A5FA", stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ACard>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ACard style={{ padding: "32px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Signal Performance</div>
              <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>ALL TIME · 286 SIGNALS</div>
            </div>
            <div style={{ fontFamily: M, fontSize: 32, fontWeight: 700, color: C.t1, letterSpacing: "-1px" }}>62<span style={{ fontSize: 16, color: C.tm }}>%</span></div>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PERF_DATA} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="v" stroke="none" cornerRadius={6}>
                  {PERF_DATA.map((e, i) => <Cell key={i} fill={e.color} style={{ filter: `drop-shadow(0 4px 12px ${e.color}40)` }} />)}
                </Pie>
                <Tooltip content={<CTooltip />} cursor={false} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
              <Activity size={24} color={C.tm} style={{ opacity: 0.5 }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid rgba(255,255,255,0.04)` }}>
            {PERF_DATA.map(e => <div key={e.n} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, boxShadow: `0 0 8px ${e.color}80` }} /><span style={{ fontFamily: P, fontSize: 12, color: C.tm, fontWeight: 500 }}>{e.n}</span></div>
              <span style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.t1 }}>{e.v}%</span>
            </div>)}
          </div>
        </ACard>
      </div>
    </div>

    {/* Secondary Info Row */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <ACard style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Revenue Analytics</div>
            <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>MONTHLY USD · SUBSCRIPTIONS</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: M, fontSize: 24, fontWeight: 700, color: C.t1 }}>$48,230</div>
              <div style={{ fontFamily: M, fontSize: 11, color: C.buy }}>+18.3% this month</div>
            </div>
            <AGhost icon={<Download size={14} />}>Export</AGhost>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 0, bottom: 0, left: -10 }} barSize={42}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="m" tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontFamily: M, fontSize: 11, fill: C.td }} axisLine={false} tickLine={false} dx={-10} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="r" name="Revenue" radius={[6, 6, 0, 0]}>
                {REVENUE_DATA.map((_, i) => <Cell key={i} fill={i === REVENUE_DATA.length - 1 ? C.gold : C.brand} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ACard>

      <ACard style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: "-0.4px", marginBottom: 4 }}>Activity Feed</div>
            <div style={{ fontFamily: M, fontSize: 11, color: C.td, letterSpacing: "0.1em" }}>LIVE · LAST 24H</div>
          </div>
          <AGhost size="sm">View All</AGhost>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {AACTIVITY.map((a, i) => <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.015)", border: `1px solid rgba(255,255,255,0.03)`, transition: "background 0.2s" }} className="a-activity-hov">
            <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${a.col}20, ${a.col}05)`, border: `1px solid ${a.col}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 12px ${a.col}10` }}>{a.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: P, fontSize: 13, color: C.t1, fontWeight: 500, marginBottom: 4 }}>{a.text}</div>
              <div style={{ fontFamily: M, fontSize: 11, color: C.td }}>{a.time}</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", cursor: "pointer" }}><ChevronRight size={14} color={C.td} /></div>
          </div>)}
        </div>
      </ACard>
    </div>

    {/* ─── PUBLISH SIGNAL MODAL ─── */}
    {signalModal && <AModal title="Publish New Signal" sub="Fill in the details below and publish or save as draft" onClose={() => setSignalModal(false)} width={700}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
          <AIn label="Asset / Pair" placeholder="e.g. BTC/USDT" value={sf.asset} onChange={v => setSf({ ...sf, asset: v })} />
          <ASel label="Category" value={sf.cat} onChange={v => setSf({ ...sf, cat: v })} opts={[{ l: "Forex", v: "Forex" }, { l: "Cryptocurrency", v: "Crypto" }, { l: "Commodity", v: "Commodity" }, { l: "Index", v: "Index" }]} />
          <ASel label="Signal Type" value={sf.type} onChange={v => setSf({ ...sf, type: v })} opts={[{ l: "Swing Trade", v: "Swing" }, { l: "Intraday", v: "Intraday" }, { l: "Scalp", v: "Scalp" }, { l: "Position", v: "Position" }]} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
          <ASel label="Direction" value={sf.dir} onChange={v => setSf({ ...sf, dir: v })} opts={[{ l: "BUY (Long) ↑", v: "BUY" }, { l: "SELL (Short) ↓", v: "SELL" }]} />
          <AIn label="Entry Price" placeholder="e.g. 67,420.00" value={sf.entry} onChange={v => setSf({ ...sf, entry: v })} />
          <AIn label="Stop Loss" placeholder="e.g. 65,800.00" value={sf.sl} onChange={v => setSf({ ...sf, sl: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13 }}>
          <AIn label="Take Profit 1" placeholder="e.g. 69,000.00" value={sf.tp1} onChange={v => setSf({ ...sf, tp1: v })} />
          <AIn label="Take Profit 2 (optional)" placeholder="e.g. 71,500.00" value={sf.tp2} onChange={v => setSf({ ...sf, tp2: v })} />
          <AIn label="Take Profit 3 (optional)" placeholder="e.g. 74,000.00" value={sf.tp3} onChange={v => setSf({ ...sf, tp3: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          <ASel label="Status" value={sf.status} onChange={v => setSf({ ...sf, status: v })} opts={[{ l: "Active (Publish Now)", v: "Active" }, { l: "Draft", v: "Draft" }, { l: "Scheduled", v: "Scheduled" }]} />
          <AIn label="Schedule Time" placeholder="e.g. Jul 24, 09:00" value={sf.schedule} onChange={v => setSf({ ...sf, schedule: v })} />
        </div>
        <ATa label="Analysis Notes (optional)" placeholder="Briefly describe the setup, key levels, and confluence…" value={sf.notes} onChange={v => setSf({ ...sf, notes: v })} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 2 }}>
          <AGhost onClick={() => setSignalModal(false)}>Cancel</AGhost>
          <AGhost icon={<FileText size={13} />} onClick={() => { setSignalModal(false); showToast("Signal saved as draft"); }}>Save Draft</AGhost>
          <APrimary icon={<Zap size={13} />} loading={signalLoading} onClick={publishSignal}>Publish Signal</APrimary>
        </div>
      </div>
    </AModal>}

    {/* ─── CREATE POST MODAL ─── */}
    {postModal && <AModal title="Create Post" sub="Publish to the mobile app Posts feed" onClose={() => setPostModal(false)} width={680}>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div style={{ border: `2px dashed ${AD.cardB}`, borderRadius: 12, height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer", background: "rgba(255,255,255,0.01)", transition: "all 0.2s" }} className="a-btn">
          <Image size={22} color={C.td} />
          <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Upload banner image</span>
          <span style={{ fontFamily: P, fontSize: 10, color: C.td }}>PNG or JPG · 1200×480px recommended</span>
        </div>
        <AIn label="Post Title" placeholder="Write a compelling headline…" value={pf.title} onChange={v => setPf({ ...pf, title: v })} />
        <ATa label="Content" placeholder="Write the post body…" value={pf.body} onChange={v => setPf({ ...pf, body: v })} rows={4} />
        <ASel label="Category" value={pf.cat} onChange={v => setPf({ ...pf, cat: v })} opts={[{ l: "Market Update", v: "Market Update" }, { l: "Education", v: "Education" }, { l: "News", v: "News" }, { l: "Announcement", v: "Announcement" }]} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          <ASel label="Publish Mode" value={pf.mode} onChange={v => setPf({ ...pf, mode: v as any })} opts={[{ l: "Publish Now", v: "publish" }, { l: "Schedule for Later", v: "schedule" }]} />
          {pf.mode === "schedule" && <AIn label="Schedule Time" placeholder="e.g. Jul 25, 09:00" value={pf.schedule} onChange={v => setPf({ ...pf, schedule: v })} />}
        </div>
        {pf.title && <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 11, padding: "16px 18px" }}>
          <div style={{ fontFamily: M, fontSize: 9, color: C.td, letterSpacing: "0.12em", marginBottom: 12 }}>PREVIEW</div>
          <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{pf.title}</div>
          <div style={{ fontFamily: P, fontSize: 12, color: C.tm, lineHeight: 1.5 }}>{pf.body || "Post content will appear here..."}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
            <span style={{ fontFamily: P, fontSize: 11, color: C.td }}>Category: {pf.cat}</span>
          </div>
        </div>}
        <div style={{ background: "rgba(128,0,255,0.06)", border: "1px solid rgba(128,0,255,0.14)", borderRadius: 11, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
          <Bell size={13} color="#C084FC" />
          <span style={{ fontFamily: P, fontSize: 11, color: C.t2 }}>Publishing will automatically send a push notification to all subscribers.</span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setPostModal(false)}>Cancel</AGhost>
          <AGhost icon={<FileText size={13} />} onClick={() => { setPostModal(false); showToast("Post saved as draft"); }}>Save Draft</AGhost>
          <APrimary icon={<BookOpen size={13} />} loading={postLoading} onClick={publishPost}>
            {pf.mode === "schedule" ? "Schedule Post" : "Publish Post"}
          </APrimary>
        </div>
      </div>
    </AModal>}

    {/* ─── SEND NOTIFICATION MODAL ─── */}
    {notifModal && <AModal title="Send Notification" sub="Deliver an instant message to your subscribers" onClose={() => setNotifModal(false)} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AIn label="Title" placeholder="e.g. New Signal — BTC/USDT" value={nf.title} onChange={v => setNf({ ...nf, title: v })} />
        <ATa label="Message" placeholder="Write the message body…" value={nf.msg} onChange={v => setNf({ ...nf, msg: v })} rows={3} />
        <ASel label="Audience" value={nf.audience} onChange={v => setNf({ ...nf, audience: v })} opts={[
          { l: "All Users (1,247)", v: "All Users" }, { l: "VIP Members (384)", v: "VIP Users" },
          { l: "Forex Members (521)", v: "Forex Users" }, { l: "Crypto Members (289)", v: "Crypto Users" },
        ]} />
        <AIn label="Schedule Time (optional)" placeholder="Leave empty to send now" value={nf.schedule} onChange={v => setNf({ ...nf, schedule: v })} />
        {(nf.title || nf.msg) && <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 11, padding: "16px 18px" }}>
          <div style={{ fontFamily: M, fontSize: 9, color: C.td, letterSpacing: "0.12em", marginBottom: 12 }}>PREVIEW</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg,${C.brand},${C.brandH})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Activity size={18} color="#fff" /></div>
            <div>
              <div style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{nf.title || "Notification Title"}</div>
              <div style={{ fontFamily: P, fontSize: 12, color: C.tm, lineHeight: 1.45 }}>{nf.msg || "Your message here."}</div>
            </div>
          </div>
        </div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setNotifModal(false)}>Cancel</AGhost>
          <AGhost icon={<Calendar size={14} />} onClick={() => { setNotifModal(false); showToast("Notification scheduled"); }}>Schedule</AGhost>
          <APrimary icon={<Send size={14} />} loading={notifLoading} onClick={sendNotif}>Send Now</APrimary>
        </div>
      </div>
    </AModal>}
  </div>;
}
