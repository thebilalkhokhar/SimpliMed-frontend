"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type View = "request" | "sent" | "reset" | "done";

/* ── Field wrapper ────────────────────────────────────────────────────────── */
function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: "var(--color-abnormal-text)" }} role="alert">{error}</p>}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function ForgotPasswordPage() {
  const [view, setView]             = useState<View>("request");
  const [email, setEmail]           = useState("");
  const [emailErr, setEmailErr]     = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [pwErrors, setPwErrors]     = useState<{ newPw?: string; confirmPw?: string }>({});
  const [loading, setLoading]       = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setEmailErr("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr("Enter a valid email address."); return; }
    setEmailErr("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setView("sent"); }, 800);
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof pwErrors = {};
    if (!newPw)               errs.newPw = "New password is required.";
    else if (newPw.length < 8) errs.newPw = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(newPw)) errs.newPw = "Include at least one uppercase letter.";
    else if (!/[0-9]/.test(newPw)) errs.newPw = "Include at least one number.";
    if (!confirmPw)           errs.confirmPw = "Please confirm your password.";
    else if (confirmPw !== newPw) errs.confirmPw = "Passwords do not match.";
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setView("done"); }, 800);
  }

  const inputStyle = (hasError: boolean) =>
    hasError ? { borderColor: "var(--color-abnormal-text)", boxShadow: "0 0 0 1px var(--color-abnormal-text)" } : {};

  /* ── Render card content based on view ── */
  function renderContent() {
    if (view === "request") {
      return (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Forgot password?
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSend} noValidate className="flex flex-col gap-4">
            <Field label="Email address" id="fp-email" error={emailErr}>
              <input id="fp-email" type="email" autoComplete="email" placeholder="you@example.com"
                className="input" value={email} onChange={(e) => setEmail(e.target.value)}
                style={inputStyle(!!emailErr)} />
            </Field>

            <button type="submit" disabled={loading}
              className="relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              <span className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Remember it?{" "}
            <Link href="/signin" className="font-semibold" style={{ color: "var(--color-brand)" }}>Back to sign in</Link>
          </p>
        </>
      );
    }

    if (view === "sent") {
      return (
        <>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-brand-light)" }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <rect x="3" y="6" width="20" height="14" rx="3" stroke="var(--color-brand)" strokeWidth="1.75"/>
                <path d="M3 9l10 7 10-7" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Check your inbox</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              A password reset link has been sent to{" "}
              <span className="font-semibold" style={{ color: "var(--color-brand)" }}>{email}</span>.
              Check your spam folder if you don&apos;t see it.
            </p>
            <button onClick={() => setView("reset")}
              className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }}>
              <span className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              I clicked the link →
            </button>
            <button onClick={() => setView("request")} className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Resend email
            </button>
          </div>
        </>
      );
    }

    if (view === "reset") {
      return (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Set new password
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleReset} noValidate className="flex flex-col gap-4">
            <Field label="New Password" id="new-pw" error={pwErrors.newPw}>
              <div className="relative">
                <input id="new-pw" type={showNew ? "text" : "password"} autoComplete="new-password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number" className="input pr-11"
                  value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inputStyle(!!pwErrors.newPw)} />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }}
                  aria-label={showNew ? "Hide" : "Show"}>
                  {showNew ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M3.3 3.4A7.6 7.6 0 0 0 1 8s2.4 4.5 7 4.5c1.4 0 2.7-.4 3.7-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M12.1 10.8A7.6 7.6 0 0 0 15 8S12.6 3.5 8 3.5c-.8 0-1.6.1-2.3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8S3.4 3.5 8 3.5 15 8 15 8s-2.4 4.5-7 4.5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                  )}
                </button>
              </div>
            </Field>

            <Field label="Confirm Password" id="confirm-pw" error={pwErrors.confirmPw}>
              <div className="relative">
                <input id="confirm-pw" type={showConfirm ? "text" : "password"} autoComplete="new-password"
                  placeholder="Repeat new password" className="input pr-11"
                  value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} style={inputStyle(!!pwErrors.confirmPw)} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }}
                  aria-label={showConfirm ? "Hide" : "Show"}>
                  {showConfirm ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M3.3 3.4A7.6 7.6 0 0 0 1 8s2.4 4.5 7 4.5c1.4 0 2.7-.4 3.7-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M12.1 10.8A7.6 7.6 0 0 0 15 8S12.6 3.5 8 3.5c-.8 0-1.6.1-2.3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8S3.4 3.5 8 3.5 15 8 15 8s-2.4 4.5-7 4.5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                  )}
                </button>
              </div>
            </Field>

            <button type="submit" disabled={loading}
              className="relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              <span className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {loading ? "Saving…" : "Reset Password"}
            </button>
          </form>
        </>
      );
    }

    // view === "done"
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-normal-bg)", border: "1px solid var(--color-normal-border)" }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M5 13l6 6L21 7" stroke="var(--color-normal-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Password updated</h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Your password has been reset successfully. You can now sign in with your new credentials.
        </p>
        <Link href="/signin"
          className="relative w-full overflow-hidden rounded-xl py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }}>
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: "#FAFBFF" }}>

      {/* ── Animated background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-blob-1 absolute -left-32 -top-20 h-[450px] w-[450px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
        <div className="animate-blob-2 absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
        <div className="animate-blob-3 absolute left-1/2 top-1/3 h-[350px] w-[350px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }} />

        <div className="hidden md:block absolute left-[-5%] right-[-5%] top-[55%] h-[220px] -translate-y-1/2 -rotate-[4deg]"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)", borderRadius: "2rem", opacity: 0.9 }} />

        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/logo.svg" alt="Simplimed" width={44} height={44} className="rounded-xl" />
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>Simplimed</span>
        </div>

        {/* Glowing border */}
        <div className="rounded-3xl p-[2px]"
          style={{
            background: "conic-gradient(from var(--gradient-angle, 0deg), #4F46E5, #6366F1, #3B82F6, #8B5CF6, #A78BFA, #4F46E5)",
            animation: "gradient-rotate 4s linear infinite",
          }}>
          <div className="rounded-[calc(1.5rem-2px)] p-8 sm:p-10"
            style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}>
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          © {new Date().getFullYear()} Simplimed ·{" "}
          <Link href="/" style={{ color: "var(--color-brand)" }}>Back to home</Link>
        </p>
      </div>
    </div>
  );
}
