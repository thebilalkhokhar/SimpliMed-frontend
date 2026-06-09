import PublicFooter from "@/components/shared/PublicFooter";
import PublicHeader from "@/components/shared/PublicHeader";

/**
 * Public route group layout.
 * Covers landing, login, signup — no authentication required.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      <PublicHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <PublicFooter />
    </div>
  );
}
