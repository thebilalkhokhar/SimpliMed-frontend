"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const isAuthenticated = false;

const TIERS = [
  {
    id: "free",
    name: "Free",
    label: "Evaluation",
    badge: "14-Day Trial",
    highlighted: false,
    monthly: "$0",
    annual: "$0",
    desc: "Explore Simplimed risk-free. No credit card needed.",
    features: [
      "3 report analyses per month",
      "Blood panel & urinalysis support",
      "Plain-language AI summaries",
      "7-day report history",
      "Email support",
    ],
    missing: [
      "All report types",
      "Medication tracking",
      "PDF export",
      "AI health trends",
    ],
    cta: "Start Free Trial",
    ctaVariant: "secondary" as const,
  },
  {
    id: "pro",
    name: "Pro",
    label: "Mapper Lite",
    badge: "Most Popular",
    highlighted: true,
    monthly: "$19",
    annual: "$15",
    desc: "Full access for individuals managing their health actively.",
    features: [
      "Unlimited report analyses",
      "All report types supported",
      "AI health insights & trends",
      "Medication tracking",
      "Unlimited report history",
      "PDF export",
      "Priority support",
    ],
    missing: [],
    cta: "Start Pro Trial",
    ctaVariant: "primary" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    label: "Mapper",
    badge: null,
    highlighted: false,
    monthly: "Custom",
    annual: "Custom",
    desc: "Tailored solutions for clinics, hospitals, and health platforms.",
    features: [
      "Everything in Pro",
      "Team & patient management",
      "EHR / EMR integration",
      "HIPAA-compliant storage",
      "Dedicated onboarding",
      "Custom branding & white-labelling",
      "SLA guarantee",
    ],
    missing: [],
    cta: "Contact Sales",
    ctaVariant: "secondary" as const,
  },
];

const COMPARISON = [
  { feature: "Report analyses / month",       free: "3",         pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Blood panel & urinalysis",       free: true,        pro: true,        enterprise: true        },
  { feature: "All report types",               free: false,       pro: true,        enterprise: true        },
  { feature: "AI plain-language summaries",    free: true,        pro: true,        enterprise: true        },
  { feature: "AI health insights & trends",    free: false,       pro: true,        enterprise: true        },
  { feature: "Medication tracking",            free: false,       pro: true,        enterprise: true        },
  { feature: "PDF export",                     free: false,       pro: true,        enterprise: true        },
  { feature: "Report history",                 free: "7 days",    pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Team & patient management",      free: false,       pro: false,       enterprise: true        },
  { feature: "EHR / EMR integration",          free: false,       pro: false,       enterprise: true        },
  { feature: "Custom branding",                free: false,       pro: false,       enterprise: true        },
  { feature: "SLA guarantee",                  free: false,       pro: false,       enterprise: true        },
  { feature: "Support",                        free: "Email",     pro: "Priority",  enterprise: "Dedicated" },
];

function Check({ on }: { on: boolean }) {
  if (on) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mx-auto">
      <circle cx="8" cy="8" r="7" fill="var(--color-normal-bg)" stroke="var(--color-normal-border)" />
      <path d="M5 8l2 2 4-4" stroke="var(--color-normal-text)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mx-auto">
      <path d="M3 3l8 8M11 3L3 11" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);

  function handleSelect(id: string) {
    if (id === "enterprise") {
      window.location.href = "mailto:sales@simplimed.ai";
      return;
    }
    router.push(isAuthenticated ? "/dashboard" : "/signin");
  }

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="px-6 py-16 text-center sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:text-left">
            <div>
              <p className="section-label mb-3 lg:text-left text-center">Pricing</p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
                style={{ color: "var(--color-text-primary)" }}>
                Simple, transparent pricing
              </h1>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Start free. Upgrade when you need more.
                Cancel or change your plan any time — no lock-ins.
              </p>

              {/* Annual toggle */}
              <div className="flex items-center gap-3 lg:justify-start justify-center">
                <span className="text-sm font-medium" style={{ color: annual ? "var(--color-text-muted)" : "var(--color-text-primary)" }}>
                  Monthly
                </span>
                <button
                  role="switch"
                  aria-checked={annual}
                  onClick={() => setAnnual(!annual)}
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200"
                  style={{ backgroundColor: annual ? "var(--color-brand)" : "#CBD5E1" }}>
                  <span className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                    style={{ transform: annual ? "translateX(24px)" : "translateX(4px)" }} />
                </button>
                <span className="text-sm font-medium" style={{ color: annual ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                  Annual
                </span>
                {annual && (
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }}>
                    Save 20%
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Image src="/subscription-model.svg" alt="Person choosing a subscription plan"
                width={440} height={320} className="w-full max-w-md drop-shadow-sm" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="px-6 py-12 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div key={tier.id}
                className="relative flex flex-col rounded-2xl border transition-shadow duration-200"
                style={
                  tier.highlighted
                    ? { backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-normal-border)", borderWidth: 2, boxShadow: "var(--shadow-card-lg)" }
                    : { backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }
                }>

                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-semibold"
                    style={
                      tier.highlighted
                        ? { backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }
                        : { backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)", border: "1px solid #C7D2FE" }
                    }>
                    {tier.badge}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  {/* Header */}
                  <div className="mb-6">
                    <p className="section-label mb-1">{tier.label}</p>
                    <h2 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {tier.name}
                    </h2>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                        {annual ? tier.annual : tier.monthly}
                      </span>
                      {tier.monthly !== "Custom" && (
                        <span className="mb-1 text-sm" style={{ color: "var(--color-text-muted)" }}>/month</span>
                      )}
                    </div>
                    {annual && tier.monthly !== "Custom" && tier.monthly !== "$0" && (
                      <p className="mt-0.5 text-xs" style={{ color: "var(--color-normal-text)" }}>
                        Billed annually · Save 20%
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {tier.desc}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mb-6 flex flex-1 flex-col gap-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                          className="mt-0.5 shrink-0" aria-hidden="true">
                          <circle cx="8" cy="8" r="7" fill="var(--color-normal-bg)" stroke="var(--color-normal-border)" />
                          <path d="M5 8l2 2 4-4" stroke="var(--color-normal-text)" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{f}</span>
                      </li>
                    ))}
                    {tier.missing.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 opacity-40">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                          className="mt-0.5 shrink-0" aria-hidden="true">
                          <path d="M3 3l8 8M11 3L3 11" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm text-slate-400">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleSelect(tier.id)}
                    className={`${tier.ctaVariant === "primary" ? "btn-primary" : "btn-secondary"} w-full justify-center py-3 text-sm font-semibold`}>
                    {tier.cta}
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: "🔒", text: "Secure payments via Stripe"   },
              { icon: "🔄", text: "Cancel or upgrade anytime"    },
              { icon: "🏥", text: "HIPAA-compliant platform"     },
              { icon: "💳", text: "No credit card for free plan" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <span className="text-base">{icon}</span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full comparison table ── */}
      <section className="px-6 py-16 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Full feature comparison
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--color-border)" }}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ backgroundColor: "var(--color-bg-subtle)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400">Feature</th>
                  {["Free", "Pro", "Enterprise"].map((t) => (
                    <th key={t} className="px-5 py-4 text-center text-xs font-semibold"
                      style={{ color: "var(--color-text-secondary)" }}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature}
                    style={{ borderBottom: i < COMPARISON.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}>
                    <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      {row.feature}
                    </td>
                    {[row.free, row.pro, row.enterprise].map((val, j) => (
                      <td key={j} className="px-5 py-3.5 text-center text-sm">
                        {typeof val === "boolean" ? (
                          <Check on={val} />
                        ) : (
                          <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-16 sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}>
        <div className="mx-auto max-w-[1920px]">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Pricing FAQs
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { q: "Can I switch plans later?",        a: "Yes — upgrade or downgrade any time. Changes take effect at the next billing cycle." },
                { q: "What happens after the free trial?", a: "You keep access to 3 reports/month on the Free plan forever. No automatic charges." },
                { q: "Do you offer student or NGO discounts?", a: "Yes. Contact sales@simplimed.ai with proof of eligibility for 40% off any paid plan." },
                { q: "Is there a refund policy?",         a: "We offer a full refund within 14 days of your first paid charge, no questions asked." },
              ].map((item, i) => {
                const [open, setOpen] = useState(false);
                return (
                  <div key={i} className="overflow-hidden rounded-2xl border"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-base)" }}>
                    <button onClick={() => setOpen(!open)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left">
                      <span className="text-sm font-semibold pr-4" style={{ color: "var(--color-text-primary)" }}>
                        {item.q}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {open && (
                      <div className="border-t px-5 pb-4 pt-3" style={{ borderColor: "var(--color-border-muted)" }}>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-6 py-20 text-center sm:px-10 lg:px-16"
        style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="mx-auto max-w-xl">
          <Image src="/feeling-happy.svg" alt="Happy person"
            width={240} height={180} className="mx-auto mb-6 drop-shadow-sm" />
          <h2 className="mb-3 text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Start understanding your health today
          </h2>
          <p className="mb-8 text-base" style={{ color: "var(--color-text-secondary)" }}>
            Join 50,000+ people who already use Simplimed to make sense of their medical data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signin")}
              className="btn-primary gap-2 px-8 py-3 text-base font-semibold"
              style={{ borderRadius: "0.875rem" }}>
              Get Started Free
            </button>
            <a href="mailto:sales@simplimed.ai" className="btn-secondary px-7 py-3 text-base"
              style={{ borderRadius: "0.875rem" }}>
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
