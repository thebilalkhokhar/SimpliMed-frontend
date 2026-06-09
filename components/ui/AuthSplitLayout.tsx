import Image from "next/image";
import Link from "next/link";

interface AuthSplitLayoutProps {
  illustration: string;
  illustrationAlt: string;
  tagline: string;
  taglineSub?: string;
  children: React.ReactNode;
}

/**
 * Two-column auth layout.
 *
 * Desktop (md+):
 *   Left  — branded illustration panel, full viewport height, sticky
 *   Right — scrollable form column, full viewport height
 *
 * Mobile (<md):
 *   Single column, form only, illustration hidden
 */
export default function AuthSplitLayout({
  illustration,
  illustrationAlt,
  tagline,
  taglineSub,
  children,
}: AuthSplitLayoutProps) {
  return (
    /*
     * Outer shell: full viewport, no overflow — children scroll internally.
     * h-screen + overflow-hidden on the shell means each column manages its
     * own scroll, so the two panels always share the same height.
     */
    <div className="flex h-screen w-full overflow-hidden">

      {/* ── LEFT: Illustration panel ──────────────────────────────────── */}
      {/*
       * sticky + h-screen so it never scrolls away.
       * hidden on mobile, shown from md up.
       */}
      <div
        className="relative hidden h-screen flex-col md:flex md:w-1/2 lg:w-[55%] xl:w-[60%]"
        style={{
          background: "linear-gradient(145deg, #EEF2FF 0%, #F0F9FF 45%, #ECFDF5 100%)",
          flexShrink: 0,
        }}
      >
        {/* Subtle decorative blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(199,210,254,0.55) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,243,208,0.4) 0%, transparent 70%)" }}
        />

        {/* Top-left logo */}
        <div className="relative z-10 flex shrink-0 items-center gap-2.5 px-10 pt-8">
          <Image src="/logo.svg" alt="Simplimed" width={32} height={32} className="rounded-xl" />
          <Link href="/" className="text-sm font-bold tracking-tight no-underline"
            style={{ color: "var(--color-text-primary)" }}>
            Simplimed
          </Link>
        </div>

        {/* Centre content — perfectly vertically centred */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10 py-8">
          {/* Illustration */}
          <div className="w-full max-w-xs">
            <Image
              src={illustration}
              alt={illustrationAlt}
              width={480}
              height={360}
              className="w-full object-contain drop-shadow-sm"
              priority
            />
          </div>

          {/* Tagline */}
          <div className="mt-8 text-center">
            <p className="text-xl font-bold leading-snug tracking-tight"
              style={{ color: "var(--color-text-primary)" }}>
              {tagline}
            </p>
            {taglineSub && (
              <p className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}>
                {taglineSub}
              </p>
            )}
          </div>

          {/* Trust pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: "🔒", text: "HIPAA Compliant" },
              { icon: "🤖", text: "AI-Powered" },
              { icon: "📋", text: "All Report Types" },
            ].map(({ icon, text }) => (
              <div key={text}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.65)",
                  borderColor: "var(--color-border)",
                  backdropFilter: "blur(8px)",
                }}>
                <span className="text-sm leading-none">{icon}</span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright — inside the panel */}
        <p className="relative z-10 shrink-0 pb-6 text-center text-[11px]"
          style={{ color: "var(--color-text-muted)" }}>
          © {new Date().getFullYear()} Simplimed
        </p>
      </div>

      {/* ── RIGHT: Form column ───────────────────────────────────────────── */}
      {/*
       * overflow-y-auto so this column scrolls independently on tall forms
       * (sign-up) without the left panel moving.
       */}
      <div
        className="flex h-screen flex-1 flex-col overflow-y-auto"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}
      >
        {/* Mobile-only logo at top */}
        <div className="flex shrink-0 items-center gap-2 px-6 pt-6 md:hidden">
          <Image src="/logo.svg" alt="Simplimed" width={32} height={32} className="rounded-xl" />
          <Link href="/" className="text-sm font-bold tracking-tight no-underline"
            style={{ color: "var(--color-text-primary)" }}>
            Simplimed
          </Link>
        </div>

        {/* Form — centred in the remaining vertical space */}
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          {children}
        </div>

        {/* Footer at the very bottom of the scroll column */}
        <div className="shrink-0 pb-5 pt-2 text-center">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Simplimed ·{" "}
            <Link href="/" className="text-xs" style={{ color: "var(--color-brand)" }}>
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
