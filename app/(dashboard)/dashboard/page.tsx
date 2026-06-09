"use client";

import Link from "next/link";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Mock data — replace with real API responses
───────────────────────────────────────────────────────────────────────────── */

const STATS = [
  {
    label: "Reports Analysed",
    value: "12",
    delta: "+2 this month",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 2h8l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 2v4h4M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accentBg: "var(--color-brand-light)",
    accentColor: "var(--color-brand)",
  },
  {
    label: "Health Score",
    value: "74 / 100",
    delta: "↑ 6pts from last check",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3C10 3 4 9 4 13a6 6 0 0 0 12 0C16 9 10 3 10 3Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    accentBg: "var(--color-normal-bg)",
    accentColor: "var(--color-normal-text)",
  },
  {
    label: "Flagged Metrics",
    value: "3",
    delta: "Requires attention",
    positive: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L2 16h16L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14" r="0.75" fill="currentColor" />
      </svg>
    ),
    accentBg: "var(--color-abnormal-bg)",
    accentColor: "var(--color-abnormal-text)",
  },
  {
    label: "Medications Tracked",
    value: "4",
    delta: "All active",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="8" width="14" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accentBg: "var(--color-info-bg)",
    accentColor: "var(--color-info-text)",
  },
];

const RECENT_REPORTS = [
  { id: "1", title: "Complete Blood Count (CBC)",    date: "2 days ago",   status: "abnormal",      type: "Blood Panel"  },
  { id: "2", title: "Lipid Profile",                 date: "1 week ago",   status: "abnormal",      type: "Metabolic"    },
  { id: "3", title: "Thyroid Function — TSH / T4",   date: "2 weeks ago",  status: "normal",        type: "Thyroid"      },
  { id: "4", title: "Urinalysis",                    date: "1 month ago",  status: "normal",        type: "Urinalysis"   },
  { id: "5", title: "Fasting Glucose",               date: "1 month ago",  status: "informational", type: "Metabolic"    },
];

const BIOMARKERS = [
  { name: "HbA1c",         value: "6.1%",       ref: "< 5.7%",       status: "abnormal"      },
  { name: "Fasting Glucose", value: "110 mg/dL", ref: "70–99",        status: "abnormal"      },
  { name: "LDL",           value: "142 mg/dL",   ref: "< 100",        status: "abnormal"      },
  { name: "HDL",           value: "58 mg/dL",    ref: "> 40",         status: "normal"        },
  { name: "Hemoglobin",    value: "11.2 g/dL",   ref: "12–16",        status: "abnormal"      },
  { name: "TSH",           value: "3.1 mIU/L",   ref: "0.4–4.0",      status: "normal"        },
  { name: "Creatinine",    value: "0.9 mg/dL",   ref: "0.6–1.2",      status: "normal"        },
  { name: "Platelets",     value: "210 ×10³/µL", ref: "150–400",      status: "normal"        },
];

const ACTIVITY = [
  { label: "CBC report uploaded",                   time: "2 days ago",  type: "upload"   },
  { label: "AI analysis completed — 3 flags",       time: "2 days ago",  type: "analysis" },
  { label: "Lipid profile analysed",                time: "1 week ago",  type: "analysis" },
  { label: "Levothyroxine added to medications",    time: "2 weeks ago", type: "med"      },
  { label: "Thyroid panel — all values normal",     time: "2 weeks ago", type: "normal"   },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────────────────────── */

/** Status pill */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    normal:        { cls: "badge-normal",   label: "Normal"  },
    abnormal:      { cls: "badge-abnormal", label: "Flagged" },
    informational: { cls: "badge-info",     label: "Monitor" },
  };
  const { cls, label } = map[status] ?? map.normal;
  return <span className={cls}>{label}</span>;
}

/** Health score half-ring */
function HealthScoreRing({ score = 74 }: { score?: number }) {
  const r = 52;
  const circ = Math.PI * r; // half circle circumference
  const offset = circ * (1 - score / 100);

  const color =
    score >= 80 ? "#059669" :
    score >= 60 ? "#F59E0B" :
    "#E11D48";

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80" aria-label={`Health score ${score}`}>
        {/* Track */}
        <path
          d="M 14 76 A 56 56 0 0 1 126 76"
          fill="none" stroke="#F1F5F9" strokeWidth="14" strokeLinecap="round"
        />
        {/* Progress — use stroke-dasharray on a full circle, rotate */}
        <path
          d="M 14 76 A 56 56 0 0 1 126 76"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
        {/* Score text */}
        <text x="70" y="62" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F172A">{score}</text>
        <text x="70" y="76" textAnchor="middle" fontSize="9" fill="#94A3B8">out of 100</text>
      </svg>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
          {score >= 80 ? "Excellent" : score >= 60 ? "Fair — needs attention" : "Poor"}
        </span>
      </div>
    </div>
  );
}

/** Activity icon by type */
function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    upload: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 10V3M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    analysis: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 11L5.5 6.5l2.5 3L11 4.5l3 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    med: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="12" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 6v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    normal: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  const colors: Record<string, { bg: string; color: string }> = {
    upload:   { bg: "var(--color-brand-light)",    color: "var(--color-brand)"         },
    analysis: { bg: "var(--color-info-bg)",        color: "var(--color-info-text)"     },
    med:      { bg: "var(--color-normal-bg)",      color: "var(--color-normal-text)"   },
    normal:   { bg: "var(--color-normal-bg)",      color: "var(--color-normal-text)"   },
  };

  const { bg, color } = colors[type] ?? colors.upload;
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: bg, color }}>
      {icons[type]}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [activeTab, setActiveTab] = useState<"overview" | "biomarkers">("overview");

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            {greeting}, Alex 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Here&apos;s your health intelligence overview.
          </p>
        </div>
        <Link
          href="/chat"
          className="btn-primary gap-2 px-5 py-2.5 text-sm font-semibold"
          style={{ borderRadius: "0.875rem" }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          New Analysis
        </Link>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                  {s.label}
                </p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                  {s.value}
                </p>
                <p className="mt-0.5 text-xs font-medium"
                  style={{ color: s.positive ? "var(--color-normal-text)" : "var(--color-abnormal-text)" }}>
                  {s.delta}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: s.accentBg, color: s.accentColor }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Left+Centre: tabbed content — 2/3 width */}
        <div className="flex flex-col gap-5 xl:col-span-2">

          {/* Tab bar */}
          <div className="flex gap-1 rounded-xl border p-1"
            style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)", width: "fit-content" }}>
            {(["overview", "biomarkers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all duration-150"
                style={
                  activeTab === tab
                    ? { backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }
                    : { color: "var(--color-text-secondary)" }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── TAB: Overview — Recent Reports ── */}
          {activeTab === "overview" && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b px-5 py-4"
                style={{ borderColor: "var(--color-border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Recent Reports
                </p>
                <Link href="/chat" className="text-xs font-medium" style={{ color: "var(--color-brand)" }}>
                  Analyse new →
                </Link>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                {RECENT_REPORTS.map((r) => (
                  <div key={r.id}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
                  >
                    {/* File icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 2h6l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
                          stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                        <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                        <path d="M6 8h4M6 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                        {r.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {r.type} · {r.date}
                      </p>
                    </div>

                    <StatusPill status={r.status} />

                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
                      style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: Biomarkers ── */}
          {activeTab === "biomarkers" && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b px-5 py-4"
                style={{ borderColor: "var(--color-border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Latest Biomarkers
                </p>
                <span className="badge-abnormal">3 flagged</span>
              </div>
              <div className="grid grid-cols-1 gap-px sm:grid-cols-2"
                style={{ backgroundColor: "var(--color-border)" }}>
                {BIOMARKERS.map((b) => {
                  const isAbnormal = b.status === "abnormal";
                  return (
                    <div key={b.name}
                      className="flex items-center justify-between px-5 py-3.5"
                      style={{ backgroundColor: "var(--color-bg-base)" }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {b.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          Ref: {b.ref}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold"
                          style={{ color: isAbnormal ? "var(--color-abnormal-text)" : "var(--color-normal-text)" }}>
                          {b.value}
                        </span>
                        <StatusPill status={b.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Alert card — only when abnormal metrics exist ── */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M9 2L1.5 15.5h15L9 2Z" stroke="#D97706" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M9 7v4" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="9" cy="12.5" r="0.75" fill="#D97706" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800">3 metrics need your attention</p>
                <p className="mt-0.5 text-xs text-amber-700">
                  HbA1c, LDL cholesterol, and haemoglobin are outside healthy reference ranges.
                  Upload your latest report for an updated AI analysis.
                </p>
              </div>
              <Link href="/chat"
                className="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-colors duration-150"
                style={{ backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }}>
                Analyse
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: health score + activity feed */}
        <div className="flex flex-col gap-5">

          {/* Health score card */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Health Score
              </p>
              <span className="section-label">Updated today</span>
            </div>
            <HealthScoreRing score={74} />
            <div className="mt-4 grid grid-cols-3 divide-x rounded-xl border text-center"
              style={{ borderColor: "var(--color-border)" }}>
              {[
                { label: "Normal", count: 5, color: "var(--color-normal-text)" },
                { label: "Flagged", count: 3, color: "var(--color-abnormal-text)" },
                { label: "Monitor", count: 1, color: "var(--color-info-text)" },
              ].map(({ label, count, color }) => (
                <div key={label} className="py-3">
                  <p className="text-base font-bold" style={{ color }}>{count}</p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <p className="mb-3 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Quick Actions
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Analyse a new report", href: "/chat", primary: true },
                { label: "View medication tracker", href: "/dashboard/profile", primary: false },
                { label: "Download last report PDF", href: "#", primary: false },
              ].map(({ label, href, primary }) => (
                <Link key={label} href={href}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${primary ? "btn-primary" : ""}`}
                  style={
                    !primary
                      ? {
                          backgroundColor: "var(--color-bg-subtle)",
                          color: "var(--color-text-secondary)",
                          border: "1px solid var(--color-border)",
                        }
                      : {}
                  }
                  onMouseEnter={(e) => {
                    if (!primary)
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                  }}
                  onMouseLeave={(e) => {
                    if (!primary)
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)";
                  }}
                >
                  {label}
                  {!primary && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="card p-5">
            <p className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Recent Activity
            </p>
            <div className="flex flex-col gap-3">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ActivityIcon type={a.type} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug" style={{ color: "var(--color-text-primary)" }}>
                      {a.label}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                      {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
