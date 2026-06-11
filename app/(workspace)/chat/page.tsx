"use client";

import CenterStage from "@/components/chat/CenterStage";
import ChatInputZone, { type AttachedFile } from "@/components/chat/ChatInputZone";
import ChatSidebar from "@/components/chat/ChatSidebar";
import RightChatPanel, { type ChatMessage } from "@/components/chat/RightChatPanel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   View state type
───────────────────────────────────────────────────────────────────────────── */
type ViewState = "input" | "analysis";

/* ─────────────────────────────────────────────────────────────────────────────
   Suggested prompts
───────────────────────────────────────────────────────────────────────────── */
const SUGGESTIONS = [
  { bg: "var(--color-normal-bg)", border: "var(--color-normal-border)", label: "Give me peace of mind",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2C8 2 3 6 3 9.5a5 5 0 0 0 10 0C13 6 8 2 8 2Z" stroke="var(--color-normal-text)" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 9v2" stroke="var(--color-normal-text)" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { bg: "var(--color-info-bg)", border: "var(--color-info-border)", label: "Can you explain this?",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="var(--color-info-text)" strokeWidth="1.4"/><path d="M6.5 6.5a1.5 1.5 0 0 1 3 0c0 1-1.5 1.5-1.5 2.5" stroke="var(--color-info-text)" strokeWidth="1.4" strokeLinecap="round"/><circle cx="8" cy="12" r="0.75" fill="var(--color-info-text)"/></svg> },
  { bg: "var(--color-brand-light)", border: "#C7D2FE", label: "Make this easier to understand",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 12L5.5 7l2.5 3L11 5l3 5.5" stroke="var(--color-brand)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { bg: "var(--color-abnormal-bg)", border: "var(--color-abnormal-border)", label: "What should I ask my doctor?",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3l1.5 3H13l-2.5 2.5L11.5 12 8 10l-3.5 2 1-3.5L3 6h3.5L8 3Z" stroke="var(--color-abnormal-text)" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [activeQuery, setActiveQuery]   = useState("");
  const [activeFiles, setActiveFiles]   = useState<string[]>([]);
  const [showCenterStage, setShowCenterStage] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [fileAlreadyUploaded, setFileAlreadyUploaded] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");

  // Mobile: track which panel is visible in analysis state
  const [mobilePanelTab, setMobilePanelTab] = useState<"analysis" | "chat">("analysis");

  // Detect mobile for conditional panel width
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Resizable right panel (percentage-based)
  const [panelWidth, setPanelWidth]   = useState(40);
  const isResizing                     = useRef(false);
  const PANEL_MIN = 25;
  const PANEL_MAX = 60;

  const handleMouseDown = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isResizing.current) return;
      const newWidthPct = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      setPanelWidth(Math.min(PANEL_MAX, Math.max(PANEL_MIN, newWidthPct)));
    }
    function handleMouseUp() {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

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

    // Only show CenterStage if files were attached
    if (files.length > 0) {
      setShowCenterStage(true);
      setShowRightPanel(false);
      setFileAlreadyUploaded(true);
      setIsAnalysisLoading(true);
    }

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
      setIsAnalysisLoading(false);
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

    // Show CenterStage if files attached in follow-up too
    if (files.length > 0 && !showCenterStage) {
      setActiveFiles(files.map((f) => f.file.name));
      setActiveQuery(prompt);
      setShowCenterStage(true);
      setFileAlreadyUploaded(true);
    }

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
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
        onNewChat={() => {
          setViewState("input");
          setMessages([]);
          setActiveQuery("");
          setActiveFiles([]);
          setShowCenterStage(false);
          setShowRightPanel(false);
          setFileAlreadyUploaded(false);
          setSelectedSuggestion("");
        }}
      />

      {/* ── MAIN CANVAS ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex h-16 shrink-0 items-center justify-between px-6 transition-all duration-300"
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {/* Mobile sidebar toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
            style={{ color: "var(--color-text-secondary)" }}
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>

          {/* Title + state indicator */}
          <div className="flex items-center gap-2.5">
            <div
              className="hidden h-7 w-7 items-center justify-center rounded-lg md:flex"
              style={{ backgroundColor: "var(--color-brand-light)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 12V5a1 1 0 0 1 1-1h2l1-2h2l1 2h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z"
                  stroke="var(--color-brand)" strokeWidth="1.2" strokeLinejoin="round" />
                <circle cx="7" cy="8" r="1.5" stroke="var(--color-brand)" strokeWidth="1.2" />
              </svg>
            </div>
            <span className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {viewState === "input" ? "New Analysis" : "Report Analysis"}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
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

          {/* Right: user avatar */}
          <div className="flex items-center gap-1.5">
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
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-brand)", boxShadow: "var(--shadow-card-md)" }}
              >
                <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M13 4v18M4 13h18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <h1
                className="text-xl font-bold tracking-tight sm:text-2xl"
                style={{ color: "var(--color-text-primary)" }}
              >
                What would you like to understand?
              </h1>
              <p className="mt-1.5 max-w-md text-xs leading-relaxed sm:text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Upload a medical report, enter a health question, or do both.
                Simplimed will decode it into clear, plain-language insights.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedSuggestion(s.label)}
                  className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-shadow duration-150 cursor-pointer"
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
            <ChatInputZone onSend={handleSend} defaultPrompt={selectedSuggestion} />

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
                boxShadow: "0 -4px 12px rgba(15,23,42,0.06)",
              }}
            >
              {(["analysis", "chat"] as const).map((tab) => {
                const isActive = mobilePanelTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setMobilePanelTab(tab)}
                    className="flex flex-1 flex-col items-center justify-center gap-1 py-3.5 transition-colors duration-150"
                    style={
                      isActive
                        ? { color: "var(--color-brand)" }
                        : { color: "var(--color-text-muted)" }
                    }
                  >
                    {tab === "analysis" ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M3 15L7.5 9l3 3.5L14.5 6l3 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M3 4h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6l-3 2.5V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <span className="text-xs font-semibold">
                      {tab === "analysis" ? "Analysis" : "Chat"}
                    </span>
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute bottom-1 h-1 w-6 rounded-full"
                        style={{ backgroundColor: "var(--color-brand)" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── CENTER STAGE (analysis results) ───────────────────────── */}
            {/*
              Desktop: flex-1 (fills remaining space between left sidebar and right chat panel)
              Mobile: full width, hidden when chat tab is active, padded-bottom for tab bar
            */}
            {/* CenterStage — always visible on desktop, tab-controlled on mobile */}
            <div
              className={
                showCenterStage
                  ? [
                      "flex-1 overflow-hidden transition-all duration-500 ease-in-out",
                      // Desktop: always visible
                      "md:block",
                      // Mobile: only visible when analysis tab is active
                      mobilePanelTab === "analysis" ? "max-md:block max-md:pb-12" : "max-md:hidden",
                    ].join(" ")
                  : "hidden"
              }
            >
              <CenterStage
                query={activeQuery}
                fileNames={activeFiles}
                isLoading={isAnalysisLoading}
                onOpenChat={showRightPanel ? undefined : () => { setShowRightPanel(true); setMobilePanelTab("chat"); }}
              />
            </div>

            {/* ── RIGHT CHAT PANEL ──────────────────────────────────────── */}
            <div
              className={[
                "relative overflow-hidden transition-all duration-500 ease-in-out",
                // Desktop: hidden when centerstage is up and panel not opened yet
                showCenterStage && !showRightPanel
                  ? "max-md:block md:hidden"
                  : showCenterStage && showRightPanel
                    ? "md:shrink-0 md:border-l md:relative md:inset-auto md:z-auto md:pb-0"
                    : "flex-1 md:relative md:inset-auto md:z-auto md:pb-0",
                // Mobile: always allow tab-based visibility (ignore showRightPanel)
                mobilePanelTab === "chat" || !showCenterStage
                  ? "max-md:absolute max-md:inset-0 max-md:z-20 max-md:w-full max-md:pb-12"
                  : "max-md:hidden",
              ].join(" ")}
              style={{
                borderColor: showCenterStage && showRightPanel ? "var(--color-border)" : "transparent",
                width: !isMobile && showCenterStage && showRightPanel ? `${panelWidth}%` : undefined,
                minWidth: !isMobile && showCenterStage && showRightPanel ? "300px" : undefined,
                backgroundColor: showCenterStage ? "var(--color-bg-base)" : "var(--color-bg-subtle)",
              }}
            >
              {/* Drag handle — only when CenterStage is visible */}
              {showCenterStage && (
                <div
                  className="absolute inset-y-0 left-0 z-10 hidden w-1.5 cursor-col-resize md:block"
                  onMouseDown={handleMouseDown}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="mx-auto h-full w-px transition-colors duration-150"
                    style={{ backgroundColor: "var(--color-border)" }} />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex h-8 w-1.5 items-center justify-center rounded-full opacity-0 transition-opacity duration-150 hover:opacity-100"
                    style={{ backgroundColor: "var(--color-brand-light)" }}>
                    <div className="flex flex-col gap-0.5">
                      <span className="h-1 w-0.5 rounded-full" style={{ backgroundColor: "var(--color-brand)" }} />
                      <span className="h-1 w-0.5 rounded-full" style={{ backgroundColor: "var(--color-brand)" }} />
                      <span className="h-1 w-0.5 rounded-full" style={{ backgroundColor: "var(--color-brand)" }} />
                    </div>
                  </div>
                </div>
              )}

              <div className={`flex h-full w-full flex-col ${!showCenterStage ? "mx-auto max-w-3xl" : ""}`}>
                <RightChatPanel
                  messages={messages}
                  onSend={handleFollowUp}
                  isLoading={isLoading}
                  fileUploadDisabled={fileAlreadyUploaded}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
