"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────────────────────── */
interface CenterStageProps {
  query: string;
  fileNames?: string[];
  isLoading: boolean;
  onOpenChat?: () => void;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────────────────────────────────────── */
function Skeleton({ h = "h-32", w = "w-full" }: { h?: string; w?: string }) {
  return <div className={`${h} ${w} animate-pulse rounded-2xl bg-slate-100`} />;
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <Skeleton h="h-6" w="w-56" />
        <Skeleton h="h-9" w="w-36" />
      </div>
      <Skeleton h="h-28" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h="h-28" />)}
      </div>
      <Skeleton h="h-52" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton h="h-40" />
        <Skeleton h="h-40" />
      </div>
      <Skeleton h="h-20" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton h="h-28" />
        <Skeleton h="h-28" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ① HEADER ROW
───────────────────────────────────────────────────────────────────────────── */
function HeaderRow({ onOpenChat }: { onOpenChat?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "var(--color-brand-light)" }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="16" height="16" rx="3" stroke="var(--color-brand)" strokeWidth="1.75" />
            <path d="M7 11h8M11 7v8" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Health Report
          </p>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            Hi, John — here is your health report summary
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-semibold transition-colors duration-150"
            style={{ borderColor: "var(--color-brand)", color: "var(--color-brand)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.color = "var(--color-brand)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 3h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 2.5V4a1 1 0 0 1 1-1Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Chat with AI
          </button>
        )}
        <button
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors duration-150"
          style={{ backgroundColor: "var(--color-brand)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)")}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v8M5 8l3 3 3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 13h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          Download Report
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ② ALERT BANNER — Prediabetes
───────────────────────────────────────────────────────────────────────────── */
function AlertBanner() {
  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-wrap items-start gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L2 20h20L12 2Z" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 9v5" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1" fill="#D97706" />
          </svg>
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-800">⚠️ Prediabetes Detected</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700">
            Your HbA1c of <strong>6.1%</strong> and fasting glucose of <strong>110 mg/dL</strong> fall
            within the prediabetes range. Early lifestyle adjustments can reverse this condition
            and prevent progression to Type 2 Diabetes.
          </p>
        </div>

        {/* Risk progress meter */}
        <div className="w-full sm:w-48 shrink-0">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-semibold text-amber-700">Risk Level</span>
            <span className="text-[10px] font-bold text-amber-800">Moderate — 64%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: "64%",
                background: "linear-gradient(90deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)",
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[9px] font-medium text-amber-600">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ③ KEY FINDINGS CARDS
───────────────────────────────────────────────────────────────────────────── */
type CardStatus = "elevated-rose" | "elevated-amber" | "normal";

interface FindingCard {
  label: string;
  value: string;
  unit: string;
  ref: string;
  status: CardStatus;
  trend: number; // % change from last reading
}

const FINDINGS: FindingCard[] = [
  { label: "HbA1c",          value: "6.1",  unit: "%",     ref: "< 5.7%",      status: "elevated-amber", trend: +4.3 },
  { label: "Fasting Glucose", value: "110",  unit: "mg/dL", ref: "70–99 mg/dL", status: "elevated-amber", trend: +8.9 },
  { label: "Total Cholesterol",value: "218", unit: "mg/dL", ref: "< 200 mg/dL", status: "elevated-rose",  trend: +5.1 },
  { label: "LDL",             value: "142",  unit: "mg/dL", ref: "< 100 mg/dL", status: "elevated-rose",  trend: +6.7 },
  { label: "HDL",             value: "58",   unit: "mg/dL", ref: "> 40 mg/dL",  status: "normal",         trend: +1.2 },
  { label: "Triglycerides",   value: "145",  unit: "mg/dL", ref: "< 150 mg/dL", status: "normal",         trend: -2.1 },
  { label: "Blood Pressure",  value: "122/80",unit: "mmHg", ref: "< 120/80",    status: "normal",         trend: 0 },
  { label: "eGFR",            value: "91",   unit: "mL/min",ref: "≥ 90",        status: "normal",         trend: -0.5 },
];

function statusStyle(s: CardStatus) {
  if (s === "elevated-rose")
    return {
      card:  "bg-rose-50 border-rose-200",
      badge: "bg-rose-100 text-rose-700",
      value: "text-rose-700",
      label: "Elevated",
    };
  if (s === "elevated-amber")
    return {
      card:  "bg-amber-50 border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      value: "text-amber-700",
      label: "High",
    };
  return {
    card:  "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
    label: "Normal",
  };
}

function FindingsGrid() {
  return (
    <div>
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Key Findings
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {FINDINGS.map((f) => {
          const st = statusStyle(f.status);
          return (
            <div key={f.label} className={`flex flex-col gap-1.5 rounded-xl border p-3 ${st.card}`}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-slate-500">{f.label}</p>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${st.badge}`}>
                  {st.label}
                </span>
              </div>
              <p className={`text-xl font-bold tracking-tight ${st.value}`}>
                {f.value}
                <span className="ml-1 text-[10px] font-normal text-slate-400">{f.unit}</span>
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-slate-400">Ref: {f.ref}</p>
                {f.trend !== 0 && (
                  <span
                    className={`text-[9px] font-semibold ${f.trend > 0 ? "text-rose-500" : "text-emerald-600"}`}
                  >
                    {f.trend > 0 ? "▲" : "▼"} {Math.abs(f.trend)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ④ BLOOD SUGAR TREND CHART — pure SVG polyline
───────────────────────────────────────────────────────────────────────────── */
const TREND_DATA = [
  { month: "Jan", value: 92 },
  { month: "Feb", value: 94 },
  { month: "Mar", value: 97 },
  { month: "Apr", value: 98 },
  { month: "May", value: 100 },
  { month: "Jun", value: 103 },
  { month: "Jul", value: 105 },
  { month: "Aug", value: 107 },
  { month: "Sep", value: 108 },
  { month: "Oct", value: 110 },
  { month: "Nov", value: 113 },
  { month: "Dec", value: 115 },
];

function BloodSugarChart() {
  const W = 640;
  const H = 160;
  const PAD_L = 36;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 28;

  const minV = 80;
  const maxV = 125;

  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  function px(i: number) {
    return PAD_L + (i / (TREND_DATA.length - 1)) * chartW;
  }
  function py(v: number) {
    return PAD_T + chartH - ((v - minV) / (maxV - minV)) * chartH;
  }

  const points = TREND_DATA.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");

  // Reference bands
  const normalY  = py(100); // < 100 normal
  const preDiabY = py(126); // > 125 diabetes

  // Gradient colour per segment: early green → amber → orange-red
  const segColors = [
    "#10B981", "#10B981", "#10B981",
    "#FBBF24", "#FBBF24",
    "#F97316", "#F97316",
    "#EF4444", "#EF4444", "#EF4444", "#EF4444", "#EF4444",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-900">Blood Sugar Trend</p>
          <p className="text-[10px] text-slate-400">Fasting glucose — last 12 months (mg/dL)</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
          ▲ Rising
        </span>
      </div>

      {/* SVG chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 320 }}
          aria-label="Blood sugar trend chart"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal reference lines */}
          {[85, 90, 95, 100, 105, 110, 115, 120].map((v) => (
            <g key={v}>
              <line
                x1={PAD_L} y1={py(v)} x2={W - PAD_R} y2={py(v)}
                stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 3"
              />
              <text x={PAD_L - 4} y={py(v) + 4} textAnchor="end"
                fontSize="9" fill="#94A3B8">
                {v}
              </text>
            </g>
          ))}

          {/* Normal threshold band (≤100) */}
          <rect
            x={PAD_L} y={py(100)}
            width={chartW} height={chartH - (py(100) - PAD_T)}
            fill="#ECFDF5" opacity="0.4"
          />
          <text x={PAD_L + 4} y={py(100) - 4} fontSize="8" fill="#059669" fontWeight="600">
            Normal ≤ 100
          </text>

          {/* Prediabetes band (100–125) */}
          <rect
            x={PAD_L} y={py(125)}
            width={chartW} height={py(100) - py(125)}
            fill="#FFFBEB" opacity="0.6"
          />
          <text x={PAD_L + 4} y={py(112)} fontSize="8" fill="#D97706" fontWeight="600">
            Pre-diabetes
          </text>

          {/* Area fill */}
          <polygon
            points={[
              `${px(0)},${PAD_T + chartH}`,
              ...TREND_DATA.map((d, i) => `${px(i)},${py(d.value)}`),
              `${px(TREND_DATA.length - 1)},${PAD_T + chartH}`,
            ].join(" ")}
            fill="url(#areaGrad)"
          />

          {/* Coloured line segments */}
          {TREND_DATA.slice(0, -1).map((d, i) => (
            <line
              key={i}
              x1={px(i)}  y1={py(d.value)}
              x2={px(i + 1)} y2={py(TREND_DATA[i + 1].value)}
              stroke={segColors[i]}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}

          {/* Data point dots */}
          {TREND_DATA.map((d, i) => (
            <circle
              key={i}
              cx={px(i)} cy={py(d.value)} r="4"
              fill={segColors[i]}
              stroke="#fff" strokeWidth="1.5"
            />
          ))}

          {/* Month labels */}
          {TREND_DATA.map((d, i) => (
            <text
              key={i}
              x={px(i)} y={H - 6}
              textAnchor="middle"
              fontSize="9" fill="#94A3B8"
            >
              {d.month}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4">
        {[
          { color: "#10B981", label: "Normal range" },
          { color: "#FBBF24", label: "Borderline" },
          { color: "#EF4444", label: "Elevated" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑤ HbA1c HALF-CIRCLE GAUGE — pure inline SVG
   Arc paths are pre-computed as constants to avoid SSR/client floating-point
   precision mismatches that cause React hydration warnings.
───────────────────────────────────────────────────────────────────────────── */

// Gauge geometry
const G_CX = 100;
const G_CY = 100;
const G_R  = 78;

function gaugeArcPoint(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: +(G_CX + G_R * Math.cos(a)).toFixed(4),
    y: +(G_CY + G_R * Math.sin(a)).toFixed(4),
  };
}

function gaugeDescribeArc(startDeg: number, endDeg: number) {
  const s = gaugeArcPoint(startDeg);
  const e = gaugeArcPoint(endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${G_R} ${G_R} 0 ${large} 1 ${e.x} ${e.y}`;
}

// Zone boundaries (degrees, fixed to avoid float drift)
const GAUGE_NORMAL_END    = +(180 + (1.7 / 6) * 180).toFixed(4); // ~231°
const GAUGE_PRE_END       = +(180 + (2.5 / 6) * 180).toFixed(4); // ~255°

// Pre-computed static path strings — same on server and client
const GAUGE_TRACK_PATH    = gaugeDescribeArc(180, 360);
const GAUGE_NORMAL_PATH   = gaugeDescribeArc(180, GAUGE_NORMAL_END);
const GAUGE_PRE_PATH      = gaugeDescribeArc(GAUGE_NORMAL_END, GAUGE_PRE_END);
const GAUGE_DIABETES_PATH = gaugeDescribeArc(GAUGE_PRE_END, 360);

// Needle for value 6.1% (range 4–10)
const GAUGE_VALUE_PCT     = (6.1 - 4) / (10 - 4);
const GAUGE_NEEDLE_DEG    = 180 + GAUGE_VALUE_PCT * 180;
const GAUGE_NEEDLE_TIP    = gaugeArcPoint(GAUGE_NEEDLE_DEG);

function HbA1cGauge() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-1 text-xs font-bold text-slate-900">HbA1c Gauge</p>
      <p className="mb-2.5 text-[10px] text-slate-400">Glycated haemoglobin — diagnostic range</p>

      <div className="flex flex-col items-center">
        <svg viewBox="40 30 120 80" width="100%" style={{ maxWidth: 240 }} aria-label="HbA1c gauge">
          {/* Background track */}
          <path d={GAUGE_TRACK_PATH} fill="none" stroke="#F1F5F9" strokeWidth={18} strokeLinecap="round" />

          {/* Normal zone (green) */}
          <path d={GAUGE_NORMAL_PATH}   fill="none" stroke="#6EE7B7" strokeWidth={18} />

          {/* Prediabetes zone (amber) */}
          <path d={GAUGE_PRE_PATH}      fill="none" stroke="#FCD34D" strokeWidth={18} />

          {/* Diabetes zone (rose) */}
          <path d={GAUGE_DIABETES_PATH} fill="none" stroke="#FDA4AF" strokeWidth={18} />

          {/* Needle */}
          <line
            x1={G_CX} y1={G_CY}
            x2={GAUGE_NEEDLE_TIP.x} y2={GAUGE_NEEDLE_TIP.y}
            stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx={G_CX} cy={G_CY} r="5" fill="#0F172A" />

          {/* Value label */}
          <text x={G_CX} y={G_CY + 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
            6.1%
          </text>

          {/* Zone labels */}
          <text x="48" y="107" textAnchor="middle" fontSize="6.5" fill="#059669" fontWeight="600">Normal</text>
          <text x="100" y="44" textAnchor="middle" fontSize="6.5" fill="#D97706" fontWeight="600">Pre-DM</text>
          <text x="152" y="107" textAnchor="middle" fontSize="6.5" fill="#E11D48" fontWeight="600">Diabetes</text>
        </svg>

        {/* Range key */}
        <div className="mt-2 flex w-full justify-between text-[10px] font-medium text-slate-400">
          <span className="text-emerald-600">{"<"} 5.7% Normal</span>
          <span className="text-amber-500">5.7–6.4% Pre</span>
          <span className="text-rose-500">{"≥"} 6.5% DM</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑥ RECOMMENDED ACTIONS
───────────────────────────────────────────────────────────────────────────── */
const ACTIONS = [
  { text: "Reduce sugary drinks and refined carbohydrates",            icon: "🥤" },
  { text: "Aim for 30 minutes of moderate exercise, 5 days a week",    icon: "🏃" },
  { text: "Increase dietary fibre — whole grains, legumes, vegetables", icon: "🥦" },
  { text: "Monitor fasting blood sugar weekly at home",                icon: "🩸" },
  { text: "Schedule a follow-up HbA1c test in 3 months",              icon: "📅" },
  { text: "Consider a referral to a registered dietitian",             icon: "👩‍⚕️" },
];

function RecommendedActions() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const doneCount = checked.size;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10l5 5 8-9" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Recommended Actions</p>
            <p className="text-[10px] text-slate-400">{doneCount} of {ACTIONS.length} completed</p>
          </div>
        </div>
        {/* Progress ring */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#E2E8F0" strokeWidth="4" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="#059669" strokeWidth="4"
              strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - doneCount / ACTIONS.length)}`}
              transform="rotate(-90 20 20)" className="transition-all duration-500" />
          </svg>
          <span className="absolute text-[9px] font-bold text-emerald-600">
            {Math.round((doneCount / ACTIONS.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${(doneCount / ACTIONS.length) * 100}%` }} />
      </div>

      {/* Action items */}
      <ul className="flex flex-col gap-2">
        {ACTIONS.map(({ text, icon }, i) => {
          const done = checked.has(i);
          return (
            <li key={i}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
                done
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
              onClick={() => toggle(i)}
            >
              {/* Checkbox */}
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                  done
                    ? "border-emerald-500 bg-emerald-500 shadow-sm"
                    : "border-slate-300 bg-white"
                }`}
              >
                {done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>

              {/* Icon */}
              <span className="text-lg">{icon}</span>

              {/* Text */}
              <span className={`flex-1 text-sm leading-snug ${done ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑦ QUESTIONS TO ASK YOUR DOCTOR
───────────────────────────────────────────────────────────────────────────── */
const DOCTOR_QUESTIONS = [
  { q: "Am I currently considered prediabetic based on these results?",     tag: "Diagnosis"  },
  { q: "Should I make any immediate dietary changes?",                      tag: "Diet"       },
  { q: "Do I need medication at this stage, or can lifestyle changes help?", tag: "Treatment"  },
  { q: "How often should I monitor my blood sugar at home?",                tag: "Monitoring" },
  { q: "What is my target HbA1c in 3 months with lifestyle changes?",      tag: "Goals"      },
];

function DoctorQuestions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="#4F46E5" strokeWidth="1.75" />
            <path d="M8 8c0-1.1.9-2 2-2s2 .9 2 2c0 1.3-2 2-2 3" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="10" cy="14.5" r="1" fill="#4F46E5" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Questions to Ask Your Doctor</p>
          <p className="text-[10px] text-slate-400">Print or screenshot before your next appointment</p>
        </div>
      </div>

      {/* Questions list */}
      <ol className="flex flex-col gap-3">
        {DOCTOR_QUESTIONS.map(({ q, tag }, i) => (
          <li key={i}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 transition-colors duration-150 hover:border-indigo-200 hover:bg-indigo-50/40">
            {/* Number badge */}
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
              style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}
            >
              {i + 1}
            </span>

            <div className="flex-1">
              <p className="text-sm font-medium leading-snug text-slate-800">{q}</p>
              <span className="mt-1.5 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                {tag}
              </span>
            </div>

            {/* Copy/bookmark icon hint */}
            <button className="mt-0.5 shrink-0 rounded-lg p-1 text-slate-300 transition-colors hover:text-indigo-500"
              aria-label={`Copy question ${i + 1}`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M10 4V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v5.5A1.5 1.5 0 0 0 3 10h1" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </li>
        ))}
      </ol>

      {/* Print button */}
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4V1h8v3M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="4" y="10" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        Print Questions
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑧ UNDERSTAND THE NUMBERS — HbA1c range bar
───────────────────────────────────────────────────────────────────────────── */
function RangeBar() {
  const minV = 4, maxV = 10, userV = 6.1;
  const pct = ((userV - minV) / (maxV - minV)) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 13h14M5 9h10M7 5h6" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Understand the Numbers</p>
          <p className="text-xs text-slate-500">HbA1c diagnostic thresholds — where your value sits</p>
        </div>
      </div>

      <div className="relative mt-8">
        {/* Colour bar */}
        <div className="flex h-6 w-full overflow-hidden rounded-full shadow-inner">
          <div className="h-full flex-[28.3%] bg-emerald-400" title="Normal: 4–5.7%" />
          <div className="h-full flex-[13.3%] bg-amber-400" title="Prediabetes: 5.7–6.5%" />
          <div className="h-full flex-[58.3%] bg-rose-500" title="Diabetes: 6.5–10%" />
        </div>

        {/* User value tag */}
        <div
          className="absolute -top-8 -translate-x-1/2"
          style={{ left: `${pct}%` }}
        >
          <div className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            {userV}%
          </div>
          <div className="mx-auto h-2.5 w-px bg-slate-900" />
        </div>

        {/* Tick mark */}
        <div
          className="absolute top-0 h-6 w-0.5 bg-slate-900"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-between text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="text-slate-600">Normal (&lt;5.7%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="text-slate-600">Prediabetes (5.7–6.4%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500" />
          <span className="text-slate-600">Diabetes (≥6.5%)</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑨ AI CONFIDENCE RING
───────────────────────────────────────────────────────────────────────────── */
function AIConfidenceRing({ pct = 91 }: { pct?: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct / 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "var(--color-brand-light)" }}>
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="7" stroke="var(--color-brand)" strokeWidth="1.5" />
            <path d="M9 5v4l3 2" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">AI Interpretation Confidence</p>
          <p className="text-xs text-slate-500">How reliable this analysis is</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        {/* Ring — compact, only % number centered */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 80 80" aria-label={`${pct}% confidence`}>
              <circle cx="40" cy="40" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="40" cy="40" r={r}
                fill="none"
                stroke="url(#confGrad2)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 40 40)"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="confGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-lg font-bold text-slate-900">{pct}%</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">Confidence</span>
        </div>

        {/* Breakdown bars */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
          {[
            { label: "Report completeness", value: 95, color: "#059669" },
            { label: "Biomarker coverage",  value: 88, color: "#4F46E5" },
            { label: "Pattern match",       value: 91, color: "#D97706" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between">
                <span className="text-xs font-medium text-slate-600">{label}</span>
                <span className="text-xs font-bold" style={{ color }}>{value}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${value}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑩ LIFESTYLE TIP CARD
───────────────────────────────────────────────────────────────────────────── */
const LIFESTYLE_ITEMS = [
  { key: "nutrition", emoji: "🥗", label: "Nutrition",  tip: "Mediterranean-style diet recommended", color: "#059669", bg: "#ECFDF5" },
  { key: "fitness",   emoji: "🏃", label: "Fitness",    tip: "150 min/week moderate aerobic activity", color: "#2563EB", bg: "#EFF6FF" },
  { key: "stress",    emoji: "🧘", label: "Stress",     tip: "Mindfulness or breathing exercises daily", color: "#7C3AED", bg: "#F5F3FF" },
  { key: "sleep",     emoji: "😴", label: "Sleep",      tip: "7–9 hours per night for glucose regulation", color: "#D97706", bg: "#FFFBEB" },
];

function LifestyleTipCard() {
  const [active, setActive] = useState<Set<string>>(new Set(["nutrition", "fitness"]));

  function toggle(key: string) {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-base">
          🌱
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Lifestyle Tips for You</p>
          <p className="text-xs text-slate-500">Personalised recommendations based on your results</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {LIFESTYLE_ITEMS.map(({ key, emoji, label, tip, color, bg }) => {
          const on = active.has(key);
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200 ${
                on
                  ? "shadow-sm"
                  : "opacity-50 grayscale"
              }`}
              style={on
                ? { backgroundColor: bg, borderColor: color + "40" }
                : { backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }
              }
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-2xl">{emoji}</span>
                {/* Toggle indicator */}
                <span
                  className={`h-4 w-4 rounded-full border-2 transition-all ${
                    on ? "border-current bg-current" : "border-slate-300 bg-white"
                  }`}
                  style={on ? { borderColor: color, backgroundColor: color } : {}}
                >
                  {on && (
                    <svg viewBox="0 0 10 10" fill="none" className="h-full w-full p-0.5" aria-hidden="true">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: on ? color : "#94A3B8" }}>
                  {label}
                </p>
                <p className="mt-0.5 text-xs leading-snug" style={{ color: on ? "#475569" : "#94A3B8" }}>
                  {tip}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────────────────────────────────────
   ROOT — CenterStage
───────────────────────────────────────────────────────────────────────────── */
export default function CenterStage({ query, fileNames = [], isLoading, onOpenChat }: CenterStageProps) {
  if (isLoading) return <LoadingState />;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-5 p-5">

        {/* ① Header */}
        <HeaderRow onOpenChat={onOpenChat} />

        {/* ② Alert banner */}
        <AlertBanner />

        {/* ⑧ Range bar */}
        <RangeBar />

        {/* ⑥ + ⑦  Recommended actions + Doctor questions — side by side */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RecommendedActions />
          <DoctorQuestions />
        </div>

        {/* ⑨ + ⑩  AI confidence + Lifestyle tip — side by side */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AIConfidenceRing pct={91} />
          <LifestyleTipCard />
        </div>

        {/* Disclaimer */}
        <p className="pb-2 text-center text-[10px] leading-relaxed text-slate-400">
          Simplimed AI analysis is for informational purposes only and does not constitute medical advice.
          Always consult a qualified healthcare professional for diagnosis and treatment decisions.
        </p>

      </div>
    </div>
  );
}
