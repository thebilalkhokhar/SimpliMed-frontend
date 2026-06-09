"use client";

import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Features",    href: "/#features"      },
    { label: "How It Works",href: "/#how-it-works"  },
    { label: "Pricing",     href: "/pricing"        },
    { label: "Changelog",   href: "#"               },
  ],
  Platform: [
    { label: "Dashboard",   href: "/dashboard"      },
    { label: "Reports",     href: "/dashboard/reports" },
    { label: "Analysis",    href: "/dashboard/analysis" },
    { label: "Chat",        href: "/chat"           },
  ],
  Company: [
    { label: "About",       href: "#"               },
    { label: "Blog",        href: "#"               },
    { label: "Careers",     href: "#"               },
    { label: "Contact",     href: "mailto:hello@simplimed.ai" },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "HIPAA Notice",     href: "#" },
    { label: "Cookie Policy",    href: "#" },
  ],
};

const SOCIAL = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M12.6 1h2.4L9.7 6.8 16 15h-4.7l-3.8-5-4.3 5H.8l5.6-6.4L0 1h4.8l3.4 4.6L12.6 1Zm-.8 12.6h1.3L4.3 2.4H3L11.8 13.6Z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212V9.359c0-.216.016-.432.08-.586.175-.431.57-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4Z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
      </svg>
    ),
  },
];

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t"
      style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}
    >
      {/* ── Main footer grid ── */}
      <div className="mx-auto w-full max-w-[1920px] px-6 py-14 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">

          {/* Brand column — 2 cols wide */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5 no-underline">
              <Image
                src="/logo.svg"
                alt="Simplimed logo"
                width={36}
                height={36}
                className="rounded-xl"
                style={{ objectFit: "contain" }}
              />
              <span className="text-base font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}>
                Simplimed
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}>
              AI-powered medical report analysis and personal health intelligence — clean,
              private, and built for you.
            </p>

            {/* Trust badges */}
            <div className="mb-6 flex flex-wrap gap-2">
              {["HIPAA Compliant", "SOC 2 Type II", "GDPR Ready"].map((badge) => (
                <span key={badge}
                  className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                  style={{
                    backgroundColor: "var(--color-normal-bg)",
                    borderColor: "var(--color-normal-border)",
                    color: "var(--color-normal-text)",
                  }}>
                  {badge}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — 1 col each */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-text-primary)" }}>
                {group}
              </p>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10 lg:px-16">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            © {year} Simplimed, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#"
                className="text-xs transition-colors duration-150"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
