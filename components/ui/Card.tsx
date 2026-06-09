import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevation?: "default" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClass = {
  none: "",
  sm:   "p-4",
  md:   "p-5",
  lg:   "p-6",
};

const shadowVar = {
  default: "var(--shadow-card)",
  md:      "var(--shadow-card-md)",
  lg:      "var(--shadow-card-lg)",
};

/**
 * Base card surface component.
 * White background, rounded corners, configurable shadow elevation.
 */
export default function Card({
  children,
  elevation = "default",
  padding = "md",
  className = "",
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={["card", paddingClass[padding], className].filter(Boolean).join(" ")}
      style={{ boxShadow: shadowVar[elevation], ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
