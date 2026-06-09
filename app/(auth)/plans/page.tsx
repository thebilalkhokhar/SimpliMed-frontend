"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Plan data
───────────────────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    id: "free",
    tier: "Free",
    label: "Evaluation Tier",
    badge: "14-Day Trial",
    price: "$0",
    period: "",
    description: "Explore Simplimed risk-free for 14 days. No credit card required.",
    features: [
      "3 report analyses",
      "Blood panel & urinalysis support",
      "Plain-language summaries",
      "7-day report history",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
    stripePath: "/api/stripe/checkout?plan=free", // stub
  },
  {
    id: "pro",
    tier: "Pro",
    label: "Mapper Lite Tier",
    badge: "Most Popular",
    price: "$19",
    period: "/month",
    description: "Full access for individuals managing their health journey actively.",
    features: [
      "Unlimited report analyses",
      "All report types supported",
      "AI health insights & trends",
      "Medication tracking",
      "Unlimited report history",
      "PDF export",
      "Priority support",
    ],
    cta: "Get Pro",
    highlighted: true,
    stripePath: "/api/stripe/checkout?plan=pro",
  },
  {
    id: "enterprise",
    tier: "Enterprise",
    label: "Mapper Tier",
    badge: null,
    price: "Custom",
    period: "",
    description: "Tailored solutions for clinics, hospitals, and health platforms.",
    features: [
      "Everything in Pro",
      "Team & patient management",
      "EHR / EMR integration",
      "HIPAA-compliant storage",
      "Dedicated onboarding",
      "Custom branding",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
    stripePath: "/contact-sales",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   Checkmark icon
───────────────────────────────────────────────────────────────────────────── */
function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="7" fill="var(--color-normal-bg)" stroke="var(--color-normal-border)" />
      <path d="M5 8l2 2 4-4" stroke="var(--color-normal-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function PlansPage() {
  const router = useRouter();
  const [selecting, setSelecting] = useState<string | null>(null);

  function handleSelectPlan(plan: typeof PLANS[number]) {
    setSelecting(plan.id);
    // Stub: simulate Stripe redirect + webhook confirmation, then land on dashboard
    setTimeout(() => {
      setSelecting(null);
      // In production: redirect to plan.stripePath for real Stripe checkout
      router.push("/chat");
    }, 1200);
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      {/* Top header bar */}
      <div
        className="w-full border-b px-6 py-4 text-center"
        style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto flex max-w-[1920px] flex-col items-center gap-1 sm:px-10 lg:px-16">
          {/* Step indicator */}
          <div className="mb-3 flex items-center gap-2">
            {[
              { n: 1, label: "Account" },
              { n: 2, label: "Verify" },
              { n: 3, label: "Choose Plan" },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={
                      n === 3
                        ? { backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }
                        : { backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }
                    }
                  >
                    {n < 3 ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : n}
                  </div>
                  <span className="text-xs font-medium" style={{ color: n === 3 ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className="w-8 h-px" style={{ backgroundColor: "var(--color-border)" }} />}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Choose your plan
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Select the tier that fits your needs. Upgrade or cancel anytime.
          </p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="mx-auto w-full max-w-[1920px] px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isSelecting = selecting === plan.id;
            return (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl border transition-shadow duration-200"
                style={
                  plan.highlighted
                    ? {
                        backgroundColor: "var(--color-bg-base)",
                        borderColor: "var(--color-normal-border)",
                        borderWidth: "2px",
                        boxShadow: "var(--shadow-card-lg)",
                      }
                    : {
                        backgroundColor: "var(--color-bg-base)",
                        borderColor: "var(--color-border)",
                        boxShadow: "var(--shadow-card)",
                      }
                }
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-semibold"
                    style={
                      plan.highlighted
                        ? { backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }
                        : { backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)", border: "1px solid #C7D2FE" }
                    }
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  {/* Header */}
                  <div className="mb-6">
                    <p className="section-label mb-1">{plan.label}</p>
                    <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {plan.tier}
                    </h2>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="mb-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Feature list */}
                  <ul className="mb-8 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check />
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={!!selecting}
                    className={plan.highlighted ? "btn-primary w-full justify-center py-3 text-sm font-semibold" : "btn-secondary w-full justify-center py-3 text-sm font-semibold"}
                    style={selecting ? { opacity: 0.7, cursor: "not-allowed" } : {}}
                  >
                    {isSelecting ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/>
                        </svg>
                        Processing…
                      </>
                    ) : (
                      <>
                        {plan.cta}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: "🔒", text: "Secure payments via Stripe" },
            { icon: "🔄", text: "Cancel or upgrade anytime" },
            { icon: "🏥", text: "HIPAA-compliant platform" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span className="text-base">{icon}</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
