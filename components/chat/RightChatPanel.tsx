"use client";

import { type ChangeEvent, useRef, useState, useCallback, type DragEvent } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
export interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: string[]; // file names
  timestamp: Date;
}

interface RightChatPanelProps {
  messages: ChatMessage[];
  onSend: (prompt: string, files: AttachedFile[]) => void;
  isLoading?: boolean;
}

const ACCEPTED = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_EXT = ".pdf, .png, .jpg, .jpeg";

/* ─────────────────────────────────────────────────────────────────────────────
   Message bubble
───────────────────────────────────────────────────────────────────────────── */
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={
          isUser
            ? { backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }
            : { backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }
        }
      >
        {isUser ? "AK" : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}`}
        style={
          isUser
            ? {
                backgroundColor: "var(--color-brand)",
                color: "var(--color-text-inverse)",
              }
            : {
                backgroundColor: "var(--color-bg-base)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
              }
        }
      >
        {/* Attached files */}
        {msg.files && msg.files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {msg.files.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "inherit",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 1h7l3 3v9H2V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                {name}
              </span>
            ))}
          </div>
        )}
        {msg.content}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Typing indicator
───────────────────────────────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px]"
        style={{ backgroundColor: "var(--color-normal-bg)", border: "1px solid var(--color-normal-border)" }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 2v12M2 8h12" stroke="var(--color-normal-text)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="flex items-center gap-1 rounded-2xl rounded-tl-sm px-4 py-3"
        style={{ backgroundColor: "var(--color-bg-base)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-text-muted)",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Right Chat Panel
───────────────────────────────────────────────────────────────────────────── */
export default function RightChatPanel({ messages, onSend, isLoading = false }: RightChatPanelProps) {
  const [prompt, setPrompt]         = useState("");
  const [files, setFiles]           = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError]   = useState<string | null>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef              = useRef<HTMLDivElement>(null);

  /* ── File handling ── */
  function validateAndAdd(incoming: File[]) {
    setFileError(null);
    const valid: AttachedFile[] = [];
    incoming.forEach((f) => {
      if (!ACCEPTED.includes(f.type)) {
        setFileError(`"${f.name}" is not supported.`);
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        setFileError(`"${f.name}" exceeds 20 MB.`);
        return;
      }
      const id = `${f.name}-${Date.now()}`;
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) =>
          setFiles((prev) => [...prev, { id, file: f, preview: ev.target?.result as string }]);
        reader.readAsDataURL(f);
      } else {
        valid.push({ id, file: f });
      }
    });
    if (valid.length) setFiles((prev) => [...prev, ...valid]);
  }

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) validateAndAdd(Array.from(e.dataTransfer.files));
  }, []);

  /* ── Send ── */
  function handleSend() {
    const trimmed = prompt.trim();
    if (!trimmed && files.length === 0) return;
    onSend(trimmed, files);
    setPrompt("");
    setFiles([]);
    setFileError(null);
    textareaRef.current?.style && (textareaRef.current.style.height = "auto");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  const canSend = (prompt.trim().length > 0 || files.length > 0) && !isLoading;

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: "var(--color-bg-base)" }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* ── Panel header ── */}
      <div
        className="flex h-12 shrink-0 items-center justify-between px-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Chat
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}
          >
            AI
          </span>
        </div>
        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Message thread ── */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Drag overlay ── */}
      {isDragging && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
          style={{ backgroundColor: "var(--color-brand-light)", border: "2px dashed var(--color-brand)" }}
        >
          <svg width="32" height="32" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M11 14V4M7 8l4-4 4 4" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 16v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" stroke="var(--color-brand)" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <p className="mt-2 text-sm font-semibold" style={{ color: "var(--color-brand)" }}>
            Drop to attach
          </p>
        </div>
      )}

      {/* ── Attached files ── */}
      {files.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 border-t px-3 py-2"
          style={{ borderTopColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}
        >
          {files.map((af) => (
            <div
              key={af.id}
              className="flex items-center gap-1.5 rounded-lg border px-2 py-1"
              style={{ backgroundColor: "var(--color-brand-light)", borderColor: "#C7D2FE" }}
            >
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 1h7l3 3v9H2V1Z" stroke="var(--color-brand)" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              <span className="max-w-[80px] truncate text-[10px] font-medium" style={{ color: "var(--color-brand)" }}>
                {af.file.name}
              </span>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((f) => f.id !== af.id))}
                style={{ color: "var(--color-brand)" }}
                aria-label={`Remove ${af.file.name}`}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── File error ── */}
      {fileError && (
        <p className="px-3 pb-1 text-[10px]" style={{ color: "var(--color-abnormal-text)" }}>
          {fileError}
        </p>
      )}

      {/* ── Compact input bar ── */}
      <div
        className="shrink-0 px-3 pb-3 pt-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div
          className="flex items-end gap-2 rounded-xl border px-3 py-2"
          style={{
            backgroundColor: "var(--color-bg-subtle)",
            borderColor: "var(--color-border)",
          }}
        >
          {/* Attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-0.5 shrink-0 rounded-lg p-1 transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            title="Attach file"
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
          >
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M15.5 8.5L8 16a5 5 0 0 1-7-7l7.5-7.5a3 3 0 0 1 4.25 4.24L5.25 13.3a1 1 0 0 1-1.42-1.42l6.5-6.5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Follow-up question…"
            value={prompt}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent text-xs outline-none"
            style={{
              color: "var(--color-text-primary)",
              minHeight: "1.5rem",
              maxHeight: "7.5rem",
              lineHeight: "1.6",
            }}
          />

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150"
            style={
              canSend
                ? { backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }
                : { backgroundColor: "var(--color-bg-overlay)", color: "var(--color-text-muted)", cursor: "not-allowed" }
            }
            aria-label="Send"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M14 8H2M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXT}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) validateAndAdd(Array.from(e.target.files));
          e.target.value = "";
        }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
