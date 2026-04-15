"use client";

import { useState, useRef } from "react";
import type { SavedCalc } from "@/lib/useCalcStorage";

interface SaveLoadBarProps {
  savedList: SavedCalc[];
  onSave: (name: string) => void;
  onLoad: (values: Record<string, string>) => void;
  onRemove: (name: string) => void;
  onClearAll: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  isLoggedIn?: boolean;
  syncing?: boolean;
}

export default function SaveLoadBar({
  savedList,
  onSave,
  onLoad,
  onRemove,
  onClearAll,
  onExport,
  onImport,
  isLoggedIn,
  syncing,
}: SaveLoadBarProps) {
  const [saveName, setSaveName] = useState("");
  const [showList, setShowList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const name =
      saveName.trim() || `Calc ${new Date().toLocaleString("en-MY")}`;
    onSave(name);
    setSaveName("");
  };

  return (
    <div className="mb-6 rounded-lg border border-stone-200 bg-white p-3">
      {/* Save row */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Calculation name..."
          className="flex-1 min-w-[140px] rounded-lg border border-stone-300 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={syncing}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {syncing ? "Saving..." : "Save"}
        </button>
        {savedList.length > 0 && (
          <button
            onClick={() => setShowList(!showList)}
            className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-200 transition-colors"
          >
            Load ({savedList.length})
          </button>
        )}
      </div>

      {/* Storage indicator */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isLoggedIn ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
              </svg>
              <span className="text-xs text-green-700">Saved to cloud — synced across devices</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-stone-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12" />
              </svg>
              <span className="text-xs text-stone-400">
                Saved to this browser only.{" "}
                <a href="/login" className="text-amber-600 hover:underline">Sign in</a> to sync across devices.
              </span>
            </>
          )}
        </div>

        {/* Export / Import buttons */}
        {savedList.length > 0 && onExport && (
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              className="text-xs text-stone-400 hover:text-amber-600 transition-colors"
              title="Export calculations as JSON"
            >
              Export
            </button>
            {onImport && (
              <>
                <span className="text-xs text-stone-300">|</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-stone-400 hover:text-amber-600 transition-colors"
                  title="Import calculations from JSON"
                >
                  Import
                </button>
              </>
            )}
          </div>
        )}
        {savedList.length === 0 && onImport && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-stone-400 hover:text-amber-600 transition-colors"
            title="Import calculations from JSON"
          >
            Import
          </button>
        )}
      </div>

      {/* Hidden file input for import */}
      {onImport && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />
      )}

      {/* Saved calculations list */}
      {showList && savedList.length > 0 && (
        <div className="mt-3 max-h-48 overflow-y-auto border-t border-stone-100 pt-3">
          {savedList.map((item) => (
            <div
              key={item.id || item.savedAt}
              className="flex items-center justify-between py-1.5 px-1 hover:bg-stone-50 rounded group"
            >
              <button
                onClick={() => {
                  onLoad(item.values);
                  setShowList(false);
                }}
                className="flex-1 text-left text-sm text-stone-700 hover:text-amber-700"
              >
                <span className="font-medium">{item.name}</span>
                <span className="ml-2 text-xs text-stone-400">
                  {new Date(item.savedAt).toLocaleDateString("en-MY", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </button>
              <button
                onClick={() => onRemove(item.name)}
                className="ml-2 text-xs text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              onClearAll();
              setShowList(false);
            }}
            className="mt-2 text-xs text-red-500 hover:text-red-700"
          >
            Clear all saved
          </button>
        </div>
      )}
    </div>
  );
}
