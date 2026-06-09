"use client";

import CenterStage from "@/components/chat/CenterStage";
import ChatInputZone, { type AttachedFile } from "@/components/chat/ChatInputZone";
import ChatSidebar from "@/components/chat/ChatSidebar";
import RightChatPanel, { type ChatMessage } from "@/components/chat/RightChatPanel";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   View state type
───────────────────────────────────────────────────────────────────────────── */
type ViewState = "input" | "analysis";

/* ─────────────────────────────────────────────────────────────────────────────
   Suggested prompts
───────────────────────────────────────────────────────────────────────────── */
const SUGGESTIONS = [
  { bg: "var(--color-normal-bg)", border: "var(--color-normal-border)", label: "Explain my CBC results",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="var(--color-normal-text)" strokeWidth="1.75" strokeLinecap="round"/><circle cx="8" cy="8" r="7" stroke="var(--color-normal-text)" strokeWidth="1.25"/></svg> },
  { bg: "var(--color-info-bg)", border: "var(--color-info-border)", label: "Summarise my lipid panel",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 12L5.5 7l2.5 3L11 5l3 5.5" stroke="var(--color-info-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { bg: "var(--color-brand-light)", border: "#C7D2FE", label: "What does my MRI report mean?",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="1" width="12" height="14" rx="2" stroke="var(--color-brand)" strokeWidth="1.4"/><path d="M5 6h6M5 9h6M5 12h3" stroke="var(--color-brand)" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { bg: "var(--color-abnormal-bg)", border: "var(--color-abnormal-border)", label: "Is my urinalysis normal?",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3C8 3 3 8.5 3 11a5 5 0 0 0 10 0C13 8.5 8 3 8 3Z" stroke="var(--color-abnormal-text)" strokeWidth="1.4" strokeLinejoin="round"/></svg> },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Mock AI response generator
───────────────────────────────────────────────────────────────────────────── */
function mockAIResponse(userMsg: string): string {
  if (userMsg.toLowerCase().includes("cbc") || userMsg.toLowerCase().includes("blood")) {
    return "I've analysed your CBC report. Your haemoglobin (11.2 g/dL) is slightly below the normal range. I've highlighted the key metrics in the analysis panel on the left. Would you like me to explain what low haemoglobin typically indicates?";
  }
  if (userMsg.toLowerCase().includes("lipid") || userMsg.toLowerCase().includes("cholesterol")) {
    return "Your lipid panel shows borderline elevated LDL at 142 mg/dL. The analysis panel shows a full breakdown of your cholesterol fractions. Shall I explain the clinical significance?";
  }
  return "I've processed your query and the analysis is now visible in the centre panel. The key findings have been highlighted with colour-coded status indicators. What would you like to explore further?";
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function ChatPage() {
  const [viewState, setViewState]       = useState<ViewState>("input");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [activeQuery, setActiveQuery]   = useState("");
  const [activeFiles, setActiveFiles]   = useState<string[]>([]);

  // Mobile: track which panel is visible in analysis state
  const [mobilePanelTab, setMobilePanelTab] = useState<"analysis" | "chat">("analysis");

  /* ──────────────────────────────────────────────────────────────────────────
     Send handler — triggers the view transition
  ────────────────────────────────────────────────────────────────────────── */
  function handleSend(prompt: string, files: AttachedFile[]) {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt || "Attached file for analysis",
      files: files.map((f) => f.file.name),
      timestamp: new Date(),
    };

    setActiveQuery(prompt);
    setActiveFiles(files.map((f) => f.file.name));
    setMessages([userMsg]);
    setIsLoading(true);

    // Trigger layout transition immediately
    setViewState("analysis");

    // Simulate AI response after 1.8s
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: mockAIResponse(prompt),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1800);
  }

  /* Follow-up messages in analysis state */
  function handleFollowUp(prompt: string, files: AttachedFile[]) {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt || "Attached file",
      files: files.map((f) => f.file.name),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: mockAIResponse(prompt),
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1200);
  }

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      {/* ── LEFT HISTORY SIDEBAR ──────────────────────────────────────────── */}
      <ChatSidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      {/* ── MAIN CANVAS ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex h-14 shrink-0 items-center justify-between px-5 transition-all duration-300"
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {/* Mobile sidebar toggle */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg md:hidden"
            style={{ color: "var(--color-text-secondary)" }}
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>

          {/* Title + state indicator */}
          <div className="flex items-center gap-2">
            <div
              className="hidden h-6 w-6 items-center justify-center rounded-lg md:flex"
              style={{ backgroundColor: "var(--color-brand-light)" }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 12V5a1 1 0 0 1 1-1h2l1-2h2l1 2h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z"
                  stroke="var(--color-brand)" strokeWidth="1.2" strokeLinejoin="round" />
                <circle cx="7" cy="8" r="1.5" stroke="var(--color-brand)" strokeWidth="1.2" />
              </svg>
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {viewState === "input" ? "New Analysis" : "Report Analysis"}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}
            >
              AI
            </span>
            {viewState === "analysis" && isLoading && (
              <span
                className="hidden items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-flex"
                style={{ backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }}
              >
                <svg className="animate-spin" width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
                </svg>
                Analysing…
              </span>
            )}
          </div>

          {/* Right: new analysis + user avatar */}
          <div className="flex items-center gap-1.5">
            {viewState === "analysis" && (
              <button
                onClick={() => {
                  setViewState("input");
                  setMessages([]);
                  setActiveQuery("");
                  setActiveFiles([]);
                }}
                className="hidden items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors duration-150 md:inline-flex"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                  backgroundColor: "var(--color-bg-base)",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-base)"}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
                New Analysis
              </button>
            )}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "var(--color-text-inverse)",
                outline: "2px solid var(--color-bg-base)",
                outlineOffset: "1px",
              }}
              aria-label="User menu"
            >
              AK
            </button>
          </div>
        </header>

        {/* ── WORKSPACE BODY ──────────────────────────────────────────────── */}
        <div className="relative flex flex-1 overflow-hidden">

          {/* ════════════════════════════════════════════════════════════════
              INPUT STATE — perfectly centred, animates out on send
          ════════════════════════════════════════════════════════════════ */}
          <div
            className={[
              "absolute inset-0 flex flex-col items-center justify-center overflow-y-auto px-4 py-8",
              "transition-all duration-500 ease-in-out",
              viewState === "input"
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-8 opacity-0",
            ].join(" ")}
          >
            {/* Hero */}
            <div className="mb-8 text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--color-brand)", boxShadow: "var(--shadow-card-md)" }}
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M13 4v18M4 13h18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <h1
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "var(--color-text-primary)" }}
              >
                What would you like to understand?
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Upload a medical report, enter a health question, or do both.
                Simplimed will decode it into clear, plain-language insights.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-shadow duration-150"
                  style={{ backgroundColor: s.bg, borderColor: s.border, color: "var(--color-text-secondary)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                  }}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Full-size input zone */}
            <ChatInputZone onSend={handleSend} />

            <p className="mt-4 max-w-sm text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
              Simplimed is an AI assistant and does not provide medical diagnoses.
              Always consult a qualified healthcare professional.
            </p>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              ANALYSIS STATE — desktop: CenterStage + RightChatPanel
                             — mobile: tabbed switcher
          ════════════════════════════════════════════════════════════════ */}
          <div
            className={[
              "absolute inset-0 flex overflow-hidden",
              "transition-all duration-500 ease-in-out",
              viewState === "analysis"
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none translate-x-8 opacity-0",
            ].join(" ")}
          >

            {/* ── Mobile tab bar ────────────────────────────────────────── */}
            <div
              className="absolute bottom-0 left-0 right-0 z-30 flex md:hidden"
              style={{
                backgroundColor: "var(--color-bg-base)",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {(["analysis", "chat"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMobilePanelTab(tab)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors duration-150"
                  style={
                    mobilePanelTab === tab
                      ? { color: "var(--color-brand)", borderTop: "2px solid var(--color-brand)" }
                      : { color: "var(--color-text-muted)", borderTop: "2px solid transparent" }
                  }
                >
                  {tab === "analysis" ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 12L5.5 7l2.5 3L11 5l3 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Analysis
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 3h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 2V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                      </svg>
                      Chat
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* ── CENTER STAGE (analysis results) ───────────────────────── */}
            {/*
              Desktop: flex-1 (fills remaining space between left sidebar and right chat panel)
              Mobile: full width, hidden when chat tab is active, padded-bottom for tab bar
            */}
            <div
              className={[
                "flex-1 overflow-hidden transition-all duration-500 ease-in-out",
                // Desktop: always visible
                "md:block",
                // Mobile: shown only on analysis tab
                mobilePanelTab === "analysis" ? "block pb-12 md:pb-0" : "hidden md:block",
              ].join(" ")}
            >
              <CenterStage
                query={activeQuery}
                fileNames={activeFiles}
                isLoading={isLoading}
              />
            </div>

            {/* ── RIGHT CHAT PANEL ──────────────────────────────────────── */}
            {/*
              Desktop: fixed 360px right column with left border, slides in
              Mobile:  full screen overlay when chat tab active, padded for tab bar
            */}
            <div
              className={[
                "overflow-hidden transition-all duration-500 ease-in-out",
                // Desktop: shrink-to-width column
                "md:w-[360px] md:shrink-0",
                // Desktop border
                "md:border-l",
                // Mobile: full width on chat tab
                mobilePanelTab === "chat"
                  ? "absolute inset-0 z-20 w-full pb-12 md:relative md:inset-auto md:z-auto md:w-[360px] md:pb-0"
                  : "hidden md:flex",
              ].join(" ")}
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex h-full w-full flex-col">
                <RightChatPanel
                  messages={messages}
                  onSend={handleFollowUp}
                  isLoading={isLoading}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
