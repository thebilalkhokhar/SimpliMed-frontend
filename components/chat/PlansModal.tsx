"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Plans data
───────────────────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: "free",
    name: "Free",
    badge: null,
    highlighted: false,
    monthly: "$0",
    annual: "$0",
    annualTotal: "",
    desc: "Get started risk-free. No credit card required.",
    features: [
      "Upload up to 5 reports per month",
      "Ask up to 20 AI follow-up questions per month",
      "Basic report analysis (what's normal, what's not)",
      "No credit card required",
    ],
    cta: "Current Plan",
    ctaVariant: "secondary" as const,
  },
  {
    id: "pro",
    name: "Pro",
    badge: null,
    highlighted: false,
    monthly: "$14.99",
    annual: "$9.99",
    annualTotal: "$119.90/year",
    desc: "For individuals actively managing their health.",
    features: [
      "Upload up to 100 reports per month",
      "Ask up to 500 AI follow-up questions per month",
      "Advanced analysis with detailed explanations",
      "AI suggests questions to ask your doctor",
      "Health timeline tracking",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "secondary" as const,
  },
  {
    id: "premium",
    name: "Premium",
    badge: "Most Popular",
    highlighted: true,
    monthly: "$29.99",
    annual: "$19.99",
    annualTotal: "$239.90/year",
    desc: "Full power. Unlimited access. Priority everything.",
    features: [
      "Unlimited report uploads",
      "Unlimited AI follow-up questions",
      "Everything in Pro, plus:",
      "Priority processing (faster results)",
      "Download analysis as PDF",
      "Medication tracking insights",
      "Priority support",
    ],
    cta: "Get Premium",
    ctaVariant: "primary" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: null,
    highlighted: false,
    monthly: "$49.99",
    annual: "$33.33",
    annualTotal: "$399.90/year",
    desc: "For clinics, teams, and health platforms.",
    features: [
      "Unlimited everything",
      "Everything in Premium, plus:",
      "Dedicated support",
      "Custom integrations",
      "API access",
    ],
    cta: "Contact Sales",
    ctaVariant: "secondary" as const,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Modal
───────────────────────────────────────────────────────────────────────────── */
interface PlansModalProps {
  onClose: () => void;
}

export default function PlansModal({ onClose }: PlansModalProps) {
  const [annual, setAnnual] = useState(true);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
        onClick={onClose} aria-hidden="true" />

      {/* Full-screen modal */}
      <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
        style={{ backgroundColor: "#FAFBFF" }}>

        {/* Background blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="animate-blob-1 absolute -left-32 top-0 h-[400px] w-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
          <div className="animate-blob-2 absolute -right-20 bottom-0 h-[350px] w-[350px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* ── Header bar (same as landing page) ── */}
        <header className="sticky top-0 z-20 shrink-0 border-b"
          style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderColor: "var(--color-border)" }}>
          <div className="mx-auto flex h-[72px] w-full max-w-[1920px] items-center justify-between px-6 sm:px-10 lg:px-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline">
              <Image src="/logo.svg" alt="Simplimed logo" width={38} height={38} className="rounded-xl" style={{ objectFit: "contain" }} />
              <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                Simplimed
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { label: "Features", href: "/#features" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Pricing", href: "/pricing" },
              ].map(({ label, href }) => (
                <Link key={label} href={href}
                  className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150"
                  style={{ color: label === "Pricing" ? "var(--color-brand)" : "var(--color-text-secondary)", backgroundColor: label === "Pricing" ? "var(--color-brand-light)" : "transparent" }}
                  onMouseEnter={(e) => {
                    if (label !== "Pricing") {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (label !== "Pricing") {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                    }
                  }}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* Close button */}
            <button onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-150"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
              }}
              aria-label="Close (Esc)">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        {/* Toggle */}
        <div className="relative z-10 flex justify-center p-8">
          <div className="inline-flex items-center gap-3 rounded-2xl border p-1.5"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "var(--color-border)", backdropFilter: "blur(8px)" }}>
            <button onClick={() => setAnnual(false)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
              style={!annual ? { backgroundColor: "var(--color-brand)", color: "#fff", boxShadow: "0 2px 8px rgba(79,70,229,0.3)" } : { color: "var(--color-text-secondary)" }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
              style={annual ? { backgroundColor: "var(--color-brand)", color: "#fff", boxShadow: "0 2px 8px rgba(79,70,229,0.3)" } : { color: "var(--color-text-secondary)" }}>
              Annual
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-12 sm:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => (
              <div key={plan.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={
                  plan.highlighted
                    ? { backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-brand)", borderWidth: 2, boxShadow: "0 8px 30px rgba(79,70,229,0.12)" }
                    : { backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }
                }>

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-px left-0 right-0 flex justify-center">
                    <span className="rounded-b-xl px-4 py-1 text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" }}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6 pt-7">
                  {/* Header */}
                  <p className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: plan.highlighted ? "var(--color-brand)" : "var(--color-text-muted)" }}>
                    {plan.name}
                  </p>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                      {annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="mb-0.5 text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>/month</span>
                  </div>
                  {annual && plan.annualTotal && (
                    <p className="mt-1 text-xs font-medium" style={{ color: "var(--color-normal-text)" }}>
                      Billed {plan.annualTotal}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {plan.desc}
                  </p>

                  {/* Features */}
                  <ul className="mb-6 mt-5 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                          style={f.includes("Everything in") || f.includes("plus:")
                            ? { backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }
                            : { backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)" }}>
                          {f.includes("Everything in") || f.includes("plus:") ? (
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          ) : (
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                        </span>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
                      plan.ctaVariant === "primary" ? "text-white hover:scale-[1.02]" : "border"
                    }`}
                    style={
                      plan.ctaVariant === "primary"
                        ? { background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }
                        : { borderColor: "var(--color-border)", color: "var(--color-text-primary)", backgroundColor: "var(--color-bg-base)" }
                    }>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
        </div>

        {/* ── Full Footer (same as landing page) ── */}
        <footer className="relative z-10 w-full border-t"
          style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
          <div className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">

              {/* Brand column */}
              <div className="lg:col-span-2">
                <div className="mb-3 inline-flex items-center gap-2.5">
                  <Image src="/logo.svg" alt="Simplimed" width={32} height={32} className="rounded-lg" />
                  <span className="text-sm font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                    Simplimed
                  </span>
                </div>
                <p className="mb-4 max-w-xs text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  AI-powered medical report analysis and personal health intelligence — clean, private, and built for you.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["HIPAA Compliant", "SOC 2 Type II", "GDPR Ready"].map((badge) => (
                    <span key={badge} className="rounded-full border px-2 py-0.5 text-[9px] font-semibold"
                      style={{ backgroundColor: "var(--color-normal-bg)", borderColor: "var(--color-normal-border)", color: "var(--color-normal-text)" }}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link columns */}
              {Object.entries({
                Product: [
                  { label: "Features", href: "/#features" },
                  { label: "How It Works", href: "/#how-it-works" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Changelog", href: "#" },
                ],
                Platform: [
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Reports", href: "/dashboard/reports" },
                  { label: "Analysis", href: "/dashboard/analysis" },
                  { label: "Chat", href: "/chat" },
                ],
                Company: [
                  { label: "About", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Contact", href: "mailto:hello@simplimed.ai" },
                ],
                Legal: [
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "HIPAA Notice", href: "#" },
                  { label: "Cookie Policy", href: "#" },
                ],
              }).map(([group, links]) => (
                <div key={group}>
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-primary)" }}>
                    {group}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link href={href} className="text-xs transition-colors duration-150"
                          style={{ color: "var(--color-text-muted)" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3 px-6 py-3 sm:px-10">
              <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                © {new Date().getFullYear()} Simplimed, Inc. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <Link key={item} href="#" className="text-[10px] transition-colors duration-150"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
