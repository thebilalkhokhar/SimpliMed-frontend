"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────────────────────── */
interface CenterStageProps {
  query: string;
  fileNames?: string[];
  isLoading: boolean;
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
function HeaderRow() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Health Report
        </p>
        <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">
          Hi, John — here is your health report summary
        </h1>
      </div>
      <button
        className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150"
        style={{ backgroundColor: "var(--color-brand)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand-hover)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)")}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 3v8M5 8l3 3 3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 13h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        Download Report
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ② ALERT BANNER — Prediabetes
───────────────────────────────────────────────────────────────────────────── */
function AlertBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-wrap items-start gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2L2 16h16L10 2Z" stroke="#D97706" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M10 8v4" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="10" cy="14" r="0.8" fill="#D97706" />
          </svg>
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-800">Prediabetes Detected</p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
            Your HbA1c of <strong>6.1%</strong> and fasting glucose of <strong>110 mg/dL</strong> fall
            within the prediabetes range. Early lifestyle adjustments can reverse this condition.
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
          <div className="mt-1 flex justify-between text-[9px] text-amber-600">
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
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Key Findings
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {FINDINGS.map((f) => {
          const st = statusStyle(f.status);
          return (
            <div key={f.label} className={`flex flex-col gap-2 rounded-xl border p-4 ${st.card}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">{f.label}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.badge}`}>
                  {st.label}
                </span>
              </div>
              <p className={`text-2xl font-bold tracking-tight ${st.value}`}>
                {f.value}
                <span className="ml-1 text-xs font-normal text-slate-400">{f.unit}</span>
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400">Ref: {f.ref}</p>
                {f.trend !== 0 && (
                  <span
                    className={`text-[10px] font-semibold ${f.trend > 0 ? "text-rose-500" : "text-emerald-600"}`}
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Blood Sugar Trend</p>
          <p className="text-xs text-slate-400">Fasting glucose — last 12 months (mg/dL)</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-bold text-slate-900">HbA1c Gauge</p>
      <p className="mb-3 text-xs text-slate-400">Glycated haemoglobin — diagnostic range</p>

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
  "Reduce sugary drinks and refined carbohydrates",
  "Aim for 30 minutes of moderate exercise, 5 days a week",
  "Increase dietary fibre — whole grains, legumes, vegetables",
  "Monitor fasting blood sugar weekly at home",
  "Schedule a follow-up HbA1c test in 3 months",
  "Consider a referral to a registered dietitian",
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8l4 4 6-7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-900">Recommended Actions</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {ACTIONS.map((action, i) => {
          const done = checked.has(i);
          return (
            <li key={i}
              className="flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-colors duration-150 hover:bg-slate-50"
              onClick={() => toggle(i)}
            >
              {/* Checkbox */}
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150 ${
                  done
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300 bg-white"
                }`}
              >
                {done && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`text-xs leading-relaxed ${done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                {action}
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
  "Am I currently considered prediabetic based on these results?",
  "Should I make any immediate dietary changes?",
  "Do I need medication at this stage, or can lifestyle changes help?",
  "How often should I monitor my blood sugar at home?",
  "What is my target HbA1c in 3 months with lifestyle changes?",
];

function DoctorQuestions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="#4F46E5" strokeWidth="1.4" />
            <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5s1.5.67 1.5 1.5c0 1-1.5 1.5-1.5 2.5" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.7" fill="#4F46E5" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-900">Questions to Ask Your Doctor</p>
      </div>

      <ol className="flex flex-col gap-2.5">
        {DOCTOR_QUESTIONS.map((q, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}
            >
              {i + 1}
            </span>
            <p className="text-xs leading-relaxed text-slate-700">{q}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑧ UNDERSTAND THE NUMBERS — HbA1c range bar
───────────────────────────────────────────────────────────────────────────── */
function RangeBar() {
  // HbA1c range 4%–10%, user at 6.1%
  const minV = 4, maxV = 10, userV = 6.1;
  const pct = ((userV - minV) / (maxV - minV)) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-bold text-slate-900">Understand the Numbers</p>
      <p className="mb-4 text-xs text-slate-400">HbA1c diagnostic thresholds — where your value sits</p>

      <div className="relative">
        {/* Colour bar */}
        <div className="flex h-5 w-full overflow-hidden rounded-full">
          <div className="h-full flex-[28.3%] bg-emerald-400" title="Normal: 4–5.7%" />
          <div className="h-full flex-[13.3%] bg-amber-400" title="Prediabetes: 5.7–6.5%" />
          <div className="h-full flex-[58.3%] bg-rose-500" title="Diabetes: 6.5–10%" />
        </div>

        {/* User value tag */}
        <div
          className="absolute -top-7 -translate-x-1/2"
          style={{ left: `${pct}%` }}
        >
          <div className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
            {userV}%
          </div>
          <div className="mx-auto h-2 w-px bg-slate-900" />
        </div>

        {/* Tick mark */}
        <div
          className="absolute top-0 h-5 w-0.5 bg-slate-900"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Legend */}
      <div className="mt-2 flex justify-between text-[10px]">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-500">Normal (&lt;5.7%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-slate-500">Prediabetes (5.7–6.4%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-slate-500">Diabetes (≥6.5%)</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑨ AI CONFIDENCE RING
───────────────────────────────────────────────────────────────────────────── */
function AIConfidenceRing({ pct = 91 }: { pct?: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="self-start text-sm font-bold text-slate-900">AI Interpretation Confidence</p>

      <div className="relative flex items-center justify-center">
        <svg width="88" height="88" viewBox="0 0 88 88" aria-label={`${pct}% confidence`}>
          {/* Track */}
          <circle cx="44" cy="44" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="44" cy="44" r={r}
            fill="none"
            stroke="url(#confGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 44 44)"
          />
          <defs>
            <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold text-slate-900">{pct}%</span>
        </div>
      </div>

      <p className="text-center text-xs leading-relaxed text-slate-500">
        Based on report completeness, biomarker coverage, and pattern match strength.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑩ LIFESTYLE TIP CARD
───────────────────────────────────────────────────────────────────────────── */
const LIFESTYLE_ITEMS = [
  { key: "nutrition", emoji: "🥗", label: "Nutrition",  tip: "Mediterranean-style diet recommended" },
  { key: "fitness",   emoji: "🏃", label: "Fitness",    tip: "150 min/week moderate aerobic activity" },
  { key: "stress",    emoji: "🧘", label: "Stress",     tip: "Mindfulness or breathing exercises daily" },
  { key: "sleep",     emoji: "😴", label: "Sleep",      tip: "7–9 hours per night for glucose regulation" },
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
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-base">
          🌱
        </div>
        <p className="text-sm font-bold text-slate-900">Lifestyle Tip for You</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {LIFESTYLE_ITEMS.map(({ key, emoji, label, tip }) => {
          const on = active.has(key);
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all duration-150 ${
                on
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-slate-50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{emoji}</span>
                <span className={`text-xs font-semibold ${on ? "text-emerald-700" : "text-slate-500"}`}>
                  {label}
                </span>
                {/* Toggle square */}
                <span
                  className={`ml-auto h-3.5 w-3.5 rounded-sm border ${
                    on ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
                  }`}
                >
                  {on && (
                    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </div>
              <p className={`text-[10px] leading-relaxed ${on ? "text-emerald-600" : "text-slate-400"}`}>
                {tip}
              </p>
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
export default function CenterStage({ query, fileNames = [], isLoading }: CenterStageProps) {
  if (isLoading) return <LoadingState />;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-6 p-6">

        {/* ① Header */}
        <HeaderRow />

        {/* ② Alert banner */}
        <AlertBanner />

        {/* ③ Key findings grid */}
        <FindingsGrid />

        {/* ④ + ⑤  Blood sugar trend + HbA1c gauge — side by side on wide */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <BloodSugarChart />
          </div>
          <div>
            <HbA1cGauge />
          </div>
        </div>

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
