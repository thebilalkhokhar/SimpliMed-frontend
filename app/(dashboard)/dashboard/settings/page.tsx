"use client";

import Link from "next/link";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Reusable primitives
───────────────────────────────────────────────────────────────────────────── */

/** Toggle switch */
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        backgroundColor: checked ? "var(--color-brand)" : "#CBD5E1",
        outlineColor: "var(--color-focus-ring)",
      }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(24px)" : "translateX(4px)" }}
      />
    </button>
  );
}

/** Setting row with label, description, and a right-side control */
function SettingRow({
  label,
  description,
  children,
  htmlFor,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)", cursor: htmlFor ? "pointer" : "default" }}
        >
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/** Section card */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <div
        className="flex items-center gap-2.5 border-b px-5 py-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}
        >
          {icon}
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {title}
        </p>
      </div>
      <div className="divide-y px-5" style={{ borderColor: "var(--color-border)" }}>
        {children}
      </div>
    </div>
  );
}

/** Pill radio group */
function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl border p-1" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
          style={
            value === o.value
              ? { backgroundColor: "var(--color-brand)", color: "#fff" }
              : { color: "var(--color-text-secondary)" }
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function SettingsPage() {

  /* ── Notifications ── */
  const [notif, setNotif] = useState({
    analysisComplete:  true,
    flaggedMetrics:    true,
    medReminders:      true,
    weeklyDigest:      false,
    marketingEmails:   false,
  });

  /* ── Privacy ── */
  const [privacy, setPrivacy] = useState({
    shareWithProvider: false,
    anonymousAnalytics: true,
  });
  const [retentionPeriod, setRetentionPeriod] = useState<"1y" | "3y" | "forever">("forever");

  /* ── AI Preferences ── */
  const [aiLang, setAiLang]     = useState<"en" | "ar" | "fr" | "de" | "es">("en");
  const [aiDetail, setAiDetail] = useState<"simple" | "detailed" | "clinical">("detailed");
  const [autoAnalyse, setAutoAnalyse] = useState(true);

  /* ── Appearance ── */
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [landing, setLanding] = useState<"dashboard" | "chat" | "reports" | "analysis">("dashboard");

  /* ── Toast ── */
  const [toast, setToast] = useState(false);
  function save() {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  return (
    <>
      {/* Save toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-5 py-3 shadow-lg"
          style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-normal-border)" }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="var(--color-normal-bg)" stroke="var(--color-normal-border)" />
              <path d="M5 8l2 2 4-4" stroke="var(--color-normal-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium" style={{ color: "var(--color-normal-text)" }}>
              Settings saved
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 pb-10">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Settings
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Manage your preferences, privacy, and account settings.
            </p>
          </div>
          <button
            onClick={save}
            className="btn-primary gap-2 px-5 py-2.5 text-sm font-semibold"
            style={{ borderRadius: "0.875rem" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 2H5L2 5v9h12V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="5" y="9" width="6" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="6" y="2" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Save All
          </button>
        </div>

        {/* ══════════════════════════════════════
            1. NOTIFICATIONS
        ══════════════════════════════════════ */}
        <Section
          title="Notifications"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2a5 5 0 0 0-5 5v2.5L1.5 11.5h13L13 9.5V7a5 5 0 0 0-5-5Z"
                stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        >
          {([
            { key: "analysisComplete",  label: "Analysis complete",    desc: "Email when your report finishes AI analysis"        },
            { key: "flaggedMetrics",    label: "Flagged metric alerts", desc: "Notify when any biomarker falls outside reference"   },
            { key: "medReminders",      label: "Medication reminders",  desc: "Reminders for upcoming refills and course endings"   },
            { key: "weeklyDigest",      label: "Weekly health digest",  desc: "A summary of your health trends every Monday"        },
            { key: "marketingEmails",   label: "Product updates",       desc: "News about new features and platform improvements"   },
          ] as { key: keyof typeof notif; label: string; desc: string }[]).map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc} htmlFor={`notif-${key}`}>
              <Toggle
                id={`notif-${key}`}
                checked={notif[key]}
                onChange={(v) => setNotif((p) => ({ ...p, [key]: v }))}
              />
            </SettingRow>
          ))}
        </Section>

        {/* ══════════════════════════════════════
            2. PRIVACY & DATA
        ══════════════════════════════════════ */}
        <Section
          title="Privacy & Data"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2L3 4.5V9c0 2.761 2.239 5 5 5s5-2.239 5-5V4.5L8 2Z"
                stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          }
        >
          <SettingRow
            label="Share data with healthcare provider"
            description="Allow your doctor or clinic to view your Simplimed reports (requires their invitation)"
            htmlFor="share-provider"
          >
            <Toggle id="share-provider" checked={privacy.shareWithProvider}
              onChange={(v) => setPrivacy((p) => ({ ...p, shareWithProvider: v }))} />
          </SettingRow>

          <SettingRow
            label="Anonymous usage analytics"
            description="Help improve Simplimed by sharing anonymised usage patterns — no personal or health data is included"
            htmlFor="anon-analytics"
          >
            <Toggle id="anon-analytics" checked={privacy.anonymousAnalytics}
              onChange={(v) => setPrivacy((p) => ({ ...p, anonymousAnalytics: v }))} />
          </SettingRow>

          <SettingRow
            label="Report retention period"
            description="How long we keep your uploaded reports and analysis data"
          >
            <PillGroup
              options={[
                { value: "1y",      label: "1 Year"  },
                { value: "3y",      label: "3 Years" },
                { value: "forever", label: "Forever" },
              ]}
              value={retentionPeriod}
              onChange={setRetentionPeriod}
            />
          </SettingRow>

          <SettingRow
            label="Download your data"
            description="Export a full copy of your reports, analyses, and profile data (GDPR / HIPAA)"
          >
            <button className="btn-secondary gap-1.5 px-3 py-2 text-xs">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 9V2M4 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Export Data
            </button>
          </SettingRow>
        </Section>

        {/* ══════════════════════════════════════
            3. AI PREFERENCES
        ══════════════════════════════════════ */}
        <Section
          title="AI Preferences"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        >
          <SettingRow
            label="Analysis language"
            description="Language used for AI-generated summaries and insights"
          >
            <select
              value={aiLang}
              onChange={(e) => setAiLang(e.target.value as typeof aiLang)}
              className="input text-sm"
              style={{ width: 160 }}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Explanation detail level"
            description="How technical the AI explanations should be"
          >
            <PillGroup
              options={[
                { value: "simple",   label: "Simple"   },
                { value: "detailed", label: "Detailed" },
                { value: "clinical", label: "Clinical" },
              ]}
              value={aiDetail}
              onChange={setAiDetail}
            />
          </SettingRow>

          <SettingRow
            label="Auto-analyse on upload"
            description="Automatically start AI analysis when a file is uploaded — no manual trigger needed"
            htmlFor="auto-analyse"
          >
            <Toggle id="auto-analyse" checked={autoAnalyse} onChange={setAutoAnalyse} />
          </SettingRow>
        </Section>

        {/* ══════════════════════════════════════
            4. APPEARANCE
        ══════════════════════════════════════ */}
        <Section
          title="Appearance"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        >
          <SettingRow
            label="Layout density"
            description="Controls the spacing and size of dashboard elements"
          >
            <PillGroup
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact",     label: "Compact"     },
              ]}
              value={density}
              onChange={setDensity}
            />
          </SettingRow>

          <SettingRow
            label="Default landing page"
            description="The first page you see after signing in"
          >
            <select
              value={landing}
              onChange={(e) => setLanding(e.target.value as typeof landing)}
              className="input text-sm"
              style={{ width: 180 }}
            >
              <option value="dashboard">Dashboard</option>
              <option value="chat">New Analysis</option>
              <option value="reports">My Reports</option>
              <option value="analysis">Health Analysis</option>
            </select>
          </SettingRow>
        </Section>

        {/* ══════════════════════════════════════
            5. SUBSCRIPTION & BILLING
        ══════════════════════════════════════ */}
        <Section
          title="Subscription & Billing"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M1 7h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        >
          {/* Current plan */}
          <SettingRow label="Current plan" description="Your active Simplimed subscription">
            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }}
              >
                Pro Plan
              </span>
              <Link href="/plans" className="text-xs font-medium" style={{ color: "var(--color-brand)" }}>
                Manage →
              </Link>
            </div>
          </SettingRow>

          {/* Next billing */}
          <SettingRow label="Next billing date" description="Your subscription renews automatically">
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Jul 9, 2026
            </span>
          </SettingRow>

          {/* Usage meter */}
          <div className="py-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>Monthly analyses used</span>
              <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>12 / Unlimited</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--color-bg-overlay)" }}>
              <div className="h-full rounded-full"
                style={{ width: "24%", backgroundColor: "var(--color-brand)" }} />
            </div>
            <p className="mt-1 text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              Unlimited on Pro — usage shown for your reference
            </p>
          </div>

          {/* Billing portal */}
          <SettingRow label="Billing portal" description="Manage payment method, invoices, and plan changes">
            <button className="btn-secondary gap-1.5 px-3 py-2 text-xs">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Open Portal
            </button>
          </SettingRow>

          {/* Cancel plan */}
          <SettingRow label="Cancel subscription" description="Your Pro access continues until the end of the current billing period">
            <button
              className="rounded-xl border px-3 py-2 text-xs font-medium transition-colors duration-150"
              style={{ borderColor: "var(--color-abnormal-border)", color: "var(--color-abnormal-text)", backgroundColor: "var(--color-abnormal-bg)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              Cancel Plan
            </button>
          </SettingRow>
        </Section>

        {/* ══════════════════════════════════════
            6. CONNECTED INTEGRATIONS
        ══════════════════════════════════════ */}
        <Section
          title="Connected Integrations"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="4" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="12" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M6.5 7L9.5 5M6.5 9L9.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        >
          {[
            {
              name: "Epic EHR",
              desc: "Connect to your hospital's electronic health record system",
              icon: "🏥",
              connected: false,
            },
            {
              name: "Apple Health",
              desc: "Sync vitals and activity data from your iPhone",
              icon: "🍎",
              connected: false,
            },
            {
              name: "Google Fit",
              desc: "Import fitness and activity data from Google Fit",
              icon: "🏃",
              connected: false,
            },
            {
              name: "Fitbit",
              desc: "Sync heart rate, sleep, and step data",
              icon: "⌚",
              connected: false,
            },
          ].map(({ name, desc, icon, connected }) => (
            <SettingRow key={name} label={name} description={desc}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <button
                  className={connected ? "btn-secondary gap-1.5 px-3 py-1.5 text-xs" : "btn-primary gap-1.5 px-3 py-1.5 text-xs"}
                >
                  {connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </SettingRow>
          ))}

          <div className="py-3">
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Integration connections use OAuth 2.0. Simplimed never stores your credentials.
              Data is fetched on-demand and never sold to third parties.
            </p>
          </div>
        </Section>

        {/* ── Bottom save bar ── */}
        <div
          className="flex items-center justify-between rounded-2xl border p-5"
          style={{
            background: "linear-gradient(135deg, var(--color-brand-light) 0%, var(--color-info-bg) 100%)",
            borderColor: "#C7D2FE",
          }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Ready to apply your changes?
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Settings are saved to your account and synced across all devices.
            </p>
          </div>
          <button
            onClick={save}
            className="btn-primary shrink-0 gap-2 px-5 py-2.5 text-sm font-semibold"
            style={{ borderRadius: "0.875rem" }}
          >
            Save Settings
          </button>
        </div>

      </div>
    </>
  );
}
