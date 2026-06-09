/**
 * Workspace route group layout.
 * Full-screen, no generic dashboard chrome (no shared navbar/sidebar).
 * Each workspace page manages its own two-panel layout.
 */
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
