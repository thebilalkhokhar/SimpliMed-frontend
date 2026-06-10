"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M4 2h7l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Analysis",
    href: "/dashboard/analysis",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 13L7 9l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Health Profile",
    href: "/dashboard/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="5" r="1.75" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="9" r="1.75" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="13" r="1.75" fill="var(--color-bg-base)" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
] as const;

interface SidebarProps {
  /** Desktop: whether the sidebar is expanded (wide) or collapsed (icon-only) */
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Mobile: whether the drawer is open */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  /* ── Shared sidebar body ─────────────────────────────────────────────── */
  const body = (isMobileDrawer = false) => (
    <aside
      className={[
        "group flex h-full flex-col transition-all duration-300",
        isMobileDrawer ? "w-64" : collapsed ? "w-[68px]" : "w-64",
      ].join(" ")}
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* ── Logo row + desktop collapse toggle ── */}
      <div
        className="flex h-16 shrink-0 items-center px-3"
        style={{
          borderBottom: "1px solid var(--color-border)",
          justifyContent: collapsed && !isMobileDrawer ? "center" : "space-between",
        }}
      >
        {collapsed && !isMobileDrawer ? (
          <div className="relative flex items-center justify-center">
            {/* Logo — visible by default, hidden on sidebar hover */}
            <Image src="/logo.svg" alt="Simplimed" width={32} height={32}
              className="rounded-xl transition-opacity duration-200 group-hover:opacity-0" />
            {/* Expand button — hidden by default, visible on sidebar hover */}
            <button onClick={onToggleCollapse}
              className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color: "var(--color-brand)" }} aria-label="Expand sidebar">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 3h4v10H2V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M6 3h8v10H6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M10 7l2 1-2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="Simplimed" width={32} height={32} className="rounded-xl" />
              <span className="whitespace-nowrap text-base font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}>
                Simplimed
              </span>
            </div>

            {/* Desktop collapse button */}
            {!isMobileDrawer && (
              <button
                onClick={onToggleCollapse}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Collapse sidebar"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-brand)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 3h4v10H2V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M6 3h8v10H6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M10 7L8 8l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Mobile close button */}
            {isMobileDrawer && (
              <button
                onClick={onMobileClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
        {/* New Analysis CTA */}
        <Link
          href="/chat"
          title={collapsed && !isMobileDrawer ? "New Analysis" : undefined}
          onClick={isMobileDrawer ? onMobileClose : undefined}
          className={[
            "mb-3 flex items-center rounded-xl transition-colors duration-150",
            collapsed && !isMobileDrawer
              ? "h-9 w-9 justify-center mx-auto"
              : "gap-2 px-3 py-2.5 justify-center text-sm font-semibold",
          ].join(" ")}
          style={{ backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          {(!collapsed || isMobileDrawer) && <span>New Analysis</span>}
        </Link>

        {/* Section label — hidden when collapsed */}
        {(!collapsed || isMobileDrawer) && (
          <p className="section-label mb-2 px-2">Menu</p>
        )}

        {NAV_ITEMS.map(({ label, href, icon }) => {
          // Exact match for /dashboard to avoid matching all /dashboard/* sub-pages
          const isActive = href === "/dashboard"
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              title={collapsed && !isMobileDrawer ? label : undefined}
              onClick={isMobileDrawer ? onMobileClose : undefined}
              className={[
                "flex items-center rounded-xl transition-colors duration-150",
                collapsed && !isMobileDrawer
                  ? "h-9 w-9 justify-center mx-auto"
                  : "gap-3 px-3 py-2.5 text-sm font-medium",
              ].join(" ")}
              style={
                isActive
                  ? { backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)", boxShadow: "var(--shadow-card)" }
                  : { color: "var(--color-text-secondary)" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                }
              }}
            >
              <span style={{ color: isActive ? "var(--color-text-inverse)" : "var(--color-text-muted)", flexShrink: 0 }}>
                {icon}
              </span>
              {(!collapsed || isMobileDrawer) && label}
            </Link>
          );
        })}
      </nav>

      {/* ── User strip ── */}
      <div style={{ borderTop: "1px solid var(--color-border)" }} className="p-3">
        <div
          className={[
            "flex items-center rounded-xl cursor-pointer transition-colors duration-150",
            collapsed && !isMobileDrawer ? "justify-center p-1" : "gap-3 p-2",
          ].join(" ")}
          title={collapsed && !isMobileDrawer ? "Alex Kim" : undefined}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{ backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }}>
            AK
          </div>
          {(!collapsed || isMobileDrawer) && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Alex Kim</p>
              <p className="truncate text-xs" style={{ color: "var(--color-text-secondary)" }}>alex@simplimed.ai</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop sidebar — always in DOM, width animates ── */}
      <div className="hidden h-full md:flex">
        {body(false)}
      </div>

      {/* ── Mobile drawer — always in DOM for slide animation ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)" }}
        onClick={onMobileClose}
        aria-hidden={!mobileOpen}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 h-full md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {body(true)}
      </div>
    </>
  );
}
