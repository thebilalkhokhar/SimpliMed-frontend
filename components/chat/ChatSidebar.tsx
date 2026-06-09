"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Mock chat history — replace with real data from API
───────────────────────────────────────────────────────────────────────────── */
const HISTORY = [
  {
    id: "1",
    title: "Blood panel — CBC analysis",
    date: "Today",
    preview: "Hemoglobin levels flagged as low…",
  },
  {
    id: "2",
    title: "Lipid profile review",
    date: "Yesterday",
    preview: "LDL cholesterol slightly elevated…",
  },
  {
    id: "3",
    title: "Thyroid panel — TSH/T4",
    date: "3 days ago",
    preview: "TSH within normal range…",
  },
  {
    id: "4",
    title: "Urinalysis report",
    date: "Last week",
    preview: "Trace protein detected, follow up…",
  },
  {
    id: "5",
    title: "MRI spine findings",
    date: "2 weeks ago",
    preview: "Mild disc herniation at L4-L5…",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────────────────────── */
interface ChatSidebarProps {
  /** Controlled open state for mobile drawer */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function ChatSidebar({ mobileOpen, onMobileClose }: ChatSidebarProps) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sidebarContent = (
    <aside
      className="flex h-full w-[300px] shrink-0 flex-col"
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* ── Logo / workspace header ── */}
      <div
        className="flex h-16 shrink-0 items-center justify-between px-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Simplimed" width={32} height={32} className="rounded-xl" />
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Simplimed
          </span>
        </div>

        {/* New chat button */}
        <Link
          href="/chat"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150"
          title="New analysis"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "";
            (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      {/* ── Chat history ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="section-label">Chat History</p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
          {HISTORY.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className="w-full rounded-xl px-3 py-2.5 text-left transition-colors duration-150"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-brand-light)",
                        border: "1px solid #C7D2FE",
                      }
                    : {
                        border: "1px solid transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="truncate text-sm font-medium leading-snug"
                    style={{ color: isActive ? "var(--color-brand)" : "var(--color-text-primary)" }}
                  >
                    {item.title}
                  </p>
                  <span
                    className="shrink-0 text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {item.date}
                  </span>
                </div>
                <p
                  className="mt-0.5 truncate text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {item.preview}
                </p>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Navigation links ── */}
      <div
        className="px-2 py-3"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {[
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ),
          },
          {
            label: "Settings",
            href: "/dashboard/settings",
            icon: (
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ),
          },
        ].map(({ label, href, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150"
              style={{ color: active ? "var(--color-brand)" : "var(--color-text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "";
                (e.currentTarget as HTMLElement).style.color = active ? "var(--color-brand)" : "var(--color-text-secondary)";
              }}
            >
              <span style={{ color: "inherit" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* ── User profile box ── */}
      <div
        className="shrink-0 p-3"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div
          className="flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-colors duration-150"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "";
          }}
        >
          {/* Avatar */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }}
          >
            AK
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Alex Kim
            </p>
            <p className="truncate text-xs" style={{ color: "var(--color-text-muted)" }}>
              Pro Plan · alex@simplimed.ai
            </p>
          </div>

          {/* Manage cue */}
          <button
            className="shrink-0 rounded-lg p-1 transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Profile options"
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="2.5" r="1" fill="currentColor" />
              <circle cx="7" cy="7" r="1" fill="currentColor" />
              <circle cx="7" cy="11.5" r="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — always visible */}
      <div className="hidden h-full md:flex">{sidebarContent}</div>

      {/* Mobile — slide-out drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)" }}
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 h-full md:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
