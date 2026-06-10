"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Features",     href: "/#features"      },
  { label: "How It Works", href: "/#how-it-works"  },
  { label: "Pricing",      href: "/pricing"        },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1920px] items-center justify-between px-6 sm:px-10 lg:px-16">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image
            src="/logo.svg"
            alt="Simplimed logo"
            width={38}
            height={38}
            className="rounded-xl"
            style={{ objectFit: "contain" }}
          />
          <span className="text-lg font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}>
            Simplimed
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150"
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
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/signin"
            className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150"
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
          <Link href="/signup"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              boxShadow: "0 4px 14px rgba(79,70,229,0.25)",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #3730A3 0%, #4338CA 100%)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(79,70,229,0.4)";
              (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(79,70,229,0.25)";
              (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
            }}
          >
            Get Started Free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150 md:hidden"
          style={{ color: "var(--color-text-secondary)" }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      <div
        className={`overflow-hidden border-t transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-xl px-4 py-3 text-base font-medium transition-colors duration-150"
              style={{ color: "var(--color-text-secondary)" }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2.5 border-t px-5 pb-5 pt-4"
          style={{ borderColor: "var(--color-border)" }}>
          <Link href="/signin" className="rounded-xl border px-4 py-3 text-center text-base font-medium transition-colors duration-150"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
            onClick={() => setMobileOpen(false)}>
            Sign In
          </Link>
          <Link href="/signup"
            className="rounded-xl px-4 py-3 text-center text-base font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" }}
            onClick={() => setMobileOpen(false)}>
            Get Started Free
          </Link>
        </div>
      </div>
    </header>
  );
}
