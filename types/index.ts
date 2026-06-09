// ─────────────────────────────────────────────────────────────────────────────
// Simplimed — Core TypeScript Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ── Medical Data Status ───────────────────────────────────────────────────────

/** Tri-state classification for any measured metric. */
export type MetricStatus = "normal" | "abnormal" | "informational";

// ── User & Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  dateOfBirth?: string;         // ISO 8601 date
  biologicalSex?: "male" | "female" | "other" | "prefer_not_to_say";
  createdAt: string;            // ISO 8601 datetime
}

// ── Medical Reports ───────────────────────────────────────────────────────────

export type ReportType =
  | "blood_panel"
  | "urinalysis"
  | "metabolic_panel"
  | "lipid_panel"
  | "thyroid"
  | "imaging"
  | "other";

export interface Report {
  id: string;
  userId: string;
  title: string;
  reportType: ReportType;
  reportDate: string;           // ISO 8601 date
  uploadedAt: string;           // ISO 8601 datetime
  fileUrl?: string;
  rawText?: string;
  status: "pending" | "processing" | "completed" | "failed";
  analysisId?: string;
}

// ── Metric ────────────────────────────────────────────────────────────────────

/** A single measured biomarker extracted from a report. */
export interface Metric {
  id: string;
  name: string;                 // e.g. "Hemoglobin", "LDL Cholesterol"
  value: number;
  unit: string;                 // e.g. "g/dL", "mg/dL"
  referenceMin?: number;
  referenceMax?: number;
  status: MetricStatus;
  note?: string;                // AI plain-language note
}

// ── Analysis ──────────────────────────────────────────────────────────────────

export interface Analysis {
  id: string;
  reportId: string;
  userId: string;
  completedAt: string;          // ISO 8601 datetime
  summary: string;              // AI executive summary
  metrics: Metric[];
  insights: Insight[];
  overallScore?: number;        // 0–100
}

// ── Insight ───────────────────────────────────────────────────────────────────

/** An AI-generated narrative insight derived from one or more metrics. */
export interface Insight {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  relatedMetricIds: string[];
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}
