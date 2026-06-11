"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function PlansPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(true);

  function handleSelect(id: string) {
    if (id === "enterprise") {
      window.location.href = "mailto:sales@simplimed.ai";
      return;
    }
    router.push("/chat");
  }

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 py-14 text-center sm:px-10 lg:px-16"
        style={{ backgroundColor: "#FAFBFF" }}>
        {/* Blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="animate-blob-1 absolute -left-32 top-0 h-[400px] w-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
          <div className="animate-blob-2 absolute -right-20 bottom-0 h-[350px] w-[350px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ backgroundColor: "rgba(238,242,255,0.8)", borderColor: "#C7D2FE" }}>
            <span className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>Manage Your Plan</span>
          </div> */}

          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            style={{ color: "var(--color-text-primary)" }}>
            Choose the plan that fits{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              your needs
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Start free. Upgrade when you need more. Cancel anytime — no lock-ins.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 rounded-2xl border p-1.5"
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
      </section>

      {/* ── Cards ── */}
      <section className="relative overflow-hidden px-6 pb-14 pt-8 sm:px-10 lg:px-16"
        style={{ backgroundColor: "#FAFBFF" }}>
        {/* Ribbon */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="hidden md:block absolute left-[-5%] right-[-5%] top-1/2 h-[240px] -translate-y-1/2 -rotate-[3deg]"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)",
              borderRadius: "2rem",
              opacity: 0.85,
            }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => (
              <div key={plan.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={
                  plan.highlighted
                    ? { backgroundColor: "rgba(255,255,255,0.95)", borderColor: "var(--color-brand)", borderWidth: 2, backdropFilter: "blur(12px)", boxShadow: "0 12px 40px rgba(79,70,229,0.15)" }
                    : { backgroundColor: "rgba(255,255,255,0.9)", borderColor: "var(--color-border)", backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }
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

                <div className="flex flex-1 flex-col p-7 pt-8">
                  {/* Plan name */}
                  <p className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: plan.highlighted ? "var(--color-brand)" : "var(--color-text-muted)" }}>
                    {plan.name}
                  </p>
                  <div className="mt-3 flex items-end gap-1.5">
                    <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                      {annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="mb-1 text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>/month</span>
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
                  <ul className="mb-8 flex flex-1 flex-col gap-3 mt-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={f.includes("Everything in") || f.includes("plus:")
                            ? { backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }
                            : { backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)" }
                          }>
                          {f.includes("Everything in") || f.includes("plus:") ? (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                              <path d="M5 2v6M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                              <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleSelect(plan.id)}
                    className={`w-full justify-center rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 ${
                      plan.ctaVariant === "primary"
                        ? "text-white hover:scale-[1.02]"
                        : "border hover:bg-indigo-50"
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

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: "🔒", text: "Secure payments via Stripe" },
              { icon: "🔄", text: "Cancel or upgrade anytime" },
              { icon: "🏥", text: "HIPAA-compliant platform" },
              { icon: "💳", text: "No credit card for free plan" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 rounded-full border px-4 py-2"
                style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(255,255,255,0.7)" }}>
                <span className="text-sm">{icon}</span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
