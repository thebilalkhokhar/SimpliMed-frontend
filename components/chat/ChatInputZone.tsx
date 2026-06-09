"use client";

import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
export interface AttachedFile {
  id: string;
  file: File;
  preview?: string; // data-url for images
}

interface ChatInputZoneProps {
  onSend: (prompt: string, files: AttachedFile[]) => void;
  disabled?: boolean;
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
      {/* File type icon */}
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
      <span
        className="max-w-[120px] truncate text-xs font-medium"
        style={{ color: isPdf ? "var(--color-brand)" : "var(--color-info-text)" }}
      >
        {af.file.name}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 rounded-full p-0.5 transition-opacity hover:opacity-70"
        style={{ color: isPdf ? "var(--color-brand)" : "var(--color-info-text)" }}
        aria-label={`Remove ${af.file.name}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────────────── */
export default function ChatInputZone({ onSend, disabled = false }: ChatInputZoneProps) {
  const [prompt, setPrompt]         = useState("");
  const [files, setFiles]           = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError]   = useState<string | null>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);

  /* ── File handling ── */
  function validateAndAdd(incoming: File[]) {
    setFileError(null);
    const valid: AttachedFile[] = [];
    const errors: string[] = [];

    incoming.forEach((f) => {
      if (!ACCEPTED.includes(f.type)) {
        errors.push(`"${f.name}" is not supported. Use PDF, PNG, or JPG.`);
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        errors.push(`"${f.name}" exceeds 20 MB.`);
        return;
      }
      const id = `${f.name}-${Date.now()}-${Math.random()}`;
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) =>
          setFiles((prev) => [
            ...prev,
            { id, file: f, preview: ev.target?.result as string },
          ]);
        reader.readAsDataURL(f);
      } else {
        valid.push({ id, file: f });
      }
    });

    if (valid.length) setFiles((prev) => [...prev, ...valid]);
    if (errors.length) setFileError(errors[0]);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) validateAndAdd(Array.from(e.target.files));
    e.target.value = "";
  }

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) validateAndAdd(Array.from(e.dataTransfer.files));
  }, []);

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

      {/* ── Dropzone / input card ── */}
      <div
        className="rounded-2xl border-2 transition-all duration-150"
        style={
          isDragging
            ? {
                borderColor: "var(--color-brand)",
                backgroundColor: "var(--color-brand-light)",
                borderStyle: "dashed",
                boxShadow: "var(--shadow-card-md)",
              }
            : {
                borderColor: "var(--color-border)",
                borderStyle: "solid",
                backgroundColor: "var(--color-bg-base)",
                boxShadow: "var(--shadow-card-md)",
              }
        }
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Dashed drop area — visible only when no files attached */}
        {files.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-t-2xl border-b px-6 py-7 transition-colors duration-150"
            style={{
              borderBottomColor: "var(--color-border)",
              borderBottomStyle: "dashed",
              cursor: "pointer",
              backgroundColor: isDragging ? "transparent" : "var(--color-bg-subtle)",
            }}
            onMouseEnter={(e) => {
              if (!isDragging)
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
            }}
            onMouseLeave={(e) => {
              if (!isDragging)
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-subtle)";
            }}
          >
            {/* Upload icon */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--color-brand-light)", border: "1px solid #C7D2FE" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M11 14V4M7 8l4-4 4 4" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {isDragging ? "Drop files here" : "Drop files or click to upload"}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                PDF, PNG, JPG, JPEG · Max 20 MB each
              </p>
            </div>
          </button>
        )}

        {/* Attached file chips */}
        {files.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2 rounded-t-2xl border-b px-4 py-3"
            style={{ borderBottomColor: "var(--color-border)", borderBottomStyle: "dashed", backgroundColor: "var(--color-bg-subtle)" }}
          >
            {files.map((af) => (
              <FileChip key={af.id} af={af} onRemove={() => removeFile(af.id)} />
            ))}
            {/* Add more */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors duration-150"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
                borderStyle: "dashed",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add file
            </button>
          </div>
        )}

        {/* File error */}
        {fileError && (
          <div
            className="flex items-center gap-2 px-4 py-2 text-xs"
            style={{ backgroundColor: "var(--color-abnormal-bg)", color: "var(--color-abnormal-text)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {fileError}
          </div>
        )}

        {/* Textarea row */}
        <div className="flex items-end gap-3 px-4 py-3">
          {/* Paperclip attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-1 shrink-0 rounded-xl p-2 transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            title="Attach file"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-overlay)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M15.5 8.5L8 16a5 5 0 0 1-7-7l7.5-7.5a3 3 0 0 1 4.25 4.24L5.25 13.3a1 1 0 0 1-1.42-1.42l6.5-6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

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
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150"
            style={
              canSend
                ? { backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }
                : { backgroundColor: "var(--color-bg-overlay)", color: "var(--color-text-muted)", cursor: "not-allowed" }
            }
            aria-label="Send query"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M14 8H2M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Hint bar */}
        <div
          className="flex items-center justify-between rounded-b-2xl px-4 py-2"
          style={{ backgroundColor: "var(--color-bg-subtle)", borderTop: "1px solid var(--color-border-muted)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            <kbd className="rounded px-1 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--color-bg-overlay)", color: "var(--color-text-secondary)" }}>⏎</kbd>
            {" "}to send &nbsp;·&nbsp;{" "}
            <kbd className="rounded px-1 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--color-bg-overlay)", color: "var(--color-text-secondary)" }}>⇧ ⏎</kbd>
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
