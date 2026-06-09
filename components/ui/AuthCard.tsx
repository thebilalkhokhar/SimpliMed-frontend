import Image from "next/image";
import type { ReactNode } from "react";

interface AuthCardProps {
  /** Card heading */
  title: string;
  /** Subtitle / description below the heading */
  subtitle?: string;
  children: ReactNode;
}

/**
 * Shared card shell for all auth pages.
 * White, elevated, centred, max-w-md.
 */
export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div
      className="w-full max-w-md rounded-2xl border p-8"
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card-lg)",
      }}
    >
      {/* Brand mark */}
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Image src="/logo.svg" alt="Simplimed" width={44} height={44} className="rounded-xl" />
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
