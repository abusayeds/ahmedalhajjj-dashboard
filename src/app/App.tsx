import { useState, useEffect } from "react";
import {
  Zap, Bell, BookOpen, BarChart2, TrendingUp, TrendingDown,
  CheckCircle, Heart, MessageCircle, Eye, EyeOff, ArrowLeft,
  ChevronRight, User, Settings, Shield, HelpCircle, LogOut,
  Activity, Award, Mail, Lock, Globe, Star, AlertCircle,
  SlidersHorizontal, XCircle, MinusCircle, Share2, Search, Send,
  CreditCard, Smartphone, Sparkles, Crown, X,
  Plus, Pencil, Trash2, MoreHorizontal, Download, ChevronDown,
  ChevronLeft, DollarSign, Calendar, Tag, FileText, Users,
  ToggleLeft, ToggleRight, Check, Image, PieChart as PieIcon,
  TrendingUp as TUp, ExternalLink, Percent, RefreshCw, Filter
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0B14", bg2: "#161221", surface: "#1E1930", card: "#26203A",
  brand: "#8000FF", brandH: "#9333FF",
  gold: "#BFA06D", goldL: "#D7C48D",
  t1: "#FFFFFF", t2: "#C7C3D5", tm: "#8E8A9E", td: "#6D687B",
  buy: "#00D084", sell: "#FF5A6B", active: "#7C3AED", closed: "#64748B",
  border: "rgba(255,255,255,0.08)", borderM: "rgba(255,255,255,0.13)",
} as const;
const P = "'Poppins', system-ui, sans-serif";
const M = "'JetBrains Mono', 'Fira Code', monospace";


// ════════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD — Premium SaaS
// ════════════════════════════════════════════════════════════════════════════════

type AdminSection = "dashboard" | "signals" | "posts" | "notifications" | "subscriptions" | "users" | "coupons" | "settings";

// ─── Admin palette ────────────────────────────────────────────────────────────
const AD = {
  bg: "#07051A", nav: "#09071E",
  card: "rgba(255,255,255,0.032)", cardB: "rgba(255,255,255,0.07)",
  th: "rgba(255,255,255,0.025)", rowHov: "rgba(128,0,255,0.068)",
  inp: "rgba(255,255,255,0.038)", inpB: "rgba(255,255,255,0.08)",
} as const;

// ─── Admin data ───────────────────────────────────────────────────────────────
const GROWTH_DATA = [
  { m: "Feb", v: 280, f: 380, c: 210 }, { m: "Mar", v: 310, f: 420, c: 235 },
  { m: "Apr", v: 340, f: 460, c: 255 }, { m: "May", v: 360, f: 490, c: 265 },
  { m: "Jun", v: 370, f: 510, c: 278 }, { m: "Jul", v: 384, f: 521, c: 289 },
];
const REVENUE_DATA = [
  { m: "Feb", r: 32400 }, { m: "Mar", r: 36800 }, { m: "Apr", r: 40200 },
  { m: "May", r: 43100 }, { m: "Jun", r: 45800 }, { m: "Jul", r: 48230 },
];
const PERF_DATA = [
  { n: "Win", v: 62, color: C.buy }, { n: "Loss", v: 18, color: C.sell }, { n: "BE", v: 20, color: "#64748B" },
];
const ASIGNALS = [
  { id: 1, asset: "BTC/USDT", cat: "Crypto", type: "Swing", dir: "BUY" as const, entry: "67,420.00", sl: "65,800.00", tp1: "69,000.00", tp2: "71,500.00", tp3: "74,000.00", status: "Active", pub: "Jul 23 · 09:15" },
  { id: 2, asset: "GOLD/USD", cat: "Commodity", type: "Intraday", dir: "BUY" as const, entry: "2,847.00", sl: "2,820.00", tp1: "2,875.00", tp2: "2,900.00", tp3: "2,930.00", status: "Active", pub: "Jul 23 · 11:00" },
  { id: 3, asset: "EUR/USD", cat: "Forex", type: "Swing", dir: "SELL" as const, entry: "1.0842", sl: "1.0880", tp1: "1.0810", tp2: "1.0775", tp3: "1.0740", status: "Active", pub: "Jul 23 · 13:30" },
  { id: 4, asset: "NAS100", cat: "Index", type: "Scalp", dir: "BUY" as const, entry: "19,840.00", sl: "19,600.00", tp1: "20,100.00", tp2: "20,400.00", tp3: "—", status: "Closed", pub: "Jul 22 · 08:00" },
  { id: 5, asset: "GBP/JPY", cat: "Forex", type: "Swing", dir: "BUY" as const, entry: "196.84", sl: "195.50", tp1: "198.20", tp2: "199.50", tp3: "—", status: "Active", pub: "Jul 21 · 14:00" },
  { id: 6, asset: "ETH/USDT", cat: "Crypto", type: "Intraday", dir: "SELL" as const, entry: "3,280.00", sl: "3,350.00", tp1: "3,200.00", tp2: "3,150.00", tp3: "3,080.00", status: "Draft", pub: "—" },
  { id: 7, asset: "SPX500", cat: "Index", type: "Swing", dir: "SELL" as const, entry: "5,842.00", sl: "5,890.00", tp1: "5,800.00", tp2: "5,760.00", tp3: "—", status: "Scheduled", pub: "Jul 24 · 09:00" },
];
const APOSTS = [
  { id: 1, img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=64&h=40&fit=crop&auto=format", title: "Bitcoin Reclaims Key $67K Level", cat: "Market Update", likes: 142, comments: 28, date: "Jul 23", status: "Published" },
  { id: 2, img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=64&h=40&fit=crop&auto=format", title: "Understanding Risk-to-Reward Ratios", cat: "Education", likes: 89, comments: 14, date: "Jul 22", status: "Published" },
  { id: 3, img: "https://images.unsplash.com/photo-1591033594798-33227a05780d?w=64&h=40&fit=crop&auto=format", title: "Fed Signals No Rate Cuts Before Q4", cat: "News", likes: 67, comments: 19, date: "Jul 21", status: "Published" },
  { id: 4, img: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=64&h=40&fit=crop&auto=format", title: "Premium Signal Alerts — Now Live", cat: "Announcement", likes: 203, comments: 41, date: "Jul 20", status: "Published" },
  { id: 5, img: "", title: "Weekly Market Recap — Jul 21", cat: "Education", likes: 0, comments: 0, date: "—", status: "Draft" },
];
const AUSERS = [
  { id: 1, init: "AK", name: "Alex Kim", email: "alex.kim@email.com", plan: "VIP", status: "Active", trial: false, signals: 47, posts: 23, likes: 89, comments: 34, joined: "Jan 12, 2026", renewal: "Aug 12, 2026" },
  { id: 2, init: "SC", name: "Sarah Chen", email: "sarah.c@email.com", plan: "Forex", status: "Active", trial: false, signals: 31, posts: 14, likes: 52, comments: 18, joined: "Feb 3, 2026", renewal: "Aug 3, 2026" },
  { id: 3, init: "JT", name: "James Torres", email: "j.torres@email.com", plan: "Crypto", status: "Trial", trial: true, signals: 8, posts: 3, likes: 11, comments: 4, joined: "Jul 21, 2026", renewal: "Jul 23, 2026" },
  { id: 4, init: "ML", name: "Mia Laurent", email: "mia.l@email.com", plan: "VIP", status: "Active", trial: false, signals: 62, posts: 40, likes: 128, comments: 67, joined: "Mar 18, 2026", renewal: "Sep 18, 2026" },
  { id: 5, init: "OK", name: "Omar Khalil", email: "omar.k@email.com", plan: "Forex", status: "Expired", trial: false, signals: 19, posts: 7, likes: 28, comments: 9, joined: "Apr 5, 2026", renewal: "Jul 5, 2026" },
  { id: 6, init: "PN", name: "Priya Nair", email: "priya.n@email.com", plan: "Crypto", status: "Active", trial: false, signals: 28, posts: 11, likes: 44, comments: 15, joined: "May 22, 2026", renewal: "Aug 22, 2026" },
  { id: 7, init: "TB", name: "Tom Banks", email: "tom.b@email.com", plan: "VIP", status: "Suspended", trial: false, signals: 3, posts: 1, likes: 5, comments: 2, joined: "Jun 1, 2026", renewal: "—" },
];
const ANOTIFS = [
  { id: 1, title: "High Impact News Today", audience: "All Users", sent: "Jul 23, 14:30", reach: 1247, opened: 892 },
  { id: 2, title: "New BTC Signal Published", audience: "VIP Users", sent: "Jul 23, 09:15", reach: 384, opened: 301 },
  { id: 3, title: "Weekly Performance Report", audience: "All Users", sent: "Jul 21, 12:00", reach: 1247, opened: 743 },
  { id: 4, title: "Forex Signal Update", audience: "Forex Users", sent: "Jul 20, 16:00", reach: 521, opened: 389 },
];
const ACOUPONS = [
  { code: "ELITE50", discount: "50%", expiry: "Jul 31, 2026", limit: 100, used: 67, status: "Active" },
  { code: "VIPFREE", discount: "100%", expiry: "Jul 25, 2026", limit: 10, used: 10, status: "Exhausted" },
  { code: "FOREX20", discount: "20%", expiry: "Aug 15, 2026", limit: 200, used: 43, status: "Active" },
  { code: "CRYPTO30", discount: "30%", expiry: "Aug 1, 2026", limit: 50, used: 12, status: "Active" },
];
const AACTIVITY = [
  { icon: "💳", text: "Alex Kim purchased VIP Plan", time: "2m ago", col: C.gold },
  { icon: "⚡", text: "New signal published — BTC/USDT BUY", time: "15m ago", col: C.buy },
  { icon: "📰", text: "Post published — Bitcoin Reclaims $67K", time: "1h ago", col: "#B57AFF" },
  { icon: "🆓", text: "James Torres started Free Trial", time: "2h ago", col: C.brand },
  { icon: "🎟", text: "Coupon ELITE50 redeemed by Sarah Chen", time: "3h ago", col: C.gold },
  { icon: "🔄", text: "Mia Laurent renewed Forex Plan", time: "5h ago", col: C.buy },
];

// ─── Admin components ─────────────────────────────────────────────────────────

function Chip({ label, type }: { label: string; type: "ok" | "warn" | "err" | "muted" | "brand" | "gold" | "info" | "draft" | "expired" }) {
  const s: Record<string, [string, string, string]> = {
    ok: ["rgba(0,208,132,0.12)", C.buy, "🟢"],
    warn: ["rgba(245,158,11,0.12)", "#F59E0B", "🟡"],
    err: ["rgba(255,90,107,0.12)", C.sell, "🔴"],
    muted: ["rgba(100,116,139,0.12)", "#94A3B8", "⚪"],
    brand: ["rgba(128,0,255,0.12)", "#C084FC", "🟣"],
    gold: ["rgba(191,160,109,0.12)", C.gold, "🟡"],
    info: ["rgba(59,130,246,0.12)", "#60A5FA", "🔵"],
    draft: ["rgba(245,158,11,0.12)", "#F59E0B", "🟡"],
    expired: ["rgba(249,115,22,0.12)", "#F97316", "🟠"],
  };
  const [bg, color, emoji] = s[type] || s.muted;
  // Ensure we map standard string labels to emojis if missing in our logic elsewhere
  let displayEmoji = emoji;
  if (label === "Draft") displayEmoji = "🟡";
  if (label === "Closed") displayEmoji = "🔴";
  if (label === "Suspended") displayEmoji = "⚪";

  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: bg, color, border: `1px solid ${color}25`, borderRadius: 100, padding: "5px 12px", fontFamily: P, fontSize: 11.5, fontWeight: 500, boxShadow: `0 0 12px ${color}15`, whiteSpace: "nowrap" }}>{displayEmoji} {label}</span>;
}

function APrimary({ children, onClick, icon, size = "md", disabled = false }: { children?: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; size?: "sm" | "md"; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="a-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: size === "sm" ? "6px 14px" : "9px 18px", background: `linear-gradient(135deg,${C.brand},${C.brandH})`, border: "none", borderRadius: 9, fontFamily: P, fontSize: size === "sm" ? 11 : 12, fontWeight: 600, color: "#fff", cursor: disabled ? "not-allowed" : "pointer", boxShadow: `0 4px 14px ${C.brand}35`, opacity: disabled ? 0.5 : 1, transition: "all 0.15s", whiteSpace: "nowrap" }}>{icon}{children}</button>;
}

function AGhost({ children, onClick, icon, size = "md", danger = false }: { children?: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; size?: "sm" | "md"; danger?: boolean }) {
  return <button onClick={onClick} className="a-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: size === "sm" ? "6px 13px" : "8px 16px", background: "transparent", border: `1px solid ${danger ? "rgba(255,90,107,0.28)" : AD.cardB}`, borderRadius: 9, fontFamily: P, fontSize: size === "sm" ? 11 : 12, fontWeight: 500, color: danger ? C.sell : C.t2, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>{icon}{children}</button>;
}

function AIn({ label, value, onChange, placeholder, type = "text" }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>{label}</span>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="a-input" style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "9px 13px", fontFamily: P, fontSize: 13, color: C.t1, outline: "none", caretColor: C.brand, transition: "all 0.18s" }} />
  </label>;
}

function ATa({ label, value, onChange, placeholder, rows = 3 }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>{label}</span>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="a-input" style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "9px 13px", fontFamily: P, fontSize: 13, color: C.t1, outline: "none", caretColor: C.brand, resize: "vertical", transition: "all 0.18s" }} />
  </label>;
}

function ASel({ label, value, onChange, opts }: { label?: string; value: string; onChange: (v: string) => void; opts: { l: string; v: string }[] }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>{label}</span>}
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "9px 13px", fontFamily: P, fontSize: 13, color: C.t1, outline: "none", cursor: "pointer", appearance: "none" }}>
      {opts.map(o => <option key={o.v} value={o.v} style={{ background: "#110F20" }}>{o.l}</option>)}
    </select>
  </label>;
}

function ATog({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <div onClick={() => onChange(!on)} style={{ width: 42, height: 22, borderRadius: 100, background: on ? C.brand : "rgba(255,255,255,0.08)", border: `1px solid ${on ? C.brand : AD.cardB}`, cursor: "pointer", position: "relative", transition: "all 0.2s", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
  </div>;
}

function AModal({ title, sub, onClose, children, width = 580 }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  return <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(14px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ background: "#0F0C20", border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 20, width, maxWidth: "96vw", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: `0 40px 100px rgba(0,0,0,0.7),0 0 0 1px ${C.brand}1A` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${AD.cardB}`, background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1, letterSpacing: "-0.2px" }}>{title}</div>
          {sub && <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>{sub}</div>}
        </div>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: AD.inp, border: `1px solid ${AD.cardB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={13} color={C.tm} /></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>{children}</div>
    </div>
  </div>;
}

function ACard({ children, style = {}, hover = false }: { children: React.ReactNode; style?: React.CSSProperties; hover?: boolean }) {
  return <div className={hover ? "a-card-hov" : ""} style={{ background: AD.card, backdropFilter: "blur(20px)", border: `1px solid ${AD.cardB}`, borderRadius: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.4),0 8px 24px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.04)", ...style }}>{children}</div>;
}

function CTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return <div style={{ background: "rgba(12,10,28,0.97)", border: `1px solid ${AD.cardB}`, borderRadius: 11, padding: "10px 14px", backdropFilter: "blur(20px)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
    {label && <div style={{ fontFamily: P, fontSize: 10, color: C.td, marginBottom: 7, letterSpacing: "0.05em" }}>{label}</div>}
    {payload.map((p: any, i: number) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color || p.fill }} />
      <span style={{ fontFamily: P, fontSize: 11, color: C.tm, minWidth: 46 }}>{p.name}</span>
      <span style={{ fontFamily: M, fontSize: 11, color: C.t1, fontWeight: 600, marginLeft: "auto" }}>{typeof p.value === "number" && p.dataKey === "r" ? `$${p.value.toLocaleString()}` : String(p.value)}</span>
    </div>)}
  </div>;
}

function SCard({ label, value, change, icon: Icon, color, note, sparkline }: { label: string; value: string; change?: string; icon: React.ElementType; color: string; note?: string; sparkline?: any[] }) {
  const pos = change?.startsWith("+");
  return <ACard style={{ padding: "24px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 16 }} hover>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg,${color},${color}00)`, opacity: 0.8 }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${color}22, ${color}05)`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 24px ${color}15`, backdropFilter: "blur(10px)" }}>
          <Icon size={24} color={color} style={{ filter: `drop-shadow(0 2px 8px ${color}40)` }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontFamily: P, fontSize: 13, color: C.tm, fontWeight: 500 }}>{label}</div>
          <div style={{ fontFamily: M, fontSize: 28, fontWeight: 700, color: C.t1, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
        </div>
      </div>
      {change && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: pos ? "rgba(0,208,132,0.12)" : "rgba(255,90,107,0.12)", padding: "6px 10px", borderRadius: 100, border: `1px solid ${pos ? "rgba(0,208,132,0.25)" : "rgba(255,90,107,0.25)"}` }}>
          {pos ? <TUp size={14} color={C.buy} /> : <TrendingDown size={14} color={C.sell} />}
          <span style={{ fontFamily: M, fontSize: 11, fontWeight: 600, color: pos ? C.buy : C.sell }}>{change}</span>
        </div>
      )}
    </div>
    {(note || sparkline) && (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>
        <div style={{ fontFamily: P, fontSize: 11.5, color: C.td }}>{note}</div>
        {sparkline && (
          <div style={{ width: 80, height: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline}>
                <defs>
                  <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.4} /><stop offset="95%" stopColor={color} stopOpacity={0} /></linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} fill={`url(#spark-${color.replace('#', '')})`} strokeWidth={2} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    )}
  </ACard>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AdminNav({ section, onChange }: { section: AdminSection; onChange: (s: AdminSection) => void }) {
  const groups: [string, [AdminSection, React.ElementType, string][]][] = [
    ["OVERVIEW", [["dashboard", BarChart2, "Dashboard"]]],
    ["MANAGE", [["signals", Zap, "Signals"], ["posts", BookOpen, "Posts"], ["notifications", Bell, "Notifications"]]],
    ["SYSTEM", [["subscriptions", CreditCard, "Subscriptions"], ["users", Users, "Users"], ["coupons", Tag, "Coupons"], ["settings", Settings, "Settings"]]],
  ];
  return <nav style={{ width: 280, height: "100vh", background: AD.nav, borderRight: `1px solid ${AD.cardB}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, zIndex: 200 }}>
    {/* Logo */}
    <div style={{ padding: "16px 20px 16px", display: "flex", flexDirection: "column", gap: 8, borderBottom: `1px solid ${AD.cardB}` }}>
      <img src="/logo.jpg" alt="Elite Trading Logo" style={{ width: 80, margin: "auto", height: "auto", objectFit: "contain" }} />
    </div>
    {/* Nav groups */}
    <div style={{ flex: 1, padding: "24px 16px", overflowY: "auto", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: 24 }}>
      {groups.map(([grp, items]) => <div key={grp} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: M, fontSize: 10, fontWeight: 600, color: C.td, letterSpacing: "0.1em", padding: "0 12px", marginBottom: 4 }}>{grp}</div>
        {items.map(([id, Icon, lbl]) => {
          const on = section === id;
          return <button key={id} onClick={() => onChange(id)} className="a-nav-item" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", borderRadius: 8, background: on ? "rgba(128,0,255,0.08)" : "transparent", color: on ? C.t1 : C.t2, border: `1px solid ${on ? "rgba(128,0,255,0.15)" : "transparent"}`, cursor: "pointer", textAlign: "left", fontFamily: P, fontSize: 14, fontWeight: on ? 600 : 500, transition: "all 0.2s", position: "relative" }}>
            {on && <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: C.brand, borderRadius: "0 4px 4px 0", boxShadow: `0 0 10px ${C.brand}` }} />}
            <Icon size={18} color={on ? C.brand : C.td} style={{ transition: "color 0.2s" }} />{lbl}
            {on && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.brand, boxShadow: `0 0 8px ${C.brand}` }} />}
          </button>;
        })}
      </div>)}
    </div>
    {/* Admin user */}
    <div style={{ padding: "24px", borderTop: `1px solid ${AD.cardB}`, background: "rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "8px", borderRadius: 8, transition: "background 0.2s" }} className="a-nav-user-hov">
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${C.gold}40,${C.goldL}20)`, border: `1px solid ${C.gold}30`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          <span style={{ fontFamily: P, fontSize: 13, fontWeight: 700, color: C.gold }}>AA</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 2 }}>Ahmed Alhajji</div>
          <div style={{ fontFamily: P, fontSize: 12, color: C.td, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Administrator</div>
        </div>
        <Settings size={16} color={C.td} />
      </div>
    </div>
  </nav>;
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function AdminTopBar({ section }: { section: AdminSection }) {
  const titles: Record<AdminSection, [string, string]> = {
    dashboard: ["Overview", "Monitor key metrics and system performance"],
    signals: ["Signals", "Manage and publish trading signals"],
    posts: ["Posts", "Content and announcement management"],
    notifications: ["Notifications", "Push notification center"],
    subscriptions: ["Subscriptions", "Plans and billing management"],
    users: ["Users", "Member management and CRM"],
    coupons: ["Coupons", "Promotions and discounts"],
    settings: ["Settings", "System configuration and preferences"],
  };
  const [title, subtitle] = titles[section];
  const [q, setQ] = useState("");
  const now = new Date();
  const tStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return <div style={{ height: 80, background: "rgba(7,5,26,0.85)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${AD.cardB}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", flexShrink: 0, position: "sticky", top: 0, zIndex: 100 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontFamily: P, fontSize: 24, fontWeight: 700, color: C.t1, letterSpacing: "-0.5px" }}>{title}</div>
      <div style={{ fontFamily: P, fontSize: 13, color: C.tm }}>{subtitle}</div>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.02)", border: `1px solid ${AD.inpB}`, borderRadius: 12, padding: "10px 16px", width: 280, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)", transition: "all 0.2s" }} className="a-search-focus">
        <Search size={16} color={C.tm} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search everything..." style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 14, color: C.t1, width: "100%" }} />
        <div style={{ display: "flex", gap: 4 }}>
          <kbd style={{ fontFamily: M, fontSize: 10, background: "rgba(255,255,255,0.1)", color: C.tm, padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>⌘</kbd>
          <kbd style={{ fontFamily: M, fontSize: 10, background: "rgba(255,255,255,0.1)", color: C.tm, padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>K</kbd>
        </div>
      </div>

      <div style={{ width: 1, height: 24, background: AD.cardB }} />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: M, fontSize: 12, color: C.td, letterSpacing: "0.05em", textAlign: "right" }}>
          <div>{tStr}</div>
          <div style={{ fontSize: 10, marginTop: 2 }}>Jul 23, 2026</div>
        </div>

        <div style={{ position: "relative", cursor: "pointer", width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.06)`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} className="a-icon-btn-hov">
          <Bell size={20} color={C.t2} />
          <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: C.sell, border: `2px solid ${AD.nav}`, boxShadow: `0 0 8px ${C.sell}` }} />
        </div>
      </div>
    </div>
  </div>;
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────

function ADashboard() {
  const SPARK1 = [{ v: 10 }, { v: 15 }, { v: 13 }, { v: 20 }, { v: 18 }, { v: 25 }];
  const SPARK2 = [{ v: 25 }, { v: 20 }, { v: 22 }, { v: 15 }, { v: 18 }, { v: 10 }];
  const SPARK3 = [{ v: 5 }, { v: 10 }, { v: 8 }, { v: 15 }, { v: 12 }, { v: 20 }];

  const r1: Parameters<typeof SCard>[0][] = [
    { label: "Total Subscribers", value: "1,247", change: "+12.4%", icon: Users, color: C.brand, sparkline: SPARK1 },
    { label: "Active VIP Members", value: "384", change: "+8.2%", icon: Crown, color: C.gold, sparkline: SPARK1 },
    { label: "Forex Subscribers", value: "521", change: "+15.1%", icon: TrendingUp, color: C.buy, sparkline: SPARK3 },
    { label: "Crypto Subscribers", value: "289", change: "+6.7%", icon: Zap, color: "#60A5FA", sparkline: SPARK1 },
  ];

  return <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32 }}>

    {/* Top Actions & Market Overview Row */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <APrimary icon={<Zap size={16} />}>Publish Signal</APrimary>
        <AGhost icon={<BookOpen size={16} />}>Create Post</AGhost>
        <AGhost icon={<Bell size={16} />}>Send Notification</AGhost>
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
  </div>;
}

// ─── Signals ──────────────────────────────────────────────────────────────────

function ASignals() {
  const [filter, setFilter] = useState("All");
  const [pubModal, setPubModal] = useState(false);
  const [closeTarget, setCloseTarget] = useState<typeof ASIGNALS[0] | null>(null);
  const [form, setForm] = useState({ asset: "", cat: "Forex", type: "Swing", dir: "BUY", entry: "", sl: "", tp1: "", tp2: "", tp3: "", notes: "" });
  const [closeRes, setCloseRes] = useState("Win");
  const [closePnl, setClosePnl] = useState("");
  const tabs = ["All", "Active", "Draft", "Scheduled", "Closed"];
  const filtered = ASIGNALS.filter(s => filter === "All" || s.status === filter);
  const dCol = (d: string) => d === "BUY" ? C.buy : C.sell;
  const sChip = (s: string) => {
    const m: Record<string, "ok" | "brand" | "info" | "muted" | "err" | "draft"> = { Active: "ok", Draft: "draft", Scheduled: "info", Closed: "err" };
    return <Chip label={s} type={m[s] || "muted"} />;
  };
  const COLS = "minmax(180px,1.5fr) 100px 90px 110px 110px 110px 110px 110px 140px 130px 120px";
  const HEAD = ["ASSET", "TYPE", "DIR", "ENTRY", "SL", "TP1", "TP2", "TP3", "STATUS", "PUBLISHED", "ACTIONS"];
  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Signals</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{ASIGNALS.length} TOTAL · {ASIGNALS.filter(s => s.status === "Active").length} ACTIVE</div>
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
        <APrimary onClick={() => setPubModal(true)} icon={<Plus size={14} />}>Publish Signal</APrimary>
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
            <div style={{ display: "flex", gap: 8 }}>
              <button className="a-btn" title="Edit" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}><Pencil size={15} color={C.t2} /></button>
              {s.status === "Active" && <button className="a-btn" title="Close" onClick={() => setCloseTarget(s)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(191,160,109,0.08)", border: "1px solid rgba(191,160,109,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>🔒</button>}
              <button className="a-btn" title="Delete" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}><Trash2 size={15} color={C.sell} /></button>
            </div>
          </div>)}
        </div>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
        <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {filtered.length} of {ASIGNALS.length} records</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.t2, fontFamily: P, fontSize: 13, fontWeight: 600 }}>2</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </ACard>
    {pubModal && <AModal title="Publish New Signal" sub="Fill in the details below and publish or save as draft" onClose={() => setPubModal(false)} width={700}>
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
        <ATa label="Analysis Notes (optional)" placeholder="Briefly describe the setup, key levels, and confluence…" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 2 }}>
          <AGhost onClick={() => setPubModal(false)}>Cancel</AGhost>
          <AGhost icon={<FileText size={13} />}>Save Draft</AGhost>
          <APrimary icon={<Zap size={13} />} onClick={() => setPubModal(false)}>Publish Signal</APrimary>
        </div>
      </div>
    </AModal>}
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
          <APrimary icon={<Check size={13} />} onClick={() => setCloseTarget(null)}>Confirm & Close</APrimary>
        </div>
      </div>
    </AModal>}
  </div>;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

function APosts() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", cat: "Market Update" });
  const catCol: Record<string, string> = { "Market Update": C.gold, "Education": "#C084FC", "News": "#60A5FA", "Announcement": C.buy };
  const COLS = "80px minmax(280px, 1fr) 160px 120px 120px 120px 160px 120px";
  const HEAD = ["COVER", "TITLE", "CATEGORY", "LIKES", "COMMENTS", "DATE", "STATUS", "ACTIONS"];

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Posts</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{APOSTS.length} TOTAL · {APOSTS.filter(p => p.status === "Published").length} PUBLISHED</div>
      </div>
    </div>

    <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 300 }}>
          <Search size={14} color={C.td} />
          <input placeholder="Search posts..." style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }} />
        </div>
        <div style={{ width: 1, height: 24, background: AD.cardB }} />
        <ASel value="All Categories" onChange={() => { }} opts={[{ l: "All Categories", v: "All Categories" }, { l: "Market Update", v: "Market Update" }, { l: "Education", v: "Education" }, { l: "News", v: "News" }]} />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AGhost icon={<RefreshCw size={14} />}>Refresh</AGhost>
        <APrimary onClick={() => setModal(true)} icon={<Plus size={14} />}>Create Post</APrimary>
      </div>
    </ACard>

    <ACard>
      <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderRadius: "18px 18px 0 0", borderBottom: `1px solid ${AD.cardB}` }}>
        {HEAD.map(h => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
      </div>
      {APOSTS.map((post, i) => <div key={post.id} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "24px 28px", borderBottom: i < APOSTS.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
        <div style={{ width: 64, height: 44, borderRadius: 10, background: C.surface, overflow: "hidden", flexShrink: 0 }}>
          {post.img ? <img src={post.img} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Image size={18} color={C.td} /></div>}
        </div>
        <div style={{ paddingRight: 24 }}>
          <div style={{ fontFamily: P, fontSize: 15, fontWeight: 600, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>{post.title}</div>
        </div>
        <span style={{ fontFamily: P, fontSize: 13, color: catCol[post.cat] || C.tm }}>{post.cat}</span>
        <span style={{ fontFamily: M, fontSize: 14, color: C.t2 }}>{post.likes}</span>
        <span style={{ fontFamily: M, fontSize: 14, color: C.t2 }}>{post.comments}</span>
        <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{post.date}</span>
        <div><Chip label={post.status} type={post.status === "Published" ? "ok" : "draft"} /></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="a-btn" title="Edit" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}><Pencil size={15} color={C.t2} /></button>
          <button className="a-btn" title="Delete" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}><Trash2 size={15} color={C.sell} /></button>
        </div>
      </div>)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
        <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {APOSTS.length} of {APOSTS.length} records</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </ACard>
    {modal && <AModal title="Create Post" sub="Publish to the mobile app Posts feed" onClose={() => setModal(false)} width={680}>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div style={{ border: `2px dashed ${AD.cardB}`, borderRadius: 12, height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer", background: "rgba(255,255,255,0.01)" }}>
          <Image size={22} color={C.td} />
          <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Upload banner image</span>
          <span style={{ fontFamily: P, fontSize: 10, color: C.td }}>PNG or JPG · 1200×480px recommended</span>
        </div>
        <AIn label="Post Title" placeholder="Write a compelling headline…" value={form.title} onChange={v => setForm({ ...form, title: v })} />
        <ATa label="Content" placeholder="Write the post body…" value={form.body} onChange={v => setForm({ ...form, body: v })} rows={4} />
        <ASel label="Category" value={form.cat} onChange={v => setForm({ ...form, cat: v })} opts={[{ l: "Market Update", v: "Market Update" }, { l: "Education", v: "Education" }, { l: "News", v: "News" }, { l: "Announcement", v: "Announcement" }]} />
        <div style={{ background: "rgba(128,0,255,0.06)", border: "1px solid rgba(128,0,255,0.14)", borderRadius: 11, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
          <Bell size={13} color="#C084FC" />
          <span style={{ fontFamily: P, fontSize: 11, color: C.t2 }}>Publishing will automatically send a push notification to all subscribers.</span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setModal(false)}>Cancel</AGhost>
          <AGhost icon={<FileText size={13} />}>Save Draft</AGhost>
          <APrimary icon={<BookOpen size={13} />} onClick={() => setModal(false)}>Publish Post</APrimary>
        </div>
      </div>
    </AModal>}
  </div>;
}

// ─── Notifications ────────────────────────────────────────────────────────────

function ANotifications() {
  const [form, setForm] = useState({ title: "", msg: "", audience: "All Users" });
  const [sent, setSent] = useState(false);
  const audOpts = [
    { l: "All Users (1,247)", v: "All Users" }, { l: "VIP Members (384)", v: "VIP Users" },
    { l: "Forex Members (521)", v: "Forex Users" }, { l: "Crypto Members (289)", v: "Crypto Users" },
    { l: "Trial Users (53)", v: "Trial Users" },
  ];
  const COLS = "minmax(200px,1fr) 140px 140px 100px 120px";
  const HEAD = ["TITLE", "AUDIENCE", "SENT", "REACH", "OPEN RATE"];

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Push Notifications</h2>
      <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>SEND · SCHEDULE · HISTORY</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "440px 1fr", gap: 24, alignItems: "start" }}>
      <ACard style={{ padding: "24px 28px" }}>
        <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Send Notification</div>
        <div style={{ fontFamily: P, fontSize: 12, color: C.tm, marginBottom: 20 }}>Deliver an instant message to your subscribers.</div>
        {sent ? <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><CheckCircle size={28} color={C.buy} /></div>
          <div style={{ fontFamily: P, fontSize: 15, fontWeight: 600, color: C.buy, marginBottom: 6 }}>Notification Sent</div>
          <div style={{ fontFamily: P, fontSize: 13, color: C.tm, marginBottom: 20 }}>Delivered to {form.audience}</div>
          <AGhost onClick={() => { setSent(false); setForm({ title: "", msg: "", audience: "All Users" }); }}>Send Another</AGhost>
        </div> : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AIn label="Title" placeholder="e.g. New Signal — BTC/USDT" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <ATa label="Message" placeholder="Write the message body…" value={form.msg} onChange={v => setForm({ ...form, msg: v })} rows={3} />
          <ASel label="Audience" value={form.audience} onChange={v => setForm({ ...form, audience: v })} opts={audOpts} />
          {(form.title || form.msg) && <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 11, padding: "16px 18px", marginTop: 8 }}>
            <div style={{ fontFamily: M, fontSize: 9, color: C.td, letterSpacing: "0.12em", marginBottom: 12 }}>PREVIEW</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg,${C.brand},${C.brandH})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Activity size={18} color="#fff" /></div>
              <div>
                <div style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{form.title || "Notification Title"}</div>
                <div style={{ fontFamily: P, fontSize: 12, color: C.tm, lineHeight: 1.45 }}>{form.msg || "Your message here."}</div>
              </div>
            </div>
          </div>}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <APrimary icon={<Bell size={14} />} onClick={() => setSent(true)}>Send Now</APrimary>
            <AGhost icon={<Calendar size={14} />}>Schedule</AGhost>
          </div>
        </div>}
      </ACard>

      <ACard>
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1 }}>Notification History</div>
          <div style={{ display: "flex", gap: 8 }}>
            <AGhost icon={<Filter size={13} />} size="sm">Filter</AGhost>
          </div>
        </div>
        <div className="a-tscroll" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 600 }}>
            <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderBottom: `1px solid ${AD.cardB}` }}>
              {HEAD.map(h => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
            </div>
            {ANOTIFS.map((n, i) => <div key={n.id} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "20px 28px", borderBottom: i < ANOTIFS.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
              <span style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: C.t1 }}>{n.title}</span>
              <span style={{ fontFamily: P, fontSize: 12, color: C.tm }}>{n.audience}</span>
              <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{n.sent}</span>
              <span style={{ fontFamily: M, fontSize: 13, color: C.t2 }}>{n.reach.toLocaleString()}</span>
              <div>
                <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: C.buy, marginBottom: 2 }}>{Math.round((n.opened / n.reach) * 100)}%</div>
                <div style={{ fontFamily: P, fontSize: 11, color: C.td }}>{n.opened.toLocaleString()} opened</div>
              </div>
            </div>)}
          </div>
        </div>
      </ACard>
    </div>
  </div>;
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

function ASubscriptions() {
  const [trialOn, setTrialOn] = useState(true);
  const [earlyOn, setEarlyOn] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const plans = [
    { id: "vip", name: "VIP Plan", emoji: "👑", monthly: "79", yearly: "699", color: C.brand, subs: 384, status: "Active", features: ["All Forex Signals", "All Crypto Signals", "Gold & Commodities", "Index Signals", "Priority Push Alerts", "VIP Community", "Q&A Sessions", "Weekly Reports"], updated: "2 days ago", created: "Jan 12, 2026" },
    { id: "forex", name: "Forex Pro", emoji: "💱", monthly: "49", yearly: "469", color: C.gold, subs: 521, status: "Active", features: ["All Forex Signals", "Gold & Commodities", "Push Alerts", "Community Access", "Weekly Recap"], updated: "1 week ago", created: "Jan 15, 2026" },
    { id: "crypto", name: "Crypto Pro", emoji: "₿", monthly: "39", yearly: "369", color: "#60A5FA", subs: 289, status: "Hidden", features: ["All Crypto Signals", "Altcoin Alerts", "Push Alerts", "Community Access", "Weekly Recap"], updated: "3 weeks ago", created: "Feb 02, 2026" },
  ];
  return <div style={{ padding: "28px 32px" }}>
    {/* Premium Toolbar */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Subscription Plans</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>MANAGE PLANS, PRICING & TRIALS</div>
      </div>
      {/* <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <AGhost icon={<Filter size={14}/>}>Filter</AGhost>
        <AGhost icon={<Download size={14}/>}>Export</AGhost>
        <APrimary onClick={()=>setCreating(true)} icon={<Plus size={14}/>}>Create Subscription Plan</APrimary>
      </div> */}
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
              {actionMenu === plan.id && <div style={{ position: "absolute", right: 0, top: 36, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 12, padding: 6, width: 180, zIndex: 20, boxShadow: "0 12px 32px rgba(0,0,0,0.6)" }}>
                <button className="a-dd-item" onClick={() => { setEditing(plan.id); setActionMenu(null); }}><Pencil size={14} /> Edit Plan</button>
                {/* <button className="a-dd-item" onClick={() => { setActionMenu(null); }}><PieIcon size={14} /> Duplicate Plan</button> */}
                <button className="a-dd-item" onClick={() => { setActionMenu(null); }}><EyeOff size={14} /> {plan.status === "Active" ? "Disable" : "Enable"}</button>
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
          <ATog on={trialOn} onChange={setTrialOn} />
        </div>
        <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 14, padding: "20px" }}>
          <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 14 }}>DEFAULT DURATION</div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 4 }}>
            {["None", "1 Day", "3 Days", "7 Days"].map(d => <button key={d} style={{ flex: 1, padding: "10px", borderRadius: 8, background: d === "3 Days" ? C.brand : "transparent", color: d === "3 Days" ? "#fff" : C.td, fontFamily: P, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}>{d}</button>)}
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
          <ATog on={earlyOn} onChange={setEarlyOn} />
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

    {/* Modals */}
    {(creating || editing) && <div className="a-modal-overlay">
      <div className="a-modal" style={{ width: 600, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 32px", borderBottom: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1 }}>{creating ? "Create Subscription Plan" : "Edit Subscription Plan"}</div>
          <button className="a-btn" onClick={() => { setCreating(false); setEditing(null); }} style={{ background: "transparent", border: "none", color: C.td, cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div className="a-tscroll" style={{ padding: "32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
          <AIn label="Plan Name" placeholder="e.g. Diamond VIP" value="" onChange={() => { }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <AIn label="Monthly Price ($)" placeholder="0.00" value="" onChange={() => { }} />
            <AIn label="Yearly Price ($)" placeholder="0.00" value="" onChange={() => { }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <AIn label="Plan Icon (Emoji)" placeholder="e.g. 💎" value="" onChange={() => { }} />
            <AIn label="Theme Color (Hex)" placeholder="#FFFFFF" value="" onChange={() => { }} />
          </div>
          <ATa label="Features (one per line)" placeholder="Feature 1\nFeature 2" value="" onChange={() => { }} rows={5} />
          <ASel label="Visibility" opts={[{ l: "Active (Public)", v: "Active" }, { l: "Hidden (Private link)", v: "Hidden" }]} value="Active" onChange={() => { }} />
        </div>
        <div style={{ padding: "24px 32px", borderTop: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "flex-end", gap: 12, background: AD.card, borderRadius: "0 0 20px 20px" }}>
          <AGhost onClick={() => { setCreating(false); setEditing(null); }}>Cancel</AGhost>
          <APrimary>{creating ? "Create Plan" : "Save Changes"}</APrimary>
        </div>
      </div>
    </div>}

    {deleting && <div className="a-modal-overlay">
      <div className="a-modal" style={{ width: 460, padding: "32px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,90,107,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <AlertCircle size={28} color={C.sell} />
        </div>
        <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>Delete {deleting.name}?</div>
        <div style={{ fontFamily: P, fontSize: 14, color: C.tm, lineHeight: 1.5, marginBottom: 24 }}>
          This plan currently has <strong style={{ color: C.t1 }}>{deleting.subs} active subscribers</strong>. Deleting this plan will not cancel their active subscriptions, but no new users will be able to subscribe to it. This action cannot be undone.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <AGhost onClick={() => setDeleting(null)}>Cancel</AGhost>
          <button style={{ padding: "0 20px", height: 40, borderRadius: 8, background: C.sell, color: "#fff", border: "none", fontFamily: P, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete Plan</button>
        </div>
      </div>
    </div>}
  </div>;
}

// ─── Users ────────────────────────────────────────────────────────────────────

function AUsers() {
  const [selected, setSelected] = useState<typeof AUSERS[0] | null>(null);
  const [q, setQ] = useState("");
  const [planF, setPlanF] = useState("All");
  const pCol: Record<string, string> = { VIP: C.brand, Forex: C.gold, Crypto: "#60A5FA" };
  const sType: Record<string, "ok" | "warn" | "err" | "info"> = { Active: "ok", Trial: "info", Expired: "warn", Suspended: "err" };
  const filtered = AUSERS.filter(u => (planF === "All" || u.plan === planF) && (q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())));
  const COLS = "minmax(280px,1.5fr) 140px 140px 100px 140px 140px 120px";
  const HEAD = ["USER", "PLAN", "STATUS", "TRIAL", "JOINED", "RENEWAL", "ACTIONS"];

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Users</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{AUSERS.length} REGISTERED MEMBERS</div>
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
                <button className="a-btn" title="Edit" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }} onClick={(e) => { e.stopPropagation(); }}><Pencil size={15} color={C.t2} /></button>
                <button className="a-btn" title="Delete" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }} onClick={(e) => { e.stopPropagation(); }}><Trash2 size={15} color={C.sell} /></button>
              </div>
            </div>)}
          </div>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
          <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {filtered.length} of {AUSERS.length} records</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.t2, fontFamily: P, fontSize: 13, fontWeight: 600 }}>2</button>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </ACard>
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
          <APrimary size="sm" icon={<Crown size={12} />}>Upgrade Plan</APrimary>
          <AGhost size="sm" icon={<Calendar size={12} />}>Extend Trial</AGhost>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            <AGhost size="sm" danger icon={<Shield size={12} />}>Suspend</AGhost>
            <AGhost size="sm" danger icon={<Trash2 size={12} />}>Delete</AGhost>
          </div>
        </div>
      </ACard>}
    </div>
  </div>;
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

function ACoupons() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ code: "", discount: "", expiry: "", limit: "" });
  const COLS = "minmax(180px,1fr) 140px 160px 120px 180px 140px 120px";
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
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{ACOUPONS.length} CODES · 3 ACTIVE</div>
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
        <APrimary onClick={() => setModal(true)} icon={<Plus size={14} />}>Create Coupon</APrimary>
      </div>
    </ACard>

    <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.14em", marginBottom: 16 }}>COUPON CODES</div>
    <ACard style={{ marginBottom: 32 }}>
      <div className="a-tscroll" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1000 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderRadius: "18px 18px 0 0", borderBottom: `1px solid ${AD.cardB}` }}>
            {HEAD.map(h => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
          </div>
          {ACOUPONS.map((cp, i) => <div key={cp.code} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "24px 28px", borderBottom: i < ACOUPONS.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
            <span style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.brand, letterSpacing: "0.05em" }}>{cp.code}</span>
            <span style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.gold }}>{cp.discount}</span>
            <span style={{ fontFamily: M, fontSize: 13, color: C.td }}>{cp.expiry}</span>
            <span style={{ fontFamily: M, fontSize: 14, color: C.t2 }}>{cp.limit}</span>
            <div style={{ paddingRight: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontFamily: M, fontSize: 12, color: C.t2 }}>{cp.used} / {cp.limit}</span><span style={{ fontFamily: M, fontSize: 11, color: C.td }}>{Math.round((cp.used / cp.limit) * 100)}%</span></div>
              <div style={{ height: 4, borderRadius: 100, background: "rgba(255,255,255,0.06)" }}><div style={{ width: `${(cp.used / cp.limit) * 100}%`, height: "100%", borderRadius: 100, background: C.brand }} /></div>
            </div>
            <div><Chip label={cp.status} type={cp.status === "Active" ? "ok" : cp.status === "Exhausted" ? "warn" : "muted"} /></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="a-btn" title="Edit" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}><Pencil size={15} color={C.t2} /></button>
              <button className="a-btn" title="Delete" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}><Trash2 size={15} color={C.sell} /></button>
            </div>
          </div>)}
        </div>
      </div>
      {/* Pagination Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
        <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {ACOUPONS.length} of {ACOUPONS.length} records</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </ACard>
    <div style={{ fontFamily: M, fontSize: 8.5, color: C.td, letterSpacing: "0.14em", marginBottom: 13 }}>PROMOTIONS</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13 }}>
      {campaigns.map(camp => <ACard key={camp.name} style={{ padding: "18px 20px", border: camp.active ? `1px solid rgba(128,0,255,0.2)` : `1px solid ${AD.cardB}` }} hover>
        <div style={{ fontSize: 26, marginBottom: 9 }}>{camp.emoji}</div>
        <div style={{ fontFamily: P, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{camp.name}</div>
        <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginBottom: 10 }}>{camp.desc}</div>
        <div style={{ fontFamily: M, fontSize: 17, fontWeight: 700, color: camp.active ? C.brand : C.td, marginBottom: 12 }}>{camp.disc}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Chip label={camp.active ? "Active" : "Inactive"} type={camp.active ? "ok" : "muted"} />
          <button style={{ fontFamily: P, fontSize: 10, color: C.td, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Edit →</button>
        </div>
      </ACard>)}
    </div>
    {modal && <AModal title="Create Coupon" sub="Define the discount code, amount, and expiry" onClose={() => setModal(false)} width={460}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <AIn label="Coupon Code" placeholder="e.g. SUMMER50" value={form.code} onChange={v => setForm({ ...form, code: v.toUpperCase() })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <AIn label="Discount %" placeholder="e.g. 30" value={form.discount} onChange={v => setForm({ ...form, discount: v })} type="number" />
          <AIn label="Usage Limit" placeholder="e.g. 100" value={form.limit} onChange={v => setForm({ ...form, limit: v })} type="number" />
        </div>
        <AIn label="Expiry Date" value={form.expiry} onChange={v => setForm({ ...form, expiry: v })} type="date" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
          <AGhost onClick={() => setModal(false)}>Cancel</AGhost>
          <APrimary icon={<Tag size={13} />} onClick={() => setModal(false)}>Create Coupon</APrimary>
        </div>
      </div>
    </AModal>}
  </div>;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function ASettings() {
  const [email, setEmail] = useState("support@elitetrading.io");
  const [name, setName] = useState("Elite Trading");
  const [saved, setSaved] = useState(false);
  return <div style={{ padding: "28px 32px" }}>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: P, fontSize: 20, fontWeight: 700, color: C.t1, margin: "0 0 4px", letterSpacing: "-0.4px" }}>Settings</h2>
      <div style={{ fontFamily: M, fontSize: 9, color: C.td, letterSpacing: "0.12em" }}>GENERAL · LEGAL · SYSTEM</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <ACard style={{ padding: "22px 24px" }}>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 16 }}>General</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <AIn label="Platform Name" value={name} onChange={setName} />
            <AIn label="Support Email" value={email} onChange={setEmail} type="email" />
          </div>
          {saved && <div style={{ marginTop: 13, background: "rgba(0,208,132,0.07)", border: "1px solid rgba(0,208,132,0.2)", borderRadius: 9, padding: "8px 13px", fontFamily: P, fontSize: 11.5, color: C.buy }}>✓ Settings saved</div>}
          <div style={{ marginTop: 14 }}><APrimary onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} icon={<Check size={13} />}>Save Changes</APrimary></div>
        </ACard>
        <ACard style={{ padding: "22px 24px" }}>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 3 }}>Admin Profile</div>
          <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginBottom: 14 }}>Update your admin account credentials.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <AIn label="Full Name" value="Administrator" onChange={() => { }} />
            <AIn label="Admin Email" value="admin@elite.io" onChange={() => { }} type="email" />
            <AIn label="New Password" placeholder="Leave blank to keep current" value="" onChange={() => { }} type="password" />
          </div>
          <div style={{ marginTop: 14 }}><AGhost>Update Profile</AGhost></div>
        </ACard>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <ACard style={{ padding: "22px 24px" }}>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 14 }}>Legal Documents</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ l: "Privacy Policy", d: "Last updated Jul 1, 2026" }, { l: "Terms & Conditions", d: "Last updated Jul 1, 2026" }, { l: "Refund Policy", d: "Last updated Jun 15, 2026" }].map(doc => <div key={doc.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: AD.inp, borderRadius: 10, padding: "12px 14px" }}>
              <div><div style={{ fontFamily: P, fontSize: 12.5, fontWeight: 500, color: C.t1 }}>{doc.l}</div><div style={{ fontFamily: P, fontSize: 10, color: C.td, marginTop: 2 }}>{doc.d}</div></div>
              <button style={{ fontFamily: P, fontSize: 10, color: C.brand, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Edit →</button>
            </div>)}
          </div>
        </ACard>
        <ACard style={{ padding: "22px 24px" }}>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 14 }}>System</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[{ l: "Version", v: "1.0.0" }, { l: "Environment", v: "Production" }, { l: "Last Deploy", v: "Jul 22, 2026" }, { l: "API Status", v: "Operational" }].map((s, i, arr) => <div key={s.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${AD.cardB}` : "none" }}>
              <span style={{ fontFamily: P, fontSize: 12, color: C.tm }}>{s.l}</span>
              <span style={{ fontFamily: M, fontSize: 11, color: s.v === "Operational" ? C.buy : C.t2, fontWeight: 600 }}>{s.v}</span>
            </div>)}
          </div>
        </ACard>
        <ACard style={{ padding: "22px 24px", border: "1px solid rgba(255,90,107,0.14)" }}>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 600, color: C.sell, marginBottom: 3 }}>Danger Zone</div>
          <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginBottom: 14 }}>These actions cannot be undone.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <AGhost danger size="sm" icon={<AlertCircle size={12} />}>Clear All Draft Signals</AGhost>
            <AGhost danger size="sm" icon={<Trash2 size={12} />}>Purge Expired Users</AGhost>
          </div>
        </ACard>
      </div>
    </div>
  </div>;
}

// ─── Admin Root ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  return <div style={{ display: "flex", height: "100vh", background: AD.bg, color: C.t1, fontFamily: P, overflow: "hidden" }}>
    <style>{`
      .a-nav-item:hover{background:rgba(255,255,255,0.04)!important;color:rgba(255,255,255,0.85)!important;}
      .a-row:hover{background:rgba(128,0,255,0.07)!important;}
      .a-btn{transition:all 0.15s ease!important;}
      .a-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}
      .a-btn:active{transform:translateY(0)!important;}
      .a-input:focus{border-color:rgba(128,0,255,0.55)!important;box-shadow:0 0 0 3px rgba(128,0,255,0.1)!important;}
      .a-card-hov:hover{border-color:rgba(128,0,255,0.2)!important;}
      .a-tscroll::-webkit-scrollbar{height:4px;}
      .a-tscroll::-webkit-scrollbar-thumb{background:rgba(128,0,255,0.3);border-radius:10px;}
      .a-main::-webkit-scrollbar{width:4px;}
      .a-main::-webkit-scrollbar-thumb{background:rgba(128,0,255,0.25);border-radius:10px;}
      @keyframes aSlide{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
      .a-section{animation:aSlide 0.22s ease forwards;}
    `}</style>
    <AdminNav section={section} onChange={setSection} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <AdminTopBar section={section} />
      <div className="a-main a-section" style={{ flex: 1, overflowY: "auto" }} key={section}>
        {section === "dashboard" && <ADashboard />}
        {section === "signals" && <ASignals />}
        {section === "posts" && <APosts />}
        {section === "notifications" && <ANotifications />}
        {section === "subscriptions" && <ASubscriptions />}
        {section === "users" && <AUsers />}
        {section === "coupons" && <ACoupons />}
        {section === "settings" && <ASettings />}
      </div>
    </div>
  </div>;
}

