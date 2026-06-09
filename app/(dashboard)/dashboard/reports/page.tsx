"use client";

import Link from "next/link";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
type ReportStatus = "completed" | "processing" | "failed";
type ReportType   = "Blood Panel" | "Metabolic" | "Thyroid" | "Urinalysis" | "Lipid" | "Imaging" | "Pathology";
type FilterTab    = "all" | "completed" | "processing" | "failed";

interface Report {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  uploadedAt: string;
  status: ReportStatus;
  flaggedCount: number;
  normalCount: number;
  fileSize: string;
  aiSummary: string;
}

const REPORTS: Report[] = [
  { id: "r1", title: "Complete Blood Count (CBC)",       type: "Blood Panel", date: "Jun 7, 2026",  uploadedAt: "2 days ago",   status: "completed",  flaggedCount: 2, normalCount: 6,  fileSize: "1.2 MB",  aiSummary: "Haemoglobin and WBC are slightly outside reference ranges. Other markers are within normal limits." },
  { id: "r2", title: "Lipid Profile",                    type: "Lipid",       date: "Jun 1, 2026",  uploadedAt: "1 week ago",   status: "completed",  flaggedCount: 2, normalCount: 3,  fileSize: "0.8 MB",  aiSummary: "LDL and total cholesterol are borderline high. HDL is within healthy range. Dietary changes recommended." },
  { id: "r3", title: "Thyroid Function — TSH / T4",      type: "Thyroid",     date: "May 26, 2026", uploadedAt: "2 weeks ago",  status: "completed",  flaggedCount: 0, normalCount: 4,  fileSize: "0.6 MB",  aiSummary: "All thyroid markers are within normal limits. No clinical action required at this time." },
  { id: "r4", title: "Urinalysis",                       type: "Urinalysis",  date: "May 10, 2026", uploadedAt: "1 month ago",  status: "completed",  flaggedCount: 1, normalCount: 7,  fileSize: "0.4 MB",  aiSummary: "Trace protein detected. All other urine markers are normal. Recommend repeat in 3 months." },
  { id: "r5", title: "Fasting Glucose & HbA1c",          type: "Metabolic",   date: "May 8, 2026",  uploadedAt: "1 month ago",  status: "completed",  flaggedCount: 2, normalCount: 2,  fileSize: "0.5 MB",  aiSummary: "HbA1c at 6.1% and fasting glucose at 110 mg/dL indicate prediabetes range. Lifestyle intervention advised." },
  { id: "r6", title: "Chest X-Ray Report",               type: "Imaging",     date: "Apr 20, 2026", uploadedAt: "7 weeks ago",  status: "completed",  flaggedCount: 0, normalCount: 5,  fileSize: "3.4 MB",  aiSummary: "No significant abnormalities detected. Lung fields are clear. Cardiac silhouette is normal." },
  { id: "r7", title: "Comprehensive Metabolic Panel",    type: "Metabolic",   date: "Apr 5, 2026",  uploadedAt: "2 months ago", status: "completed",  flaggedCount: 1, normalCount: 11, fileSize: "1.1 MB",  aiSummary: "Creatinine is within normal range. Liver enzymes (ALT, AST) are normal. Electrolytes balanced." },
  { id: "r8", title: "Kidney Function Panel",            type: "Metabolic",   date: "Jun 9, 2026",  uploadedAt: "Just now",     status: "processing", flaggedCount: 0, normalCount: 0,  fileSize: "0.9 MB",  aiSummary: "Analysis in progress…" },
  { id: "r9", title: "MRI — Lumbar Spine",               type: "Imaging",     date: "Mar 14, 2026", uploadedAt: "3 months ago", status: "failed",     flaggedCount: 0, normalCount: 0,  fileSize: "12.7 MB", aiSummary: "File could not be parsed. Please re-upload as a PDF or plain-text report." },
];

const TYPE_COLORS: Record<ReportType, { bg: string; text: string }> = {
  "Blood Panel": { bg: "var(--color-abnormal-bg)", text: "var(--color-abnormal-text)" },
  "Metabolic":   { bg: "var(--color-info-bg)",      text: "var(--color-info-text)"     },
  "Thyroid":     { bg: "var(--color-normal-bg)",    text: "var(--color-normal-text)"   },
  "Urinalysis":  { bg: "var(--color-info-bg)",      text: "var(--color-info-text)"     },
  "Lipid":       { bg: "var(--color-abnormal-bg)", text: "var(--color-abnormal-text)" },
  "Imaging":     { bg: "var(--color-brand-light)",  text: "var(--color-brand)"         },
  "Pathology":   { bg: "#FDF4FF",                   text: "#7C3AED"                    },
};

function StatusBadge({ status }: { status: ReportStatus }) {
  const map = {
    completed:  { label: "Analysed",   cls: "badge-normal"   },
    processing: { label: "Processing", cls: "badge-info"     },
    failed:     { label: "Failed",     cls: "badge-abnormal" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`${cls} flex items-center gap-1`}>
      {status === "processing" && (
        <svg className="animate-spin" width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="7" />
        </svg>
      )}
      {label}
    </span>
  );
}

function TypePill({ type }: { type: ReportType }) {
  const { bg, text } = TYPE_COLORS[type];
  return (
    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: bg, color: text }}>
      {type}
    </span>
  );
}

function ReportRow({ report, onClick }: { report: Report; onClick: () => void }) {
  return (
    <div
      className="flex flex-wrap items-start gap-4 border-b px-5 py-4 transition-colors duration-150 sm:flex-nowrap sm:items-center"
      style={{ borderColor: "var(--color-border)", cursor: "pointer" }}
      onClick={onClick}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)")}
      onMouseLeave={(e)  => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 2h7l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M11 2v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{report.title}</p>
          <TypePill type={report.type} />
        </div>
        <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
          {report.date} · {report.fileSize} · Uploaded {report.uploadedAt}
        </p>
        {report.status === "completed" && (
          <p className="mt-1 line-clamp-1 text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {report.aiSummary}
          </p>
        )}
        {report.status === "failed" && (
          <p className="mt-1 text-xs" style={{ color: "var(--color-abnormal-text)" }}>{report.aiSummary}</p>
        )}
      </div>
      {report.status === "completed" && (
        <div className="flex shrink-0 items-center gap-3">
          {report.flaggedCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-abnormal-text)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--color-abnormal-text)" }}>{report.flaggedCount} flagged</span>
            </div>
          )}
          {report.normalCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-normal-text)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--color-normal-text)" }}>{report.normalCount} normal</span>
            </div>
          )}
        </div>
      )}
      <div className="shrink-0"><StatusBadge status={report.status} /></div>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="hidden shrink-0 sm:block"
        style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
        <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ReportDrawer({ report, onClose }: { report: Report; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(15,23,42,0.35)", backdropFilter: "blur(2px)" }}
        onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto shadow-2xl"
        style={{ backgroundColor: "var(--color-bg-base)", borderLeft: "1px solid var(--color-border)" }}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b px-6 py-5"
          style={{ borderColor: "var(--color-border)" }}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>{report.title}</h2>
              <TypePill type={report.type} />
            </div>
            <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>{report.date} · {report.fileSize}</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-150"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
            aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-6 py-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={report.status} />
            <div className="flex items-center gap-2">
              <Link href="/chat" className="btn-primary gap-1.5 px-4 py-2 text-xs font-semibold">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
                Re-analyse
              </Link>
              <button className="btn-secondary gap-1.5 px-4 py-2 text-xs font-semibold">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 10V3M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Download
              </button>
            </div>
          </div>

          {report.status === "completed" && (
            <div className="rounded-2xl border p-4"
              style={{ backgroundColor: "var(--color-brand-light)", borderColor: "#C7D2FE" }}>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>AI Summary</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>{report.aiSummary}</p>
            </div>
          )}

          {report.status === "completed" && (
            <div>
              <p className="section-label mb-3">Result Breakdown</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Normal metrics",  count: report.normalCount,  total: report.normalCount + report.flaggedCount, color: "var(--color-normal-text)" },
                  { label: "Flagged metrics", count: report.flaggedCount, total: report.normalCount + report.flaggedCount, color: "var(--color-abnormal-text)" },
                ].map(({ label, count, total, color }) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
                      <span className="font-semibold" style={{ color }}>{count} / {total}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-bg-overlay)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%", backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="section-label mb-3">Report Details</p>
            <div className="divide-y rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              {[
                { label: "Report type", value: report.type },
                { label: "Report date", value: report.date },
                { label: "Uploaded",    value: report.uploadedAt },
                { label: "File size",   value: report.fileSize },
                { label: "Status",      value: report.status.charAt(0).toUpperCase() + report.status.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {report.status === "failed" && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-700">Analysis failed</p>
              <p className="mt-1 text-xs text-rose-600">{report.aiSummary}</p>
              <Link href="/chat"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--color-abnormal-text)" }}>
                Re-upload report
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab]           = useState<FilterTab>("all");
  const [search, setSearch]                 = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [sortNewest, setSortNewest]         = useState(true);

  const filtered = REPORTS
    .filter((r) => activeTab === "all" || r.status === activeTab)
    .filter((r) => search.trim() === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
    )
    .sort(() => sortNewest ? -1 : 1);

  const counts = {
    all:        REPORTS.length,
    completed:  REPORTS.filter((r) => r.status === "completed").length,
    processing: REPORTS.filter((r) => r.status === "processing").length,
    failed:     REPORTS.filter((r) => r.status === "failed").length,
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all",        label: `All (${counts.all})`              },
    { key: "completed",  label: `Analysed (${counts.completed})`   },
    { key: "processing", label: `Processing (${counts.processing})` },
    { key: "failed",     label: `Failed (${counts.failed})`        },
  ];

  return (
    <>
      {selectedReport && <ReportDrawer report={selectedReport} onClose={() => setSelectedReport(null)} />}

      <div className="flex flex-col gap-6 pb-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>My Reports</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {counts.all} reports · {counts.completed} analysed · {counts.failed} failed
            </p>
          </div>
          <Link href="/chat" className="btn-primary gap-2 px-5 py-2.5 text-sm font-semibold" style={{ borderRadius: "0.875rem" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            Upload New Report
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Reports", value: counts.all,        color: "var(--color-brand)",         bg: "var(--color-brand-light)" },
            { label: "Analysed",      value: counts.completed,  color: "var(--color-normal-text)",   bg: "var(--color-normal-bg)"   },
            { label: "Processing",    value: counts.processing, color: "var(--color-info-text)",     bg: "var(--color-info-bg)"     },
            { label: "Failed",        value: counts.failed,     color: "var(--color-abnormal-text)", bg: "var(--color-abnormal-bg)" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="card flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
                style={{ backgroundColor: bg, color }}>{value}</div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
            style={{ borderColor: "var(--color-border)" }}>
            <div className="relative flex-1" style={{ maxWidth: 320 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Search reports…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 text-sm" style={{ height: "2.25rem" }} />
            </div>
            <button onClick={() => setSortNewest(!sortNewest)}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors duration-150"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", backgroundColor: "var(--color-bg-base)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-base)")}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {sortNewest ? "Newest first" : "Oldest first"}
            </button>
          </div>

          <div className="flex overflow-x-auto border-b"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="shrink-0 px-5 py-3 text-xs font-semibold transition-colors duration-150"
                style={activeTab === key
                  ? { color: "var(--color-brand)", borderBottom: "2px solid var(--color-brand)", backgroundColor: "var(--color-bg-base)" }
                  : { color: "var(--color-text-muted)", borderBottom: "2px solid transparent" }}>
                {label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--color-bg-overlay)" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                  style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
                  <path d="M5 2h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>No reports found</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {search ? "Try a different search term" : "Upload your first report to get started"}
              </p>
              <Link href="/chat" className="btn-primary mt-1 gap-1.5 px-5 py-2 text-sm">Upload Report</Link>
            </div>
          ) : (
            filtered.map((r) => <ReportRow key={r.id} report={r} onClick={() => setSelectedReport(r)} />)
          )}
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl border p-6"
          style={{ background: "linear-gradient(135deg, var(--color-brand-light) 0%, var(--color-info-bg) 100%)", borderColor: "#C7D2FE" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 3v10M6 9l4-4 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 16h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Have a new report?</p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Upload any PDF, image, or document and get AI-powered analysis in seconds.
                </p>
              </div>
            </div>
            <Link href="/chat" className="btn-primary shrink-0 gap-2 px-5 py-2.5 text-sm font-semibold"
              style={{ borderRadius: "0.875rem" }}>
              Analyse Report
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
