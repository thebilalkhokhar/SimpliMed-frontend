"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
export interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface ChatInputZoneProps {
  onSend: (prompt: string, files: AttachedFile[]) => void;
  disabled?: boolean;
  defaultPrompt?: string;
}

const ACCEPTED = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_EXT = ".pdf, .png, .jpg, .jpeg";

/* ─────────────────────────────────────────────────────────────────────────────
   File chip
───────────────────────────────────────────────────────────────────────────── */
function FileChip({ af, onRemove }: { af: AttachedFile; onRemove: () => void }) {
  const isPdf = af.file.type === "application/pdf";
  return (
    <div
      className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
      style={{
        backgroundColor: isPdf ? "var(--color-brand-light)" : "var(--color-info-bg)",
        borderColor: isPdf ? "#C7D2FE" : "var(--color-info-border)",
      }}
    >
      {isPdf ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 1h7l3 3v9H2V1Z" stroke="var(--color-brand)" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M9 1v3h3" stroke="var(--color-brand)" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M4 7h6M4 9.5h4" stroke="var(--color-brand)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="12" height="12" rx="2" stroke="var(--color-info-text)" strokeWidth="1.2" />
          <circle cx="4.5" cy="4.5" r="1" fill="var(--color-info-text)" />
          <path d="M1 9l3-3 2.5 2.5L9 6l4 4" stroke="var(--color-info-text)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span className="max-w-[120px] truncate text-xs font-medium"
        style={{ color: isPdf ? "var(--color-brand)" : "var(--color-info-text)" }}>
        {af.file.name}
      </span>
      <button type="button" onClick={onRemove}
        className="flex-shrink-0 rounded-full p-0.5 transition-opacity hover:opacity-70"
        style={{ color: isPdf ? "var(--color-brand)" : "var(--color-info-text)" }}
        aria-label={`Remove ${af.file.name}`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main component — no drag-and-drop, just textarea + attach + send
───────────────────────────────────────────────────────────────────────────── */
export default function ChatInputZone({ onSend, disabled = false, defaultPrompt }: ChatInputZoneProps) {
  const [prompt, setPrompt]       = useState(defaultPrompt || "");
  const [files, setFiles]         = useState<AttachedFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  // Sync defaultPrompt from parent (suggestion chip clicks)
  useEffect(() => {
    if (defaultPrompt !== undefined) {
      setPrompt(defaultPrompt);
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
    }
  }, [defaultPrompt]);

  /* ── File handling ── */
  function validateAndAdd(incoming: File[]) {
    setFileError(null);
    if (files.length > 0) {
      setFileError("Only 1 file per message. Start a new chat for another report.");
      return;
    }
    const f = incoming[0];
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setFileError(`"${f.name}" is not supported. Use PDF, PNG, or JPG.`);
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setFileError(`"${f.name}" exceeds 20 MB.`);
      return;
    }
    const id = `${f.name}-${Date.now()}-${Math.random()}`;
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setFiles([{ id, file: f, preview: ev.target?.result as string }]);
      reader.readAsDataURL(f);
    } else {
      setFiles([{ id, file: f }]);
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) validateAndAdd(Array.from(e.target.files));
    e.target.value = "";
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setFileError(null);
  }

  /* ── Send ── */
  function handleSend() {
    const trimmed = prompt.trim();
    if (!trimmed && files.length === 0) return;
    onSend(trimmed, files);
    setPrompt("");
    setFiles([]);
    setFileError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  /* ── Auto-grow textarea ── */
  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  const canSend = (prompt.trim().length > 0 || files.length > 0) && !disabled;

  return (
    <div className="w-full max-w-3xl">
      <div
        className="rounded-2xl border-2 transition-all duration-150"
        style={{
          borderColor: "var(--color-border)",
          borderStyle: "solid",
          backgroundColor: "var(--color-bg-base)",
          boxShadow: "var(--shadow-card-md)",
        }}
      >
        {/* Attached file chips */}
        {files.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3"
            style={{ borderBottomColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
            {files.map((af) => (
              <FileChip key={af.id} af={af} onRemove={() => removeFile(af.id)} />
            ))}
          </div>
        )}

        {/* File error */}
        {fileError && (
          <div className="flex items-center gap-2 px-4 py-2 text-xs"
            style={{ backgroundColor: "var(--color-abnormal-bg)", color: "var(--color-abnormal-text)" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {fileError}
          </div>
        )}

        {/* Textarea row */}
        <div className="flex items-end gap-3 px-4 py-3">
          {/* Attach button — disabled after 1 file */}
          <div className="group relative mb-1">
            <button type="button"
              onClick={() => { if (files.length === 0) fileInputRef.current?.click(); }}
              className={`shrink-0 rounded-xl p-2 transition-colors duration-150 ${files.length > 0 ? "cursor-not-allowed opacity-40" : ""}`}
              style={{ color: "var(--color-text-muted)" }}
              disabled={files.length > 0}
              onMouseEnter={(e) => {
                if (files.length === 0) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                }
              }}
              onMouseLeave={(e) => {
                if (files.length === 0) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
                }
              }}>
              <svg width="18" height="18" viewBox="-1 -1 20 20" fill="none" aria-hidden="true">
                <path d="M15.5 8.5L8 16a5 5 0 0 1-7-7l7.5-7.5a3 3 0 0 1 4.25 4.24L5.25 13.3a1 1 0 0 1-1.42-1.42l6.5-6.5"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Tooltip on hover when disabled */}
            {files.length > 0 && (
              <div className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
                style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                Start new chat for new report
              </div>
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask about your report, or describe what you need…"
            value={prompt}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent py-1.5 text-sm outline-none"
            style={{
              color: "var(--color-text-primary)",
              minHeight: "2.5rem",
              maxHeight: "12.5rem",
              lineHeight: "1.6",
            }}
          />

          {/* Send button */}
          <button type="button" onClick={handleSend} disabled={!canSend}
            className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150"
            style={canSend
              ? { backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }
              : { backgroundColor: "var(--color-bg-overlay)", color: "var(--color-text-muted)", cursor: "not-allowed" }}
            aria-label="Send query">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M14 8H2M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Hint bar */}
        <div className="flex items-center justify-between rounded-b-2xl px-4 py-2"
          style={{ backgroundColor: "var(--color-bg-subtle)", borderTop: "1px solid var(--color-border-muted)" }}>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            <kbd className="rounded px-1 py-0.5 text-xs font-medium"
              style={{ backgroundColor: "var(--color-bg-overlay)", color: "var(--color-text-secondary)" }}>⏎</kbd>
            {" "}to send &nbsp;·&nbsp;{" "}
            <kbd className="rounded px-1 py-0.5 text-xs font-medium"
              style={{ backgroundColor: "var(--color-bg-overlay)", color: "var(--color-text-secondary)" }}>⇧ ⏎</kbd>
            {" "}for new line
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} attached` : "No files attached"}
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXT}
        multiple
        className="hidden"
        onChange={handleFileInput}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
