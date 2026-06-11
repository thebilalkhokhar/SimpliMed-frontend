"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials every 5s
  const [testimonialDir, setTestimonialDir] = useState<"left" | "right">("right");

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialDir("right");
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function goToTestimonial(i: number) {
    setTestimonialDir(i > activeTestimonial ? "right" : "left");
    setActiveTestimonial(i);
  }

  function handleCTA() {
    router.push(isAuthenticated ? "/dashboard" : "/signin");
  }

  return (
    <div className="flex flex-col">

      {/* ════════════════════════════════════════════════════════════════
          1. HERO — premium animated gradient mesh + glassmorphism
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-6 py-14 sm:px-10 lg:px-16 lg:py-20"
        style={{ backgroundColor: "#FAFBFF" }}
      >
        {/* ── Animated gradient mesh background ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Blob 1 — indigo */}
          <div className="animate-blob-1 absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
          {/* Blob 2 — emerald */}
          <div className="animate-blob-2 absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }} />
          {/* Blob 3 — blue */}
          <div className="animate-blob-3 absolute -right-20 top-1/4 h-[450px] w-[450px] rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
        </div>

        {/* ── Dot grid pattern overlay ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />

        <div className="relative z-10 mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* ── Left: copy ── */}
            <div className="flex flex-col items-start">
              {/* Eyebrow badge with pulse glow */}
              <div className="animate-pulse-glow mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
                style={{ backgroundColor: "rgba(238,242,255,0.8)", borderColor: "#C7D2FE", backdropFilter: "blur(8px)" }}>
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-brand)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>
                  AI Medical Intelligence — Now Available
                </span>
              </div>

              {/* Headline with gradient text */}
              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl"
                style={{ color: "var(--color-text-primary)" }}>
                Understand your{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  medical reports
                </span>{" "}
                instantly
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Simplimed transforms complex lab results, imaging reports, and clinical
                documents into clear, actionable health insights — no medical degree required.
              </p>

              {/* CTAs — primary with shimmer effect */}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleCTA}
                  className="btn-primary relative gap-2 overflow-hidden px-8 py-3.5 text-base font-semibold"
                  style={{ borderRadius: "0.875rem" }}>
                  {/* Shimmer overlay */}
                  <span className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M9 2a7 7 0 1 1 0 14A7 7 0 0 1 9 2Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Analyze Report
                </button>
                <a href="#how-it-works" className="btn-secondary gap-2 px-7 py-3.5 text-base"
                  style={{ borderRadius: "0.875rem" }}>
                  See how it works
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>

              {/* Social proof stats */}
              <div className="mt-12 flex flex-wrap items-center gap-8">
                {[
                  { value: "50K+",  label: "Reports Analyzed" },
                  { value: "99.2%", label: "Accuracy Rate"    },
                  { value: "HIPAA", label: "Compliant"        },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{value}</span>
                    <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: illustration with floating glass cards ── */}
            <div className="relative flex items-center justify-center">

              {/* Glass container for illustration */}
              <div className="relative w-full max-w-lg rounded-3xl border p-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderColor: "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 20px 50px -12px rgba(79,70,229,0.15), 0 8px 20px -8px rgba(0,0,0,0.06)",
                }}>
                <Image
                  src="/medicine.svg"
                  alt="Doctor analysing a medical report"
                  width={540}
                  height={420}
                  className="w-full drop-shadow-sm"
                  priority
                />
              </div>

              {/* Floating glass cards */}
              {/* Card 1 — top right */}
              <div className="animate-float absolute -right-4 top-8 hidden rounded-xl border px-4 py-2.5 lg:flex"
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7l4 4 6-7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">HIPAA Compliant</p>
                    <p className="text-[10px] text-slate-400">Enterprise-grade security</p>
                  </div>
                </div>
              </div>

              {/* Card 2 — bottom left */}
              <div className="animate-float-slow absolute -left-4 bottom-12 hidden rounded-xl border px-4 py-2.5 lg:flex"
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 1v5l3 2" stroke="#2563EB" strokeWidth="1.75" strokeLinecap="round" />
                      <circle cx="7" cy="7" r="6" stroke="#2563EB" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">2s Analysis</p>
                    <p className="text-[10px] text-slate-400">Instant AI processing</p>
                  </div>
                </div>
              </div>

              {/* Card 3 — top left */}
              <div className="animate-float-slower absolute left-4 top-0 hidden rounded-xl border px-4 py-2.5 lg:flex"
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 10L5 5.5l2.5 3L10 4l2.5 4" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">99.2% Accuracy</p>
                    <p className="text-[10px] text-slate-400">Clinically validated</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. TRUST BAR — glass marquee style
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-y px-6 py-6 sm:px-10 lg:px-16"
        style={{ backgroundColor: "rgba(255,255,255,0.7)", borderColor: "var(--color-border)", backdropFilter: "blur(12px)" }}>
        {/* Subtle gradient line at top */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, #6366F1 50%, transparent 100%)", opacity: 0.3 }} />
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: "🔒", text: "HIPAA Compliant",            color: "#059669" },
            { icon: "🤖", text: "GPT-4 Powered Analysis",     color: "#4F46E5" },
            { icon: "📋", text: "All Report Types Supported", color: "#2563EB" },
            { icon: "⚡", text: "Results in Seconds",          color: "#D97706" },
            { icon: "🌍", text: "Multi-Language Support",     color: "#7C3AED" },
          ].map(({ icon, text, color }) => (
            <div key={text}
              className="flex items-center gap-2.5 rounded-full border px-4 py-2 transition-transform duration-200 hover:scale-105"
              style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(255,255,255,0.5)" }}>
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-semibold" style={{ color }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. HOW IT WORKS — with numbered cards and connector lines
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative overflow-hidden px-6 py-14 sm:px-10 lg:px-16"
        style={{ backgroundColor: "#FAFBFF" }}>
        {/* ── Fat diagonal ribbon ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* The ribbon: a wide band rotated -4deg, stretching beyond edges */}
          <div className="absolute left-[-5%] right-[-5%] top-1/2 h-[220px] -translate-y-1/2 -rotate-[4deg]"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)",
              borderRadius: "2rem",
              opacity: 0.9,
            }} />
          {/* Subtle dot grid over the ribbon for texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />
        </div>

        <div className="relative z-10 mx-auto max-w-[1920px]">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ backgroundColor: "rgba(238,242,255,0.8)", borderColor: "#C7D2FE" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>Simple 3-Step Process</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text-primary)" }}>
              From report to insight in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">3 steps</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              No technical setup. No medical jargon. Just upload and understand.
            </p>
          </div>

          {/* 3-column compact step cards — no wasted space */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step}
                className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderColor: "var(--color-border)",
                  backdropFilter: "blur(8px)",
                }}>

                {/* Top: illustration in a tinted band */}
                <div className="flex h-48 items-center justify-center overflow-hidden"
                  style={{ backgroundColor: i === 0 ? "#EEF2FF" : i === 1 ? "#EFF6FF" : "#ECFDF5" }}>
                  <Image
                    src={step.illustration}
                    alt={step.alt}
                    width={200}
                    height={150}
                    className="h-36 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Bottom: content */}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  {/* Step badge */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black"
                      style={{
                        background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                        color: "#fff",
                        boxShadow: "0 3px 10px rgba(79,70,229,0.25)",
                      }}>
                      {step.step}
                    </span>
                    <div className="h-px flex-1"
                      style={{ background: "linear-gradient(90deg, var(--color-brand), transparent)" }} />
                  </div>

                  <h3 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. CAPABILITIES — infinite auto-scrolling marquee
      ════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative overflow-hidden py-14"
        style={{ backgroundColor: "#FAFBFF" }}>
        {/* Background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* ── Fat diagonal ribbon (flipped — rotates +4deg) ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-5%] right-[-5%] bottom-[15%] h-[220px] rotate-[4deg]"
            style={{
              background: "linear-gradient(135deg, #818CF8 0%, #6366F1 50%, #4F46E5 100%)",
              borderRadius: "2rem",
              opacity: 0.9,
            }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />
        </div>

        <div className="relative z-10 mx-auto max-w-[1920px] px-6 sm:px-10 lg:px-16">
          {/* Header */}
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ backgroundColor: "rgba(238,242,255,0.8)", borderColor: "#C7D2FE" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>Capabilities</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text-primary)" }}>
              Every report type,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">decoded</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              From routine blood work to complex imaging — Simplimed handles the full
              spectrum of medical documentation. Hover to pause.
            </p>
          </div>
        </div>

        {/* Marquee — full-width, no horizontal padding so it bleeds edge-to-edge */}
        <div className="relative">
          {/* Fade edges */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
            style={{ background: "linear-gradient(90deg, #FAFBFF 0%, transparent 100%)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
            style={{ background: "linear-gradient(270deg, #FAFBFF 0%, transparent 100%)" }} />

          {/* Scrolling track — duplicated for seamless loop */}
          <div className="animate-marquee flex w-max gap-5">
            {/* First set */}
            {[...CAPABILITIES, ...CAPABILITIES].map((cap, idx) => (
              <div key={`${cap.title}-${idx}`}
                className="group flex w-[340px] shrink-0 flex-col gap-4 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  borderColor: "var(--color-border)",
                  backdropFilter: "blur(8px)",
                }}>
                {/* Top row: icon + title */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: cap.accent, border: `1px solid ${cap.border}`, color: cap.color }}>
                    {cap.icon}
                  </div>
                  <h3 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {cap.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {cap.desc}
                </p>

                {/* Bottom: feature pills */}
                <div className="flex flex-wrap gap-1.5">
                  {["AI Analysis", "Plain Language", "Flags Anomalies"].map((tag) => (
                    <span key={tag} className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: cap.accent, color: cap.color, border: `1px solid ${cap.border}` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6. TESTIMONIALS — Large single quote spotlight
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-14 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)" }}>
        {/* Background accent */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ backgroundColor: "rgba(238,242,255,0.8)", borderColor: "#C7D2FE" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>Real Stories</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text-primary)" }}>
              People who took control of their{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">health</span>
            </h2>
          </div>

          {/* Large quote */}
          <div className="relative">
            {/* Quote marks */}
            <svg className="absolute -left-4 -top-4 opacity-10 sm:-left-8 sm:-top-6" width="48" height="48" viewBox="0 0 24 24" fill="currentColor"
              style={{ color: "var(--color-brand)" }} aria-hidden="true">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/>
            </svg>

            {/* Testimonial content — horizontal slide */}
            <div className="min-h-[150px] overflow-hidden">
              {TESTIMONIALS.map((t, i) => {
                let transform = "translateX(100%)";
                let opacity = "0";
                if (i === activeTestimonial) {
                  transform = "translateX(0)";
                  opacity = "1";
                } else if (
                  (testimonialDir === "right" && i < activeTestimonial) ||
                  (testimonialDir === "left" && i > activeTestimonial)
                ) {
                  transform = testimonialDir === "right" ? "translateX(-100%)" : "translateX(100%)";
                } else {
                  transform = testimonialDir === "right" ? "translateX(100%)" : "translateX(-100%)";
                }

                return (
                  <div
                    key={t.name}
                    className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out"
                    style={{
                      opacity,
                      transform,
                      pointerEvents: activeTestimonial === i ? "auto" : "none",
                    }}
                  >
                  {/* Stars */}
                  <div className="mb-5 flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} width="18" height="18" viewBox="0 0 16 16" fill="#FBBF24" aria-hidden="true">
                        <path d="M8 1l1.796 3.64L14 5.382l-3 2.924.708 4.127L8 10.35l-3.708 2.083L5 8.306 2 5.382l4.204-.742L8 1Z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="mb-5 text-lg font-medium leading-relaxed sm:text-xl"
                    style={{ color: "var(--color-text-primary)" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", color: "#fff" }}>
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToTestimonial(i)}
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: activeTestimonial === i ? 24 : 10,
                  backgroundColor: activeTestimonial === i ? "var(--color-brand)" : "var(--color-border)",
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          7. FAQ + CTA — side by side
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-14 sm:px-10 lg:px-16"
        style={{ backgroundColor: "#FAFBFF" }}>
        {/* Diagonal ribbon behind */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-5%] right-[-5%] top-[45%] h-[200px] -rotate-[4deg]"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)",
              borderRadius: "2rem",
              opacity: 0.85,
            }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        {/* Subtle background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative z-10 mx-auto max-w-[1920px]">
          {/* Grid: FAQ left, CTA right */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

            {/* ── LEFT: FAQ ── */}
            <div>
              {/* Header */}
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                  style={{ backgroundColor: "rgba(238,242,255,0.8)", borderColor: "#C7D2FE" }}>
                  <span className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>FAQ</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--color-text-primary)" }}>
                  Common{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">questions</span>
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  Everything you need to know before uploading your first report.
                </p>
              </div>

              {/* Accordion */}
              <div className="flex flex-col gap-2.5">
                {[
                  { q: "Is my medical data private and secure?", a: "Yes. All data is encrypted at rest and in transit. We are HIPAA-compliant and never sell or share your data with third parties. You can delete all your data at any time from your settings." },
                  { q: "What file formats does Simplimed support?", a: "We support PDF, JPG, JPEG, and PNG. Most lab reports, radiology reports, and clinical summaries are provided in these formats. If you have a different format, contact us." },
                  { q: "How accurate is the AI analysis?", a: "Our AI achieves 99.2% accuracy on standard biomarker interpretation against clinically validated reference ranges. We continuously improve our models with new medical literature." },
                  { q: "Can Simplimed replace my doctor?", a: "No — and it's not designed to. Simplimed helps you understand your reports and prepare better questions for your doctor. All analysis is for informational purposes only and should not replace professional medical advice." },
                  { q: "How long does analysis take?", a: "Most reports are analysed in under 30 seconds. Complex imaging reports with dense text may take up to 2 minutes." },
                  { q: "Is there a free plan?", a: "Yes. The Free plan gives you 3 report analyses per month with no credit card required. Upgrade to Pro for unlimited analyses, all report types, and medication tracking." },
                ].map((item, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i}
                      className="overflow-hidden rounded-2xl border transition-all duration-200"
                      style={{
                        borderColor: isOpen ? "var(--color-brand)" : "var(--color-border)",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        backdropFilter: "blur(8px)",
                        boxShadow: isOpen ? "0 4px 20px rgba(79,70,229,0.08)" : "none",
                      }}>
                      <div className="flex">
                        <div
                          className="w-1 shrink-0 transition-colors duration-200"
                          style={{ backgroundColor: isOpen ? "var(--color-brand)" : "transparent" }}
                        />
                        <div className="flex-1">
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : i)}
                            className="flex w-full items-center gap-3 px-4 py-4 text-left"
                          >
                            <span className="flex-1 text-sm font-semibold" style={{ color: isOpen ? "var(--color-brand)" : "var(--color-text-primary)" }}>
                              {item.q}
                            </span>
                            <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200"
                              style={{
                                backgroundColor: isOpen ? "var(--color-brand)" : "var(--color-bg-overlay)",
                                color: isOpen ? "#fff" : "var(--color-text-muted)",
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                aria-hidden="true">
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.75"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          </button>
                          <div
                            className="grid transition-all duration-300 ease-in-out"
                            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                          >
                            <div className="overflow-hidden">
                              <div className="px-4 pb-4 pt-1">
                                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                                  {item.a}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom help text */}
              <p className="mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Still have questions?{" "}
                <a href="mailto:hello@simplimed.ai" className="font-semibold"
                  style={{ color: "var(--color-brand)" }}>
                  Contact our team →
                </a>
              </p>
            </div>

            {/* ── RIGHT: CTA Card ── */}
            <div className="flex items-center justify-center">
              {/* Outer glow wrapper */}
              <div className="rounded-3xl p-[2px]"
                style={{
                  background: "conic-gradient(from var(--gradient-angle, 0deg), #4F46E5, #6366F1, #3B82F6, #8B5CF6, #A78BFA, #4F46E5)",
                  animation: "gradient-rotate 4s linear infinite",
                }}>

                {/* Inner card */}
                <div className="relative overflow-hidden rounded-[calc(1.5rem-2px)] px-6 py-12 text-center sm:px-8 sm:py-14"
                  style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}>

                  {/* Animated mesh blobs inside card */}
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="animate-blob-1 absolute -left-16 -top-16 h-[250px] w-[250px] rounded-full opacity-[0.07]"
                      style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
                    <div className="animate-blob-2 absolute -bottom-16 -right-16 h-[200px] w-[200px] rounded-full opacity-[0.06]"
                      style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
                  </div>

                  <div className="relative z-10">
                    <h2 className="mb-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
                      style={{ color: "var(--color-text-primary)" }}>
                      Ready to understand your{" "}
                      <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        health?
                      </span>
                    </h2>

                    <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}>
                      Upload your first report in seconds. No credit card required.
                      Join 50,000+ people who already understand their medical data.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                      <button onClick={handleCTA}
                        className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", boxShadow: "0 8px 24px rgba(79,70,229,0.3)" }}>
                        <span className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        Start for Free
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <Link href="/pricing"
                        className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-indigo-50"
                        style={{ borderColor: "var(--color-brand)", color: "var(--color-brand)" }}>
                        View Pricing
                      </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      {[
                        { icon: "🔒", text: "HIPAA Compliant" },
                        { icon: "⚡", text: "Results in 2s" },
                        { icon: "💳", text: "No card needed" },
                      ].map(({ icon, text }) => (
                        <div key={text} className="flex items-center gap-1.5 rounded-full border px-3 py-1"
                          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
                          <span className="text-xs">{icon}</span>
                          <span className="text-[10px] font-medium" style={{ color: "var(--color-text-secondary)" }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
