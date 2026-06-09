"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const isAuthenticated = false;

/* ─────────────────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────────────────── */
const CAPABILITIES = [
  { title: "Blood Panel Analysis",      desc: "Full CBC, metabolic panels, lipid profiles — explained in plain language with flagged anomalies.",          accent: "var(--color-normal-bg)",    border: "var(--color-normal-border)",   color: "var(--color-normal-text)",   icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3v16M3 11h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/></svg> },
  { title: "Radiology Reports",         desc: "X-ray and ultrasound report text translated into clear, structured findings anyone can understand.",          accent: "var(--color-info-bg)",      border: "var(--color-info-border)",     color: "var(--color-info-text)",     icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11h8M11 7v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { title: "MRI & CT Scans",            desc: "Complex imaging reports decoded — key findings, clinical significance, and recommended follow-ups.",          accent: "var(--color-brand-light)",  border: "#C7D2FE",                      color: "var(--color-brand)",         icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 3v2M11 17v2M3 11h2M17 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { title: "Thyroid & Hormone Panels",  desc: "TSH, T3/T4, cortisol and more — with reference range context and easy-to-read status summaries.",            accent: "var(--color-normal-bg)",    border: "var(--color-normal-border)",   color: "var(--color-normal-text)",   icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 16L9 9l3 4 3-6 3 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { title: "Urinalysis",                desc: "Urine test results explained with clinical context — glucose, protein, bacteria, and more.",                   accent: "var(--color-info-bg)",      border: "var(--color-info-border)",     color: "var(--color-info-text)",     icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3C11 3 5 10 5 14a6 6 0 0 0 12 0c0-4-6-11-6-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
  { title: "Pathology & Biopsy",        desc: "Pathology report narratives broken down into comprehensible summaries with highlighted diagnoses.",            accent: "var(--color-brand-light)",  border: "#C7D2FE",                      color: "var(--color-brand)",         icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M6 3h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 8h4M9 12h4M9 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload your report",
    desc: "Drop any PDF, JPG, or PNG — lab results, radiology reports, imaging summaries. We handle all formats.",
    illustration: "/upload.svg",
    alt: "Person uploading a file",
  },
  {
    step: "02",
    title: "AI analyses it instantly",
    desc: "Our medical AI reads every biomarker, cross-references clinical thresholds, and identifies what needs attention.",
    illustration: "/artificial-intelligence.svg",
    alt: "AI analysing data",
  },
  {
    step: "03",
    title: "Get clear, actionable insights",
    desc: "Receive a plain-language summary, flagged metrics, trend charts, and questions to ask your doctor.",
    illustration: "/completed-tasks.svg",
    alt: "Person reviewing results",
  },
];

const MEDICATIONS = [
  { name: "Metformin",     dose: "500 mg",  freq: "Twice daily",   duration: "Ongoing",  status: "normal" },
  { name: "Lisinopril",    dose: "10 mg",   freq: "Once daily",    duration: "6 months", status: "normal" },
  { name: "Atorvastatin",  dose: "20 mg",   freq: "Once at night", duration: "Ongoing",  status: "info"   },
  { name: "Levothyroxine", dose: "50 mcg",  freq: "Once daily",    duration: "Ongoing",  status: "normal" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma",   role: "Type 2 Diabetic, 42",       quote: "I finally understand what my HbA1c numbers mean. Simplimed explained everything my doctor said in five minutes that I'd been confused about for years." },
  { name: "James O'Brien",  role: "Cardiac patient, 58",        quote: "The lipid panel breakdown was incredible. Seeing my LDL trend over 6 months made me take lifestyle changes seriously for the first time." },
  { name: "Sara Al-Rashid", role: "Parent managing child's labs", quote: "My daughter has thyroid issues. Simplimed helps me track her TSH levels and know exactly what to discuss at each appointment." },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleCTA() {
    router.push(isAuthenticated ? "/dashboard" : "/signin");
  }

  return (
    <div className="flex flex-col">

      {/* ════════════════════════════════════════════════════════════════
          1. HERO — two-column with illustration
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
        style={{ backgroundColor: "var(--color-bg-base)" }}
      >
        {/* Background glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
          style={{ background: "radial-gradient(ellipse 80% 50% at 60% -10%, rgba(79,70,229,0.07) 0%, transparent 70%)" }} />

        <div className="relative mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Left: copy */}
            <div className="flex flex-col items-start">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
                style={{ backgroundColor: "var(--color-brand-light)", borderColor: "#C7D2FE" }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-brand)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>
                  AI Medical Intelligence — Now Available
                </span>
              </div>

              <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl"
                style={{ color: "var(--color-text-primary)" }}>
                Understand your{" "}
                <span className="relative" style={{ color: "var(--color-brand)" }}>
                  medical reports
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 260 8"
                    preserveAspectRatio="none" aria-hidden="true" style={{ height: 6 }}>
                    <path d="M0 6 Q65 0 130 5 Q195 9 260 4" stroke="var(--color-brand)"
                      strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                instantly
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Simplimed transforms complex lab results, imaging reports, and clinical
                documents into clear, actionable health insights — no medical degree required.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleCTA}
                  className="btn-primary gap-2 px-7 py-3 text-base font-semibold"
                  style={{ borderRadius: "0.875rem" }}>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M9 2a7 7 0 1 1 0 14A7 7 0 0 1 9 2Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Analyze Report
                </button>
                <a href="#how-it-works" className="btn-secondary gap-2 px-7 py-3 text-base"
                  style={{ borderRadius: "0.875rem" }}>
                  See how it works
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex flex-wrap items-center gap-8">
                {[
                  { value: "50K+",  label: "Reports Analyzed" },
                  { value: "99.2%", label: "Accuracy Rate"    },
                  { value: "HIPAA", label: "Compliant"        },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-2xl font-bold" style={{ color: "var(--color-brand)" }}>{value}</span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: illustration */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Decorative blob */}
                <div aria-hidden="true" className="absolute inset-0 rounded-3xl"
                  style={{ background: "radial-gradient(circle at 60% 40%, rgba(79,70,229,0.08) 0%, transparent 65%)" }} />
                <Image
                  src="/medicine.svg"
                  alt="Doctor analysing a medical report"
                  width={540}
                  height={420}
                  className="relative z-10 w-full drop-shadow-md"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. TRUST BAR
      ════════════════════════════════════════════════════════════════ */}
      <div className="border-y px-6 py-5 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-center gap-8 sm:gap-14">
          {[
            { icon: "🔒", text: "HIPAA Compliant"            },
            { icon: "🤖", text: "GPT-4 Powered Analysis"     },
            { icon: "📋", text: "All Report Types Supported" },
            { icon: "⚡", text: "Results in Seconds"          },
            { icon: "🌍", text: "Multi-Language Support"     },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. HOW IT WORKS
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="px-6 py-20 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="mb-14 text-center">
            <p className="section-label mb-3">How It Works</p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              From report to insight in 3 steps
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base" style={{ color: "var(--color-text-secondary)" }}>
              No technical setup. No medical jargon. Just upload and understand.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                {/* Text side */}
                <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="mb-4 inline-flex items-center gap-3">
                    <span className="text-4xl font-black tracking-tighter"
                      style={{ color: "var(--color-brand-light)", WebkitTextStroke: "2px var(--color-brand)" }}>
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {step.desc}
                  </p>
                </div>

                {/* Illustration side */}
                <div className={`flex justify-center ${i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <div className="relative w-full max-w-sm">
                    <div aria-hidden="true" className="absolute inset-0 rounded-3xl"
                      style={{ background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)" }} />
                    <Image
                      src={step.illustration}
                      alt={step.alt}
                      width={400}
                      height={300}
                      className="relative z-10 w-full drop-shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. CAPABILITIES GRID
      ════════════════════════════════════════════════════════════════ */}
      <section id="features" className="px-6 py-20 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="mb-14 text-center">
            <p className="section-label mb-3">Capabilities</p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Every report type, decoded
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base" style={{ color: "var(--color-text-secondary)" }}>
              From routine blood work to complex imaging — Simplimed handles the full
              spectrum of medical documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title}
                className="group flex gap-4 rounded-2xl border p-5 transition-all duration-200"
                style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-md)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)")}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: cap.accent, border: `1px solid ${cap.border}`, color: cap.color }}>
                  {cap.icon}
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {cap.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {cap.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Inline illustration */}
          <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="flex justify-center">
              <Image src="/file-analysis.svg" alt="AI analysing a medical file"
                width={460} height={340} className="w-full max-w-md drop-shadow-sm" />
            </div>
            <div>
              <p className="section-label mb-3">AI-Powered Precision</p>
              <h3 className="mb-4 text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                Reads reports the way a doctor would
              </h3>
              <p className="mb-5 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Simplimed doesn't just scan for keywords. It understands clinical context,
                reference ranges, patient demographics, and the relationship between markers
                — the same way a trained physician would review your results.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Flags values outside your demographic reference range",
                  "Correlates related markers (e.g. glucose + HbA1c + insulin)",
                  "Explains findings in plain language, not medical jargon",
                  "Suggests follow-up questions for your doctor",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className="mt-0.5 shrink-0" aria-hidden="true">
                      <circle cx="8" cy="8" r="7" fill="var(--color-normal-bg)" stroke="var(--color-normal-border)" />
                      <path d="M5 8l2 2 4-4" stroke="var(--color-normal-text)" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. MEDICATION TRACKING
      ════════════════════════════════════════════════════════════════ */}
      <section id="tracking" className="px-6 py-20 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Left: copy */}
            <div>
              <p className="section-label mb-3">Medication Tracking</p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                Your prescriptions, always in view
              </h2>
              <p className="mb-6 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Track medication names, dosages, frequencies, and durations alongside your
                full report history — all in one place. Never lose context between visits.
              </p>
              <ul className="flex flex-col gap-4 mb-8">
                {[
                  { icon: "💊", title: "Smart dose tracking",  desc: "Log name, dose, frequency and duration from any device."                        },
                  { icon: "📋", title: "Linked to reports",    desc: "Medications are tied to the specific report that prescribed them."               },
                  { icon: "🔔", title: "Refill reminders",     desc: "Get alerted when a course ends or a refill is due."                             },
                ].map(({ icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
                      style={{ backgroundColor: "var(--color-brand-light)", border: "1px solid #C7D2FE" }}>
                      {icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{title}</p>
                      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Illustration under copy on mobile, hidden on desktop (shown right col) */}
              <div className="flex justify-center lg:hidden">
                <Image src="/medical-care.svg" alt="Person tracking medications"
                  width={360} height={280} className="w-full max-w-xs drop-shadow-sm" />
              </div>
            </div>

            {/* Right: mock dashboard card + illustration */}
            <div className="flex flex-col gap-6">
              {/* Illustration — hidden on mobile (shown above) */}
              <div className="hidden justify-center lg:flex">
                <Image src="/medical-care.svg" alt="Person tracking medications"
                  width={360} height={260} className="w-full max-w-xs drop-shadow-sm" />
              </div>

              {/* Mock card */}
              <div className="rounded-2xl border p-5"
                style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card-lg)" }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="section-label mb-0.5">Active Medications</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      Current Prescriptions
                    </p>
                  </div>
                  <span className="badge-info">{MEDICATIONS.length} Active</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {MEDICATIONS.map((med) => (
                    <div key={med.name}
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{ backgroundColor: "var(--color-bg-subtle)", border: "1px solid var(--color-border-muted)" }}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: med.status === "info" ? "var(--color-info-bg)" : "var(--color-normal-bg)",
                            border: `1px solid ${med.status === "info" ? "var(--color-info-border)" : "var(--color-normal-border)"}`,
                          }}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <rect x="2" y="6" width="12" height="4" rx="2"
                              stroke={med.status === "info" ? "var(--color-info-text)" : "var(--color-normal-text)"}
                              strokeWidth="1.4"/>
                            <path d="M8 6v4"
                              stroke={med.status === "info" ? "var(--color-info-text)" : "var(--color-normal-text)"}
                              strokeWidth="1.4" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>{med.name}</p>
                          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{med.dose} · {med.freq}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                        {med.duration}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl border px-4 py-2"
                  style={{ backgroundColor: "var(--color-brand-light)", borderColor: "#C7D2FE" }}>
                  <span className="text-xs font-medium" style={{ color: "var(--color-brand)" }}>
                    Next refill due in 12 days
                  </span>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="var(--color-brand)" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6. TESTIMONIALS
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="mb-14 text-center">
            <p className="section-label mb-3">Real Stories</p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              People who took control of their health
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name}
                className="flex flex-col gap-4 rounded-2xl border p-6"
                style={{ backgroundColor: "var(--color-bg-subtle)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="#FBBF24" aria-hidden="true">
                      <path d="M8 1l1.796 3.64L14 5.382l-3 2.924.708 4.127L8 10.35l-3.708 2.083L5 8.306 2 5.382l4.204-.742L8 1Z"/>
                    </svg>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                    style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}>
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          7. FAQ
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">

            {/* Left: heading + illustration */}
            <div>
              <p className="section-label mb-3">FAQ</p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                Common questions
              </h2>
              <p className="mb-8 text-base" style={{ color: "var(--color-text-secondary)" }}>
                Everything you need to know before uploading your first report.
              </p>
              <Image src="/questions.svg" alt="Happy person with health insights"
                width={420} height={300} className="w-full max-w-sm drop-shadow-sm" />
            </div>

            {/* Right: accordion */}
            <div className="flex flex-col gap-3">
              {[
                { q: "Is my medical data private and secure?", a: "Yes. All data is encrypted at rest and in transit. We are HIPAA-compliant and never sell or share your data with third parties. You can delete all your data at any time from your settings." },
                { q: "What file formats does Simplimed support?", a: "We support PDF, JPG, JPEG, and PNG. Most lab reports, radiology reports, and clinical summaries are provided in these formats. If you have a different format, contact us." },
                { q: "How accurate is the AI analysis?", a: "Our AI achieves 99.2% accuracy on standard biomarker interpretation against clinically validated reference ranges. We continuously improve our models with new medical literature." },
                { q: "Can Simplimed replace my doctor?", a: "No — and it's not designed to. Simplimed helps you understand your reports and prepare better questions for your doctor. All analysis is for informational purposes only and should not replace professional medical advice." },
                { q: "How long does analysis take?", a: "Most reports are analysed in under 30 seconds. Complex imaging reports with dense text may take up to 2 minutes." },
                { q: "Is there a free plan?", a: "Yes. The Free plan gives you 3 report analyses per month with no credit card required. Upgrade to Pro for unlimited analyses, all report types, and medication tracking." },
              ].map((item, i) => (
                <div key={i}
                  className="overflow-hidden rounded-2xl border"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-base)" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold pr-4" style={{ color: "var(--color-text-primary)" }}>
                      {item.q}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className={`shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                      style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="border-t px-5 pb-4 pt-3"
                      style={{ borderColor: "var(--color-border-muted)" }}>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          8. BOTTOM CTA
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-24 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border p-10 lg:grid-cols-2 lg:p-16"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-light) 0%, #EFF6FF 100%)",
              borderColor: "#C7D2FE",
            }}>

            {/* Copy */}
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ color: "var(--color-text-primary)" }}>
                Ready to understand your health?
              </h2>
              <p className="mb-8 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Upload your first report in seconds. No credit card required.
                Join 50,000+ people who already understand their medical data.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleCTA}
                  className="btn-primary gap-2 px-8 py-3 text-base font-semibold"
                  style={{ borderRadius: "0.875rem" }}>
                  Start for Free
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <Link href="/pricing" className="btn-secondary gap-2 px-7 py-3 text-base"
                  style={{ borderRadius: "0.875rem" }}>
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex justify-center">
              <Image src="/feeling-happy.svg" alt="Happy person understanding health data"
                width={380} height={280} className="w-full max-w-xs drop-shadow-sm" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
