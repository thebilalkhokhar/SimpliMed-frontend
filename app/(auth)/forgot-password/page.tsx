"use client";

import AuthCard from "@/components/ui/AuthCard";
import Link from "next/link";
import { useState } from "react";

type View = "request" | "sent" | "reset" | "done";

/* ── Field wrapper ─────────────────────────────────────────────────────────── */
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

  /* ── Send OTP ── */
  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setEmailErr("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr("Enter a valid email address."); return; }
    setEmailErr("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setView("sent"); }, 800);
  }

  /* ── Reset password ── */
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

  /* ── View: request OTP ── */
  if (view === "request") {
    return (
      <AuthCard title="Forgot password?" subtitle="Enter your email and we'll send you a reset link.">
        <form onSubmit={handleSend} noValidate className="flex flex-col gap-4">
          <Field label="Email address" id="fp-email" error={emailErr}>
            <input
              id="fp-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={emailErr ? { borderColor: "var(--color-abnormal-text)", boxShadow: "0 0 0 1px var(--color-abnormal-text)" } : {}}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5 text-sm font-semibold"
            style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
          >
            {loading && (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/>
              </svg>
            )}
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Remember it?{" "}
          <Link href="/signin" className="font-semibold" style={{ color: "var(--color-brand)" }}>Back to sign in</Link>
        </p>
      </AuthCard>
    );
  }

  /* ── View: link sent confirmation ── */
  if (view === "sent") {
    return (
      <AuthCard title="Check your inbox">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-brand-light)" }}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect x="3" y="6" width="20" height="14" rx="3" stroke="var(--color-brand)" strokeWidth="1.75"/>
              <path d="M3 9l10 7 10-7" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            A password reset link has been sent to{" "}
            <span className="font-semibold" style={{ color: "var(--color-brand)" }}>{email}</span>.
            Check your spam folder if you don&apos;t see it.
          </p>
          {/* Simulate "clicked link in email" → go to reset view */}
          <button onClick={() => setView("reset")} className="btn-primary w-full justify-center py-2.5">
            I clicked the link →
          </button>
          <button
            onClick={() => setView("request")}
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Resend email
          </button>
        </div>
      </AuthCard>
    );
  }

  /* ── View: set new password ── */
  if (view === "reset") {
    return (
      <AuthCard title="Set new password" subtitle="Choose a strong password for your account.">
        <form onSubmit={handleReset} noValidate className="flex flex-col gap-4">
          {/* New Password */}
          <Field label="New Password" id="new-pw" error={pwErrors.newPw}>
            <div className="relative">
              <input
                id="new-pw"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                className="input pr-11"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                style={pwErrors.newPw ? { borderColor: "var(--color-abnormal-text)", boxShadow: "0 0 0 1px var(--color-abnormal-text)" } : {}}
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-muted)" }}
                aria-label={showNew ? "Hide" : "Show"}>
                {showNew ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M3.3 3.4A7.6 7.6 0 0 0 1 8s2.4 4.5 7 4.5c1.4 0 2.7-.4 3.7-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M12.1 10.8A7.6 7.6 0 0 0 15 8S12.6 3.5 8 3.5c-.8 0-1.6.1-2.3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8S3.4 3.5 8 3.5 15 8 15 8s-2.4 4.5-7 4.5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                )}
              </button>
            </div>
          </Field>

          {/* Confirm Password */}
          <Field label="Confirm Password" id="confirm-pw" error={pwErrors.confirmPw}>
            <div className="relative">
              <input
                id="confirm-pw"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat new password"
                className="input pr-11"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                style={pwErrors.confirmPw ? { borderColor: "var(--color-abnormal-text)", boxShadow: "0 0 0 1px var(--color-abnormal-text)" } : {}}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-muted)" }}
                aria-label={showConfirm ? "Hide" : "Show"}>
                {showConfirm ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M3.3 3.4A7.6 7.6 0 0 0 1 8s2.4 4.5 7 4.5c1.4 0 2.7-.4 3.7-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M12.1 10.8A7.6 7.6 0 0 0 15 8S12.6 3.5 8 3.5c-.8 0-1.6.1-2.3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8S3.4 3.5 8 3.5 15 8 15 8s-2.4 4.5-7 4.5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                )}
              </button>
            </div>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-1 w-full justify-center py-2.5 text-sm font-semibold"
            style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
          >
            {loading && (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/>
              </svg>
            )}
            {loading ? "Saving…" : "Reset Password"}
          </button>
        </form>
      </AuthCard>
    );
  }

  /* ── View: success ── */
  return (
    <AuthCard title="Password updated">
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-normal-bg)", border: "1px solid var(--color-normal-border)" }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M5 13l6 6L21 7" stroke="var(--color-normal-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Your password has been reset successfully. You can now sign in with your new credentials.
        </p>
        <Link href="/signin" className="btn-primary w-full justify-center py-2.5">
          Back to Sign In
        </Link>
      </div>
    </AuthCard>
  );
}
