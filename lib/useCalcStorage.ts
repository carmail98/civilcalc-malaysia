"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface SavedCalc {
  id?: string; // Cloud ID (only for logged-in users)
  name: string;
  values: Record<string, string>;
  savedAt: string;
}

const STORAGE_PREFIX = "civilcalc_";

/**
 * Hook for saving/loading calculator state.
 * - Logged out: uses localStorage
 * - Logged in: syncs to cloud database
 */
export function useCalcStorage(calcId: string) {
  const storageKey = `${STORAGE_PREFIX}${calcId}`;
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [savedList, setSavedList] = useState<SavedCalc[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Load saved list on mount (and when auth state changes)
  useEffect(() => {
    if (isLoggedIn) {
      // Fetch from cloud
      fetch(`/api/saved-calcs?calcId=${encodeURIComponent(calcId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSavedList(
              data.map((d: { id: string; name: string; values: Record<string, string>; savedAt: string }) => ({
                id: d.id,
                name: d.name,
                values: d.values as Record<string, string>,
                savedAt: d.savedAt,
              }))
            );
          }
        })
        .catch(() => {});
    } else {
      // Load from localStorage
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) setSavedList(JSON.parse(raw));
      } catch {
        // ignore corrupt data
      }
    }
  }, [storageKey, calcId, isLoggedIn]);

  const save = useCallback(
    (name: string, values: Record<string, string>) => {
      const entryName = name || `Calc ${new Date().toLocaleString("en-MY")}`;

      if (isLoggedIn) {
        // Save to cloud
        setSyncing(true);
        fetch("/api/saved-calcs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ calcId, name: entryName, values }),
        })
          .then((r) => r.json())
          .then((data) => {
            const entry: SavedCalc = {
              id: data.id,
              name: entryName,
              values,
              savedAt: new Date().toISOString(),
            };
            setSavedList((prev) => [entry, ...prev.filter((s) => s.name !== entryName)]);
          })
          .catch(() => {})
          .finally(() => setSyncing(false));
      } else {
        // Save to localStorage
        const entry: SavedCalc = {
          name: entryName,
          values,
          savedAt: new Date().toISOString(),
        };
        setSavedList((prev) => {
          const next = [entry, ...prev.filter((s) => s.name !== entryName)].slice(0, 20);
          localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      }
    },
    [storageKey, calcId, isLoggedIn]
  );

  const remove = useCallback(
    (name: string) => {
      if (isLoggedIn) {
        const item = savedList.find((s) => s.name === name);
        if (item?.id) {
          fetch(`/api/saved-calcs?id=${item.id}`, { method: "DELETE" }).catch(() => {});
        }
      }
      setSavedList((prev) => {
        const next = prev.filter((s) => s.name !== name);
        if (!isLoggedIn) localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey, isLoggedIn, savedList]
  );

  const clearAll = useCallback(() => {
    if (isLoggedIn) {
      fetch(`/api/saved-calcs?all=true&calcId=${encodeURIComponent(calcId)}`, {
        method: "DELETE",
      }).catch(() => {});
    } else {
      localStorage.removeItem(storageKey);
    }
    setSavedList([]);
  }, [storageKey, calcId, isLoggedIn]);

  // Export all saved calculations as JSON
  const exportCalcs = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify({ calcId, exportedAt: new Date().toISOString(), calculations: savedList }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `civilcalc-${calcId}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [calcId, savedList]);

  // Import calculations from JSON file
  const importCalcs = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const calcs: SavedCalc[] = data.calculations || [];
          if (!Array.isArray(calcs) || calcs.length === 0) return;

          calcs.forEach((c) => {
            if (c.name && c.values) {
              save(c.name, c.values);
            }
          });
        } catch {
          // Invalid JSON
        }
      };
      reader.readAsText(file);
    },
    [save]
  );

  return { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing };
}
