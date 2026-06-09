"use client";

import Link from "next/link";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
type Severity = "critical" | "warning" | "info";
type Status   = "normal" | "abnormal" | "informational";
type TabKey   = "overview" | "biomarkers" | "trends" | "insights";

interface Biomarker {
  name: string;
  value: number;
  unit: string;
  refMin: number;
  refMax: number;
  status: Status;
  trend: number; // % delta from previous
  category: string;
}

interface Insight {
  id: string;
  title: string;
  body: string;
  severity: Severity;
  relatedMarkers: string[];
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mock data
───────────────────────────────────────────────────────────────────────────── */
const BIOMARKERS: Biomarker[] = [
  { name: "HbA1c",             value: 6.1,   unit: "%",      refMin: 4,    refMax: 5.6,  status: "abnormal",      trend: +4.3,  category: "Glucose" },
  { name: "Fasting Glucose",   value: 110,   unit: "mg/dL",  refMin: 70,   refMax: 99,   status: "abnormal",      trend: +8.9,  category: "Glucose" },
  { name: "Total Cholesterol", value: 218,   unit: "mg/dL",  refMin: 0,    refMax: 199,  status: "abnormal",      trend: +5.1,  category: "Lipids"  },
  { name: "LDL",               value: 142,   unit: "mg/dL",  refMin: 0,    refMax: 99,   status: "abnormal",      trend: +6.7,  category: "Lipids"  },
  { name: "HDL",               value: 58,    unit: "mg/dL",  refMin: 40,   refMax: 200,  status: "normal",        trend: +1.2,  category: "Lipids"  },
  { name: "Triglycerides",     value: 145,   unit: "mg/dL",  refMin: 0,    refMax: 149,  status: "normal",        trend: -2.1,  category: "Lipids"  },
  { name: "Hemoglobin",        value: 11.2,  unit: "g/dL",   refMin: 12,   refMax: 16,   status: "abnormal",      trend: -3.4,  category: "CBC"     },
  { name: "WBC",               value: 7.4,   unit: "×10³/µL",refMin: 4.5,  refMax: 11,   status: "normal",        trend: 0,     category: "CBC"     },
  { name: "Platelets",         value: 210,   unit: "×10³/µL",refMin: 150,  refMax: 400,  status: "normal",        trend: +0.5,  category: "CBC"     },
  { name: "Creatinine",        value: 0.9,   unit: "mg/dL",  refMin: 0.6,  refMax: 1.2,  status: "normal",        trend: 0,     category: "Kidney"  },
  { name: "eGFR",              value: 91,    unit: "mL/min", refMin: 90,   refMax: 120,  status: "normal",        trend: -0.5,  category: "Kidney"  },
  { name: "TSH",               value: 3.1,   unit: "mIU/L",  refMin: 0.4,  refMax: 4.0,  status: "informational", trend: +2.1,  category: "Thyroid" },
  { name: "ALT",               value: 28,    unit: "U/L",    refMin: 7,    refMax: 40,   status: "normal",        trend: -1.0,  category: "Liver"   },
  { name: "AST",               value: 24,    unit: "U/L",    refMin: 10,   refMax: 40,   status: "normal",        trend: 0,     category: "Liver"   },
];

const INSIGHTS: Insight[] = [
  {
    id: "i1",
    title: "Prediabetes Risk — Action Required",
    body: "Your HbA1c of 6.1% and fasting glucose of 110 mg/dL both fall in the prediabetes range. Early lifestyle changes — reducing refined carbohydrates, increasing physical activity, and monitoring blood sugar weekly — can reverse this condition before it progresses to Type 2 Diabetes.",
    severity: "critical",
    relatedMarkers: ["HbA1c", "Fasting Glucose"],
  },
  {
    id: "i2",
    title: "Elevated LDL Cholesterol",
    body: "LDL at 142 mg/dL and total cholesterol at 218 mg/dL are above healthy thresholds. A Mediterranean diet, reducing saturated fats, and regular aerobic exercise are first-line interventions. Discuss statin therapy with your doctor if lifestyle changes are insufficient in 3 months.",
    severity: "warning",
    relatedMarkers: ["LDL", "Total Cholesterol"],
  },
  {
    id: "i3",
    title: "Low Haemoglobin — Possible Anaemia",
    body: "Haemoglobin at 11.2 g/dL is below the normal female range (12–16 g/dL). This may indicate iron-deficiency anaemia or another underlying cause. Consider a serum ferritin and iron panel to determine the root cause. Iron-rich foods and supplementation may help.",
    severity: "warning",
    relatedMarkers: ["Hemoglobin"],
  },
  {
    id: "i4",
    title: "TSH — Upper Normal, Monitor",
    body: "TSH at 3.1 mIU/L is within the normal range but trending upward (+2.1%). If you experience fatigue, weight gain, or cold intolerance, request a full thyroid panel including Free T3 and Free T4 at your next check-up.",
    severity: "info",
    relatedMarkers: ["TSH"],
  },
  {
    id: "i5",
    title: "Kidney and Liver Function Normal",
    body: "Creatinine, eGFR, ALT, and AST are all comfortably within reference ranges. No intervention required. Continue current hydration and avoid nephrotoxic or hepatotoxic medications without medical supervision.",
    severity: "info",
    relatedMarkers: ["Creatinine", "eGFR", "ALT", "AST"],
  },
];

// 12-month glucose trend
const GLUCOSE_TREND = [
  { month: "Jan", hba1c: 5.6, glucose: 92  },
  { month: "Feb", hba1c: 5.7, glucose: 94  },
  { month: "Mar", hba1c: 5.7, glucose: 97  },
  { month: "Apr", hba1c: 5.8, glucose: 98  },
  { month: "May", hba1c: 5.8, glucose: 100 },
  { month: "Jun", hba1c: 5.9, glucose: 103 },
  { month: "Jul", hba1c: 6.0, glucose: 105 },
  { month: "Aug", hba1c: 6.0, glucose: 107 },
  { month: "Sep", hba1c: 6.1, glucose: 108 },
  { month: "Oct", hba1c: 6.1, glucose: 110 },
  { month: "Nov", hba1c: 6.1, glucose: 113 },
  { month: "Dec", hba1c: 6.1, glucose: 115 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */
const CATEGORIES = Array.from(new Set(BIOMARKERS.map((b) => b.category)));

function statusStyle(s: Status) {
  if (s === "abnormal")      return { card: "bg-rose-50 border-rose-200",    badge: "bg-rose-100 text-rose-700",   val: "text-rose-700",   label: "Elevated" };
  if (s === "informational") return { card: "bg-blue-50 border-blue-200",    badge: "bg-blue-100 text-blue-700",   val: "text-blue-700",   label: "Monitor"  };
  return                            { card: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", val: "text-emerald-700", label: "Normal" };
}

function severityStyle(s: Severity) {
  if (s === "critical") return { banner: "bg-rose-50 border-rose-200",   icon: "bg-rose-100",   iconColor: "#E11D48", text: "text-rose-700",   sub: "text-rose-600",   dot: "bg-rose-500"   };
  if (s === "warning")  return { banner: "bg-amber-50 border-amber-200", icon: "bg-amber-100",  iconColor: "#D97706", text: "text-amber-800",  sub: "text-amber-700",  dot: "bg-amber-500"  };
  return                       { banner: "bg-blue-50 border-blue-200",   icon: "bg-blue-100",   iconColor: "#2563EB", text: "text-blue-800",   sub: "text-blue-700",   dot: "bg-blue-400"   };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Trend Chart — glucose over 12 months
───────────────────────────────────────────────────────────────────────────── */
function GlucoseTrendChart() {
  const W = 600, H = 160, PL = 36, PR = 12, PT = 14, PB = 26;
  const cW = W - PL - PR, cH = H - PT - PB;
  const vals = GLUCOSE_TREND.map((d) => d.glucose);
  const minV = 80, maxV = 125;

  const px = (i: number) => +(PL + (i / (vals.length - 1)) * cW).toFixed(2);
  const py = (v: number) => +(PT + cH - ((v - minV) / (maxV - minV)) * cH).toFixed(2);

  const polyline = vals.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const area = [`${px(0)},${PT + cH}`, ...vals.map((v, i) => `${px(i)},${py(v)}`), `${px(vals.length - 1)},${PT + cH}`].join(" ");

  const segColors = ["#10B981","#10B981","#10B981","#FBBF24","#FBBF24","#F97316","#F97316","#EF4444","#EF4444","#EF4444","#EF4444","#EF4444"];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 320 }} aria-label="Blood glucose trend">
        <defs>
          <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[85,90,95,100,105,110,115,120].map((v) => (
          <g key={v}>
            <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 3" />
            <text x={PL - 4} y={py(v) + 4} textAnchor="end" fontSize="9" fill="#94A3B8">{v}</text>
          </g>
        ))}

        {/* Normal band */}
        <rect x={PL} y={py(99)} width={cW} height={py(70) - py(99)} fill="#ECFDF5" opacity="0.35" />
        <text x={PL + 4} y={py(99) - 3} fontSize="8" fill="#059669" fontWeight="600">Normal ≤ 99</text>

        {/* Pre-diabetes band */}
        <rect x={PL} y={py(125)} width={cW} height={py(99) - py(125)} fill="#FFFBEB" opacity="0.55" />
        <text x={PL + 4} y={py(112)} fontSize="8" fill="#D97706" fontWeight="600">Pre-diabetes</text>

        {/* Area fill */}
        <polygon points={area} fill="url(#ag)" />

        {/* Coloured line segments */}
        {vals.slice(0, -1).map((v, i) => (
          <line key={i} x1={px(i)} y1={py(v)} x2={px(i+1)} y2={py(vals[i+1])}
            stroke={segColors[i]} strokeWidth="2.5" strokeLinecap="round" />
        ))}

        {/* Dots */}
        {vals.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r="4" fill={segColors[i]} stroke="#fff" strokeWidth="1.5" />
        ))}

        {/* Month labels */}
        {GLUCOSE_TREND.map((d, i) => (
          <text key={i} x={px(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#94A3B8">{d.month}</text>
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HbA1c Gauge (pre-computed paths, no SSR float drift)
   Wider viewBox + labels repositioned below arc to avoid clipping
───────────────────────────────────────────────────────────────────────────── */
const GCX = 120, GCY = 110, GR = 88;
function gPt(deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: +(GCX + GR * Math.cos(a)).toFixed(4), y: +(GCY + GR * Math.sin(a)).toFixed(4) };
}
function gArc(s: number, e: number) {
  const sp = gPt(s), ep = gPt(e);
  return `M ${sp.x} ${sp.y} A ${GR} ${GR} 0 ${e - s > 180 ? 1 : 0} 1 ${ep.x} ${ep.y}`;
}
const G_TRACK    = gArc(180, 360);
const G_NORMAL   = gArc(180, +(180 + (1.7 / 6) * 180).toFixed(4));
const G_PRE      = gArc(+(180 + (1.7 / 6) * 180).toFixed(4), +(180 + (2.5 / 6) * 180).toFixed(4));
const G_DIABETES = gArc(+(180 + (2.5 / 6) * 180).toFixed(4), 360);
const G_NEEDLE   = gPt(180 + ((6.1 - 4) / 6) * 180);

function HbA1cGauge() {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="20 5 200 130" width="100%" style={{ maxWidth: 260 }} aria-label="HbA1c gauge">
        {/* Background track */}
        <path d={G_TRACK}    fill="none" stroke="#F1F5F9" strokeWidth={18} strokeLinecap="round" />
        {/* Zone arcs */}
        <path d={G_NORMAL}   fill="none" stroke="#6EE7B7" strokeWidth={18} />
        <path d={G_PRE}      fill="none" stroke="#FCD34D" strokeWidth={18} />
        <path d={G_DIABETES} fill="none" stroke="#FDA4AF" strokeWidth={18} />
        {/* Needle */}
        <line
          x1={GCX} y1={GCY}
          x2={G_NEEDLE.x} y2={G_NEEDLE.y}
          stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx={GCX} cy={GCY} r="5" fill="#0F172A" />
        {/* Centre value label — sits just below pivot */}
        <text x={GCX} y={GCY + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">
          6.1%
        </text>
        {/* Zone labels — placed outside the arc, near each zone's midpoint */}
        {/* Normal midpoint ≈ 180 + (1.7/6)*90 → ~231° → left-bottom area */}
        <text x="44"  y="125" textAnchor="middle" fontSize="7.5" fill="#059669" fontWeight="700">Normal</text>
        {/* Pre-DM midpoint ≈ centre top */}
        <text x="120" y="40"  textAnchor="middle" fontSize="7.5" fill="#D97706" fontWeight="700">Pre-DM</text>
        {/* Diabetes → right-bottom area */}
        <text x="196" y="125" textAnchor="middle" fontSize="7.5" fill="#E11D48" fontWeight="700">Diabetes</text>
      </svg>

      {/* Threshold key */}
      <div className="mt-1 flex w-full justify-between text-[10px] font-medium px-1">
        <span className="text-emerald-600">{"<"} 5.7% Normal</span>
        <span className="text-amber-500">5.7–6.4% Pre</span>
        <span className="text-rose-500">{"≥"} 6.5% DM</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Range bar
───────────────────────────────────────────────────────────────────────────── */
function RangeBar({ marker }: { marker: Biomarker }) {
  const { refMin, refMax, value } = marker;
  const displayMin = refMin === 0 ? refMax * 0 : refMin;
  const chartMin   = Math.min(displayMin * 0.8, value * 0.85);
  const chartMax   = Math.max(refMax * 1.2, value * 1.15);
  const span       = chartMax - chartMin;
  const pct        = Math.min(Math.max(((value - chartMin) / span) * 100, 0), 100);
  const leftPct    = ((Math.max(refMin, chartMin) - chartMin) / span) * 100;
  const widthPct   = (Math.min(refMax, chartMax) - Math.max(refMin, chartMin)) / span * 100;

  return (
    <div className="mt-2">
      <div className="relative h-3 w-full overflow-visible rounded-full bg-slate-100">
        {/* Normal zone */}
        <div className="absolute h-full rounded-full bg-emerald-200"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />
        {/* Value marker */}
        <div
          className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800 shadow"
          style={{ left: `${pct}%` }}
          title={`${value} ${marker.unit}`}
        />
      </div>
      <div className="mt-1 flex justify-between text-[9px] text-slate-400">
        <span>{chartMin.toFixed(1)}</span>
        <span>Ref: {refMin === 0 ? `< ${refMax}` : `${refMin}–${refMax}`} {marker.unit}</span>
        <span>{chartMax.toFixed(1)}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Insight card
───────────────────────────────────────────────────────────────────────────── */
function InsightCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false);
  const s = severityStyle(insight.severity);

  const SevIcon = () => {
    if (insight.severity === "critical") return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2L1 14h14L8 2Z" stroke={s.iconColor} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6v4" stroke={s.iconColor} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.7" fill={s.iconColor} />
      </svg>
    );
    if (insight.severity === "warning") return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke={s.iconColor} strokeWidth="1.5" />
        <path d="M8 5v3.5" stroke={s.iconColor} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.7" fill={s.iconColor} />
      </svg>
    );
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke={s.iconColor} strokeWidth="1.5" />
        <path d="M8 7v5" stroke={s.iconColor} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="5" r="0.7" fill={s.iconColor} />
      </svg>
    );
  };

  return (
    <div className={`rounded-2xl border p-5 ${s.banner}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${s.icon}`}>
          <SevIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-bold ${s.text}`}>{insight.title}</p>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`shrink-0 rounded-lg p-1 text-xs font-medium transition-colors ${s.text}`}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
                className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Related markers */}
          <div className="mt-1 flex flex-wrap gap-1">
            {insight.relatedMarkers.map((m) => (
              <span key={m} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.icon} ${s.sub}`}>
                {m}
              </span>
            ))}
          </div>

          {expanded && (
            <p className={`mt-3 text-sm leading-relaxed ${s.sub}`}>{insight.body}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function AnalysisPage() {
  const [activeTab,    setActiveTab]    = useState<TabKey>("overview");
  const [filterCat,   setFilterCat]    = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredMarkers = BIOMARKERS.filter((b) => {
    const catOk    = filterCat    === "All" || b.category === filterCat;
    const statusOk = filterStatus === "All" || b.status === filterStatus;
    return catOk && statusOk;
  });

  const flaggedCount = BIOMARKERS.filter((b) => b.status === "abnormal").length;
  const normalCount  = BIOMARKERS.filter((b) => b.status === "normal").length;
  const monitorCount = BIOMARKERS.filter((b) => b.status === "informational").length;
  const totalCount   = BIOMARKERS.length;
  const healthScore  = Math.round((normalCount / totalCount) * 100);

  const TABS: { key: TabKey; label: string }[] = [
    { key: "overview",   label: "Overview"   },
    { key: "biomarkers", label: "Biomarkers" },
    { key: "trends",     label: "Trends"     },
    { key: "insights",   label: "Insights"   },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Health Analysis
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Based on your latest reports · Last updated 2 days ago
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary gap-1.5 px-4 py-2.5 text-sm"
            onClick={() => window.print()}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 10V3M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Export PDF
          </button>
          <Link href="/chat"
            className="btn-primary gap-1.5 px-4 py-2.5 text-sm font-semibold"
            style={{ borderRadius: "0.875rem" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            New Analysis
          </Link>
        </div>
      </div>

      {/* ── Summary stat strip ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Health Score",  value: `${healthScore}%`, color: healthScore >= 70 ? "var(--color-normal-text)" : "var(--color-abnormal-text)", bg: healthScore >= 70 ? "var(--color-normal-bg)" : "var(--color-abnormal-bg)" },
          { label: "Normal",        value: normalCount,  color: "var(--color-normal-text)",   bg: "var(--color-normal-bg)"   },
          { label: "Flagged",       value: flaggedCount, color: "var(--color-abnormal-text)", bg: "var(--color-abnormal-bg)" },
          { label: "Monitor",       value: monitorCount, color: "var(--color-info-text)",     bg: "var(--color-info-bg)"     },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
              style={{ backgroundColor: bg, color }}>{value}</div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Alert banner ── */}
      {flaggedCount > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 2L1.5 15.5h15L9 2Z" stroke="#E11D48" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M9 7v4" stroke="#E11D48" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="9" cy="12.5" r="0.75" fill="#E11D48" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-800">
                {flaggedCount} biomarkers outside healthy range
              </p>
              <p className="mt-0.5 text-xs text-rose-700">
                HbA1c, Fasting Glucose, LDL, Total Cholesterol, and Haemoglobin need attention.
                Review the Insights tab for actionable recommendations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("insights")}
              className="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--color-abnormal-text)" }}>
              View Insights
            </button>
          </div>
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="flex overflow-x-auto rounded-xl border"
        style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="flex-1 shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap"
            style={activeTab === key
              ? { color: "var(--color-brand)", borderBottom: "2px solid var(--color-brand)", backgroundColor: "var(--color-brand-light)" }
              : { color: "var(--color-text-secondary)", borderBottom: "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TAB: OVERVIEW
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Left: status summary + top flagged */}
          <div className="flex flex-col gap-5 xl:col-span-2">

            {/* Status breakdown */}
            <div className="card p-5">
              <p className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Result Breakdown
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Normal",        count: normalCount,  total: totalCount, color: "#059669", bg: "#ECFDF5" },
                  { label: "Flagged",       count: flaggedCount, total: totalCount, color: "#E11D48", bg: "#FFF1F2" },
                  { label: "Monitor",       count: monitorCount, total: totalCount, color: "#2563EB", bg: "#EFF6FF" },
                ].map(({ label, count, total, color, bg }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{label}</span>
                    <div className="flex-1 overflow-hidden rounded-full h-2.5" style={{ backgroundColor: "var(--color-bg-overlay)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(count / total) * 100}%`, backgroundColor: color }} />
                    </div>
                    <span className="w-6 shrink-0 text-right text-xs font-bold" style={{ color }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top flagged biomarkers */}
            <div className="card overflow-hidden">
              <div className="border-b px-5 py-4" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Flagged Biomarkers</p>
              </div>
              {BIOMARKERS.filter((b) => b.status !== "normal").map((b) => {
                const st = statusStyle(b.status);
                return (
                  <div key={b.name}
                    className="flex items-center justify-between border-b px-5 py-3.5"
                    style={{ borderColor: "var(--color-border)" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{b.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        Ref: {b.refMin === 0 ? `< ${b.refMax}` : `${b.refMin}–${b.refMax}`} {b.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${st.val}`}>{b.value} {b.unit}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${st.badge}`}>{st.label}</span>
                      <span className={`text-xs font-medium ${b.trend > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                        {b.trend > 0 ? "▲" : "▼"} {Math.abs(b.trend)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: gauge + category breakdown */}
          <div className="flex flex-col gap-5">
            <div className="card p-5">
              <p className="mb-2 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>HbA1c Gauge</p>
              <p className="mb-4 text-xs" style={{ color: "var(--color-text-muted)" }}>Glycated haemoglobin — diagnostic range</p>
              <HbA1cGauge />
            </div>

            <div className="card p-5">
              <p className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>By Category</p>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => {
                  const items   = BIOMARKERS.filter((b) => b.category === cat);
                  const flagged = items.filter((b) => b.status === "abnormal").length;
                  return (
                    <div key={cat} className="flex items-center justify-between rounded-xl px-3 py-2.5"
                      style={{ backgroundColor: flagged > 0 ? "var(--color-abnormal-bg)" : "var(--color-bg-subtle)" }}>
                      <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{items.length} markers</span>
                        {flagged > 0 && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                            {flagged} flagged
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: BIOMARKERS
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "biomarkers" && (
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-1">
              {["All", ...CATEGORIES].map((cat) => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                  style={filterCat === cat
                    ? { backgroundColor: "var(--color-brand)", color: "#fff", borderColor: "var(--color-brand)" }
                    : { backgroundColor: "var(--color-bg-base)", color: "var(--color-text-secondary)", borderColor: "var(--color-border)" }}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {["All", "normal", "abnormal", "informational"].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-150"
                  style={filterStatus === s
                    ? { backgroundColor: "var(--color-brand)", color: "#fff", borderColor: "var(--color-brand)" }
                    : { backgroundColor: "var(--color-bg-base)", color: "var(--color-text-secondary)", borderColor: "var(--color-border)" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Biomarker cards grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMarkers.map((b) => {
              const st = statusStyle(b.status);
              return (
                <div key={b.name} className={`rounded-2xl border p-4 ${st.card}`}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">{b.category}</p>
                      <p className="text-sm font-semibold text-slate-900">{b.name}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${st.badge}`}>{st.label}</span>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold tracking-tight ${st.val}`}>{b.value}</span>
                    <span className="mb-0.5 text-xs text-slate-400">{b.unit}</span>
                    {b.trend !== 0 && (
                      <span className={`mb-0.5 ml-auto text-xs font-semibold ${b.trend > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                        {b.trend > 0 ? "▲" : "▼"} {Math.abs(b.trend)}%
                      </span>
                    )}
                  </div>

                  <RangeBar marker={b} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: TRENDS
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "trends" && (
        <div className="flex flex-col gap-5">

          {/* Glucose trend chart */}
          <div className="card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">Blood Sugar Trend</p>
                <p className="text-xs text-slate-400">Fasting glucose — last 12 months (mg/dL)</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                ▲ Rising trend
              </span>
            </div>
            <GlucoseTrendChart />
            <div className="mt-3 flex flex-wrap gap-4">
              {[
                { color: "#10B981", label: "Normal range"  },
                { color: "#FBBF24", label: "Borderline"    },
                { color: "#EF4444", label: "Elevated"      },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HbA1c range bar */}
          <div className="card p-5">
            <p className="mb-1 text-sm font-bold text-slate-900">HbA1c — Diagnostic Range</p>
            <p className="mb-4 text-xs text-slate-400">Where your current value sits relative to clinical thresholds</p>
            <div className="relative">
              <div className="flex h-5 w-full overflow-hidden rounded-full">
                <div className="h-full flex-[28.3%] bg-emerald-400" />
                <div className="h-full flex-[13.3%] bg-amber-400"   />
                <div className="h-full flex-[58.3%] bg-rose-500"    />
              </div>
              {/* Tag at 6.1% */}
              <div className="absolute -top-7 -translate-x-1/2" style={{ left: "35%" }}>
                <div className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white shadow">6.1%</div>
                <div className="mx-auto h-2 w-px bg-slate-900" />
              </div>
              <div className="absolute top-0 h-5 w-0.5 bg-slate-900" style={{ left: "35%" }} />
            </div>
            <div className="mt-2 flex justify-between text-[10px]">
              <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400"/><span className="text-slate-500">Normal {"<"}5.7%</span></div>
              <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="text-slate-500">Pre 5.7–6.4%</span></div>
              <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"  /><span className="text-slate-500">DM {"≥"}6.5%</span></div>
            </div>
          </div>

          {/* Month-over-month delta table */}
          <div className="card overflow-hidden">
            <div className="border-b px-5 py-4" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Glucose Month-over-Month
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <thead>
                  <tr style={{ backgroundColor: "var(--color-bg-subtle)", borderBottom: "1px solid var(--color-border)" }}>
                    {["Month","HbA1c (%)","Change","Glucose (mg/dL)","Change"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold"
                        style={{ color: "var(--color-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {GLUCOSE_TREND.map((row, i) => {
                    const prevA1c  = i > 0 ? GLUCOSE_TREND[i-1].hba1c   : row.hba1c;
                    const prevGluc = i > 0 ? GLUCOSE_TREND[i-1].glucose : row.glucose;
                    const dA1c     = +(row.hba1c   - prevA1c ).toFixed(2);
                    const dGluc    = row.glucose - prevGluc;
                    return (
                      <tr key={row.month}
                        style={{ borderBottom: "1px solid var(--color-border-muted)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}>
                        <td className="px-4 py-2.5 text-xs font-medium text-slate-700">{row.month}</td>
                        <td className="px-4 py-2.5 text-xs font-bold"
                          style={{ color: row.hba1c >= 5.7 ? "var(--color-abnormal-text)" : "var(--color-normal-text)" }}>
                          {row.hba1c}%
                        </td>
                        <td className={`px-4 py-2.5 text-xs font-medium ${dA1c > 0 ? "text-rose-500" : dA1c < 0 ? "text-emerald-600" : "text-slate-400"}`}>
                          {i === 0 ? "—" : `${dA1c > 0 ? "+" : ""}${dA1c}`}
                        </td>
                        <td className="px-4 py-2.5 text-xs font-bold"
                          style={{ color: row.glucose >= 100 ? "var(--color-abnormal-text)" : "var(--color-normal-text)" }}>
                          {row.glucose}
                        </td>
                        <td className={`px-4 py-2.5 text-xs font-medium ${dGluc > 0 ? "text-rose-500" : dGluc < 0 ? "text-emerald-600" : "text-slate-400"}`}>
                          {i === 0 ? "—" : `${dGluc > 0 ? "+" : ""}${dGluc}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: INSIGHTS
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "insights" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {INSIGHTS.length} AI-generated insights based on your latest report data. Click any card to expand.
          </p>
          {INSIGHTS.map((ins) => (
            <InsightCard key={ins.id} insight={ins} />
          ))}

          {/* Doctor questions */}
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--color-brand-light)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" stroke="var(--color-brand)" strokeWidth="1.4" />
                  <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5s1.5.67 1.5 1.5c0 1-1.5 1.5-1.5 2.5"
                    stroke="var(--color-brand)" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="8" cy="11.5" r="0.7" fill="var(--color-brand)" />
                </svg>
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                Questions to Ask Your Doctor
              </p>
            </div>
            <ol className="flex flex-col gap-3">
              {[
                "Am I currently considered prediabetic based on these results?",
                "Should I start medication for my cholesterol, or can diet alone fix it?",
                "What is causing my low haemoglobin — should I test for iron deficiency?",
                "What HbA1c target should I aim for in 3 months with lifestyle changes?",
                "Do I need a full thyroid panel given my TSH trend?",
              ].map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}>
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{q}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
