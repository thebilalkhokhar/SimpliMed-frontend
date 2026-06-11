"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

type FormErrors = Partial<Record<"firstName" | "lastName" | "age" | "email" | "password" | "confirm", string>>;

/* ── Email Verification Modal ─────────────────────────────────────────────── */
function VerificationModal({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-8 text-center"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-card-lg)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-brand-light)" }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect x="3" y="6" width="20" height="14" rx="3" stroke="var(--color-brand)" strokeWidth="1.75"/>
            <path d="M3 9l10 7 10-7" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 id="verify-title" className="mb-2 text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
          Verify your email
        </h2>
        <p className="mb-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          We&apos;ve sent a confirmation link to
        </p>
        <p className="mb-5 text-sm font-semibold" style={{ color: "var(--color-brand)" }}>
          {email}
        </p>
        <p className="mb-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
        </p>

        <button onClick={onClose} className="btn-primary w-full justify-center py-2.5">
          Got it, continue to plans
        </button>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "", lastName: "", age: "", email: "", password: "", confirm: "",
  });
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]           = useState<FormErrors>({});
  const [loading, setLoading]         = useState(false);
  const [showVerify, setShowVerify]   = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.firstName.trim())  e.firstName = "First name is required.";
    if (!form.lastName.trim())   e.lastName  = "Last name is required.";
    const age = Number(form.age);
    if (!form.age.trim())        e.age = "Age is required.";
    else if (!Number.isInteger(age) || age < 1 || age > 120) e.age = "Enter a valid age (1–120).";
    if (!form.email.trim())      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password)          e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.password)) e.password = "Include at least one uppercase letter.";
    else if (!/[0-9]/.test(form.password)) e.password = "Include at least one number.";
    if (!form.confirm)           e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowVerify(true);
    }, 800);
  }

  function handleVerifyClose() {
    setShowVerify(false);
    router.push("/chat");
  }

  function handleGoogle() {
    router.push("/chat");
  }

  const inputStyle = (field: keyof FormErrors) =>
    errors[field]
      ? { borderColor: "var(--color-abnormal-text)", boxShadow: "0 0 0 1px var(--color-abnormal-text)" }
      : {};

  return (
    <>
      {showVerify && <VerificationModal email={form.email} onClose={handleVerifyClose} />}

      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12"
        style={{ backgroundColor: "#FAFBFF" }}>

        {/* ── Animated background ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Blobs */}
          <div className="animate-blob-1 absolute -left-32 -top-20 h-[450px] w-[450px] rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }} />
          <div className="animate-blob-2 absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
          <div className="animate-blob-3 absolute left-1/2 top-1/3 h-[350px] w-[350px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }} />

          {/* Diagonal ribbon */}
          <div className="hidden md:block absolute left-[-5%] right-[-5%] top-1/2 h-[220px] -translate-y-1/2 -rotate-[4deg]"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)",
              borderRadius: "2rem",
              opacity: 0.9,
            }} />

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>

        {/* ── Form card with glowing gradient border ── */}
        <div className="relative z-10 w-full max-w-md">

          {/* Logo above card */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <Image src="/logo.svg" alt="Simplimed" width={44} height={44} className="rounded-xl" />
            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Simplimed
            </span>
          </div>

          {/* Glowing border wrapper */}
          <div className="rounded-3xl p-[2px]"
            style={{
              background: "conic-gradient(from var(--gradient-angle, 0deg), #4F46E5, #6366F1, #3B82F6, #8B5CF6, #A78BFA, #4F46E5)",
              animation: "gradient-rotate 4s linear infinite",
            }}>

            {/* Inner card */}
            <div className="rounded-[calc(1.5rem-2px)] p-8 sm:p-10"
              style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}>

              {/* Header */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                  Create your account
                </h1>
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Start understanding your health today
                </p>
              </div>

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
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>or register with email</span>
                <div className="h-px flex-1" style={{ backgroundColor: "var(--color-border)" }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" id="firstName" error={errors.firstName}>
                    <input id="firstName" type="text" autoComplete="given-name"
                      placeholder="Alex" className="input" value={form.firstName}
                      onChange={set("firstName")} style={inputStyle("firstName")} />
                  </Field>
                  <Field label="Last Name" id="lastName" error={errors.lastName}>
                    <input id="lastName" type="text" autoComplete="family-name"
                      placeholder="Kim" className="input" value={form.lastName}
                      onChange={set("lastName")} style={inputStyle("lastName")} />
                  </Field>
                </div>

                {/* Age */}
                <Field label="Age" id="age" error={errors.age}>
                  <input
                    id="age"
                    type="number"
                    min={1}
                    max={120}
                    placeholder="e.g. 34"
                    className="input"
                    value={form.age}
                    onChange={set("age")}
                    style={inputStyle("age")}
                  />
                </Field>

                {/* Email */}
                <Field label="Email address" id="email" error={errors.email}>
                  <input id="email" type="email" autoComplete="email"
                    placeholder="you@example.com" className="input"
                    value={form.email} onChange={set("email")} style={inputStyle("email")} />
                </Field>

                {/* Password */}
                <Field label="Password" id="password" error={errors.password}>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      className="input pr-11"
                      value={form.password}
                      onChange={set("password")}
                      style={inputStyle("password")}
                    />
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

                {/* Confirm password */}
                <Field label="Confirm Password" id="confirm" error={errors.confirm}>
                  <div className="relative">
                    <input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      className="input pr-11"
                      value={form.confirm}
                      onChange={set("confirm")}
                      style={inputStyle("confirm")}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--color-text-muted)" }}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}>
                      {showConfirm ? (
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

                {/* Terms */}
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  By creating an account you agree to our{" "}
                  <a href="#" style={{ color: "var(--color-brand)" }}>Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" style={{ color: "var(--color-brand)" }}>Privacy Policy</a>.
                </p>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}>
                  {/* Shimmer */}
                  <span className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Already have an account?{" "}
                <Link href="/signin" className="font-semibold" style={{ color: "var(--color-brand)" }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Trust badges below card */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: "🔒", text: "HIPAA Compliant" },
              { icon: "⚡", text: "2s Analysis" },
              { icon: "🤖", text: "AI-Powered" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
                style={{ backgroundColor: "rgba(255,255,255,0.6)", borderColor: "var(--color-border)", backdropFilter: "blur(6px)" }}>
                <span className="text-sm">{icon}</span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Simplimed ·{" "}
            <Link href="/" style={{ color: "var(--color-brand)" }}>Back to home</Link>
          </p>
        </div>
      </div>
    </>
  );
}
