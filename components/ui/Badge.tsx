import type { ReactNode } from "react";
import type { MetricStatus } from "@/types";

interface BadgeProps {
  status: MetricStatus;
  children: ReactNode;
}

const statusClass: Record<MetricStatus, string> = {
  normal:        "badge-normal",
  abnormal:      "badge-abnormal",
  informational: "badge-info",
};

/**
 * Medical data status badge.
 * Renders with the correct color token for normal / abnormal / informational states.
 */
export default function Badge({ status, children }: BadgeProps) {
  return (
    <span className={statusClass[status]}>
      {children}
    </span>
  );
}
