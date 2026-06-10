"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Toggle switch
───────────────────────────────────────────────────────────────────────────── */
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button role="switch" aria-checked={checked} id={id} onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200"
      style={{ backgroundColor: checked ? "var(--color-brand)" : "#CBD5E1" }}>
      <span className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(24px)" : "translateX(4px)" }} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Setting row
───────────────────────────────────────────────────────────────────────────── */
function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium" style={{ color: "var(--color-text-primary)" }}>{label}</p>
        {desc && <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Pill selector
───────────────────────────────────────────────────────────────────────────── */
function PillGroup<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl border p-1"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
          style={value === o.value
            ? { backgroundColor: "var(--color-brand)", color: "#fff" }
            : { color: "var(--color-text-secondary)" }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Tabs
───────────────────────────────────────────────────────────────────────────── */
type SettingsTab = "general" | "notifications" | "ai" | "account";

/* ─────────────────────────────────────────────────────────────────────────────
   Main Modal
───────────────────────────────────────────────────────────────────────────── */
interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [tab, setTab] = useState<SettingsTab>("general");

  // General
  const [density, setDensity]       = useState<"comfortable" | "compact">("comfortable");

  // Notifications
  const [notifAnalysis, setNotifAnalysis]   = useState(true);
  const [notifFlagged, setNotifFlagged]     = useState(true);
  const [notifMed, setNotifMed]             = useState(true);
  const [notifWeekly, setNotifWeekly]       = useState(false);

  // AI
  const [aiDetail, setAiDetail] = useState<"simple" | "detailed" | "clinical">("detailed");
  const [autoAnalyse, setAutoAnalyse] = useState(true);

  const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "general", label: "General",
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M3 8h10M3 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="6" cy="5" r="1.5" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="8" r="1.5" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.3"/><circle cx="5" cy="11" r="1.5" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.3"/></svg>,
    },
    {
      key: "notifications", label: "Notifications",
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2a5 5 0 0 0-5 5v2.5L1.5 11.5h13L13 9.5V7a5 5 0 0 0-5-5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    },
    {
      key: "ai", label: "AI Preferences",
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    },
    {
      key: "account", label: "Account",
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
        onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-4 z-50 mx-auto my-auto flex max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:h-[680px] sm:w-full"
        style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>

        {/* Left: Tab nav */}
        <div className="hidden w-56 shrink-0 flex-col border-r sm:flex"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
          <div className="flex items-center gap-2.5 px-5 py-5">
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true"
              style={{ color: "var(--color-brand)" }}>
              <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="7" cy="5" r="1.75" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="11" cy="9" r="1.75" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="6" cy="13" r="1.75" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>Settings</span>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 px-2">
            {TABS.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150"
                style={tab === key
                  ? { backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }
                  : { color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => { if (tab !== key) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)"; }}
                onMouseLeave={(e) => { if (tab !== key) (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}>
                <span style={{ color: "inherit" }}>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b px-6 py-4"
            style={{ borderColor: "var(--color-border)" }}>
            {/* Mobile tab selector */}
            <select className="rounded-xl border px-3 py-1.5 text-sm font-medium sm:hidden"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
              value={tab} onChange={(e) => setTab(e.target.value as SettingsTab)}>
              {TABS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </select>
            <span className="hidden text-lg font-bold sm:block" style={{ color: "var(--color-text-primary)" }}>
              {TABS.find((t) => t.key === tab)?.label}
            </span>
            <button onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-150"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
              aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">

            {/* ── GENERAL ── */}
            {tab === "general" && (
              <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                <SettingRow label="Layout density" desc="Controls spacing of dashboard elements">
                  <PillGroup options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]}
                    value={density} onChange={setDensity} />
                </SettingRow>
                <SettingRow label="Theme" desc="Always light for medical clarity">
                  <span className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                    Light
                  </span>
                </SettingRow>
                <SettingRow label="Language" desc="Interface language">
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>English</span>
                </SettingRow>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === "notifications" && (
              <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                <SettingRow label="Analysis complete" desc="Email when your report finishes AI analysis">
                  <Toggle id="n1" checked={notifAnalysis} onChange={setNotifAnalysis} />
                </SettingRow>
                <SettingRow label="Flagged metric alerts" desc="Notify when any biomarker falls outside reference">
                  <Toggle id="n2" checked={notifFlagged} onChange={setNotifFlagged} />
                </SettingRow>
                <SettingRow label="Medication reminders" desc="Reminders for upcoming refills">
                  <Toggle id="n3" checked={notifMed} onChange={setNotifMed} />
                </SettingRow>
                <SettingRow label="Weekly health digest" desc="A summary of your health trends every Monday">
                  <Toggle id="n4" checked={notifWeekly} onChange={setNotifWeekly} />
                </SettingRow>
              </div>
            )}

            {/* ── AI PREFERENCES ── */}
            {tab === "ai" && (
              <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                <SettingRow label="Explanation detail level" desc="How technical the AI explanations should be">
                  <PillGroup options={[
                    { value: "simple", label: "Simple" },
                    { value: "detailed", label: "Detailed" },
                    { value: "clinical", label: "Clinical" },
                  ]} value={aiDetail} onChange={setAiDetail} />
                </SettingRow>
                <SettingRow label="Auto-analyse on upload" desc="Automatically start AI analysis when a file is uploaded">
                  <Toggle id="ai1" checked={autoAnalyse} onChange={setAutoAnalyse} />
                </SettingRow>
                <SettingRow label="Analysis language" desc="Language for AI-generated summaries">
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>English</span>
                </SettingRow>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {tab === "account" && (
              <div className="flex flex-col gap-5">
                {/* Profile */}
                <div className="flex items-center gap-4 rounded-2xl border p-4"
                  style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}>
                    AK
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Alex Kim</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>alex@simplimed.ai</p>
                  </div>
                </div>

                {/* Plan */}
                <div className="flex items-center justify-between rounded-2xl border p-4"
                  style={{ borderColor: "var(--color-border)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Current plan</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Pro · Renews Jul 9, 2026</p>
                  </div>
                  <a href="/pricing" className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                    style={{ borderColor: "var(--color-brand)", color: "var(--color-brand)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand-light)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}>
                    Manage Plan
                  </a>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between rounded-2xl border p-4"
                  style={{ borderColor: "var(--color-border)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Password</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Last changed 3 months ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href="/forgot-password" className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-brand)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}>
                      Forgot password?
                    </a>
                    <button className="rounded-xl border px-3 py-1.5 text-xs font-medium"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                      Change
                    </button>
                  </div>
                </div>

                {/* Danger */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm font-bold text-rose-700">Delete account</p>
                  <p className="mt-1 text-xs text-rose-600">Permanently removes all reports, analyses, and health data.</p>
                  <button className="mt-3 rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100">
                    Delete My Account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
