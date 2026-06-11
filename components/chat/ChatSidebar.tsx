"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SettingsModal from "./SettingsModal";
import PlansModal from "./PlansModal";

/* ─────────────────────────────────────────────────────────────────────────────
   Mock chat history
───────────────────────────────────────────────────────────────────────────── */
const INITIAL_HISTORY = [
  { id: "1", title: "Blood panel — CBC analysis" },
  { id: "2", title: "Lipid profile review" },
  { id: "3", title: "Thyroid panel — TSH/T4" },
  { id: "4", title: "Urinalysis report" },
  { id: "5", title: "MRI spine findings" },
  { id: "6", title: "Fasting glucose & HbA1c" },
  { id: "7", title: "Chest X-Ray report" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────────────────────── */
interface ChatSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Search Modal
───────────────────────────────────────────────────────────────────────────── */
function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const filtered = INITIAL_HISTORY.filter((h) =>
    h.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{
          backgroundColor: "rgba(15,23,42,0.4)",
          backdropFilter: "blur(3px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-x-4 top-24 z-50 mx-auto max-w-md rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 border-b px-4 py-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          >
            <circle
              cx="7"
              cy="7"
              r="5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 11l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search chats…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--color-text-primary)" }}
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p
              className="px-3 py-6 text-center text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              No chats found
            </p>
          ) : (
            filtered.map((h) => (
              <button
                key={h.id}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150"
                style={{ color: "var(--color-text-primary)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--color-bg-overlay)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "")
                }
                onClick={onClose}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  style={{ color: "var(--color-text-muted)", flexShrink: 0 }}
                >
                  <path
                    d="M2 3h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4l-2 2V4a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="truncate text-sm font-medium">{h.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
export default function ChatSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  function handleDelete(id: string) {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function startEdit(id: string, title: string) {
    setEditingId(id);
    setEditValue(title);
  }

  function saveEdit(id: string) {
    if (editValue.trim()) {
      setHistory((prev) =>
        prev.map((h) => (h.id === id ? { ...h, title: editValue.trim() } : h)),
      );
    }
    setEditingId(null);
  }

  /* ── Sidebar body ── */
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
      {/* ── Header: logo + collapse toggle ── */}
      <div
        className="flex h-16 shrink-0 items-center px-3"
        style={{
          borderBottom: "1px solid var(--color-border)",
          justifyContent:
            collapsed && !isMobileDrawer ? "center" : "space-between",
        }}
      >
        {collapsed && !isMobileDrawer ? (
          <div className="relative flex items-center justify-center">
            {/* Logo — visible by default, hidden on sidebar hover */}
            <Image
              src="/logo.svg"
              alt="Simplimed"
              width={28}
              height={28}
              className="rounded-lg transition-opacity duration-200 group-hover:opacity-0"
            />
            {/* Expand button — hidden by default, visible on sidebar hover */}
            <button
              onClick={onToggleCollapse}
              className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color: "var(--color-brand)" }}
              aria-label="Expand sidebar"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 3h4v10H2V3Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 3h8v10H6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 7l2 1-2 1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="Simplimed"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span
                className="text-sm font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Simplimed
              </span>
            </div>

            {!isMobileDrawer ? (
              <button
                onClick={onToggleCollapse}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Collapse sidebar"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--color-bg-overlay)";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--color-brand)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--color-text-muted)";
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3h4v10H2V3Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 3h8v10H6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 7L8 8l2 1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={onMobileClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Action buttons: New Chat + Search ── */}
      {!collapsed || isMobileDrawer ? (
        <div className="flex flex-col gap-2 px-3 pt-4 pb-2">
          {/* New Chat */}
          <Link
            href="/chat"
            onClick={isMobileDrawer ? onMobileClose : undefined}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-150"
            style={{
              backgroundColor: "var(--color-brand)",
              color: "var(--color-text-inverse)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-brand-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-brand)")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 2v10M2 7h10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            New Analysis
          </Link>

          {/* Search */}
          <button
            onClick={() => {
              setShowSearch(true);
              onMobileClose();
            }}
            className="flex items-center gap-2 rounded-xl border py-2 px-3 text-sm font-medium transition-colors duration-150"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-bg-overlay)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-brand)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border)";
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="7"
                cy="7"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 11l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Search chats
            <kbd
              className="ml-auto rounded px-1.5 py-0.5 text-[9px] font-medium"
              style={{
                backgroundColor: "var(--color-bg-overlay)",
                color: "var(--color-text-muted)",
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 px-1 pt-4 pb-2">
          <Link
            href="/chat"
            title="New Chat"
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150"
            style={{
              backgroundColor: "var(--color-brand)",
              color: "var(--color-text-inverse)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-brand-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-brand)")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 2v10M2 7h10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <button
            title="Search"
            onClick={() => {
              setShowSearch(true);
              onMobileClose();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150"
            style={{
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-bg-overlay)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="7"
                cy="7"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 11l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ── Chat history ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {(!collapsed || isMobileDrawer) && (
          <div className="px-4 pt-2 pb-1">
            <p className="section-label">History</p>
          </div>
        )}

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
          {history.map((item) => {
            const isActive = activeId === item.id;
            const isEditing = editingId === item.id;

            if (collapsed && !isMobileDrawer) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  title={item.title}
                  className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl transition-colors duration-150"
                  style={
                    isActive
                      ? {
                          backgroundColor: "var(--color-brand-light)",
                          border: "1px solid #C7D2FE",
                        }
                      : { border: "1px solid transparent" }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "var(--color-bg-overlay)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    style={{
                      color: isActive
                        ? "var(--color-brand)"
                        : "var(--color-text-muted)",
                    }}
                  >
                    <path
                      d="M2 3h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4l-2 2V4a1 1 0 0 1 1-1Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              );
            }

            return (
              <div
                key={item.id}
                className={`group flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-150 ${
                  isActive ? "" : "hover:bg-[var(--color-bg-overlay)]"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-brand-light)",
                        border: "1px solid #C7D2FE",
                      }
                    : { border: "1px solid transparent" }
                }
              >
                {/* Chat icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                  style={{
                    color: isActive
                      ? "var(--color-brand)"
                      : "var(--color-text-muted)",
                  }}
                  aria-hidden="true"
                >
                  <path
                    d="M2 3h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4l-2 2V4a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Title or edit input */}
                {isEditing ? (
                  <input
                    className="flex-1 rounded-lg border bg-white px-2 py-0.5 text-sm outline-none"
                    style={{
                      borderColor: "var(--color-brand)",
                      color: "var(--color-text-primary)",
                    }}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={() => saveEdit(item.id)}
                    autoFocus
                  />
                ) : (
                  <button
                    className="flex-1 truncate text-left text-sm font-medium"
                    style={{
                      color: isActive
                        ? "var(--color-brand)"
                        : "var(--color-text-primary)",
                    }}
                    onClick={() => setActiveId(item.id)}
                  >
                    {item.title}
                  </button>
                )}

                {/* Action icons — visible on hover or when active */}
                {!isEditing && (
                  <div
                    className={`flex shrink-0 items-center gap-0.5 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-150`}
                  >
                    {/* Edit */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(item.id, item.title);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--color-bg-overlay)";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--color-brand)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--color-text-muted)";
                      }}
                      aria-label="Rename"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M8.5 1.5L10.5 3.5 4 10H2V8L8.5 1.5Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--color-abnormal-bg)";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--color-abnormal-text)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--color-text-muted)";
                      }}
                      aria-label="Delete"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 3h8M4.5 3V2h3v1M3 3l.5 7h5L9 3"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ── Manage Plans ── */}
      {!collapsed || isMobileDrawer ? (
        <div className="px-3 py-2">
          <button
            onClick={() => {
              window.location.href = "/plans";
              if (isMobileDrawer) onMobileClose();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-150"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-brand-light)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-brand)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--color-brand)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--color-text-secondary)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 1l2 3h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-3Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            Manage Plans
          </button>
        </div>
      ) : (
        <div className="flex justify-center py-2">
          <button
            onClick={() => {
              window.location.href = "/plans";
            }}
            title="Manage Plans"
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--color-brand-light)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--color-brand)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.color =
                "var(--color-text-muted)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 1l2 3h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-3Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ── User strip with popup menu ── */}
      <div
        className="relative p-3"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* Outside click overlay to close menu */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
            aria-hidden="true"
          />
        )}
        {/* Popup menu — slides up with animation */}
        <div
          className={`absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-2xl border transition-all duration-200 ${
            showUserMenu
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card-lg)",
          }}
        >
          {/* Menu header — user info */}
          <div
            className="flex items-center gap-3 border-b px-4 py-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "var(--color-text-inverse)",
              }}
            >
              AK
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Alex Kim
              </p>
              <p
                className="truncate text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Pro Plan
              </p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <button
              onClick={() => {
                setShowUserMenu(false);
                setShowSettings(true);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--color-bg-overlay)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 5h12M3 9h12M3 13h12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle
                  cx="7"
                  cy="5"
                  r="1.5"
                  fill="var(--color-bg-base)"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="11"
                  cy="9"
                  r="1.5"
                  fill="var(--color-bg-base)"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="6"
                  cy="13"
                  r="1.5"
                  fill="var(--color-bg-base)"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              Settings
            </button>

            <div
              className="mx-3 my-1 h-px"
              style={{ backgroundColor: "var(--color-border-muted)" }}
            />

            <button
              onClick={() => {
                setShowUserMenu(false);
                window.location.href = "/signin";
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors duration-150"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--color-abnormal-bg)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--color-abnormal-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--color-text-secondary)";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M5 8h9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Log out
            </button>
          </div>
        </div>

        {/* User row — click to toggle menu */}
        <div
          onClick={() => {
            if (!collapsed || isMobileDrawer) setShowUserMenu(!showUserMenu);
          }}
          className={`flex items-center rounded-xl cursor-pointer transition-colors duration-150 ${collapsed && !isMobileDrawer ? "justify-center p-1" : "gap-3 p-2.5"}`}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--color-bg-overlay)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "")
          }
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: "var(--color-brand)",
              color: "var(--color-text-inverse)",
            }}
          >
            AK
          </div>
          {(!collapsed || isMobileDrawer) && (
            <>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Alex Kim
                </p>
                <p
                  className="truncate text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  alex@simplimed.ai
                </p>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`shrink-0 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              >
                <path
                  d="M3 5.5l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Plans modal */}
      {showPlans && <PlansModal onClose={() => setShowPlans(false)} />}

      {/* Settings modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Search modal */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

      {/* Desktop — always in DOM */}
      <div className="hidden h-full md:flex">{body(false)}</div>

      {/* Mobile drawer — always in DOM for animation, pointer-events controlled */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          backgroundColor: "rgba(15,23,42,0.4)",
          backdropFilter: "blur(2px)",
        }}
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
