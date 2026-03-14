"use client";

import { useState, useCallback, useEffect } from "react";

export interface SavedCalc {
  name: string;
  values: Record<string, string>;
  savedAt: string;
}

const STORAGE_PREFIX = "civilcalc_";

/**
 * Hook for saving/loading calculator state to localStorage.
 * @param calcId - unique key for this calculator (e.g. "drain-sizing")
 */
export function useCalcStorage(calcId: string) {
  const storageKey = `${STORAGE_PREFIX}${calcId}`;
  const [savedList, setSavedList] = useState<SavedCalc[]>([]);

  // Load saved list on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setSavedList(JSON.parse(raw));
    } catch {
      // ignore corrupt data
    }
  }, [storageKey]);

  const save = useCallback(
    (name: string, values: Record<string, string>) => {
      const entry: SavedCalc = {
        name: name || `Calc ${new Date().toLocaleString("en-MY")}`,
        values,
        savedAt: new Date().toISOString(),
      };
      setSavedList((prev) => {
        const next = [entry, ...prev.filter((s) => s.name !== name)].slice(
          0,
          20
        );
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  const remove = useCallback(
    (name: string) => {
      setSavedList((prev) => {
        const next = prev.filter((s) => s.name !== name);
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  const clearAll = useCallback(() => {
    setSavedList([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { savedList, save, remove, clearAll };
}
