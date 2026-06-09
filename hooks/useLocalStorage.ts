"use client";

import { useEffect, useState } from "react";

/**
 * useState-compatible hook that persists state to localStorage.
 *
 * @param key     localStorage key
 * @param initial Default value when the key doesn't exist yet
 */
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // Storage unavailable — fail silently
    }
  }, [key, stored]);

  return [stored, setStored];
}
