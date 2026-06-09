/**
 * Auth route group layout — bare pass-through.
 * AuthSplitLayout (used by signin + signup) handles the full
 * two-column shell, footer, and scroll behaviour internally.
 * forgot-password and plans render their own full-page layouts.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
