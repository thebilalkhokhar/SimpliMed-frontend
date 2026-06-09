"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Features",  href: "/#features"      },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing",   href: "/pricing"         },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-6 sm:px-10 lg:px-16">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
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

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: isActive ? "var(--color-brand)" : "var(--color-text-secondary)",
                  backgroundColor: isActive ? "var(--color-brand-light)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link href="/signin"
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
            }}
          >
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary px-5 py-2 text-sm font-semibold">
            Get Started Free
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150 md:hidden"
          style={{ color: "var(--color-text-secondary)" }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div className="border-t md:hidden"
          style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
          <nav className="flex flex-col gap-0.5 px-4 py-3">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-xl px-4 py-2.5 text-sm font-medium"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 border-t px-4 pb-4 pt-3"
            style={{ borderColor: "var(--color-border)" }}>
            <Link href="/signin" className="btn-secondary justify-center text-sm"
              onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary justify-center text-sm font-semibold"
              onClick={() => setMobileOpen(false)}>
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
