"use client";

interface NavbarProps {
  onMobileMenuOpen: () => void;
}

export default function Navbar({ onMobileMenuOpen }: NavbarProps) {
  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6"
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Left: mobile hamburger + page label */}
      <div className="flex items-center gap-3">
        {/* Hamburger — visible on mobile only */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150 md:hidden"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={onMobileMenuOpen}
          aria-label="Open navigation menu"
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Dashboard
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          className="btn-ghost h-9 w-9 rounded-xl p-0"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Notifications */}
        <button
          className="btn-ghost relative h-9 w-9 rounded-xl p-0"
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M9 2a5 5 0 0 0-5 5v2.5L2.5 11.5h13L14 9.5V7a5 5 0 0 0-5-5Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
            />
            <path
              d="M7.5 14.5a1.5 1.5 0 0 0 3 0"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
            style={{
              backgroundColor: "var(--color-abnormal-text)",
              outline: "2px solid var(--color-bg-base)",
            }}
          />
        </button>

        {/* Avatar */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition"
          style={{
            backgroundColor: "var(--color-brand)",
            color: "var(--color-text-inverse)",
            outline: "2px solid var(--color-bg-base)",
            outlineOffset: "1px",
          }}
          aria-label="User menu"
        >
          AK
        </button>
      </div>
    </header>
  );
}
