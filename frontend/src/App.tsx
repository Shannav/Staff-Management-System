import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  Camera,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "./store/auth";
import { signIn } from "./lib/api";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Live monitor", icon: Camera },
  { label: "Footfall", icon: BarChart3 },
  { label: "Attendance", icon: Clock3 },
  { label: "Productivity", icon: Activity },
  { label: "Products", icon: Boxes },
];

const metrics = [
  { label: "Footfall today", value: "1,284", change: "+12.8%", positive: true, icon: Users },
  { label: "Current occupancy", value: "46", change: "of 80 capacity", positive: true, icon: Activity },
  { label: "Attendance rate", value: "94.2%", change: "+2.4% vs last week", positive: true, icon: Clock3 },
  { label: "Product availability", value: "98.6%", change: "2 items low", positive: false, icon: Boxes },
];

const today = new Date();
const todayShort = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(today);
const todayLong = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
})
  .format(today)
  .toUpperCase();

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="signin-shell">
      <div className="signin-glow" aria-hidden="true" />
      <section className="signin-card">
        <div className="brand-mark"><Activity size={21} strokeWidth={2.5} /></div>
        <p className="eyebrow">RETAIL INTELLIGENCE</p>
        <h1>Welcome back</h1>
        <p className="signin-copy">Sign in to your operations workspace.</p>
        <form onSubmit={submit} className="signin-form">
          <label htmlFor="email">Work email</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button signin-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}<ArrowUpRight size={17} /></button>
        </form>
        <p className="signin-foot"><ShieldCheck size={14} /> Secure access · Admin / Manager / Viewer</p>
      </section>
      <span className="signin-caption">RETAILVISION BI <span>·</span> OPERATIONS, IN FOCUS</span>
    </main>
  );
}

function Dashboard() {
  const { email, clearSession } = useAuth();
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");
  return (
    <div className={dark ? "app-shell" : "app-shell light"}>
      <AnimatePresence>
        {menuOpen && <motion.button className="mobile-backdrop" aria-label="Close navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />}
      </AnimatePresence>
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup"><div className="brand-mark"><Activity size={20} strokeWidth={2.5} /></div><span>retail<span className="brand-light">vision</span><sup>BI</sup></span><button className="mobile-close icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
        <div className="store-select"><div className="store-avatar">N</div><div className="store-info"><strong>Northstar Café</strong><span>Colombo · Store 01</span></div><ChevronDown size={15} /></div>
        <p className="nav-caption">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activePage === label ? "nav-active" : ""}`} onClick={() => { setActivePage(label); setMenuOpen(false); }}>
              <Icon size={18} /><span>{label}</span>{label === "Live monitor" && <span className="live-dot" />}
            </button>
          ))}
        </nav>
        <p className="nav-caption nav-caption-lower">MANAGE</p>
        <button className="nav-item"><Users size={18} /><span>Staff & shifts</span></button>
        <button className="nav-item"><Bell size={18} /><span>Alerts</span><span className="nav-count">3</span></button>
        <div className="sidebar-bottom">
          <div className="plan-card"><div className="plan-icon"><ShieldCheck size={16} /></div><strong>All systems ready</strong><span>Camera analytics setup is coming soon.</span></div>
          <div className="profile-button"><div className="profile-avatar">{(email?.[0] ?? "A").toUpperCase()}</div><span className="profile-details"><strong>{email ?? "Administrator"}</strong><small>Administrator</small></span><button className="logout-button" onClick={clearSession} aria-label="Sign out"><LogOut size={17} /></button></div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activePage}</strong></div>
          <div className="topbar-actions"><button className="date-picker"><span className="date-dot" />Today, {todayShort}<ChevronDown size={14} /></button><button className="icon-button theme-toggle" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="notification-button icon-button" aria-label="Notifications"><Bell size={18} /><i /></button></div>
        </header>
        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">{todayLong} <span className="heading-separator">/</span> STORE OVERVIEW</p><h1>Good morning <span className="wave">✳</span></h1><p className="page-subtitle">Here’s what’s happening across your store today.</p></div><button className="secondary-button"><span className="export-icon">↥</span> Export report</button></div>
          <div className="notice-banner"><span className="notice-indicator" /><span><strong>Preview mode</strong> — metrics below are sample data. Connect a camera to start live analytics.</span><button aria-label="Dismiss preview notice"><X size={15} /></button></div>
          <section className="metrics-grid" aria-label="Key metrics">
            {metrics.map(({ label, value, change, positive, icon: Icon }, index) => (
              <motion.article className="metric-card" key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={17} /></span></div>
                <div className="metric-value">{value}</div><div className={`metric-change ${positive ? "positive" : "neutral"}`}>{positive ? <ArrowUpRight size={14} /> : <AlertTriangle size={13} />}{change}</div>
                <div className="sparkline" aria-hidden="true"><span style={{ height: "36%" }} /><span style={{ height: "51%" }} /><span style={{ height: "44%" }} /><span style={{ height: "63%" }} /><span style={{ height: "57%" }} /><span style={{ height: "77%" }} /><span style={{ height: "67%" }} /><span style={{ height: "92%" }} /><span style={{ height: "73%" }} /><span style={{ height: "100%" }} /></div>
              </motion.article>
            ))}
          </section>
          <section className="analytics-grid">
            <article className="panel footfall-panel">
              <div className="panel-heading"><div><h2>Footfall overview</h2><p>Store visits throughout the day</p></div><button className="period-select">Today <ChevronDown size={14} /></button></div>
              <div className="chart-legend"><span><i className="legend-in" />Visitors in</span><span><i className="legend-out" />Visitors out</span><strong>1,284 <small>total visitors</small></strong></div>
              <div className="chart-wrap"><div className="chart-y-labels"><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span></div><div className="chart-plot"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><svg className="line-chart" viewBox="0 0 640 190" preserveAspectRatio="none" role="img" aria-label="Sample visitors in and out trend"><defs><linearGradient id="fillIn" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6de0bd" stopOpacity=".2" /><stop offset="1" stopColor="#6de0bd" stopOpacity="0" /></linearGradient></defs><path className="area-in" d="M0 158 C35 154 44 135 80 143 S126 160 160 128 S204 95 240 110 S288 80 320 92 S360 114 400 72 S444 88 480 61 S530 71 560 34 S607 55 640 20 L640 190 L0 190Z" /><path className="line-in" d="M0 158 C35 154 44 135 80 143 S126 160 160 128 S204 95 240 110 S288 80 320 92 S360 114 400 72 S444 88 480 61 S530 71 560 34 S607 55 640 20" /><path className="line-out" d="M0 176 C42 169 44 160 80 165 S124 151 160 157 S206 139 240 148 S285 121 320 130 S362 140 400 110 S446 118 480 98 S526 108 560 80 S606 95 640 63" /></svg><div className="chart-x-labels"><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span></div></div></div>
            </article>
            <article className="panel activity-panel">
              <div className="panel-heading"><div><h2>Store activity</h2><p>Live operational snapshot</p></div><span className="snapshot-live"><i /> LIVE</span></div>
              <div className="activity-list"><div className="activity-row"><span className="activity-icon occupancy"><Users size={17} /></span><span className="activity-label"><strong>In-store now</strong><small>Customer occupancy</small></span><span className="activity-value">46 <small>/ 80</small></span></div><div className="activity-row"><span className="activity-icon staff"><Clock3 size={17} /></span><span className="activity-label"><strong>Staff on shift</strong><small>12 scheduled today</small></span><span className="activity-value">11 <small>/ 12</small></span></div><div className="activity-row"><span className="activity-icon queue"><Activity size={17} /></span><span className="activity-label"><strong>Queue wait</strong><small>Estimated average</small></span><span className="activity-value">4.2 <small>min</small></span></div></div>
              <div className="peak-card"><div className="peak-icon"><ArrowDownRight size={17} /></div><div><strong>Peak hour ahead</strong><span>Lunch traffic typically rises around 12:30 PM.</span></div></div>
            </article>
          </section>
          <footer className="page-footer"><span>Last updated just now</span><span className="footer-divider" /><span>Data refreshes every 30 seconds</span><span className="footer-spacer" /><span className="sample-label"><i /> Sample data</span></footer>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const token = useAuth((state) => state.token);
  return token ? <Dashboard /> : <SignIn />;
}
