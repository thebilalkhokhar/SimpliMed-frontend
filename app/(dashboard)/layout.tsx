"use client";

import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { useState } from "react";

/**
 * Dashboard route group layout.
 * - Desktop: collapsible sidebar (wide 256px ↔ icon-only 68px) with toggle button
 * - Mobile:  full-screen slide-out drawer triggered by Navbar hamburger
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  return (
    <div
      className="flex h-dvh overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      {/* Sidebar — handles both desktop collapse and mobile drawer */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMobileMenuOpen={() => setMobileOpen(true)} />

        <main
          className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
