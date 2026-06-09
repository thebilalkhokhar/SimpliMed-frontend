"use client";

import AuthCard from "@/components/ui/AuthCard";
import AuthSplitLayout from "@/components/ui/AuthSplitLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ── Field wrapper ────────────────────────────────────────────────────────── */
function Field({
  label, id, error, children,
}: {
  label: string; id: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: "var(--color-abnormal-text)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [errors, setErrors]   = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!email.trim())                                        e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))     e.email    = "Enter a valid email address.";
    if (!password)                                            e.password = "Password is required.";
    else if (password.length < 6)                            e.password = "Password must be at least 6 characters.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/chat"); }, 900);
  }

  function handleGoogle() { router.push("/chat"); }

  return (
    <AuthSplitLayout
      illustration="/sign-in.svg"
      illustrationAlt="Doctor reviewing a medical report on a screen"
      tagline="Understand your health reports instantly"
      taglineSub="Upload any medical report and get clear, AI-powered explanations in seconds."
    >
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your Simplimed account"
      >
        {/* Google OAuth */}
        <button type="button" onClick={handleGoogle} className="btn-secondary mb-5 w-full gap-3 py-2.5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: "var(--color-border)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>or continue with email</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--color-border)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field label="Email address" id="email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
              className="input" value={email} onChange={(e) => setEmail(e.target.value)}
              style={errors.email ? { borderColor: "var(--color-abnormal-text)", boxShadow: "0 0 0 1px var(--color-abnormal-text)" } : {}} />
          </Field>

          <Field label="Password" id="password" error={errors.password}>
            <div className="relative">
              <input id="password" type={showPw ? "text" : "password"} autoComplete="current-password"
                placeholder="••••••••" className="input pr-11" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={errors.password ? { borderColor: "var(--color-abnormal-text)", boxShadow: "0 0 0 1px var(--color-abnormal-text)" } : {}} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-muted)" }}
                aria-label={showPw ? "Hide password" : "Show password"}>
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 1l14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M3.3 3.4A7.6 7.6 0 0 0 1 8s2.4 4.5 7 4.5c1.4 0 2.7-.4 3.7-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M12.1 10.8A7.6 7.6 0 0 0 15 8S12.6 3.5 8 3.5c-.8 0-1.6.1-2.3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 8S3.4 3.5 8 3.5 15 8 15 8s-2.4 4.5-7 4.5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                  </svg>
                )}
              </button>
            </div>
          </Field>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-medium" style={{ color: "var(--color-brand)" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary mt-1 w-full justify-center py-2.5 text-sm font-semibold"
            style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
            {loading && (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/>
              </svg>
            )}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold" style={{ color: "var(--color-brand)" }}>
            Create one
          </Link>
        </p>
      </AuthCard>
    </AuthSplitLayout>
  );
}
