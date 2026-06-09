import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Accessible text input with optional label, hint, and inline error state.
 */
export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  style,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={["input", className].filter(Boolean).join(" ")}
        style={
          error
            ? {
                borderColor: "var(--color-abnormal-text)",
                boxShadow: `0 0 0 1px var(--color-abnormal-text)`,
                ...style,
              }
            : style
        }
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        aria-invalid={error ? "true" : undefined}
        {...props}
      />

      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs"
          style={{ color: "var(--color-abnormal-text)" }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
