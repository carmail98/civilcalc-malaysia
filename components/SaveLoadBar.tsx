"use client";

import { useState } from "react";
import type { SavedCalc } from "@/lib/useCalcStorage";

interface SaveLoadBarProps {
  savedList: SavedCalc[];
  onSave: (name: string) => void;
  onLoad: (values: Record<string, string>) => void;
  onRemove: (name: string) => void;
  onClearAll: () => void;
}

export default function SaveLoadBar({
  savedList,
  onSave,
  onLoad,
  onRemove,
  onClearAll,
}: SaveLoadBarProps) {
  const [saveName, setSaveName] = useState("");
  const [showList, setShowList] = useState(false);

  const handleSave = () => {
    const name =
      saveName.trim() || `Calc ${new Date().toLocaleString("en-MY")}`;
    onSave(name);
    setSaveName("");
  };

  return (
    <div className="mb-6 rounded-lg border border-stone-200 bg-white p-3">
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
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
        >
          Save
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

      {/* Saved calculations list */}
      {showList && savedList.length > 0 && (
        <div className="mt-3 max-h-48 overflow-y-auto border-t border-stone-100 pt-3">
          {savedList.map((item) => (
            <div
              key={item.savedAt}
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
