import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  /** Optional leading inline SVG icon */
  icon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:   "btn-primary",
  secondary: "btn-secondary",
  ghost:     "btn-ghost",
};

const sizeOverride: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "",                      // default sizing is baked into component classes
  lg: "px-6 py-3 text-base",
};

/**
 * Reusable Button — primary | secondary | ghost variants.
 * Styling via component classes defined in globals.css.
 */
export default function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[variantClass[variant], sizeOverride[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
