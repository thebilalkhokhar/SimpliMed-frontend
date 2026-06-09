import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────────────────────────
        "bg-base":   "#FFFFFF",   // Primary surface — cards, inputs, modals
        "bg-subtle": "#F8FAFC",   // Page background — depth contrast
        "bg-overlay": "#F1F5F9",  // Hover states, overlay tints

        // ── Text Hierarchy ────────────────────────────────────────────────
        "text-primary":   "#0F172A", // Deep charcoal — headings
        "text-secondary": "#475569", // Muted slate — body / descriptive copy
        "text-muted":     "#94A3B8", // Placeholder, labels, timestamps
        "text-inverse":   "#FFFFFF", // Text on dark/brand surfaces

        // ── Brand / Interactive ───────────────────────────────────────────
        "brand":       "#4F46E5", // Indigo — buttons, focus rings, nav
        "brand-hover": "#4338CA", // Deeper indigo — hover
        "brand-light": "#EEF2FF", // Indigo tint — subtle highlights
        "focus-ring":  "#6366F1", // Focus outline

        // ── Medical Status: Normal ────────────────────────────────────────
        "status-normal-bg":     "#ECFDF5",
        "status-normal-border": "#6EE7B7",
        "status-normal":        "#059669",

        // ── Medical Status: Abnormal / Elevated ───────────────────────────
        "status-abnormal-bg":     "#FFF1F2",
        "status-abnormal-border": "#FDA4AF",
        "status-abnormal":        "#E11D48",

        // ── Medical Status: Informational / Reduced ───────────────────────
        "status-info-bg":     "#EFF6FF",
        "status-info-border": "#93C5FD",
        "status-info":        "#2563EB",

        // ── Borders & Dividers ────────────────────────────────────────────
        "border-default": "#E2E8F0",
        "border-muted":   "#F1F5F9",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "card":    "0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.04)",
        "card-md": "0 4px 6px -1px rgba(15,23,42,0.07), 0 2px 4px -2px rgba(15,23,42,0.05)",
        "card-lg": "0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
