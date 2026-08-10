import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X, ChevronRight, TrendingDown,
  TrendingUp as TUp,
} from "lucide-react";
import {
  AreaChart, Area, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
export const C = {
  bg: "#0D0B14", bg2: "#161221", surface: "#1E1930", card: "#26203A",
  brand: "#8000FF", brandH: "#9333FF",
  gold: "#BFA06D", goldL: "#D7C48D",
  t1: "#FFFFFF", t2: "#C7C3D5", tm: "#8E8A9E", td: "#6D687B",
  buy: "#00D084", sell: "#FF5A6B", active: "#7C3AED", closed: "#64748B",
  border: "rgba(255,255,255,0.08)", borderM: "rgba(255,255,255,0.13)",
} as const;

export const P = "'Poppins', system-ui, sans-serif";
export const M = "'JetBrains Mono', 'Fira Code', monospace";

export const AD = {
  bg: "#07051A", nav: "#09071E",
  card: "rgba(255,255,255,0.032)", cardB: "rgba(255,255,255,0.07)",
  th: "rgba(255,255,255,0.025)", rowHov: "rgba(128,0,255,0.068)",
  inp: "rgba(255,255,255,0.038)", inpB: "rgba(255,255,255,0.08)",
} as const;

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const GROWTH_DATA = [
  { m: "Feb", v: 280, f: 380, c: 210 }, { m: "Mar", v: 310, f: 420, c: 235 },
  { m: "Apr", v: 340, f: 460, c: 255 }, { m: "May", v: 360, f: 490, c: 265 },
  { m: "Jun", v: 370, f: 510, c: 278 }, { m: "Jul", v: 384, f: 521, c: 289 },
];
export const REVENUE_DATA = [
  { m: "Feb", r: 32400 }, { m: "Mar", r: 36800 }, { m: "Apr", r: 40200 },
  { m: "May", r: 43100 }, { m: "Jun", r: 45800 }, { m: "Jul", r: 48230 },
];
export const PERF_DATA = [
  { n: "Win", v: 62, color: C.buy }, { n: "Loss", v: 18, color: C.sell }, { n: "BE", v: 20, color: "#64748B" },
];

export type SignalData = {
  id: string; asset: string; cat: string; type: string; dir: "BUY" | "SELL";
  entry: string; sl: string; tp1: string; tp2: string; tp3: string;
  status: string; pub: string; signalDate?: string; scheduledAt?: string;
};

export const SIGNAL_TYPE_OPTIONS = [
  { l: "Scalp", v: "Scalp" },
  { l: "Swing Trade", v: "Swing" },
  { l: "Intraday", v: "Intraday" },
  { l: "Position", v: "Position" },
  { l: "Long-term", v: "Long-term" },
] as const;

export const PLAN_SIGNAL_TYPE_OPTIONS = [
  { key: "scalp", label: "Scalp" },
  { key: "swing", label: "Swing" },
  { key: "intraday", label: "Intraday" },
  { key: "position", label: "Position" },
  { key: "long-term", label: "Long-term" },
] as const;

export const matchSignalTypeOption = (
  value?: string,
  options: ReadonlyArray<{ l: string; v: string }> = SIGNAL_TYPE_OPTIONS,
) => {
  const raw = String(value || "").trim();
  if (!raw) return options[0]?.v || "Swing";

  const exact = options.find(
    (option) => option.v.toLowerCase() === raw.toLowerCase(),
  );
  if (exact) return exact.v;

  const partial = options.find((option) =>
    raw.toLowerCase().includes(option.v.toLowerCase()),
  );
  if (partial) return partial.v;

  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const INITIAL_SIGNALS: SignalData[] = [
  { id: "1", asset: "BTC/USDT", cat: "Crypto", type: "Swing", dir: "BUY", entry: "67,420.00", sl: "65,800.00", tp1: "69,000.00", tp2: "71,500.00", tp3: "74,000.00", status: "Active", pub: "Jul 23 · 09:15" },
  { id: "2", asset: "GOLD/USD", cat: "Commodity", type: "Intraday", dir: "BUY", entry: "2,847.00", sl: "2,820.00", tp1: "2,875.00", tp2: "2,900.00", tp3: "2,930.00", status: "Active", pub: "Jul 23 · 11:00" },
  { id: "3", asset: "EUR/USD", cat: "Forex", type: "Swing", dir: "SELL", entry: "1.0842", sl: "1.0880", tp1: "1.0810", tp2: "1.0775", tp3: "1.0740", status: "Active", pub: "Jul 23 · 13:30" },
  { id: "4", asset: "NAS100", cat: "Index", type: "Scalp", dir: "BUY", entry: "19,840.00", sl: "19,600.00", tp1: "20,100.00", tp2: "20,400.00", tp3: "—", status: "Closed", pub: "Jul 22 · 08:00" },
  { id: "5", asset: "GBP/JPY", cat: "Forex", type: "Swing", dir: "BUY", entry: "196.84", sl: "195.50", tp1: "198.20", tp2: "199.50", tp3: "—", status: "Active", pub: "Jul 21 · 14:00" },
  { id: "6", asset: "ETH/USDT", cat: "Crypto", type: "Intraday", dir: "SELL", entry: "3,280.00", sl: "3,350.00", tp1: "3,200.00", tp2: "3,150.00", tp3: "3,080.00", status: "Draft", pub: "—" },
  { id: "7", asset: "SPX500", cat: "Index", type: "Swing", dir: "SELL", entry: "5,842.00", sl: "5,890.00", tp1: "5,800.00", tp2: "5,760.00", tp3: "—", status: "Scheduled", pub: "Jul 24 · 09:00" },
];

export type PostData = {
  id: string; img: string; title: string; cat: string;
  likes: number; comments: number; date: string; status: string;
  body?: string;
};

export const INITIAL_POSTS: PostData[] = [
  { id: 1, img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=64&h=40&fit=crop&auto=format", title: "Bitcoin Reclaims Key $67K Level", cat: "Market Update", likes: 142, comments: 28, date: "Jul 23", status: "Published", body: "Bitcoin has reclaimed the key $67,000 level after a period of consolidation. The move suggests bullish momentum may be building for a push toward new highs." },
  { id: 2, img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=64&h=40&fit=crop&auto=format", title: "Understanding Risk-to-Reward Ratios", cat: "Education", likes: 89, comments: 14, date: "Jul 22", status: "Published", body: "One of the most important concepts in trading is the risk-to-reward ratio. In this guide, we break down how to calculate and apply it to your trades." },
  { id: 3, img: "https://images.unsplash.com/photo-1591033594798-33227a05780d?w=64&h=40&fit=crop&auto=format", title: "Fed Signals No Rate Cuts Before Q4", cat: "News", likes: 67, comments: 19, date: "Jul 21", status: "Published", body: "The Federal Reserve has indicated that rate cuts are unlikely before Q4, citing persistent inflation concerns." },
  { id: 4, img: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=64&h=40&fit=crop&auto=format", title: "Premium Signal Alerts — Now Live", cat: "Announcement", likes: 203, comments: 41, date: "Jul 20", status: "Published", body: "We're excited to announce that Premium Signal Alerts are now live! Get real-time push notifications for every signal." },
  { id: 5, img: "", title: "Weekly Market Recap — Jul 21", cat: "Education", likes: 0, comments: 0, date: "—", status: "Draft", body: "This week saw significant moves across forex and crypto markets. Here's our breakdown of the key events." },
];

export type UserData = {
  id: number; init: string; name: string; email: string; plan: string;
  status: string; trial: boolean; signals: number; posts: number;
  likes: number; comments: number; joined: string; renewal: string;
};

export const INITIAL_USERS: UserData[] = [
  { id: 1, init: "AK", name: "Alex Kim", email: "alex.kim@email.com", plan: "VIP", status: "Active", trial: false, signals: 47, posts: 23, likes: 89, comments: 34, joined: "Jan 12, 2026", renewal: "Aug 12, 2026" },
  { id: 2, init: "SC", name: "Sarah Chen", email: "sarah.c@email.com", plan: "Forex", status: "Active", trial: false, signals: 31, posts: 14, likes: 52, comments: 18, joined: "Feb 3, 2026", renewal: "Aug 3, 2026" },
  { id: 3, init: "JT", name: "James Torres", email: "j.torres@email.com", plan: "Crypto", status: "Trial", trial: true, signals: 8, posts: 3, likes: 11, comments: 4, joined: "Jul 21, 2026", renewal: "Jul 23, 2026" },
  { id: 4, init: "ML", name: "Mia Laurent", email: "mia.l@email.com", plan: "VIP", status: "Active", trial: false, signals: 62, posts: 40, likes: 128, comments: 67, joined: "Mar 18, 2026", renewal: "Sep 18, 2026" },
  { id: 5, init: "OK", name: "Omar Khalil", email: "omar.k@email.com", plan: "Forex", status: "Expired", trial: false, signals: 19, posts: 7, likes: 28, comments: 9, joined: "Apr 5, 2026", renewal: "Jul 5, 2026" },
  { id: 6, init: "PN", name: "Priya Nair", email: "priya.n@email.com", plan: "Crypto", status: "Active", trial: false, signals: 28, posts: 11, likes: 44, comments: 15, joined: "May 22, 2026", renewal: "Aug 22, 2026" },
  { id: 7, init: "TB", name: "Tom Banks", email: "tom.b@email.com", plan: "VIP", status: "Suspended", trial: false, signals: 3, posts: 1, likes: 5, comments: 2, joined: "Jun 1, 2026", renewal: "—" },
];

export type NotifData = {
  id: string; title: string; audience: string; sent: string;
  reach: number; opened: number; status?: string; message?: string;
};

export const INITIAL_NOTIFS: NotifData[] = [
  { id: 1, title: "High Impact News Today", audience: "All Users", sent: "Jul 23, 14:30", reach: 1247, opened: 892, status: "Sent", message: "Major economic data release expected today. Watch for volatility in EUR/USD and Gold." },
  { id: 2, title: "New BTC Signal Published", audience: "VIP Users", sent: "Jul 23, 09:15", reach: 384, opened: 301, status: "Sent", message: "A new BTC/USDT BUY signal has been published. Check the Signals tab for details." },
  { id: 3, title: "Weekly Performance Report", audience: "All Users", sent: "Jul 21, 12:00", reach: 1247, opened: 743, status: "Sent", message: "Your weekly performance report is ready. 62% win rate this week across all signals." },
  { id: 4, title: "Forex Signal Update", audience: "Forex Users", sent: "Jul 20, 16:00", reach: 521, opened: 389, status: "Sent", message: "EUR/USD signal has hit TP1. Consider moving SL to breakeven." },
];

export type CouponData = {
  code: string; discount: string; expiry: string;
  limit: number; used: number; status: string;
};

export const INITIAL_COUPONS: CouponData[] = [
  { code: "ELITE50", discount: "50%", expiry: "Jul 31, 2026", limit: 100, used: 67, status: "Active" },
  { code: "VIPFREE", discount: "100%", expiry: "Jul 25, 2026", limit: 10, used: 10, status: "Exhausted" },
  { code: "FOREX20", discount: "20%", expiry: "Aug 15, 2026", limit: 200, used: 43, status: "Active" },
  { code: "CRYPTO30", discount: "30%", expiry: "Aug 1, 2026", limit: 50, used: 12, status: "Active" },
];

export const AACTIVITY = [
  { icon: "💳", text: "Alex Kim purchased VIP Plan", time: "2m ago", col: C.gold },
  { icon: "⚡", text: "New signal published — BTC/USDT BUY", time: "15m ago", col: C.buy },
  { icon: "📰", text: "Post published — Bitcoin Reclaims $67K", time: "1h ago", col: "#B57AFF" },
  { icon: "🆓", text: "James Torres started Free Trial", time: "2h ago", col: C.brand },
  { icon: "🎟", text: "Coupon ELITE50 redeemed by Sarah Chen", time: "3h ago", col: C.gold },
  { icon: "🔄", text: "Mia Laurent renewed Forex Plan", time: "5h ago", col: C.buy },
];

// ─── Chip ─────────────────────────────────────────────────────────────────────
export function Chip({ label, type }: { label: string; type: "ok" | "warn" | "err" | "muted" | "brand" | "gold" | "info" | "draft" | "expired" }) {
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
  let displayEmoji = emoji;
  if (label === "Draft") displayEmoji = "🟡";
  if (label === "Closed") displayEmoji = "🔴";
  if (label === "Suspended") displayEmoji = "⚪";
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: bg, color, border: `1px solid ${color}25`, borderRadius: 100, padding: "5px 12px", fontFamily: P, fontSize: 11.5, fontWeight: 500, boxShadow: `0 0 12px ${color}15`, whiteSpace: "nowrap" }}>{displayEmoji} {label}</span>;
}

// ─── Buttons ──────────────────────────────────────────────────────────────────
export function APrimary({ children, onClick, icon, size = "md", disabled = false, loading = false, danger = false }: { children?: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; size?: "sm" | "md"; disabled?: boolean; loading?: boolean; danger?: boolean }) {
  const bg = danger ? C.sell : `linear-gradient(135deg,${C.brand},${C.brandH})`;
  const shadow = danger ? `0 4px 14px ${C.sell}35` : `0 4px 14px ${C.brand}35`;
  return <button onClick={onClick} disabled={disabled || loading} className="a-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: size === "sm" ? "6px 14px" : "9px 18px", background: bg, border: "none", borderRadius: 9, fontFamily: P, fontSize: size === "sm" ? 11 : 12, fontWeight: 600, color: "#fff", cursor: disabled || loading ? "not-allowed" : "pointer", boxShadow: shadow, opacity: disabled ? 0.5 : 1, transition: "all 0.15s", whiteSpace: "nowrap", position: "relative" }}>
    {loading && <span className="a-spinner" />}
    {!loading && icon}{!loading && children}
    {loading && <span style={{ opacity: 0.8 }}>Processing...</span>}
  </button>;
}

export function AGhost({ children, onClick, icon, size = "md", danger = false }: { children?: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; size?: "sm" | "md"; danger?: boolean }) {
  return <button onClick={onClick} className="a-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: size === "sm" ? "6px 13px" : "8px 16px", background: "transparent", border: `1px solid ${danger ? "rgba(255,90,107,0.28)" : AD.cardB}`, borderRadius: 9, fontFamily: P, fontSize: size === "sm" ? 11 : 12, fontWeight: 500, color: danger ? C.sell : C.t2, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>{icon}{children}</button>;
}

// ─── Inputs ───────────────────────────────────────────────────────────────────
export function AIn({ label, value, onChange, placeholder, type = "text", error }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>{label}</span>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="a-input" style={{ background: AD.inp, border: `1px solid ${error ? C.sell : AD.inpB}`, borderRadius: 9, padding: "9px 13px", fontFamily: P, fontSize: 13, color: C.t1, outline: "none", caretColor: C.brand, transition: "all 0.18s" }} />
    {error && <span style={{ fontFamily: P, fontSize: 10, color: C.sell, marginTop: -2 }}>{error}</span>}
  </label>;
}

export function ATa({ label, value, onChange, placeholder, rows = 3 }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>{label}</span>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="a-input" style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "9px 13px", fontFamily: P, fontSize: 13, color: C.t1, outline: "none", caretColor: C.brand, resize: "vertical", transition: "all 0.18s" }} />
  </label>;
}

export function ASel({ label, value, onChange, opts }: { label?: string; value: string; onChange: (v: string) => void; opts: { l: string; v: string }[] }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <span style={{ fontFamily: P, fontSize: 11, fontWeight: 500, color: C.t2 }}>{label}</span>}
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "9px 13px", fontFamily: P, fontSize: 13, color: C.t1, outline: "none", cursor: "pointer", appearance: "none" }}>
      {opts.map(o => <option key={o.v} value={o.v} style={{ background: "#110F20" }}>{o.l}</option>)}
    </select>
  </label>;
}

export function ATog({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <div onClick={() => onChange(!on)} style={{ width: 42, height: 22, borderRadius: 100, background: on ? C.brand : "rgba(255,255,255,0.08)", border: `1px solid ${on ? C.brand : AD.cardB}`, cursor: "pointer", position: "relative", transition: "all 0.2s", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
  </div>;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function useLockBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
}

export function AModal({ title, sub, onClose, children, width = 580 }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  useLockBodyScroll();

  return createPortal(
    <div className="a-modal-overlay" style={{ overflowY: "auto" }} onClick={onClose}>
      <div
        className="a-modal"
        onClick={e => e.stopPropagation()}
        style={{
          width,
          maxWidth: "96vw",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          margin: "auto",
        }}
      >
        <div className="a-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1, letterSpacing: "-0.2px" }}>{title}</div>
            {sub && <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: AD.inp, border: `1px solid ${AD.cardB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={13} color={C.tm} /></button>
        </div>
        <div className="a-tscroll" style={{ flex: 1, overflowY: "auto", padding: 24 }}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function ACard({ children, style = {}, hover = false }: { children: React.ReactNode; style?: React.CSSProperties; hover?: boolean }) {
  return <div className={hover ? "a-card-hov" : ""} style={{ background: AD.card, backdropFilter: "blur(20px)", border: `1px solid ${AD.cardB}`, borderRadius: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.4),0 8px 24px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.04)", ...style }}>{children}</div>;
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────
export function CTooltip({ active, payload, label }: any) {
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

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function SCard({ label, value, change, icon: Icon, color, note, sparkline }: { label: string; value: string; change?: string; icon: React.ElementType; color: string; note?: string; sparkline?: any[] }) {
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

// ─── Icon Button ──────────────────────────────────────────────────────────────
export function IconBtn({ icon, title, onClick, color, bg }: { icon: React.ReactNode; title: string; onClick?: (e: React.MouseEvent) => void; color?: string; bg?: string }) {
  return <button className="a-btn" title={title} onClick={onClick} style={{ width: 36, height: 36, borderRadius: 10, background: bg || "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>{icon}</button>;
}

// ─── Loading Simulation Helper ────────────────────────────────────────────────
export function useLoadingAction(duration = 1200) {
  const [loading, setLoading] = useState(false);
  const execute = (callback: () => void) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      callback();
    }, duration);
  };
  return { loading, execute };
}
